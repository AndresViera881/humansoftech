'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginModal from '@/components/auth/LoginModal';
import { LogoFooter } from '@/components/layout/Logo';
import { useAuth } from '@/lib/auth-context';
import { LoginResponse } from '@/lib/api';

const WA = 'https://wa.me/5930995351473';

const FAQS = [
  {
    category: 'Compras y pagos',
    icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    questions: [
      {
        q: '¿Cómo puedo realizar un pedido?',
        a: 'Puedes agregar productos al carrito desde el catálogo y enviarnos el pedido por WhatsApp, o escribirnos directamente al +593 9953 514 73 o al +593 98 160 9568 indicando el producto que deseas.',
      },
      {
        q: '¿Qué métodos de pago aceptan?',
        a: 'Aceptamos transferencia bancaria y pago con tarjeta de débito o crédito de todos los bancos nacionales del Ecuador (Pichincha, Pacífico, Guayaquil, Produbanco, Bolivariano, Internacional, y más). También aceptamos efectivo en compras locales en Ambato. Escríbenos por WhatsApp y te indicamos la opción más conveniente para ti.',
      },
      {
        q: '¿Puedo reservar un producto?',
        a: 'Sí. Con el 50% del valor puedes reservar cualquier equipo. El stock se retiene hasta 48 horas después del acuerdo.',
      },
      {
        q: '¿Emiten factura?',
        a: 'Sí, emitimos comprobante de venta electrónico para todas las transacciones. Pídelo al momento de la compra indicando tu RUC o cédula.',
      },
    ],
  },
  {
    category: 'Equipos y condición',
    icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    questions: [
      {
        q: '¿Cuál es la diferencia entre nuevo y seminuevo?',
        a: 'Los equipos nuevos vienen sellados de fábrica. Los seminuevos son equipos de uso previo en excelente estado, revisados y probados por nuestro equipo técnico antes de la venta.',
      },
      {
        q: '¿Los equipos seminuevos tienen algún defecto?',
        a: 'No vendemos equipos con defectos. Antes de publicar un seminuevo, lo revisamos técnicamente. Si tiene alguna observación menor (rayón estético, por ejemplo), lo indicamos claramente en la descripción.',
      },
{
        q: '¿Los celulares vienen desbloqueados?',
        a: 'Sí, todos nuestros equipos son liberados para cualquier operadora. Funcionan con Claro, Movistar, CNT y demás.',
      },
    ],
  },
  {
    category: 'Garantía y devoluciones',
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    questions: [
      {
        q: '¿Qué garantía tienen los equipos?',
        a: 'Los equipos nuevos tienen 12 meses de garantía y los seminuevos 3 meses. La garantía cubre defectos de fabricación y fallas técnicas sin daño físico externo.',
      },
      {
        q: '¿Cómo hago una devolución?',
        a: 'Tienes 7 días desde la recepción para solicitar devolución si el producto no corresponde a lo anunciado. Escríbenos por WhatsApp con fotos del equipo y el motivo.',
      },
      {
        q: '¿La garantía cubre daños por caída?',
        a: 'No. La garantía no cubre daños físicos causados por caída, golpe, líquido o mal uso. Solo aplica para fallas técnicas o de fabricación.',
      },
    ],
  },
  {
    category: 'Envíos',
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
    questions: [
      {
        q: '¿Envían a todo Ecuador?',
        a: 'Sí, enviamos a todas las provincias del Ecuador continental y Galápagos. Trabajamos con empresas de courier confiables.',
      },
      {
        q: '¿Cuánto demora el envío?',
        a: 'Ambato y ciudades cercanas: 24 horas. Quito y Guayaquil: 24-48 horas. Otras ciudades: 48-72 horas. Oriente y Galápagos: 3-5 días hábiles.',
      },
      {
        q: '¿Cómo rastreo mi pedido?',
        a: 'Una vez despachado, te enviamos el número de guía de la empresa de courier para que puedas rastrear tu pedido en tiempo real.',
      },
      {
        q: '¿Qué pasa si el equipo llega dañado?',
        a: 'Fotografía el paquete antes de abrirlo y avísanos de inmediato. Gestionamos el reclamo con la empresa de courier y te reponemos el equipo.',
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left transition-colors hover:text-primary"
      >
        <span className="text-sm font-semibold text-foreground">{q}</span>
        <svg
          className="w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="text-sm text-muted-foreground pb-4 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function PreguntasFrecuentesPage() {
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
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
          </div>
          <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
            <div className="flex justify-center mb-8">
              <LogoFooter size={30} textSize="text-sm" />
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.3)' }}>
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 border"
              style={{ background: 'rgba(37,99,235,0.15)', color: '#60a5fa', borderColor: 'rgba(37,99,235,0.3)' }}>
              Centro de ayuda
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              Preguntas frecuentes
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Encuentra respuesta a las dudas más comunes. Si no encuentras lo que buscas,
              escríbenos por WhatsApp.
            </p>
          </div>
        </section>

        {/* FAQ sections */}
        <section className="max-w-3xl mx-auto px-6 py-14 flex flex-col gap-8">
          {FAQS.map(section => (
            <div key={section.category} className="card p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#030712' }}>
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={section.icon} />
                  </svg>
                </div>
                <h2 className="text-lg font-black text-foreground">{section.category}</h2>
              </div>
              <div>
                {section.questions.map(item => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto rounded-3xl p-10 text-center" style={{ background: '#030712' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.3)' }}>
              <svg className="w-7 h-7 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">¿No encontraste tu respuesta?</h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Nuestro equipo está disponible por WhatsApp de lunes a sábado. Respondemos en minutos.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a href={WA} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
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
