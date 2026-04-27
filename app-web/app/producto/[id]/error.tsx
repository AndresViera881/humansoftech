'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error('Product page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center px-6">
        <p className="text-4xl mb-4">😕</p>
        <h2 className="text-lg font-black text-foreground mb-2">No se pudo cargar el producto</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Ocurrió un error al cargar esta página.
        </p>
        <p className="text-xs font-mono bg-gray-100 rounded px-3 py-2 text-red-600 mb-6 max-w-sm mx-auto break-all">
          {error?.message || 'Error desconocido'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: '#2563eb' }}
          >
            Intentar de nuevo
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-border text-foreground hover:bg-accent transition-colors"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    </div>
  );
}
