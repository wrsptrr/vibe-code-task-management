import { act, renderHook } from "@testing-library/react"
import { useTasks } from "@/hooks/useTasks"
import { loadTasks } from "@/services/taskStorage"

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers({ toFake: ["Date"] })
  vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"))
})

afterEach(() => vi.useRealTimers())

function setup() {
  return renderHook(() => useTasks())
}

describe("useTasks", () => {
  it("adds a task with generated fields and a trimmed title", () => {
    const { result } = setup()
    act(() =>
      result.current.addTask({ title: "  Hello ", status: "todo", priority: "low" }),
    )
    const [task] = result.current.tasks
    expect(task.title).toBe("Hello")
    expect(task.id).toBeTruthy()
    expect(task.createdAt).toBe("2026-01-01T00:00:00.000Z")
    expect(task.updatedAt).toBe(task.createdAt)
  })

  it("updates a task and refreshes updatedAt", () => {
    const { result } = setup()
    act(() =>
      result.current.addTask({ title: "A", status: "todo", priority: "low" }),
    )
    const id = result.current.tasks[0].id
    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"))
    act(() => result.current.updateTask(id, { title: " B ", priority: "high" }))
    const task = result.current.tasks[0]
    expect(task.title).toBe("B")
    expect(task.priority).toBe("high")
    expect(task.updatedAt).toBe("2026-01-02T00:00:00.000Z")
    expect(task.createdAt).toBe("2026-01-01T00:00:00.000Z")
  })

  it("deletes a task", () => {
    const { result } = setup()
    act(() =>
      result.current.addTask({ title: "A", status: "todo", priority: "low" }),
    )
    act(() => result.current.deleteTask(result.current.tasks[0].id))
    expect(result.current.tasks).toEqual([])
  })

  it("advances status todo → in_progress → done and stops at done", () => {
    const { result } = setup()
    act(() =>
      result.current.addTask({ title: "A", status: "todo", priority: "low" }),
    )
    const id = result.current.tasks[0].id
    act(() => result.current.advanceStatus(id))
    expect(result.current.tasks[0].status).toBe("in_progress")
    act(() => result.current.advanceStatus(id))
    expect(result.current.tasks[0].status).toBe("done")
    act(() => result.current.advanceStatus(id))
    expect(result.current.tasks[0].status).toBe("done")
  })

  it("persists tasks to localStorage and restores them", () => {
    const first = setup()
    act(() =>
      first.result.current.addTask({ title: "A", status: "todo", priority: "low" }),
    )
    expect(loadTasks()).toHaveLength(1)
    first.unmount()
    const second = setup()
    expect(second.result.current.tasks[0].title).toBe("A")
  })
})
