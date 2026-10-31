import { useMemo, useState } from "react"
import { AppNav } from "@/components/AppNav"
import { CompletedTaskList } from "@/components/CompletedTaskList"
import { ReportPeriodTabs } from "@/components/ReportPeriodTabs"
import { ReportSummary } from "@/components/ReportSummary"
import { ThemeToggle } from "@/components/ThemeToggle"
import { StatusChart } from "@/components/StatusChart"
import { useTasks } from "@/hooks/useTasks"
import {
  buildReport,
  formatPeriodLabel,
  shiftAnchor,
  type ReportPeriod,
} from "@/utils/taskReport"

export function ReportPage() {
  const { tasks } = useTasks()
  const [period, setPeriod] = useState<ReportPeriod>("week")
  const [anchor, setAnchor] = useState(() => new Date())

  const report = useMemo(
    () => buildReport(tasks, period, anchor),
    [tasks, period, anchor],
  )

  const hasData =
    report.total + report.openByStatus.todo + report.openByStatus.in_progress > 0

  return (
    <main className="mx-auto grid max-w-3xl gap-4 p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Report</h1>
        <div className="flex items-center gap-1">
          <AppNav />
          <ThemeToggle />
        </div>
      </div>
      <ReportPeriodTabs
        period={period}
        label={formatPeriodLabel(period, anchor)}
        onPeriodChange={setPeriod}
        onPrevious={() => setAnchor(shiftAnchor(period, anchor, -1))}
        onNext={() => setAnchor(shiftAnchor(period, anchor, 1))}
        onToday={() => setAnchor(new Date())}
      />
      <ReportSummary report={report} />
      <StatusChart
        buckets={report.buckets}
        hasData={hasData}
        undatedOpen={report.undatedOpen}
      />
      <CompletedTaskList tasks={report.completed} />
    </main>
  )
}
