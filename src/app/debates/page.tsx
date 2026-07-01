import React from 'react';
import type { Metadata } from 'next';
import Debates from '@/components/Debates';

export const metadata: Metadata = {
  title: 'Debates',
  description:
    'Foro de debates de BONTEN: dialoga sobre la verdad, la teología y nuestra postura ante el mundo moderno.',
  openGraph: {
    title: 'BONTEN | Foro de Debates',
    description: 'Espacio para el diálogo apologético y sociológico de la comunidad.',
    images: ['/LOGO_BONTEN_V2.jpeg'],
  },
};

export default function DebatesPage() {
  return <Debates />;
}
