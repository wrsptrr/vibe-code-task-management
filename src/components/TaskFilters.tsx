import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TaskPriority, TaskStatus } from "@/types/task"
import {
  getNavigablePeriod,
  isCurrentPeriod,
  type DateRangeFilter,
  type TaskFilterOptions,
} from "@/utils/taskFilter"
import { formatPeriodLabel, shiftAnchor } from "@/utils/taskReport"
import {
  DATE_RANGE_LABELS,
  DATE_RANGE_OPTIONS,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "@/utils/taskLabels"

interface TaskFiltersProps {
  value: TaskFilterOptions
  onChange: (value: TaskFilterOptions) => void
  action?: ReactNode
}

export function TaskFilters({ value, onChange, action }: TaskFiltersProps) {
  const period = getNavigablePeriod(value.dateRange)

  function shift(delta: 1 | -1) {
    if (period) onChange({ ...value, anchor: shiftAnchor(period, value.anchor, delta) })
  }

  return (
    <div className="flex flex-col gap-2">
      {action && <div className="flex sm:justify-end">{action}</div>}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Cari tugas..."
          className="w-full sm:w-56"
          aria-label="Cari tugas"
          value={value.query}
          onChange={(event) => onChange({ ...value, query: event.target.value })}
        />
        <div className="contents sm:flex sm:items-center sm:gap-2">
          <Select
            value={value.status}
            onValueChange={(status) =>
              status && onChange({ ...value, status: status as TaskStatus | "all" })
            }
          >
            <SelectTrigger className="min-w-0 flex-1 sm:w-fit sm:min-w-32 sm:flex-none" aria-label="Filter status">
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
            <SelectTrigger className="min-w-0 flex-1 sm:w-fit sm:min-w-32 sm:flex-none" aria-label="Filter prioritas">
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
        <Select
          value={value.dateRange}
          onValueChange={(dateRange) =>
            dateRange &&
            onChange({ ...value, dateRange: dateRange as DateRangeFilter })
          }
        >
          <SelectTrigger className="min-w-0 flex-1 sm:w-fit sm:min-w-32 sm:flex-none" aria-label="Filter tanggal">
            <SelectValue>
              {(dateRange: DateRangeFilter) => DATE_RANGE_LABELS[dateRange]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {DATE_RANGE_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {period && (
          <div className="order-last flex w-full items-center justify-center gap-1 sm:order-none sm:w-auto">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Sebelumnya"
              onClick={() => shift(-1)}
            >
              <ChevronLeft />
            </Button>
            <span className="min-w-28 text-center text-sm font-medium whitespace-nowrap">
              {formatPeriodLabel(period, value.anchor)}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Berikutnya"
              onClick={() => shift(1)}
            >
              <ChevronRight />
            </Button>
            {!isCurrentPeriod(value.dateRange, value.anchor) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange({ ...value, anchor: new Date() })}
              >
                Hari ini
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
