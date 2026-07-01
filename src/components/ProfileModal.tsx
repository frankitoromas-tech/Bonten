'use client';
import React, { useEffect } from 'react';
import { MEMBER_DETAILS } from '@/data/members';
import type { Member, MemberDetails } from '@/types';

interface ProfileModalProps {
  member: Member | null;
  onClose: () => void;
}

const FALLBACK_DETAILS: MemberDetails = {
  stats: { debates: 0, library: 0, votes: 0 },
  activities: [{ id: 1, text: 'Se unió recientemente a la red de integrantes de BONTEN.' }],
};

export default function ProfileModal({ member, onClose }: ProfileModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!member) return null;

  const details = MEMBER_DETAILS[member.name] ?? FALLBACK_DETAILS;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Perfil de ${member.name}`}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="profile-modal-banner">
          <div className="profile-modal-avatar" style={{ backgroundImage: `url("${member.avatar}")` }} />
        </div>

        <div className="profile-modal-content">
          <h2 className="profile-modal-name">{member.name}</h2>
          <span className={`role-badge ${member.roleClass}`} style={{ display: 'inline-block' }}>
            {member.role}
          </span>
          <p className="profile-modal-bio">{member.bio}</p>

          <div className="stats-grid">
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

          <h3 className="recent-activity-title">Actividad Reciente</h3>
          <div className="activity-list">
            {details.activities.map((act) => (
              <div key={act.id} className="activity-item">
                <div className="activity-dot" />
                <div className="activity-text" dangerouslySetInnerHTML={{ __html: act.text }} />
              </div>
            ))}
          </div>
        </div>

        <footer className="document-reader-footer">
          <button className="btn-primary" onClick={onClose} style={{ width: 'auto' }}>
            Cerrar Perfil
          </button>
        </footer>
      </div>
    </div>
  );
}
