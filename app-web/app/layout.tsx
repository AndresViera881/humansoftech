import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import CartSidebar from "@/components/layout/CartSidebar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://humansoftechs.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'HumansOfTech — Celulares y Laptops en Ecuador',
    template: '%s | HumansOfTech',
  },
  description: 'Compra celulares, laptops y accesorios al mejor precio en Ecuador. Equipos nuevos y seminuevos con garantía. Envíos a todo el país desde Ambato.',
  keywords: ['celulares Ecuador', 'laptops Ecuador', 'tecnología Ambato', 'smartphones nuevos', 'equipos seminuevos', 'tienda tecnología Ecuador'],
  authors: [{ name: 'HumansOfTech' }],
  creator: 'HumansOfTech',
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    url: SITE_URL,
    siteName: 'HumansOfTech',
    title: 'HumansOfTech — Celulares y Laptops en Ecuador',
    description: 'Compra celulares, laptops y accesorios al mejor precio en Ecuador. Equipos nuevos y seminuevos con garantía incluida.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'HumansOfTech — Tecnología al mejor precio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HumansOfTech — Celulares y Laptops en Ecuador',
    description: 'Compra tecnología al mejor precio en Ecuador con garantía incluida.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'sFfHlm3yzUqGhMPznIfutAPycl8-tcwIDiiD7CiYSaY',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-EC"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ background: 'var(--bg)' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'HumansOfTech',
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', availableLanguage: 'Spanish' },
              address: { '@type': 'PostalAddress', addressLocality: 'Ambato', addressRegion: 'Tungurahua', addressCountry: 'EC' },
            }),
          }}
        />
        <AuthProvider>
          <CartProvider>
            {children}
            <CartSidebar />
            <Toaster richColors position="bottom-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
