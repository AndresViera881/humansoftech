'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { TableLoading } from './TableStates';

type Stats = Awaited<ReturnType<typeof api.visits.stats>>;

function Bar({ count, max }: { count: number; max: number }) {
  return (
    <div className="flex-1 h-2 rounded-full overflow-hidden bg-muted">
      <div className="h-full rounded-full bg-gradient-to-r from-gray-900 to-gray-700 transition-all duration-500"
        style={{ width: `${max ? (count / max) * 100 : 0}%` }} />
    </div>
  );
}

type DeviceType = 'Móvil' | 'Tablet' | 'Desktop' | string;
function DeviceBadge({ device }: { device: DeviceType }) {
  const styles: Record<string, string> = {
    Móvil:   'bg-amber-50 text-amber-600 border border-amber-200',
    Tablet:  'bg-muted text-foreground border',
    Desktop: 'bg-green-50 text-green-700 border border-green-200',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${styles[device] ?? 'bg-muted text-foreground border'}`}>
      {device ?? '—'}
    </span>
  );
}

export default function AdminVisitsGrid() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: stats, loading, error } = useApiData<Stats>(() => api.visits.stats());

  if (loading) return <TableLoading />;

  if (error || !stats) return (
    <p className="text-center py-16 text-sm text-destructive">Error al cargar estadísticas</p>
  );

  const topCards = [
    { label: 'Hoy',             value: stats.today, className: 'text-green-600' },
    { label: 'Últimos 7 días',  value: stats.week,  className: 'text-foreground' },
    { label: 'Total histórico', value: stats.total, className: 'text-foreground' },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topCards.map(({ label, value, className }) => (
          <div key={label} className="rounded-2xl p-5 bg-white border shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">{label}</p>
            <p className={`text-4xl font-black leading-none tracking-tight ${className}`}>
              {value.toLocaleString('es-EC')}
            </p>
            <div className="mt-3 h-1 rounded-full bg-muted border" />
          </div>
        ))}
      </div>

      {/* Breakdowns + recent table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Breakdowns */}
        <div className="flex flex-col gap-4">
          {[
            { title: 'Por dispositivo',        data: stats.byDevice },
            { title: 'Por navegador',           data: stats.byBrowser },
            { title: 'Por sistema operativo',   data: stats.byOS },
          ].map(({ title, data }) => {
            const max = Math.max(...data.map(d => d.count), 1);
            return (
              <div key={title} className="rounded-2xl p-4 bg-white border shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-foreground">{title}</p>
                <div className="flex flex-col gap-2.5">
                  {data.map(({ label, count }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-xs font-medium w-24 truncate text-gray-600">{label}</span>
                      <Bar count={count} max={max} />
                      <span className="text-xs font-bold w-6 text-right text-foreground">{count}</span>
                    </div>
                  ))}
                  {data.length === 0 && <p className="text-xs text-muted-foreground">Sin datos aún</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent visits */}
        <div className="lg:col-span-2 flex flex-col rounded-2xl overflow-hidden bg-white border shadow-sm">
          <div className="px-4 py-3 border-b bg-muted/40">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground">Últimas 30 visitas</p>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/30 border-b">
                  {['Fecha', 'IP', 'Dispositivo', 'Navegador', 'SO', 'Origen'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent.length === 0 && (
                  <tr><td colSpan={6} className="px-3 py-10 text-center text-muted-foreground">Sin visitas registradas aún</td></tr>
                )}
                {stats.recent.map((v, i) => (
                  <tr key={v.id}
                    className="transition-colors hover:bg-muted/20"
                    style={{ borderBottom: i < stats.recent.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                    <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                      {new Date(v.visitedAt).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-foreground">{v.ip ?? '—'}</td>
                    <td className="px-3 py-2.5"><DeviceBadge device={v.device ?? '—'} /></td>
                    <td className="px-3 py-2.5 text-gray-600">{v.browser ?? '—'}</td>
                    <td className="px-3 py-2.5 text-gray-600">{v.os ?? '—'}</td>
                    <td className="px-3 py-2.5 max-w-xs truncate text-muted-foreground" title={v.referrer ?? ''}>
                      {v.referrer ? (() => { try { return new URL(v.referrer).hostname; } catch { return v.referrer; } })() : 'Directo'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile accordion */}
          <div className="flex sm:hidden flex-col divide-y">
            {stats.recent.length === 0 && (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">Sin visitas registradas aún</p>
            )}
            {stats.recent.map(v => {
              const isOpen = expandedId === v.id;
              const referrerLabel = v.referrer
                ? (() => { try { return new URL(v.referrer).hostname; } catch { return v.referrer; } })()
                : 'Directo';
              return (
                <div key={v.id}>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    onClick={() => setExpandedId(isOpen ? null : v.id)}>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground">
                        {new Date(v.visitedAt).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs text-foreground">{v.ip ?? '—'}</span>
                        <DeviceBadge device={v.device ?? '—'} />
                      </div>
                    </div>
                    <svg className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 grid grid-cols-2 gap-2 border-t">
                      {[
                        { label: 'Navegador',         value: v.browser ?? '—' },
                        { label: 'Sistema operativo', value: v.os ?? '—' },
                        { label: 'Origen',            value: referrerLabel },
                        { label: 'IP',                value: v.ip ?? '—', mono: true },
                      ].map(({ label, value, mono }) => (
                        <div key={label} className="rounded-xl px-3 py-2 mt-2 bg-muted/40 border">
                          <p className="text-xs font-semibold uppercase tracking-wider mb-0.5 text-muted-foreground">{label}</p>
                          <p className={`text-xs font-bold truncate text-foreground ${mono ? 'font-mono' : ''}`}>{value}</p>
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
