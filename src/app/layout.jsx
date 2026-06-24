import React from 'react';
import '../index.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

export const metadata = {
  title: 'BONTEN',
  description: 'Nuestra Resistencia - BONTEN',
  manifest: '/manifest.webmanifest',
  themeColor: '#033266',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BONTEN'
  }
};

export default function RootLayout({ children }) {
  // Nota: El tema será manejado en un Client Component, 
  // pero mantendremos la etiqueta html.
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main className="layout-container">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
