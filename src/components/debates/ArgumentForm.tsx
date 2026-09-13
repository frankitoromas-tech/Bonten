'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ArgumentStance } from '@/types';
import { motion } from 'framer-motion';

interface ArgumentFormProps {
  onSubmit: (author: string, type: ArgumentStance, text: string) => void;
}

export default function ArgumentForm({ onSubmit }: ArgumentFormProps) {
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [type, setType] = useState<ArgumentStance>('pro');
  const [text, setText] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) setCurrentUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoadingUser(false));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !text.trim()) return;
    onSubmit(currentUser.username, type, text.trim());
    setText('');
  };

  if (loadingUser) {
    return <div className="opinion-form-section text-center py-6 text-xs text-slate-400 font-mono">Verificando credenciales de comunidad...</div>;
  }

  if (!currentUser) {
    return (
      <section className="opinion-form-section border-dashed border-cyan-500/30 text-center py-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mb-3 text-xl">
          🔒
        </div>
        <h3 className="opinion-form-title mb-2">Participación Protegida</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
          Para preservar la integridad del debate y evitar ataques de spam o suplantación, debes iniciar sesión con tu cuenta de la Comunidad BONTEN.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/auth/login?redirect=/debates" className="btn-primary text-xs py-2 px-5">Iniciar Sesión</Link>
          <Link href="/auth/register?redirect=/debates" className="btn-admin-secondary text-xs py-2 px-5">Crear Cuenta</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="opinion-form-section">
      <h3 className="opinion-form-title">Aportar mi Opinión a la Resistencia</h3>
      <p className="text-xs text-cyan-400 mb-4 font-mono">Debatiendo como: <strong>{currentUser.username}</strong></p>
      <form onSubmit={handleSubmit}>
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
        <motion.button type="submit" className="btn-primary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          Enviar Postura
        </motion.button>
      </form>
    </section>
  );
}

