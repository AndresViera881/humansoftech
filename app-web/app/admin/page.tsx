'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import AdminPanel from '@/components/AdminPanel';
import AdminProductsGrid from '@/components/AdminProductsGrid';
import AdminUsersGrid from '@/components/AdminUsersGrid';
import AdminVisitsGrid from '@/components/AdminVisitsGrid';
import AdminCategoriesGrid from '@/components/AdminCategoriesGrid';
import AdminSubcategoriesGrid from '@/components/AdminSubcategoriesGrid';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import { LogoIcon } from '@/components/Logo';
import { ApiProduct } from '@/lib/api';

type Tab = 'inventory' | 'create' | 'categories' | 'subcategories' | 'users' | 'visits';

const PAGE_META: Record<Tab, { title: string; breadcrumb: string[] }> = {
  inventory:     { title: 'Productos',      breadcrumb: ['Inventario', 'Productos'] },
  create:        { title: 'Nuevo Producto', breadcrumb: ['Inventario', 'Nuevo Producto'] },
  categories:    { title: 'Categorías',     breadcrumb: ['Inventario', 'Categorías'] },
  subcategories: { title: 'Subcategorías',  breadcrumb: ['Inventario', 'Subcategorías'] },
  users:         { title: 'Usuarios',       breadcrumb: ['Seguridad', 'Usuarios'] },
  visits:        { title: 'Analítica',      breadcrumb: ['Analítica'] },
};

const INVENTARIO_TABS: Tab[] = ['inventory', 'create', 'categories', 'subcategories'];
const SEGURIDAD_TABS: Tab[] = ['users'];

/* ── Reusable sidebar sub-item ── */
function SubItem({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 text-left"
      style={{ background: active ? '#fff' : 'transparent', color: active ? '#111827' : 'rgba(255,255,255,0.55)' }}
      onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = '#fff'; } }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = active ? '#fff' : 'transparent'; (e.currentTarget as HTMLElement).style.color = active ? '#111827' : 'rgba(255,255,255,0.55)'; }}>
      <span style={{ opacity: 0.7 }}>{icon}</span>
      {label}
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#111827' }} />}
    </button>
  );
}

/* ── Reusable accordion section ── */
function SidebarSection({ label, icon, open, onToggle, active, children }: {
  label: string; icon: React.ReactNode; open: boolean; onToggle: () => void; active: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <button onClick={onToggle}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
        style={{ background: active ? 'rgba(255,255,255,0.1)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.6)' }}
        onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = '#fff'; } }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = active ? 'rgba(255,255,255,0.1)' : 'transparent'; (e.currentTarget as HTMLElement).style.color = active ? '#fff' : 'rgba(255,255,255,0.6)'; }}>
        <span style={{ opacity: 0.8 }}>{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        <svg className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.5 }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="mt-0.5 ml-3 pl-3 flex flex-col gap-0.5" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { loggedUser, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('inventory');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inventarioOpen, setInventarioOpen] = useState(true);
  const [seguridadOpen, setSeguridadOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (loggedUser === null) router.replace('/');
  }, [loggedUser, router]);

  if (!loggedUser) return null;

  const isAdmin = ['admin', 'super_admin'].includes(loggedUser.role);
  const isSuperAdmin = loggedUser.role === 'super_admin';
  const { title, breadcrumb } = PAGE_META[tab];

  const navigateTo = (key: Tab) => {
    setTab(key);
    setSidebarOpen(false);
    if (INVENTARIO_TABS.includes(key)) setInventarioOpen(true);
    if (SEGURIDAD_TABS.includes(key)) setSeguridadOpen(true);
  };

  const iconList = <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
  const iconTag  = <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5l8.5 8.5a2 2 0 010 2.83l-4.67 4.67a2 2 0 01-2.83 0L3 7V3h4z" /></svg>;
  const iconSub  = <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
  const iconUser = <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 110-8 4 4 0 010 8zm6 4a3 3 0 100-6 3 3 0 000 6zM3 16a3 3 0 100-6 3 3 0 000 6z" /></svg>;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f4f4f4' }}>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '240px', background: '#111827', flexShrink: 0 }}>

        {/* Logo + close on mobile */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex-shrink-0 rounded-xl flex items-center justify-center"
            style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.1)', padding: '7px' }}>
            <LogoIcon size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black tracking-tight leading-none" style={{ color: '#fff' }}>
              Human<span style={{ fontWeight: 400 }}>Softechs</span>
            </p>
            <p className="text-xs mt-0.5 font-medium tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>Admin</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          <p className="text-xs font-bold tracking-widest uppercase px-2 mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Menú</p>

          {/* INVENTARIO */}
          {isAdmin && (
            <SidebarSection
              label="Inventario"
              open={inventarioOpen}
              onToggle={() => setInventarioOpen(o => !o)}
              active={INVENTARIO_TABS.includes(tab)}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" /></svg>}>
              <SubItem label="Productos"     icon={iconList} active={tab === 'inventory'}     onClick={() => navigateTo('inventory')} />
              <SubItem label="Categorías"    icon={iconTag}  active={tab === 'categories'}    onClick={() => navigateTo('categories')} />
              <SubItem label="Subcategorías" icon={iconSub}  active={tab === 'subcategories'} onClick={() => navigateTo('subcategories')} />
            </SidebarSection>
          )}

          {/* SEGURIDAD */}
          {isSuperAdmin && (
            <SidebarSection
              label="Seguridad"
              open={seguridadOpen}
              onToggle={() => setSeguridadOpen(o => !o)}
              active={SEGURIDAD_TABS.includes(tab)}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}>
              <SubItem label="Usuarios" icon={iconUser} active={tab === 'users'} onClick={() => navigateTo('users')} />
            </SidebarSection>
          )}

          {/* ANALÍTICA */}
          {isSuperAdmin && (
            <button onClick={() => navigateTo('visits')}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 mt-0.5"
              style={{ background: tab === 'visits' ? '#fff' : 'transparent', color: tab === 'visits' ? '#111827' : 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => { if (tab !== 'visits') { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = '#fff'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = tab === 'visits' ? '#fff' : 'transparent'; (e.currentTarget as HTMLElement).style.color = tab === 'visits' ? '#111827' : 'rgba(255,255,255,0.6)'; }}>
              <svg className="w-4 h-4 flex-shrink-0" style={{ opacity: 0.8 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analítica
              {tab === 'visits' && <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#111827' }} />}
            </button>
          )}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 flex flex-col gap-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
          <button onClick={() => setChangePasswordOpen(true)}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-all duration-150"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <span className="text-sm font-medium">Cambiar contraseña</span>
          </button>
          <button onClick={() => router.push('/')}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-all duration-150"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="text-sm font-medium">Ir al catálogo</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4"
          style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

          {/* Hamburger */}
          <button className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
            style={{ background: '#f4f4f4', border: '1px solid rgba(0,0,0,0.08)', color: '#111827' }}
            onClick={() => setSidebarOpen(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          {/* Breadcrumb + title */}
          <div className="flex-1 min-w-0">
            <div className="hidden sm:flex items-center gap-1.5 mb-0.5 flex-wrap">
              <span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.3)' }}>Dashboard</span>
              {breadcrumb.map((crumb, i) => (
                <span key={crumb} className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'rgba(0,0,0,0.2)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  <span className="text-xs" style={{ color: i === breadcrumb.length - 1 ? '#111827' : 'rgba(0,0,0,0.4)', fontWeight: i === breadcrumb.length - 1 ? 600 : 400 }}>{crumb}</span>
                </span>
              ))}
            </div>
            <h1 className="text-base sm:text-lg font-black leading-none truncate" style={{ color: '#111827' }}>{title}</h1>
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative flex-shrink-0">
            <button onClick={() => setProfileOpen(v => !v)}
              className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-3 py-2 rounded-xl transition-all duration-150"
              style={{ background: '#f4f4f4', border: `1px solid ${profileOpen ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}` }}>
              {loggedUser.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={loggedUser.photo} alt={loggedUser.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" style={{ border: '2px solid rgba(0,0,0,0.1)' }} />
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0" style={{ background: '#111827', color: '#fff' }}>
                  {loggedUser.name[0].toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block text-xs leading-tight text-left">
                <p className="font-semibold truncate max-w-[120px]" style={{ color: '#111827' }}>{loggedUser.name}</p>
                <p className="capitalize" style={{ color: '#9ca3af' }}>{loggedUser.role.replace('_', ' ')}</p>
              </div>
              <svg className="w-3.5 h-3.5 hidden sm:block transition-transform duration-200"
                style={{ color: '#9ca3af', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50 animate-fade-in-up"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>
                <div className="flex flex-col items-center px-5 pt-5 pb-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {loggedUser.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={loggedUser.photo} alt={loggedUser.name} className="w-14 h-14 rounded-full object-cover mb-3" style={{ border: '3px solid #e5e7eb' }} />
                  ) : (
                    <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl mb-3" style={{ background: '#111827', color: '#fff' }}>
                      {loggedUser.name[0].toUpperCase()}
                    </div>
                  )}
                  <p className="text-sm font-bold text-center" style={{ color: '#111827' }}>{loggedUser.name}</p>
                  <span className="mt-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                    style={{ background: '#f3f4f6', color: '#374151', border: '1px solid rgba(0,0,0,0.08)' }}>
                    {loggedUser.role.replace('_', ' ')}
                  </span>
                  {loggedUser.cedula && <p className="mt-2 text-xs font-mono" style={{ color: '#9ca3af' }}>CI: {loggedUser.cedula}</p>}
                </div>
                <div className="p-2">
                  <button onClick={() => { setProfileOpen(false); logout(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                    style={{ color: '#dc2626', background: 'transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          {tab === 'visits'        ? <AdminVisitsGrid /> :
           tab === 'users'         ? <AdminUsersGrid /> :
           tab === 'categories'    ? <AdminCategoriesGrid /> :
           tab === 'subcategories' ? <AdminSubcategoriesGrid /> :
           tab === 'inventory'     ? <AdminProductsGrid onAdd={() => setTab('create')} /> :
           <div className="w-full rounded-2xl overflow-hidden"
             style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
             <AdminPanel onPublish={() => setTab('inventory')} />
           </div>}
        </main>
      </div>

      {changePasswordOpen && loggedUser && (
        <ChangePasswordModal userId={loggedUser.id} onClose={() => setChangePasswordOpen(false)} />
      )}
    </div>
  );
}
