'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/integrantes', label: 'Integrantes' },
  { href: '/manifiestos', label: 'Manifiestos' },
  { href: '/debates', label: 'Debates' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <motion.header 
      className="navbar"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="navbar-header">
        <Link href="/" className="brand-container" style={{ textDecoration: 'none' }}>
          <div className="brand-text-group">
            <div className="logo">BONTEN</div>
            <span className="badge-ng">NG</span>
          </div>
          <Image src="/LOGO_BONTEN_V2.jpeg" alt="Logo Bonten" className="logo-img" width={55} height={55} priority />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <motion.button 
            onClick={toggleTheme} 
            className="theme-toggle" 
            aria-label="Cambiar tema"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1, rotate: 15 }}
          >
            {mounted ? (theme === 'dark' ? '☀️' : '🌙') : '🌙'}
          </motion.button>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú" aria-expanded={menuOpen}>
            <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" strokeWidth="2.5" fill="none">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <nav className={`top-nav ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '10%',
                    right: '10%',
                    height: '3px',
                    background: 'linear-gradient(90deg, #38bdf8, #d946ef)',
                    borderRadius: '3px',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.8)'
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </motion.header>
  );
}

