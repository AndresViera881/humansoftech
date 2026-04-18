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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user } = await api.auth.login(email, password);
      onLogin(user);
    } catch {
      setError('Email o contraseña incorrectos');
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
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div
        className="w-full max-w-sm mx-4 rounded-2xl overflow-hidden animate-fade-in-up"
        style={{ background: '#fff', border: '1px solid rgba(139,109,56,0.14)', boxShadow: '0 24px 64px rgba(0,0,0,0.12)' }}
        onMouseDown={e => e.stopPropagation()}>

        {/* Top accent */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }} />

        {/* Header */}
        <div className="px-8 pt-7 pb-5 text-center" style={{ background: '#f5f0e8', borderBottom: '1px solid rgba(139,109,56,0.1)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '10px' }}>
            <LogoIcon size={32} />
          </div>
          <h2 className="text-xl font-black" style={{ color: '#1c1410' }}>Panel de administración</h2>
          <p className="text-sm mt-1" style={{ color: '#a08878' }}>Ingresa con tu cuenta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{ color: '#6b5244' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="admin@humansoftechs.com"
              autoComplete="email"
              style={{ ...inputStyle, ...(focusedField === 'email' ? focusStyle : {}) }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{ color: '#6b5244' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{ ...inputStyle, ...(focusedField === 'password' ? focusStyle : {}) }}
            />
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
            disabled={loading || !email || !password}
            className="w-full py-3 rounded-xl text-sm font-bold mt-1 transition-all duration-200"
            style={{
              background: loading || !email || !password ? 'rgba(37,99,235,0.08)' : '#2563eb',
              border: '1px solid rgba(37,99,235,0.2)',
              color: loading || !email || !password ? 'rgba(37,99,235,0.35)' : '#fff',
              cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!loading && email && password) e.currentTarget.style.background = '#1d4ed8'; }}
            onMouseLeave={e => { if (!loading && email && password) e.currentTarget.style.background = '#2563eb'; }}>
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                Verificando...
              </span>
            ) : 'Ingresar'}
          </button>

          <p className="text-center text-xs" style={{ color: '#a08878' }}>
            admin@humansoftechs.com · admin
          </p>
        </form>
      </div>
    </div>
  );
}
