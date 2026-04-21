'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { api, ApiUser, ApiRole } from '@/lib/api';

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
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, SIZE, SIZE);
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/jpeg', 0.92)
  );
}

function PhotoCropper({ src, onConfirm, onCancel, uploading }: {
  src: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
  uploading: boolean;
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
      <p className="text-xs font-semibold text-center" style={{ color: '#6b7280' }}>
        Arrastra y ajusta el zoom para encuadrar el rostro
      </p>

      {/* Crop canvas */}
      <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '12px', overflow: 'hidden', background: '#111' }}>
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* Zoom slider */}
      <div className="flex items-center gap-3 px-1">
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 5a7 7 0 110 14 7 7 0 010-14z" />
        </svg>
        <input
          type="range" min={1} max={3} step={0.05} value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          className="flex-1" style={{ accentColor: '#111827' }}
        />
        <svg className="w-4.5 h-4.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 3a9 9 0 110 18 9 9 0 010-18z" />
        </svg>
      </div>

      <div className="flex gap-2 w-full">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2 rounded-xl text-xs font-semibold"
          style={{ background: '#f3f4f6', color: '#6b7280' }}>
          Cambiar foto
        </button>
        <button type="button" onClick={confirm} disabled={uploading}
          className="flex-1 py-2 rounded-xl text-xs font-bold text-white"
          style={{ background: uploading ? 'rgba(0,0,0,0.5)' : '#111827' }}>
          {uploading ? (
            <span className="flex items-center justify-center gap-1.5">
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Subiendo...
            </span>
          ) : 'Confirmar recorte'}
        </button>
      </div>
    </div>
  );
}

type ModalMode = 'create' | 'edit';

interface UserForm {
  name: string;
  email: string;
  password: string;
  roleId: string;
  active: boolean;
  photo: string;
  cedula: string;
}

const EMPTY_FORM: UserForm = { name: '', email: '', password: '', roleId: '', active: true, photo: '', cedula: '' };

function Avatar({ user, size = 36 }: { user: ApiUser; size?: number }) {
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
      style={{ width: size, height: size, background: '#111827', color: '#fff', fontSize: size * 0.36 }}>
      {user.name[0].toUpperCase()}
    </div>
  );
}

export default function AdminUsersGrid() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [viewUser, setViewUser] = useState<ApiUser | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [draggingPhoto, setDraggingPhoto] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.users.list(), api.roles.list()])
      .then(([u, r]) => { setUsers(u); setRoles(r); })
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setForm({ ...EMPTY_FORM, roleId: roles[0]?.id ?? '' });
    setEditingId(null);
    setModalMode('create');
    setFormError('');
    setCropSrc(null);
    setModalOpen(true);
  }

  function openEdit(user: ApiUser) {
    setForm({ name: user.name, email: user.email, password: '', roleId: user.role.id, active: user.active, photo: user.photo ?? '', cedula: user.cedula ?? '' });
    setEditingId(user.id);
    setModalMode('edit');
    setFormError('');
    setCropSrc(null);
    setModalOpen(true);
  }

  function loadPhotoForCrop(file: File) {
    if (!file.type.startsWith('image/')) return;
    const preview = URL.createObjectURL(file);
    setCropSrc(preview);
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
    } finally {
      setUploadingPhoto(false);
    }
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadPhotoForCrop(file);
    e.target.value = '';
  }

  function handlePhotoDrop(e: React.DragEvent) {
    e.preventDefault();
    setDraggingPhoto(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadPhotoForCrop(file);
  }

  async function handleSave() {
    if (!form.name || !form.email || !form.roleId) { setFormError('Nombre, email y rol son obligatorios.'); return; }
    if (modalMode === 'create' && !form.password) { setFormError('La contraseña es obligatoria para nuevos usuarios.'); return; }
    setSaving(true); setFormError('');
    try {
      const base = { name: form.name, email: form.email, roleId: form.roleId, active: form.active, photo: form.photo || undefined, cedula: form.cedula || undefined };
      if (modalMode === 'create') {
        const created = await api.users.create({ ...base, password: form.password });
        setUsers(prev => [created, ...prev]);
      } else {
        const payload = { ...base, ...(form.password ? { password: form.password } : {}) };
        const updated = await api.users.update(editingId!, payload);
        setUsers(prev => prev.map(u => u.id === editingId ? updated : u));
      }
      setModalOpen(false);
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true); setDeleteError('');
    try {
      await api.users.delete(deleteId);
      setUsers(prev => prev.filter(u => u.id !== deleteId));
      setDeleteId(null);
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : 'Error al eliminar usuario');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#111827', borderTopColor: 'transparent' }} />
    </div>
  );

  if (error) return <p className="text-center py-16 text-sm" style={{ color: '#ef4444' }}>{error}</p>;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Usuarios</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: '#111827' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo usuario
        </button>
      </div>

      {/* ── Desktop table (sm+) ── */}
      <div className="hidden sm:block rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #111827, #374151)' }} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Colaborador', 'Cédula', 'Email', 'Rol', 'Estado', 'Creado', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No hay usuarios registrados</td></tr>
              )}
              {users.map((user, i) => (
                <tr key={user.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }}
                  className="transition-colors hover:bg-blue-50/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setViewUser(user)} className="flex-shrink-0 hover:opacity-80 transition-opacity">
                        <Avatar user={user} size={36} />
                      </button>
                      <span className="font-medium" style={{ color: 'var(--text)' }}>{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {user.cedula
                      ? <span className="font-mono text-xs px-2 py-1 rounded-lg" style={{ background: '#f3f4f6', color: '#374151' }}>{user.cedula}</span>
                      : <span style={{ color: '#d1d5db' }}>—</span>}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="badge" style={{ background: '#f3f4f6', color: '#111827', border: '1px solid rgba(0,0,0,0.1)' }}>{user.role.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge" style={{ background: user.active ? '#dcfce7' : '#f3f4f6', color: user.active ? '#16a34a' : '#6b7280', border: `1px solid ${user.active ? '#bbf7d0' : '#e5e7eb'}` }}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleDateString('es-EC')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(user)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(0,0,0,0.05)', color: '#111827' }}>Editar</button>
                      <button onClick={() => setDeleteId(user.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile accordion (xs only) ── */}
      <div className="flex sm:hidden flex-col gap-2">
        {users.length === 0 ? (
          <div className="flex items-center justify-center py-14 rounded-2xl text-sm" style={{ background: '#fff', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            No hay usuarios registrados
          </div>
        ) : users.map(user => {
          const isOpen = expandedId === user.id;
          return (
            <div key={user.id} className="rounded-2xl overflow-hidden"
              style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>

              {/* Header */}
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left"
                onClick={() => setExpandedId(isOpen ? null : user.id)}>
                <button onClick={e => { e.stopPropagation(); setViewUser(user); }} className="flex-shrink-0 hover:opacity-80 transition-opacity">
                  <Avatar user={user} size={38} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{user.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="badge" style={{ background: '#f3f4f6', color: '#111827', border: '1px solid rgba(0,0,0,0.1)', fontSize: '10px' }}>{user.role.name}</span>
                    <span className="badge" style={{ background: user.active ? '#dcfce7' : '#f3f4f6', color: user.active ? '#16a34a' : '#6b7280', border: `1px solid ${user.active ? '#bbf7d0' : '#e5e7eb'}`, fontSize: '10px' }}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                <svg className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                  style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Body */}
              {isOpen && (
                <div className="px-4 pb-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="grid grid-cols-2 gap-2 pt-3">
                    {[
                      { label: 'Cédula', value: user.cedula ?? '—', mono: true },
                      { label: 'Creado', value: new Date(user.createdAt).toLocaleDateString('es-EC') },
                    ].map(({ label, value, mono }) => (
                      <div key={label} className="rounded-xl px-3 py-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                        <p className={`text-sm font-bold truncate ${mono ? 'font-mono' : ''}`} style={{ color: 'var(--text)' }}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl px-3 py-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Email</p>
                    <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => openEdit(user)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.12)', color: '#111827' }}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button onClick={() => setDeleteId(user.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full rounded-2xl overflow-hidden overflow-y-auto"
            style={{ maxWidth: '520px', maxHeight: '90vh', background: '#fff', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                  {modalMode === 'create' ? 'Nuevo colaborador' : 'Editar colaborador'}
                </h3>
                <button onClick={() => setModalOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full transition-colors"
                  style={{ background: '#f3f4f6', color: '#9ca3af' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#9ca3af'; }}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Photo upload */}
              <div className="mb-5">
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Foto del colaborador
                </label>

                {cropSrc ? (
                  /* Drag-to-reposition cropper */
                  <div className="flex flex-col items-center p-4 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <PhotoCropper
                      src={cropSrc}
                      onConfirm={handleCropConfirm}
                      onCancel={() => { setCropSrc(null); URL.revokeObjectURL(cropSrc); }}
                      uploading={uploadingPhoto}
                    />
                  </div>
                ) : form.photo ? (
                  /* Preview — click to re-crop */
                  <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.photo} alt="Foto"
                      className="rounded-full object-cover flex-shrink-0"
                      style={{ width: 72, height: 72, border: '3px solid #111827' }} />
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-semibold" style={{ color: '#111827' }}>Foto cargada</p>
                      <button type="button" onClick={() => photoInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: 'rgba(0,0,0,0.05)', color: '#111827', border: '1px solid rgba(0,0,0,0.12)' }}>
                        Cambiar foto
                      </button>
                      <button type="button" onClick={() => setForm(f => ({ ...f, photo: '' }))}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: 'rgba(239,68,68,0.07)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                        Eliminar foto
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Drop zone */
                  <div
                    onDragOver={e => { e.preventDefault(); setDraggingPhoto(true); }}
                    onDragLeave={() => setDraggingPhoto(false)}
                    onDrop={handlePhotoDrop}
                    onClick={() => photoInputRef.current?.click()}
                    className="w-full rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 py-8 transition-all duration-200"
                    style={{
                      border: `2px dashed ${draggingPhoto ? '#111827' : '#d1d5db'}`,
                      background: draggingPhoto ? 'rgba(0,0,0,0.03)' : '#f9fafb',
                      minHeight: '100px',
                    }}>
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24"
                      stroke={draggingPhoto ? '#111827' : '#9ca3af'} strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-xs text-center" style={{ color: '#9ca3af' }}>
                      {draggingPhoto ? 'Suelta aquí' : 'Arrastra la foto o haz clic para seleccionar'}
                    </span>
                    <span className="text-xs" style={{ color: '#d1d5db' }}>JPG, PNG — recomendado cuadrada</span>
                  </div>
                )}
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Nombre completo</span>
                  <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre completo" />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Cédula de identidad</span>
                  <input className="input" value={form.cedula} onChange={e => setForm(f => ({ ...f, cedula: e.target.value }))}
                    placeholder="0912345678" maxLength={13} />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Email</span>
                  <input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="correo@ejemplo.com" />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Contraseña {modalMode === 'edit' && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(dejar vacío para no cambiar)</span>}
                  </span>
                  <input className="input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Mínimo 6 caracteres" />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Rol</span>
                  <select className="input" value={form.roleId} onChange={e => setForm(f => ({ ...f, roleId: e.target.value }))}>
                    <option value="">Seleccionar rol...</option>
                    {roles.filter(r => r.name !== 'customer').map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                    className="w-4 h-4 rounded" style={{ accentColor: '#111827' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Usuario activo</span>
                </label>
              </div>

              {formError && (
                <p className="mt-4 text-xs rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving || uploadingPhoto}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: '#111827' }}>
                  {saving ? 'Guardando...' : modalMode === 'create' ? 'Crear colaborador' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View user detail modal */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full rounded-2xl overflow-hidden"
            style={{ maxWidth: '360px', background: '#fff', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>

            {/* Photo hero */}
            <div className="relative flex flex-col items-center pt-8 pb-5 px-6"
              style={{ background: 'linear-gradient(to bottom, #f0f4ff, #fff)' }}>
              <button onClick={() => setViewUser(null)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
                style={{ background: 'rgba(0,0,0,0.06)', color: '#9ca3af' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; e.currentTarget.style.color = '#9ca3af'; }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Avatar user={viewUser} size={88} />
              <h3 className="mt-4 text-lg font-black text-center" style={{ color: '#111827' }}>{viewUser.name}</h3>
              <span className="mt-1 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: '#f3f4f6', color: '#111827', border: '1px solid rgba(0,0,0,0.1)' }}>
                {viewUser.role.name}
              </span>
            </div>

            {/* Info */}
            <div className="px-6 pb-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm" style={{ color: '#374151' }}>{viewUser.email}</span>
              </div>

              {viewUser.cedula && (
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#9ca3af' }}>Cédula</p>
                    <p className="font-mono text-sm font-bold" style={{ color: '#111827' }}>{viewUser.cedula}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>Estado</span>
                <span className="badge" style={{
                  background: viewUser.active ? '#dcfce7' : '#f3f4f6',
                  color: viewUser.active ? '#16a34a' : '#6b7280',
                  border: `1px solid ${viewUser.active ? '#bbf7d0' : '#e5e7eb'}`,
                }}>
                  {viewUser.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => { setViewUser(null); openEdit(viewUser); }}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: 'rgba(0,0,0,0.05)', color: '#111827', border: '1px solid rgba(0,0,0,0.12)' }}>
                  Editar
                </button>
                <button onClick={() => setViewUser(null)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: '#f3f4f6', color: '#6b7280' }}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="relative w-full rounded-2xl p-6"
            style={{ maxWidth: '400px', background: '#fff', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <button onClick={() => { setDeleteId(null); setDeleteError(''); }}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
              style={{ background: '#f3f4f6', color: '#9ca3af' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#9ca3af'; }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-center mb-2" style={{ color: 'var(--text)' }}>¿Eliminar colaborador?</h3>
            <p className="text-sm text-center mb-6" style={{ color: 'var(--text-muted)' }}>Esta acción no se puede deshacer.</p>
            {deleteError && (
              <p className="text-xs rounded-lg px-3 py-2 mb-4" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                {deleteError}
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setDeleteId(null); setDeleteError(''); }} className="flex-1 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                Cancelar
              </button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: '#ef4444' }}>
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
