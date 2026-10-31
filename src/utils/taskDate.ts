import type { Task } from "@/types/task"

const DATE_LENGTH = "YYYY-MM-DD".length

function pad(value: number): string {
  return String(value).padStart(2, "0")
}

function toDateString(now: Date): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function hasDueTime(dueDate: string): boolean {
  return dueDate.length > DATE_LENGTH
}

// Parses "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm" as local time (no UTC shift).
export function parseDueDate(dueDate: string): Date {
  const [datePart, timePart] = dueDate.split("T")
  const [year, month, day] = datePart.split("-").map(Number)
  if (!timePart) return new Date(year, month - 1, day)
  const [hour, minute] = timePart.split(":").map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

export function isOverdue(
  task: Pick<Task, "dueDate" | "status">,
  now: Date = new Date(),
): boolean {
  if (!task.dueDate || task.status === "done") return false
  if (hasDueTime(task.dueDate)) {
    return task.dueDate < `${toDateString(now)}T${pad(now.getHours())}:${pad(now.getMinutes())}`
  }
  return task.dueDate < toDateString(now)
}

export function formatDueDate(dueDate: string): string {
  const [datePart, timePart] = dueDate.split("T")
  const [year, month, day] = datePart.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  if (!timePart) return formattedDate
  return `${formattedDate}, ${timePart.slice(0, 5).replace(":", ".")}`
}

// datetime-local inputs reject date-only values, so legacy deadlines get midnight.
export function toDateTimeInputValue(dueDate: string | undefined): string {
  if (!dueDate) return ""
  return hasDueTime(dueDate) ? dueDate : `${dueDate}T00:00`
}
