'use client';

import { useState } from 'react';
import { api, LoginResponse } from '@/lib/api';
import { LogoIcon } from '@/components/layout/Logo';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CustomerAuthModalProps {
  onLogin: (session: LoginResponse) => void;
  onClose: () => void;
}

export default function CustomerAuthModal({ onLogin, onClose }: CustomerAuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const reset = () => { setName(''); setCedula(''); setPassword(''); setError(''); setShowPassword(false); };
  const switchTab = (t: 'login' | 'register') => { setTab(t); reset(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (tab === 'login') {
        onLogin(await api.auth.login(cedula, password));
      } else {
        onLogin(await api.auth.register(name.trim(), cedula, password));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado';
      if (msg.includes('cédula')) setError('Ya existe una cuenta con esa cédula');
      else if (msg.includes('Credenciales')) setError('Cédula o contraseña incorrectos');
      else setError(msg);
    } finally { setLoading(false); }
  };

  const canSubmit = tab === 'login'
    ? cedula.trim() && password.trim()
    : name.trim() && cedula.trim() && password.trim() && password.length >= 6;

  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-sm p-0 overflow-hidden gap-0">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center bg-muted/40 border-b">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-foreground p-2.5">
            <LogoIcon size={32} />
          </div>
          <h2 className="text-lg font-black">{tab === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</h2>
          <p className="text-xs mt-1 text-muted-foreground">Para finalizar tu pedido necesitas una cuenta</p>
        </div>

        {/* Tabs */}
        <div className="flex mx-6 mt-4 mb-1 rounded-xl overflow-hidden border">
          {(['login', 'register'] as const).map(t => (
            <button key={t} onClick={() => switchTab(t)}
              className={`flex-1 py-2 text-xs font-bold transition-all ${tab === t ? 'text-white' : 'bg-card text-muted-foreground hover:bg-muted'}`}
              style={tab === t ? { background: '#030712' } : {}}>
              {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-3 flex flex-col gap-3">
          {tab === 'register' && (
            <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre completo" />
          )}
          <Input type="text" value={cedula} onChange={e => setCedula(e.target.value.trim())}
            placeholder="Cédula de identidad" maxLength={13} autoComplete="username" />
          <div className="relative">
            <Input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder={tab === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              className="pr-10" />
            <Button type="button" variant="ghost" size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
              onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
              <svg className="w-4 h-4 flex-shrink-0 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-destructive">{error}</span>
            </div>
          )}

          <Button type="submit" disabled={loading || !canSubmit} className="w-full mt-1" style={{ background: '#030712' }}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 rounded-full animate-spin border-white/30 border-t-white" />
                {tab === 'login' ? 'Verificando...' : 'Creando cuenta...'}
              </span>
            ) : tab === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
