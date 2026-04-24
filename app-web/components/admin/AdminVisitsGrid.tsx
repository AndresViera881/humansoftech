'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';

type Stats = Awaited<ReturnType<typeof api.visits.stats>>;

function Bar({ count, max }: { count: number; max: number }) {
  return (
    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
      <div className="h-full rounded-full transition-all duration-500"
        style={{ width: `${max ? (count / max) * 100 : 0}%`, background: 'linear-gradient(90deg, #111827, #374151)' }} />
    </div>
  );
}

export default function AdminVisitsGrid() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: stats, loading, error } = useApiData<Stats>(() => api.visits.stats());

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(0,0,0,0.1)', borderTopColor: '#111827' }} />
    </div>
  );

  if (error || !stats) return <p className="text-center py-16 text-sm" style={{ color: '#ef4444' }}>Error al cargar estadísticas</p>;

  const topCards = [
    { label: 'Hoy', value: stats.today, color: '#16a34a', bg: 'rgba(22,163,74,0.06)', border: 'rgba(22,163,74,0.15)' },
    { label: 'Últimos 7 días', value: stats.week, color: '#374151', bg: 'rgba(0,0,0,0.04)', border: 'rgba(0,0,0,0.1)' },
    { label: 'Total histórico', value: stats.total, color: '#111827', bg: 'rgba(0,0,0,0.06)', border: 'rgba(0,0,0,0.12)' },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topCards.map(({ label, value, color, bg, border }) => (
          <div key={label} className="rounded-2xl p-5"
            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9ca3af' }}>{label}</p>
            <p className="text-4xl font-black leading-none" style={{ color, letterSpacing: '-2px' }}>
              {value.toLocaleString('es-EC')}
            </p>
            <div className="mt-3 h-1 rounded-full" style={{ background: bg, border: `1px solid ${border}` }} />
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
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#111827' }}>{title}</p>
                <div className="flex flex-col gap-2.5">
                  {data.map(({ label, count }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-xs font-medium w-24 truncate" style={{ color: '#4b5563' }}>{label}</span>
                      <Bar count={count} max={max} />
                      <span className="text-xs font-bold w-6 text-right" style={{ color: '#111827' }}>{count}</span>
                    </div>
                  ))}
                  {data.length === 0 && <p className="text-xs" style={{ color: '#9ca3af' }}>Sin datos aún</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent visits */}
        <div className="lg:col-span-2 flex flex-col gap-0 rounded-2xl overflow-hidden"
          style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#fafafa' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#111827' }}>Últimas 30 visitas</p>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                  {['Fecha', 'IP', 'Dispositivo', 'Navegador', 'SO', 'Origen'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent.length === 0 && (
                  <tr><td colSpan={6} className="px-3 py-10 text-center" style={{ color: '#9ca3af' }}>Sin visitas registradas aún</td></tr>
                )}
                {stats.recent.map((v, i) => (
                  <tr key={v.id}
                    style={{ borderBottom: i < stats.recent.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(0,0,0,0.02)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}>
                    <td className="px-3 py-2.5 whitespace-nowrap" style={{ color: '#6b7280' }}>
                      {new Date(v.visitedAt).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-3 py-2.5 font-mono" style={{ color: '#111827' }}>{v.ip ?? '—'}</td>
                    <td className="px-3 py-2.5">
                      <span className="badge" style={{
                        background: v.device === 'Móvil' ? '#fef3c7' : v.device === 'Tablet' ? '#f3f4f6' : '#f0fdf4',
                        color: v.device === 'Móvil' ? '#d97706' : v.device === 'Tablet' ? '#374151' : '#16a34a',
                        border: v.device === 'Móvil' ? '1px solid #fde68a' : v.device === 'Tablet' ? '1px solid rgba(0,0,0,0.1)' : '1px solid #bbf7d0',
                      }}>{v.device ?? '—'}</span>
                    </td>
                    <td className="px-3 py-2.5" style={{ color: '#4b5563' }}>{v.browser ?? '—'}</td>
                    <td className="px-3 py-2.5" style={{ color: '#4b5563' }}>{v.os ?? '—'}</td>
                    <td className="px-3 py-2.5 max-w-xs truncate" style={{ color: '#9ca3af' }} title={v.referrer ?? ''}>
                      {v.referrer ? (() => { try { return new URL(v.referrer).hostname; } catch { return v.referrer; } })() : 'Directo'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile accordion */}
          <div className="flex sm:hidden flex-col" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
            {stats.recent.length === 0 && (
              <p className="px-4 py-10 text-center text-sm" style={{ color: '#9ca3af' }}>Sin visitas registradas aún</p>
            )}
            {stats.recent.map(v => {
              const isOpen = expandedId === v.id;
              const deviceStyle = {
                background: v.device === 'Móvil' ? '#fef3c7' : v.device === 'Tablet' ? '#f3f4f6' : '#f0fdf4',
                color: v.device === 'Móvil' ? '#d97706' : v.device === 'Tablet' ? '#374151' : '#16a34a',
                border: v.device === 'Móvil' ? '1px solid #fde68a' : v.device === 'Tablet' ? '1px solid rgba(0,0,0,0.1)' : '1px solid #bbf7d0',
              };
              const referrerLabel = v.referrer
                ? (() => { try { return new URL(v.referrer).hostname; } catch { return v.referrer; } })()
                : 'Directo';
              return (
                <div key={v.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    onClick={() => setExpandedId(isOpen ? null : v.id)}>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: '#6b7280' }}>
                        {new Date(v.visitedAt).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs" style={{ color: '#111827' }}>{v.ip ?? '—'}</span>
                        <span className="badge" style={{ ...deviceStyle, fontSize: '10px' }}>{v.device ?? '—'}</span>
                      </div>
                    </div>
                    <svg className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                      style={{ color: '#9ca3af', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 grid grid-cols-2 gap-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      {[
                        { label: 'Navegador', value: v.browser ?? '—' },
                        { label: 'Sistema operativo', value: v.os ?? '—' },
                        { label: 'Origen', value: referrerLabel },
                        { label: 'IP', value: v.ip ?? '—', mono: true },
                      ].map(({ label, value, mono }) => (
                        <div key={label} className="rounded-xl px-3 py-2 mt-2" style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.07)' }}>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#9ca3af' }}>{label}</p>
                          <p className={`text-xs font-bold truncate ${mono ? 'font-mono' : ''}`} style={{ color: '#111827' }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
