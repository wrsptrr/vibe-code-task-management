import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TaskFilters } from "@/components/TaskFilters"
import type { TaskFilterOptions } from "@/utils/taskFilter"

const anchor = new Date(2026, 5, 17, 10, 0)
const value: TaskFilterOptions = {
  query: "",
  dateRange: "today",
  anchor,
  status: "all",
  priority: "all",
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] })
  vi.setSystemTime(anchor)
})
afterEach(() => vi.useRealTimers())

describe("TaskFilters", () => {
  it("shows the current date range", () => {
    render(<TaskFilters value={value} onChange={() => {}} />)
    expect(screen.getByRole("combobox", { name: "Filter tanggal" })).toHaveTextContent(
      "Hari ini",
    )
  })

  it("reports the chosen date range", async () => {
    const onChange = vi.fn()
    render(<TaskFilters value={value} onChange={onChange} />)
    const user = userEvent.setup({ advanceTimers: () => {} })
    await user.click(screen.getByRole("combobox", { name: "Filter tanggal" }))
    await user.click(await screen.findByRole("option", { name: "Semua tanggal" }))
    expect(onChange).toHaveBeenCalledWith({ ...value, dateRange: "all" })
  })

  it("shows the period label and navigation for the day range", () => {
    render(<TaskFilters value={value} onChange={() => {}} />)
    expect(screen.getByText("17 Jun 2026")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sebelumnya" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Berikutnya" })).toBeInTheDocument()
  })

  it("moves the anchor by one day", async () => {
    const onChange = vi.fn()
    render(<TaskFilters value={value} onChange={onChange} />)
    const user = userEvent.setup({ advanceTimers: () => {} })
    await user.click(screen.getByRole("button", { name: "Berikutnya" }))
    expect(onChange).toHaveBeenLastCalledWith({ ...value, anchor: new Date(2026, 5, 18, 0, 0) })
    await user.click(screen.getByRole("button", { name: "Sebelumnya" }))
    expect(onChange).toHaveBeenLastCalledWith({ ...value, anchor: new Date(2026, 5, 16, 0, 0) })
  })

  it("moves the anchor by one week for the week range", async () => {
    const onChange = vi.fn()
    render(<TaskFilters value={{ ...value, dateRange: "week" }} onChange={onChange} />)
    expect(screen.getByText("15 – 21 Jun 2026")).toBeInTheDocument()
    const user = userEvent.setup({ advanceTimers: () => {} })
    await user.click(screen.getByRole("button", { name: "Berikutnya" }))
    expect(onChange).toHaveBeenCalledWith({
      ...value,
      dateRange: "week",
      anchor: new Date(2026, 5, 24, 0, 0),
    })
  })

  it.each(["overdue", "no_due", "all"] as const)(
    "hides navigation for %s",
    (dateRange) => {
      render(<TaskFilters value={{ ...value, dateRange }} onChange={() => {}} />)
      expect(screen.queryByRole("button", { name: "Sebelumnya" })).not.toBeInTheDocument()
      expect(screen.queryByRole("button", { name: "Berikutnya" })).not.toBeInTheDocument()
    },
  )

  it("keeps the date select when navigation is hidden", () => {
    render(<TaskFilters value={{ ...value, dateRange: "all" }} onChange={() => {}} />)
    expect(screen.getByRole("combobox", { name: "Filter tanggal" })).toHaveTextContent(
      "Semua tanggal",
    )
  })

  it("offers a way back to today only when away from it", async () => {
    const onChange = vi.fn()
    const { rerender } = render(<TaskFilters value={value} onChange={onChange} />)
    expect(screen.queryByRole("button", { name: "Hari ini" })).not.toBeInTheDocument()
    rerender(
      <TaskFilters value={{ ...value, anchor: new Date(2026, 5, 20) }} onChange={onChange} />,
    )
    const user = userEvent.setup({ advanceTimers: () => {} })
    await user.click(screen.getByRole("button", { name: "Hari ini" }))
    expect(onChange.mock.calls[0][0].anchor.getTime()).toBe(anchor.getTime())
  })

  it("renders the action next to the filters", () => {
    render(
      <TaskFilters value={value} onChange={() => {}} action={<button>Tambah</button>} />,
    )
    expect(screen.getByRole("button", { name: "Tambah" })).toBeInTheDocument()
  })

  it("renders no action by default", () => {
    render(<TaskFilters value={value} onChange={() => {}} />)
    expect(screen.queryByRole("button", { name: "Tambah" })).not.toBeInTheDocument()
  })
})
