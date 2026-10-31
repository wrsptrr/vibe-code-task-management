import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TaskPriority, TaskStatus } from "@/types/task"
import type { TaskFilterOptions } from "@/utils/taskFilter"
import {
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "@/utils/taskLabels"

interface TaskFiltersProps {
  value: TaskFilterOptions
  onChange: (value: TaskFilterOptions) => void
}

export function TaskFilters({ value, onChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Input
        placeholder="Cari tugas..."
        aria-label="Cari tugas"
        value={value.query}
        onChange={(event) => onChange({ ...value, query: event.target.value })}
      />
      <Select
        value={value.status}
        onValueChange={(status) =>
          status && onChange({ ...value, status: status as TaskStatus | "all" })
        }
      >
        <SelectTrigger className="sm:w-40" aria-label="Filter status">
          <SelectValue>
            {(status: TaskStatus | "all") =>
              status === "all" ? "Semua status" : STATUS_LABELS[status]
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua status</SelectItem>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {STATUS_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={value.priority}
        onValueChange={(priority) =>
          priority &&
          onChange({ ...value, priority: priority as TaskPriority | "all" })
        }
      >
        <SelectTrigger className="sm:w-40" aria-label="Filter prioritas">
          <SelectValue>
            {(priority: TaskPriority | "all") =>
              priority === "all" ? "Semua prioritas" : PRIORITY_LABELS[priority]
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua prioritas</SelectItem>
          {PRIORITY_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {PRIORITY_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
