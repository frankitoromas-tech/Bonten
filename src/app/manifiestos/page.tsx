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

      {/* Tratado Mayor de Fireboy Destacado */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#06183a] via-[#120f33] to-[#1c0828] text-white border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="badge-premium badge-magenta-neon text-[10px]">
              🔥 Tratado Mayor • Fireboy (Líder Fundador)
            </span>
            <span className="text-xs text-slate-400">12 min de lectura</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {MANIFIESTOS[0].title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {MANIFIESTOS[0].summary}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/manifiestos/posmodernidad"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-sky-500/25 transition-all inline-flex items-center gap-2"
            >
              <span>Leer Tratado Filosófico Completo</span>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
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
                  {m.isReferential && <span style={{ marginRight: '8px', padding: '2px 6px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>Referencial</span>}
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
