'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/layout/Navbar';
import FilterPanel from '@/components/catalog/FilterPanel';
import ProductGrid from '@/components/catalog/ProductGrid';
import LoginModal from '@/components/auth/LoginModal';
import Footer from '@/components/layout/Footer';
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
  const { login } = useAuth();
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

    const params = new URLSearchParams(window.location.search);
    const cat = params.get('categoria');
    const cond = params.get('condicion');
    if (cat) setSelectedCategory(cat);
    if (cond === 'nuevo') setConditions(['nuevo']);
    else if (cond === 'seminuevo') setConditions(['seminuevo']);
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

      {/* ── Hero strip ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--sidebar) 0%, oklch(0.22 0.08 248.6) 60%, var(--sidebar) 100%)', borderBottom: '1px solid oklch(0.546 0.211 248.6 / 18%)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-7 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-2xl font-black text-white leading-tight">
              Tecnología al mejor precio en Ecuador
            </h1>
            <p className="text-sm mt-1 text-blue-200/85">
              Celulares, laptops y accesorios — nuevos y seminuevos con garantía
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            {[
              { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />, label: 'Garantía' },
              { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />, label: 'Envíos EC' },
              { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />, label: 'WhatsApp' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <svg className="w-3.5 h-3.5 flex-shrink-0 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                <span className="text-xs font-semibold text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

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

          {/* ── Category pills ── */}
          {categoryNames.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-3 mb-2" style={{ scrollbarWidth: 'none' }}>
              {categoryNames.map(cat => (
                <button key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150"
                  style={{
                    background: selectedCategory === cat ? '#1e3a5f' : '#030712',
                    color: '#ffffff',
                    border: `1.5px solid ${selectedCategory === cat ? '#2d5a8e' : '#1e293b'}`,
                    whiteSpace: 'nowrap',
                    boxShadow: selectedCategory === cat ? '0 2px 8px rgba(30,58,95,0.4)' : '0 1px 3px oklch(0 0 0 / 6%)',
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-white border" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div className="h-[200px]" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, #e9ebee 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease infinite' }} />
                  <div className="p-4 flex flex-col gap-2.5">
                    <div className="h-2.5 rounded-full bg-gray-200 w-1/3" style={{ animation: 'shimmer 1.4s ease infinite' }} />
                    <div className="h-4 rounded-full bg-gray-200 w-4/5" style={{ animation: 'shimmer 1.4s ease infinite' }} />
                    <div className="h-6 rounded-full bg-blue-100 w-2/5" style={{ animation: 'shimmer 1.4s ease infinite' }} />
                    <div className="h-2.5 rounded-full bg-gray-100 w-full" style={{ animation: 'shimmer 1.4s ease infinite' }} />
                    <div className="h-2.5 rounded-full bg-gray-100 w-3/4" style={{ animation: 'shimmer 1.4s ease infinite' }} />
                  </div>
                  <div className="px-4 pb-4 flex flex-col gap-2">
                    <div className="h-9 rounded-xl bg-gray-200" style={{ animation: 'shimmer 1.4s ease infinite' }} />
                    <div className="h-9 rounded-xl bg-gray-100" style={{ animation: 'shimmer 1.4s ease infinite' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={displayProducts} sort={sort} onSortChange={setSort} />
          )}
        </main>
      </div>

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl transition-transform duration-200 hover:scale-105"
        style={{ background: 'var(--wa-green)', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 24px oklch(0.519 0.138 143.5 / 40%)' }}>
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

      <Footer />
    </div>
  );
}
