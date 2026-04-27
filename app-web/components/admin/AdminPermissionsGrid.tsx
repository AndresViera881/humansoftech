'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { api, ApiPermission } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { useMutation } from '@/hooks/useMutation';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/ui/form-field';
import { RowActions } from './RowActions';

interface PermForm { name: string; resource: string; action: string; description: string }
const EMPTY: PermForm = { name: '', resource: '', action: '', description: '' };

export default function AdminPermissionsGrid() {
  const [form, setForm] = useState<PermForm>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [expandedResource, setExpandedResource] = useState<string | null>(null);

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
      <div className="rounded-2xl p-4 sm:p-6 bg-white border shadow-sm">
        <h2 className="text-sm font-black mb-4 text-foreground">{editingId ? 'Editar permiso' : 'Nuevo permiso'}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <FormField label="Recurso *">
            <Input value={form.resource}
              onChange={e => setForm(p => syncName({ ...p, resource: e.target.value.toLowerCase() }))}
              placeholder="ej: products" />
          </FormField>
          <FormField label="Acción *">
            <Input value={form.action}
              onChange={e => setForm(p => syncName({ ...p, action: e.target.value.toLowerCase() }))}
              placeholder="ej: read" />
          </FormField>
          <FormField label="Nombre (auto)">
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="products:read" className="font-mono" />
          </FormField>
          <FormField label="Descripción">
            <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="ej: Ver productos" />
          </FormField>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => savePermission(form)} disabled={saving || !form.name.trim() || !form.resource.trim() || !form.action.trim()}>
            {saving && <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />}
            {editingId ? 'Guardar cambios' : 'Crear permiso'}
          </Button>
          {editingId && <Button variant="outline" onClick={cancelEdit}>Cancelar</Button>}
        </div>
      </div>

      {/* Grouped list */}
      <div className="flex flex-col gap-4">
        {Object.entries(grouped).map(([resource, items]) => {
          const isOpen = expandedResource === resource;
          return (
            <div key={resource} className="rounded-2xl overflow-hidden bg-white border shadow-sm">
              {/* Group header */}
              <div className="px-4 sm:px-5 py-3 flex items-center gap-2 bg-muted/40 border-b">
                <span className="text-xs font-bold tracking-widest uppercase text-foreground">{resource}</span>
                <Badge variant="secondary" className="text-xs">{items.length}</Badge>
                {/* Mobile toggle */}
                <button className="ml-auto sm:hidden"
                  onClick={() => setExpandedResource(isOpen ? null : resource)}>
                  <svg className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Desktop table */}
              <table className="hidden sm:table w-full text-sm">
                <tbody>
                  {items.map((perm, i) => (
                    <tr key={perm.id}
                      style={{ borderBottom: i < items.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                      className="transition-colors hover:bg-muted/20">
                      <td className="px-5 py-3 font-mono text-xs font-semibold w-48 text-foreground">{perm.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{perm.description ?? '—'}</td>
                      <td className="px-5 py-3 text-right">
                        <RowActions onEdit={() => startEdit(perm)} onDelete={() => setConfirmDelete(perm.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile cards — visible when group is expanded */}
              {isOpen && (
                <div className="flex sm:hidden flex-col divide-y">
                  {items.map(perm => (
                    <div key={perm.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono font-semibold text-foreground truncate">{perm.name}</p>
                        {perm.description && <p className="text-xs text-muted-foreground mt-0.5">{perm.description}</p>}
                      </div>
                      <RowActions onEdit={() => startEdit(perm)} onDelete={() => setConfirmDelete(perm.id)} />
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })}
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
