import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiénes somos',
  description: 'Somos HumansOfTech, tu tienda de tecnología en Ambato, Ecuador. Más de 4 años vendiendo celulares y laptops nuevos y seminuevos con garantía real.',
  alternates: { canonical: '/quienes-somos' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
