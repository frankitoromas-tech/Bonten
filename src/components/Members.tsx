'use client';
import React, { useState } from 'react';
import ProfileModal from './ProfileModal';
import { LEADER, ADMINS } from '@/data/members';
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
