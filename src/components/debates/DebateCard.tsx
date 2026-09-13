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

  const consensusLabel =
    ratio.proPercent >= 60
      ? 'Mayoría Provida Consolidada'
      : ratio.contraPercent >= 60
      ? 'Fuerte Controversia Cultural'
      : 'Dialéctica Viva & Equilibrada';

  return (
    <motion.article
      className="debate-card group relative overflow-hidden"
      onClick={() => onSelect(debate.id)}
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 40, rotateX: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.015, rotateX: 3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(debate.id);
        }
      }}
    >
      {/* Resplandor lateral sutil */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/10 transition-all duration-300" />

      <div className="debate-card-header">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="debate-tag">{debate.tag}</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            En Disputa
          </span>
        </div>

        <div className="debate-stats">
          <div className="debate-stat-item" title="Número de argumentos analizados">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{debate.arguments.length} aportes</span>
          </div>
          <div className="debate-stat-item" title="Votantes participantes">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <span>{debate.voters} votos</span>
          </div>
        </div>
      </div>

      <h3 className="debate-card-title group-hover:text-sky-400 transition-colors duration-200">
        {debate.title}
      </h3>
      <p className="debate-card-description">{debate.description}</p>

      {/* Barra Versus Porcentual con micro-resplandor y consenso */}
      <div className="my-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] font-extrabold mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span className="text-emerald-400 font-mono">{ratio.proPercent}% A Favor ({ratio.proCount})</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">{consensusLabel}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-rose-400 font-mono">{ratio.contraPercent}% En Contra ({ratio.contraCount})</span>
            <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_6px_#f43f5e]" />
          </div>
        </div>

        <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden flex gap-[2px] p-[1px]">
          <div
            style={{ width: `${ratio.proPercent}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-l-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          />
          <div
            style={{ width: `${ratio.contraPercent}%` }}
            className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-r-full transition-all duration-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="btn-outline inline-flex items-center gap-1.5 text-xs font-bold group-hover:border-sky-400 group-hover:text-sky-300 transition-all">
          <span>Ingresar a la Dialéctica</span>
          <span className="text-sm transition-transform duration-200 group-hover:translate-x-1">→</span>
        </span>
        <span className="text-[11px] text-slate-500 font-mono">ID #{debate.id.toString().padStart(3, '0')}</span>
      </div>
    </motion.article>
  );
}
