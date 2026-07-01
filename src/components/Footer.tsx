import React from 'react';

const SOCIALS = [
  { label: 'Facebook', href: '#', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@bontenteam.provida?_r=1&_t=ZT-97gB0s2v0jF', path: 'M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5', external: true },
  { label: 'Instagram', href: '#', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', rect: true },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <h3 className="footer-title">BLOQUE PROTESTANTE</h3>
      <div className="social-grid">
        {SOCIALS.map((s) => (
          <a 
            key={s.label} 
            href={s.href} 
            className="social-box" 
            aria-label={s.label}
            {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {s.rect && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />}
              <path d={s.path} />
              {s.rect && <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />}
            </svg>
            <span>{s.label}</span>
          </a>
        ))}
      </div>
    </footer>
  );
}
