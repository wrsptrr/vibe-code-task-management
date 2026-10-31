import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ReportPeriod } from "@/utils/taskReport"

interface ReportPeriodTabsProps {
  period: ReportPeriod
  label: string
  onPeriodChange: (period: ReportPeriod) => void
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

export function ReportPeriodTabs({
  period,
  label,
  onPeriodChange,
  onPrevious,
  onNext,
  onToday,
}: ReportPeriodTabsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Tabs
        value={period}
        onValueChange={(value) => onPeriodChange(value as ReportPeriod)}
      >
        <TabsList>
          <TabsTrigger value="day">Hari</TabsTrigger>
          <TabsTrigger value="week">Minggu</TabsTrigger>
          <TabsTrigger value="month">Bulan</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Periode sebelumnya"
          onClick={onPrevious}
        >
          <ChevronLeft />
        </Button>
        <span className="min-w-36 text-center text-sm font-medium">{label}</span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Periode berikutnya"
          onClick={onNext}
        >
          <ChevronRight />
        </Button>
        <Button variant="ghost" size="sm" onClick={onToday}>
          Hari ini
        </Button>
      </div>
    </div>
  )
}
