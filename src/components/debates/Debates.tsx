'use client';
import React, { useState } from 'react';
import type { ReactionType, ArgumentStance } from '@/types';
import { motion } from 'framer-motion';
import DebateCard from './DebateCard';
import DebateDetail from './DebateDetail';
import DebateFilterBar from './DebateFilterBar';
import { useDebatesState } from './useDebatesState';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default function Debates() {
  const { debates, handleReaction, handleAddOpinion } = useDebatesState();
  const [selectedDebateId, setSelectedDebateId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Todos');

  const activeDebate = debates.find((d) => d.id === selectedDebateId);

  const filteredDebates = debates.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
    const matchesTag = selectedTag === 'Todos' || d.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  if (activeDebate) {
    return (
      <DebateDetail
        debate={activeDebate}
        onBack={() => setSelectedDebateId(null)}
        onReact={(argId: number, r: ReactionType) => handleReaction(activeDebate.id, argId, r)}
        onAddOpinion={(author: string, type: ArgumentStance, text: string) =>
          handleAddOpinion(activeDebate.id, author, type, text)
        }
      />
    );
  }

  const totalArguments = debates.reduce((acc, d) => acc + d.arguments.length, 0);
  const totalVoters = debates.reduce((acc, d) => acc + (d.voters || 0), 0);

  return (
    <motion.div className="debates-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Breadcrumbs items={[{ label: 'Debates' }]} />

      {/* Ágora Dialéctica & Hero Header de Alta Densidad */}
      <motion.div
        className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#060c1d]/95 via-[#0a1532]/95 to-slate-950 border border-sky-500/30 shadow-[0_12px_45px_-12px_rgba(56,189,248,0.25)] backdrop-blur-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-400/40">
                🏛️ Ágora Socrática & Dialéctica
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Debates Activos en Tiempo Real
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Foro de Debates & Resistencia Intelectual
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Espacio dialéctico para confrontar ideas con rigor bioético, lógica implacable y fundamentos ontológicos frente al nihilismo y el relativismo moral.
            </p>
          </div>

          {/* KPIs del Foro */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="px-4 py-3 rounded-2xl bg-slate-900/85 border border-slate-800 text-center min-w-[95px] shadow-sm">
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-sky-400 block">{debates.length}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Debates</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-900/85 border border-slate-800 text-center min-w-[95px] shadow-sm">
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400 block">{totalArguments}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Argumentos</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-900/85 border border-slate-800 text-center min-w-[95px] shadow-sm">
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400 block">{totalVoters}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Votos</span>
            </div>
          </div>
        </div>

        {/* Principios de la Dialéctica */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
            <span className="text-sky-400 text-base">🛡️</span>
            <div>
              <strong className="text-slate-200 block">1. Cero Ad Hominem</strong>
              <span className="text-slate-400 text-[11px]">Se refutan premisas y falacias, nunca a la persona.</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
            <span className="text-emerald-400 text-base">🧬</span>
            <div>
              <strong className="text-slate-200 block">2. Evidencia Bioética</strong>
              <span className="text-slate-400 text-[11px]">Anclaje en la singamia, la genética y el derecho natural inmutable.</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
            <span className="text-amber-400 text-base">⚖️</span>
            <div>
              <strong className="text-slate-200 block">3. Serenidad Socrática</strong>
              <span className="text-slate-400 text-[11px]">Disentir con templanza; el fin supremo no es ganar, sino la verdad.</span>
            </div>
          </div>
        </div>
      </motion.div>

      <DebateFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
      />

      <div className="debates-list">
        {filteredDebates.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
            No se encontraron debates que coincidan con la búsqueda.
          </p>
        ) : (
          filteredDebates.map((debate, idx) => (
            <DebateCard key={debate.id} debate={debate} index={idx} onSelect={setSelectedDebateId} />
          ))
        )}
      </div>
    </motion.div>
  );
}
