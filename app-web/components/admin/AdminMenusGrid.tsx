'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { api, ApiMenu } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { useMutation } from '@/hooks/useMutation';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/ui/form-field';
import { RowActions } from './RowActions';

interface MenuForm { label: string; icon: string; path: string; parentId: string; sortOrder: string }
const EMPTY_FORM: MenuForm = { label: '', icon: '', path: '', parentId: '', sortOrder: '0' };

export default function AdminMenusGrid() {
  const [form, setForm] = useState<MenuForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, loading, refetch } = useApiData(() => api.menus.list());
  const menus: ApiMenu[] = data ?? [];

  const { mutate: saveMenu, loading: saving } = useMutation(
    async (f: MenuForm) => {
      const payload = {
        label: f.label.trim(),
        icon: f.icon.trim() || undefined,
        path: f.path.trim() || undefined,
        parentId: f.parentId || undefined,
        sortOrder: Number(f.sortOrder) || 0,
      };
      if (editingId) {
        await api.menus.update(editingId, payload);
        toast.success('Menú actualizado');
      } else {
        await api.menus.create(payload);
        toast.success('Menú creado');
      }
    },
    { onSuccess: () => { cancelEdit(); refetch(); }, onError: () => toast.error('Error al guardar') }
  );

  const { mutate: deleteMenu } = useMutation(
    async (id: string) => { await api.menus.delete(id); toast.success('Menú eliminado'); },
    { onSuccess: refetch, onError: () => toast.error('Error al eliminar') }
  );

  function startEdit(menu: ApiMenu) {
    setEditingId(menu.id);
    setForm({ label: menu.label, icon: menu.icon ?? '', path: menu.path ?? '', parentId: menu.parentId ?? '', sortOrder: String(menu.sortOrder) });
  }

  function cancelEdit() { setEditingId(null); setForm(EMPTY_FORM); }

  const parents = menus.filter(m => !m.parentId);
  const children = menus.filter(m => m.parentId);

  const sorted = [...parents, ...children].sort((a, b) => {
    const aParent = a.parentId ?? a.id;
    const bParent = b.parentId ?? b.id;
    if (aParent !== bParent) return aParent.localeCompare(bParent);
    return a.sortOrder - b.sortOrder;
  });

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
        <h2 className="text-sm font-black mb-4 text-foreground">{editingId ? 'Editar menú' : 'Nuevo menú'}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <FormField label="Etiqueta *">
            <Input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="ej: Inventario" />
          </FormField>
          <FormField label="Ruta (path)">
            <Input value={form.path} onChange={e => setForm(p => ({ ...p, path: e.target.value }))} placeholder="ej: inventory" />
          </FormField>
          <FormField label="Ícono">
            <Input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="ej: box" />
          </FormField>
          <FormField label="Padre (opcional)">
            <Select value={form.parentId || '_root'} onValueChange={v => setForm(p => ({ ...p, parentId: v === '_root' ? '' : v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_root">— Menú raíz —</SelectItem>
                {parents.map(m => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Orden">
            <Input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: e.target.value }))} />
          </FormField>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => saveMenu(form)} disabled={saving || !form.label.trim()}>
            {saving && <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />}
            {editingId ? 'Guardar cambios' : 'Crear menú'}
          </Button>
          {editingId && <Button variant="outline" onClick={cancelEdit}>Cancelar</Button>}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block rounded-2xl overflow-hidden bg-white border shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 border-b">
              {['Etiqueta', 'Ruta', 'Ícono', 'Padre', 'Orden', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((menu, i) => (
              <tr key={menu.id}
                style={{ borderBottom: i < menus.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                className="transition-colors hover:bg-muted/20">
                <td className="px-5 py-3 font-semibold text-foreground" style={{ paddingLeft: menu.parentId ? '2.5rem' : '1.25rem' }}>
                  {menu.parentId && <span className="text-muted-foreground/40 mr-1.5">›</span>}
                  {menu.label}
                </td>
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{menu.path ?? '—'}</td>
                <td className="px-5 py-3 text-muted-foreground">{menu.icon ?? '—'}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {menu.parentId ? (menus.find(m => m.id === menu.parentId)?.label ?? '—') : '—'}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{menu.sortOrder}</td>
                <td className="px-5 py-3">
                  <RowActions onEdit={() => startEdit(menu)} onDelete={() => setConfirmDelete(menu.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex sm:hidden flex-col gap-2">
        {sorted.map(menu => {
          const isOpen = expandedId === menu.id;
          const parentLabel = menu.parentId ? menus.find(m => m.id === menu.parentId)?.label : null;
          return (
            <div key={menu.id} className="rounded-2xl overflow-hidden bg-white border shadow-sm">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left"
                onClick={() => setExpandedId(isOpen ? null : menu.id)}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {menu.parentId && <span className="text-muted-foreground/50 mr-1">›</span>}
                    {menu.label}
                  </p>
                  {menu.path && <p className="text-xs font-mono text-muted-foreground truncate">{menu.path}</p>}
                </div>
                {parentLabel && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md flex-shrink-0">{parentLabel}</span>
                )}
                <svg className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 flex flex-col gap-3 border-t">
                  <div className="grid grid-cols-2 gap-2 pt-3">
                    {[
                      { label: 'Ícono', value: menu.icon ?? '—' },
                      { label: 'Orden', value: String(menu.sortOrder) },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl px-3 py-2 bg-muted/40 border">
                        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5 text-muted-foreground">{label}</p>
                        <p className="text-sm font-bold">{value}</p>
                      </div>
                    ))}
                  </div>
                  <RowActions variant="text" onEdit={() => startEdit(menu)} onDelete={() => setConfirmDelete(menu.id)} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title="¿Eliminar menú?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) { deleteMenu(confirmDelete); setConfirmDelete(null); } }}
      />
    </div>
  );
}
