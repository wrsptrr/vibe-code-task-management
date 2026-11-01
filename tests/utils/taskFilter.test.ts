import type { Task } from "@/types/task"
import { filterTasks, isCurrentPeriod } from "@/utils/taskFilter"

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: "1",
    title: "Task",
    status: "todo",
    priority: "medium",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  } as Task
}

const tasks = [
  makeTask({ id: "1", title: "Write Report", priority: "high" }),
  makeTask({
    id: "2",
    title: "Buy milk",
    description: "for the REPORT party",
    status: "in_progress",
    priority: "low",
  }),
  makeTask({ id: "3", title: "Call mom", status: "done", priority: "high" }),
]

const all = {
  query: "",
  dateRange: "all",
  anchor: new Date(2026, 5, 17, 10, 0),
  status: "all",
  priority: "all",
} as const

describe("filterTasks", () => {
  it("returns every task when no filter is set", () => {
    expect(filterTasks(tasks, all)).toHaveLength(3)
  })

  it("searches title and description case-insensitively", () => {
    const result = filterTasks(tasks, { ...all, query: "report" })
    expect(result.map((t) => t.id)).toEqual(["1", "2"])
  })

  it("ignores surrounding whitespace in the query", () => {
    expect(filterTasks(tasks, { ...all, query: "  mom " })).toHaveLength(1)
  })

  it("filters by status", () => {
    const result = filterTasks(tasks, { ...all, status: "done" })
    expect(result.map((t) => t.id)).toEqual(["3"])
  })

  it("filters by priority", () => {
    const result = filterTasks(tasks, { ...all, priority: "high" })
    expect(result.map((t) => t.id)).toEqual(["1", "3"])
  })

  it("combines query, status, and priority", () => {
    const result = filterTasks(tasks, {
      ...all,
      query: "report",
      status: "todo",
      priority: "high",
    })
    expect(result.map((t) => t.id)).toEqual(["1"])
  })

  it("returns an empty list when nothing matches", () => {
    expect(filterTasks(tasks, { ...all, query: "zzz" })).toEqual([])
  })

  describe("date range", () => {
    // Wednesday 2026-06-17, 10:00 local time.
    const now = new Date(2026, 5, 17, 10, 0)
    const dated = [
      makeTask({ id: "yesterday", dueDate: "2026-06-16" }),
      makeTask({ id: "today-date", dueDate: "2026-06-17" }),
      makeTask({ id: "today-start", dueDate: "2026-06-17T00:00" }),
      makeTask({ id: "today-end", dueDate: "2026-06-17T23:59" }),
      makeTask({ id: "tomorrow", dueDate: "2026-06-18" }),
      makeTask({ id: "monday", dueDate: "2026-06-15" }),
      makeTask({ id: "sunday", dueDate: "2026-06-21T23:59" }),
      makeTask({ id: "next-monday", dueDate: "2026-06-22" }),
      makeTask({ id: "last-sunday", dueDate: "2026-06-14" }),
      makeTask({ id: "late-done", dueDate: "2026-06-10", status: "done" }),
      makeTask({ id: "late-open", dueDate: "2026-06-10" }),
      makeTask({ id: "no-due" }),
    ]
    const ids = (dateRange: "today" | "week" | "overdue" | "no_due" | "all") =>
      filterTasks(dated, { ...all, dateRange }, now).map((t) => t.id)

    it("keeps only tasks due today", () => {
      expect(ids("today")).toEqual(["today-date", "today-start", "today-end"])
    })

    it("keeps tasks due this week, Monday to Sunday", () => {
      expect(ids("week")).toEqual([
        "yesterday",
        "today-date",
        "today-start",
        "today-end",
        "tomorrow",
        "monday",
        "sunday",
      ])
    })

    it("keeps open tasks past their deadline", () => {
      expect(ids("overdue")).toEqual([
        "yesterday",
        "today-start",
        "monday",
        "last-sunday",
        "late-open",
      ])
    })

    it("keeps tasks without a deadline", () => {
      expect(ids("no_due")).toEqual(["no-due"])
    })

    it("keeps every task for all dates", () => {
      expect(ids("all")).toHaveLength(dated.length)
    })

    it("follows the anchor for the day and week ranges", () => {
      const at = (dateRange: "today" | "week", anchor: Date) =>
        filterTasks(dated, { ...all, dateRange, anchor }, now).map((t) => t.id)
      expect(at("today", new Date(2026, 5, 18))).toEqual(["tomorrow"])
      expect(at("week", new Date(2026, 5, 24))).toEqual(["next-monday"])
      expect(at("week", new Date(2026, 5, 10))).toEqual(["last-sunday", "late-done", "late-open"])
    })

    it("does not apply the anchor to overdue", () => {
      const result = filterTasks(
        dated,
        { ...all, dateRange: "overdue", anchor: new Date(2026, 0, 1) },
        now,
      )
      expect(result.map((t) => t.id)).toEqual(ids("overdue"))
    })

    it("combines with the other filters", () => {
      const result = filterTasks(
        [
          makeTask({ id: "a", dueDate: "2026-06-17", priority: "high" }),
          makeTask({ id: "b", dueDate: "2026-06-17", priority: "low" }),
        ],
        { ...all, dateRange: "today", priority: "high" },
        now,
      )
      expect(result.map((t) => t.id)).toEqual(["a"])
    })
  })
})

describe("isCurrentPeriod", () => {
  const now = new Date(2026, 5, 17, 10, 0)

  it("is true for the same day or week", () => {
    expect(isCurrentPeriod("today", new Date(2026, 5, 17, 23, 0), now)).toBe(true)
    expect(isCurrentPeriod("week", new Date(2026, 5, 21), now)).toBe(true)
  })

  it("is false for another day or week", () => {
    expect(isCurrentPeriod("today", new Date(2026, 5, 18), now)).toBe(false)
    expect(isCurrentPeriod("week", new Date(2026, 5, 22), now)).toBe(false)
  })

  it("is true for ranges without navigation", () => {
    expect(isCurrentPeriod("all", new Date(2020, 0, 1), now)).toBe(true)
  })
})
