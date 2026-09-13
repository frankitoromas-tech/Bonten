'use client';
import React from 'react';
import type { DebateArgument, ReactionType } from '@/types';
import { motion } from 'framer-motion';

export const REACTIONS: { key: ReactionType; label: string }[] = [
  { key: 'solido', label: '💪 Sólido' },
  { key: 'persuasivo', label: '💡 Persuasivo' },
  { key: 'respetuoso', label: '🤝 Respetuoso' },
];

interface ArgumentBubbleProps {
  arg: DebateArgument;
  onReact: (argId: number, reaction: ReactionType) => void;
}

export default function ArgumentBubble({ arg, onReact }: ArgumentBubbleProps) {
  return (
    <motion.div
      className="argument-bubble"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
    >
      <div className="argument-author-bar">
        <div className="argument-author-avatar" style={{ backgroundImage: `url(${arg.avatar})` }} />
        <div>
          <h4 className="argument-author-name">{arg.author}</h4>
          <span className={`role-badge ${arg.roleClass}`} style={{ margin: 0, fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>
            {arg.role}
          </span>
        </div>
      </div>
      <p className="argument-text">{arg.text}</p>
      <div className="argument-reactions">
        {REACTIONS.map((r) => (
          <motion.button
            key={r.key}
            className={`reaction-btn ${arg.userReactions.includes(r.key) ? 'voted' : ''}`}
            onClick={() => onReact(arg.id, r.key)}
            aria-pressed={arg.userReactions.includes(r.key)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
          >
            <span>{r.label}</span>
            <strong>{arg.reactions[r.key]}</strong>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
