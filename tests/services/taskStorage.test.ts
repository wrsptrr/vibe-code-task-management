import { loadTasks, saveTasks, TASKS_STORAGE_KEY } from "@/services/taskStorage"
import type { Task } from "@/types/task"

const task: Task = {
  id: "1",
  title: "Task",
  description: "Desc",
  dueDate: "2026-06-30",
  status: "todo",
  priority: "low",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

beforeEach(() => localStorage.clear())

describe("taskStorage", () => {
  it("returns an empty list when nothing is stored", () => {
    expect(loadTasks()).toEqual([])
  })

  it("round-trips saved tasks", () => {
    saveTasks([task])
    expect(loadTasks()).toEqual([task])
  })

  it("returns an empty list for corrupted JSON", () => {
    localStorage.setItem(TASKS_STORAGE_KEY, "{not json")
    expect(loadTasks()).toEqual([])
  })

  it("returns an empty list when the stored value is not an array", () => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify({ a: 1 }))
    expect(loadTasks()).toEqual([])
  })
})
