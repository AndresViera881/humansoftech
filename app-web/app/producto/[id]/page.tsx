import type { Metadata } from 'next';
import type { ApiProduct } from '@/lib/api';
import ProductDetailClient from './ProductDetailClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://humansoftechs.com';

async function fetchProduct(id: string): Promise<ApiProduct | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  const price = parseFloat(product.price);
  const priceStr = price.toLocaleString('es-EC', { minimumFractionDigits: 2 });
  const condition = product.condition === 'nuevo' ? 'Nuevo' : 'Seminuevo';
  const description = product.description
    ? `${product.description.slice(0, 140)} — $${priceStr} con garantía.`
    : `${product.name} — ${condition}. Precio: $${priceStr}. Envío a todo Ecuador con garantía incluida.`;

  const image = product.images?.[0];

  return {
    title: `${product.name} — $${priceStr}`,
    description,
    openGraph: {
      title: `${product.name} — $${priceStr}`,
      description,
      url: `${SITE_URL}/producto/${product.id}`,
      images: image ? [{ url: image, alt: product.name }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — $${priceStr}`,
      description,
      images: image ? [image] : [],
    },
    alternates: { canonical: `/producto/${product.id}` },
  };
}

export default async function ProductDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await fetchProduct(id);

  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description ?? undefined,
        image: product.images?.length ? product.images : undefined,
        sku: product.id,
        brand: { '@type': 'Brand', name: 'HumansOfTech' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: parseFloat(product.price).toFixed(2),
          availability:
            (product.stock ?? 0) > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          itemCondition:
            product.condition === 'nuevo'
              ? 'https://schema.org/NewCondition'
              : 'https://schema.org/UsedCondition',
          seller: { '@type': 'Organization', name: 'HumansOfTech' },
          url: `${SITE_URL}/producto/${product.id}`,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient initialProduct={product} productId={id} />
    </>
  );
}
