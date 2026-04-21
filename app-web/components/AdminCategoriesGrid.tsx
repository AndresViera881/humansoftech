'use client';

import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { api, ApiCategory, slugify } from '@/lib/api';

const inputStyle: React.CSSProperties = {
  background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)',
  borderRadius: '8px', color: '#111827', padding: '8px 12px',
  fontSize: '13px', width: '100%', outline: 'none',
};
const labelStyle: React.CSSProperties = { color: '#4b5563', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' };

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

  const load = useCallback(async () => {
    setLoading(true);
    try { setCategories(await api.categories.list()); }
    catch { setCategories([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm(emptyForm());
    setEditTarget(null);
    setSaveError('');
    setModalMode('create');
  };

  const openEdit = (c: ApiCategory) => {
    setForm({ name: c.name, slug: c.slug, description: c.description ?? '', sortOrder: String(c.sortOrder), active: c.active });
    setEditTarget(c);
    setSaveError('');
    setModalMode('edit');
  };

  const setName = (name: string) => setForm(f => ({ ...f, name, slug: slugify(name) }));

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    setSaveError('');
    try {
      if (modalMode === 'create') {
        const created = await api.categories.create({ name: form.name, slug: form.slug || slugify(form.name), description: form.description || undefined, sortOrder: Number(form.sortOrder) });
        setCategories(prev => [...prev, created]);
      } else if (editTarget) {
        const updated = await api.categories.update(editTarget.id, { name: form.name, slug: form.slug, description: form.description || undefined, active: form.active, sortOrder: Number(form.sortOrder) });
        setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
      }
      setModalMode(null);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: ApiCategory) => {
    const result = await Swal.fire({
      title: '¿Eliminar categoría?',
      html: `<span style="color:#4b5563;font-size:14px"><b style="color:#111827">${c.name}</b><br/>Se eliminará permanentemente.</span>`,
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
      background: '#f9fafb', color: '#111827',
      confirmButtonColor: '#ef4444', cancelButtonColor: '#e8dfd3',
      customClass: { popup: 'swal-dark-popup', cancelButton: 'swal-cancel-btn' },
    });
    if (!result.isConfirmed) return;
    setDeletingId(c.id);
    try {
      await api.categories.delete(c.id);
      setCategories(prev => prev.filter(x => x.id !== c.id));
    } catch {
      Swal.fire({ title: 'Error', text: 'No se pudo eliminar.', icon: 'error', background: '#f9fafb', color: '#111827', confirmButtonColor: '#111827' });
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
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar categoría..." style={{ ...inputStyle, paddingLeft: '36px' }} />
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.12)', color: '#111827' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold flex-shrink-0"
          style={{ background: '#111827', border: '1px solid #111827', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#374151'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#111827'; }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agregar
        </button>
      </div>

      <p className="text-xs" style={{ color: '#9ca3af' }}>{filtered.length} categoría{filtered.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div className="hidden sm:grid text-xs font-semibold uppercase tracking-widest px-4 py-3"
          style={{ gridTemplateColumns: '2fr 1fr 1fr 80px 120px', background: '#f9fafb', borderBottom: '1px solid rgba(0,0,0,0.07)', color: '#9ca3af' }}>
          <span>Categoría</span><span>Slug</span><span>Descripción</span>
          <span className="text-center">Activa</span><span className="text-center">Acciones</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3" style={{ background: '#fff' }}>
            <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(0,0,0,0.1)', borderTopColor: '#111827' }} />
            <span className="text-sm" style={{ color: '#9ca3af' }}>Cargando...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2" style={{ background: '#fff' }}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#d1d5db" strokeWidth={1}><path d="M3 7h18M3 12h18M3 17h18" /></svg>
            <span className="text-sm" style={{ color: '#9ca3af' }}>Sin categorías</span>
          </div>
        ) : (
          <>
            {/* Desktop rows */}
            <div className="hidden sm:block">
              {filtered.map((c, i) => (
                <div key={c.id} className="grid items-center px-4 py-3 transition-colors duration-100"
                  style={{ gridTemplateColumns: '2fr 1fr 1fr 80px 120px', background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: i < filtered.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.02)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#fff' : '#f9fafb'; }}>
                  <span className="text-sm font-semibold truncate pr-3" style={{ color: '#111827' }}>{c.name}</span>
                  <span className="text-xs truncate font-mono" style={{ color: '#6b7280' }}>{c.slug}</span>
                  <span className="text-xs truncate" style={{ color: '#9ca3af' }}>{c.description ?? '—'}</span>
                  <div className="flex justify-center">
                    <button onClick={() => toggleActive(c)}
                      className="w-9 h-5 rounded-full relative transition-all duration-200"
                      style={{ background: c.active ? '#111827' : '#e5e7eb' }}>
                      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
                        style={{ left: c.active ? '17px' : '1px' }} />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => openEdit(c)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                      style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)', color: '#374151' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(c)} disabled={deletingId === c.id}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                      style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.14)', color: '#dc2626' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.12)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; }}>
                      {deletingId === c.id ? <div className="w-3 h-3 rounded-full border animate-spin" style={{ borderColor: 'rgba(220,38,38,0.2)', borderTopColor: '#dc2626' }} /> : <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="flex sm:hidden flex-col divide-y" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              {filtered.map(c => (
                <div key={c.id} className="px-4 py-3 flex items-center gap-3" style={{ background: '#fff' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#111827' }}>{c.name}</p>
                    <p className="text-xs font-mono truncate mt-0.5" style={{ color: '#9ca3af' }}>{c.slug}</p>
                  </div>
                  <button onClick={() => toggleActive(c)}
                    className="w-9 h-5 rounded-full relative transition-all duration-200 flex-shrink-0"
                    style={{ background: c.active ? '#111827' : '#e5e7eb' }}>
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200" style={{ left: c.active ? '17px' : '1px' }} />
                  </button>
                  <button onClick={() => openEdit(c)} className="p-2 rounded-lg flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)', color: '#374151' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(c)} className="p-2 rounded-lg flex-shrink-0" style={{ background: 'rgba(220,38,38,0.06)', color: '#dc2626' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden animate-fade-in-up flex flex-col"
            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.15)', maxHeight: '90vh' }}>

            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#f9fafb' }}>
              <h2 className="font-black text-base" style={{ color: '#111827' }}>
                {modalMode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
              </h2>
              <button onClick={() => setModalMode(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150"
                style={{ background: 'rgba(0,0,0,0.06)', color: '#9ca3af' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; e.currentTarget.style.color = '#dc2626'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; e.currentTarget.style.color = '#9ca3af'; }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4" style={{ minHeight: 0 }}>
              <div>
                <label className="block mb-1.5" style={labelStyle}>Nombre</label>
                <input type="text" value={form.name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="ej. Laptops" />
              </div>
              <div>
                <label className="block mb-1.5" style={labelStyle}>Slug</label>
                <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={inputStyle} placeholder="ej. laptops" />
              </div>
              <div>
                <label className="block mb-1.5" style={labelStyle}>Descripción</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'none' }} placeholder="Descripción opcional..." />
              </div>
              <div>
                <label className="block mb-1.5" style={labelStyle}>Orden</label>
                <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} style={inputStyle} />
              </div>
              {modalMode === 'edit' && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                    className="w-9 h-5 rounded-full transition-all duration-300 relative flex-shrink-0"
                    style={{ background: form.active ? '#111827' : '#e5e7eb' }}>
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300" style={{ left: form.active ? '17px' : '1px' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#4b5563' }}>Categoría activa</span>
                </label>
              )}
              {saveError && <p className="text-xs font-semibold rounded-lg px-3 py-2" style={{ background: 'rgba(220,38,38,0.06)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.15)' }}>{saveError}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setModalMode(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.12)', color: '#4b5563' }}>
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving || !form.name.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-150"
                  style={{ background: saving || !form.name.trim() ? 'rgba(0,0,0,0.1)' : '#111827', color: saving || !form.name.trim() ? 'rgba(0,0,0,0.3)' : '#fff', cursor: saving || !form.name.trim() ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
