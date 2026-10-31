import type { Task } from "@/types/task"
import {
  buildReport,
  formatPeriodLabel,
  getCompletedAt,
  getPeriodRange,
  shiftAnchor,
} from "@/utils/taskReport"

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: "1",
    title: "Task",
    status: "done",
    priority: "medium",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  }
}

// Local-time ISO strings keep these tests independent of the machine timezone.
function local(year: number, month: number, day: number, hour = 12, minute = 0) {
  return new Date(year, month - 1, day, hour, minute).toISOString()
}

describe("getPeriodRange", () => {
  it("covers a single day", () => {
    const { start, end } = getPeriodRange("day", new Date(2026, 5, 15, 18))
    expect(start).toEqual(new Date(2026, 5, 15))
    expect(end).toEqual(new Date(2026, 5, 16))
  })

  it("starts the week on Monday", () => {
    // 2026-06-17 is a Wednesday
    const { start, end } = getPeriodRange("week", new Date(2026, 5, 17))
    expect(start).toEqual(new Date(2026, 5, 15))
    expect(end).toEqual(new Date(2026, 5, 22))
  })

  it("treats Sunday as the last day of the week", () => {
    const { start } = getPeriodRange("week", new Date(2026, 5, 21))
    expect(start).toEqual(new Date(2026, 5, 15))
  })

  it("spans a week across a year boundary", () => {
    // 2026-01-01 is a Thursday
    const { start, end } = getPeriodRange("week", new Date(2026, 0, 1))
    expect(start).toEqual(new Date(2025, 11, 29))
    expect(end).toEqual(new Date(2026, 0, 5))
  })

  it("covers a whole month", () => {
    const { start, end } = getPeriodRange("month", new Date(2026, 5, 15))
    expect(start).toEqual(new Date(2026, 5, 1))
    expect(end).toEqual(new Date(2026, 6, 1))
  })

  it("handles leap-year February", () => {
    const { start, end } = getPeriodRange("month", new Date(2028, 1, 10))
    expect((end.getTime() - start.getTime()) / 86400000).toBeCloseTo(29, 0)
  })
})

describe("shiftAnchor", () => {
  it("moves by one day", () => {
    expect(shiftAnchor("day", new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 1))
  })

  it("moves by seven days for weeks", () => {
    expect(shiftAnchor("week", new Date(2026, 5, 15), -1)).toEqual(new Date(2026, 5, 8))
  })

  it("clamps the day when the next month is shorter", () => {
    expect(shiftAnchor("month", new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 28))
  })

  it("moves back across a year boundary", () => {
    expect(shiftAnchor("month", new Date(2026, 0, 15), -1)).toEqual(new Date(2025, 11, 15))
  })
})

describe("formatPeriodLabel", () => {
  it("formats a day", () => {
    const label = formatPeriodLabel("day", new Date(2026, 5, 15))
    expect(label).toContain("15")
    expect(label).toContain("2026")
  })

  it("formats a week as a range", () => {
    const label = formatPeriodLabel("week", new Date(2026, 5, 17))
    expect(label).toMatch(/^15 – 21 /)
    expect(label).toContain("2026")
  })

  it("includes both months when the week spans two", () => {
    const label = formatPeriodLabel("week", new Date(2026, 5, 30))
    expect(label).toMatch(/^29 .+ – 5 .+ 2026$/)
  })

  it("formats a month", () => {
    const label = formatPeriodLabel("month", new Date(2026, 5, 15))
    expect(label).toContain("2026")
    expect(label.toLowerCase()).toContain("juni")
  })
})

describe("getCompletedAt", () => {
  it("returns completedAt for done tasks", () => {
    expect(getCompletedAt(makeTask({ completedAt: "x" }))).toBe("x")
  })

  it("falls back to updatedAt for legacy done tasks", () => {
    expect(getCompletedAt(makeTask({ updatedAt: "y" }))).toBe("y")
  })

  it("is undefined for tasks that are not done", () => {
    expect(getCompletedAt(makeTask({ status: "todo", completedAt: "x" }))).toBeUndefined()
  })
})

describe("buildReport", () => {
  const now = new Date(2026, 5, 17, 12)
  const anchor = new Date(2026, 5, 17)

  it("counts only done tasks completed inside the period", () => {
    const tasks = [
      makeTask({ id: "in", completedAt: local(2026, 6, 16) }),
      makeTask({ id: "before", completedAt: local(2026, 6, 14) }),
      makeTask({ id: "after", completedAt: local(2026, 6, 22) }),
      makeTask({ id: "open", status: "todo" }),
    ]
    const report = buildReport(tasks, "week", anchor, now)
    expect(report.completed.map((t) => t.id)).toEqual(["in"])
    expect(report.total).toBe(1)
  })

  it("includes the start boundary and excludes the end boundary", () => {
    const tasks = [
      makeTask({ id: "start", completedAt: local(2026, 6, 15, 0, 0) }),
      makeTask({ id: "end", completedAt: local(2026, 6, 22, 0, 0) }),
    ]
    const report = buildReport(tasks, "week", anchor, now)
    expect(report.completed.map((t) => t.id)).toEqual(["start"])
  })

  it("uses updatedAt for legacy done tasks", () => {
    const tasks = [makeTask({ updatedAt: local(2026, 6, 16) })]
    expect(buildReport(tasks, "week", anchor, now).total).toBe(1)
  })

  it("creates 24 hourly buckets for a day", () => {
    const tasks = [makeTask({ completedAt: local(2026, 6, 17, 14, 30) })]
    const { buckets } = buildReport(tasks, "day", anchor, now)
    expect(buckets).toHaveLength(24)
    expect(buckets[14]).toEqual({ label: "14", todo: 0, in_progress: 0, done: 1 })
  })

  it("creates 7 weekday buckets starting Monday", () => {
    const tasks = [
      makeTask({ id: "a", completedAt: local(2026, 6, 15) }),
      makeTask({ id: "b", completedAt: local(2026, 6, 21) }),
    ]
    const { buckets } = buildReport(tasks, "week", anchor, now)
    expect(buckets.map((b) => b.label)).toEqual(["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"])
    expect(buckets[0].done).toBe(1)
    expect(buckets[6].done).toBe(1)
  })

  it("creates one bucket per day of the month", () => {
    expect(buildReport([], "month", new Date(2026, 5, 1), now).buckets).toHaveLength(30)
    expect(buildReport([], "month", new Date(2028, 1, 1), now).buckets).toHaveLength(29)
  })

  it("counts completed tasks by priority", () => {
    const tasks = [
      makeTask({ id: "a", priority: "high", completedAt: local(2026, 6, 16) }),
      makeTask({ id: "b", priority: "high", completedAt: local(2026, 6, 16) }),
      makeTask({ id: "c", priority: "low", completedAt: local(2026, 6, 16) }),
    ]
    expect(buildReport(tasks, "week", anchor, now).byPriority).toEqual({
      low: 1,
      medium: 0,
      high: 2,
    })
  })

  it("orders completed tasks by newest first", () => {
    const tasks = [
      makeTask({ id: "old", completedAt: local(2026, 6, 15) }),
      makeTask({ id: "new", completedAt: local(2026, 6, 19) }),
    ]
    expect(buildReport(tasks, "week", anchor, now).completed.map((t) => t.id)).toEqual([
      "new",
      "old",
    ])
  })

  it("counts open overdue tasks regardless of the period", () => {
    const tasks = [
      makeTask({ id: "late", status: "todo", dueDate: "2026-06-01" }),
      makeTask({ id: "fine", status: "todo", dueDate: "2026-07-01" }),
      makeTask({ id: "done", dueDate: "2026-06-01" }),
    ]
    expect(buildReport(tasks, "day", anchor, now).overdueOpen).toBe(1)
  })
})

describe("buildReport open statuses by deadline", () => {
  const now = new Date(2026, 5, 17, 12)
  const anchor = new Date(2026, 5, 17)

  it("buckets todo and in_progress tasks by dueDate within the period", () => {
    const tasks = [
      makeTask({ id: "a", status: "todo", dueDate: "2026-06-15" }),
      makeTask({ id: "b", status: "in_progress", dueDate: "2026-06-15" }),
      makeTask({ id: "c", status: "todo", dueDate: "2026-06-21" }),
    ]
    const report = buildReport(tasks, "week", anchor, now)
    expect(report.buckets[0]).toMatchObject({ todo: 1, in_progress: 1, done: 0 })
    expect(report.buckets[6]).toMatchObject({ todo: 1 })
    expect(report.openByStatus).toEqual({ todo: 2, in_progress: 1 })
  })

  it("includes the start boundary and excludes the end boundary", () => {
    const tasks = [
      makeTask({ id: "start", status: "todo", dueDate: "2026-06-15" }),
      makeTask({ id: "end", status: "todo", dueDate: "2026-06-22" }),
    ]
    expect(buildReport(tasks, "week", anchor, now).openByStatus.todo).toBe(1)
  })

  it("ignores the dueDate of done tasks", () => {
    const tasks = [
      makeTask({ status: "done", dueDate: "2026-06-16", completedAt: local(2026, 5, 1) }),
    ]
    const report = buildReport(tasks, "week", anchor, now)
    expect(report.openByStatus).toEqual({ todo: 0, in_progress: 0 })
    expect(report.buckets.every((b) => b.done === 0)).toBe(true)
  })

  it("places deadlines with a time in the matching hour on the day view", () => {
    const tasks = [makeTask({ status: "todo", dueDate: "2026-06-17T09:30" })]
    const { buckets } = buildReport(tasks, "day", anchor, now)
    expect(buckets).toHaveLength(24)
    expect(buckets[9].todo).toBe(1)
  })

  it("adds a no-time bucket on the day view only when needed", () => {
    const tasks = [makeTask({ status: "in_progress", dueDate: "2026-06-17" })]
    const { buckets } = buildReport(tasks, "day", anchor, now)
    expect(buckets).toHaveLength(25)
    expect(buckets[24]).toEqual({ label: "Tanpa jam", todo: 0, in_progress: 1, done: 0 })
  })

  it("keeps date-only deadlines in their day bucket on the week view", () => {
    const tasks = [makeTask({ status: "todo", dueDate: "2026-06-17" })]
    const { buckets } = buildReport(tasks, "week", anchor, now)
    expect(buckets).toHaveLength(7)
    expect(buckets[2].todo).toBe(1)
  })

  it("counts open tasks without a deadline separately", () => {
    const tasks = [
      makeTask({ id: "a", status: "todo" }),
      makeTask({ id: "b", status: "in_progress" }),
      makeTask({ id: "c", status: "done", completedAt: local(2026, 6, 16) }),
    ]
    const report = buildReport(tasks, "week", anchor, now)
    expect(report.undatedOpen).toBe(2)
    expect(report.openByStatus).toEqual({ todo: 0, in_progress: 0 })
  })
})
