import type { Task } from "@/types/task"
import { filterTasks } from "@/utils/taskFilter"

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: "1",
    title: "Task",
    status: "todo",
    priority: "medium",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  }
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

const all = { query: "", status: "all", priority: "all" } as const

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
      query: "report",
      status: "todo",
      priority: "high",
    })
    expect(result.map((t) => t.id)).toEqual(["1"])
  })

  it("returns an empty list when nothing matches", () => {
    expect(filterTasks(tasks, { ...all, query: "zzz" })).toEqual([])
  })
})
