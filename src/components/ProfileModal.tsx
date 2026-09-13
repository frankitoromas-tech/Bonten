'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { MEMBER_DETAILS } from '@/data/members';
import type { Member, MemberDetails } from '@/types';
import { motion } from 'framer-motion';

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
    <motion.div 
      className="modal-overlay" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true" 
      aria-label={`Perfil de ${member.name}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '600px' }}
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
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

        <footer className="document-reader-footer" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
          {member.slug && (
            <Link
              href={`/integrantes/${member.slug}`}
              className="btn-primary"
              style={{ width: 'auto', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.4rem', fontSize: '0.92rem' }}
              onClick={onClose}
            >
              <span>Ver Información Completa</span>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          )}
          <button className="btn-outline" onClick={onClose} style={{ width: 'auto' }}>
            Cerrar
          </button>
        </footer>
      </motion.div>
    </motion.div>
  );
}

