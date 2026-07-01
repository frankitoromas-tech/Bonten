import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MANIFIESTOS } from '@/data/manifiestos';

export const metadata: Metadata = {
  title: 'Manifiestos',
  description: 'Nuestra doctrina, nuestros principios y nuestra resistencia documentada.',
};

export default function ManifiestosPage() {
  return (
    <section className="layout-container" style={{ minHeight: '80vh', paddingTop: '4rem' }}>
      <h1 className="section-title" style={{ color: 'var(--title-color)', marginBottom: '1rem' }}>
        Manifiestos y Doctrina
      </h1>
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
        Aquí se documenta el conocimiento fundamental de la resistencia.
      </p>

      <div className="cards-grid">
        {MANIFIESTOS.map((m, i) => {
          const isFeatured = i === 0;
          return (
            <article
              key={m.slug}
              className="box-card"
              style={
                isFeatured
                  ? { padding: '2rem' }
                  : { padding: '2rem', background: 'var(--surface-color)', color: 'var(--text-dark)', border: '1px solid var(--border-color)' }
              }
            >
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: isFeatured ? undefined : 'var(--title-color)' }}>
                {m.title}
              </h3>
              <p style={{ opacity: isFeatured ? 0.85 : 1, color: isFeatured ? undefined : 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                {m.summary}
              </p>
              <Link
                href={`/manifiestos/${m.slug}`}
                className={isFeatured ? 'read-more-btn' : 'btn-outline'}
                style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto' }}
              >
                Leer Manifiesto
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
