import type { Task, TaskStatus } from "@/types/task"

// Returns the task with the new status, refreshing updatedAt and keeping
// completedAt in sync: set when entering "done", cleared when leaving it.
// `previous` is the task before any edits, used to detect the transition.
export function withStatus(
  task: Task,
  status: TaskStatus,
  now: string,
  previous: Task = task,
): Task {
  if (status !== "done") {
    return { ...task, status, updatedAt: now, completedAt: undefined }
  }
  const completedAt =
    previous.status === "done"
      ? (previous.completedAt ?? previous.updatedAt)
      : now
  return { ...task, status, updatedAt: now, completedAt }
}
