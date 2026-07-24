'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
            'linear-gradient(rgba(3, 37, 76, 0.75), rgba(134, 25, 143, 0.75)), url("/assets/hero_bg_1781465357241.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
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
      </motion.article>
    </section>
  );
}

