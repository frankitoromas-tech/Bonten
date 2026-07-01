'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

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
    <header className="navbar">
      <div className="navbar-header">
        <Link href="/" className="brand-container" style={{ textDecoration: 'none' }}>
          <div className="brand-text-group">
            <h1 className="logo">BONTEN</h1>
            <span className="badge-ng">NG</span>
          </div>
          <Image src="/LOGO_BONTEN_V2.jpeg" alt="Logo Bonten" className="logo-img" width={55} height={55} priority />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema">
            {mounted ? (theme === 'dark' ? '☀️' : '🌙') : '🌙'}
          </button>
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
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${pathname === link.href ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
