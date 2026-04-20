'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Stats = Awaited<ReturnType<typeof api.visits.stats>>;

function Bar({ count, max }: { count: number; max: number }) {
  return (
    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
      <div className="h-full rounded-full transition-all duration-500"
        style={{ width: `${max ? (count / max) * 100 : 0}%`, background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }} />
    </div>
  );
}

export default function AdminVisitsGrid() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.visits.stats().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: '#2563eb', borderTopColor: 'transparent' }} />
    </div>
  );

  if (!stats) return <p className="text-center py-16 text-sm" style={{ color: '#ef4444' }}>Error al cargar estadísticas</p>;

  const topCards = [
    { label: 'Hoy', value: stats.today, color: '#16a34a', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.2)' },
    { label: 'Últimos 7 días', value: stats.week, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)' },
    { label: 'Total histórico', value: stats.total, color: '#2563eb', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.2)' },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Analítica de visitas</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>IP, dispositivo, navegador y origen de cada visita</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topCards.map(({ label, value, color, bg, border }) => (
          <div key={label} className="rounded-2xl p-5"
            style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 16px rgba(139,109,56,0.06)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="text-4xl font-black" style={{ color, letterSpacing: '-2px' }}>{value.toLocaleString('es-EC')}</p>
            <div className="mt-2 h-1 rounded-full" style={{ background: bg, border: `1px solid ${border}` }} />
          </div>
        ))}
      </div>

      {/* Breakdowns + recent table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Breakdowns */}
        <div className="flex flex-col gap-4">
          {[
            { title: 'Por dispositivo', data: stats.byDevice },
            { title: 'Por navegador', data: stats.byBrowser },
            { title: 'Por sistema operativo', data: stats.byOS },
          ].map(({ title, data }) => {
            const max = Math.max(...data.map(d => d.count), 1);
            return (
              <div key={title} className="rounded-2xl p-4"
                style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 16px rgba(139,109,56,0.06)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#2563eb' }}>{title}</p>
                <div className="flex flex-col gap-2.5">
                  {data.map(({ label, count }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-xs font-medium w-24 truncate" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      <Bar count={count} max={max} />
                      <span className="text-xs font-bold w-6 text-right" style={{ color: 'var(--text)' }}>{count}</span>
                    </div>
                  ))}
                  {data.length === 0 && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Sin datos aún</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent visits table */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 16px rgba(139,109,56,0.06)' }}>
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }} />
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#2563eb' }}>Últimas 30 visitas</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                  {['Fecha', 'IP', 'Dispositivo', 'Navegador', 'SO', 'Origen'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center" style={{ color: 'var(--text-muted)' }}>
                      Sin visitas registradas aún
                    </td>
                  </tr>
                )}
                {stats.recent.map((v, i) => (
                  <tr key={v.id} style={{ borderBottom: i < stats.recent.length - 1 ? '1px solid var(--border)' : 'none' }}
                    className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-3 py-2.5 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(v.visitedAt).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-3 py-2.5 font-mono" style={{ color: 'var(--text)' }}>
                      {v.ip ?? '—'}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="badge" style={{
                        background: v.device === 'Móvil' ? '#fef3c7' : v.device === 'Tablet' ? '#eff6ff' : '#f0fdf4',
                        color: v.device === 'Móvil' ? '#d97706' : v.device === 'Tablet' ? '#2563eb' : '#16a34a',
                        border: v.device === 'Móvil' ? '1px solid #fde68a' : v.device === 'Tablet' ? '1px solid #bfdbfe' : '1px solid #bbf7d0',
                      }}>
                        {v.device ?? '—'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5" style={{ color: 'var(--text-secondary)' }}>{v.browser ?? '—'}</td>
                    <td className="px-3 py-2.5" style={{ color: 'var(--text-secondary)' }}>{v.os ?? '—'}</td>
                    <td className="px-3 py-2.5 max-w-xs truncate" style={{ color: 'var(--text-muted)' }}
                      title={v.referrer ?? ''}>
                      {v.referrer ? new URL(v.referrer).hostname : 'Directo'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
