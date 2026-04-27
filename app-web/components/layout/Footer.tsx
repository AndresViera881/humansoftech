import { LogoFooter } from './Logo';

const WA_PHONE = '5930995351473';

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/HumanSoftTechs/',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'TikTok',
    href: null,
    path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
  {
    label: 'Instagram',
    href: null,
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'X',
    href: null,
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
];

const LINKS = [
  {
    heading: 'Catálogo',
    items: [
      { label: 'Todos los productos', href: '/' },
      { label: 'Celulares', href: '/' },
      { label: 'Laptops', href: '/' },
      { label: 'Productos nuevos', href: '/' },
      { label: 'Seminuevos', href: '/' },
    ],
  },
  {
    heading: 'Empresa',
    items: [
      { label: 'Quiénes somos', href: '/quienes-somos' },
      { label: 'Garantía y devoluciones', href: '/garantia-y-devoluciones' },
      { label: 'Envíos en Ecuador', href: '/envios-ecuador' },
      { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
    ],
  },
];

const TRUST = [
  {
    value: '500+',
    label: 'Equipos vendidos',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10',
  },
  {
    value: '100%',
    label: 'Garantía incluida',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    value: 'EC',
    label: 'Envíos a todo Ecuador',
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  },
  {
    value: '24/7',
    label: 'Soporte por WhatsApp',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-white/5">

      {/* Accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <LogoFooter size={26} textSize="text-sm" />
            <p className="text-sm text-white/50 leading-relaxed">
              Celulares, laptops y accesorios nuevos y seminuevos con garantía. Tecnología accesible para Ecuador.
            </p>
            <div className="flex flex-col gap-1.5">
              <a href="https://humansoftechs.com" target="_blank" rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white/70 transition-colors">
                humansoftechs.com
              </a>
              <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white/70 transition-colors font-mono">
                +593 9953 514 73
              </a>
              <p className="text-xs text-white/30">Ambato, Ecuador</p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, path, href }) => (
                <a
                  key={label}
                  href={href ?? undefined}
                  onClick={!href ? e => e.preventDefault() : undefined}
                  target={href ? '_blank' : undefined}
                  rel={href ? 'noopener noreferrer' : undefined}
                  title={href ? label : `${label} — próximamente`}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-150
                    ${href
                      ? 'bg-white/5 border-white/10 text-white/50 hover:bg-white/12 hover:text-white hover:border-white/20'
                      : 'bg-white/[0.03] border-white/5 text-white/15 cursor-default'
                    }`}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
            <p className="text-xs text-white/25 -mt-2">@Humansoftechs</p>
          </div>

          {/* Link columns */}
          {LINKS.map(col => (
            <div key={col.heading} className="flex flex-col gap-4">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/30">{col.heading}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.items.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-white/15 group-hover:bg-blue-400 transition-colors flex-shrink-0" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Horarios */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/30">Atención</h4>
            <div className="flex flex-col gap-3">
              {[
                { day: 'Lunes a Viernes', hours: '9:00 — 18:00' },
                { day: 'Sábados', hours: '9:00 — 14:00' },
                { day: 'Domingos', hours: 'Cerrado' },
              ].map(({ day, hours }) => (
                <div key={day} className="flex items-center justify-between gap-4">
                  <span className="text-xs text-white/40">{day}</span>
                  <span className={`text-xs font-semibold tabular-nums ${hours === 'Cerrado' ? 'text-white/20' : 'text-white/70'}`}>{hours}</span>
                </div>
              ))}
            </div>

            <div className="mt-1 pt-4 border-t border-white/5">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/30 mb-3">Ubicación</p>
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/75">Ambato</p>
                  <p className="text-xs text-white/35 mt-0.5">Tungurahua, Ecuador</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRUST.map(({ value, label, icon }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
              <div>
                <p className="text-sm font-black text-white leading-none">{value}</p>
                <p className="text-[10px] text-white/35 mt-0.5 leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-white/25 tracking-wide">
            © {year} HumanSoftechs — Todos los derechos reservados
          </p>
          <p className="text-[11px] text-white/20 italic">
            Innovamos con propósito, creamos con pasión
          </p>
        </div>
      </div>
    </footer>
  );
}
