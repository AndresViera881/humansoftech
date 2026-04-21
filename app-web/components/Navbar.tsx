'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import Logo from '@/components/Logo';

const WA_PHONE = '5930995351473';

interface NavbarProps {
  onLoginClick?: () => void;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  onFilterClick?: () => void;
}

export default function Navbar({ onLoginClick, onSearchChange, searchValue = '', onFilterClick }: NavbarProps) {
  const { loggedUser, logout } = useAuth();
  const { count, openCart } = useCart();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid var(--border)', boxShadow: '0 1px 8px rgba(139,109,56,0.06)' }}>

      {/* ── Row 1: Logo + actions ── */}
      <div className="flex items-center gap-2 px-3 md:px-6 pt-3 pb-2 md:pb-3 max-w-7xl mx-auto w-full">

        {/* Logo */}
        <button onClick={() => router.push('/')} className="flex-shrink-0">
          <Logo size={26} textSize="text-sm" />
        </button>

        {/* Search — visible on desktop inline, hidden on mobile (shows in row 2) */}
        <div className="hidden md:flex flex-1 relative min-w-0 max-w-xl mx-auto">
          <input
            type="text"
            value={searchValue}
            onChange={e => onSearchChange?.(e.target.value)}
            placeholder="Buscar productos, marcas..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', outline: 'none', color: 'var(--text)' }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </span>
        </div>

        {/* Spacer on mobile */}
        <div className="flex-1 md:hidden" />

        {/* Right actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.18)', color: '#2563eb' }}
            title="Ver carrito">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center rounded-full text-white text-xs font-bold"
                style={{ background: '#ef4444', fontSize: '10px' }}>
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
          {/* WhatsApp — desktop only */}
          <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
            style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp
          </a>

          {/* Auth */}
          {loggedUser ? (
            <div className="flex items-center gap-1.5">
              <button onClick={() => router.push('/admin')}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold"
                style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.18)' }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">Admin</span>
              </button>
              {/* Profile avatar + dropdown */}
              <div ref={profileRef} className="relative flex-shrink-0">
                <button
                  onClick={() => setProfileOpen(v => !v)}
                  className="flex-shrink-0 rounded-full transition-all duration-150"
                  style={{ outline: profileOpen ? '2px solid #2563eb' : '2px solid #e5e7eb', outlineOffset: '1px' }}
                  title={loggedUser.name}>
                  {loggedUser.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={loggedUser.photo} alt={loggedUser.name}
                      className="w-8 h-8 rounded-full object-cover block" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                      style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff' }}>
                      {loggedUser.name[0].toUpperCase()}
                    </div>
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50 animate-fade-in-up"
                    style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>

                    {/* User info */}
                    <div className="flex flex-col items-center px-5 pt-5 pb-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
                      {loggedUser.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={loggedUser.photo} alt={loggedUser.name}
                          className="w-14 h-14 rounded-full object-cover mb-3"
                          style={{ border: '3px solid #e5e7eb' }} />
                      ) : (
                        <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl mb-3"
                          style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff' }}>
                          {loggedUser.name[0].toUpperCase()}
                        </div>
                      )}
                      <p className="text-sm font-bold text-center" style={{ color: '#111827' }}>{loggedUser.name}</p>
                      <span className="mt-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                        style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.15)' }}>
                        {loggedUser.role.replace('_', ' ')}
                      </span>
                      {loggedUser.cedula && (
                        <p className="mt-2 text-xs font-mono" style={{ color: '#9ca3af' }}>CI: {loggedUser.cedula}</p>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="p-2">
                      <button
                        onClick={() => { setProfileOpen(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                        style={{ color: '#dc2626', background: 'transparent' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button onClick={onLoginClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: 'var(--primary)', color: '#fff' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Ingresar
            </button>
          )}
        </div>
      </div>

      {/* ── Row 2: Search + Filter — mobile only ── */}
      <div className="flex md:hidden items-center gap-2 px-3 pb-3 max-w-7xl mx-auto w-full">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchValue}
            onChange={e => onSearchChange?.(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-3 pr-9 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', outline: 'none', color: 'var(--text)' }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </span>
        </div>

        {onFilterClick && (
          <button onClick={onFilterClick}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
            style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.18)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2" />
            </svg>
            Filtros
          </button>
        )}
      </div>

    </header>
  );
}
