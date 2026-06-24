import React from 'react';
import '../index.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import SmoothScroll from '../components/ui/SmoothScroll';
import Preloader from '../components/ui/Preloader';
import CustomCursor from '../components/ui/CustomCursor';

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
  return (
    <html lang="es">
      <body className="cursor-none"> {/* Ocultamos cursor default */}
        <CustomCursor />
        <Preloader />
        <SmoothScroll>
          <Navbar />
          <main className="layout-container">
            {children}
          </main>
          <Footer />
          <BackToTop />
        </SmoothScroll>
      </body>
    </html>
  );
}
