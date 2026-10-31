import { Badge } from "@/components/ui/badge"
import type { Task } from "@/types/task"
import {
  PRIORITY_LABELS,
  PRIORITY_STYLES,
} from "@/utils/taskLabels"
import { formatCompletedAt, getCompletedAt } from "@/utils/taskReport"

interface CompletedTaskListProps {
  tasks: Task[]
}

export function CompletedTaskList({ tasks }: CompletedTaskListProps) {
  if (tasks.length === 0) return null

  return (
    <ul className="grid gap-2">
      {tasks.map((task) => {
        const completedAt = getCompletedAt(task)
        return (
          <li
            key={task.id}
            className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm"
          >
            <span className="min-w-0 font-medium">{task.title}</span>
            <span className="flex shrink-0 items-center gap-2">
              <Badge variant="ghost" className={PRIORITY_STYLES[task.priority]}>
                {PRIORITY_LABELS[task.priority]}
              </Badge>
              {completedAt && (
                <span className="text-xs text-muted-foreground">
                  {formatCompletedAt(completedAt)}
                </span>
              )}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
