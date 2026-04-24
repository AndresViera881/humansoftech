'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { api, ApiCategory, slugify } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ModalMode = 'create' | 'edit';

interface FormState { name: string; slug: string; description: string; sortOrder: string; active: boolean }
const emptyForm = (): FormState => ({ name: '', slug: '', description: '', sortOrder: '0', active: true });

export default function AdminCategoriesGrid() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [editTarget, setEditTarget] = useState<ApiCategory | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ApiCategory | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setCategories(await api.categories.list()); }
    catch { setCategories([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setForm(emptyForm()); setEditTarget(null); setSaveError(''); setModalMode('create'); };
  const openEdit = (c: ApiCategory) => {
    setForm({ name: c.name, slug: c.slug, description: c.description ?? '', sortOrder: String(c.sortOrder), active: c.active });
    setEditTarget(c); setSaveError(''); setModalMode('edit');
  };
  const setName = (name: string) => setForm(f => ({ ...f, name, slug: slugify(name) }));

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true); setSaveError('');
    try {
      if (modalMode === 'create') {
        const created = await api.categories.create({ name: form.name, slug: form.slug || slugify(form.name), description: form.description || undefined, sortOrder: Number(form.sortOrder) });
        setCategories(prev => [...prev, created]);
      } else if (editTarget) {
        const updated = await api.categories.update(editTarget.id, { name: form.name, slug: form.slug, description: form.description || undefined, active: form.active, sortOrder: Number(form.sortOrder) });
        setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
      }
      setModalMode(null);
    } catch (e) { setSaveError(e instanceof Error ? e.message : 'Error al guardar'); }
    finally { setSaving(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setDeletingId(deleteConfirm.id);
    const cat = deleteConfirm;
    setDeleteConfirm(null);
    try {
      await api.categories.delete(cat.id);
      setCategories(prev => prev.filter(x => x.id !== cat.id));
      toast.success('Categoría eliminada');
    } catch {
      toast.error('No se pudo eliminar la categoría');
    } finally { setDeletingId(null); }
  };

  const toggleActive = async (c: ApiCategory) => {
    try {
      const updated = await api.categories.update(c.id, { active: !c.active });
      setCategories(prev => prev.map(x => x.id === updated.id ? updated : x));
    } catch { /* ignore */ }
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar categoría..." className="pl-9" />
        </div>
        <Button variant="outline" onClick={load} className="flex-shrink-0">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </Button>
        <Button onClick={openCreate} className="flex-shrink-0">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agregar
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} categoría{filtered.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border shadow-sm">
        <div className="hidden sm:grid text-xs font-semibold uppercase tracking-widest px-4 py-3 text-muted-foreground bg-muted/40 border-b"
          style={{ gridTemplateColumns: '2fr 1fr 1fr 80px 120px' }}>
          <span>Categoría</span><span>Slug</span><span>Descripción</span>
          <span className="text-center">Activa</span><span className="text-center">Acciones</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 bg-white">
            <div className="w-5 h-5 rounded-full border-2 animate-spin border-border border-t-foreground" />
            <span className="text-sm text-muted-foreground">Cargando...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 bg-white">
            <svg className="w-10 h-10 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M3 7h18M3 12h18M3 17h18" /></svg>
            <span className="text-sm text-muted-foreground">Sin categorías</span>
          </div>
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
                  <div className="flex items-center justify-center gap-1.5">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(c)}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteConfirm(c)} disabled={deletingId === c.id}>
                      {deletingId === c.id
                        ? <div className="w-3 h-3 rounded-full border animate-spin border-destructive/30 border-t-destructive" />
                        : <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                    </Button>
                  </div>
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
                  <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => openEdit(c)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteConfirm(c)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={open => !open && setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar categoría?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{deleteConfirm?.name}</span> — Se eliminará permanentemente.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" className="flex-1" onClick={handleDeleteConfirm}>Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={!!modalMode} onOpenChange={open => !open && setModalMode(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{modalMode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre</Label>
              <Input value={form.name} onChange={e => setName(e.target.value)} placeholder="ej. Laptops" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug</Label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="ej. laptops" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripción</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="resize-none" placeholder="Descripción opcional..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Orden</Label>
              <Input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} />
            </div>
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
            {saveError && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
                <span className="text-xs font-medium text-destructive">{saveError}</span>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setModalMode(null)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSave} disabled={saving || !form.name.trim()}>
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 rounded-full animate-spin border-primary-foreground/30 border-t-primary-foreground" />
                    Guardando...
                  </span>
                ) : 'Guardar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
