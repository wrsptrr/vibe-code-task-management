export type TaskStatus = "todo" | "in_progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export type TaskInput = Pick<
  Task,
  "title" | "description" | "status" | "priority" | "dueDate"
>
