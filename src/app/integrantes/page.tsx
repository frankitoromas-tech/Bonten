import React from 'react';
import type { Metadata } from 'next';
import Members from '@/components/Members';

export const metadata: Metadata = {
  title: 'Integrantes',
  description: 'Conoce a la Mesa Directiva y a la comunidad BONTEN. Liderados por Fireboy.',
  openGraph: {
    title: 'BONTEN | Integrantes del equipo',
    description: 'Conoce al fundador y a los miembros de nuestra comunidad.',
    images: ['/assets/fireboy_client.webp'],
  },
};

export default function IntegrantesPage() {
  return <Members />;
}
