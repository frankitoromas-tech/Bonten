'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ICONS: Record<string, React.ReactNode> = {
  '/': (
    <svg viewBox="0 0 24 24" width="17" height="17" className="nav-svg-icon drop-shadow-[0_0_8px_rgba(251,191,36,0.55)] transition-transform duration-300 group-hover:scale-110">
      <defs>
        <linearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path d="M13 2L3.5 13.5h7.5L9.5 22 20.5 10.5H13L14.5 2z" fill="url(#boltGrad)" stroke="#fef08a" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.5" fill="url(#sparkGrad)" />
    </svg>
  ),
  '/integrantes': (
    <svg viewBox="0 0 24 24" width="17" height="17" className="nav-svg-icon drop-shadow-[0_0_8px_rgba(56,189,248,0.55)] transition-transform duration-300 group-hover:scale-110">
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <path d="M12 2L4 5.5v6.2c0 5.4 3.4 10.4 8 11.8 4.6-1.4 8-6.4 8-11.8V5.5L12 2z" fill="url(#shieldGrad)" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 6.5v11m-3.5-5.5h7" stroke="#e0f2fe" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.8" fill="#ffffff" />
    </svg>
  ),
  '/manifiestos': (
    <svg viewBox="0 0 24 24" width="17" height="17" className="nav-svg-icon drop-shadow-[0_0_8px_rgba(251,146,60,0.55)] transition-transform duration-300 group-hover:scale-110">
      <defs>
        <linearGradient id="scrollGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <path d="M19 3H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" fill="url(#scrollGrad)" fillOpacity="0.25" stroke="#fb923c" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="#ffedd5" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 14l3-3 1 1-3 3-1-1z" fill="#f97316" stroke="#fdba74" strokeWidth="0.8" />
    </svg>
  ),
  '/debates': (
    <svg viewBox="0 0 24 24" width="17" height="17" className="nav-svg-icon drop-shadow-[0_0_8px_rgba(192,132,252,0.55)] transition-transform duration-300 group-hover:scale-110">
      <defs>
        <linearGradient id="debateGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="debateGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
      </defs>
      <path d="M14 3H6a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h1v3l4-3h3a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4z" fill="url(#debateGrad1)" fillOpacity="0.3" stroke="#c084fc" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 9a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-1v2.5L14 15h-1a3 3 0 0 1-3-3V9z" fill="url(#debateGrad2)" fillOpacity="0.4" stroke="#e879f9" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="9" cy="9" r="1" fill="#ffffff" />
      <circle cx="15" cy="11" r="1" fill="#ffffff" />
    </svg>
  ),
  '/comunidad': (
    <svg viewBox="0 0 24 24" width="17" height="17" className="nav-svg-icon drop-shadow-[0_0_8px_rgba(52,211,153,0.55)] transition-transform duration-300 group-hover:scale-110">
      <defs>
        <linearGradient id="worldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#worldGrad)" fillOpacity="0.25" stroke="#34d399" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="4.5" ry="9" stroke="#6ee7b7" strokeWidth="1.3" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="#6ee7b7" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="2" fill="#ffffff" />
      <circle cx="7.5" cy="8.5" r="1" fill="#a7f3d0" />
      <circle cx="16.5" cy="15.5" r="1" fill="#a7f3d0" />
    </svg>
  ),
};

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/integrantes', label: 'Integrantes' },
  { href: '/manifiestos', label: 'Manifiestos' },
  { href: '/debates', label: 'Debates' },
  { href: '/comunidad', label: 'Comunidad' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Atajo discreto para administradores: Ctrl + Shift + A
    const handleAdminShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.href = '/gobernanza';
      }
    };
    window.addEventListener('keydown', handleAdminShortcut);
    return () => window.removeEventListener('keydown', handleAdminShortcut);
  }, []);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? winScroll / height : 0;
      setScrollProgress(scrolled);
      setIsScrolled(winScroll > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  const isCurrentActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <div
        className="scroll-progress-line"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      <motion.header
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="navbar-container">
          <div className="navbar-brand-col">
            <Link href="/" className="brand-container" style={{ textDecoration: 'none' }}>
              <div className="brand-text-group flex items-center gap-2">
                <div className="logo">BONTEN</div>
                <span className="badge-premium badge-magenta-neon text-[10px] !py-0.5 !px-2 tracking-wider" title="Nueva Generación Provida">
                  <span className="badge-emoji-halo">⚡</span> NG
                </span>
              </div>
              <Image
                src="/LOGO_BONTEN_V2.jpeg"
                alt="Logo Bonten"
                className="logo-img"
                width={48}
                height={48}
                priority
              />
            </Link>
          </div>

          <nav className="top-nav desktop-only" aria-label="Navegación principal">
            <div className="nav-capsule-dock">
              {NAV_LINKS.map((link) => {
                const isActive = isCurrentActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-link-icon flex items-center justify-center">{NAV_ICONS[link.href]}</span>
                    <span className="nav-link-text">{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="active-pill-highlight"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="navbar-actions-col">
            <motion.button
              onClick={openSearch}
              className="search-trigger-btn"
              aria-label="Buscar en Bonten"
              title="Buscar (Ctrl + K)"
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.04 }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="search-trigger-label">Buscar...</span>
              <kbd className="search-shortcut-badge">Ctrl K</kbd>
            </motion.button>

            <motion.button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Cambiar tema visual"
              title={mounted ? (theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro') : 'Cambiar tema'}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
            >
              {mounted && theme === 'dark' ? (
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#f59e0b" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" fill="#f59e0b" fillOpacity="0.2" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#38bdf8" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#38bdf8" fillOpacity="0.2" />
                </svg>
              )}
            </motion.button>

            <Link
              href="/auth/login"
              className="theme-toggle"
              aria-label="Iniciar Sesión"
              title="Acceso Miembros / Admin"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <button
              className="menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="7" x2="21" y2="7" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="17" x2="21" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="mobile-nav-drawer"
              initial={{ y: -30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Menú móvil de navegación"
            >
              <div className="mobile-search-row">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openSearch();
                  }}
                  className="mobile-search-btn"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Buscar temas, manifiestos o integrantes...</span>
                  <kbd>Ctrl K</kbd>
                </button>
              </div>

              <div className="mobile-nav-links">
                {NAV_LINKS.map((link, idx) => {
                  const isActive = isCurrentActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                    >
                      <Link
                        href={link.href}
                        className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="mobile-link-icon flex items-center justify-center">{NAV_ICONS[link.href]}</span>
                        <span className="mobile-link-text">{link.label}</span>
                        {isActive && <span className="mobile-active-dot" />}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAV_LINKS.length * 0.06 }}
                >
                  <Link
                    href="/auth/login"
                    className={`mobile-nav-link ${isCurrentActive('/auth/login') ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="mobile-link-icon flex items-center justify-center">
                      <svg viewBox="0 0 24 24" width="17" height="17" className="nav-svg-icon drop-shadow-[0_0_8px_rgba(56,189,248,0.55)]">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#38bdf8" strokeWidth="1.6" fill="none" />
                        <circle cx="12" cy="7" r="4" stroke="#38bdf8" strokeWidth="1.6" fill="none" />
                      </svg>
                    </span>
                    <span className="mobile-link-text">Iniciar Sesión</span>
                  </Link>
                </motion.div>
              </div>

              <div className="mobile-nav-footer">
                <span className="mobile-footer-badge">BONTEN • NUESTRA RESISTENCIA</span>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

