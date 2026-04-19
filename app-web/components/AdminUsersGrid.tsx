'use client';

import { useEffect, useState } from 'react';
import { api, ApiUser, ApiRole } from '@/lib/api';

type ModalMode = 'create' | 'edit';

interface UserForm {
  name: string;
  email: string;
  password: string;
  roleId: string;
  active: boolean;
}

const EMPTY_FORM: UserForm = { name: '', email: '', password: '', roleId: '', active: true };

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

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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
    setModalOpen(true);
  }

  function openEdit(user: ApiUser) {
    setForm({ name: user.name, email: user.email, password: '', roleId: user.role.id, active: user.active });
    setEditingId(user.id);
    setModalMode('edit');
    setFormError('');
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.email || !form.roleId) { setFormError('Nombre, email y rol son obligatorios.'); return; }
    if (modalMode === 'create' && !form.password) { setFormError('La contraseña es obligatoria para nuevos usuarios.'); return; }
    setSaving(true); setFormError('');
    try {
      if (modalMode === 'create') {
        const created = await api.users.create(form);
        setUsers(prev => [created, ...prev]);
      } else {
        const payload = { name: form.name, email: form.email, roleId: form.roleId, active: form.active, ...(form.password ? { password: form.password } : {}) };
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
    setDeleting(true);
    setDeleteError('');
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
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#2563eb', borderTopColor: 'transparent' }} />
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
          style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo usuario
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 16px rgba(139,109,56,0.06)' }}>
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Nombre', 'Email', 'Rol', 'Estado', 'Creado', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
              {users.map((user, i) => (
                <tr key={user.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }}
                  className="transition-colors hover:bg-blue-50/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff' }}>
                        {user.name[0].toUpperCase()}
                      </div>
                      <span className="font-medium" style={{ color: 'var(--text)' }}>{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="badge" style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                      {user.role.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge" style={{
                      background: user.active ? '#dcfce7' : '#f3f4f6',
                      color: user.active ? '#16a34a' : '#6b7280',
                      border: `1px solid ${user.active ? '#bbf7d0' : '#e5e7eb'}`,
                    }}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(user.createdAt).toLocaleDateString('es-EC')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(user)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb' }}>
                        Editar
                      </button>
                      <button onClick={() => setDeleteId(user.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setModalOpen(false)}>
          <div className="w-full rounded-2xl overflow-hidden"
            style={{ maxWidth: '480px', background: '#fff', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ height: '3px', background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }} />
            <div className="p-6">
              <h3 className="text-base font-bold mb-5" style={{ color: 'var(--text)' }}>
                {modalMode === 'create' ? 'Nuevo usuario' : 'Editar usuario'}
              </h3>

              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Nombre</span>
                  <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre completo" />
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
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                    className="w-4 h-4 rounded" style={{ accentColor: '#2563eb' }} />
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
                <button onClick={handleSave} disabled={saving}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                  {saving ? 'Guardando...' : modalMode === 'create' ? 'Crear usuario' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => { setDeleteId(null); setDeleteError(''); }}>
          <div className="w-full rounded-2xl p-6"
            style={{ maxWidth: '400px', background: '#fff', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-center mb-2" style={{ color: 'var(--text)' }}>¿Eliminar usuario?</h3>
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
