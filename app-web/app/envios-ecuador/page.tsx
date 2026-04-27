'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginModal from '@/components/auth/LoginModal';
import { useAuth } from '@/lib/auth-context';
import { LoginResponse } from '@/lib/api';

const WA = 'https://wa.me/5930995351473';

const ZONES = [
  {
    zone: 'Sierra centro',
    cities: 'Ambato, Latacunga, Riobamba, Guaranda',
    time: '24 horas',
    cost: 'Consultar',
    highlight: true,
  },
  {
    zone: 'Quito y Guayaquil',
    cities: 'Quito, Guayaquil y área metropolitana',
    time: '24 – 48 horas',
    cost: 'Consultar',
    highlight: false,
  },
  {
    zone: 'Costa e Inter-Andina',
    cities: 'Cuenca, Manta, Portoviejo, Esmeraldas, Ibarra, Loja',
    time: '48 – 72 horas',
    cost: 'Consultar',
    highlight: false,
  },
  {
    zone: 'Oriente y Galápagos',
    cities: 'Tena, Puyo, Lago Agrio, Nueva Loja, Galápagos',
    time: '3 – 5 días hábiles',
    cost: 'Consultar',
    highlight: false,
  },
];

const HOW_STEPS = [
  {
    icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    title: 'Haz tu pedido',
    desc: 'Agrega el producto al carrito o contáctanos por WhatsApp y coordina tu compra.',
  },
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Verificamos el equipo',
    desc: 'Revisamos y embalamos el equipo de forma segura antes de entregarlo a la empresa de envíos.',
  },
  {
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    title: 'Despachamos',
    desc: 'Trabajamos con empresas de courier confiables. Te enviamos el número de guía para rastreo.',
  },
  {
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    title: 'Recibes en tu puerta',
    desc: 'El equipo llega embalado y protegido. Verifica el estado al recibir y avísanos si hay algún inconveniente.',
  },
];

export default function EnviosPage() {
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
            <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #16a34a, transparent)' }} />
          </div>
          <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)' }}>
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 border"
              style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80', borderColor: 'rgba(22,163,74,0.3)' }}>
              Cobertura nacional
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              Envíos a todo Ecuador
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Despachamos desde Ambato a cualquier rincón del país. Embalaje seguro,
              número de guía incluido y atención directa si hay algún inconveniente en tránsito.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-black text-foreground text-center mb-3">¿Cómo funciona el envío?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            De tu pedido a tu puerta en 4 pasos simples.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {HOW_STEPS.map((s, i) => (
              <div key={s.title} className="card p-6 relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{ background: '#030712' }}>
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </div>
                <span className="text-4xl font-black absolute top-4 right-5"
                  style={{ color: '#030712', opacity: 0.06 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h4 className="font-black text-foreground mb-2">{s.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Zones */}
        <section className="py-14" style={{ background: 'var(--surface-2)' }}>
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-black text-foreground text-center mb-3">Zonas de cobertura</h2>
            <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
              Tiempos de entrega aproximados desde Ambato, Tungurahua.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {ZONES.map(z => (
                <div key={z.zone} className="card p-6 flex items-start gap-4"
                  style={z.highlight ? { borderColor: '#030712', borderWidth: 2 } : {}}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: z.highlight ? '#030712' : 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <svg className="w-5 h-5" style={{ color: z.highlight ? '#fff' : 'var(--muted-foreground)' }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-black text-foreground">{z.zone}</h4>
                      {z.highlight && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(3,7,18,0.08)', color: '#030712' }}>
                          Sede principal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{z.cities}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                        style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }}>
                        ⏱ {z.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              * Los tiempos son referenciales y pueden variar según la empresa de courier y condiciones del servicio.
            </p>
          </div>
        </section>

        {/* Tips */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-black text-foreground text-center mb-10">Recomendaciones al recibir</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: '📸',
                title: 'Fotografía el paquete',
                desc: 'Toma fotos del paquete antes de abrirlo. Si hay daño externo, es evidencia para tu reclamo.',
              },
              {
                icon: '🔍',
                title: 'Revisa en el momento',
                desc: 'Enciende y verifica el equipo frente al mensajero si es posible. Avísanos de inmediato si algo no está bien.',
              },
              {
                icon: '📦',
                title: 'Guarda el embalaje',
                desc: 'Conserva la caja original los primeros días. Es necesaria para gestionar una garantía o devolución.',
              },
            ].map(t => (
              <div key={t.title} className="card p-6 text-center">
                <span className="text-4xl mb-4 block">{t.icon}</span>
                <h4 className="font-black text-foreground mb-2">{t.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto rounded-3xl p-10 text-center" style={{ background: '#030712' }}>
            <h2 className="text-2xl font-black text-white mb-3">¿Quieres coordinar un envío?</h2>
            <p className="text-white/60 mb-8">Escríbenos y te damos el costo exacto de envío a tu ciudad.</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button onClick={() => router.push('/')}
                className="px-7 py-3.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
                style={{ background: '#2563eb' }}>
                Ver productos
              </button>
              <a href={WA} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
                style={{ background: '#16a34a' }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                Consultar costo de envío
              </a>
            </div>
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
