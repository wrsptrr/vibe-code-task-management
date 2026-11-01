import { fireEvent, render, screen } from "@testing-library/react"
import { TaskItem } from "@/components/TaskItem"
import type { Task, TaskStatus } from "@/types/task"

function makeTask(status: TaskStatus): Task {
  return {
    id: "task-1",
    title: "Task",
    status,
    priority: "medium",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  } as Task
}

function renderItem(status: TaskStatus, onRevert = vi.fn()) {
  render(
    <TaskItem
      task={makeTask(status)}
      onAdvance={vi.fn()}
      onRevert={onRevert}
      onEdit={vi.fn()}
      onDelete={vi.fn()}
    />,
  )
  return onRevert
}

const REVERT = "Mundur ke status sebelumnya"
const ADVANCE = "Maju ke status berikutnya"

describe("TaskItem status buttons", () => {
  it("hides revert and shows advance for todo", () => {
    renderItem("todo")
    expect(screen.queryByLabelText(REVERT)).not.toBeInTheDocument()
    expect(screen.getByLabelText(ADVANCE)).toBeInTheDocument()
  })

  it("shows both for in_progress", () => {
    renderItem("in_progress")
    expect(screen.getByLabelText(REVERT)).toBeInTheDocument()
    expect(screen.getByLabelText(ADVANCE)).toBeInTheDocument()
  })

  it("shows revert and hides advance for done", () => {
    renderItem("done")
    expect(screen.getByLabelText(REVERT)).toBeInTheDocument()
    expect(screen.queryByLabelText(ADVANCE)).not.toBeInTheDocument()
  })

  it("calls onRevert with the task id", () => {
    const onRevert = renderItem("done")
    fireEvent.click(screen.getByLabelText(REVERT))
    expect(onRevert).toHaveBeenCalledWith("task-1")
  })
})
