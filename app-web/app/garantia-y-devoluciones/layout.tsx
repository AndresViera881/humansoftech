import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Garantía y Devoluciones',
  description: 'Política de garantía y devoluciones de HumansOfTech. Cada equipo sale con garantía documentada. Si falla, respondemos.',
  alternates: { canonical: '/garantia-y-devoluciones' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
