import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { TaskReport } from "@/utils/taskReport"
import {
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  PRIORITY_STYLES,
} from "@/utils/taskLabels"

interface ReportSummaryProps {
  report: TaskReport
}

export function ReportSummary({ report }: ReportSummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Card size="sm">
        <CardContent className="grid gap-1">
          <p className="text-sm text-muted-foreground">Tugas selesai</p>
          <p className="text-3xl font-bold" data-testid="report-total">
            {report.total}
          </p>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardContent className="grid gap-2">
          <p className="text-sm text-muted-foreground">Per prioritas</p>
          <div className="flex flex-wrap gap-2">
            {PRIORITY_OPTIONS.map((priority) => (
              <Badge
                key={priority}
                variant="ghost"
                className={PRIORITY_STYLES[priority]}
              >
                {PRIORITY_LABELS[priority]}: {report.byPriority[priority]}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardContent className="grid gap-1">
          <p className="text-sm text-muted-foreground">
            Belum selesai & terlambat
          </p>
          <p className="text-3xl font-bold" data-testid="report-overdue">
            {report.overdueOpen}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
