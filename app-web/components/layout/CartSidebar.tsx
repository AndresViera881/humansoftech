'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import CustomerAuthModal from '@/components/auth/CustomerAuthModal';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const WA_PHONE = '5930995351473';
const FALLBACK = '/products/laptop.svg';

export default function CartSidebar() {
  const { items, count, total, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCart();
  const { loggedUser, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const buildWaMessage = () => {
    const lines = items.map(i =>
      `• ${i.quantity}x ${i.name} — $${(i.price * i.quantity).toLocaleString('es-EC', { minimumFractionDigits: 2 })}`
    ).join('\n');
    return encodeURIComponent(
      `Hola! Quisiera realizar el siguiente pedido:\n\n${lines}\n\n*Total: $${total.toLocaleString('es-EC', { minimumFractionDigits: 2 })}*\n\n¿Me pueden confirmar disponibilidad?`
    );
  };

  const handleWhatsApp = () => {
    if (!loggedUser) { setShowAuthModal(true); return; }
    window.open(`https://wa.me/${WA_PHONE}?text=${buildWaMessage()}`, '_blank');
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={open => !open && closeCart()}>
        <SheetContent className="w-full max-w-[420px] flex flex-col p-0" side="right"
          style={{ background: '#f9fafb' }}>

          {/* Header */}
          <SheetHeader className="px-5 py-4 flex-row items-center gap-2 space-y-0 bg-white"
            style={{ borderBottom: '1px solid rgba(37,99,235,0.12)', boxShadow: '0 1px 4px rgba(37,99,235,0.06)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <SheetTitle className="font-black text-base flex-1">Mi carrito</SheetTitle>
            {count > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.2)' }}>
                {count}
              </span>
            )}
          </SheetHeader>

          {/* Items */}
          <ScrollArea className="flex-1 px-4 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
                <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-sm font-medium">Tu carrito está vacío</p>
                <Button variant="outline" size="sm" onClick={closeCart}>Ver productos</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-white"
                    style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div className="flex-shrink-0 flex items-center justify-center rounded-lg overflow-hidden w-16 h-16"
                      style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.07)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image || FALLBACK} alt={item.name}
                        className="object-contain p-1 w-14 h-14" style={{ mixBlendMode: 'multiply' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-tight truncate text-foreground">{item.name}</p>
                      <p className="text-base font-black mt-1" style={{ color: '#2563eb' }}>
                        ${(item.price * item.quantity).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${item.price.toLocaleString('es-EC', { minimumFractionDigits: 2 })} c/u
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold transition-colors"
                          style={{ background: '#f3f4f6', border: '1px solid rgba(0,0,0,0.1)', color: '#374151' }}
                          onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}>
                          −
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold transition-colors"
                          style={{ background: '#f3f4f6', border: '1px solid rgba(0,0,0,0.1)', color: '#374151' }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                        <button
                          className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color: '#ef4444' }}
                          onClick={() => removeItem(item.id)} title="Eliminar">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-4 pb-6 pt-4 flex flex-col gap-3 bg-white"
              style={{ borderTop: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 -2px 8px rgba(0,0,0,0.04)' }}>

              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-sm font-semibold text-muted-foreground">Total</span>
                <span className="text-2xl font-black" style={{ color: '#111827' }}>
                  ${total.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {!loggedUser && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#d97706' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#92400e' }}>Debes iniciar sesión para enviar tu pedido</span>
                </div>
              )}

              {loggedUser && (
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                  style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                    {loggedUser.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold truncate" style={{ color: '#1e40af' }}>{loggedUser.name}</span>
                </div>
              )}

              <button onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: loggedUser ? '#16a34a' : '#2563eb',
                  color: '#fff',
                  boxShadow: loggedUser ? '0 4px 14px rgba(22,163,74,0.35)' : '0 4px 14px rgba(37,99,235,0.35)',
                }}>
                {loggedUser ? (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    Enviar pedido por WhatsApp
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Iniciar sesión para continuar
                  </>
                )}
              </button>

              <button onClick={clearCart}
                className="text-xs font-medium text-center py-1 transition-colors"
                style={{ color: '#9ca3af' }}>
                Vaciar carrito
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {showAuthModal && (
        <CustomerAuthModal
          onLogin={session => { login(session); setShowAuthModal(false); }}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
