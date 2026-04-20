'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

type SortKey = 'relevance' | 'price_asc' | 'price_desc' | 'newest';

interface ProductGridProps {
  products: Product[];
  newestId?: string;
}

export default function ProductGrid({ products, newestId }: ProductGridProps) {
  const [sort, setSort] = useState<SortKey>('relevance');

  const sorted = useMemo(() => {
    const arr = [...products];
    if (sort === 'price_asc') return arr.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') return arr.sort((a, b) => b.price - a.price);
    if (sort === 'newest') return arr.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });
    return arr;
  }, [products, sort]);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">📦</div>
        <p className="text-base font-semibold" style={{ color: '#374151' }}>Sin productos en esta categoría</p>
        <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Probá con otra categoría o ajustá el filtro de precio</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black" style={{ color: '#111827' }}>Productos</h2>
          <p className="text-sm" style={{ color: '#9ca3af' }}>{products.length} resultado{products.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: '#6b7280' }}>Ordenar:</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="text-sm font-medium rounded-lg px-3 py-1.5"
            style={{ border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', outline: 'none' }}>
            <option value="relevance">Relevancia</option>
            <option value="price_asc">Menor precio</option>
            <option value="price_desc">Mayor precio</option>
            <option value="newest">Más recientes</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map((product, i) => (
          <div key={product.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s`, animationFillMode: 'both' }}>
            <ProductCard product={product} isNew={product.id === newestId} />
          </div>
        ))}
      </div>
    </div>
  );
}
