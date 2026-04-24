'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { api, ApiMenu } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { useMutation } from '@/hooks/useMutation';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MenuForm { label: string; icon: string; path: string; parentId: string; sortOrder: string }
const EMPTY_FORM: MenuForm = { label: '', icon: '', path: '', parentId: '', sortOrder: '0' };

export default function AdminMenusGrid() {
  const [form, setForm] = useState<MenuForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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
        <h2 className="text-sm font-black mb-4 text-foreground">{editingId ? 'Editar menú' : 'Nuevo menú'}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Etiqueta *</Label>
            <Input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="ej: Inventario" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ruta (path)</Label>
            <Input value={form.path} onChange={e => setForm(p => ({ ...p, path: e.target.value }))} placeholder="ej: inventory" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ícono</Label>
            <Input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="ej: box" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Padre (opcional)</Label>
            <Select value={form.parentId || '_root'} onValueChange={v => setForm(p => ({ ...p, parentId: v === '_root' ? '' : v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_root">— Menú raíz —</SelectItem>
                {parents.map(m => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Orden</Label>
            <Input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: e.target.value }))} />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => saveMenu(form)} disabled={saving || !form.label.trim()}>
            {saving && <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />}
            {editingId ? 'Guardar cambios' : 'Crear menú'}
          </Button>
          {editingId && <Button variant="outline" onClick={cancelEdit}>Cancelar</Button>}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden bg-white border shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 border-b">
              {['Etiqueta', 'Ruta', 'Ícono', 'Padre', 'Orden', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...parents, ...children].sort((a, b) => {
              const aParent = a.parentId ?? a.id;
              const bParent = b.parentId ?? b.id;
              if (aParent !== bParent) return aParent.localeCompare(bParent);
              return a.sortOrder - b.sortOrder;
            }).map((menu, i) => (
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
                  <div className="flex items-center gap-1.5 justify-end">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => startEdit(menu)}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setConfirmDelete(menu.id)}>
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

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title="¿Eliminar menú?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) { deleteMenu(confirmDelete); setConfirmDelete(null); } }}
      />
    </div>
  );
}
