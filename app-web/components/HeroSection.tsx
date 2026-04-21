'use client';

import { LogoIcon } from '@/components/Logo';

const WA_PHONE = '5930995351473';

export default function HeroSection() {
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>

      {/* Text row */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #fff9f2 0%, #f0e8d8 60%, #faf7f2 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position: 'absolute', top: '-60px', right: '5%', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        </div>

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-8 max-w-7xl mx-auto w-full">
          {/* Text */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
              style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.18)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#2563eb' }} />
              <span className="text-xs font-semibold" style={{ color: '#2563eb', letterSpacing: '0.05em' }}>OFERTAS DE LA SEMANA</span>
            </div>

            <h1 className="font-black text-3xl md:text-4xl leading-tight mb-2" style={{ color: 'var(--text)' }}>
              Tecnología al{' '}
              <span style={{ color: '#2563eb' }}>mejor precio</span>
            </h1>

            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Los mejores equipos, celulares y accesorios. Envíos rápidos y consultas por WhatsApp al instante.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer"
                className="btn-wa flex-shrink-0"
                style={{ width: 'auto', padding: '10px 20px' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Consultar por WhatsApp
              </a>
              <button className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ background: 'rgba(37,99,235,0.07)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.18)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.13)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.07)'; }}>
                Ver catálogo →
              </button>
            </div>
          </div>

          {/* Mini stats */}
          <div className="flex items-center gap-8 flex-shrink-0">
            {[
              { value: '500+', label: 'Productos' },
              { value: '50+', label: 'Marcas' },
              { value: '🚀', label: 'Envíos nacionales' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-xl font-black" style={{ color: '#2563eb' }}>{value}</div>
                <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-width video */}
      <div className="relative w-full" style={{ background: '#0a0a0a', maxHeight: '420px', overflow: 'hidden' }}>
        {/* Placeholder */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', zIndex: 0 }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(37,99,235,0.18)', border: '2px solid rgba(37,99,235,0.35)' }}>
            <svg className="w-7 h-7" style={{ color: '#60a5fa', marginLeft: '4px' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Sube tu video a <code style={{ color: '#60a5fa', fontSize: '12px' }}>/public/video/promo.mp4</code>
          </p>
        </div>
        {/* Video real */}
        <video
          src="/video/promo.mp4"
          autoPlay
          muted
          loop
          playsInline
          controls
          className="relative w-full"
          style={{ maxHeight: '420px', objectFit: 'cover', display: 'block', zIndex: 1 }}
        />
      </div>

    </div>
  );
}
