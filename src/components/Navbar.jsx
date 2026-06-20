import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ theme, toggleTheme }) {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="navbar">
            <div className="navbar-header">
                <Link to="/" className="brand-container" style={{textDecoration: 'none'}}>
                    <div className="brand-text-group">
                        <h1 className="logo">BONTEN</h1>
                        <span className="badge-ng">NG</span>
                    </div>
                    <img src="/BONTEN_LOG0.jpg" alt="Logo Bonten" className="logo-img" />
                </Link>

                <div style={{ display: 'flex', alignItems: 'center' }}>
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
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Inicio</Link>
                <Link to="/integrantes" className={`nav-link ${location.pathname === '/integrantes' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Integrantes</Link>
                <a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>Debates</a>
            </nav>
        </header>
    );
}
