import { useCallback, useEffect, useState } from "react"
import { loadTasks, saveTasks } from "@/services/taskStorage"
import type { Task, TaskInput, TaskStatus } from "@/types/task"
import { withStatus } from "@/utils/taskStatus"

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  todo: "in_progress",
  in_progress: "done",
  done: "done",
}

const PREVIOUS_STATUS: Record<TaskStatus, TaskStatus> = {
  todo: "todo",
  in_progress: "todo",
  done: "in_progress",
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
      completedAt: input.status === "done" ? now : undefined,
    }
    setTasks((prev) => [task, ...prev])
  }, [])

  const updateTask = useCallback((id: string, patch: Partial<TaskInput>) => {
    const now = new Date().toISOString()
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? withStatus(
              {
                ...task,
                ...patch,
                title:
                  patch.title !== undefined ? patch.title.trim() : task.title,
              },
              patch.status ?? task.status,
              now,
              task,
            )
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
          ? withStatus(task, NEXT_STATUS[task.status], now)
          : task,
      ),
    )
  }, [])

  const revertStatus = useCallback((id: string) => {
    const now = new Date().toISOString()
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id && task.status !== "todo"
          ? withStatus(task, PREVIOUS_STATUS[task.status], now)
          : task,
      ),
    )
  }, [])

  return { tasks, addTask, updateTask, deleteTask, advanceStatus, revertStatus }
}
