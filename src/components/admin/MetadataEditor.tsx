'use client';

import { useState } from 'react';
import type { SiteMetadata } from '@/lib/data/runtimeStore';

interface Props {
  initialMetadata: SiteMetadata;
}

export function MetadataEditor({ initialMetadata }: Props) {
  const [data, setData] = useState<SiteMetadata>(initialMetadata);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: 'idle', msg: '' });

    try {
      const res = await fetch('/api/admin/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Fallo al guardar metadatos');
      const json = await res.json();
      setData(json.metadata);
      setStatus({ type: 'success', msg: '✓ Metadatos actualizados con éxito en memoria y runtime' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setStatus({ type: 'error', msg: `✗ ${message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="admin-card space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>🌐</span> Metadatos Generales del Sitio
        </h3>
        <p className="text-xs text-slate-400 mt-1">Configuración del branding principal y meta tags</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-cyan-400 mb-1">Título Global</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="admin-input"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-cyan-400 mb-1">Slogan de Cabecera</label>
          <input
            type="text"
            value={data.headerSlogan}
            onChange={(e) => setData({ ...data, headerSlogan: e.target.value })}
            className="admin-input"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-cyan-400 mb-1">Descripción SEO</label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="admin-input h-20"
          rows={3}
        />
      </div>

      <div className="border-b border-white/10 pt-4 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>🔥</span> Perfil del Fundador (Fireboy)
        </h3>
        <p className="text-xs text-slate-400 mt-1">Redes sociales, biografía y atribución</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-cyan-400 mb-1">Nombre Completo</label>
          <input
            type="text"
            value={data.fireboy.fullName}
            onChange={(e) => setData({ ...data, fireboy: { ...data.fireboy, fullName: e.target.value } })}
            className="admin-input"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-cyan-400 mb-1">Handle / Usuario</label>
          <input
            type="text"
            value={data.fireboy.handle}
            onChange={(e) => setData({ ...data, fireboy: { ...data.fireboy, handle: e.target.value } })}
            className="admin-input"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-cyan-400 mb-1">TikTok URL</label>
          <input
            type="url"
            value={data.fireboy.tiktok}
            onChange={(e) => setData({ ...data, fireboy: { ...data.fireboy, tiktok: e.target.value } })}
            className="admin-input"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-cyan-400 mb-1">YouTube URL</label>
          <input
            type="url"
            value={data.fireboy.youtube}
            onChange={(e) => setData({ ...data, fireboy: { ...data.fireboy, youtube: e.target.value } })}
            className="admin-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-cyan-400 mb-1">Biografía Doctrinal</label>
        <textarea
          value={data.fireboy.bio}
          onChange={(e) => setData({ ...data, fireboy: { ...data.fireboy, bio: e.target.value } })}
          className="admin-input h-24"
        />
      </div>

      {status.msg && (
        <div className={`p-3 rounded-lg text-xs font-mono ${status.type === 'success' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'}`}>
          {status.msg}
        </div>
      )}

      <button type="submit" disabled={saving} className="btn-admin-primary">
        {saving ? 'Aplicando cifrado y guardando...' : '💾 Guardar Metadatos'}
      </button>
    </form>
  );
}
