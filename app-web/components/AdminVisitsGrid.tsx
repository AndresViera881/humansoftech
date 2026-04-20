'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface VisitStats {
  total: number;
  today: number;
  week: number;
}

export default function AdminVisitsGrid() {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.visits.stats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#2563eb', borderTopColor: 'transparent' }} />
    </div>
  );

  if (!stats) return (
    <p className="text-center py-16 text-sm" style={{ color: '#ef4444' }}>Error al cargar estadísticas</p>
  );

  const cards = [
    {
      label: 'Visitas hoy',
      value: stats.today,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707" />,
      color: '#16a34a',
      bg: 'rgba(22,163,74,0.07)',
      border: 'rgba(22,163,74,0.18)',
    },
    {
      label: 'Últimos 7 días',
      value: stats.week,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
      color: '#7c3aed',
      bg: 'rgba(124,58,237,0.07)',
      border: 'rgba(124,58,237,0.18)',
    },
    {
      label: 'Total histórico',
      value: stats.total,
      icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>,
      color: '#2563eb',
      bg: 'rgba(37,99,235,0.07)',
      border: 'rgba(37,99,235,0.18)',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Visitas al sitio</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Contador de visitas registradas en la base de datos</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon, color, bg, border }) => (
          <div key={label} className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: '#fff', border: `1px solid var(--border)`, boxShadow: '0 2px 16px rgba(139,109,56,0.06)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: bg, border: `1px solid ${border}` }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.8}>
                {icon}
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
              <p className="text-3xl font-black" style={{ color, letterSpacing: '-1px' }}>
                {value.toLocaleString('es-EC')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Info note */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)' }}>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#2563eb' }}>¿Cómo funciona?</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Cada vez que alguien abre el catálogo, se registra una visita en la tabla <code className="px-1 py-0.5 rounded text-xs" style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb' }}>page_views</code> de la base de datos con la fecha y hora exacta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
