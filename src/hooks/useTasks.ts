import { useCallback, useEffect, useState } from "react"
import { loadTasks, saveTasks } from "@/services/taskStorage"
import type { Task, TaskInput, TaskStatus } from "@/types/task"

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  todo: "in_progress",
  in_progress: "done",
  done: "done",
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback((input: TaskInput) => {
    const now = new Date().toISOString()
    const task: Task = {
      ...input,
      title: input.title.trim(),
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    setTasks((prev) => [task, ...prev])
  }, [])

  const updateTask = useCallback((id: string, patch: Partial<TaskInput>) => {
    const now = new Date().toISOString()
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...patch,
              title: patch.title !== undefined ? patch.title.trim() : task.title,
              updatedAt: now,
            }
          : task,
      ),
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [])

  const advanceStatus = useCallback((id: string) => {
    const now = new Date().toISOString()
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id && task.status !== "done"
          ? { ...task, status: NEXT_STATUS[task.status], updatedAt: now }
          : task,
      ),
    )
  }, [])

  return { tasks, addTask, updateTask, deleteTask, advanceStatus }
}
