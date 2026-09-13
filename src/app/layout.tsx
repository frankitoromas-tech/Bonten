import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../index.css';
import { outfit, bangers } from './fonts';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import AmbientBackground from '@/components/layout/AmbientBackground';
import Interactive3DBackground from '@/components/layout/Interactive3DBackground';
import CursorSpotlight from '@/components/layout/CursorSpotlight';
import AudioController from '@/components/layout/AudioController';
import QuickSearch from '@/components/layout/QuickSearch';
import PublicAssistant from '@/components/layout/PublicAssistant';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  metadataBase: new URL('https://bonten.vercel.app'),
  title: {
    default: 'BONTEN | Nuestra Resistencia',
    template: '%s | BONTEN',
  },
  description: 'BONTEN es nuestra resistencia activa. Únete al manifiesto y descubre nuestra filosofía, debates y biblioteca para aquellos que defienden el valor de la vida.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BONTEN',
  },
};

export const viewport: Viewport = {
  themeColor: '#03254c',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${outfit.variable} ${bangers.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <AmbientBackground />
            <Interactive3DBackground />
            <CursorSpotlight />
            <Navbar />
            <QuickSearch />
            <main className="layout-container">{children}</main>
            <Footer />
            <BackToTop />
            <PublicAssistant />
            <AudioController />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
