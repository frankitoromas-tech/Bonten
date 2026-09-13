'use client';
import React from 'react';
import type { Debate } from '@/types';
import { motion } from 'framer-motion';

export function getStanceRatio(debate: Debate) {
  const pro = debate.arguments.filter((a) => a.type === 'pro').length;
  const contra = debate.arguments.filter((a) => a.type === 'contra').length;
  const total = pro + contra;
  if (total === 0) return { proPercent: 50, contraPercent: 50, proCount: 0, contraCount: 0 };
  const proPercent = Math.round((pro / total) * 100);
  const contraPercent = 100 - proPercent;
  return { proPercent, contraPercent, proCount: pro, contraCount: contra };
}

interface DebateCardProps {
  debate: Debate;
  index: number;
  onSelect: (id: number) => void;
}

export default function DebateCard({ debate, index, onSelect }: DebateCardProps) {
  const ratio = getStanceRatio(debate);

  return (
    <motion.article
      className="debate-card"
      onClick={() => onSelect(debate.id)}
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(debate.id);
        }
      }}
    >
      <div className="debate-card-header">
        <span className="debate-tag">{debate.tag}</span>
        <div className="debate-stats">
          <div className="debate-stat-item">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{debate.arguments.length}</span>
          </div>
          <div className="debate-stat-item">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <span>{debate.voters}</span>
          </div>
        </div>
      </div>

      <h3 className="debate-card-title">{debate.title}</h3>
      <p className="debate-card-description">{debate.description}</p>

      {/* Barra Versus Porcentual en Tarjeta */}
      <div style={{ margin: '1rem 0 1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.3rem' }}>
          <span style={{ color: '#10b981' }}>{ratio.proPercent}% A Favor</span>
          <span style={{ color: '#ef4444' }}>{ratio.contraPercent}% En Contra</span>
        </div>
        <div style={{ height: '6px', background: 'var(--bg-base)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${ratio.proPercent}%`, background: '#10b981' }} />
          <div style={{ width: `${ratio.contraPercent}%`, background: '#ef4444' }} />
        </div>
      </div>

      <span className="btn-outline" style={{ display: 'inline-block', width: 'auto' }}>
        Entrar al Debate
      </span>
    </motion.article>
  );
}
