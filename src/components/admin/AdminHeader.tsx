'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { AdminAccountModal } from './AdminAccountModal';

export function AdminHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname === '/admin/login') {
    return null;
  }

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playToggle: () => void } }).bontenAudio) {
      (window as unknown as { bontenAudio: { playToggle: () => void } }).bontenAudio.playToggle();
    }
  };

  return (
    <header className="sticky top-0 z-40 admin-header px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Identity con Logo Oficial BONTEN */}
        <Link href="/admin" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
          <Image
            src="/LOGO_BONTEN_V2.jpeg"
            alt="Logo Bonten"
            width={38}
            height={38}
            className="rounded-xl border border-slate-200 dark:border-white/10 object-cover shadow-sm transition-transform group-hover:scale-105"
            priority
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-[var(--title-color)]">
                BONTEN
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25">
                Panel Administrativo
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] hidden sm:block">
              Centro de Control & Gobernanza Doctrinal
            </p>
          </div>
        </Link>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle (Modo Claro / Oscuro) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-admin-secondary text-xs"
            aria-label="Alternar modo claro y oscuro"
            title={mounted ? (theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro') : 'Cambiar tema'}
          >
            {mounted && theme === 'dark' ? (
              <>
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="#f59e0b" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <span className="hidden md:inline text-amber-300 font-medium">Modo Claro</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="#0284c7" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span className="hidden md:inline text-slate-700 dark:text-slate-200 font-medium">Modo Oscuro</span>
              </>
            )}
          </button>

          {/* Gestión de Cuenta */}
          <button
            type="button"
            onClick={() => {
              setAccountOpen(true);
              if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playTactilePop: () => void } }).bontenAudio) {
                (window as unknown as { bontenAudio: { playTactilePop: () => void } }).bontenAudio.playTactilePop();
              }
            }}
            className="btn-admin-secondary text-xs flex items-center gap-1.5"
            title="Gestionar clave y credenciales de acceso"
          >
            <span className="badge-emoji-halo">🔑</span>
            <span className="hidden sm:inline">Mi Cuenta</span>
          </button>

          {/* Enlace al sitio público */}
          <Link
            href="/"
            target="_blank"
            className="btn-admin-secondary text-xs"
            title="Abrir sitio web público en nueva pestaña"
          >
            <span>Ver Web</span>
            <span className="text-xs opacity-60">↗</span>
          </Link>

          {/* Cerrar sesión */}
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
            >
              Salir
            </button>
          </form>
        </div>
      </div>

      <AdminAccountModal isOpen={accountOpen} onClose={() => setAccountOpen(false)} />
    </header>
  );
}
