'use client';
import React, { useState } from 'react';
import ProfileModal from './ProfileModal';
import { LEADER, ADMINS, MEMBERS } from '@/data/members';
import type { Member, Leader } from '@/types';
import { motion } from 'framer-motion';

export default function Members() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const getAsMember = (leader: Leader): Member => ({
    name: leader.name,
    role: leader.role,
    roleClass: 'role-mod',
    bio: leader.bio,
    avatar: leader.avatar,
  });

  return (
    <>
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="page-title">Mesa Directiva</h2>
        <p className="page-subtitle">Conoce al fundador y a los miembros de nuestra comunidad.</p>
      </motion.div>

      <section className="leader-section">
        <motion.article 
          className="leader-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.5 }}
        >
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
              <button className="btn-outline" onClick={() => setSelectedMember(getAsMember(LEADER))}>
                Ver Perfil
              </button>
            </div>
          </div>
        </motion.article>
      </section>

      <motion.div 
        className="divider"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <span>Equipo BONTEN</span>
      </motion.div>

      <section className="admin-directory" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', width: '100%', marginBottom: '4rem' }}>
        {ADMINS.map((person, idx) => (
          <motion.article 
            key={idx} 
            className="leader-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="leader-avatar-wrapper">
              <div className="leader-avatar" style={{ backgroundImage: `url("${person.avatar}")` }} />
              <div className="leader-ring" />
            </div>
            <div className="leader-info">
              <span className="leader-badge">{person.role}</span>
              <h3 className="leader-name">{person.name}</h3>
              <p className="leader-handle">{person.handle}</p>
              <p className="leader-bio">&quot;{person.bio}&quot;</p>

              <div className="leader-actions">
                <a href={person.tiktok} target="_blank" rel="noopener noreferrer" className="tiktok-btn">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                  <span>TikTok</span>
                </a>
                <a href={person.youtube} target="_blank" rel="noopener noreferrer" className="youtube-btn">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                  <span>YouTube</span>
                </a>
                <button className="btn-outline" onClick={() => setSelectedMember(getAsMember(person))}>
                  Ver Perfil
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      {selectedMember && <ProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </>
  );
}
