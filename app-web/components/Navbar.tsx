'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Logo from '@/components/Logo';

const WA_PHONE = '5930995351473';

interface NavbarProps {
  onLoginClick?: () => void;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

export default function Navbar({ onLoginClick, onSearchChange, searchValue = '' }: NavbarProps) {
  const { loggedUser, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid var(--border)', boxShadow: '0 1px 8px rgba(139,109,56,0.06)' }}>
      {/* Main bar */}
      <div className="flex items-center gap-4 px-6 py-3.5 max-w-7xl mx-auto w-full">

        {/* Logo */}
        <button onClick={() => router.push('/')} className="flex-shrink-0">
          <Logo size={28} textSize="text-sm" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto relative">
          <input
            type="text"
            value={searchValue}
            onChange={e => onSearchChange?.(e.target.value)}
            placeholder="Buscar productos, marcas..."
            className="w-full pl-4 pr-11 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: 'var(--bg)',
              border: '1.5px solid var(--border)',
              outline: 'none',
              color: 'var(--text)',
            }}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* WhatsApp */}
          <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(22,163,74,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(22,163,74,0.08)'; }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp
          </a>

          {/* Auth */}
          {loggedUser ? (
            <div className="flex items-center gap-2">
              <button onClick={() => router.push('/admin')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.18)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </button>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff' }}>
                  {loggedUser.name[0].toUpperCase()}
                </div>
                <span className="text-xs font-semibold hidden sm:block" style={{ color: 'var(--text-secondary)' }}>{loggedUser.name}</span>
              </div>
              <button onClick={logout}
                className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#dc2626'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                title="Cerrar sesión">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{ background: 'var(--primary)', color: '#fff', border: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-dark)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary)'; }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Ingresar
            </button>
          )}
        </div>
      </div>

    </header>
  );
}
