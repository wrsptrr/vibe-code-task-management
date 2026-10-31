import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Task, TaskInput, TaskPriority, TaskStatus } from "@/types/task"
import {
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "@/utils/taskLabels"

interface TaskFormProps {
  task?: Task
  onSubmit: (input: TaskInput) => void
  onCancel: () => void
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "")
  const [description, setDescription] = useState(task?.description ?? "")
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo")
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? "medium",
  )
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "")
  const [error, setError] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) {
      setError("Judul wajib diisi")
      return
    }
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dueDate || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="task-title">Judul</Label>
        <Input
          id="task-title"
          value={title}
          aria-invalid={error ? true : undefined}
          onChange={(event) => {
            setTitle(event.target.value)
            setError("")
          }}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="task-description">Deskripsi</Label>
        <Textarea
          id="task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={(value) => value && setStatus(value as TaskStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value: TaskStatus) => STATUS_LABELS[value]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {STATUS_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Prioritas</Label>
          <Select
            value={priority}
            onValueChange={(value) =>
              value && setPriority(value as TaskPriority)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value: TaskPriority) => PRIORITY_LABELS[value]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {PRIORITY_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="task-due-date">Deadline</Label>
        <Input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  )
}
