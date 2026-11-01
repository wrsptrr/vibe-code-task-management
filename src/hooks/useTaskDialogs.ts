import { useState } from "react"
import type { Task, TaskInput } from "@/types/task"

interface TaskDialogHandlers {
  addTask: (input: TaskInput) => void
  updateTask: (id: string, patch: Partial<TaskInput>) => void
  deleteTask: (id: string) => void
}

export function useTaskDialogs({
  addTask,
  updateTask,
  deleteTask,
}: TaskDialogHandlers) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  function openCreate() {
    setEditingTask(null)
    setFormOpen(true)
  }

  function openEdit(task: Task) {
    setEditingTask(task)
    setFormOpen(true)
  }

  function submitForm(input: TaskInput) {
    if (editingTask) updateTask(editingTask.id, input)
    else addTask(input)
    setFormOpen(false)
  }

  function requestDelete(task: Task) {
    setDeletingTask(task)
  }

  function confirmDelete(task: Task) {
    deleteTask(task.id)
    setDeletingTask(null)
  }

  function cancelDelete() {
    setDeletingTask(null)
  }

  return {
    formOpen,
    setFormOpen,
    editingTask,
    deletingTask,
    openCreate,
    openEdit,
    submitForm,
    requestDelete,
    confirmDelete,
    cancelDelete,
  }
}
