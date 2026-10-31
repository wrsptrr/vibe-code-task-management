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

const BADGE_BASE = "border-transparent"

export const STATUS_STYLES: Record<TaskStatus, string> = {
  todo: `${BADGE_BASE} bg-slate-100 text-slate-700 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-500/20 dark:text-slate-300 dark:hover:bg-slate-500/20 dark:hover:text-slate-300`,
  in_progress: `${BADGE_BASE} bg-blue-100 text-blue-700 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-500/20 dark:hover:text-blue-300`,
  done: `${BADGE_BASE} bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700 dark:bg-green-500/20 dark:text-green-300 dark:hover:bg-green-500/20 dark:hover:text-green-300`,
}

export const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: `${BADGE_BASE} bg-emerald-100 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-300`,
  medium: `${BADGE_BASE} bg-amber-100 text-amber-700 hover:bg-amber-100 hover:text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/20 dark:hover:text-amber-300`,
  high: `${BADGE_BASE} bg-red-100 text-red-700 hover:bg-red-100 hover:text-red-700 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/20 dark:hover:text-red-300`,
}
