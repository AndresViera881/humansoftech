'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginModal from '@/components/auth/LoginModal';
import { useAuth } from '@/lib/auth-context';
import { LoginResponse } from '@/lib/api';

const WA = 'https://wa.me/5930995351473';

const STEPS = [
  {
    step: '01',
    title: 'Contáctanos por WhatsApp',
    desc: 'Escríbenos al +593 9953 514 73 indicando el número de pedido y el motivo de la devolución.',
  },
  {
    step: '02',
    title: 'Revisamos tu caso',
    desc: 'En menos de 24 horas evaluamos tu solicitud y te confirmamos si aplica la garantía o devolución.',
  },
  {
    step: '03',
    title: 'Envía el equipo',
    desc: 'Te damos las instrucciones de envío. El equipo debe estar en su estado original con todos los accesorios.',
  },
  {
    step: '04',
    title: 'Resolución',
    desc: 'Reparamos, reemplazamos o reembolsamos según el caso. Tiempo de resolución: 3 a 7 días hábiles.',
  },
];

const COVERED = [
  'Defectos de fabricación',
  'Fallas en pantalla sin daño físico externo',
  'Problemas de batería (primeros 30 días)',
  'Fallas en software de fábrica',
  'Piezas internas defectuosas',
  'Daños en tránsito (con foto al recibir)',
];

const NOT_COVERED = [
  'Daños por caída o golpe',
  'Pantallas rotas por mal uso',
  'Daños por líquidos',
  'Productos con modificaciones no autorizadas',
  'Daños por cargadores no originales',
  'Robo o extravío',
];

export default function GarantiaPage() {
  const [showLogin, setShowLogin] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar onLoginClick={() => setShowLogin(true)} />

      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden" style={{ background: '#030712' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 right-1/4 w-80 h-80 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
          </div>
          <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.3)' }}>
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 border"
              style={{ background: 'rgba(37,99,235,0.15)', color: '#60a5fa', borderColor: 'rgba(37,99,235,0.3)' }}>
              Política oficial
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              Garantía y devoluciones
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Tu tranquilidad es nuestra prioridad. Todos nuestros equipos tienen garantía documentada
              y un proceso de devolución claro y transparente.
            </p>
          </div>
        </section>

        {/* Guarantee cards */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-black text-foreground text-center mb-10">Tipos de garantía</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🆕',
                title: 'Equipos nuevos',
                period: '12 meses',
                desc: 'Garantía de fábrica completa. Incluye soporte técnico y reemplazo por defecto de fabricación.',
                color: '#16a34a',
                bg: 'rgba(22,163,74,0.08)',
                border: 'rgba(22,163,74,0.2)',
              },
              {
                icon: '♻️',
                title: 'Equipos seminuevos',
                period: '3 meses',
                desc: 'Garantía por defecto técnico. Cada equipo pasa por revisión antes de la venta.',
                color: '#2563eb',
                bg: 'rgba(37,99,235,0.08)',
                border: 'rgba(37,99,235,0.2)',
              },
              {
                icon: '🔄',
                title: 'Devoluciones',
                period: '7 días',
                desc: 'Si el equipo llega diferente a lo anunciado, lo devuelves sin costo y te reembolsamos.',
                color: '#7c3aed',
                bg: 'rgba(124,58,237,0.08)',
                border: 'rgba(124,58,237,0.2)',
              },
            ].map(g => (
              <div key={g.title} className="card p-7">
                <span className="text-4xl mb-4 block">{g.icon}</span>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-black mb-3"
                  style={{ background: g.bg, color: g.color, border: `1px solid ${g.border}` }}>
                  {g.period}
                </div>
                <h3 className="text-lg font-black text-foreground mb-2">{g.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Covered / Not covered */}
        <section className="py-14" style={{ background: 'var(--surface-2)' }}>
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-black text-foreground text-center mb-10">¿Qué cubre la garantía?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)' }}>
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-black text-foreground">Sí está cubierto</h3>
                </div>
                <ul className="flex flex-col gap-3">
                  {COVERED.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                      <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="font-black text-foreground">No está cubierto</h3>
                </div>
                <ul className="flex flex-col gap-3">
                  {NOT_COVERED.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                      <span className="text-red-500 font-bold flex-shrink-0 mt-0.5">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-black text-foreground text-center mb-3">Proceso de garantía</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Solicitar una garantía o devolución es simple. Sigue estos 4 pasos.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {STEPS.map(s => (
              <div key={s.step} className="card p-6">
                <span className="text-4xl font-black mb-4 block" style={{ color: '#030712', opacity: 0.12 }}>
                  {s.step}
                </span>
                <h4 className="font-black text-foreground mb-2">{s.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto rounded-3xl p-10 text-center" style={{ background: '#030712' }}>
            <h2 className="text-2xl font-black text-white mb-3">¿Tienes un reclamo o consulta?</h2>
            <p className="text-white/60 mb-8">Nuestro equipo responde en minutos por WhatsApp.</p>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
              style={{ background: '#16a34a' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Iniciar reclamo por WhatsApp
            </a>
          </div>
        </section>

      </main>

      <Footer />
      {showLogin && (
        <LoginModal
          onLogin={(s: LoginResponse) => { login(s); setShowLogin(false); }}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}
