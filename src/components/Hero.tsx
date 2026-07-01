'use client';
import React, { useState } from 'react';

export default function Hero() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="hero-section">
      <article
        className={`box-card ${expanded ? 'expanded' : ''}`}
        id="hero-card"
        style={{
          backgroundImage:
            'linear-gradient(rgba(155,32,158,0.65), rgba(219,56,194,0.65)), url("/assets/hero_bg_1781465357241.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2 className="section-title">Nuestra Resistencia</h2>

        <div className="text-lines">
          <p className="preview-text">
            En un mundo que ha olvidado el valor de lo esencial, nosotros nos alzamos como la última línea de defensa.{' '}
            <strong>BONTEN no es solo una organización; es un manifiesto de resistencia</strong> por aquellos que aún no
            tienen voz.
          </p>

          <div className="full-text" id="manifesto-content">
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
          </div>
        </div>

        <button className="read-more-btn" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
          <span>{expanded ? 'Ocultar manifiesto' : 'Leer manifiesto completo'}</span>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </article>
    </section>
  );
}
