import React from 'react';
import Hero from '../components/Hero';
import Library from '../components/Library';
import Newsletter from '../components/Newsletter';

export const metadata = {
  title: 'BONTEN | Inicio',
  description: 'Nuestra Resistencia - En un mundo que ha olvidado el valor de lo esencial, nosotros nos alzamos.',
  openGraph: {
    title: 'BONTEN | La Resistencia',
    description: 'BONTEN no es solo una organización; es un manifiesto de resistencia por aquellos que aún no tienen voz.',
    images: ['/BONTEN_LOG0.jpg'],
  }
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
