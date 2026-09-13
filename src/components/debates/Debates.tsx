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

  return (
    <motion.div className="debates-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Breadcrumbs items={[{ label: 'Debates' }]} />
      <motion.div className="page-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="page-title">Foro de Debates</h2>
        <p className="page-subtitle">Espacio para dialogar sobre la verdad, la teología y nuestra postura ante el mundo moderno.</p>
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
