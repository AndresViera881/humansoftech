'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginModal from '@/components/auth/LoginModal';
import { useAuth } from '@/lib/auth-context';
import { LoginResponse } from '@/lib/api';

const WA = 'https://wa.me/5930995351473';

const STATS = [
  { value: '500+', label: 'Equipos vendidos' },
  { value: '4+', label: 'Años de experiencia' },
  { value: '24/7', label: 'Soporte activo' },
  { value: '100%', label: 'Garantía incluida' },
];

const VALUES = [
  {
    emoji: '🤝',
    title: 'Honestidad',
    desc: 'Transparencia total en precios, condiciones y estado de cada equipo. Sin letra chica.',
  },
  {
    emoji: '🛡️',
    title: 'Garantía real',
    desc: 'Cada producto sale con garantía documentada. Si falla, respondemos.',
  },
  {
    emoji: '⚡',
    title: 'Atención rápida',
    desc: 'Respondemos por WhatsApp en minutos. Tu tiempo es tan valioso como el nuestro.',
  },
  {
    emoji: '📦',
    title: 'Envíos seguros',
    desc: 'Despachamos a todo Ecuador con embalaje protegido y seguimiento en tiempo real.',
  },
];

export default function QuienesSomosPage() {
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
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
            <div className="absolute -bottom-16 right-1/3 w-72 h-72 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
          </div>
          <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5 border"
                style={{ background: 'rgba(37,99,235,0.15)', color: '#60a5fa', borderColor: 'rgba(37,99,235,0.3)' }}>
                Sobre nosotros
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
                Tecnología accesible<br />
                <span style={{ color: '#60a5fa' }}>para cada ecuatoriano</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed max-w-xl">
                Somos HumanSoftechs, tu tienda de confianza en Ambato. Vendemos celulares y laptops
                nuevos y seminuevos con garantía, al mejor precio del mercado.
              </p>
              <div className="flex items-center gap-3 mt-8 flex-wrap justify-center md:justify-start">
                <a href={WA} target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 flex items-center gap-2"
                  style={{ background: '#16a34a' }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  Escribir por WhatsApp
                </a>
                <button onClick={() => router.push('/')}
                  className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                  Ver catálogo
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 hidden md:flex items-center justify-center w-72 h-72 rounded-3xl overflow-hidden border border-white/10"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <svg className="w-40 h-40 text-blue-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black mb-1" style={{ color: '#030712' }}>{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-black text-foreground text-center mb-10">Quiénes somos</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Nuestra misión',
                icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                text: 'Hacer la tecnología accesible para cada ecuatoriano. Ofrecemos celulares y laptops de calidad —nuevos y seminuevos— con garantía real, precios justos y atención personalizada.',
              },
              {
                title: 'Nuestra visión',
                icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
                text: 'Ser la tienda de tecnología más confiable del Ecuador, reconocida por transparencia, calidad de servicio y el compromiso genuino con la satisfacción de cada cliente.',
              },
            ].map(item => (
              <div key={item.title} className="card p-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0"
                  style={{ background: '#030712' }}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="py-16" style={{ background: 'var(--surface-2)' }}>
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-black text-foreground text-center mb-3">Nuestros valores</h2>
            <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
              Estos principios guían cada decisión que tomamos y cada producto que vendemos.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {VALUES.map(v => (
                <div key={v.title} className="card p-6 text-center">
                  <span className="text-4xl mb-4 block">{v.emoji}</span>
                  <h4 className="font-black text-foreground mb-2">{v.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="rounded-3xl p-10 md:p-14 text-center" style={{ background: '#030712' }}>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              ¿Por qué elegir HumanSoftechs?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              Somos una empresa familiar con sede en Ambato. Cada equipo que vendemos lo revisamos
              personalmente. No somos una plataforma anónima — somos personas reales que responden
              tu WhatsApp y se hacen responsables de cada venta.
            </p>
            <div className="grid sm:grid-cols-3 gap-5 mb-10">
              {[
                { icon: '✓', text: 'Revisión física de cada equipo' },
                { icon: '✓', text: 'Facturación y garantía documentada' },
                { icon: '✓', text: 'Soporte post-venta real' },
              ].map(i => (
                <div key={i.text} className="flex items-center gap-3 px-5 py-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="text-green-400 font-black text-lg flex-shrink-0">{i.icon}</span>
                  <span className="text-white/80 text-sm font-medium">{i.text}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a href={WA} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                style={{ background: '#16a34a' }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                Consultar por WhatsApp
              </a>
              <button onClick={() => router.push('/')}
                className="px-7 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                Ver catálogo
              </button>
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
