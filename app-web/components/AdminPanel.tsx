'use client';

import { useState, useRef, useEffect } from 'react';
import { api, ApiCategory, ApiSubcategory, ApiProduct, slugify } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

        {/* Product name */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Nombre del Producto
          </Label>
          <Input type="text" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="ej. Laptop Pro X1" />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Categoría</Label>
          <Select value={form.categoryId || '_none'} onValueChange={v => setForm(f => ({ ...f, categoryId: v === '_none' ? '' : v }))}>
            <SelectTrigger>
              <SelectValue placeholder="— Selecciona categoría —" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">— Selecciona categoría —</SelectItem>
              {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory */}
        {subcategories.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Subcategoría</Label>
            <Select value={form.subcategoryId || '_none'} onValueChange={v => setForm(f => ({ ...f, subcategoryId: v === '_none' ? '' : v }))}>
              <SelectTrigger>
                <SelectValue placeholder="— Opcional —" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">— Opcional —</SelectItem>
                {subcategories.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price + Stock row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Precio ($)</Label>
            <Input type="number" value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              placeholder="1299" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Stock</Label>
            <Input type="number" value={form.stock}
              onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
              placeholder="0" />
          </div>
        </div>

        {/* Condition */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Condición</Label>
          <div className="flex gap-2">
            {([
              { value: 'nuevo', label: 'Nuevo' },
              { value: 'seminuevo', label: 'Seminuevo' },
            ] as { value: 'nuevo' | 'seminuevo'; label: string }[]).map(({ value, label }) => (
              <button key={value} type="button"
                onClick={() => setForm(f => ({ ...f, condition: value }))}
                className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
                style={{
                  background: form.condition === value ? '#111827' : '#f9fafb',
                  color: form.condition === value ? '#fff' : '#4b5563',
                  border: `1.5px solid ${form.condition === value ? '#111827' : 'rgba(0,0,0,0.1)'}`,
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Badge + Featured row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Badge</Label>
            <Input type="text" value={form.badge}
              onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
              placeholder="ej. NUEVO" />
          </div>
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer pb-1">
              <div onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                className="w-9 h-5 rounded-full transition-all duration-300 relative flex-shrink-0"
                style={{ background: form.featured ? '#111827' : '#e5e7eb' }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm"
                  style={{ left: form.featured ? '17px' : '1px' }} />
              </div>
              <span className="text-xs font-semibold uppercase text-muted-foreground">Destacado</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Descripción Corta</Label>
          <Textarea value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Especificaciones clave del producto..." rows={2}
            className="resize-none" />
        </div>

        {/* Image upload */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Imágenes del Producto{' '}
            <span className="normal-case font-normal text-muted-foreground/60">(hasta 10)</span>
          </Label>

          <div onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 py-4 transition-all duration-200"
            style={{
              border: `2px dashed ${dragging ? '#111827' : 'rgba(0,0,0,0.12)'}`,
              background: dragging ? 'rgba(0,0,0,0.03)' : '#f9fafb',
              minHeight: '70px',
            }}>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
            {uploadingCount > 0 ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 animate-spin border-border border-t-foreground" />
                <span className="text-xs text-foreground">
                  Subiendo {uploadingCount} {uploadingCount === 1 ? 'imagen' : 'imágenes'}...
                </span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                  stroke={dragging ? '#111827' : '#9ca3af'} strokeWidth={1.5}>
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs text-center text-muted-foreground">
                  {dragging ? 'Suelta aquí' : 'Arrastra varias imágenes o haz clic'}
                </span>
              </>
            )}
          </div>

          {images.length > 0 && (
            <div className="mt-1 grid grid-cols-3 gap-2">
              {images.map((url, i) => (
                <div key={url} className="relative rounded-lg overflow-hidden group"
                  style={{ aspectRatio: '1', background: '#f9fafb', border: '1px solid rgba(0,0,0,0.1)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[9px] font-bold px-1 rounded"
                      style={{ background: 'rgba(0,0,0,0.85)', color: '#fff' }}>Principal</span>
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
          <div className="rounded-xl px-3 py-2 flex items-center gap-2 bg-muted/40 border">
            <div className="w-2 h-2 rounded-full animate-pulse bg-foreground" />
            <span className="text-xs font-bold tracking-widest text-foreground">Publicando en API...</span>
          </div>
        )}
        {saveState === 'success' && (
          <div className="animate-fade-in-up rounded-xl px-3 py-2.5 flex items-center gap-2 bg-green-50 border border-green-200">
            <svg className="w-4 h-4 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-bold text-green-600">¡Actualizado en la página principal!</span>
          </div>
        )}
        {saveState === 'error' && (
          <div className="rounded-xl px-3 py-2.5 flex items-center gap-2 bg-destructive/10 border border-destructive/20">
            <svg className="w-4 h-4 flex-shrink-0 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-bold text-destructive">{errorMsg || 'Error al guardar'}</span>
          </div>
        )}

        {/* Save button */}
        <Button
          onClick={handleSave}
          disabled={!isValid || saveState !== 'idle'}
          className="w-full uppercase tracking-widest text-sm font-black">
          {uploadingCount > 0 ? 'Esperando imágenes...' :
            saveState === 'loading' ? 'Publicando...' :
            saveState === 'success' ? '✓ Publicado con éxito' :
            'Guardar y publicar'}
        </Button>

      </div>
    </div>
  );
}
