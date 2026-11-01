import type { Task, TaskPriority, TaskStatus } from "@/types/task"
import { isOverdue, parseDueDate } from "@/utils/taskDate"
import { getPeriodRange, type ReportPeriod } from "@/utils/taskReport"

export type DateRangeFilter = "today" | "week" | "overdue" | "no_due" | "all"

export interface TaskFilterOptions {
  query: string
  dateRange: DateRangeFilter
  anchor: Date
  status: TaskStatus | "all"
  priority: TaskPriority | "all"
}

export function getNavigablePeriod(dateRange: DateRangeFilter): ReportPeriod | null {
  if (dateRange === "today") return "day"
  if (dateRange === "week") return "week"
  return null
}

export function isCurrentPeriod(
  dateRange: DateRangeFilter,
  anchor: Date,
  now: Date = new Date(),
): boolean {
  const period = getNavigablePeriod(dateRange)
  if (!period) return true
  return (
    getPeriodRange(period, anchor).start.getTime() ===
    getPeriodRange(period, now).start.getTime()
  )
}

function matchesDateRange(
  task: Task,
  dateRange: DateRangeFilter,
  anchor: Date,
  now: Date,
): boolean {
  if (dateRange === "all") return true
  if (dateRange === "no_due") return !task.dueDate
  if (dateRange === "overdue") return isOverdue(task, now)
  if (!task.dueDate) return false
  const period = getNavigablePeriod(dateRange)!
  const { start, end } = getPeriodRange(period, anchor)
  const due = parseDueDate(task.dueDate)
  return due >= start && due < end
}

export function filterTasks(
  tasks: Task[],
  { query, dateRange, anchor, status, priority }: TaskFilterOptions,
  now: Date = new Date(),
): Task[] {
  const needle = query.trim().toLowerCase()
  return tasks.filter((task) => {
    if (!matchesDateRange(task, dateRange, anchor, now)) return false
    if (status !== "all" && task.status !== status) return false
    if (priority !== "all" && task.priority !== priority) return false
    if (!needle) return true
    return (
      task.title.toLowerCase().includes(needle) ||
      (task.description ?? "").toLowerCase().includes(needle)
    )
  })
}
