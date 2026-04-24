'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  itemName?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteDialog({ open, title, itemName, onCancel, onConfirm }: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={open => !open && onCancel()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {itemName && <><span className="font-semibold text-foreground">{itemName}</span> — </>}
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancelar</Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm}>Eliminar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
