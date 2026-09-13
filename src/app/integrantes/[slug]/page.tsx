import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllLeaders, getMemberBySlug, MEMBER_DETAILS } from '@/data/members';
import type { MemberDetails } from '@/types';
import IntegranteHero from '@/components/integrantes/IntegranteHero';
import IntegranteStats from '@/components/integrantes/IntegranteStats';
import IntegrantePublication from '@/components/integrantes/IntegrantePublication';
import FireboyCorpus from '@/components/integrantes/FireboyCorpus';
import IntegranteNavFooter from '@/components/integrantes/IntegranteNavFooter';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

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
  // Alias de compatibilidad
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

  return (
    <main className="integrante-detail-container layout-container">
      <Breadcrumbs
        items={[
          { label: 'Integrantes', href: '/integrantes' },
          { label: member.name },
        ]}
      />

      {/* Retorno */}
      <Link href="/integrantes" className="back-btn" style={{ textDecoration: 'none' }}>
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Volver a Integrantes</span>
      </Link>

      {/* Componentes modulares y auditables */}
      <IntegranteHero member={member} />
      <IntegranteStats details={details} />
      {member.slug === 'fireboy' ? (
        <FireboyCorpus member={member} />
      ) : (
        member.publication && <IntegrantePublication publication={member.publication} />
      )}
      <IntegranteNavFooter />
    </main>
  );
}
