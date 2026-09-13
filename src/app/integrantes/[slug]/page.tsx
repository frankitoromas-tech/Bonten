import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllLeaders, getMemberBySlug, MEMBER_DETAILS } from '@/data/members';
import type { MemberDetails } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const FALLBACK_DETAILS: MemberDetails = {
  stats: { debates: 0, library: 0, votes: 0 },
  activities: [{ id: 1, text: 'Integrante activo de la comunidad BONTEN.' }],
};

export function generateStaticParams() {
  const leaders = getAllLeaders();
  const paths = leaders.map((l) => ({ slug: l.slug }));
  // Alias de compatibilidad para asegurar que tanto 'ilan' como 'ian' resuelvan
  paths.push({ slug: 'ian' });
  return paths;
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getMemberBySlug(slug);
  if (!member) return { title: 'Integrante no encontrado | BONTEN' };

  const displayName = member.fullName || member.name;
  return {
    title: `${displayName} | BONTEN`,
    description: `${member.role} de BONTEN. ${member.bio}`,
    openGraph: {
      title: `BONTEN | ${displayName}`,
      description: member.bio,
      images: [member.avatar],
    },
  };
}

export default async function IntegranteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const member = getMemberBySlug(slug);

  if (!member) notFound();

  const details = MEMBER_DETAILS[member.name] ?? FALLBACK_DETAILS;
  const pub = member.publication;

  return (
    <main className="integrante-detail-container layout-container">
      {/* Botón de retroceso */}
      <Link href="/integrantes" className="back-btn" style={{ textDecoration: 'none' }}>
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Volver a Integrantes</span>
      </Link>

      {/* Ficha principal de perfil */}
      <article className="leader-card" style={{ marginBottom: '2.5rem', width: '100%' }}>
        <div className="leader-avatar-wrapper">
          <div className="leader-avatar" style={{ backgroundImage: `url("${member.avatar}")` }} />
          <div className="leader-ring" />
        </div>

        <div className="leader-info" style={{ maxWidth: '650px' }}>
          <span className="leader-badge">{member.role} • Mesa Directiva</span>
          <h1 className="leader-name" style={{ marginBottom: '0.2rem' }}>
            {member.name}
          </h1>

          {member.fullName && member.fullName !== member.name && (
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
              {member.fullName}
            </div>
          )}

          <p className="leader-handle">{member.handle}</p>
          <p className="leader-bio">&quot;{member.bio}&quot;</p>

          {/* Redes sociales existentes */}
          <div className="leader-actions">
            {member.tiktok && (
              <a href={member.tiktok} target="_blank" rel="noopener noreferrer" className="tiktok-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
                <span>TikTok</span>
              </a>
            )}

            {member.youtube && member.youtube !== '#' && (
              <a href={member.youtube} target="_blank" rel="noopener noreferrer" className="youtube-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
                <span>YouTube</span>
              </a>
            )}
          </div>
        </div>
      </article>

      {/* Grid de métricas y trayectoria */}
      <section className="integrante-meta-grid">
        <div className="debate-detail-card" style={{ margin: 0, padding: 'clamp(1.2rem, 3vw, 2rem)' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--title-color)', marginBottom: '1.2rem', fontWeight: 800 }}>
            Métricas de Participación
          </h2>
          <div className="stats-grid" style={{ marginTop: '0.5rem' }}>
            <div className="stat-card">
              <div className="stat-value">{details.stats.debates}</div>
              <div className="stat-label">Debates</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{details.stats.library}</div>
              <div className="stat-label">Biblioteca</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{details.stats.votes}</div>
              <div className="stat-label">Apoyos</div>
            </div>
          </div>
        </div>

        <div className="debate-detail-card" style={{ margin: 0, padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--title-color)', marginBottom: '1.2rem', fontWeight: 800 }}>
            Trayectoria y Aportes en BONTEN
          </h2>
          <div className="activity-list">
            {details.activities.map((act) => (
              <div key={act.id} className="activity-item">
                <div className="activity-dot" />
                <div className="activity-text" dangerouslySetInnerHTML={{ __html: act.text }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección editorial / Disquisición destacada */}
      {pub && (
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
              {pub.category}
            </span>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {pub.date} • {pub.readTime}
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
            {pub.title}
          </h2>

          {pub.subtitle && (
            <h3
              style={{
                fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)',
                color: 'var(--accent-blue)',
                fontWeight: 600,
                marginBottom: '1.8rem',
              }}
            >
              {pub.subtitle}
            </h3>
          )}

          {pub.summary && (
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
              {pub.summary}
            </p>
          )}

          <div className="document-reader-body" style={{ padding: 0 }}>
            {pub.paragraphs.map((p, index) => {
              if (p.startsWith('<blockquote>')) {
                const clean = p.replace('<blockquote>', '').replace('</blockquote>', '');
                return <blockquote key={index} dangerouslySetInnerHTML={{ __html: clean }} />;
              }
              return <p key={index} dangerouslySetInnerHTML={{ __html: p }} />;
            })}
          </div>

          {/* Enlace y referencia a la fuente original */}
          {pub.sourceUrl && (
            <div className="integrante-source-box">
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" style={{ color: 'var(--accent-pink)', flexShrink: 0 }}>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-dark)', fontWeight: 600 }}>
                Texto original y fuente de referencia:
              </span>
              <a
                href={pub.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--accent-pink)',
                  fontWeight: 700,
                  textDecoration: 'underline',
                  wordBreak: 'break-all',
                }}
              >
                {pub.sourceLabel || pub.sourceUrl}
              </a>
            </div>
          )}
        </article>
      )}

      {/* Pie de navegación hacia otros integrantes */}
      <div className="integrante-nav-footer">
        <Link href="/integrantes" className="btn-outline" style={{ textDecoration: 'none' }}>
          ← Volver al Directorio de Integrantes
        </Link>
        <Link href="/manifiestos" className="btn-primary" style={{ textDecoration: 'none' }}>
          Explorar Manifiestos Doctrinarios →
        </Link>
      </div>
    </main>
  );
}
