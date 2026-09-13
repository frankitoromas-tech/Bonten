'use client';
import React from 'react';
import type { Debate, ReactionType, ArgumentStance } from '@/types';
import { motion } from 'framer-motion';
import ArgumentBubble from './ArgumentBubble';
import ArgumentForm from './ArgumentForm';
import { getStanceRatio } from './DebateCard';

interface DebateDetailProps {
  debate: Debate;
  onBack: () => void;
  onReact: (argId: number, reaction: ReactionType) => void;
  onAddOpinion: (author: string, type: ArgumentStance, text: string) => void;
}

export default function DebateDetail({ debate, onBack, onReact, onAddOpinion }: DebateDetailProps) {
  const proArguments = debate.arguments.filter((a) => a.type === 'pro');
  const contraArguments = debate.arguments.filter((a) => a.type === 'contra');
  const ratio = getStanceRatio(debate);

  return (
    <motion.div
      className="debates-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <motion.button className="back-btn" onClick={onBack} whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Volver a la lista de debates</span>
      </motion.button>

      <article className="debate-detail-card">
        <span className="debate-tag">{debate.tag}</span>
        <h2 className="debate-card-title" style={{ marginTop: '0.8rem' }}>{debate.title}</h2>
        <p className="debate-card-description">{debate.description}</p>

        {/* Barra Versus Porcentual */}
        <div style={{ margin: '1.5rem 0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            <span style={{ color: '#10b981' }}>🟢 A Favor: {ratio.proPercent}% ({ratio.proCount})</span>
            <span style={{ color: '#ef4444' }}>🔴 En Contra: {ratio.contraPercent}% ({ratio.contraCount})</span>
          </div>
          <div style={{ height: '10px', background: 'var(--bg-base)', borderRadius: '10px', overflow: 'hidden', display: 'flex', border: '1px solid var(--border-color)' }}>
            <div style={{ width: `${ratio.proPercent}%`, background: '#10b981', transition: 'width 0.5s ease', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }} />
            <div style={{ width: `${ratio.contraPercent}%`, background: '#ef4444', transition: 'width 0.5s ease', boxShadow: '0 0 10px rgba(239,68,68,0.5)' }} />
          </div>
        </div>

        <div className="debate-stats">
          <div className="debate-stat-item">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{debate.arguments.length} opiniones en total</span>
          </div>
          <div className="debate-stat-item">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{debate.voters} participantes</span>
          </div>
        </div>
      </article>

      <h3 className="arguments-title">Posturas de la Comunidad</h3>

      <div className="arguments-grid">
        <div className="argument-column">
          <div className="column-header pro">A Favor / Apoyo</div>
          {proArguments.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              No hay posturas registradas a favor todavía.
            </p>
          ) : (
            proArguments.map((arg) => <ArgumentBubble key={arg.id} arg={arg} onReact={onReact} />)
          )}
        </div>

        <div className="argument-column">
          <div className="column-header contra">En Contra / Crítica</div>
          {contraArguments.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              No hay posturas registradas en contra todavía.
            </p>
          ) : (
            contraArguments.map((arg) => <ArgumentBubble key={arg.id} arg={arg} onReact={onReact} />)
          )}
        </div>
      </div>

      <ArgumentForm onSubmit={onAddOpinion} />
    </motion.div>
  );
}
