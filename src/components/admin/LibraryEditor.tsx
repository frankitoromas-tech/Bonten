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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;
    setLoading(true);

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
    try {
      const res = await fetch(`/api/admin/library?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setDocs(docs.filter((d) => d.id !== id));
      setFeedback('✓ Documento eliminado de la biblioteca');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar';
      setFeedback(`✗ ${msg}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-lg font-bold text-white">📚 Biblioteca & Manifiestos Doctrinales</h3>
          <p className="text-xs text-slate-400">Administra los ensayos, tipologías y artículos de la comunidad</p>
        </div>
        <button
          onClick={() => setEditingDoc({ title: '', category: 'Doctrina', author: 'Fireboy', readTime: '5 min', content: [''] })}
          className="btn-admin-secondary text-xs"
        >
          + Nuevo Documento
        </button>
      </div>

      {feedback && <div className="p-3 text-xs font-mono rounded bg-slate-800 border border-cyan-500/30 text-cyan-300">{feedback}</div>}

      {editingDoc && (
        <form onSubmit={handleSave} className="admin-card space-y-4 border-cyan-500/40">
          <h4 className="text-sm font-mono text-cyan-400 font-bold">{editingDoc.id ? `Editar Documento #${editingDoc.id}` : 'Crear Nuevo Documento'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Título del documento"
              value={editingDoc.title || ''}
              onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
              className="admin-input"
              required
            />
            <input
              type="text"
              placeholder="Categoría (ej. Manifiesto, Teología)"
              value={editingDoc.category || ''}
              onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value })}
              className="admin-input"
              required
            />
            <input
              type="text"
              placeholder="Autor"
              value={editingDoc.author || ''}
              onChange={(e) => setEditingDoc({ ...editingDoc, author: e.target.value })}
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Tiempo de lectura (ej. 4 min)"
              value={editingDoc.readTime || ''}
              onChange={(e) => setEditingDoc({ ...editingDoc, readTime: e.target.value })}
              className="admin-input"
            />
          </div>
          <textarea
            placeholder="Párrafos del documento (separados por dos saltos de línea)"
            value={(editingDoc.content || []).join('\n\n')}
            onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value.split('\n\n') })}
            className="admin-input h-28 font-mono text-xs"
            required
          />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn-admin-primary text-xs">Guardar Documento</button>
            <button type="button" onClick={() => setEditingDoc(null)} className="btn-admin-secondary text-xs">Cancelar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-3">
        {docs.map((d) => (
          <div key={d.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex justify-between items-center hover:border-cyan-500/30 transition-colors">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 mr-2">{d.category}</span>
              <span className="text-sm font-semibold text-white">{d.title}</span>
              <p className="text-xs text-slate-400 mt-1">Por {d.author} • {d.readTime} • {d.content.length} párrafos</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingDoc(d)} className="px-3 py-1 rounded bg-slate-800 text-xs text-cyan-400 hover:bg-slate-700">Editar</button>
              <button onClick={() => handleDelete(d.id)} className="px-3 py-1 rounded bg-rose-950/50 text-xs text-rose-400 hover:bg-rose-900/50">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
