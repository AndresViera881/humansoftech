'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Swal from 'sweetalert2';
import { api, ApiProduct, ApiCategory, slugify } from '@/lib/api';

interface Props {
  onAdd?: () => void;
}

export default function AdminProductsGrid({ onAdd }: Props) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<ApiProduct | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', description: '', badge: '', stock: '0', featured: false, condition: 'nuevo' as 'nuevo' | 'seminuevo' });
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editUploadingCount, setEditUploadingCount] = useState(0);
  const [editDragging, setEditDragging] = useState(false);
  const [editState, setEditState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [editError, setEditError] = useState('');
  const editFileRef = useRef<HTMLInputElement>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Record<string, string> = {};
      if (categoryId) filters.categoryId = categoryId;
      if (search) filters.search = search;
      const res = await api.products.list(filters);
      setProducts(res.data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, search]);

  useEffect(() => {
    api.categories.list().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(loadProducts, 300);
    return () => clearTimeout(t);
  }, [loadProducts]);

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      html: `<span style="color:#4b5563;font-size:14px"><b style="color:#111827">${name}</b><br/>Esta acción no se puede deshacer.</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#f9fafb',
      color: '#111827',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#e8dfd3',
      customClass: { popup: 'swal-dark-popup', cancelButton: 'swal-cancel-btn' },
    });
    if (!result.isConfirmed) return;
    setDeletingId(id);
    try {
      await api.products.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      Swal.fire({ title: 'Eliminado', text: 'El producto fue eliminado correctamente.', icon: 'success', timer: 1800, showConfirmButton: false, background: '#f9fafb', color: '#111827' });
    } catch {
      Swal.fire({ title: 'Error', text: 'No se pudo eliminar el producto.', icon: 'error', background: '#f9fafb', color: '#111827', confirmButtonColor: '#111827' });
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (p: ApiProduct) => {
    setEditProduct(p);
    setEditForm({ name: p.name, price: p.price, description: p.description ?? '', badge: p.badge ?? '', stock: String(p.stock), featured: p.featured, condition: p.condition ?? 'nuevo' });
    setEditImages(p.images ?? []);
    setEditUploadingCount(0);
    setEditDragging(false);
    setEditState('idle');
    setEditError('');
  };

  const uploadEditFiles = async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) return;
    setEditUploadingCount(c => c + imageFiles.length);
    const previews = imageFiles.map(f => URL.createObjectURL(f));
    setEditImages(prev => [...prev, ...previews]);
    try {
      const results = await api.upload.images(imageFiles);
      const urls = results.map(r => r.url);
      setEditImages(prev => [...prev.filter(u => !previews.includes(u)), ...urls]);
    } catch {
      setEditImages(prev => prev.filter(u => !previews.includes(u)));
    } finally {
      setEditUploadingCount(c => c - imageFiles.length);
    }
  };

  const handleEditDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setEditDragging(false);
    uploadEditFiles(Array.from(e.dataTransfer.files));
  };

  const handleEditFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadEditFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleEditSave = async () => {
    if (!editProduct) return;
    setEditState('loading');
    try {
      const updated = await api.products.update(editProduct.id, {
        name: editForm.name,
        slug: slugify(editForm.name) + '-' + Date.now(),
        price: Number(editForm.price),
        description: editForm.description || undefined,
        badge: editForm.badge || undefined,
        stock: Number(editForm.stock),
        featured: editForm.featured,
        images: editImages,
        condition: editForm.condition,
      });
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditState('success');
      setTimeout(() => { setEditProduct(null); setEditState('idle'); }, 1000);
    } catch (e) {
      setEditState('error');
      setEditError(e instanceof Error ? e.message : 'Error al actualizar');
      setTimeout(() => setEditState('idle'), 3000);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: '#fff',
    border: '1.5px solid rgba(0,0,0,0.12)',
    borderRadius: '8px',
    color: '#111827',
    padding: '8px 12px',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = { color: '#4b5563' };

  return (
    <div className="flex flex-col gap-4">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar producto..." style={{ ...inputStyle, paddingLeft: '36px' }} />
        </div>
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
          style={{ ...inputStyle, width: 'auto', minWidth: '180px', cursor: 'pointer', colorScheme: 'light' }}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={loadProducts}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.12)', color: '#111827' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>

        {onAdd && (
          <button onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex-shrink-0"
            style={{ background: '#111827', border: '1px solid #111827', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#374151'; e.currentTarget.style.borderColor = '#374151'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#111827'; e.currentTarget.style.borderColor = '#111827'; }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar
          </button>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
        <span>{products.length} producto{products.length !== 1 ? 's' : ''}</span>
        {(search || categoryId) && (
          <button onClick={() => { setSearch(''); setCategoryId(''); }} style={{ color: '#111827' }}>
            · Limpiar filtros
          </button>
        )}
      </div>

      {/* ── Desktop table (sm+) ── */}
      <div className="hidden sm:block rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div className="grid text-xs font-semibold uppercase tracking-widest px-4 py-3"
          style={{ gridTemplateColumns: '2fr 1fr 80px 70px 70px 70px 160px', background: '#f9fafb', borderBottom: '1px solid rgba(0,0,0,0.08)', color: '#9ca3af' }}>
          <span>Producto</span><span>Categoría</span>
          <span className="text-right">Precio</span>
          <span className="text-center">Stock</span>
          <span className="text-center">Cond.</span>
          <span className="text-center">Dest.</span>
          <span className="text-center">Acciones</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3" style={{ background: '#fff' }}>
            <div className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(0,0,0,0.08)', borderTopColor: '#111827' }} />
            <span className="text-sm" style={{ color: '#9ca3af' }}>Cargando...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2" style={{ background: '#fff' }}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: 'rgba(0,0,0,0.12)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
            <span className="text-sm" style={{ color: '#9ca3af' }}>Sin productos</span>
          </div>
        ) : (
          products.map((p, i) => (
            <div key={p.id}
              className="grid items-center px-4 py-3 transition-colors duration-150"
              style={{ gridTemplateColumns: '2fr 1fr 80px 70px 70px 70px 160px', background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: i < products.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.03)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = i % 2 === 0 ? '#fff' : '#f9fafb'; }}>
              <div className="flex flex-col gap-0.5 min-w-0 pr-3">
                <span className="text-sm font-semibold truncate" style={{ color: '#111827' }}>{p.name}</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {p.badge && (
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                      style={{ background: 'rgba(0,0,0,0.05)', color: '#111827', border: '1px solid rgba(0,0,0,0.1)', fontSize: '10px' }}>
                      {p.badge}
                    </span>
                  )}
                  {p.description && (
                    <span className="text-xs truncate" style={{ color: '#9ca3af', maxWidth: '200px' }}>{p.description}</span>
                  )}
                </div>
              </div>
              <span className="text-xs truncate" style={{ color: '#4b5563' }}>{p.category.name}</span>
              <span className="text-sm font-bold text-right" style={{ color: '#111827' }}>${Number(p.price).toLocaleString('es-AR')}</span>
              <span className="text-sm text-center font-medium" style={{ color: p.stock > 0 ? '#111827' : '#dc2626' }}>{p.stock}</span>
              <div className="flex justify-center">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={p.condition === 'seminuevo'
                    ? { background: 'rgba(245,158,11,0.1)', color: '#d97706', border: '1px solid rgba(245,158,11,0.2)' }
                    : { background: 'rgba(0,0,0,0.05)', color: '#111827', border: '1px solid rgba(0,0,0,0.1)' }}>
                  {p.condition === 'seminuevo' ? 'Semi' : 'Nuevo'}
                </span>
              </div>
              <div className="flex justify-center">
                {p.featured
                  ? <span style={{ color: '#f59e0b', fontSize: '14px' }}>★</span>
                  : <span style={{ color: 'rgba(0,0,0,0.12)', fontSize: '14px' }}>☆</span>}
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <button onClick={() => openEdit(p)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)', color: '#111827' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button onClick={() => handleDelete(p.id, p.name)} disabled={deletingId === p.id}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.14)', color: '#dc2626' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; }}>
                  {deletingId === p.id
                    ? <div className="w-3 h-3 rounded-full border animate-spin" style={{ borderColor: 'rgba(220,38,38,0.2)', borderTopColor: '#dc2626' }} />
                    : <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>}
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Mobile accordion (xs only) ── */}
      <div className="flex sm:hidden flex-col gap-2">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 rounded-2xl" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }}>
            <div className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(0,0,0,0.08)', borderTopColor: '#111827' }} />
            <span className="text-sm" style={{ color: '#9ca3af' }}>Cargando...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 rounded-2xl" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: 'rgba(0,0,0,0.12)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
            <span className="text-sm" style={{ color: '#9ca3af' }}>Sin productos</span>
          </div>
        ) : (
          products.map(p => {
            const isOpen = expandedId === p.id;
            return (
              <div key={p.id} className="rounded-2xl overflow-hidden"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>

                {/* Accordion header — always visible */}
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  onClick={() => setExpandedId(isOpen ? null : p.id)}>

                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
                    style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.08)' }}>
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                      : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                        </svg>
                    }
                  </div>

                  {/* Name + category */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#111827' }}>{p.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-xs" style={{ color: '#9ca3af' }}>{p.category.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                        style={p.condition === 'seminuevo'
                          ? { background: 'rgba(245,158,11,0.1)', color: '#d97706', border: '1px solid rgba(245,158,11,0.2)', fontSize: '10px' }
                          : { background: 'rgba(0,0,0,0.05)', color: '#111827', border: '1px solid rgba(0,0,0,0.1)', fontSize: '10px' }}>
                        {p.condition === 'seminuevo' ? 'Seminuevo' : 'Nuevo'}
                      </span>
                      {p.badge && (
                        <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                          style={{ background: 'rgba(0,0,0,0.05)', color: '#111827', border: '1px solid rgba(0,0,0,0.1)', fontSize: '10px' }}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <span className="text-sm font-bold flex-shrink-0 mr-1" style={{ color: '#111827' }}>
                    ${Number(p.price).toLocaleString('es-AR')}
                  </span>

                  {/* Chevron */}
                  <svg className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                    style={{ color: '#9ca3af', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div className="px-4 pb-4 flex flex-col gap-3"
                    style={{ borderTop: '1px solid var(--border)' }}>

                    {/* Detail rows */}
                    <div className="grid grid-cols-2 gap-2 pt-3">
                      {[
                        { label: 'Precio', value: `$${Number(p.price).toLocaleString('es-AR')}`, color: '#111827' },
                        { label: 'Stock', value: String(p.stock), color: p.stock > 0 ? '#111827' : '#dc2626' },
                        { label: 'Condición', value: p.condition === 'seminuevo' ? 'Seminuevo' : 'Nuevo', color: p.condition === 'seminuevo' ? '#d97706' : '#111827' },
                        { label: 'Destacado', value: p.featured ? '★ Sí' : '☆ No', color: p.featured ? '#f59e0b' : '#9ca3af' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-xl px-3 py-2"
                          style={{ background: '#f9fafb', border: '1px solid var(--border)' }}>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#9ca3af' }}>{label}</p>
                          <p className="text-sm font-bold" style={{ color }}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {p.description && (
                      <div className="rounded-xl px-3 py-2"
                        style={{ background: '#f9fafb', border: '1px solid var(--border)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Descripción</p>
                        <p className="text-xs" style={{ color: '#4b5563', lineHeight: '1.6' }}>{p.description}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => openEdit(p)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold"
                        style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)', color: '#111827' }}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} disabled={deletingId === p.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold"
                        style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.14)', color: '#dc2626' }}>
                        {deletingId === p.id
                          ? <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(220,38,38,0.2)', borderTopColor: '#dc2626' }} />
                          : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>}
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden animate-fade-in-up flex flex-col"
            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.15)', maxHeight: '90vh' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)', background: '#f9fafb' }}>
              <div>
                <h2 className="font-black text-base" style={{ color: '#111827' }}>Editar Producto</h2>
                <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{editProduct.name}</p>
              </div>
              <button onClick={() => setEditProduct(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                style={{ background: 'rgba(0,0,0,0.06)', color: '#9ca3af' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; e.currentTarget.style.color = '#dc2626'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; e.currentTarget.style.color = '#9ca3af'; }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4" style={{ minHeight: 0 }}>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>Nombre</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>Precio ($)</label>
                  <input type="number" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>Stock</label>
                  <input type="number" value={editForm.stock} onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))} style={inputStyle} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>Badge</label>
                <input type="text" value={editForm.badge} onChange={e => setEditForm(f => ({ ...f, badge: e.target.value }))} placeholder="ej. OFERTA, HOT..." style={inputStyle} />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>Condición</label>
                <div className="flex gap-2">
                  {([
                    { value: 'nuevo', label: 'Nuevo' },
                    { value: 'seminuevo', label: 'Seminuevo' },
                  ] as { value: 'nuevo' | 'seminuevo'; label: string }[]).map(({ value, label }) => (
                    <button key={value} type="button"
                      onClick={() => setEditForm(f => ({ ...f, condition: value }))}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
                      style={{
                        background: editForm.condition === value ? '#111827' : '#f9fafb',
                        color: editForm.condition === value ? '#fff' : '#4b5563',
                        border: `1.5px solid ${editForm.condition === value ? '#111827' : 'var(--border)'}`,
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>Descripción</label>
                <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'none' }} />
              </div>

              {/* ── Image section ── */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>
                  Imágenes
                  <span className="ml-1.5 normal-case font-normal" style={{ color: 'rgba(255,255,255,0.2)' }}>(arrastra o haz clic para añadir)</span>
                </label>

                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setEditDragging(true); }}
                  onDragLeave={() => setEditDragging(false)}
                  onDrop={handleEditDrop}
                  onClick={() => editFileRef.current?.click()}
                  className="w-full rounded-xl cursor-pointer flex items-center justify-center gap-2 py-3 transition-all duration-200"
                  style={{
                    border: `2px dashed ${editDragging ? '#111827' : 'rgba(0,0,0,0.12)'}`,
                    background: editDragging ? 'rgba(0,0,0,0.03)' : '#f9fafb',
                    minHeight: '56px',
                  }}>
                  <input ref={editFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleEditFile} />
                  {editUploadingCount > 0 ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 animate-spin flex-shrink-0"
                        style={{ borderColor: 'rgba(0,0,0,0.1)', borderTopColor: '#111827' }} />
                      <span className="text-xs" style={{ color: '#111827' }}>
                        Subiendo {editUploadingCount} {editUploadingCount === 1 ? 'imagen' : 'imágenes'}...
                      </span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                        stroke={editDragging ? '#111827' : '#9ca3af'} strokeWidth={1.5}>
                        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-xs" style={{ color: '#9ca3af' }}>
                        {editDragging ? 'Suelta aquí' : 'Añadir imágenes'}
                      </span>
                    </>
                  )}
                </div>

                {/* Thumbnail grid */}
                {editImages.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {editImages.map((url, i) => (
                      <div key={url} className="relative rounded-lg overflow-hidden group"
                        style={{ aspectRatio: '1', background: '#f9fafb', border: `1px solid ${i === 0 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute bottom-0.5 left-0.5 text-[8px] font-bold px-1 rounded"
                            style={{ background: 'rgba(0,0,0,0.85)', color: '#fff' }}>Principal</span>
                        )}
                        <button
                          onClick={() => setEditImages(prev => prev.filter(u => u !== url))}
                          className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: 'rgba(0,0,0,0.75)', color: '#fff' }}>
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* ── end images ── */}

              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setEditForm(f => ({ ...f, featured: !f.featured }))}
                  className="w-9 h-5 rounded-full transition-all duration-300 relative flex-shrink-0"
                  style={{ background: editForm.featured ? '#111827' : '#e5e7eb' }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow"
                    style={{ left: editForm.featured ? '17px' : '1px' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: '#4b5563' }}>Producto destacado</span>
              </label>

              {editState === 'error' && (
                <div className="rounded-lg px-3 py-2 text-xs font-semibold"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {editError}
                </div>
              )}
              {editState === 'success' && (
                <div className="rounded-lg px-3 py-2 text-xs font-semibold"
                  style={{ background: 'rgba(34,197,94,0.08)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                  ✓ Producto actualizado
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={() => setEditProduct(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.12)', color: '#4b5563' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f0ebe0'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; }}>
                  Cancelar
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={editState === 'loading' || editState === 'success' || editUploadingCount > 0}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
                  style={{
                    background: editState !== 'idle' || editUploadingCount > 0 ? 'rgba(0,0,0,0.06)' : '#111827',
                    border: '1px solid rgba(0,0,0,0.12)',
                    color: editState !== 'idle' || editUploadingCount > 0 ? 'rgba(0,0,0,0.3)' : '#fff',
                    cursor: editState !== 'idle' || editUploadingCount > 0 ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={e => { if (editState === 'idle' && editUploadingCount === 0) e.currentTarget.style.background = '#000000'; }}
                  onMouseLeave={e => { if (editState === 'idle' && editUploadingCount === 0) e.currentTarget.style.background = '#111827'; }}>
                  {editUploadingCount > 0 ? 'Esperando imágenes...' :
                    editState === 'loading' ? 'Guardando...' :
                    editState === 'success' ? '✓ Guardado' : 'Guardar cambios'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
