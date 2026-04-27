'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const EMPRESA_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/quienes-somos', label: 'Quiénes somos' },
  { href: '/garantia-y-devoluciones', label: 'Garantía y devoluciones' },
  { href: '/envios-ecuador', label: 'Envíos en Ecuador' },
  { href: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
];

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

  return (
    <header className="bg-white border-b" style={{ boxShadow: '0 1px 8px rgba(139,109,56,0.06)' }}>

      {/* ── Row 1: Logo + actions ── */}
      <div className="flex items-center gap-2 px-3 md:px-6 pt-3 pb-2 md:pb-3 max-w-7xl mx-auto w-full">

        {/* Logo */}
        <button onClick={() => router.push('/')} className="flex-shrink-0">
          <Logo size={26} textSize="text-sm" />
        </button>

        {/* Search — visible on desktop inline, hidden on mobile (shows in row 2) */}
        <div className="hidden md:flex flex-1 relative min-w-0 max-w-xl mx-auto">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <Input
            type="text"
            value={searchValue}
            onChange={e => onSearchChange?.(e.target.value)}
            placeholder="Buscar productos, marcas..."
            className="pl-9"
          />
        </div>

        {/* Empresa dropdown — desktop */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden md:flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-foreground hover:bg-accent transition-colors flex-shrink-0">
              Empresa
              <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 rounded-2xl p-1">
            {EMPRESA_LINKS.map(({ href, label }) => (
              <DropdownMenuItem key={href} asChild>
                <Link href={href} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer">
                  {label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Spacer on mobile */}
        <div className="flex-1 md:hidden" />

        {/* Right actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Empresa — mobile icon only */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border"
                style={{ background: 'rgba(3,7,18,0.08)', borderColor: 'rgba(3,7,18,0.2)', color: '#030712' }}
                title="Menú">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1">
              {EMPRESA_LINKS.map(({ href, label }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link href={href} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer">
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl border"
            style={{ background: 'rgba(3,7,18,0.08)', borderColor: 'rgba(3,7,18,0.2)', color: '#030712' }}
            title="Ver carrito">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white font-bold"
                style={{ fontSize: '10px' }}>
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          {/* WhatsApp — desktop only */}
          <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            WhatsApp
          </a>

          {/* Auth */}
          {loggedUser ? (
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="gap-1.5 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                onClick={() => router.push('/admin')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">Admin</span>
              </Button>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex-shrink-0 rounded-full transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary border-2 border-border"
                    title={loggedUser.name}>
                    {loggedUser.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={loggedUser.photo} alt={loggedUser.name}
                        className="w-8 h-8 rounded-full object-cover block" />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                        style={{ background: 'linear-gradient(135deg, var(--brand), #7c3aed)', color: '#fff' }}>
                        {loggedUser.name[0].toUpperCase()}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-0 overflow-hidden">
                  {/* User info header */}
                  <div className="flex flex-col items-center px-5 pt-5 pb-4 border-b">
                    {loggedUser.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={loggedUser.photo} alt={loggedUser.name}
                        className="w-14 h-14 rounded-full object-cover mb-3 border-[3px] border-border" />
                    ) : (
                      <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl mb-3"
                        style={{ background: 'linear-gradient(135deg, var(--brand), #7c3aed)', color: '#fff' }}>
                        {loggedUser.name[0].toUpperCase()}
                      </div>
                    )}
                    <p className="text-sm font-bold text-center text-foreground">{loggedUser.name}</p>
                    <span className="mt-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize bg-primary/10 text-primary border border-primary/15">
                      {loggedUser.role.replace('_', ' ')}
                    </span>
                    {loggedUser.cedula && (
                      <p className="mt-2 text-xs font-mono text-muted-foreground">CI: {loggedUser.cedula}</p>
                    )}
                  </div>
                  <div className="p-1">
                    <DropdownMenuItem
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-destructive focus:text-destructive focus:bg-destructive/8 cursor-pointer"
                      onClick={logout}>
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar sesión
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button size="sm" onClick={onLoginClick} className="gap-1.5" style={{ background: '#030712' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Ingresar
            </Button>
          )}
        </div>
      </div>

      {/* ── Row 2: Search + Filter — mobile only ── */}
      <div className="flex md:hidden items-center gap-2 px-3 pb-3 max-w-7xl mx-auto w-full">
        <div className="flex-1 relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <Input
            type="text"
            value={searchValue}
            onChange={e => onSearchChange?.(e.target.value)}
            placeholder="Buscar productos..."
            className="pl-9"
          />
        </div>
        {onFilterClick && (
          <Button variant="outline" size="sm" onClick={onFilterClick} className="flex-shrink-0 gap-1.5 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2" />
            </svg>
            Filtros
          </Button>
        )}
      </div>

    </header>
  );
}
