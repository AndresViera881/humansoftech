'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { api, ApiProduct } from '@/lib/api';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginModal from '@/components/auth/LoginModal';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const WA_PHONE = '5930995351473';
const FALLBACK = '/products/laptop.svg';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const { login } = useAuth();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.products.getById(id)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const images = product?.images?.length ? product.images : [FALLBACK];
  const slides = images.map((src) => ({ src }));
  const price = product ? parseFloat(product.price) : 0;
  const waMsg = encodeURIComponent(
    `Hola! Estoy interesado en: ${product?.name}. ¿Tiene disponibilidad y cuál es el precio?`
  );
  const waUrl = `https://wa.me/${WA_PHONE}?text=${waMsg}`;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      category: product.category.name,
      price,
      description: product.description ?? '',
      images,
      badge: product.badge ?? undefined,
      condition: product.condition,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        searchValue=""
        onSearchChange={() => {}}
        onFilterClick={() => {}}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-6 md:py-10">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold mb-6 transition-colors duration-150"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al catálogo
        </button>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="rounded-2xl overflow-hidden" style={{ height: '420px', background: 'linear-gradient(90deg,#f3f4f6 25%,#e9ebee 50%,#f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease infinite' }} />
            <div className="flex flex-col gap-4 pt-2">
              {[0.3, 0.7, 0.25, 1, 1, 0.5].map((w, i) => (
                <div key={i} className="h-4 rounded-full bg-gray-200" style={{ width: `${w * 100}%`, animation: 'shimmer 1.4s ease infinite' }} />
              ))}
            </div>
          </div>
        )}

        {/* Not found */}
        {!loading && notFound && (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">😕</p>
            <p className="text-lg font-bold text-foreground">Producto no encontrado</p>
            <p className="text-sm text-muted-foreground mt-1">Es posible que haya sido eliminado o el enlace sea incorrecto.</p>
            <button onClick={() => router.push('/')} className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: '#2563eb' }}>
              Ver catálogo
            </button>
          </div>
        )}

        {/* Product detail */}
        {!loading && product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

            {/* ── Left: Image gallery ── */}
            <div className="flex flex-col gap-4">

              {/* Main image */}
              <div
                className="relative flex items-center justify-center rounded-2xl overflow-hidden cursor-zoom-in group"
                style={{
                  background: 'var(--brand-subtle)',
                  border: '1px solid var(--border)',
                  height: '400px',
                }}
                onClick={() => { setLightboxIdx(activeImg); setLightboxOpen(true); }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[activeImg]}
                  alt={product.name}
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  style={{ maxHeight: '340px', maxWidth: '88%', mixBlendMode: 'multiply' }}
                />
                <span className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-muted-foreground shadow-sm border border-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 5a7 7 0 110 14 7 7 0 010-14z" />
                  </svg>
                  Ampliar
                </span>
                {images.length > 1 && (
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-muted-foreground shadow-sm">
                    {activeImg + 1} / {images.length}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-150"
                      style={{
                        width: '76px',
                        height: '76px',
                        border: `2px solid ${i === activeImg ? '#2563eb' : 'var(--border)'}`,
                        background: 'var(--brand-subtle)',
                        opacity: i === activeImg ? 1 : 0.55,
                        transform: i === activeImg ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: i === activeImg ? '0 0 0 3px rgba(37,99,235,0.15)' : 'none',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="w-full h-full object-contain p-1.5" style={{ mixBlendMode: 'multiply' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Product info ── */}
            <div className="flex flex-col gap-5">

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold">
                  {product.category.name}
                </Badge>
                {product.condition && (
                  <Badge
                    variant="outline"
                    className={
                      product.condition === 'nuevo'
                        ? 'bg-green-50 text-green-700 border-green-200 font-bold'
                        : 'bg-amber-50 text-amber-700 border-amber-200 font-bold'
                    }
                  >
                    {product.condition === 'nuevo' ? '✓ Nuevo' : '◎ Seminuevo'}
                  </Badge>
                )}
                {product.badge && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 font-bold">
                    ⭐ {product.badge}
                  </Badge>
                )}
              </div>

              {/* Name */}
              <h1 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              {price > 0 && (
                <div className="flex items-end gap-3">
                  <p className="text-4xl font-black leading-none" style={{ color: '#2563eb', letterSpacing: '-1px' }}>
                    ${price.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-sm text-muted-foreground mb-0.5">IVA incluido</span>
                </div>
              )}

              <Separator />

              {/* Description */}
              {product.description && (
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary">
                    Características
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line" style={{ lineHeight: '1.9' }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* Trust chips */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {[
                  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Garantía incluida' },
                  { icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', label: 'Envíos a Ecuador' },
                  { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: 'Soporte WhatsApp' },
                  { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label: 'Devoluciones fáciles' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.1)' }}>
                    <svg className="w-4 h-4 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                    <span className="text-xs font-semibold text-foreground">{label}</span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold text-white transition-all duration-200 ${
                    added ? 'bg-green-600' : 'hover:brightness-110 active:scale-[0.98]'
                  }`}
                  style={added ? {} : { background: '#2563eb', boxShadow: '0 4px 18px rgba(37,99,235,0.35)' }}
                >
                  {added ? (
                    <>
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      ¡Agregado al carrito!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Agregar al carrito
                    </>
                  )}
                </button>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-colors duration-150"
                  style={{ background: 'white', border: '2px solid #16a34a', color: '#15803d' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f0fdf4')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  Consultar por WhatsApp
                </a>
              </div>

            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIdx}
        slides={slides}
        plugins={[Thumbnails, Zoom]}
        thumbnails={{ position: 'bottom', width: 80, height: 60, gap: 8, border: 2, borderRadius: 8 }}
        zoom={{ maxZoomPixelRatio: 3, zoomInMultiplier: 1.5 }}
        styles={{ container: { backgroundColor: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(12px)' } }}
      />

      {showLogin && (
        <LoginModal
          onLogin={(session) => { login(session); setShowLogin(false); }}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}
