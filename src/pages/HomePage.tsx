import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { AppNav } from "@/components/AppNav"
import { DeleteTaskDialog } from "@/components/DeleteTaskDialog"
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
import { filterTasks, type TaskFilterOptions } from "@/utils/taskFilter"

export function HomePage() {
  const { tasks, addTask, updateTask, deleteTask, advanceStatus, revertStatus } =
    useTasks()
  const [filters, setFilters] = useState<TaskFilterOptions>({
    query: "",
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
        <AppNav />
      </div>
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus /> Tambah Tugas
        </Button>
      </div>
      <TaskFilters value={filters} onChange={setFilters} />
      <TaskList
        tasks={visibleTasks}
        hasAnyTask={tasks.length > 0}
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
