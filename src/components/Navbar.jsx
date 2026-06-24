"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
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
        <header className="w-full sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 p-4 md:px-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                
                {/* Enlaces a la izquierda */}
                <nav className="flex items-center gap-6">
                    <Link 
                        href="/" 
                        className={`text-sm tracking-widest font-semibold uppercase transition-colors hover:text-[#2368b8] interactive ${pathname === '/' ? 'text-[#2368b8]' : 'text-gray-300'}`}
                    >
                        Inicio
                    </Link>
                    <Link 
                        href="/integrantes" 
                        className={`text-sm tracking-widest font-semibold uppercase transition-colors hover:text-[#2368b8] interactive ${pathname === '/integrantes' ? 'text-[#2368b8]' : 'text-gray-300'}`}
                    >
                        Integrantes
                    </Link>
                    <button className="text-sm tracking-widest font-semibold uppercase text-gray-500 cursor-not-allowed interactive">
                        Debates
                    </button>

                    <button onClick={toggleTheme} className="ml-4 text-xl interactive hover:scale-110 transition-transform" aria-label="Cambiar tema">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </nav>

                {/* Logo Anclado a la Derecha Inamovible */}
                <div className="flex-shrink-0 ml-auto">
                    <Link href="/" className="flex items-center gap-3 interactive" style={{textDecoration: 'none'}}>
                        <div className="flex flex-col items-end">
                            <h1 className="text-2xl font-black tracking-tighter uppercase m-0 leading-none">BONTEN</h1>
                            <span className="bg-[#2368b8] text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded leading-none mt-1">NG</span>
                        </div>
                        <img 
                            src="/BONTEN_LOG0.jpg" 
                            alt="Logo Bonten" 
                            className="w-10 h-10 rounded shadow-[0_0_15px_rgba(35,104,184,0.6)] object-cover"
                        />
                    </Link>
                </div>
                
            </div>
        </header>
    );
}
