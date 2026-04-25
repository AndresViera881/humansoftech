'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const WA_PHONE = '5930995351473';
const FALLBACK = '/products/laptop.svg';

const WA_ICON = (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.533 5.864L.054 23.25a.75.75 0 00.916.916l5.455-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.645-.5-5.17-1.373l-.37-.217-3.828 1.037 1.044-3.742-.24-.386A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
  </svg>
);

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
}

export default function ProductCard({ product, isNew }: ProductCardProps) {
  const images = product.images?.length ? product.images : [FALLBACK];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const slides = images.map(src => ({ src }));
  const waMessage = encodeURIComponent(`Hola! Estoy interesado en: ${product.name}. ¿Tiene disponibilidad y cuál es el precio?`);
  const waUrl = `https://wa.me/${WA_PHONE}?text=${waMessage}`;

  return (
    <>
      {/* ── Card ── */}
      <div
        className={`card flex flex-col overflow-hidden cursor-pointer group ${isNew ? 'animate-new-product' : ''}`}
        style={{ borderRadius: '16px' }}
        onClick={() => setDetailOpen(true)}
      >
        <div className="relative flex items-center justify-center p-5 overflow-hidden"
          style={{ background: '#f8faff', height: '200px', borderBottom: '1px solid var(--border)' }}>
          {product.badge && !isNew && (
            <Badge className="absolute top-3 left-3 z-10 bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-50">
              ⭐ {product.badge}
            </Badge>
          )}
          {isNew && (
            <Badge className="absolute top-3 left-3 z-10 bg-green-50 text-green-600 border-green-200 hover:bg-green-50">
              ✨ Nuevo
            </Badge>
          )}
          <Badge variant="outline" className="absolute top-3 right-3 z-10 bg-blue-50 text-blue-600 border-blue-200">
            {product.category}
          </Badge>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt={product.name}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            style={{ maxHeight: '140px', maxWidth: '100%', mixBlendMode: 'multiply' }} />
          {images.length > 1 && (
            <span className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(37,99,235,0.12)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.2)' }}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {images.length}
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 p-4 gap-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {product.category}
          </p>
          <h3 className="font-bold text-sm leading-snug text-foreground" style={{ lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
          {product.price > 0 && (
            <p className="text-xl font-black" style={{ color: '#2563eb', letterSpacing: '-0.5px' }}>
              ${product.price.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
            </p>
          )}
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full w-fit"
            style={product.condition === 'nuevo'
              ? { background: 'rgba(22,163,74,0.1)', color: '#16a34a' }
              : { background: 'rgba(245,158,11,0.1)', color: '#d97706' }}>
            {product.condition === 'nuevo' ? '✓ Nuevo' : '◎ Seminuevo'}
          </span>
          {product.description && (
            <p className="text-xs text-muted-foreground flex-1" style={{
              lineHeight: '1.55', display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {product.description}
            </p>
          )}
        </div>

        <div className="px-4 pb-4 flex flex-col gap-2">
          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 ${
              added ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}>
            {added ? (
              <>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                ¡Agregado!
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
          <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-green-700 bg-white border border-green-200 hover:bg-green-50 hover:text-green-800 transition-colors duration-150">
            {WA_ICON}
            Consultar por WhatsApp
          </a>
        </div>
      </div>

      {/* ── Lightbox ── */}
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

      {/* ── Detail modal ── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-[480px] flex flex-col p-0 gap-0 h-[350px]" onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 font-bold">
                {product.category}
              </Badge>
              {product.condition && (
                <Badge variant="outline" className={product.condition === 'nuevo'
                  ? 'bg-green-50 text-green-700 border-green-200 font-bold'
                  : 'bg-amber-50 text-amber-700 border-amber-200 font-bold'}>
                  {product.condition === 'nuevo' ? 'Nuevo' : 'Seminuevo'}
                </Badge>
              )}
              {product.badge && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-bold">
                  ⭐ {product.badge}
                </Badge>
              )}
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

            {/* Image */}
            <div
              className="relative flex items-center justify-center rounded-xl overflow-hidden cursor-zoom-in flex-shrink-0"
              style={{ height: '100px', background: 'linear-gradient(135deg, #f0f4ff, #faf5ff)', border: '1px solid #e5e7eb' }}
              onClick={() => { setLightboxIdx(activeImg); setLightboxOpen(true); }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[activeImg]}
                alt={product.name}
                className="object-contain"
                style={{ maxHeight: '80px', maxWidth: '88%', mixBlendMode: 'multiply' }}
              />
              <span className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-white/90 text-muted-foreground shadow-sm">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 5a7 7 0 110 14 7 7 0 010-14z" />
                </svg>
                Ampliar
              </span>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="flex-shrink-0 rounded-lg overflow-hidden transition-all duration-150"
                    style={{
                      width: '52px', height: '52px',
                      border: `2px solid ${i === activeImg ? '#2563eb' : '#e5e7eb'}`,
                      background: '#f8faff',
                      opacity: i === activeImg ? 1 : 0.6,
                    }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-contain p-1" style={{ mixBlendMode: 'multiply' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Name + price */}
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-black leading-tight flex-1 text-foreground">
                {product.name}
              </h2>
              {product.price > 0 && (
                <div className="flex-shrink-0 text-right">
                  <p className="text-2xl font-black text-blue-600" style={{ letterSpacing: '-0.5px' }}>
                    ${product.price.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            {product.description && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-blue-600">
                  Descripción
                </p>
                <p className="text-sm whitespace-pre-line text-muted-foreground" style={{ lineHeight: '1.75' }}>
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 flex gap-3 border-t flex-shrink-0">
            <button
              onClick={handleAddToCart}
              title={added ? '¡Agregado!' : 'Agregar al carrito'}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 ${
                added ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}>
              {added ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
            </button>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              title="Consultar por WhatsApp"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-green-700 bg-white border border-green-200 hover:bg-green-50 hover:text-green-800 transition-colors duration-150">
              {WA_ICON}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
