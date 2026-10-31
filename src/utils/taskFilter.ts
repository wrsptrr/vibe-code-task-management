import type { Task, TaskPriority, TaskStatus } from "@/types/task"

export interface TaskFilterOptions {
  query: string
  status: TaskStatus | "all"
  priority: TaskPriority | "all"
}

export function filterTasks(
  tasks: Task[],
  { query, status, priority }: TaskFilterOptions,
): Task[] {
  const needle = query.trim().toLowerCase()
  return tasks.filter((task) => {
    if (status !== "all" && task.status !== status) return false
    if (priority !== "all" && task.priority !== priority) return false
    if (!needle) return true
    return (
      task.title.toLowerCase().includes(needle) ||
      (task.description ?? "").toLowerCase().includes(needle)
    )
  })
}
