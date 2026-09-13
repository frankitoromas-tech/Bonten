'use client';

import { useState } from 'react';
import type { LibraryDocument } from '@/types';

interface Props {
  initialDocuments: LibraryDocument[];
}

export function LibraryEditor({ initialDocuments }: Props) {
  const [docs, setDocs] = useState<LibraryDocument[]>(initialDocuments);
  const [editingDoc, setEditingDoc] = useState<Partial<LibraryDocument> | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const triggerAudio = (type: 'pop' | 'success' | 'toggle') => {
    if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio) {
      const audio = (window as unknown as { bontenAudio: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio;
      if (type === 'pop') audio.playTactilePop();
      else if (type === 'success') audio.playSuccess();
      else if (type === 'toggle') audio.playToggle();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;
    setLoading(true);
    triggerAudio('pop');

    try {
      const isNew = !editingDoc.id;
      const url = '/api/admin/library';
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDoc),
      });

      if (!res.ok) throw new Error('Error al procesar el documento');
      const json = await res.json();

      if (isNew) {
        setDocs([...docs, json.document]);
      } else {
        setDocs(docs.map((d) => (d.id === json.document.id ? json.document : d)));
      }
      triggerAudio('success');
      setEditingDoc(null);
      setFeedback('✓ Documento guardado con éxito');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar';
      setFeedback(`✗ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este documento de la biblioteca?')) return;
    triggerAudio('toggle');
    try {
      const res = await fetch(`/api/admin/library?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setDocs(docs.filter((d) => d.id !== id));
      triggerAudio('success');
      setFeedback('✓ Documento eliminado de la biblioteca');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar';
      setFeedback(`✗ ${msg}`);
    }
  };

  // Categorías dinámicas disponibles
  const categories = ['Todas', ...Array.from(new Set(docs.map((d) => d.category).filter(Boolean)))];

  // Documentos filtrados
  const filteredDocs = docs.filter((d) => {
    const matchesCategory = selectedCategory === 'Todas' || d.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      d.title.toLowerCase().includes(query) ||
      d.author.toLowerCase().includes(query) ||
      d.content.some((p) => p.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  // Métricas reactivas para el editor
  const currentContentText = (editingDoc?.content || []).join(' ');
  const currentWordCount = currentContentText.trim() ? currentContentText.trim().split(/\s+/).length : 0;
  const autoEstimatedReadTime = `${Math.max(1, Math.ceil(currentWordCount / 200))} min`;

  return (
    <div className="space-y-6">
      {/* Header con Barra Superior */}
      <div className="admin-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--title-color)]">
            Biblioteca & Manifiestos Doctrinales
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Ensayos socráticos, tratados provida y tipologías de la comunidad ({docs.length} registros)
          </p>
        </div>
        <button
          onClick={() => {
            triggerAudio('pop');
            setEditingDoc({ title: '', category: 'Doctrina', author: 'Fireboy', readTime: '5 min', content: [''] });
          }}
          className="btn-admin-primary text-xs !py-2 !px-3.5 flex items-center gap-1.5"
        >
          <span>+</span> Nuevo Documento
        </button>
      </div>

      {feedback && (
        <div className="p-3 text-xs font-medium rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/40 text-sky-700 dark:text-sky-300 flex justify-between items-center">
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="text-slate-400 hover:text-slate-600 text-xs">×</button>
        </div>
      )}

      {/* Formulario de Creación / Edición */}
      {editingDoc && (
        <form onSubmit={handleSave} className="admin-card space-y-4 card-3d-layer">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/80 dark:border-white/10">
            <h4 className="text-sm font-semibold text-[var(--title-color)]">
              {editingDoc.id ? `Editar Documento #${editingDoc.id}` : 'Crear Nuevo Documento'}
            </h4>
            <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
              <span>Palabras: <strong className="text-sky-600 dark:text-sky-400 font-mono">{currentWordCount}</strong></span>
              <span>Párrafos: <strong className="text-sky-600 dark:text-sky-400 font-mono">{(editingDoc.content || []).length}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Título del documento"
              value={editingDoc.title || ''}
              onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
              className="admin-input sm:col-span-2 !text-xs"
              required
            />
            <input
              type="text"
              placeholder="Categoría (ej. Doctrina, Bioética)"
              value={editingDoc.category || ''}
              onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value })}
              className="admin-input !text-xs"
              required
            />
            <input
              type="text"
              placeholder="Autor"
              value={editingDoc.author || ''}
              onChange={(e) => setEditingDoc({ ...editingDoc, author: e.target.value })}
              className="admin-input !text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tiempo de lectura (ej. 4 min)"
              value={editingDoc.readTime || ''}
              onChange={(e) => setEditingDoc({ ...editingDoc, readTime: e.target.value })}
              className="admin-input !text-xs flex-1"
            />
            <button
              type="button"
              onClick={() => {
                triggerAudio('toggle');
                setEditingDoc({ ...editingDoc, readTime: autoEstimatedReadTime });
              }}
              className="btn-admin-secondary text-xs !py-2 !px-3 whitespace-nowrap"
              title="Calcular a 200 palabras por minuto"
            >
              ⏱️ Auto: {autoEstimatedReadTime}
            </button>
          </div>

          <textarea
            placeholder="Párrafos del documento (separados por dos saltos de línea Enter Enter)"
            value={(editingDoc.content || []).join('\n\n')}
            onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value.split('\n\n') })}
            className="admin-input h-36 text-xs leading-relaxed"
            required
          />

          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={loading} className="btn-admin-primary text-xs !py-2 !px-4">
              {loading ? 'Guardando...' : 'Guardar Documento'}
            </button>
            <button
              type="button"
              onClick={() => {
                triggerAudio('pop');
                setEditingDoc(null);
              }}
              className="btn-admin-secondary text-xs !py-2 !px-3"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Barra de Búsqueda y Píldoras de Categorías */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Buscar por título, autor o doctrina..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input !text-xs w-full pl-8"
            />
            <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 select-none">🔍</span>
          </div>

          <div className="text-xs text-[var(--text-muted)] w-full sm:w-auto text-right">
            Mostrando {filteredDocs.length} de {docs.length}
          </div>
        </div>

        {/* Píldoras de Selección de Categoría */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Filtrar:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                triggerAudio('toggle');
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-sky-400/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Documentos Filtrados */}
      {filteredDocs.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-white/5 text-xs text-[var(--text-muted)]">
          No se encontraron documentos coincidentes con el criterio de búsqueda.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredDocs.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-sky-400/40 transition-colors shadow-sm card-3d-layer"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge-premium badge-royal-sapphire text-[10px]">
                    <span className="badge-emoji-halo">📚</span>
                    {d.category}
                  </span>
                  <span className="text-sm font-semibold text-[var(--title-color)]">{d.title}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Por <strong className="text-slate-700 dark:text-slate-300">{d.author}</strong> • {d.readTime} • {d.content.length} párrafos
                </p>
              </div>
              <div className="flex gap-2 self-end sm:self-center">
                <button
                  onClick={() => {
                    triggerAudio('pop');
                    setEditingDoc(d);
                  }}
                  className="btn-admin-secondary text-xs !py-1 !px-2.5"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
