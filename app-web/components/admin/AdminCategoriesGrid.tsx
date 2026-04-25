'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { api, ApiCategory, slugify } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { useMutation } from '@/hooks/useMutation';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { AdminToolbar } from './AdminToolbar';
import { TableLoading, TableEmpty } from './TableStates';
import { RowActions } from './RowActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { SaveButton } from '@/components/ui/save-button';
import { ErrorBanner } from '@/components/ui/error-banner';

type ModalMode = 'create' | 'edit';

interface FormState { name: string; slug: string; description: string; sortOrder: string; active: boolean }
const emptyForm = (): FormState => ({ name: '', slug: '', description: '', sortOrder: '0', active: true });

export default function AdminCategoriesGrid() {
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [editTarget, setEditTarget] = useState<ApiCategory | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saveError, setSaveError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ApiCategory | null>(null);

  const { data, loading, refetch } = useApiData(() => api.categories.list());
  const categories = data ?? [];

  const { mutate: saveCategory, loading: saving } = useMutation(
    async (f: FormState) => {
      if (modalMode === 'create') {
        return api.categories.create({ name: f.name, slug: f.slug || slugify(f.name), description: f.description || undefined, sortOrder: Number(f.sortOrder) });
      }
      return api.categories.update(editTarget!.id, { name: f.name, slug: f.slug, description: f.description || undefined, active: f.active, sortOrder: Number(f.sortOrder) });
    },
    { onSuccess: () => { refetch(); setModalMode(null); }, onError: setSaveError }
  );

  const { mutate: deleteCategory } = useMutation(
    (id: string) => api.categories.delete(id)
  );

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setForm(emptyForm()); setEditTarget(null); setSaveError(''); setModalMode('create'); };
  const openEdit = (c: ApiCategory) => {
    setForm({ name: c.name, slug: c.slug, description: c.description ?? '', sortOrder: String(c.sortOrder), active: c.active });
    setEditTarget(c); setSaveError(''); setModalMode('edit');
  };

  const handleSave = () => { if (form.name.trim()) saveCategory(form); };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    const { id, name } = deleteConfirm;
    setDeleteConfirm(null);
    setDeletingId(id);
    const result = await deleteCategory(id);
    setDeletingId(null);
    if (result !== null) {
      refetch();
      toast.success(`"${name}" eliminada`);
    } else {
      toast.error('No se pudo eliminar la categoría');
    }
  };

  const toggleActive = async (c: ApiCategory) => {
    try {
      await api.categories.update(c.id, { active: !c.active });
      refetch();
    } catch { /* ignore */ }
  };

  return (
    <div className="flex flex-col gap-4">

      <AdminToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar categoría..."
        onRefresh={refetch}
        onAdd={openCreate}
      />

      <p className="text-xs text-muted-foreground">{filtered.length} categoría{filtered.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border shadow-sm">
        <div className="hidden sm:grid text-xs font-semibold uppercase tracking-widest px-4 py-3 text-muted-foreground bg-muted/40 border-b"
          style={{ gridTemplateColumns: '2fr 1fr 1fr 80px 120px' }}>
          <span>Categoría</span><span>Slug</span><span>Descripción</span>
          <span className="text-center">Activa</span><span className="text-center">Acciones</span>
        </div>

        {loading ? (
          <TableLoading />
        ) : filtered.length === 0 ? (
          <TableEmpty message="Sin categorías" />
        ) : (
          <>
            {/* Desktop rows */}
            <div className="hidden sm:block">
              {filtered.map((c, i) => (
                <div key={c.id} className="grid items-center px-4 py-3 transition-colors hover:bg-muted/20"
                  style={{ gridTemplateColumns: '2fr 1fr 1fr 80px 120px', background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: i < filtered.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                  <span className="text-sm font-semibold truncate pr-3">{c.name}</span>
                  <span className="text-xs truncate font-mono text-muted-foreground">{c.slug}</span>
                  <span className="text-xs truncate text-muted-foreground">{c.description ?? '—'}</span>
                  <div className="flex justify-center">
                    <button onClick={() => toggleActive(c)}
                      className="w-9 h-5 rounded-full relative transition-all duration-200"
                      style={{ background: c.active ? '#111827' : '#e5e7eb' }}>
                      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200" style={{ left: c.active ? '17px' : '1px' }} />
                    </button>
                  </div>
                  <RowActions onEdit={() => openEdit(c)} onDelete={() => setDeleteConfirm(c)} deleting={deletingId === c.id} />
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="flex sm:hidden flex-col divide-y">
              {filtered.map(c => (
                <div key={c.id} className="px-4 py-3 flex items-center gap-3 bg-white">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{c.name}</p>
                    <p className="text-xs font-mono truncate mt-0.5 text-muted-foreground">{c.slug}</p>
                  </div>
                  <button onClick={() => toggleActive(c)} className="w-9 h-5 rounded-full relative transition-all duration-200 flex-shrink-0" style={{ background: c.active ? '#111827' : '#e5e7eb' }}>
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200" style={{ left: c.active ? '17px' : '1px' }} />
                  </button>
                  <RowActions variant="icon-md" onEdit={() => openEdit(c)} onDelete={() => setDeleteConfirm(c)} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmDeleteDialog
        open={!!deleteConfirm}
        title="¿Eliminar categoría?"
        itemName={deleteConfirm?.name}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Create / Edit Dialog */}
      <Dialog open={!!modalMode} onOpenChange={open => !open && setModalMode(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{modalMode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <FormField label="Nombre">
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} placeholder="ej. Laptops" />
            </FormField>
            <FormField label="Slug">
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="ej. laptops" />
            </FormField>
            <FormField label="Descripción">
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="resize-none" placeholder="Descripción opcional..." />
            </FormField>
            <FormField label="Orden">
              <Input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} />
            </FormField>
            {modalMode === 'edit' && (
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  className="w-9 h-5 rounded-full transition-all duration-300 relative flex-shrink-0"
                  style={{ background: form.active ? '#111827' : '#e5e7eb' }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300" style={{ left: form.active ? '17px' : '1px' }} />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Categoría activa</span>
              </label>
            )}
            <ErrorBanner message={saveError} />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setModalMode(null)}>Cancelar</Button>
              <SaveButton className="flex-1" onClick={handleSave} loading={saving} disabled={!form.name.trim()}>
                Guardar
              </SaveButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
