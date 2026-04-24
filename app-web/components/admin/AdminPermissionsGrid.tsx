'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { api, ApiPermission } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { useMutation } from '@/hooks/useMutation';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface PermForm { name: string; resource: string; action: string; description: string }
const EMPTY: PermForm = { name: '', resource: '', action: '', description: '' };

export default function AdminPermissionsGrid() {
  const [form, setForm] = useState<PermForm>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data, loading, refetch } = useApiData(() => api.permissions.list());
  const perms: ApiPermission[] = data ?? [];

  const { mutate: savePermission, loading: saving } = useMutation(
    async (f: PermForm) => {
      const payload = { name: f.name.trim(), resource: f.resource.trim(), action: f.action.trim(), description: f.description.trim() || undefined };
      if (editingId) {
        await api.permissions.update(editingId, payload);
        toast.success('Permiso actualizado');
      } else {
        await api.permissions.create(payload);
        toast.success('Permiso creado');
      }
    },
    { onSuccess: () => { cancelEdit(); refetch(); }, onError: () => toast.error('Error al guardar') }
  );

  const { mutate: deletePermission } = useMutation(
    async (id: string) => { await api.permissions.delete(id); toast.success('Permiso eliminado'); },
    { onSuccess: refetch, onError: () => toast.error('Error al eliminar') }
  );

  function startEdit(p: ApiPermission) {
    setEditingId(p.id);
    setForm({ name: p.name, resource: p.resource, action: p.action, description: p.description ?? '' });
  }

  function cancelEdit() { setEditingId(null); setForm(EMPTY); }

  function syncName(p: PermForm): PermForm {
    if (!editingId && p.resource && p.action) return { ...p, name: `${p.resource}:${p.action}` };
    return p;
  }

  const grouped = perms.reduce<Record<string, ApiPermission[]>>((acc, p) => {
    (acc[p.resource] ??= []).push(p);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 rounded-full border-2 border-border border-t-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Form */}
      <div className="rounded-2xl p-6 bg-white border shadow-sm">
        <h2 className="text-sm font-black mb-4 text-foreground">{editingId ? 'Editar permiso' : 'Nuevo permiso'}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recurso *</Label>
            <Input value={form.resource}
              onChange={e => setForm(p => syncName({ ...p, resource: e.target.value.toLowerCase() }))}
              placeholder="ej: products" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acción *</Label>
            <Input value={form.action}
              onChange={e => setForm(p => syncName({ ...p, action: e.target.value.toLowerCase() }))}
              placeholder="ej: read" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre (auto)</Label>
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="products:read" className="font-mono" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripción</Label>
            <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="ej: Ver productos" />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => savePermission(form)} disabled={saving || !form.name.trim() || !form.resource.trim() || !form.action.trim()}>
            {saving && <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />}
            {editingId ? 'Guardar cambios' : 'Crear permiso'}
          </Button>
          {editingId && <Button variant="outline" onClick={cancelEdit}>Cancelar</Button>}
        </div>
      </div>

      {/* Grouped by resource */}
      <div className="flex flex-col gap-4">
        {Object.entries(grouped).map(([resource, items]) => (
          <div key={resource} className="rounded-2xl overflow-hidden bg-white border shadow-sm">
            <div className="px-5 py-3 flex items-center gap-2 bg-muted/40 border-b">
              <span className="text-xs font-bold tracking-widest uppercase text-foreground">{resource}</span>
              <Badge variant="secondary" className="text-xs">{items.length}</Badge>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {items.map((perm, i) => (
                  <tr key={perm.id}
                    style={{ borderBottom: i < items.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                    className="transition-colors hover:bg-muted/20">
                    <td className="px-5 py-3 font-mono text-xs font-semibold w-48 text-foreground">{perm.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{perm.description ?? '—'}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => startEdit(perm)}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setConfirmDelete(perm.id)}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title="¿Eliminar permiso?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) { deletePermission(confirmDelete); setConfirmDelete(null); } }}
      />
    </div>
  );
}
