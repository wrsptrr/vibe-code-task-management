import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { ReportPage } from "@/pages/ReportPage"
import { saveTasks } from "@/services/taskStorage"
import type { Task } from "@/types/task"

// recharts needs ResizeObserver, which jsdom does not provide.
vi.mock("@/components/StatusChart", () => ({
  StatusChart: ({
    hasData,
    undatedOpen,
  }: {
    hasData: boolean
    undatedOpen: number
  }) => (
    <div data-testid="chart">
      hasData:{String(hasData)} undated:{undatedOpen}
    </div>
  ),
}))

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: "1",
    title: "Task",
    status: "done",
    priority: "medium",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  }
}

function renderPage() {
  render(
    <MemoryRouter>
      <ReportPage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers({ toFake: ["Date"] })
  vi.setSystemTime(new Date(2026, 5, 17, 12))
})

afterEach(() => vi.useRealTimers())

describe("ReportPage", () => {
  it("shows the completed total and tasks for the current week", () => {
    saveTasks([
      makeTask({ id: "a", title: "Selesai minggu ini", completedAt: new Date(2026, 5, 16, 9).toISOString() }),
      makeTask({ id: "b", title: "Minggu lalu", completedAt: new Date(2026, 5, 10, 9).toISOString() }),
    ])
    renderPage()
    expect(screen.getByTestId("report-total")).toHaveTextContent("1")
    expect(screen.getByText("Selesai minggu ini")).toBeInTheDocument()
    expect(screen.queryByText("Minggu lalu")).not.toBeInTheDocument()
  })

  it("switches the period tab and updates the label", () => {
    renderPage()
    const weekLabel = screen.getByText(/–/)
    expect(weekLabel).toBeInTheDocument()
    fireEvent.click(screen.getByRole("tab", { name: "Bulan" }))
    expect(screen.getByText(/juni 2026/i)).toBeInTheDocument()
  })

  it("navigates to the previous and next period", () => {
    saveTasks([
      makeTask({ id: "old", title: "Minggu lalu", completedAt: new Date(2026, 5, 10, 9).toISOString() }),
    ])
    renderPage()
    expect(screen.queryByText("Minggu lalu")).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Periode sebelumnya" }))
    expect(screen.getByText("Minggu lalu")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Periode berikutnya" }))
    expect(screen.queryByText("Minggu lalu")).not.toBeInTheDocument()
  })

  it("returns to the current period with the today button", () => {
    renderPage()
    const initial = screen.getByText(/–/).textContent
    fireEvent.click(screen.getByRole("button", { name: "Periode sebelumnya" }))
    expect(screen.getByText(/–/).textContent).not.toBe(initial)
    fireEvent.click(screen.getByRole("button", { name: "Hari ini" }))
    expect(screen.getByText(/–/).textContent).toBe(initial)
  })

  it("has no chart data when there are no tasks", () => {
    renderPage()
    expect(screen.getByTestId("chart")).toHaveTextContent("hasData:false")
  })

  it("shows chart data for open tasks with a deadline this week", () => {
    saveTasks([
      makeTask({ id: "t", status: "todo", dueDate: "2026-06-16" }),
      makeTask({ id: "u", status: "in_progress" }),
    ])
    renderPage()
    expect(screen.getByTestId("chart")).toHaveTextContent("hasData:true undated:1")
  })
})
