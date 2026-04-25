'use client';

import { Button } from '@/components/ui/button';

interface RowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
  /**
   * icon-sm  — icon-only h-7 w-7, wrapped in centered div (desktop tables)
   * icon-md  — icon-only h-8 w-8, fragment only (mobile card rows in flex parent)
   * text     — flex-1 buttons with Editar/Eliminar labels (mobile accordions)
   */
  variant?: 'icon-sm' | 'icon-md' | 'text';
}

function PencilIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export function RowActions({ onEdit, onDelete, deleting, variant = 'icon-sm' }: RowActionsProps) {
  if (variant === 'text') {
    return (
      <div className="flex gap-2 pt-1">
        <Button variant="outline" className="flex-1 gap-1.5" onClick={onEdit}>
          <PencilIcon className="w-3.5 h-3.5" />
          Editar
        </Button>
        <Button variant="ghost" className="flex-1 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete} disabled={deleting}>
          {deleting
            ? <div className="w-4 h-4 rounded-full border-2 animate-spin border-destructive/20 border-t-destructive" />
            : <TrashIcon className="w-3.5 h-3.5" />}
          Eliminar
        </Button>
      </div>
    );
  }

  if (variant === 'icon-md') {
    return (
      <>
        <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0" onClick={onEdit}>
          <PencilIcon className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete} disabled={deleting}>
          {deleting
            ? <div className="w-4 h-4 rounded-full border animate-spin border-destructive/30 border-t-destructive" />
            : <TrashIcon className="w-4 h-4" />}
        </Button>
      </>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1.5">
      <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={onEdit}>
        <PencilIcon className="w-3 h-3" />
      </Button>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={onDelete} disabled={deleting}>
        {deleting
          ? <div className="w-3 h-3 rounded-full border animate-spin border-destructive/30 border-t-destructive" />
          : <TrashIcon className="w-3 h-3" />}
      </Button>
    </div>
  );
}
