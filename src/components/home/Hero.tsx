'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import TiltCard3D from '@/components/ui/TiltCard3D';

const QUICK_SECTIONS = [
  {
    href: '/manifiestos',
    title: 'Manifiestos y Doctrina',
    desc: 'Los principios inquebrantables de la resistencia provida.',
    badge: '3 Publicaciones',
    color: 'amber',
    icon: (
      <div className="quick-hub-gem quick-hub-gem-amber">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="8" y1="7" x2="16" y2="7" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>
    ),
  },
  {
    href: '/integrantes',
    title: 'Mesa Directiva',
    desc: 'Conoce al fundador Fireboy y al equipo directivo.',
    badge: '5 Miembros',
    color: 'sky',
    icon: (
      <div className="quick-hub-gem quick-hub-gem-sky">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      </div>
    ),
  },
  {
    href: '/debates',
    title: 'Foro de Debates',
    desc: 'Diálogos apologéticos y argumentación de convicciones.',
    badge: 'Comunidad Activa',
    color: 'purple',
    icon: (
      <div className="quick-hub-gem quick-hub-gem-purple">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="8" y1="13" x2="13" y2="13" />
        </svg>
      </div>
    ),
  },
  {
    href: '#biblioteca-seccion',
    title: 'Biblioteca y Recursos',
    desc: 'Documentos filosóficos, bioética y tratados esenciales.',
    badge: 'Lecturas Clave',
    color: 'indigo',
    icon: (
      <div className="quick-hub-gem quick-hub-gem-indigo">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </div>
    ),
  },
  {
    href: '/comunidad',
    title: 'Muro de la Comunidad',
    desc: 'Fraternidad activa provida, decálogo y adhesión de honor.',
    badge: 'Fraternidad Activa',
    color: 'emerald',
    icon: (
      <div className="quick-hub-gem quick-hub-gem-emerald">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
    ),
  },
  {
    href: '/manifiestos/posmodernidad',
    title: 'Tratado de Posmodernidad',
    desc: 'Crítica al nihilismo y defensa ontológica escrita por Fireboy.',
    badge: 'Tratado Cumbre',
    color: 'rose',
    icon: (
      <div className="quick-hub-gem quick-hub-gem-rose">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      </div>
    ),
  },
];

export default function Hero() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="hero-section">
      <motion.article
        className={`box-card ${expanded ? 'expanded' : ''}`}
        id="hero-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(6, 17, 39, 0.94) 0%, rgba(15, 23, 42, 0.92) 50%, rgba(30, 27, 75, 0.9) 100%), url("/assets/hero_bg_1781465357241.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-top-meta">
          <div className="hero-live-badge">
            <span className="live-pulse-dot" />
            <span>Resistencia Activa • Nueva Generación</span>
          </div>
        </div>

        <h1 className="section-title">Nuestra Resistencia</h1>

        <div className="text-lines">
          <p className="preview-text">
            En un mundo que ha olvidado el valor de lo esencial, nosotros nos alzamos como la última línea de defensa.{' '}
            <strong>BONTEN no es solo una organización; es un manifiesto de resistencia</strong> por aquellos que aún no
            tienen voz.
          </p>

          <AnimatePresence>
            {expanded && (
              <motion.div
                className="full-text"
                id="manifesto-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <p>
                  Al igual que en la inspiración de este nombre, donde el destino parece escrito en piedra y la tragedia
                  acecha en cada esquina, hoy vivimos en una era contemporánea donde defender la vida es visto como un acto
                  de rebeldía. En la &quot;línea temporal&quot; actual, se nos criminaliza por proteger el derecho más
                  básico; se nos tacha de sombras cuando buscamos ser la luz.
                </p>
                <p>
                  Nuestra visión a futuro es clara: <strong>Queremos cambiar el futuro alterando el presente.</strong> No
                  somos un grupo que busca el conflicto, sino una fraternidad que busca reescribir el guion de la sociedad.
                  En un mundo que nos persigue por nuestras convicciones, nosotros nos mantenemos firmes como la
                  &quot;Resistencia&quot; de la vida.
                </p>
                <p className="manifesto-highlight">
                  La batalla por el futuro de la humanidad se libra hoy. <br />
                  No dejes que la historia se escriba sin ti.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hero-actions-cluster">
          <motion.button 
            className="read-more-btn" 
            onClick={() => setExpanded(!expanded)} 
            aria-expanded={expanded}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <span>{expanded ? 'Ocultar manifiesto' : 'Leer manifiesto completo'}</span>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.button>

          <Link href="/manifiestos" className="hero-secondary-cta">
            <span>Explorar Manifiestos</span>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </motion.article>

      {/* Grid de navegación rápida a dominios clave con aparición suave */}
      <div className="quick-hub-grid">
        {QUICK_SECTIONS.map((sec, idx) => (
          <motion.div
            key={sec.href}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15px' }}
            transition={{ duration: 0.45, delay: 0.05 + idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: '100%' }}
          >
            <TiltCard3D intensity={10} glare={true} style={{ height: '100%', borderRadius: 'var(--radius-lg)' }}>
              <Link href={sec.href} className={`quick-hub-card quick-hub-card-${sec.color}`}>
                <div className="quick-hub-header">
                  <span className="quick-hub-icon">{sec.icon}</span>
                  <span className={`quick-hub-badge quick-hub-badge-${sec.color}`}>{sec.badge}</span>
                </div>
                <h3 className="quick-hub-title">{sec.title}</h3>
                <p className="quick-hub-desc">{sec.desc}</p>
                <div className={`quick-hub-action quick-hub-action-${sec.color}`}>
                  <span>Acceder</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </Link>
            </TiltCard3D>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

