import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Envíos a todo Ecuador',
  description: 'Hacemos envíos de celulares y laptops a todo Ecuador desde Ambato. Embalaje seguro, seguimiento en tiempo real y entrega rápida.',
  alternates: { canonical: '/envios-ecuador' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
