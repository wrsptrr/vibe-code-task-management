import { fireEvent, render, screen } from "@testing-library/react"
import { TaskForm } from "@/components/TaskForm"

describe("TaskForm", () => {
  it("shows errors for all empty required fields and does not submit", () => {
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByRole("button", { name: "Simpan" }))
    expect(screen.getByText("Judul wajib diisi")).toBeInTheDocument()
    expect(screen.getByText("Deskripsi wajib diisi")).toBeInTheDocument()
    expect(screen.getByText("Deadline wajib diisi")).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("marks the text fields as required", () => {
    render(<TaskForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    for (const label of [/^Judul/, /^Deskripsi/, /^Deadline/]) {
      const field = screen.getByLabelText(label)
      expect(field).toBeRequired()
      expect(field).toHaveAttribute("aria-required", "true")
    }
  })

  it("clears a field error when that field is edited", () => {
    render(<TaskForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByRole("button", { name: "Simpan" }))
    fireEvent.change(screen.getByLabelText(/^Deskripsi/), {
      target: { value: "Isi" },
    })
    expect(screen.queryByText("Deskripsi wajib diisi")).not.toBeInTheDocument()
    expect(screen.getByText("Judul wajib diisi")).toBeInTheDocument()
  })

  it("rejects a whitespace-only title", () => {
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/^Judul/), { target: { value: "   " } })
    fireEvent.change(screen.getByLabelText(/^Deskripsi/), {
      target: { value: "Isi" },
    })
    fireEvent.change(screen.getByLabelText(/^Deadline/), {
      target: { value: "2026-06-01T14:30" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Simpan" }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("submits trimmed values with defaults", () => {
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/^Judul/), {
      target: { value: " Belajar " },
    })
    fireEvent.change(screen.getByLabelText(/^Deskripsi/), {
      target: { value: " Catatan " },
    })
    fireEvent.change(screen.getByLabelText(/^Deadline/), {
      target: { value: "2026-06-01T14:30" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Simpan" }))
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Belajar",
      description: "Catatan",
      status: "todo",
      priority: "medium",
      dueDate: "2026-06-01T14:30",
    })
  })

  it("prefills legacy date-only deadlines with midnight when editing", () => {
    const task = {
      id: "1",
      title: "Old",
      description: "Desc",
      status: "todo" as const,
      priority: "low" as const,
      dueDate: "2026-06-01",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    }
    render(<TaskForm task={task} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByLabelText(/^Deadline/)).toHaveValue("2026-06-01T00:00")
  })

  it("calls onCancel", () => {
    const onCancel = vi.fn()
    render(<TaskForm onSubmit={vi.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole("button", { name: "Batal" }))
    expect(onCancel).toHaveBeenCalled()
  })
})
