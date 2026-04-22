'use client';

import { Slider } from "./ui/slider";

interface FilterPanelProps {
  categoryNames: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  conditions: ('nuevo' | 'seminuevo')[];
  onConditionsChange: (conditions: ('nuevo' | 'seminuevo')[]) => void;
  // mobile drawer
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
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'var(--primary)' }}>
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

      <div style={{ height: '1px', background: 'var(--border)' }} />

      {/* Price range */}
      <div>
        <h3
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: "var(--primary)" }}
        >
          Rango de Precio
        </h3>

        <div
          className="rounded-xl p-4"
          style={{
            background: "#fff",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {/* Min y Max */}
          <div className="flex justify-between mb-4">
            <div>
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Min
              </p>
              <p className="font-bold text-green-600">
                ${priceRange[0].toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Max
              </p>
              <p className="font-bold text-green-600">
                ${priceRange[1].toLocaleString()}
              </p>
            </div>
          </div>

          {/* Slider doble */}
          <Slider
            min={0}
            max={3000}
            step={50}
            value={priceRange}
            onValueChange={(value) =>
              onPriceChange(value as [number, number])
            }
            className="w-full"
          />

          <div
            className="flex justify-between text-xs mt-3"
            style={{ color: "var(--text-muted)" }}
          >
            <span>$0</span>
            <span>$3000+</span>
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border)' }} />

      {/* Condition */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'var(--primary)' }}>Condición</h3>
        <div className="flex flex-col gap-1.5">
          {([
            { value: 'nuevo', label: 'Nuevo' },
            { value: 'seminuevo', label: 'Seminuevo' },
          ] as { value: 'nuevo' | 'seminuevo'; label: string }[]).map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={conditions.includes(value)} onChange={() => toggleCondition(value)}
                style={{ accentColor: '#2563eb', width: '14px', height: '14px' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border)' }} />

      <div className="rounded-xl p-3 text-center"
        style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.16)' }}>
        <div className="text-base mb-1">🚀</div>
        <div className="text-xs font-bold" style={{ color: '#16a34a' }}>Envíos a todo el país</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 flex-shrink-0 flex-col"
        style={{ background: '#fff', borderRight: '1px solid var(--border)' }}>
        {content}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={onMobileClose}
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] flex flex-col"
            style={{ background: '#fff', boxShadow: '4px 0 24px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}>
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Filtros</h2>
              <button onClick={onMobileClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg"
                style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
