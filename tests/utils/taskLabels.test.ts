import type { TaskStatus } from "@/types/task"
import {
  DATE_RANGE_LABELS,
  DATE_RANGE_OPTIONS,
  STATUS_COLORS,
  STATUS_STYLES,
} from "@/utils/taskLabels"

const HEX = /^#[0-9a-f]{6}$/i

const EXPECTED: Record<TaskStatus, { palette: string; light: string; dark: string }> = {
  todo: { palette: "slate", light: "#334155", dark: "#cbd5e1" },
  in_progress: { palette: "blue", light: "#1d4ed8", dark: "#93c5fd" },
  done: { palette: "green", light: "#15803d", dark: "#86efac" },
}

describe("status colors", () => {
  it.each(Object.keys(EXPECTED) as TaskStatus[])(
    "%s chart colors are hex and match the badge text colors",
    (status) => {
      const { palette, light, dark } = EXPECTED[status]
      expect(STATUS_COLORS[status].light).toMatch(HEX)
      expect(STATUS_COLORS[status].dark).toMatch(HEX)
      expect(STATUS_COLORS[status]).toEqual({ light, dark })
      expect(STATUS_STYLES[status]).toContain(` text-${palette}-700 `)
      expect(STATUS_STYLES[status]).toContain(` dark:text-${palette}-300 `)
    },
  )
})

describe("date range labels", () => {
  it("has a label for every option", () => {
    expect(DATE_RANGE_OPTIONS).toEqual(["today", "week", "overdue", "no_due", "all"])
    for (const option of DATE_RANGE_OPTIONS) {
      expect(DATE_RANGE_LABELS[option]).toBeTruthy()
    }
  })
})
