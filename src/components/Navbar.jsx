import React from 'react';

export default function Navbar({ setPage, activePage, darkMode, toggleDarkMode }) {
    return (
        <header className="navbar">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('inicio'); }} className="brand-container" style={{textDecoration: 'none'}}>
                <div className="brand-text-group">
                    <h1 className="logo">BONTEN</h1>
                    <span className="badge-ng">NG</span>
                </div>
<img src="/BONTEN_LOGO0.jpg" alt="Logo Bonten" />
            </a>
            <nav className="top-nav">
                <a href="#" onClick={(e) => { e.preventDefault(); setPage('inicio'); }} className={`nav-link ${activePage === 'inicio' ? 'active' : ''}`}>Inicio</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setPage('integrantes'); }} className={`nav-link ${activePage === 'integrantes' ? 'active' : ''}`}>Integrantes</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setPage('debates'); }} className={`nav-link ${activePage === 'debates' ? 'active' : ''}`}>Debates</a>
                
                <button 
                    onClick={toggleDarkMode} 
                    className="theme-toggle" 
                    aria-label="Alternar tema"
                    title={darkMode ? "Activar Modo Claro" : "Activar Modo Oscuro"}
                >
                    {darkMode ? (
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                    ) : (
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    )}
                </button>
            </nav>
        </header>
    );
}
