import type { Task, TaskPriority } from "@/types/task"
import { hasDueTime, isOverdue, parseDueDate } from "@/utils/taskDate"

export type ReportPeriod = "day" | "week" | "month"

export interface ReportBucket {
  label: string
  todo: number
  in_progress: number
  done: number
}

export interface TaskReport {
  completed: Task[]
  total: number
  byPriority: Record<TaskPriority, number>
  buckets: ReportBucket[]
  openByStatus: { todo: number; in_progress: number }
  undatedOpen: number
  overdueOpen: number
}

const NO_TIME_LABEL = "Tanpa jam"
const WEEKDAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

// Monday = 0 … Sunday = 6
function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7
}

export function getCompletedAt(task: Task): string | undefined {
  if (task.status !== "done") return undefined
  return task.completedAt ?? task.updatedAt
}

export function getPeriodRange(
  period: ReportPeriod,
  anchor: Date,
): { start: Date; end: Date } {
  const year = anchor.getFullYear()
  const month = anchor.getMonth()
  const day = anchor.getDate()
  if (period === "day") {
    return { start: new Date(year, month, day), end: new Date(year, month, day + 1) }
  }
  if (period === "week") {
    const monday = day - weekdayIndex(anchor)
    return {
      start: new Date(year, month, monday),
      end: new Date(year, month, monday + 7),
    }
  }
  return { start: new Date(year, month, 1), end: new Date(year, month + 1, 1) }
}

export function shiftAnchor(
  period: ReportPeriod,
  anchor: Date,
  delta: 1 | -1,
): Date {
  const year = anchor.getFullYear()
  const month = anchor.getMonth()
  const day = anchor.getDate()
  if (period === "day") return new Date(year, month, day + delta)
  if (period === "week") return new Date(year, month, day + delta * 7)
  const target = new Date(year, month + delta, 1)
  const clampedDay = Math.min(
    day,
    daysInMonth(target.getFullYear(), target.getMonth()),
  )
  return new Date(target.getFullYear(), target.getMonth(), clampedDay)
}

export function formatPeriodLabel(period: ReportPeriod, anchor: Date): string {
  if (period === "day") {
    return anchor.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }
  if (period === "month") {
    return anchor.toLocaleDateString("id-ID", { month: "long", year: "numeric" })
  }
  const { start, end } = getPeriodRange("week", anchor)
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 1)
  const sameMonth =
    start.getMonth() === last.getMonth() &&
    start.getFullYear() === last.getFullYear()
  const startText = start.toLocaleDateString(
    "id-ID",
    sameMonth
      ? { day: "numeric" }
      : { day: "numeric", month: "short", year: "numeric" },
  )
  const endText = last.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  return `${startText} – ${endText}`
}

export function formatCompletedAt(completedAt: string): string {
  return new Date(completedAt).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function emptyBucket(label: string): ReportBucket {
  return { label, todo: 0, in_progress: 0, done: 0 }
}

function createBuckets(period: ReportPeriod, anchor: Date): ReportBucket[] {
  if (period === "day") {
    return Array.from({ length: 24 }, (_, hour) =>
      emptyBucket(String(hour).padStart(2, "0")),
    )
  }
  if (period === "week") {
    return WEEKDAY_LABELS.map((label) => emptyBucket(label))
  }
  const length = daysInMonth(anchor.getFullYear(), anchor.getMonth())
  return Array.from({ length }, (_, index) => emptyBucket(String(index + 1)))
}

function bucketIndex(period: ReportPeriod, date: Date): number {
  if (period === "day") return date.getHours()
  if (period === "week") return weekdayIndex(date)
  return date.getDate() - 1
}

function inRange(date: Date, start: Date, end: Date): boolean {
  const time = date.getTime()
  return !Number.isNaN(time) && time >= start.getTime() && time < end.getTime()
}

export function buildReport(
  tasks: Task[],
  period: ReportPeriod,
  anchor: Date,
  now: Date = new Date(),
): TaskReport {
  const { start, end } = getPeriodRange(period, anchor)
  const buckets = createBuckets(period, anchor)
  const byPriority: Record<TaskPriority, number> = { low: 0, medium: 0, high: 0 }
  const openByStatus = { todo: 0, in_progress: 0 }
  const completed: { task: Task; time: number }[] = []
  let undatedOpen = 0
  let noTimeBucket: ReportBucket | undefined

  for (const task of tasks) {
    if (task.status === "done") {
      const completedAt = getCompletedAt(task)
      if (!completedAt) continue
      const date = new Date(completedAt)
      if (!inRange(date, start, end)) continue
      completed.push({ task, time: date.getTime() })
      byPriority[task.priority] += 1
      buckets[bucketIndex(period, date)].done += 1
      continue
    }

    if (!task.dueDate) {
      undatedOpen += 1
      continue
    }
    const due = parseDueDate(task.dueDate)
    if (!inRange(due, start, end)) continue
    openByStatus[task.status] += 1
    if (period === "day" && !hasDueTime(task.dueDate)) {
      noTimeBucket ??= emptyBucket(NO_TIME_LABEL)
      noTimeBucket[task.status] += 1
    } else {
      buckets[bucketIndex(period, due)][task.status] += 1
    }
  }

  completed.sort((a, b) => b.time - a.time)
  if (noTimeBucket) buckets.push(noTimeBucket)

  return {
    completed: completed.map((entry) => entry.task),
    total: completed.length,
    byPriority,
    buckets,
    openByStatus,
    undatedOpen,
    overdueOpen: tasks.filter((task) => isOverdue(task, now)).length,
  }
}
