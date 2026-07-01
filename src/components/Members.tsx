'use client';
import React, { useState } from 'react';
import ProfileModal from './ProfileModal';
import { LEADER, MEMBERS } from '@/data/members';
import type { Member } from '@/types';

export default function Members() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // El líder se normaliza a la forma Member para reutilizar el mismo modal.
  const leaderAsMember: Member = {
    name: LEADER.name,
    role: LEADER.role,
    roleClass: 'role-mod',
    bio: LEADER.bio,
    avatar: LEADER.avatar,
  };

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Mesa Directiva</h2>
        <p className="page-subtitle">Conoce al fundador y a los miembros de nuestra comunidad.</p>
      </div>

      <section className="leader-section">
        <article className="leader-card">
          <div className="leader-avatar-wrapper">
            <div className="leader-avatar" style={{ backgroundImage: `url("${LEADER.avatar}")` }} />
            <div className="leader-ring" />
          </div>
          <div className="leader-info">
            <span className="leader-badge">{LEADER.role}</span>
            <h3 className="leader-name">{LEADER.name}</h3>
            <p className="leader-handle">{LEADER.handle}</p>
            <p className="leader-bio">&quot;{LEADER.bio}&quot;</p>

            <div className="leader-actions">
              <a href={LEADER.tiktok} target="_blank" rel="noopener noreferrer" className="tiktok-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
                <span>TikTok</span>
              </a>
              <a href={LEADER.youtube} target="_blank" rel="noopener noreferrer" className="youtube-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
                <span>YouTube</span>
              </a>
              <button className="btn-outline" onClick={() => setSelectedMember(leaderAsMember)}>
                Ver Perfil
              </button>
            </div>
          </div>
        </article>
      </section>

      <div className="divider">
        <span>Equipo BONTEN</span>
      </div>

      <section className="members-directory">
        <div className="members-grid-large">
          {MEMBERS.map((m, i) => (
            <article key={m.name} className={`member-card ${i === 0 ? 'profile-glow' : ''}`}>
              <div
                className="member-avatar"
                style={{
                  backgroundImage: `url("${m.avatar}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '3px solid var(--accent-blue)',
                }}
              />
              <div className="member-info">
                <h3 className="member-name">{m.name}</h3>
                <span className={`role-badge ${m.roleClass}`}>{m.role}</span>
                <p className="member-bio">{m.bio}</p>
                <button className="btn-outline" onClick={() => setSelectedMember(m)}>
                  Ver Perfil
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selectedMember && <ProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </>
  );
}
