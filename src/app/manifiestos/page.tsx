import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MANIFIESTOS } from '@/data/manifiestos';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Manifiestos',
  description: 'Nuestra doctrina, nuestros principios y nuestra resistencia documentada.',
};

export default function ManifiestosPage() {
  return (
    <section className="layout-container" style={{ minHeight: '80vh', paddingTop: '2.5rem' }}>
      <Breadcrumbs items={[{ label: 'Manifiestos' }]} />

      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title">Manifiestos y Doctrina</h1>
        <p className="page-subtitle">
          Fundamentos documentados, principios filosóficos y la postura innegociable de la resistencia provida.
        </p>
      </div>

      <div className="cards-grid">
        {MANIFIESTOS.map((m, i) => {
          const isFeatured = i === 0;
          return (
            <article
              key={m.slug}
              className={`box-card manifesto-overview-card ${isFeatured ? 'featured' : ''}`}
              style={
                isFeatured
                  ? { padding: '2.2rem' }
                  : { padding: '2.2rem', background: 'var(--surface-color)', color: 'var(--text-dark)', border: '1px solid var(--border-color)' }
              }
            >
              <div className="manifesto-card-top">
                <span className="debate-tag" style={{ background: isFeatured ? 'rgba(255,255,255,0.2)' : undefined, color: isFeatured ? '#fff' : undefined }}>
                  {isFeatured ? '⭐ Principal' : '📜 Doctrina'}
                </span>
                <span className="reading-time-badge" style={{ opacity: 0.8, fontSize: '0.85rem' }}>
                  ⏱ 4-6 min lectura
                </span>
              </div>

              <h3 style={{ fontSize: '1.45rem', margin: '1rem 0 0.8rem', color: isFeatured ? undefined : 'var(--title-color)', fontWeight: 700 }}>
                {m.title}
              </h3>

              <p style={{ opacity: isFeatured ? 0.9 : 1, color: isFeatured ? undefined : 'var(--text-muted)', marginBottom: '1.8rem', fontSize: '0.98rem', lineHeight: 1.6 }}>
                {m.summary}
              </p>

              <Link
                href={`/manifiestos/${m.slug}`}
                className={isFeatured ? 'read-more-btn' : 'btn-profile-complete'}
                style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto' }}
              >
                <span>Leer Manifiesto</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
