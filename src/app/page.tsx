import React from 'react';
import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import Library from '@/components/library/Library';
import Newsletter from '@/components/home/Newsletter';


export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'En un mundo que ha olvidado el valor de lo esencial, nosotros nos alzamos. BONTEN no es solo una organización; es un manifiesto vivo de resistencia por aquellos que aún no tienen voz. Únete a nuestra causa y defiende la vida.',
  openGraph: {
    title: 'BONTEN | La Resistencia',
    description:
      'BONTEN no es solo una organización; es un manifiesto vivo de resistencia por aquellos que aún no tienen voz. Únete a nuestra causa y defiende la vida.',
    images: ['/LOGO_BONTEN_V2.jpeg'],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Library />
      <Newsletter />
    </>
  );
}
