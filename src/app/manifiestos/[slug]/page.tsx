import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MANIFIESTOS, getManifiesto } from '@/data/manifiestos';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return MANIFIESTOS.map((m) => ({ slug: m.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const manifiesto = getManifiesto(slug);
  if (!manifiesto) return { title: 'Manifiesto no encontrado' };
  return {
    title: manifiesto.title,
    description: manifiesto.summary,
    openGraph: {
      title: `BONTEN | ${manifiesto.title}`,
      description: manifiesto.summary,
      images: ['/LOGO_BONTEN_V2.jpeg'],
    },
  };
}

export default async function ManifiestoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const manifiesto = getManifiesto(slug);

  if (!manifiesto) notFound();

  const currentIndex = MANIFIESTOS.findIndex((m) => m.slug === slug);
  const prevManifesto = currentIndex > 0 ? MANIFIESTOS[currentIndex - 1] : null;
  const nextManifesto = currentIndex < MANIFIESTOS.length - 1 ? MANIFIESTOS[currentIndex + 1] : null;

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%', paddingTop: '1.5rem' }}>
      <Breadcrumbs
        items={[
          { label: 'Manifiestos', href: '/manifiestos' },
          { label: manifiesto.title },
        ]}
      />

      <article className="debate-detail-card" style={{ marginTop: '1.5rem' }}>
        <Link href="/manifiestos" className="back-btn" style={{ textDecoration: 'none' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Volver a Manifiestos</span>
        </Link>

        <h1 className="section-title" style={{ color: 'var(--title-color)', margin: '1rem 0 1.5rem' }}>
          {manifiesto.title}
        </h1>

        <div className="document-reader-body" style={{ padding: 0 }}>
          {manifiesto.content.map((p, index) => {
            if (p.startsWith('<blockquote>')) {
              const clean = p.replace('<blockquote>', '').replace('</blockquote>', '');
              return <blockquote key={index} dangerouslySetInnerHTML={{ __html: clean }} />;
            }
            return <p key={index} dangerouslySetInnerHTML={{ __html: p }} />;
          })}
        </div>

        {/* Navegación contextual entre manifiestos */}
        <div className="integrante-nav-footer" style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          {prevManifesto ? (
            <Link href={`/manifiestos/${prevManifesto.slug}`} className="nav-btn prev">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>{prevManifesto.title}</span>
            </Link>
          ) : <div />}

          {nextManifesto && (
            <Link href={`/manifiestos/${nextManifesto.slug}`} className="nav-btn next">
              <span>{nextManifesto.title}</span>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
