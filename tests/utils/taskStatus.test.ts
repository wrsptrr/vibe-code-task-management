import type { Task } from "@/types/task"
import { withStatus } from "@/utils/taskStatus"

const NOW = "2026-06-15T10:00:00.000Z"

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

describe("withStatus", () => {
  it("sets completedAt when entering done", () => {
    const task = withStatus(makeTask({ status: "in_progress" }), "done", NOW)
    expect(task.status).toBe("done")
    expect(task.completedAt).toBe(NOW)
    expect(task.updatedAt).toBe(NOW)
  })

  it("clears completedAt when leaving done", () => {
    const done = makeTask({ status: "done", completedAt: "2026-02-01T00:00:00.000Z" })
    const task = withStatus(done, "in_progress", NOW)
    expect(task.completedAt).toBeUndefined()
    expect(task.updatedAt).toBe(NOW)
  })

  it("keeps completedAt when staying done", () => {
    const done = makeTask({ status: "done", completedAt: "2026-02-01T00:00:00.000Z" })
    expect(withStatus(done, "done", NOW).completedAt).toBe("2026-02-01T00:00:00.000Z")
  })

  it("falls back to the previous updatedAt for legacy done tasks", () => {
    const legacy = makeTask({ status: "done", updatedAt: "2026-03-01T00:00:00.000Z" })
    expect(withStatus(legacy, "done", NOW).completedAt).toBe("2026-03-01T00:00:00.000Z")
  })

  it("uses the pre-edit task to detect the transition", () => {
    const before = makeTask({ status: "todo" })
    const edited = { ...before, title: "Changed" }
    expect(withStatus(edited, "done", NOW, before).completedAt).toBe(NOW)
  })
})
