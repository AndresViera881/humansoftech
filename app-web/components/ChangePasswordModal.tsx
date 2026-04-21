'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
) : (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

interface Props {
  userId: string;
  onClose: () => void;
}

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '10px 42px 10px 14px',
  borderRadius: '10px',
  background: '#fff',
  border: '1.5px solid rgba(0,0,0,0.15)',
  color: '#111827',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

export default function ChangePasswordModal({ userId, onClose }: Props) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const focusStyle: React.CSSProperties = {
    borderColor: '#2563eb',
    boxShadow: '0 0 0 3px rgba(37,99,235,0.1)',
  };

  const toggle = (field: 'current' | 'next' | 'confirm') =>
    setShow(s => ({ ...s, [field]: !s[field] }));

  const canSave = current.trim() && next.trim().length >= 6 && next === confirm;

  const handleSave = async () => {
    if (next !== confirm) { setError('Las contraseñas nuevas no coinciden'); return; }
    setLoading(true);
    setError('');
    try {
      await api.auth.changePassword(userId, current, next);
      setSuccess(true);
      setTimeout(onClose, 1800);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error inesperado';
      setError(msg.includes('incorrecta') ? 'La contraseña actual es incorrecta' : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden animate-fade-in-up"
        style={{ background: '#fff', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
{/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4"
          style={{ borderBottom: '1px solid #f3f4f6' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(37,99,235,0.08)' }}>
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-base font-bold" style={{ color: '#111827' }}>Cambiar contraseña</h3>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full"
            style={{ background: '#f3f4f6', color: '#9ca3af' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#9ca3af'; }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {success ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: '#dcfce7' }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-center" style={{ color: '#16a34a' }}>
                ¡Contraseña actualizada!
              </p>
            </div>
          ) : (
            <>
              {/* Current password */}
              {(['current', 'next', 'confirm'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>
                    {field === 'current' ? 'Contraseña actual' : field === 'next' ? 'Nueva contraseña' : 'Confirmar nueva contraseña'}
                  </label>
                  <div className="relative">
                    <input
                      type={show[field] ? 'text' : 'password'}
                      value={field === 'current' ? current : field === 'next' ? next : confirm}
                      onChange={e => field === 'current' ? setCurrent(e.target.value) : field === 'next' ? setNext(e.target.value) : setConfirm(e.target.value)}
                      onFocus={() => setFocused(field)}
                      onBlur={() => setFocused(null)}
                      placeholder={field === 'current' ? '••••••••' : 'Mínimo 6 caracteres'}
                      style={{ ...inputBase, ...(focused === field ? focusStyle : {}) }}
                    />
                    <button type="button" onClick={() => toggle(field)} tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '2px' }}>
                      <EyeIcon open={show[field]} />
                    </button>
                  </div>
                  {field === 'next' && next && next.length < 6 && (
                    <p className="text-xs mt-1" style={{ color: '#f59e0b' }}>Mínimo 6 caracteres</p>
                  )}
                  {field === 'confirm' && confirm && next !== confirm && (
                    <p className="text-xs mt-1" style={{ color: '#ef4444' }}>Las contraseñas no coinciden</p>
                  )}
                </div>
              ))}

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={2}>
                    <path strokeLinecap="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#f87171' }}>{error}</span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: '#f3f4f6', color: '#6b7280' }}>
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={loading || !canSave}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity"
                  style={{
                    background: loading || !canSave ? 'rgba(37,99,235,0.4)' : '#2563eb',
                    cursor: loading || !canSave ? 'not-allowed' : 'pointer',
                  }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 rounded-full animate-spin"
                        style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                      Guardando...
                    </span>
                  ) : 'Guardar'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
