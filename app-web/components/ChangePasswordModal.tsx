'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

interface Props { userId: string; onClose: () => void; }

const fields = [
  { key: 'current', label: 'Contraseña actual', placeholder: '••••••••' },
  { key: 'next', label: 'Nueva contraseña', placeholder: 'Mínimo 6 caracteres' },
  { key: 'confirm', label: 'Confirmar nueva contraseña', placeholder: 'Mínimo 6 caracteres' },
] as const;

export default function ChangePasswordModal({ userId, onClose }: Props) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const values = { current, next, confirm };
  const setters = {
    current: setCurrent,
    next: setNext,
    confirm: setConfirm,
  };

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
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            Cambiar contraseña
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-green-600 text-center">¡Contraseña actualizada!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {fields.map(({ key, label, placeholder }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </Label>
                <div className="relative">
                  <Input
                    type={show[key] ? 'text' : 'password'}
                    value={values[key]}
                    onChange={e => setters[key](e.target.value)}
                    placeholder={placeholder}
                    className="pr-10"
                  />
                  <Button type="button" variant="ghost" size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                    onClick={() => setShow(s => ({ ...s, [key]: !s[key] }))} tabIndex={-1}>
                    <EyeIcon open={show[key]} />
                  </Button>
                </div>
                {key === 'next' && next && next.length < 6 && (
                  <p className="text-xs text-amber-500">Mínimo 6 caracteres</p>
                )}
                {key === 'confirm' && confirm && next !== confirm && (
                  <p className="text-xs text-destructive">Las contraseñas no coinciden</p>
                )}
              </div>
            ))}

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-destructive/8 border border-destructive/20">
                <svg className="w-4 h-4 flex-shrink-0 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-medium text-destructive">{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSave} disabled={loading || !canSave}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 rounded-full animate-spin border-primary-foreground/30 border-t-primary-foreground" />
                    Guardando...
                  </span>
                ) : 'Guardar'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
