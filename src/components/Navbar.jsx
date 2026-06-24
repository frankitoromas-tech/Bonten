"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <header className="navbar">
            <div className="navbar-header">
                <Link href="/" className="brand-container" style={{textDecoration: 'none'}}>
                    <div className="brand-text-group">
                        <h1 className="logo">BONTEN</h1>
                        <span className="badge-ng">NG</span>
                    </div>
                    <Image src="/LOGO_BONTEN_V2.jpeg" alt="Logo Bonten" className="logo-img" width={55} height={55} />
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    <button 
                        className="menu-btn" 
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Abrir menú"
                    >
                        <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" strokeWidth="2.5" fill="none">
                            {menuOpen ? (
                                <>
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </>
                            ) : (
                                <>
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            <nav className={`top-nav ${menuOpen ? 'open' : ''}`}>
                <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Inicio</Link>
                <Link href="/integrantes" className={`nav-link ${pathname === '/integrantes' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Integrantes</Link>
                <Link href="/manifiestos" className={`nav-link ${pathname === '/manifiestos' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Manifiestos</Link>
                <a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>Debates</a>
            </nav>
        </header>
    );
}
