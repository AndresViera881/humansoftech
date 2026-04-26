'use client';

import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SortKey = 'relevance' | 'price_asc' | 'price_desc' | 'newest';

interface ProductGridProps {
  products: Product[];
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  total?: number;
}

export default function ProductGrid({ products, sort, onSortChange, hasMore, loadingMore, onLoadMore, total }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">📦</div>
        <p className="text-base font-semibold text-foreground">Sin productos en esta categoría</p>
        <p className="text-sm mt-1 text-muted-foreground">Probá con otra categoría o ajustá el filtro de precio</p>
      </div>
    );
  }

  const count = total ?? products.length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-foreground">Productos</h2>
          <p className="text-sm text-muted-foreground">
            {products.length}{count > products.length ? ` de ${count}` : ''} resultado{count !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Ordenar:</span>
          <Select value={sort} onValueChange={v => onSortChange(v as SortKey)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevancia</SelectItem>
              <SelectItem value="price_asc">Menor precio</SelectItem>
              <SelectItem value="price_desc">Mayor precio</SelectItem>
              <SelectItem value="newest">Más recientes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product, i) => (
          <div key={product.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s`, animationFillMode: 'both' }}>
            <ProductCard product={product} isNew={false} />
          </div>
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-150 bg-card border border-border text-foreground shadow-sm hover:shadow-md hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed">
            {loadingMore ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
                Cargando...
              </>
            ) : 'Cargar más productos'}
          </button>
        </div>
      )}
    </div>
  );
}
