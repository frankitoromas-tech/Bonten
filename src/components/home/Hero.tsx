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
        <svg viewBox="0 0 32 32" width="28" height="28" className="quick-svg-gem" fill="none">
          <defs>
            <linearGradient id="amberGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="amberGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
            </linearGradient>
            <filter id="amberDrop" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f59e0b" floodOpacity="0.5" />
            </filter>
          </defs>
          {/* Sombra de profundidad del pergamino */}
          <rect x="6" y="5" width="20" height="22" rx="3.5" fill="rgba(0,0,0,0.25)" />
          {/* Cuerpo principal del pergamino sacro */}
          <path
            d="M7 4h15a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
            fill="url(#amberGoldGrad)"
            fillOpacity="0.22"
            stroke="url(#amberGoldGrad)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            filter="url(#amberDrop)"
          />
          {/* Enrollamiento superior del pergamino */}
          <path d="M5 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2H5z" fill="url(#amberGoldGrad)" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="1" />
          {/* Líneas caligráficas grabadas */}
          <line x1="9" y1="10" x2="21" y2="10" stroke="#fef08a" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="9" y1="14" x2="19" y2="14" stroke="#fef08a" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.85" />
          <line x1="9" y1="18" x2="16" y2="18" stroke="#fef08a" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.7" />
          {/* Sello de cera imperial con relieve */}
          <circle cx="21" cy="22" r="3.5" fill="url(#amberGoldGrad)" stroke="#fef08a" strokeWidth="1" />
          <polygon points="21,20 22,21.5 23.5,22 22,22.8 21.5,24.5 20.5,22.8 19,22 20.5,21.5" fill="#ffffff" />
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
        <svg viewBox="0 0 32 32" width="28" height="28" className="quick-svg-gem" fill="none">
          <defs>
            <linearGradient id="skyShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="45%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="skyDrop" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0284c7" floodOpacity="0.55" />
            </filter>
          </defs>
          {/* Sombra base del escudo */}
          <path d="M16 3L5 7v9c0 7.8 4.7 12.8 11 14 6.3-1.2 11-6.2 11-14V7L16 3z" fill="rgba(0,0,0,0.3)" />
          {/* Escudo facetado de mando heráldico */}
          <path
            d="M16 2.5L5 6.8v8.7c0 7.5 4.7 12.4 11 13.8 6.3-1.4 11-6.3 11-13.8V6.8L16 2.5z"
            fill="url(#skyShieldGrad)"
            fillOpacity="0.25"
            stroke="url(#skyShieldGrad)"
            strokeWidth="1.9"
            strokeLinejoin="round"
            filter="url(#skyDrop)"
          />
          {/* Faceta interior pulida */}
          <path d="M16 4.5L7.5 7.8v7.2c0 5.6 3.6 9.8 8.5 11.2V4.5z" fill="#38bdf8" fillOpacity="0.15" />
          {/* Cruz de mando y diamante central */}
          <path d="M16 8v12M11 13h10" stroke="#e0f2fe" strokeWidth="1.6" strokeLinecap="round" />
          <polygon points="16,11 17.8,13 16,15 14.2,13" fill="#ffffff" stroke="#38bdf8" strokeWidth="0.8" />
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
        <svg viewBox="0 0 32 32" width="28" height="28" className="quick-svg-gem" fill="none">
          <defs>
            <linearGradient id="purpleDebateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5d0fe" />
              <stop offset="45%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
            <filter id="purpleDrop" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#9333ea" floodOpacity="0.55" />
            </filter>
          </defs>
          {/* Burbuja dialéctica principal */}
          <path
            d="M19 4H8a5 5 0 0 0-5 5v5a5 5 0 0 0 5 5h1.5v4l5-4h4.5a5 5 0 0 0 5-5V9a5 5 0 0 0-5-5z"
            fill="url(#purpleDebateGrad)"
            fillOpacity="0.25"
            stroke="url(#purpleDebateGrad)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            filter="url(#purpleDrop)"
          />
          {/* Onda socrática interior */}
          <line x1="8" y1="10" x2="16" y2="10" stroke="#fdf4ff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="13" x2="13" y2="13" stroke="#fdf4ff" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" />
          {/* Burbuja secundaria entrelazada con destello */}
          <path
            d="M15 14h6a4 4 0 0 1 4 4v3.5a4 4 0 0 1-4 4h-1.5L16 28v-2.5h-1a4 4 0 0 1-4-4v-1"
            fill="url(#purpleDebateGrad)"
            fillOpacity="0.35"
            stroke="#e879f9"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="20" r="1.5" fill="#ffffff" />
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
        <svg viewBox="0 0 32 32" width="28" height="28" className="quick-svg-gem" fill="none">
          <defs>
            <linearGradient id="indigoBookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c7d2fe" />
              <stop offset="45%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <filter id="indigoDrop" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#4f46e5" floodOpacity="0.55" />
            </filter>
          </defs>
          {/* Lomo y cubierta base */}
          <path
            d="M5 25.5A3.5 3.5 0 0 1 8.5 22H27v6H8.5A3.5 3.5 0 0 1 5 25.5z"
            fill="#3730a3"
            stroke="#6366f1"
            strokeWidth="1.6"
          />
          {/* Tomo tridimensional en perspectiva */}
          <path
            d="M8.5 3.5H27v21H8.5A3.5 3.5 0 0 0 5 28V6.5a3.5 3.5 0 0 1 3.5-3.5z"
            fill="url(#indigoBookGrad)"
            fillOpacity="0.25"
            stroke="url(#indigoBookGrad)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            filter="url(#indigoDrop)"
          />
          {/* Páginas en abanico luminosas */}
          <line x1="11" y1="9" x2="22" y2="9" stroke="#e0e7ff" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="11" y1="13" x2="20" y2="13" stroke="#e0e7ff" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.8" />
          <line x1="11" y1="17" x2="17" y2="17" stroke="#e0e7ff" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.6" />
          {/* Marcapáginas de cinta de seda púrpura */}
          <path d="M19 3.5v10l2.5-1.8 2.5 1.8v-10" fill="#a855f7" stroke="#e879f9" strokeWidth="0.8" />
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
        <svg viewBox="0 0 32 32" width="28" height="28" className="quick-svg-gem" fill="none">
          <defs>
            <linearGradient id="emeraldGlobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="45%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="emeraldDrop" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#059669" floodOpacity="0.55" />
            </filter>
          </defs>
          {/* Globo terráqueo con proyección ortogonal */}
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="url(#emeraldGlobeGrad)"
            fillOpacity="0.22"
            stroke="url(#emeraldGlobeGrad)"
            strokeWidth="1.8"
            filter="url(#emeraldDrop)"
          />
          {/* Meridianos y paralelos elegantes */}
          <ellipse cx="16" cy="16" rx="6" ry="12" stroke="#6ee7b7" strokeWidth="1.4" strokeDasharray="1 0" />
          <line x1="4" y1="16" x2="28" y2="16" stroke="#6ee7b7" strokeWidth="1.4" />
          {/* Nodos de fraternidad provida con destello estelar */}
          <circle cx="16" cy="16" r="2.8" fill="#ffffff" stroke="#10b981" strokeWidth="1" />
          <circle cx="21" cy="11" r="1.5" fill="#6ee7b7" />
          <circle cx="11" cy="21" r="1.5" fill="#6ee7b7" />
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
        <svg viewBox="0 0 32 32" width="28" height="28" className="quick-svg-gem" fill="none">
          <defs>
            <linearGradient id="roseFireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe4e6" />
              <stop offset="35%" stopColor="#fb7185" />
              <stop offset="80%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#9f1239" />
            </linearGradient>
            <filter id="roseDrop" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#e11d48" floodOpacity="0.6" />
            </filter>
          </defs>
          {/* Llama exterior vivaz */}
          <path
            d="M16 2.5c1.8 4.2 6.5 6.8 6.5 12a9.5 9.5 0 1 1-17 0c0-4.8 4.5-7.2 6-12 1.5 3 3.5 4.5 4.5 0z"
            fill="url(#roseFireGrad)"
            fillOpacity="0.32"
            stroke="url(#roseFireGrad)"
            strokeWidth="1.9"
            strokeLinejoin="round"
            filter="url(#roseDrop)"
          />
          {/* Llama interior de plasma puro */}
          <path
            d="M16 11c1 2.2 3.5 3.5 3.5 6.5a4.5 4.5 0 1 1-8 0c0-2.5 2.2-3.8 3-6.5 0.8 1.5 1.8 2.2 1.5 0z"
            fill="#f43f5e"
            fillOpacity="0.65"
          />
          {/* Núcleo ardiente de convicción ontológica */}
          <ellipse cx="16" cy="19.5" rx="1.8" ry="2.5" fill="#ffffff" />
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
            'linear-gradient(rgba(3, 37, 76, 0.78), rgba(134, 25, 143, 0.78)), url("/assets/hero_bg_1781465357241.webp")',
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

