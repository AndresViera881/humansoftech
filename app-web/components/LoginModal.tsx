'use client';

import { useState } from 'react';
import { api, AuthUser } from '@/lib/api';
import { LogoIcon } from '@/components/Logo';

interface LoginModalProps {
  onLogin: (user: AuthUser) => void;
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  background: '#fff',
  border: '1.5px solid rgba(139,109,56,0.2)',
  color: '#1c1410',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

export default function LoginModal({ onLogin, onClose }: LoginModalProps) {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'cedula' | 'password' | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user } = await api.auth.login(cedula, password);
      onLogin(user);
    } catch {
      setError('Cédula o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const focusStyle: React.CSSProperties = {
    borderColor: '#2563eb',
    boxShadow: '0 0 0 3px rgba(37,99,235,0.1)',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>

      <div
        className="w-full max-w-sm mx-4 rounded-2xl overflow-hidden animate-fade-in-up"
        style={{ background: '#fff', border: '1px solid rgba(139,109,56,0.14)', boxShadow: '0 24px 64px rgba(0,0,0,0.12)' }}>

{/* Header */}
        <div className="relative px-8 pt-7 pb-5 text-center" style={{ background: '#f8faff', borderBottom: '1px solid #e5e7eb' }}>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
            style={{ background: '#f3f4f6', color: '#9ca3af' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#9ca3af'; }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: '#111827', padding: '10px' }}>
            <LogoIcon size={32} />
          </div>
          <h2 className="text-xl font-black" style={{ color: '#111827' }}>Panel de administración</h2>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Ingresa con tu cédula y contraseña</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{ color: '#6b5244' }}>
              Cédula de identidad
            </label>
            <input
              type="text"
              value={cedula}
              onChange={e => setCedula(e.target.value.trim())}
              onFocus={() => setFocusedField('cedula')}
              onBlur={() => setFocusedField(null)}
              placeholder="0912345678"
              maxLength={13}
              autoComplete="username"
              style={{ ...inputStyle, ...(focusedField === 'cedula' ? focusStyle : {}) }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{ color: '#6b5244' }}>
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value.trimStart())}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ ...inputStyle, paddingRight: '42px', ...(focusedField === 'password' ? focusStyle : {}) }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                tabIndex={-1}>
                {showPassword ? (
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl animate-fade-in"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={2}>
                <path strokeLinecap="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium" style={{ color: '#f87171' }}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !cedula.trim() || !password.trim()}
            className="w-full py-3 rounded-xl text-sm font-bold mt-1 transition-all duration-200"
            style={{
              background: loading || !cedula || !password ? 'rgba(37,99,235,0.08)' : '#2563eb',
              border: '1px solid rgba(37,99,235,0.2)',
              color: loading || !cedula.trim() || !password.trim() ? 'rgba(37,99,235,0.35)' : '#fff',
              cursor: loading || !cedula.trim() || !password.trim() ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!loading && cedula.trim() && password.trim()) e.currentTarget.style.background = '#1d4ed8'; }}
            onMouseLeave={e => { if (!loading && cedula.trim() && password.trim()) e.currentTarget.style.background = '#2563eb'; }}>
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                Verificando...
              </span>
            ) : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
