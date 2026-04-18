'use client';

interface FilterPanelProps {
  categoryNames: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  conditions: ('nuevo' | 'seminuevo')[];
  onConditionsChange: (conditions: ('nuevo' | 'seminuevo')[]) => void;
}

export default function FilterPanel({ categoryNames, selectedCategory, onCategoryChange, priceRange, onPriceChange, conditions, onConditionsChange }: FilterPanelProps) {
  const toggleCondition = (c: 'nuevo' | 'seminuevo') => {
    onConditionsChange(
      conditions.includes(c) ? conditions.filter(x => x !== c) : [...conditions, c]
    );
  };
  return (
    <aside className="w-52 flex-shrink-0 flex flex-col gap-4 overflow-y-auto p-4"
      style={{ background: '#fff', borderRight: '1px solid var(--border)' }}>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'var(--primary)' }}>
          Categorías
        </h3>
        <div className="flex flex-col gap-0.5">
          {categoryNames.map((cat) => (
            <button key={cat} onClick={() => onCategoryChange(cat)}
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
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>
          Precio Máximo
        </h3>
        <input type="range" min={0} max={3000} value={priceRange[1]}
          onChange={e => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="w-full" style={{ accentColor: '#2563eb' }} />
        <div className="flex justify-between text-xs mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>
          <span>$0</span>
          <span style={{ color: '#2563eb', fontWeight: 700 }}>${priceRange[1].toLocaleString()}</span>
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
              <input
                type="checkbox"
                checked={conditions.includes(value)}
                onChange={() => toggleCondition(value)}
                style={{ accentColor: '#2563eb', width: '14px', height: '14px' }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border)' }} />

      {/* Shipping */}
      <div className="rounded-xl p-3 text-center"
        style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.16)' }}>
        <div className="text-base mb-1">🚀</div>
        <div className="text-xs font-bold" style={{ color: '#16a34a' }}>Envío en 24hs</div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Todo el país</div>
      </div>
    </aside>
  );
}
