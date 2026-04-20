'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import AdminPanel from '@/components/AdminPanel';
import AdminProductsGrid from '@/components/AdminProductsGrid';
import AdminUsersGrid from '@/components/AdminUsersGrid';
import AdminVisitsGrid from '@/components/AdminVisitsGrid';
import { ApiProduct } from '@/lib/api';

type Tab = 'inventory' | 'create' | 'users' | 'visits';

export default function AdminPage() {
  const { loggedUser } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('inventory');

  useEffect(() => {
    if (loggedUser === null) router.replace('/');
  }, [loggedUser, router]);

  if (!loggedUser) return null;

  const handlePublish = (_product: ApiProduct) => {
    setTab('inventory');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Page header */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', boxShadow: '0 1px 6px rgba(139,109,56,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#2563eb' }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#2563eb' }}>
                Panel de Administración
              </span>
            </div>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Crea, edita y elimina productos del catálogo
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* User badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs"
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff' }}>
                {loggedUser.name[0].toUpperCase()}
              </div>
              <div className="text-xs">
                <p className="font-semibold" style={{ color: 'var(--text)' }}>{loggedUser.name}</p>
                <p className="capitalize" style={{ color: 'var(--text-muted)' }}>{loggedUser.role}</p>
              </div>
            </div>

            <button onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.07)'; e.currentTarget.style.color = '#2563eb'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Catálogo
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1 pb-0">
          {([
            { key: 'inventory', label: 'Inventario', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />, roles: ['admin', 'super_admin'] },
            { key: 'create', label: 'Nuevo Producto', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />, roles: ['admin', 'super_admin'] },
            { key: 'users', label: 'Usuarios', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 110-8 4 4 0 010 8zm6 4a3 3 0 100-6 3 3 0 000 6zM3 16a3 3 0 100-6 3 3 0 000 6z" />, roles: ['super_admin'] },
            { key: 'visits', label: 'Visitas', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>, roles: ['super_admin'] },
          ] as { key: Tab; label: string; icon: React.ReactNode; roles: string[] }[])
          .filter(t => t.roles.includes(loggedUser.role))
          .map(({ key, label, icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 relative"
              style={{ color: tab === key ? '#2563eb' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
              {label}
              {tab === key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: '#2563eb' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {tab === 'visits' ? (
          <AdminVisitsGrid />
        ) : tab === 'users' ? (
          <AdminUsersGrid />
        ) : tab === 'inventory' ? (
          <AdminProductsGrid />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden"
                style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 16px rgba(139,109,56,0.06)' }}>
                <div style={{ height: '3px', background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }} />
                <AdminPanel onPublish={handlePublish} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff' }}>
                    {loggedUser.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{loggedUser.name}</p>
                    <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{loggedUser.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.18)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#16a34a' }} />
                  <span className="text-xs font-semibold" style={{ color: '#16a34a' }}>Sesión activa</span>
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid var(--border)' }}>
                <h3 className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#2563eb' }}>Guía rápida</h3>
                <ul className="flex flex-col gap-2.5">
                  {[
                    'Completa nombre, categoría y precio.',
                    'El badge aparece como etiqueta en la tarjeta.',
                    'Activa "Destacado" para priorizar el producto.',
                    'Al publicar, el inventario se actualiza automáticamente.',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                        style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb' }}>{i + 1}</span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
