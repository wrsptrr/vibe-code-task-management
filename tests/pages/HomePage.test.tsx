import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { HomePage } from "@/pages/HomePage"
import { saveTasks } from "@/services/taskStorage"
import type { Task } from "@/types/task"

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: "1",
    title: "Task",
    status: "todo",
    priority: "medium",
    createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
    ...overrides,
  } as Task
}

function renderPage() {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers({ toFake: ["Date"] })
  vi.setSystemTime(new Date(2026, 5, 17, 10, 0))
})
afterEach(() => vi.useRealTimers())

describe("HomePage", () => {
  it("shows only tasks due today by default", () => {
    saveTasks([
      makeTask({ id: "1", title: "Due today", dueDate: "2026-06-17" }),
      makeTask({ id: "2", title: "Due tomorrow", dueDate: "2026-06-18" }),
      makeTask({ id: "3", title: "No deadline" }),
    ])
    renderPage()
    expect(screen.getByText("Due today")).toBeInTheDocument()
    expect(screen.queryByText("Due tomorrow")).not.toBeInTheDocument()
    expect(screen.queryByText("No deadline")).not.toBeInTheDocument()
  })

  it("shows every task after choosing all dates", async () => {
    saveTasks([
      makeTask({ id: "1", title: "Due today", dueDate: "2026-06-17" }),
      makeTask({ id: "2", title: "Due tomorrow", dueDate: "2026-06-18" }),
    ])
    renderPage()
    const user = userEvent.setup({ advanceTimers: () => {} })
    await user.click(screen.getByRole("combobox", { name: "Filter tanggal" }))
    await user.click(await screen.findByRole("option", { name: "Semua tanggal" }))
    expect(screen.getByText("Due tomorrow")).toBeInTheDocument()
  })

  it("explains when nothing is due today", () => {
    saveTasks([makeTask({ id: "1", title: "Due tomorrow", dueDate: "2026-06-18" })])
    renderPage()
    expect(screen.getByText("Tidak ada tugas hari ini")).toBeInTheDocument()
  })

  it("moves between days with next and previous", async () => {
    saveTasks([
      makeTask({ id: "1", title: "Due today", dueDate: "2026-06-17" }),
      makeTask({ id: "2", title: "Due tomorrow", dueDate: "2026-06-18" }),
    ])
    renderPage()
    const user = userEvent.setup({ advanceTimers: () => {} })
    await user.click(screen.getByRole("button", { name: "Berikutnya" }))
    expect(screen.getByText("Due tomorrow")).toBeInTheDocument()
    expect(screen.queryByText("Due today")).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Sebelumnya" }))
    expect(screen.getByText("Due today")).toBeInTheDocument()
  })

  it("explains when nothing is due in the shifted period", async () => {
    saveTasks([makeTask({ id: "1", title: "Due today", dueDate: "2026-06-17" })])
    renderPage()
    const user = userEvent.setup({ advanceTimers: () => {} })
    await user.click(screen.getByRole("button", { name: "Berikutnya" }))
    expect(screen.getByText("Tidak ada tugas pada periode ini")).toBeInTheDocument()
  })

  it("opens the create form from the add button", async () => {
    renderPage()
    const user = userEvent.setup({ advanceTimers: () => {} })
    await user.click(screen.getByRole("button", { name: /Tambah Tugas/ }))
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
  })
})
