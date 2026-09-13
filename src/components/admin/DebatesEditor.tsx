'use client';

import { useState } from 'react';
import type { Debate } from '@/types';

interface Props {
  initialDebates: Debate[];
}

const DEBATE_TAGS = ['Sociedad', 'Apologética', 'Filosofía', 'Bioética', 'Teología'];

export function DebatesEditor({ initialDebates }: Props) {
  const [debates, setDebates] = useState<Debate[]>(initialDebates);
  const [editingDebate, setEditingDebate] = useState<Partial<Debate> | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const triggerAudio = (type: 'pop' | 'success') => {
    if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playTactilePop: () => void; playSuccess: () => void } }).bontenAudio) {
      const audio = (window as unknown as { bontenAudio: { playTactilePop: () => void; playSuccess: () => void } }).bontenAudio;
      if (type === 'pop') audio.playTactilePop();
      else if (type === 'success') audio.playSuccess();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDebate) return;
    setLoading(true);

    try {
      const isNew = !editingDebate.id;
      const url = '/api/admin/debates';
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDebate),
      });

      if (!res.ok) throw new Error('Error al procesar el debate');
      const json = await res.json();

      if (isNew) {
        setDebates([json.debate, ...debates]);
      } else {
        setDebates(debates.map((d) => (d.id === json.debate.id ? json.debate : d)));
      }
      setEditingDebate(null);
      triggerAudio('success');
      setFeedback('✓ Debate actualizado y publicado en el foro en vivo');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar';
      setFeedback(`✗ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este debate del foro de la comunidad?')) return;
    triggerAudio('pop');
    try {
      const res = await fetch(`/api/admin/debates?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setDebates(debates.filter((d) => d.id !== id));
      triggerAudio('success');
      setFeedback('✓ Debate eliminado correctamente');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar';
      setFeedback(`✗ ${msg}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera de Sección */}
      <div className="admin-card flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-[var(--title-color)]">
            Gestión del Foro de Debates
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Crea, edita y modera los temas centrales de debate doctrinal y ético
          </p>
        </div>
        <button
          onClick={() => {
            triggerAudio('pop');
            setEditingDebate({ title: '', description: '', tag: 'Bioética' });
          }}
          className="btn-admin-primary text-xs !py-2 !px-3.5"
        >
          + Nuevo Debate
        </button>
      </div>

      {feedback && (
        <div className="p-3 text-xs font-medium rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/40 text-sky-700 dark:text-sky-300">
          {feedback}
        </div>
      )}

      {/* Formulario de Creación / Edición */}
      {editingDebate && (
        <form onSubmit={handleSave} className="admin-card space-y-4">
          <h4 className="text-sm font-semibold text-[var(--title-color)]">
            {editingDebate.id ? `Editar Debate #${editingDebate.id}` : 'Crear Nuevo Tema de Debate'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Título del debate (ej. Bioética clásica y verdad moral)"
                value={editingDebate.title || ''}
                onChange={(e) => setEditingDebate({ ...editingDebate, title: e.target.value })}
                className="admin-input"
                required
              />
            </div>
            <div>
              <select
                value={editingDebate.tag || 'Bioética'}
                onChange={(e) => setEditingDebate({ ...editingDebate, tag: e.target.value })}
                className="admin-input"
              >
                {DEBATE_TAGS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <textarea
            placeholder="Pregunta orientadora o descripción detallada del debate..."
            value={editingDebate.description || ''}
            onChange={(e) => setEditingDebate({ ...editingDebate, description: e.target.value })}
            className="admin-input h-24 text-xs leading-relaxed"
            required
          />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn-admin-primary text-xs">
              {editingDebate.id ? 'Guardar Cambios' : 'Publicar Debate'}
            </button>
            <button
              type="button"
              onClick={() => {
                triggerAudio('pop');
                setEditingDebate(null);
              }}
              className="btn-admin-secondary text-xs"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de Debates Existentes */}
      <div className="grid grid-cols-1 gap-3">
        {debates.map((d) => (
          <div
            key={d.id}
            className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-sky-400/40 transition-colors shadow-sm card-3d-tilt"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="badge-premium badge-magenta-neon text-[10px]">
                  <span className="badge-emoji-halo">⚖️</span>
                  {d.tag}
                </span>
                <span className="text-sm font-semibold text-[var(--title-color)]">{d.title}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 max-w-2xl">{d.description}</p>
              <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-3 pt-0.5">
                <span className="inline-flex items-center gap-1">
                  <span className="badge-emoji-halo">💬</span>
                  {d.arguments?.length || 0} argumentos
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="badge-emoji-halo">🗳️</span>
                  {d.voters || 0} votos
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => {
                  triggerAudio('pop');
                  setEditingDebate(d);
                }}
                className="btn-admin-secondary text-xs !py-1 !px-2.5"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(d.id)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
