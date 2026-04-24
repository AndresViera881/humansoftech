'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { api, ApiProduct, ApiCategory, slugify } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { useMutation } from '@/hooks/useMutation';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props { onAdd?: () => void }

export default function AdminProductsGrid({ onAdd }: Props) {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<ApiProduct | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', description: '', badge: '', stock: '0', featured: false, condition: 'nuevo' as 'nuevo' | 'seminuevo' });
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editUploadingCount, setEditUploadingCount] = useState(0);
  const [editDragging, setEditDragging] = useState(false);
  const editFileRef = useRef<HTMLInputElement>(null);

  const { data: productsRes, loading, refetch: refetchProducts } = useApiData(
    () => {
      const filters: Record<string, string> = {};
      if (categoryId) filters.categoryId = categoryId;
      if (search) filters.search = search;
      return api.products.list(filters);
    },
    [categoryId, search]
  );
  const products = productsRes?.data ?? [];

  const { data: categoriesData } = useApiData(() => api.categories.list());
  const categories: ApiCategory[] = categoriesData ?? [];

  const { mutate: deleteProduct } = useMutation((id: string) => api.products.delete(id));

  const { mutate: saveProduct, loading: editSaving } = useMutation(
    async () => {
      if (!editProduct) throw new Error('No product');
      return api.products.update(editProduct.id, {
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
    },
    {
      onSuccess: () => { toast.success('Producto actualizado'); setEditProduct(null); refetchProducts(); },
      onError: (msg) => toast.error(msg),
    }
  );

  const openEdit = (p: ApiProduct) => {
    setEditProduct(p);
    setEditForm({ name: p.name, price: p.price, description: p.description ?? '', badge: p.badge ?? '', stock: String(p.stock), featured: p.featured, condition: p.condition ?? 'nuevo' });
    setEditImages(p.images ?? []);
    setEditUploadingCount(0);
    setEditDragging(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { id, name } = deleteConfirm;
    setDeleteConfirm(null);
    setDeletingId(id);
    const result = await deleteProduct(id);
    setDeletingId(null);
    if (result !== null) {
      refetchProducts();
      toast.success(`"${name}" eliminado`);
    } else {
      toast.error('No se pudo eliminar el producto');
    }
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

  const handleEditDrop = (e: React.DragEvent) => { e.preventDefault(); setEditDragging(false); uploadEditFiles(Array.from(e.dataTransfer.files)); };
  const handleEditFile = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) uploadEditFiles(Array.from(e.target.files)); e.target.value = ''; };

  return (
    <div className="flex flex-col gap-4">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..." className="pl-9" />
        </div>
        <Select value={categoryId || '_all'} onValueChange={v => setCategoryId(v === '_all' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Todas las categorías</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={refetchProducts} className="flex-shrink-0">
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
            Agregar
          </Button>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{products.length} producto{products.length !== 1 ? 's' : ''}</span>
        {(search || categoryId) && (
          <button onClick={() => { setSearch(''); setCategoryId(''); }} className="text-foreground hover:underline">
            · Limpiar filtros
          </button>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block rounded-2xl overflow-hidden border shadow-sm">
        <div className="grid text-xs font-semibold uppercase tracking-widest px-4 py-3 text-muted-foreground bg-muted/40 border-b"
          style={{ gridTemplateColumns: '2fr 1fr 80px 70px 70px 70px 160px' }}>
          <span>Producto</span><span>Categoría</span>
          <span className="text-right">Precio</span>
          <span className="text-center">Stock</span>
          <span className="text-center">Cond.</span>
          <span className="text-center">Dest.</span>
          <span className="text-center">Acciones</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 bg-white">
            <div className="w-5 h-5 rounded-full border-2 animate-spin border-border border-t-foreground" />
            <span className="text-sm text-muted-foreground">Cargando...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 bg-white">
            <svg className="w-10 h-10 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
            <span className="text-sm text-muted-foreground">Sin productos</span>
          </div>
        ) : (
          products.map((p, i) => (
            <div key={p.id}
              className="grid items-center px-4 py-3 transition-colors hover:bg-muted/30"
              style={{ gridTemplateColumns: '2fr 1fr 80px 70px 70px 70px 160px', background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: i < products.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
              <div className="flex flex-col gap-0.5 min-w-0 pr-3">
                <span className="text-sm font-semibold truncate">{p.name}</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {p.badge && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{p.badge}</Badge>}
                  {p.description && <span className="text-xs truncate text-muted-foreground" style={{ maxWidth: '200px' }}>{p.description}</span>}
                </div>
              </div>
              <span className="text-xs truncate text-muted-foreground">{p.category.name}</span>
              <span className="text-sm font-bold text-right">${Number(p.price).toLocaleString('es-AR')}</span>
              <span className={`text-sm text-center font-medium ${p.stock > 0 ? '' : 'text-destructive'}`}>{p.stock}</span>
              <div className="flex justify-center">
                <Badge variant="outline" className={`text-[10px] ${p.condition === 'seminuevo' ? 'text-amber-600 border-amber-200 bg-amber-50' : 'text-foreground'}`}>
                  {p.condition === 'seminuevo' ? 'Semi' : 'Nuevo'}
                </Badge>
              </div>
              <div className="flex justify-center">
                {p.featured ? <span className="text-amber-400 text-sm">★</span> : <span className="text-muted-foreground/30 text-sm">☆</span>}
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => openEdit(p)}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteConfirm({ id: p.id, name: p.name })} disabled={deletingId === p.id}>
                  {deletingId === p.id
                    ? <div className="w-3 h-3 rounded-full border animate-spin border-destructive/30 border-t-destructive" />
                    : <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>}
                  Eliminar
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile accordion */}
      <div className="flex sm:hidden flex-col gap-2">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 rounded-2xl bg-white border">
            <div className="w-5 h-5 rounded-full border-2 animate-spin border-border border-t-foreground" />
            <span className="text-sm text-muted-foreground">Cargando...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 rounded-2xl bg-white border">
            <svg className="w-10 h-10 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
            <span className="text-sm text-muted-foreground">Sin productos</span>
          </div>
        ) : (
          products.map(p => {
            const isOpen = expandedId === p.id;
            return (
              <div key={p.id} className="rounded-2xl overflow-hidden bg-white border shadow-sm">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  onClick={() => setExpandedId(isOpen ? null : p.id)}>
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center bg-muted/40 border">
                    {p.images?.[0]
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      : <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                        </svg>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">{p.category.name}</span>
                      <Badge variant="outline" className={`text-[10px] h-4 ${p.condition === 'seminuevo' ? 'text-amber-600 border-amber-200 bg-amber-50' : ''}`}>
                        {p.condition === 'seminuevo' ? 'Seminuevo' : 'Nuevo'}
                      </Badge>
                      {p.badge && <Badge variant="secondary" className="text-[10px] h-4">{p.badge}</Badge>}
                    </div>
                  </div>
                  <span className="text-sm font-bold flex-shrink-0 mr-1">${Number(p.price).toLocaleString('es-AR')}</span>
                  <svg className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 flex flex-col gap-3 border-t">
                    <div className="grid grid-cols-2 gap-2 pt-3">
                      {[
                        { label: 'Precio', value: `$${Number(p.price).toLocaleString('es-AR')}` },
                        { label: 'Stock', value: String(p.stock), className: p.stock > 0 ? '' : 'text-destructive' },
                        { label: 'Condición', value: p.condition === 'seminuevo' ? 'Seminuevo' : 'Nuevo' },
                        { label: 'Destacado', value: p.featured ? '★ Sí' : '☆ No' },
                      ].map(({ label, value, className }) => (
                        <div key={label} className="rounded-xl px-3 py-2 bg-muted/40 border">
                          <p className="text-xs font-semibold uppercase tracking-wider mb-0.5 text-muted-foreground">{label}</p>
                          <p className={`text-sm font-bold ${className ?? ''}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                    {p.description && (
                      <div className="rounded-xl px-3 py-2 bg-muted/40 border">
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-muted-foreground">Descripción</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <Button variant="outline" className="flex-1 gap-1.5" onClick={() => openEdit(p)}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </Button>
                      <Button variant="ghost" className="flex-1 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteConfirm({ id: p.id, name: p.name })} disabled={deletingId === p.id}>
                        {deletingId === p.id
                          ? <div className="w-4 h-4 rounded-full border-2 animate-spin border-destructive/20 border-t-destructive" />
                          : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>}
                        Eliminar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ConfirmDeleteDialog
        open={!!deleteConfirm}
        title="¿Eliminar producto?"
        itemName={deleteConfirm?.name}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
      />

      {/* Edit Dialog */}
      <Dialog open={!!editProduct} onOpenChange={open => !open && setEditProduct(null)}>
        <DialogContent className="sm:max-w-md flex flex-col p-0 gap-0 max-h-[90vh]">
          <DialogHeader className="px-6 py-4 border-b bg-muted/40 flex-shrink-0 text-left space-y-0.5 pr-12">
            <DialogTitle className="text-base font-black">Editar Producto</DialogTitle>
            <p className="text-xs text-muted-foreground">{editProduct?.name}</p>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4 min-h-0">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre</Label>
              <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precio ($)</Label>
                <Input type="number" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</Label>
                <Input type="number" value={editForm.stock} onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Badge</Label>
              <Input value={editForm.badge} onChange={e => setEditForm(f => ({ ...f, badge: e.target.value }))} placeholder="ej. OFERTA, HOT..." />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Condición</Label>
              <div className="flex gap-2">
                {(['nuevo', 'seminuevo'] as const).map(val => (
                  <button key={val} type="button"
                    onClick={() => setEditForm(f => ({ ...f, condition: val }))}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
                    style={{
                      background: editForm.condition === val ? '#111827' : '#f9fafb',
                      color: editForm.condition === val ? '#fff' : '#4b5563',
                      border: `1.5px solid ${editForm.condition === val ? '#111827' : 'rgba(0,0,0,0.1)'}`,
                    }}>
                    {val === 'nuevo' ? 'Nuevo' : 'Seminuevo'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripción</Label>
              <Textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={2} className="resize-none" />
            </div>

            {/* Images */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Imágenes <span className="normal-case font-normal text-muted-foreground/60">(arrastra o haz clic)</span>
              </Label>
              <div
                onDragOver={e => { e.preventDefault(); setEditDragging(true); }}
                onDragLeave={() => setEditDragging(false)}
                onDrop={handleEditDrop}
                onClick={() => editFileRef.current?.click()}
                className="w-full rounded-xl cursor-pointer flex items-center justify-center gap-2 py-3 transition-all duration-200"
                style={{ border: `2px dashed ${editDragging ? '#111827' : 'rgba(0,0,0,0.12)'}`, background: editDragging ? 'rgba(0,0,0,0.03)' : '#f9fafb', minHeight: '56px' }}>
                <input ref={editFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleEditFile} />
                {editUploadingCount > 0 ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 animate-spin flex-shrink-0 border-border border-t-foreground" />
                    <span className="text-xs">Subiendo {editUploadingCount} {editUploadingCount === 1 ? 'imagen' : 'imágenes'}...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                      stroke={editDragging ? '#111827' : '#9ca3af'} strokeWidth={1.5}>
                      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs text-muted-foreground">{editDragging ? 'Suelta aquí' : 'Añadir imágenes'}</span>
                  </>
                )}
              </div>
              {editImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
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

            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setEditForm(f => ({ ...f, featured: !f.featured }))}
                className="w-9 h-5 rounded-full transition-all duration-300 relative flex-shrink-0"
                style={{ background: editForm.featured ? '#111827' : '#e5e7eb' }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow"
                  style={{ left: editForm.featured ? '17px' : '1px' }} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Producto destacado</span>
            </label>

            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setEditProduct(null)}>Cancelar</Button>
              <Button className="flex-1" onClick={() => saveProduct()} disabled={editSaving || editUploadingCount > 0}>
                {editSaving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 rounded-full animate-spin border-primary-foreground/30 border-t-primary-foreground" />
                    Guardando...
                  </span>
                ) : editUploadingCount > 0 ? 'Esperando imágenes...' : 'Guardar cambios'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
