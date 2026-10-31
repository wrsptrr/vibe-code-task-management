import { ArrowRight, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Task } from "@/types/task"
import { formatDueDate, isOverdue } from "@/utils/taskDate"
import {
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  STATUS_LABELS,
  STATUS_STYLES,
} from "@/utils/taskLabels"

interface TaskItemProps {
  task: Task
  onAdvance: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskItem({ task, onAdvance, onEdit, onDelete }: TaskItemProps) {
  const overdue = isOverdue(task)

  return (
    <Card size="sm">
      <CardContent className="flex items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1.5">
          <p
            className={
              task.status === "done"
                ? "font-medium line-through text-muted-foreground"
                : "font-medium"
            }
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="ghost" className={STATUS_STYLES[task.status]}>
              {STATUS_LABELS[task.status]}
            </Badge>
            <Badge variant="ghost" className={PRIORITY_STYLES[task.priority]}>
              {PRIORITY_LABELS[task.priority]}
            </Badge>
            {task.dueDate && (
              <span
                className={
                  overdue
                    ? "text-xs text-destructive"
                    : "text-xs text-muted-foreground"
                }
              >
                {overdue ? "Terlambat · " : ""}
                {formatDueDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          {task.status !== "done" && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Maju ke status berikutnya"
              onClick={() => onAdvance(task.id)}
            >
              <ArrowRight />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Edit tugas"
            onClick={() => onEdit(task)}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Hapus tugas"
            onClick={() => onDelete(task)}
          >
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
