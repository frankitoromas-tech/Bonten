import React from 'react';
import type { Metadata } from 'next';
import ComunidadContent from '@/components/home/ComunidadContent';

export const metadata: Metadata = {
  title: 'Comunidad',
  description:
    'Muro de la comunidad BONTEN: fraternidad activa provida, decálogo de honor, directorio de miembros y publicaciones de la resistencia.',
  openGraph: {
    title: 'BONTEN | Muro de la Comunidad',
    description:
      'Fraternidad activa provida, decálogo y adhesión de honor. Únete a la resistencia.',
    images: ['/LOGO_BONTEN_V2.jpeg'],
  },
};

export default function ComunidadPage() {
  return <ComunidadContent />;
}
