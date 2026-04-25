'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AdminToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onRefresh: () => void;
  onAdd?: () => void;
  addLabel?: string;
  filters?: React.ReactNode;
}

export function AdminToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  onRefresh,
  onAdd,
  addLabel = 'Agregar',
  filters,
}: AdminToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <svg
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <Input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>
      {filters}
      <Button variant="outline" onClick={onRefresh} className="flex-shrink-0">
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualizar
      </Button>
      {onAdd && (
        <Button onClick={onAdd} className="flex-shrink-0">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {addLabel}
        </Button>
      )}
    </div>
  );
}
