'use client';
import React, { useState } from 'react';
import type { ArgumentStance } from '@/types';
import { motion } from 'framer-motion';

interface ArgumentFormProps {
  onSubmit: (author: string, type: ArgumentStance, text: string) => void;
}

export default function ArgumentForm({ onSubmit }: ArgumentFormProps) {
  const [author, setAuthor] = useState('');
  const [type, setType] = useState<ArgumentStance>('pro');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    onSubmit(author.trim(), type, text.trim());
    setAuthor('');
    setText('');
  };

  return (
    <section className="opinion-form-section">
      <h3 className="opinion-form-title">Aportar mi Opinión a la Resistencia</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="opinion-author">Tu Nombre / Pseudónimo</label>
          <input
            id="opinion-author"
            type="text"
            placeholder="Ej. LectorResistente"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="opinion-type">Tu Postura</label>
          <select id="opinion-type" value={type} onChange={(e) => setType(e.target.value as ArgumentStance)}>
            <option value="pro">A Favor / Apoyo al Manifiesto</option>
            <option value="contra">En Contra / Crítica Constructiva</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="opinion-text">Argumento (Sé claro y respetuoso)</label>
          <textarea
            id="opinion-text"
            rows={5}
            placeholder="Escribe aquí tu análisis apologético o sociológico..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <motion.button
          type="submit"
          className="btn-primary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Enviar Postura
        </motion.button>
      </form>
    </section>
  );
}
