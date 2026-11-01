import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { AppNav } from "@/components/AppNav"
import { DeleteTaskDialog } from "@/components/DeleteTaskDialog"
import { ThemeToggle } from "@/components/ThemeToggle"
import { TaskFilters } from "@/components/TaskFilters"
import { TaskForm } from "@/components/TaskForm"
import { TaskList } from "@/components/TaskList"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTasks } from "@/hooks/useTasks"
import type { Task, TaskInput } from "@/types/task"
import {
  filterTasks,
  getNavigablePeriod,
  isCurrentPeriod,
  type TaskFilterOptions,
} from "@/utils/taskFilter"

function getEmptyMessage({ dateRange, anchor }: TaskFilterOptions): string {
  if (!getNavigablePeriod(dateRange)) return "Tidak ada tugas yang cocok"
  if (!isCurrentPeriod(dateRange, anchor)) return "Tidak ada tugas pada periode ini"
  return dateRange === "today"
    ? "Tidak ada tugas hari ini"
    : "Tidak ada tugas minggu ini"
}

export function HomePage() {
  const { tasks, addTask, updateTask, deleteTask, advanceStatus, revertStatus } =
    useTasks()
  const [filters, setFilters] = useState<TaskFilterOptions>({
    query: "",
    dateRange: "today",
    anchor: new Date(),
    status: "all",
    priority: "all",
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const visibleTasks = useMemo(
    () =>
      filterTasks(tasks, filters).sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    [tasks, filters],
  )

  function openCreate() {
    setEditingTask(null)
    setFormOpen(true)
  }

  function openEdit(task: Task) {
    setEditingTask(task)
    setFormOpen(true)
  }

  function handleSubmit(input: TaskInput) {
    if (editingTask) updateTask(editingTask.id, input)
    else addTask(input)
    setFormOpen(false)
  }

  return (
    <main className="mx-auto grid max-w-3xl gap-4 p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Manajemen</h1>
        <div className="flex items-center gap-1">
          <AppNav />
          <ThemeToggle />
        </div>
      </div>
      <TaskFilters
        value={filters}
        onChange={setFilters}
        action={
          <Button className="w-full sm:w-auto" onClick={openCreate}>
            <Plus /> Tambah Tugas
          </Button>
        }
      />
      <TaskList
        tasks={visibleTasks}
        hasAnyTask={tasks.length > 0}
        emptyMessage={getEmptyMessage(filters)}
        onAdvance={advanceStatus}
        onRevert={revertStatus}
        onEdit={openEdit}
        onDelete={setDeletingTask}
      />
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Tugas" : "Tambah Tugas"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            key={editingTask?.id ?? "new"}
            task={editingTask ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <DeleteTaskDialog
        task={deletingTask}
        onConfirm={(task) => {
          deleteTask(task.id)
          setDeletingTask(null)
        }}
        onCancel={() => setDeletingTask(null)}
      />
    </main>
  )
}
