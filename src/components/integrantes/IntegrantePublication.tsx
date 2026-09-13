import React from 'react';
import type { MemberPublication } from '@/types';

interface IntegrantePublicationProps {
  publication: MemberPublication;
}

export default function IntegrantePublication({ publication }: IntegrantePublicationProps) {
  return (
    <article className="integrante-essay-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
        <span
          style={{
            background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)',
            color: 'var(--accent-pink)',
            border: '1px solid var(--border-glow)',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          {publication.category}
        </span>
        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          {publication.date} • {publication.readTime}
        </span>
      </div>

      <h2
        className="section-title"
        style={{
          textAlign: 'left',
          color: 'var(--title-color)',
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          lineHeight: 1.25,
          marginBottom: '0.6rem',
        }}
      >
        {publication.title}
      </h2>

      {publication.subtitle && (
        <h3
          style={{
            fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)',
            color: 'var(--accent-blue)',
            fontWeight: 600,
            marginBottom: '1.8rem',
          }}
        >
          {publication.subtitle}
        </h3>
      )}

      {publication.summary && (
        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            lineHeight: 1.7,
          }}
        >
          {publication.summary}
        </p>
      )}

      <div className="document-reader-body" style={{ padding: 0 }}>
        {publication.paragraphs.map((p, index) => {
          if (p.startsWith('<blockquote>')) {
            const clean = p.replace('<blockquote>', '').replace('</blockquote>', '');
            return <blockquote key={index} dangerouslySetInnerHTML={{ __html: clean }} />;
          }
          return <p key={index} dangerouslySetInnerHTML={{ __html: p }} />;
        })}
      </div>

      {/* Enlace y referencia a la fuente original */}
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
            style={{
              color: 'var(--accent-pink)',
              fontWeight: 700,
              textDecoration: 'underline',
              wordBreak: 'break-all',
            }}
          >
            {publication.sourceLabel || publication.sourceUrl}
          </a>
        </div>
      )}
    </article>
  );
}
