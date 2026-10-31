import type { TaskPriority, TaskStatus } from "@/types/task"

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

export const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as TaskStatus[]
export const PRIORITY_OPTIONS = Object.keys(PRIORITY_LABELS) as TaskPriority[]
