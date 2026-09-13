import React from 'react';
import type { Leader } from '@/types';

interface IntegranteHeroProps {
  member: Leader;
}

export default function IntegranteHero({ member }: IntegranteHeroProps) {
  return (
    <article className="leader-card" style={{ width: '100%' }}>
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

        {/* Canales sociales verificados */}
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
  );
}
