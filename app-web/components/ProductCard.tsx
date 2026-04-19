'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { Product } from '@/lib/types';

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
  const [open, setOpen] = useState(false);

  const slides = images.map(src => ({ src }));

  const waMessage = encodeURIComponent(`Hola! Estoy interesado en: ${product.name}. ¿Tiene disponibilidad y cuál es el precio?`);
  const waUrl = `https://wa.me/${WA_PHONE}?text=${waMessage}`;

  return (
    <>
      <div className={`card flex flex-col overflow-hidden ${isNew ? 'animate-new-product' : ''}`}
        style={{ borderRadius: '16px' }}>

        {/* Image */}
        <div
          className="relative flex items-center justify-center p-5 group cursor-zoom-in overflow-hidden"
          style={{ background: '#fff', height: '200px', borderBottom: '1px solid var(--border)' }}
          onClick={() => setOpen(true)}
        >
          {product.badge && (
            <span className="badge absolute top-3 left-3 z-10"
              style={{ background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' }}>
              ⭐ {product.badge}
            </span>
          )}
          {isNew && (
            <span className="badge absolute top-3 left-3 z-10"
              style={{ background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }}>
              ✨ Nuevo
            </span>
          )}
          <span className="badge absolute top-3 right-3 z-10"
            style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
            {product.category}
          </span>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt={product.name}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            style={{ maxHeight: '140px', maxWidth: '100%', mixBlendMode: 'multiply' }}
          />

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

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {product.category}
          </p>
          <h3 className="font-bold text-base leading-snug" style={{ color: 'var(--text)', lineHeight: '1.35' }}>
            {product.name}
          </h3>
          <p className="text-sm flex-1" style={{
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '64px',
          }}>
            {product.description}
          </p>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-wa mt-2">
            {WA_ICON}
            Consultar por WhatsApp
          </a>
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        plugins={[Thumbnails, Zoom]}
        thumbnails={{ position: 'bottom', width: 80, height: 60, gap: 8, border: 2, borderRadius: 8 }}
        zoom={{ maxZoomPixelRatio: 3, zoomInMultiplier: 1.5 }}
        styles={{
          container: { backgroundColor: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(12px)' },
        }}
      />
    </>
  );
}
