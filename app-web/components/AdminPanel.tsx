'use client';

import { useState, useRef, useEffect } from 'react';
import { api, ApiCategory, ApiSubcategory, ApiProduct, slugify } from '@/lib/api';

interface AdminPanelProps {
  onPublish: (product: ApiProduct) => void;
}

type SaveState = 'idle' | 'loading' | 'success' | 'error';

export default function AdminPanel({ onPublish }: AdminPanelProps) {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ApiSubcategory[]>([]);
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    subcategoryId: '',
    price: '',
    description: '',
    badge: '',
    stock: '0',
    featured: false,
    condition: 'nuevo' as 'nuevo' | 'seminuevo',
  });
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [dragging, setDragging] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.categories.list().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (!form.categoryId) { setSubcategories([]); return; }
    api.subcategories.listByCategory(form.categoryId).then(setSubcategories).catch(console.error);
    setForm(f => ({ ...f, subcategoryId: '' }));
  }, [form.categoryId]);

  const uploadFiles = async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) return;

    setUploadingCount(c => c + imageFiles.length);
    const previews = imageFiles.map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...previews]);

    try {
      const results = await api.upload.images(imageFiles);
      const urls = results.map(r => r.url);
      setImages(prev => {
        const withoutPreviews = prev.filter(u => !previews.includes(u));
        return [...withoutPreviews, ...urls];
      });
    } catch {
      setImages(prev => prev.filter(u => !previews.includes(u)));
    } finally {
      setUploadingCount(c => c - imageFiles.length);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    uploadFiles(Array.from(e.dataTransfer.files));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const removeImage = (url: string) => setImages(prev => prev.filter(u => u !== url));

  const handleSave = async () => {
    if (!form.name || !form.price || !form.categoryId) return;
    setSaveState('loading');
    setErrorMsg('');
    try {
      const product = await api.products.create({
        name: form.name,
        slug: slugify(form.name) + '-' + Date.now(),
        price: Number(form.price),
        categoryId: form.categoryId,
        subcategoryId: form.subcategoryId || undefined,
        description: form.description || undefined,
        images,
        badge: form.badge || undefined,
        stock: Number(form.stock),
        featured: form.featured,
        condition: form.condition,
      });
      setSaveState('success');
      onPublish(product);
      setTimeout(() => {
        setSaveState('idle');
        setForm({ name: '', categoryId: '', subcategoryId: '', price: '', description: '', badge: '', stock: '0', featured: false, condition: 'nuevo' });
        setImages([]);
      }, 2500);
    } catch (err) {
      setSaveState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al guardar');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  const isValid = form.name.trim() && form.price.trim() && form.categoryId && uploadingCount === 0;

  const labelStyle = { color: 'var(--text-secondary)' };

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Panel header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.18)' }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={2}><path d="M12 4v16m8-8H4" /></svg>
          </div>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#2563eb' }}>Nuevo Producto</span>
          <div className="w-2 h-2 rounded-full animate-pulse-neon ml-1" style={{ background: '#2563eb' }} />
        </div>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Completa los campos y publica el producto</p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">

        {/* Product name */}
        <div>
          <label className="block text-xs font-semibold tracking-wider mb-1.5 uppercase" style={labelStyle}>
            Nombre del Producto
          </label>
          <input type="text" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="ej. Laptop Pro X1"
            className="input-neon w-full px-3 py-2 rounded-lg text-sm" />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold tracking-wider mb-1.5 uppercase" style={labelStyle}>
            Categoría
          </label>
          <select value={form.categoryId}
            onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
            className="input-neon w-full px-3 py-2 rounded-lg text-sm"
            style={{ colorScheme: 'light' }}>
            <option value="">— Selecciona categoría —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Subcategory */}
        {subcategories.length > 0 && (
          <div>
            <label className="block text-xs font-semibold tracking-wider mb-1.5 uppercase" style={labelStyle}>
              Subcategoría
            </label>
            <select value={form.subcategoryId}
              onChange={e => setForm(f => ({ ...f, subcategoryId: e.target.value }))}
              className="input-neon w-full px-3 py-2 rounded-lg text-sm"
              style={{ colorScheme: 'light' }}>
              <option value="">— Opcional —</option>
              {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        )}

        {/* Price + Stock row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold tracking-wider mb-1.5 uppercase" style={labelStyle}>Precio ($)</label>
            <input type="number" value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              placeholder="1299" className="input-neon w-full px-3 py-2 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-wider mb-1.5 uppercase" style={labelStyle}>Stock</label>
            <input type="number" value={form.stock}
              onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
              placeholder="0" className="input-neon w-full px-3 py-2 rounded-lg text-sm" />
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-xs font-semibold tracking-wider mb-1.5 uppercase" style={labelStyle}>Condición</label>
          <div className="flex gap-2">
            {([
              { value: 'nuevo', label: 'Nuevo' },
              { value: 'seminuevo', label: 'Seminuevo' },
            ] as { value: 'nuevo' | 'seminuevo'; label: string }[]).map(({ value, label }) => (
              <button key={value} type="button"
                onClick={() => setForm(f => ({ ...f, condition: value }))}
                className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
                style={{
                  background: form.condition === value ? '#2563eb' : 'var(--bg)',
                  color: form.condition === value ? '#fff' : 'var(--text-secondary)',
                  border: `1.5px solid ${form.condition === value ? '#2563eb' : 'rgba(139,109,56,0.2)'}`,
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Badge + Featured row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold tracking-wider mb-1.5 uppercase" style={labelStyle}>Badge</label>
            <input type="text" value={form.badge}
              onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
              placeholder="ej. NUEVO" className="input-neon w-full px-3 py-2 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer pb-2">
              <div onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                className="w-9 h-5 rounded-full transition-all duration-300 relative flex-shrink-0"
                style={{
                  background: form.featured ? '#2563eb' : 'rgba(139,109,56,0.15)',
                  boxShadow: form.featured ? '0 0 8px rgba(37,99,235,0.25)' : 'none',
                }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm"
                  style={{ left: form.featured ? '17px' : '1px' }} />
              </div>
              <span className="text-xs font-semibold uppercase" style={labelStyle}>Destacado</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold tracking-wider mb-1.5 uppercase" style={labelStyle}>Descripción Corta</label>
          <textarea value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Especificaciones clave del producto..." rows={2}
            className="input-neon w-full px-3 py-2 rounded-lg text-sm resize-none" />
        </div>

        {/* Image upload — multiple */}
        <div>
          <label className="block text-xs font-semibold tracking-wider mb-1.5 uppercase" style={labelStyle}>
            Imágenes del Producto
            <span className="ml-1.5 normal-case font-normal" style={{ color: 'rgba(255,255,255,0.2)' }}>
              (hasta 10)
            </span>
          </label>

          {/* Drop zone */}
          <div onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 py-4 transition-all duration-200"
            style={{
              border: `2px dashed ${dragging ? '#2563eb' : 'rgba(139,109,56,0.2)'}`,
              background: dragging ? 'rgba(37,99,235,0.04)' : 'var(--bg)',
              minHeight: '70px',
            }}>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
            {uploadingCount > 0 ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 animate-spin"
                  style={{ borderColor: 'rgba(37,99,235,0.15)', borderTopColor: '#2563eb' }} />
                <span className="text-xs" style={{ color: '#2563eb' }}>
                  Subiendo {uploadingCount} {uploadingCount === 1 ? 'imagen' : 'imágenes'}...
                </span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={dragging ? '#2563eb' : 'var(--text-muted)'} strokeWidth={1.5}>
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  {dragging ? 'Suelta aquí' : 'Arrastra varias imágenes o haz clic'}
                </span>
              </>
            )}
          </div>

          {/* Image grid previews */}
          {images.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {images.map((url, i) => (
                <div key={url} className="relative rounded-lg overflow-hidden group"
                  style={{ aspectRatio: '1', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[9px] font-bold px-1 rounded"
                      style={{ background: 'rgba(37,99,235,0.85)', color: '#fff' }}>Principal</span>
                  )}
                  <button onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status messages */}
        {saveState === 'loading' && (
          <div className="rounded-xl overflow-hidden animate-fade-in" style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.2)' }}>
            <div className="px-3 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse-neon" style={{ background: '#2563eb' }} />
              <span className="text-xs font-bold tracking-widest" style={{ color: '#2563eb' }}>Publicando en API...</span>
            </div>
            <div className="loading-bar" />
          </div>
        )}
        {saveState === 'success' && (
          <div className="animate-fade-in-up rounded-xl px-3 py-2.5 flex items-center gap-2"
            style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth={2.5}>
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-bold" style={{ color: '#16a34a' }}>¡Actualizado en la página principal!</span>
          </div>
        )}
        {saveState === 'error' && (
          <div className="animate-fade-in rounded-xl px-3 py-2.5 flex items-center gap-2"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={2}>
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-bold" style={{ color: '#dc2626' }}>{errorMsg || 'Error al guardar'}</span>
          </div>
        )}

        {/* Save button */}
        <button onClick={handleSave} disabled={!isValid || saveState !== 'idle'}
          className="w-full py-3 rounded-xl font-black text-sm tracking-widest uppercase transition-all duration-200"
          style={{
            background: !isValid || saveState !== 'idle' ? 'rgba(139,109,56,0.06)' : '#2563eb',
            border: `1px solid ${!isValid || saveState !== 'idle' ? 'var(--border)' : '#2563eb'}`,
            color: !isValid || saveState !== 'idle' ? 'var(--text-muted)' : '#fff',
            boxShadow: isValid && saveState === 'idle' ? '0 4px 16px rgba(37,99,235,0.2)' : 'none',
            cursor: !isValid || saveState !== 'idle' ? 'not-allowed' : 'pointer',
          }}>
          {uploadingCount > 0 ? `Esperando imágenes...` :
            saveState === 'loading' ? 'Publicando...' :
            saveState === 'success' ? '✓ Publicado con éxito' :
            'Guardar y publicar'}
        </button>

      </div>
    </div>
  );
}
