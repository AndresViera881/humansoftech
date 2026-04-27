'use client';

import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { Product } from '@/lib/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const WA_PHONE = '5930995351473';
const FALLBACK = '/products/laptop.svg';

const WaIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
  </svg>
);

interface ProductDetailModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (e: React.MouseEvent) => void;
  added: boolean;
}

export default function ProductDetailModal({
  product,
  open,
  onOpenChange,
  onAddToCart,
  added,
}: ProductDetailModalProps) {
  const images = product.images?.length ? product.images : [FALLBACK];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (open) setActiveImg(0);
  }, [open]);

  const slides = images.map((src) => ({ src }));
  const waMsg = encodeURIComponent(
    `Hola! Estoy interesado en: ${product.name}. ¿Tiene disponibilidad y cuál es el precio?`
  );
  const waUrl = `https://wa.me/${WA_PHONE}?text=${waMsg}`;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="w-[95vw] max-w-[800px] p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col md:flex-row" style={{ maxHeight: '90vh' }}>

            {/* ── Left: Image gallery ── */}
            <div
              className="md:w-[42%] flex flex-col flex-shrink-0"
              style={{ background: 'var(--brand-subtle)', borderRight: '1px solid var(--border)' }}
            >
              {/* Main image */}
              <div
                className="flex-1 flex items-center justify-center relative cursor-zoom-in group"
                style={{ minHeight: '240px', padding: '28px 24px 16px' }}
                onClick={() => { setLightboxIdx(activeImg); setLightboxOpen(true); }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[activeImg]}
                  alt={product.name}
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                  style={{ maxHeight: '230px', maxWidth: '100%', mixBlendMode: 'multiply' }}
                />
                <span className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 text-muted-foreground shadow-sm border border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 5a7 7 0 110 14 7 7 0 010-14z" />
                  </svg>
                  Ampliar
                </span>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-150"
                      style={{
                        width: '62px',
                        height: '62px',
                        border: `2px solid ${i === activeImg ? '#2563eb' : 'var(--border)'}`,
                        background: 'white',
                        opacity: i === activeImg ? 1 : 0.5,
                        transform: i === activeImg ? 'scale(1.06)' : 'scale(1)',
                        boxShadow: i === activeImg ? '0 0 0 3px rgba(37,99,235,0.15)' : 'none',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-contain p-1"
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Image count indicator */}
              {images.length > 1 && (
                <p className="text-center text-[10px] text-muted-foreground pb-3">
                  {activeImg + 1} / {images.length} fotos
                </p>
              )}
            </div>

            {/* ── Right: Product info ── */}
            <div className="md:w-[58%] flex flex-col min-h-0">

              {/* Header: badges */}
              <div className="px-6 pt-5 pb-4 border-b flex-shrink-0">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/5 text-primary border-primary/20 font-bold text-[11px]"
                  >
                    {product.category}
                  </Badge>
                  {product.condition && (
                    <Badge
                      variant="outline"
                      className={
                        product.condition === 'nuevo'
                          ? 'bg-green-50 text-green-700 border-green-200 font-bold text-[11px]'
                          : 'bg-amber-50 text-amber-700 border-amber-200 font-bold text-[11px]'
                      }
                    >
                      {product.condition === 'nuevo' ? '✓ Nuevo' : '◎ Seminuevo'}
                    </Badge>
                  )}
                  {product.badge && (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-600 border-amber-200 font-bold text-[11px]"
                    >
                      ⭐ {product.badge}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4 min-h-0">

                {/* Product name */}
                <h2 className="text-xl font-black text-foreground leading-tight">
                  {product.name}
                </h2>

                {/* Price */}
                {product.price > 0 && (
                  <div className="flex items-end gap-2.5">
                    <p
                      className="text-[2rem] font-black leading-none"
                      style={{ color: '#2563eb', letterSpacing: '-0.5px' }}
                    >
                      ${product.price.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-xs text-muted-foreground mb-0.5 pb-1">IVA incluido</span>
                  </div>
                )}

                <Separator />

                {/* Description */}
                {product.description && (
                  <div className="flex flex-col gap-2.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-primary">
                      Características
                    </p>
                    <p
                      className="text-sm text-muted-foreground whitespace-pre-line"
                      style={{ lineHeight: '1.85' }}
                    >
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Delivery info strip */}
                <div className="flex flex-col gap-2 pt-1">
                  {[
                    { icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', text: 'Envío disponible a todo Ecuador' },
                    { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: 'Garantía incluida en todos los equipos' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.08)' }}>
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                        </svg>
                      </div>
                      <p className="text-xs text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer: action buttons */}
              <div
                className="px-6 py-4 border-t flex-shrink-0 flex flex-col gap-2.5"
                style={{ background: 'oklch(0.985 0 0)' }}
              >
                <button
                  onClick={onAddToCart}
                  className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 ${
                    added ? 'bg-green-600 hover:bg-green-700' : 'hover:brightness-110 active:scale-[0.98]'
                  }`}
                  style={added ? {} : { background: '#2563eb' }}
                >
                  {added ? (
                    <>
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      ¡Agregado al carrito!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold text-green-700 bg-white border border-green-200 hover:bg-green-50 hover:text-green-800 transition-colors duration-150"
                >
                  <WaIcon />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  );
}
