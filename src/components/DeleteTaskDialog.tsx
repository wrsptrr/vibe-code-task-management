import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Task } from "@/types/task"

interface DeleteTaskDialogProps {
  task: Task | null
  onConfirm: (task: Task) => void
  onCancel: () => void
}

export function DeleteTaskDialog({
  task,
  onConfirm,
  onCancel,
}: DeleteTaskDialogProps) {
  return (
    <Dialog open={task !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus tugas?</DialogTitle>
          <DialogDescription>
            Tugas "{task?.title}" akan dihapus permanen.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button
            variant="destructive"
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={() => task && onConfirm(task)}
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
