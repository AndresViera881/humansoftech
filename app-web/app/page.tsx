'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import FilterPanel from '@/components/FilterPanel';
import ProductGrid from '@/components/ProductGrid';
import LoginModal from '@/components/LoginModal';
import Logo from '@/components/Logo';
import { api, ApiCategory, ApiProduct } from '@/lib/api';

const WA_PHONE = '5930995351473';

function toDisplayProduct(p: ApiProduct) {
  return {
    id: p.id,
    name: p.name,
    category: p.category.name,
    price: parseFloat(p.price),
    description: p.description ?? '',
    images: p.images?.length ? p.images : ['/products/laptop.svg'],
    badge: p.badge ?? undefined,
    condition: p.condition,
    createdAt: p.createdAt,
  };
}

type SortKey = 'relevance' | 'price_asc' | 'price_desc' | 'newest';

const SORT_MAP: Record<SortKey, { sortBy: 'price' | 'createdAt'; sortOrder: 'asc' | 'desc' }> = {
  relevance: { sortBy: 'createdAt', sortOrder: 'desc' },
  price_asc: { sortBy: 'price', sortOrder: 'asc' },
  price_desc: { sortBy: 'price', sortOrder: 'desc' },
  newest: { sortBy: 'createdAt', sortOrder: 'desc' },
};

export default function Home() {
  const { loggedUser, login } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [conditions, setConditions] = useState<('nuevo' | 'seminuevo')[]>(['nuevo', 'seminuevo']);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>('relevance');

  const loadProducts = useCallback(async () => {
    try {
      const filters: Record<string, unknown> = selectedCategory !== 'Todos'
        ? { categoryId: categories.find(c => c.name === selectedCategory)?.id }
        : {};
      if (priceRange[1] < 3000) filters.maxPrice = priceRange[1];
      const { sortBy, sortOrder } = SORT_MAP[sort];
      filters.sortBy = sortBy;
      filters.sortOrder = sortOrder;
      const res = await api.products.list(filters);
      setProducts(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, priceRange, categories, sort]);

  useEffect(() => {
    api.categories.list().then(setCategories).catch(() => { });
    api.visits.record('/', document.referrer).catch(() => { });
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categoryNames = useMemo(
    () => ['Todos', ...categories.map(c => c.name)],
    [categories],
  );

  const displayProducts = useMemo(() => {
    let all = products.map(toDisplayProduct);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      all = all.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (conditions.length < 2) {
      all = all.filter(p => {
        const c = p.condition ?? 'nuevo';
        return conditions.includes(c);
      });
    }
    return all;
  }, [products, search, conditions]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      <Navbar onLoginClick={() => setShowLogin(true)} searchValue={search} onSearchChange={setSearch} onFilterClick={() => setFilterOpen(true)} />


      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        <FilterPanel
          categoryNames={categoryNames}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          conditions={conditions}
          onConditionsChange={setConditions}
          mobileOpen={filterOpen}
          onMobileClose={() => setFilterOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-3 md:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-10 h-10 rounded-full border-2 animate-spin"
                style={{ borderColor: 'rgba(37,99,235,0.12)', borderTopColor: '#2563eb' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Cargando productos...</p>
            </div>
          ) : (
            <ProductGrid products={displayProducts} sort={sort} onSortChange={setSort} />
          )}
        </main>
      </div>

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl transition-transform duration-200 hover:scale-105"
        style={{ background: '#22c55e', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 24px rgba(34,197,94,0.4)' }}>
        <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
        <span className="text-sm font-bold hidden sm:block">¿Consultas?</span>
      </a>

      {/* Login modal */}
      {showLogin && (
        <LoginModal
          onLogin={(session) => {
            login(session);
            setShowLogin(false);
            if (['admin', 'super_admin'].includes(session.user.role)) router.push('/admin');
          }}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* Footer */}
      <footer style={{ background: '#111827', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Brand + slogan */}
            <div className="flex flex-col gap-4">
              <Logo size={26} textSize="text-sm" />
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}>
                Compra celulares y laptops al mejor precio en Ecuador, equipos nuevos y seminuevos con garantía
              </p>
              <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                "Innovamos con propósito,<br />creamos con pasión"
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-2 mt-1">
                {[
                  { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', href: 'https://www.facebook.com/HumanSoftTechs/' },
                  { label: 'TikTok', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z', href: null },
                  { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', href: null },
                  { label: 'X (Twitter)', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z', href: null },
                ].map(({ label, path, href }) => (
                  <a key={label}
                    href={href ?? undefined}
                    onClick={!href ? e => e.preventDefault() : undefined}
                    target={href ? '_blank' : undefined}
                    rel={href ? 'noopener noreferrer' : undefined}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: href ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)', cursor: href ? 'pointer' : 'default', opacity: href ? 1 : 0.4 }}
                    onMouseEnter={href ? e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; } : undefined}
                    onMouseLeave={href ? e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'; } : undefined}
                    title={href ? label : `${label} — próximamente`}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
                  </a>
                ))}
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>@HumanSoftechs</p>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Contacto</h4>
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
                  label: 'Móvil',
                  value: '+593 9953 514 73',
                  href: `https://wa.me/${WA_PHONE}`,
                },
                {
                  icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /></>,
                  label: 'Web',
                  value: 'humansoftechs.com',
                  href: 'https://humansoftechs.com',
                },
              ].map(({ icon, label, value, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-all duration-150 group"
                  style={{ textDecoration: 'none' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Dirección</h4>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
                    <span style={{ color: 'rgba(255,255,255,0.35)' }}>Ambato - Ecuador</span>
                  </p>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mt-2"
                style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.3)', textDecoration: 'none', width: 'fit-content' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(22,163,74,0.25)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(22,163,74,0.15)'; }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                Escríbenos
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>
              Compra celulares y laptops al mejor precio en Ecuador, equipos nuevos y seminuevos con garantía
            </span>
            <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
              Innovamos con propósito, creamos con pasión &nbsp;·&nbsp; © {new Date().getFullYear()} Humansoftechs
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
