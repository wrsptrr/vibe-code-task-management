import { TaskItem } from "@/components/TaskItem"
import type { Task } from "@/types/task"

interface TaskListProps {
  tasks: Task[]
  hasAnyTask: boolean
  emptyMessage?: string
  onAdvance: (id: string) => void
  onRevert: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskList({
  tasks,
  hasAnyTask,
  emptyMessage = "Tidak ada tugas yang cocok",
  onAdvance,
  onRevert,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {hasAnyTask ? emptyMessage : "Belum ada tugas"}
      </p>
    )
  }

  return (
    <div className="grid gap-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onAdvance={onAdvance}
          onRevert={onRevert}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
