import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MANIFIESTOS, getManifiesto } from '@/data/manifiestos';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-genera cada manifiesto en build (SSG).
export function generateStaticParams() {
  return MANIFIESTOS.map((m) => ({ slug: m.slug }));
}

// Cualquier slug fuera del conjunto conocido devuelve un 404 real (no "soft 200").
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

  return (
    <article className="debate-detail-card" style={{ marginTop: '1rem' }}>
      <Link href="/manifiestos" className="back-btn" style={{ textDecoration: 'none' }}>
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Volver a Manifiestos</span>
      </Link>

      <h1 className="section-title" style={{ color: 'var(--title-color)', marginBottom: '1.5rem' }}>
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
    </article>
  );
}
