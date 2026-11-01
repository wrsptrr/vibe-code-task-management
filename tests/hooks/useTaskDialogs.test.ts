import { act, renderHook } from "@testing-library/react"
import { useTaskDialogs } from "@/hooks/useTaskDialogs"
import type { Task, TaskInput } from "@/types/task"

const task: Task = {
  id: "t1",
  title: "Task",
  description: "Desc",
  status: "todo",
  priority: "low",
  dueDate: "2026-06-30",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

const input: TaskInput = {
  title: "New",
  description: "Desc",
  status: "todo",
  priority: "high",
  dueDate: "2026-07-01",
}

function setup() {
  const handlers = {
    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  }
  const hook = renderHook(() => useTaskDialogs(handlers))
  return { ...hook, handlers }
}

describe("useTaskDialogs", () => {
  it("opens the form for creating with no editing task", () => {
    const { result } = setup()
    act(() => result.current.openCreate())
    expect(result.current.formOpen).toBe(true)
    expect(result.current.editingTask).toBeNull()
  })

  it("opens the form for editing the selected task", () => {
    const { result } = setup()
    act(() => result.current.openEdit(task))
    expect(result.current.formOpen).toBe(true)
    expect(result.current.editingTask).toBe(task)
  })

  it("adds a task on submit when creating, then closes the form", () => {
    const { result, handlers } = setup()
    act(() => result.current.openCreate())
    act(() => result.current.submitForm(input))
    expect(handlers.addTask).toHaveBeenCalledWith(input)
    expect(handlers.updateTask).not.toHaveBeenCalled()
    expect(result.current.formOpen).toBe(false)
  })

  it("updates the task on submit when editing, then closes the form", () => {
    const { result, handlers } = setup()
    act(() => result.current.openEdit(task))
    act(() => result.current.submitForm(input))
    expect(handlers.updateTask).toHaveBeenCalledWith("t1", input)
    expect(handlers.addTask).not.toHaveBeenCalled()
    expect(result.current.formOpen).toBe(false)
  })

  it("clears the editing task when opening create after edit", () => {
    const { result } = setup()
    act(() => result.current.openEdit(task))
    act(() => result.current.openCreate())
    expect(result.current.editingTask).toBeNull()
  })

  it("requests and confirms deletion", () => {
    const { result, handlers } = setup()
    act(() => result.current.requestDelete(task))
    expect(result.current.deletingTask).toBe(task)
    act(() => result.current.confirmDelete(task))
    expect(handlers.deleteTask).toHaveBeenCalledWith("t1")
    expect(result.current.deletingTask).toBeNull()
  })

  it("cancels deletion without deleting", () => {
    const { result, handlers } = setup()
    act(() => result.current.requestDelete(task))
    act(() => result.current.cancelDelete())
    expect(handlers.deleteTask).not.toHaveBeenCalled()
    expect(result.current.deletingTask).toBeNull()
  })
})
