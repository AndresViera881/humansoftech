'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { api, ApiCategory, ApiSubcategory, slugify } from '@/lib/api';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/ui/form-field';
import { SaveButton } from '@/components/ui/save-button';
import { ErrorBanner } from '@/components/ui/error-banner';

interface FormState { name: string; slug: string; description: string; categoryId: string }
const emptyForm = (): FormState => ({ name: '', slug: '', description: '', categoryId: '' });

export default function AdminSubcategoriesGrid() {
  const [search, setSearch] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ApiSubcategory | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saveError, setSaveError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ApiSubcategory | null>(null);

  const { data, loading, refetch } = useApiData(() =>
    Promise.all([api.subcategories.list(), api.categories.list()])
      .then(([subs, cats]) => ({ subs, cats }))
  );
  const subcategories = data?.subs ?? [];
  const categories: ApiCategory[] = data?.cats ?? [];

  const { mutate: saveSubcategory, loading: saving } = useMutation(
    async (f: FormState) => {
      if (!editTarget) {
        return api.subcategories.create({ name: f.name, slug: f.slug || slugify(f.name), description: f.description || undefined, categoryId: f.categoryId });
      }
      return api.subcategories.update(editTarget.id, { name: f.name, slug: f.slug, description: f.description || undefined });
    },
    { onSuccess: () => { refetch(); setModalOpen(false); }, onError: setSaveError }
  );

  const { mutate: deleteSubcategory } = useMutation((id: string) => api.subcategories.delete(id));

  const filtered = subcategories.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategoryId || s.categoryId === filterCategoryId;
    return matchesSearch && matchesCategory;
  });

  const openCreate = () => { setForm(emptyForm()); setEditTarget(null); setSaveError(''); setModalOpen(true); };
  const openEdit = (s: ApiSubcategory) => {
    setForm({ name: s.name, slug: s.slug, description: s.description ?? '', categoryId: s.categoryId });
    setEditTarget(s); setSaveError(''); setModalOpen(true);
  };

  const handleSave = () => { if (form.name.trim() && (editTarget || form.categoryId)) saveSubcategory(form); };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    const { id, name } = deleteConfirm;
    setDeleteConfirm(null);
    setDeletingId(id);
    const result = await deleteSubcategory(id);
    setDeletingId(null);
    if (result !== null) {
      refetch();
      toast.success(`"${name}" eliminada`);
    } else {
      toast.error('No se pudo eliminar la subcategoría');
    }
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name ?? '—';

  return (
    <div className="flex flex-col gap-4">

      <AdminToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar subcategoría..."
        onRefresh={refetch}
        onAdd={openCreate}
        filters={
          <Select value={filterCategoryId || '_all'} onValueChange={v => setFilterCategoryId(v === '_all' ? '' : v)}>
            <SelectTrigger className="w-full sm:w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todas las categorías</SelectItem>
              {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />

      <p className="text-xs text-muted-foreground">{filtered.length} subcategoría{filtered.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border shadow-sm">
        <div className="hidden sm:grid text-xs font-semibold uppercase tracking-widest px-4 py-3 text-muted-foreground bg-muted/40 border-b"
          style={{ gridTemplateColumns: '2fr 1.5fr 1fr 100px' }}>
          <span>Subcategoría</span><span>Categoría padre</span><span>Descripción</span><span className="text-center">Acciones</span>
        </div>

        {loading ? (
          <TableLoading />
        ) : filtered.length === 0 ? (
          <TableEmpty message="Sin subcategorías" />
        ) : (
          <>
            <div className="hidden sm:block">
              {filtered.map((s, i) => (
                <div key={s.id} className="grid items-center px-4 py-3 transition-colors hover:bg-muted/20"
                  style={{ gridTemplateColumns: '2fr 1.5fr 1fr 100px', background: i % 2 === 0 ? 'var(--card)' : 'var(--surface-2)', borderBottom: i < filtered.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                  <div>
                    <p className="text-sm font-semibold truncate">{s.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{s.slug}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-lg inline-block bg-muted text-foreground/70">{getCategoryName(s.categoryId)}</span>
                  <span className="text-xs truncate text-muted-foreground">{s.description ?? '—'}</span>
                  <RowActions onEdit={() => openEdit(s)} onDelete={() => setDeleteConfirm(s)} deleting={deletingId === s.id} />
                </div>
              ))}
            </div>
            <div className="flex sm:hidden flex-col divide-y">
              {filtered.map(s => (
                <div key={s.id} className="px-4 py-3 flex items-center gap-3 bg-white">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{s.name}</p>
                    <p className="text-xs truncate mt-0.5 text-muted-foreground">{getCategoryName(s.categoryId)}</p>
                  </div>
                  <RowActions variant="icon-md" onEdit={() => openEdit(s)} onDelete={() => setDeleteConfirm(s)} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmDeleteDialog
        open={!!deleteConfirm}
        title="¿Eliminar subcategoría?"
        itemName={deleteConfirm?.name}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Create / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={open => !open && setModalOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Editar Subcategoría' : 'Nueva Subcategoría'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <FormField label="Nombre">
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} placeholder="ej. Gaming" />
            </FormField>
            <FormField label="Slug">
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
            </FormField>
            {!editTarget && (
              <FormField label="Categoría padre">
                <Select value={form.categoryId || '_none'} onValueChange={v => setForm(f => ({ ...f, categoryId: v === '_none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="— Selecciona categoría —" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">— Selecciona categoría —</SelectItem>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
            )}
            <FormField label="Descripción">
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="resize-none" placeholder="Descripción opcional..." />
            </FormField>
            <ErrorBanner message={saveError} />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <SaveButton className="flex-1" onClick={handleSave} loading={saving} disabled={!form.name.trim() || (!editTarget && !form.categoryId)}>
                Guardar
              </SaveButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
