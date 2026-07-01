import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../index.css';
import { outfit, bangers } from './fonts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export const metadata: Metadata = {
  metadataBase: new URL('https://bonten-bice.vercel.app'),
  title: {
    default: 'BONTEN | Nuestra Resistencia',
    template: '%s | BONTEN',
  },
  description: 'Nuestra Resistencia - BONTEN',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BONTEN',
  },
};

export const viewport: Viewport = {
  themeColor: '#033266',
};

import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${outfit.variable} ${bangers.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <main className="layout-container">{children}</main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
