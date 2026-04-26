'use client';

import { useCallback, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { api, ApiUser, ApiRole } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { useMutation } from '@/hooks/useMutation';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { AdminToolbar } from './AdminToolbar';
import { TableLoading, TableEmpty } from './TableStates';
import { RowActions } from './RowActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { SaveButton } from '@/components/ui/save-button';
import { ErrorBanner } from '@/components/ui/error-banner';

type CropArea = { x: number; y: number; width: number; height: number };

async function getCroppedBlob(imageSrc: string, pixelCrop: CropArea): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = imageSrc;
  });
  const canvas = document.createElement('canvas');
  const SIZE = 400;
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, SIZE, SIZE);
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/jpeg', 0.92)
  );
}

function PhotoCropper({ src, onConfirm, onCancel, uploading }: {
  src: string; onConfirm: (blob: Blob) => void; onCancel: () => void; uploading: boolean;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);

  const onCropComplete = useCallback((_: unknown, pixels: CropArea) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const confirm = async () => {
    if (!croppedAreaPixels) return;
    const blob = await getCroppedBlob(src, croppedAreaPixels);
    onConfirm(blob);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-xs font-semibold text-center text-muted-foreground">
        Arrastra y ajusta el zoom para encuadrar el rostro
      </p>
      <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '12px', overflow: 'hidden', background: '#111' }}>
        <Cropper image={src} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false}
          onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
      </div>
      <div className="flex items-center gap-3 px-1">
        <svg className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 5a7 7 0 110 14 7 7 0 010-14z" />
        </svg>
        <input type="range" min={1} max={3} step={0.05} value={zoom}
          onChange={e => setZoom(Number(e.target.value))} className="flex-1" style={{ accentColor: 'var(--primary)' }} />
        <svg className="w-4 h-4 flex-shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 3a9 9 0 110 18 9 9 0 010-18z" />
        </svg>
      </div>
      <div className="flex gap-2 w-full">
        <Button variant="outline" type="button" className="flex-1" onClick={onCancel}>Cambiar foto</Button>
        <Button type="button" className="flex-1" onClick={confirm} disabled={uploading}>
          {uploading ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 border-2 rounded-full animate-spin border-primary-foreground/30 border-t-primary-foreground" />
              Subiendo...
            </span>
          ) : 'Confirmar recorte'}
        </Button>
      </div>
    </div>
  );
}

type ModalMode = 'create' | 'edit';

interface UserForm {
  name: string; email: string; password: string; roleId: string; active: boolean; photo: string; cedula: string;
}

const EMPTY_FORM: UserForm = { name: '', email: '', password: '', roleId: '', active: true, photo: '', cedula: '' };

function UserAvatar({ user, size = 36 }: { user: ApiUser; size?: number }) {
  if (user.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={user.photo} alt={user.name}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }} />
    );
  }
  return (
    <div className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{ width: size, height: size, background: 'var(--foreground)', color: 'var(--background)', fontSize: size * 0.36 }}>
      {user.name[0].toUpperCase()}
    </div>
  );
}

export default function AdminUsersGrid() {
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewUser, setViewUser] = useState<ApiUser | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [draggingPhoto, setDraggingPhoto] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useApiData(() =>
    Promise.all([api.users.list(), api.roles.list()])
      .then(([users, roles]) => ({ users, roles }))
  );
  const allUsers: ApiUser[] = data?.users ?? [];
  const roles: ApiRole[] = data?.roles ?? [];
  const users = allUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const { mutate: saveUser, loading: saving } = useMutation(
    async (f: UserForm) => {
      const base = { name: f.name, email: f.email, roleId: f.roleId, active: f.active, photo: f.photo || undefined, cedula: f.cedula || undefined };
      if (modalMode === 'create') return api.users.create({ ...base, password: f.password });
      return api.users.update(editingId!, { ...base, ...(f.password ? { password: f.password } : {}) });
    },
    { onSuccess: () => { refetch(); setModalOpen(false); }, onError: setFormError }
  );

  const { mutate: deleteUser, loading: deleting } = useMutation(
    (id: string) => api.users.delete(id),
    { onSuccess: () => { refetch(); setDeleteId(null); } }
  );

  function openCreate() {
    setForm({ ...EMPTY_FORM, roleId: roles[0]?.id ?? '' });
    setEditingId(null); setModalMode('create'); setFormError(''); setCropSrc(null); setModalOpen(true);
  }

  function openEdit(user: ApiUser) {
    setForm({ name: user.name, email: user.email, password: '', roleId: user.role.id, active: user.active, photo: user.photo ?? '', cedula: user.cedula ?? '' });
    setEditingId(user.id); setModalMode('edit'); setFormError(''); setCropSrc(null); setModalOpen(true);
  }

  function handleSave() {
    if (!form.name || !form.email || !form.roleId) { setFormError('Nombre, email y rol son obligatorios.'); return; }
    if (modalMode === 'create' && !form.password) { setFormError('La contraseña es obligatoria para nuevos usuarios.'); return; }
    setFormError('');
    saveUser(form);
  }

  function loadPhotoForCrop(file: File) {
    if (!file.type.startsWith('image/')) return;
    setCropSrc(URL.createObjectURL(file));
  }

  async function handleCropConfirm(blob: Blob) {
    setUploadingPhoto(true);
    try {
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      const { url } = await api.upload.image(file);
      setForm(f => ({ ...f, photo: url }));
      setCropSrc(null);
    } catch {
      setFormError('Error al subir la foto');
    } finally { setUploadingPhoto(false); }
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadPhotoForCrop(file);
    e.target.value = '';
  }

  function handlePhotoDrop(e: React.DragEvent) {
    e.preventDefault(); setDraggingPhoto(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadPhotoForCrop(file);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre o email..."
        onRefresh={refetch}
        onAdd={openCreate}
        addLabel="Nuevo usuario"
      />

      <p className="text-xs text-muted-foreground">{users.length} usuario{users.length !== 1 ? 's' : ''}</p>

      {/* Desktop table */}
      {loading ? (
        <TableLoading className="hidden sm:flex" />
      ) : users.length === 0 ? (
        <TableEmpty message="Sin usuarios" className="hidden sm:flex" />
      ) : (
      <div className="hidden sm:block rounded-2xl overflow-hidden bg-white border shadow-sm">
        <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--primary), oklch(0.58 0.18 290))' }} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b">
                {['Colaborador', 'Cédula', 'Email', 'Rol', 'Estado', 'Creado', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }}
                  className="transition-colors hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setViewUser(user)} className="flex-shrink-0 hover:opacity-80 transition-opacity">
                        <UserAvatar user={user} size={36} />
                      </button>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {user.cedula
                      ? <span className="font-mono text-xs px-2 py-1 rounded-lg bg-muted text-foreground/70">{user.cedula}</span>
                      : <span className="text-muted-foreground/40">—</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{user.role.name}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.active ? 'default' : 'secondary'}
                      className={user.active ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(user.createdAt).toLocaleDateString('es-EC')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => openEdit(user)}>Editar</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(user.id)}>Eliminar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Mobile accordion */}
      <div className="flex sm:hidden flex-col gap-2">
        {loading ? (
          <TableLoading card />
        ) : users.length === 0 ? (
          <TableEmpty card message="Sin usuarios" />
        ) : users.map(user => {
          const isOpen = expandedId === user.id;
          return (
            <div key={user.id} className="rounded-2xl overflow-hidden bg-white border shadow-sm">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left"
                onClick={() => setExpandedId(isOpen ? null : user.id)}>
                <button onClick={e => { e.stopPropagation(); setViewUser(user); }} className="flex-shrink-0 hover:opacity-80 transition-opacity">
                  <UserAvatar user={user} size={38} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge variant="secondary" className="text-[10px] h-4">{user.role.name}</Badge>
                    <Badge variant={user.active ? 'default' : 'secondary'}
                      className={`text-[10px] h-4 ${user.active ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}`}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
                <svg className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 flex flex-col gap-3 border-t">
                  <div className="grid grid-cols-2 gap-2 pt-3">
                    {[
                      { label: 'Cédula', value: user.cedula ?? '—', mono: true },
                      { label: 'Creado', value: new Date(user.createdAt).toLocaleDateString('es-EC') },
                    ].map(({ label, value, mono }) => (
                      <div key={label} className="rounded-xl px-3 py-2 bg-muted/40 border">
                        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5 text-muted-foreground">{label}</p>
                        <p className={`text-sm font-bold truncate ${mono ? 'font-mono' : ''}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl px-3 py-2 bg-muted/40 border">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5 text-muted-foreground">Email</p>
                    <p className="text-sm truncate text-muted-foreground">{user.email}</p>
                  </div>
                  <RowActions variant="text" onEdit={() => openEdit(user)} onDelete={() => setDeleteId(user.id)} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={open => !open && setModalOpen(false)}>
        <DialogContent className="sm:max-w-[520px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{modalMode === 'create' ? 'Nuevo colaborador' : 'Editar colaborador'}</DialogTitle>
          </DialogHeader>

          {/* Photo upload */}
          <FormField label="Foto del colaborador">

            {cropSrc ? (
              <div className="flex flex-col items-center p-4 rounded-xl bg-muted/40 border">
                <PhotoCropper src={cropSrc} onConfirm={handleCropConfirm}
                  onCancel={() => { setCropSrc(null); URL.revokeObjectURL(cropSrc); }} uploading={uploadingPhoto} />
              </div>
            ) : form.photo ? (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.photo} alt="Foto" className="rounded-full object-cover flex-shrink-0"
                  style={{ width: 72, height: 72, border: '3px solid var(--primary)' }} />
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold">Foto cargada</p>
                  <Button variant="outline" size="sm" type="button" onClick={() => photoInputRef.current?.click()}>Cambiar foto</Button>
                  <Button variant="ghost" size="sm" type="button" className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setForm(f => ({ ...f, photo: '' }))}>Eliminar foto</Button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setDraggingPhoto(true); }}
                onDragLeave={() => setDraggingPhoto(false)}
                onDrop={handlePhotoDrop}
                onClick={() => photoInputRef.current?.click()}
                className="w-full rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 py-8 transition-all duration-200"
                style={{ border: `2px dashed ${draggingPhoto ? 'var(--primary)' : 'var(--border)'}`, background: draggingPhoto ? 'var(--brand-subtle)' : 'var(--surface-2)', minHeight: '100px' }}>
                <svg className={`w-7 h-7 ${draggingPhoto ? 'text-primary' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-xs text-center text-muted-foreground">
                  {draggingPhoto ? 'Suelta aquí' : 'Arrastra la foto o haz clic para seleccionar'}
                </span>
                <span className="text-xs text-muted-foreground/50">JPG, PNG — recomendado cuadrada</span>
              </div>
            )}
            <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </FormField>

          <div className="flex flex-col gap-4">
            <FormField label="Nombre completo">
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre completo" />
            </FormField>
            <FormField label="Cédula de identidad">
              <Input value={form.cedula} onChange={e => setForm(f => ({ ...f, cedula: e.target.value }))} placeholder="0912345678" maxLength={13} />
            </FormField>
            <FormField label="Email">
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="correo@ejemplo.com" />
            </FormField>
            <FormField label="Contraseña" note={modalMode === 'edit' ? '(dejar vacío para no cambiar)' : undefined}>
              <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Mínimo 6 caracteres" />
            </FormField>
            <FormField label="Rol">
              <Select value={form.roleId || '_none'} onValueChange={v => setForm(f => ({ ...f, roleId: v === '_none' ? '' : v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Seleccionar rol...</SelectItem>
                  {roles.filter(r => r.name !== 'customer').map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            <div className="flex items-center gap-3">
              <Checkbox id="user-active" checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: !!v }))} />
              <label htmlFor="user-active" className="text-sm font-medium cursor-pointer">Usuario activo</label>
            </div>
          </div>

          <ErrorBanner message={formError} />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <SaveButton onClick={handleSave} loading={saving} disabled={uploadingPhoto}>
              {modalMode === 'create' ? 'Crear colaborador' : 'Guardar cambios'}
            </SaveButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* View user modal */}
      <Dialog open={!!viewUser} onOpenChange={open => !open && setViewUser(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="relative flex flex-col items-center pt-8 pb-5 px-6"
            style={{ background: 'linear-gradient(to bottom, #f0f4ff, #fff)' }}>
            <UserAvatar user={viewUser!} size={88} />
            <h3 className="mt-4 text-lg font-black text-center">{viewUser?.name}</h3>
            <Badge variant="secondary" className="mt-1">{viewUser?.role.name}</Badge>
          </div>

          <div className="px-6 pb-6 flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border">
              <svg className="w-4 h-4 flex-shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{viewUser?.email}</span>
            </div>

            {viewUser?.cedula && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border">
                <svg className="w-4 h-4 flex-shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                </svg>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5 text-muted-foreground">Cédula</p>
                  <p className="font-mono text-sm font-bold">{viewUser.cedula}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</span>
              <Badge variant={viewUser?.active ? 'default' : 'secondary'}
                className={viewUser?.active ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                {viewUser?.active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>

            <div className="flex gap-3 mt-2">
              <Button variant="outline" className="flex-1" onClick={() => { setViewUser(null); if (viewUser) openEdit(viewUser); }}>Editar</Button>
              <Button variant="secondary" className="flex-1" onClick={() => setViewUser(null)}>Cerrar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteId}
        title="¿Eliminar colaborador?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteUser(deleteId); }}
      />
    </div>
  );
}
