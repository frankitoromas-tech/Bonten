'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const SOCIALS = [
  { label: 'Facebook', href: '#', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { label: 'YouTube', href: '#', path: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z', extra: <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /> },
  { label: 'TikTok', href: 'https://www.tiktok.com/@bontenteam.provida?_r=1&_t=ZT-97gB0s2v0jF', path: 'M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5', external: true },
  { label: 'Instagram', href: '#', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', rect: true },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="site-footer">
      <h3 className="footer-title">BLOQUE PROVIDA</h3>
      <div className="social-grid">
        {SOCIALS.map((s) => {
          const isDead = s.href === '#';
          const Tag = isDead ? 'span' : motion.a;
          const linkProps = isDead
            ? { className: 'social-box social-box-disabled', title: `${s.label} — Próximamente`, 'aria-label': `${s.label} (próximamente)` }
            : {
                href: s.href,
                className: 'social-box',
                'aria-label': s.label,
                whileHover: { y: -4, scale: 1.05 },
                whileTap: { scale: 0.95 },
                ...(s.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
              };
          return (
            <Tag key={s.label} {...(linkProps as Record<string, unknown>)}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {s.rect && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />}
                <path d={s.path} />
                {s.rect && <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />}
                {s.extra}
              </svg>
              <span>{s.label}{isDead && ' ⏳'}</span>
            </Tag>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200/40 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 BONTEN • Resistencia Provida & Nueva Generación. Todos los derechos reservados.</p>
        <div className="flex items-center gap-3">
          <Link href="/comunidad" className="hover:text-sky-400 transition-colors">
            Comunidad
          </Link>
          <span className="opacity-30">•</span>
          {/* Enlace sutil y discreto exclusivo para administradores */}
          <Link 
            href="/gobernanza" 
            className="opacity-20 hover:opacity-75 transition-opacity text-[11px] font-mono flex items-center gap-1"
            title="Acceso reservado a Mesa Directiva (Ctrl+Shift+A)"
          >
            <span>🔒</span> Gobernanza
          </Link>
        </div>
      </div>
    </footer>
  );
}
