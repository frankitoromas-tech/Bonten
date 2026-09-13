'use client';
import React, { useState } from 'react';
import type { MemberPublication } from '@/types';
import { useToast } from '@/components/ui/Toast';

interface IntegrantePublicationProps {
  publication: MemberPublication;
}

export default function IntegrantePublication({ publication }: IntegrantePublicationProps) {
  const [isLarge, setIsLarge] = useState(false);
  const { showToast } = useToast();

  const handleCopyQuote = (quoteText: string) => {
    const cleanText = quoteText.replace(/<[^>]*>/g, '').trim();
    navigator.clipboard.writeText(`"${cleanText}" — ${publication.title} (BONTEN)`);
    showToast('¡Cita copiada al portapapeles con atribución!', 'success');
  };

  return (
    <article className="integrante-essay-card">
      <div className="essay-meta-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <span className="debate-tag" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
            {publication.category}
          </span>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {publication.date} • {publication.readTime}
          </span>
        </div>

        <div className="essay-toolbar-actions">
          <button
            onClick={() => setIsLarge(!isLarge)}
            className="essay-tool-btn"
            title="Cambiar tamaño de texto para lectura cómoda"
          >
            {isLarge ? 'A Normal' : 'A+ Grande'}
          </button>
        </div>
      </div>

      <h2 className="section-title" style={{ textAlign: 'left', color: 'var(--title-color)', margin: '0.8rem 0 0.5rem' }}>
        {publication.title}
      </h2>

      {publication.subtitle && (
        <h3 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)', color: 'var(--accent-blue)', fontWeight: 600, marginBottom: '1.5rem' }}>
          {publication.subtitle}
        </h3>
      )}

      {publication.summary && (
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '1.8rem', paddingBottom: '1.2rem', borderBottom: '1px solid var(--border-color)', lineHeight: 1.7 }}>
          {publication.summary}
        </p>
      )}

      <div className={`document-reader-body ${isLarge ? 'text-large' : ''}`} style={{ padding: 0 }}>
        {publication.paragraphs.map((p, index) => {
          if (p.startsWith('<blockquote>')) {
            const clean = p.replace('<blockquote>', '').replace('</blockquote>', '');
            return (
              <div key={index} className="interactive-quote-block">
                <blockquote dangerouslySetInnerHTML={{ __html: clean }} />
                <button
                  onClick={() => handleCopyQuote(clean)}
                  className="btn-copy-quote"
                  title="Copiar esta cita para compartir"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copiar cita</span>
                </button>
              </div>
            );
          }
          return <p key={index} dangerouslySetInnerHTML={{ __html: p }} />;
        })}
      </div>

      {publication.sourceUrl && (
        <div className="integrante-source-box">
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" style={{ color: 'var(--accent-pink)', flexShrink: 0 }}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span style={{ fontSize: '0.95rem', color: 'var(--text-dark)', fontWeight: 600 }}>
            Texto original y fuente de referencia:
          </span>
          <a
            href={publication.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-pink)', fontWeight: 700, textDecoration: 'underline', wordBreak: 'break-all' }}
          >
            {publication.sourceLabel || publication.sourceUrl}
          </a>
        </div>
      )}
    </article>
  );
}
