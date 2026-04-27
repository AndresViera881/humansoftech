import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes',
  description: 'Respuestas a las preguntas más comunes sobre compra, envíos, garantía y pagos en HumansOfTech Ecuador.',
  alternates: { canonical: '/preguntas-frecuentes' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
