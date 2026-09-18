import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gobernanza',
  description: 'Acceso de gobernanza exclusivo para la Mesa Directiva de BONTEN.',
  robots: { index: false, follow: false },
};

export default function GobernanzaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
