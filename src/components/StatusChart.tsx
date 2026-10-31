import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { STATUS_COLORS, STATUS_LABELS } from "@/utils/taskLabels"
import type { ReportBucket } from "@/utils/taskReport"

const chartConfig = {
  todo: { label: STATUS_LABELS.todo, theme: STATUS_COLORS.todo },
  in_progress: { label: STATUS_LABELS.in_progress, theme: STATUS_COLORS.in_progress },
  done: { label: STATUS_LABELS.done, theme: STATUS_COLORS.done },
} satisfies ChartConfig

interface StatusChartProps {
  buckets: ReportBucket[]
  hasData: boolean
  undatedOpen: number
}

export function StatusChart({ buckets, hasData, undatedOpen }: StatusChartProps) {
  if (!hasData) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Belum ada data pada periode ini
      </p>
    )
  }

  return (
    <div className="grid gap-2">
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart data={buckets}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="todo" fill="var(--color-todo)" radius={4} />
          <Bar dataKey="in_progress" fill="var(--color-in_progress)" radius={4} />
          <Bar dataKey="done" fill="var(--color-done)" radius={4} />
        </BarChart>
      </ChartContainer>
      <p className="text-xs text-muted-foreground">
        Todo & In Progress dihitung berdasarkan deadline, Done berdasarkan
        tanggal selesai.
        {undatedOpen > 0 &&
          ` ${undatedOpen} tugas belum selesai tanpa deadline tidak ditampilkan.`}
      </p>
    </div>
  )
}
