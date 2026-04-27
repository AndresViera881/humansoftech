'use client';

import { useState } from 'react';
import { api, LoginResponse } from '@/lib/api';
import { LogoIcon } from '@/components/layout/Logo';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginModalProps {
  onLogin: (session: LoginResponse) => void;
  onClose: () => void;
}

export default function LoginModal({ onLogin, onClose }: LoginModalProps) {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const session = await api.auth.login(cedula, password);
      onLogin(session);
    } catch {
      setError('Cédula o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent className="p-0 overflow-hidden max-w-sm gap-0">

        {/* Header */}
        <div className="px-8 pt-7 pb-5 text-center bg-muted/40 border-b">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-foreground p-2.5">
            <LogoIcon size={32} />
          </div>
          <h2 className="text-xl font-black text-foreground">Panel de administración</h2>
          <p className="text-sm mt-1 text-muted-foreground">Ingresa con tu cédula y contraseña</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cédula de identidad
            </Label>
            <Input
              type="text"
              value={cedula}
              onChange={e => setCedula(e.target.value.trim())}
              placeholder="0912345678"
              maxLength={13}
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value.trimStart())}
                placeholder="••••••••"
                autoComplete="current-password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}>
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
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-destructive/8 border border-destructive/20">
              <svg className="w-4 h-4 flex-shrink-0 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-destructive">{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !cedula.trim() || !password.trim()}
            className="w-full mt-1"
            style={{ background: '#030712' }}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 rounded-full animate-spin border-primary-foreground/30 border-t-primary-foreground" />
                Verificando...
              </span>
            ) : 'Ingresar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
