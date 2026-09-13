'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/', label: 'Inicio', icon: '⚡' },
  { href: '/integrantes', label: 'Integrantes', icon: '🛡️' },
  { href: '/manifiestos', label: 'Manifiestos', icon: '📜' },
  { href: '/debates', label: 'Debates', icon: '💬' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

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
              <div className="brand-text-group">
                <div className="logo">BONTEN</div>
                <span className="badge-ng" title="Nueva Generación Provida">NG</span>
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
                    <span className="nav-link-icon">{link.icon}</span>
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
                        <span className="mobile-link-icon">{link.icon}</span>
                        <span className="mobile-link-text">{link.label}</span>
                        {isActive && <span className="mobile-active-dot" />}
                      </Link>
                    </motion.div>
                  );
                })}
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

