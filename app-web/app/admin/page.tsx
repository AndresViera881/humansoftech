'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, MenuItem } from '@/lib/auth-context';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminProductsGrid from '@/components/admin/AdminProductsGrid';
import AdminUsersGrid from '@/components/admin/AdminUsersGrid';
import AdminVisitsGrid from '@/components/admin/AdminVisitsGrid';
import AdminCategoriesGrid from '@/components/admin/AdminCategoriesGrid';
import AdminSubcategoriesGrid from '@/components/admin/AdminSubcategoriesGrid';
import AdminRolesGrid from '@/components/admin/AdminRolesGrid';
import AdminMenusGrid from '@/components/admin/AdminMenusGrid';
import AdminPermissionsGrid from '@/components/admin/AdminPermissionsGrid';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';
import { LogoIcon } from '@/components/layout/Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent } from '@/components/ui/sheet';

type Tab = 'inventory' | 'create' | 'categories' | 'subcategories' | 'users' | 'visits' | 'roles' | 'menus' | 'permissions';

const PAGE_META: Record<Tab, { title: string; breadcrumb: string[] }> = {
  inventory: { title: 'Productos', breadcrumb: ['Inventario', 'Productos'] },
  create: { title: 'Nuevo Producto', breadcrumb: ['Inventario', 'Nuevo Producto'] },
  categories: { title: 'Categorías', breadcrumb: ['Inventario', 'Categorías'] },
  subcategories: { title: 'Subcategorías', breadcrumb: ['Inventario', 'Subcategorías'] },
  users: { title: 'Usuarios', breadcrumb: ['Seguridad', 'Usuarios'] },
  visits: { title: 'Analítica', breadcrumb: ['Analítica'] },
  roles: { title: 'Roles', breadcrumb: ['Seguridad', 'Roles'] },
  menus: { title: 'Menús', breadcrumb: ['Seguridad', 'Menús'] },
  permissions: { title: 'Permisos', breadcrumb: ['Seguridad', 'Permisos'] },
};

function pathToTab(path: string | null | undefined): Tab | null {
  if (!path) return null;
  const map: Record<string, Tab> = {
    inventory: 'inventory', categories: 'categories', subcategories: 'subcategories',
    users: 'users', visits: 'visits', roles: 'roles', menus: 'menus', permissions: 'permissions',
  };
  return map[path] ?? null;
}

function SubItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 text-left ${
        active
          ? 'bg-white text-foreground'
          : 'text-white/55 hover:bg-white/[0.07] hover:text-white'
      }`}>
      <span className="opacity-60 text-[11px]">›</span>
      {label}
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary" />}
    </button>
  );
}

function SidebarSection({ label, open, onToggle, active, children }: {
  label: string; open: boolean; onToggle: () => void; active: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <button onClick={onToggle}
        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
          active
            ? 'bg-white/10 text-white'
            : 'text-white/60 hover:bg-white/[0.07] hover:text-white'
        }`}>
        <span className="flex-1 text-left">{label}</span>
        <svg className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 opacity-50"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="mt-0.5 ml-3 pl-3 flex flex-col gap-0.5 border-l border-white/10">
          {children}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { loggedUser, menus, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('inventory');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (loggedUser === null) router.replace('/');
  }, [loggedUser, router]);

  useEffect(() => {
    menus.forEach(m => {
      if (m.children?.some(c => pathToTab(c.path) === tab)) {
        setOpenSections(s => ({ ...s, [m.id]: true }));
      }
    });
  }, [tab, menus]);

  useEffect(() => {
    if (menus.length === 0) return;
    const firstFlat = menus.find(m => !m.children?.length && m.path);
    const firstChild = menus.flatMap(m => m.children ?? []).find(c => c.path);
    const initial = firstFlat?.path ?? firstChild?.path;
    if (initial) {
      const t = pathToTab(initial);
      if (t) setTab(t);
    }
  }, [menus]);

  if (!loggedUser) return null;

  const { title, breadcrumb } = PAGE_META[tab];

  const navigateTo = (key: Tab) => {
    setTab(key);
    setSidebarOpen(false);
  };

  const toggleSection = (id: string) => {
    setOpenSections(s => ({ ...s, [id]: !s[id] }));
  };

  const isChildActive = (m: MenuItem) => m.children?.some(c => pathToTab(c.path) === tab) ?? false;

  const sidebarNav = (
    <>
      {/* Logo */}
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
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Dynamic nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-xs font-bold tracking-widest uppercase px-2 mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Menú</p>

        {menus.length === 0 ? (
          <p className="text-xs px-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Sin menús asignados</p>
        ) : menus.map(m => {
          const hasChildren = m.children && m.children.length > 0;
          if (hasChildren) {
            const sectionActive = isChildActive(m);
            return (
              <SidebarSection key={m.id} label={m.label}
                open={openSections[m.id] ?? false}
                onToggle={() => toggleSection(m.id)}
                active={sectionActive}>
                {m.children!.map(child => {
                  const childTab = pathToTab(child.path);
                  return childTab ? (
                    <SubItem key={child.id} label={child.label}
                      active={tab === childTab}
                      onClick={() => navigateTo(childTab)} />
                  ) : null;
                })}
              </SidebarSection>
            );
          }
          const flatTab = pathToTab(m.path);
          if (!flatTab) return null;
          return (
            <button key={m.id} onClick={() => navigateTo(flatTab)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                tab === flatTab
                  ? 'bg-white text-foreground'
                  : 'text-white/60 hover:bg-white/[0.07] hover:text-white'
              }`}>
              {m.label}
              {tab === flatTab && <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 flex flex-col gap-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
        <button onClick={() => setChangePasswordOpen(true)}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-all duration-150 text-white/50 hover:bg-white/[0.07] hover:text-white">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-sm font-medium">Cambiar contraseña</span>
        </button>
        <button onClick={() => router.push('/')}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-all duration-150 text-white/50 hover:bg-white/[0.07] hover:text-white">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Ir al catálogo</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* ── Mobile sidebar via Sheet ── */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" showCloseButton={false} className="p-0 border-none flex flex-col gap-0"
          style={{ width: '240px', background: 'var(--sidebar)' }}>
          {sidebarNav}
        </SheetContent>
      </Sheet>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col flex-shrink-0" style={{ width: '240px', background: 'var(--sidebar)' }}>
        {sidebarNav}
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-card border-b shadow-sm">

          {/* Hamburger */}
          <button className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 bg-muted border border-border text-foreground hover:bg-accent transition-colors"
            onClick={() => setSidebarOpen(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumb + title */}
          <div className="flex-1 min-w-0">
            <div className="hidden sm:flex items-center gap-1.5 mb-0.5 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground/60">Dashboard</span>
              {breadcrumb.map((crumb, i) => (
                <span key={crumb} className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span className={`text-xs ${i === breadcrumb.length - 1 ? 'text-foreground font-semibold' : 'text-muted-foreground/60'}`}>{crumb}</span>
                </span>
              ))}
            </div>
            <h1 className="text-base sm:text-lg font-black leading-none truncate text-foreground">{title}</h1>
          </div>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-3 py-2 rounded-xl transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring bg-muted border border-border hover:bg-accent">
                {loggedUser.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={loggedUser.photo} alt={loggedUser.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0 border-2 border-border" />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 bg-foreground text-background">
                    {loggedUser.name[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:block text-xs leading-tight text-left">
                  <p className="font-semibold truncate max-w-[120px] text-foreground">{loggedUser.name}</p>
                  <p className="capitalize text-muted-foreground">{loggedUser.role.replace('_', ' ')}</p>
                </div>
                <svg className="w-3.5 h-3.5 hidden sm:block text-muted-foreground"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-0 overflow-hidden">
              <div className="flex flex-col items-center px-5 pt-5 pb-4 border-b">
                {loggedUser.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={loggedUser.photo} alt={loggedUser.name} className="w-14 h-14 rounded-full object-cover mb-3 border-[3px] border-border" />
                ) : (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl mb-3 bg-foreground text-background">
                    {loggedUser.name[0].toUpperCase()}
                  </div>
                )}
                <p className="text-sm font-bold text-center text-foreground">{loggedUser.name}</p>
                <span className="mt-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize bg-muted text-muted-foreground border border-border">
                  {loggedUser.role.replace('_', ' ')}
                </span>
                {loggedUser.cedula && <p className="mt-2 text-xs font-mono text-muted-foreground">CI: {loggedUser.cedula}</p>}
              </div>
              <div className="p-2">
                <DropdownMenuItem
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  onClick={() => { logout(); router.replace('/'); }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar sesión
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          {tab === 'visits' ? <AdminVisitsGrid /> :
            tab === 'users' ? <AdminUsersGrid /> :
              tab === 'categories' ? <AdminCategoriesGrid /> :
                tab === 'subcategories' ? <AdminSubcategoriesGrid /> :
                  tab === 'roles' ? <AdminRolesGrid /> :
                    tab === 'menus' ? <AdminMenusGrid /> :
                      tab === 'permissions' ? <AdminPermissionsGrid /> :
                        tab === 'inventory' ? <AdminProductsGrid onAdd={() => setTab('create')} /> :
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
