import type { Task } from "@/types/task"

function todayString(now: Date): string {
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
}

export function isOverdue(
  task: Pick<Task, "dueDate" | "status">,
  now: Date = new Date(),
): boolean {
  if (!task.dueDate || task.status === "done") return false
  return task.dueDate < todayString(now)
}

export function formatDueDate(dueDate: string): string {
  const [year, month, day] = dueDate.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
