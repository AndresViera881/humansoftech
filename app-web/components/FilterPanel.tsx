'use client';

import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface FilterPanelProps {
  categoryNames: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  conditions: ('nuevo' | 'seminuevo')[];
  onConditionsChange: (conditions: ('nuevo' | 'seminuevo')[]) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function FilterPanel({
  categoryNames, selectedCategory, onCategoryChange,
  priceRange, onPriceChange, conditions, onConditionsChange,
  mobileOpen = false, onMobileClose,
}: FilterPanelProps) {
  const toggleCondition = (c: 'nuevo' | 'seminuevo') => {
    onConditionsChange(
      conditions.includes(c) ? conditions.filter(x => x !== c) : [...conditions, c]
    );
  };

  const content = (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-2.5 text-primary">
          Categorías
        </h3>
        <div className="flex flex-col gap-0.5">
          {categoryNames.map((cat) => (
            <button key={cat} onClick={() => { onCategoryChange(cat); onMobileClose?.(); }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                background: selectedCategory === cat ? 'rgba(37,99,235,0.07)' : 'transparent',
                color: selectedCategory === cat ? '#2563eb' : 'var(--text-secondary)',
                fontWeight: selectedCategory === cat ? '700' : '500',
                borderLeft: selectedCategory === cat ? '2px solid #2563eb' : '2px solid transparent',
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price range */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 text-primary">
          Rango de Precio
        </h3>
        <div className="rounded-xl p-4 bg-white border shadow-sm">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Min</p>
              <p className="font-bold text-green-600">${priceRange[0].toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Max</p>
              <p className="font-bold text-green-600">${priceRange[1].toLocaleString()}</p>
            </div>
          </div>
          <Slider
            min={0}
            max={3000}
            step={50}
            value={priceRange}
            onValueChange={(value) => onPriceChange(value as [number, number])}
            className="w-full"
          />
          <div className="flex justify-between text-xs mt-3 text-muted-foreground">
            <span>$0</span>
            <span>$3000+</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Condition */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-2.5 text-primary">Condición</h3>
        <div className="flex flex-col gap-2">
          {([
            { value: 'nuevo', label: 'Nuevo' },
            { value: 'seminuevo', label: 'Seminuevo' },
          ] as { value: 'nuevo' | 'seminuevo'; label: string }[]).map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={`condition-${value}`}
                checked={conditions.includes(value)}
                onCheckedChange={() => toggleCondition(value)}
              />
              <label htmlFor={`condition-${value}`} className="text-sm font-medium cursor-pointer text-muted-foreground">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="rounded-xl p-3 text-center bg-green-50 border border-green-100">
        <div className="text-base mb-1">🚀</div>
        <div className="text-xs font-bold text-green-700">Envíos a todo el país</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 flex-shrink-0 flex-col bg-white border-r">
        {content}
      </aside>

      {/* Mobile drawer using Sheet */}
      <Sheet open={mobileOpen} onOpenChange={open => !open && onMobileClose?.()}>
        <SheetContent side="left" className="w-72 max-w-[85vw] p-0">
          <SheetHeader className="px-4 py-4 border-b">
            <SheetTitle className="text-sm font-bold">Filtros</SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    </>
  );
}
