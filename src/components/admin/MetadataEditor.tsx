'use client';

import { useState } from 'react';
import Image from 'next/image';
import TiltCard3D from '@/components/ui/TiltCard3D';
import type { SiteMetadata } from '@/lib/data/runtimeStore';

interface Props {
  initialMetadata: SiteMetadata;
}

const ROLE_PRESETS = [
  '🔥 Fundador',
  '🛡️ Apologética',
  '🎙️ Productor',
  '🏛️ Filosofía',
  '✍️ Ensayista',
  '⚖️ Bioética Provida',
];

const FIREBOY_GALLERY = [
  { url: '/assets/fireboy_dorsal_7.webp', label: 'Dorsal 7' },
  { url: '/assets/avatar_fireboy_1781973753933.webp', label: 'Oficial' },
  { url: '/assets/fireboy_premium_1781974414658.webp', label: 'Gala' },
  { url: '/assets/fireboy_football_1781974649200.webp', label: 'Deporte' },
  { url: '/assets/fireboy_client.webp', label: 'Retrato' },
  { url: '/assets/b5.jpeg', label: 'BONTEN' },
];

export function MetadataEditor({ initialMetadata }: Props) {
  const [data, setData] = useState<SiteMetadata>(initialMetadata);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: '',
  });

  const triggerAudio = (type: 'pop' | 'success') => {
    if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playTactilePop: () => void; playSuccess: () => void } }).bontenAudio) {
      const audio = (window as unknown as { bontenAudio: { playTactilePop: () => void; playSuccess: () => void } }).bontenAudio;
      if (type === 'pop') audio.playTactilePop();
      else if (type === 'success') audio.playSuccess();
    }
  };

  const toggleRole = (role: string) => {
    triggerAudio('pop');
    const currentRoles = data.fireboy.roles || [];
    if (currentRoles.includes(role)) {
      setData({
        ...data,
        fireboy: { ...data.fireboy, roles: currentRoles.filter((r) => r !== role) },
      });
    } else {
      setData({
        ...data,
        fireboy: { ...data.fireboy, roles: [...currentRoles, role] },
      });
    }
  };

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

      if (!res.ok) throw new Error('Error al guardar metadatos');
      const json = await res.json();
      setData(json.metadata);
      triggerAudio('success');
      setStatus({ type: 'success', msg: '✓ Cambios guardados y aplicados en vivo en toda la web.' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setStatus({ type: 'error', msg: `✗ ${message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Vista Previa Elegante con Tilt 3D */}
      <TiltCard3D intensity={7} glare={true} style={{ borderRadius: 'var(--radius-lg)' }}>
        <div className="admin-card overflow-hidden !p-0">
          <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 opacity-80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-80" />
              <span className="text-xs font-medium text-[var(--text-muted)] ml-2">
                Vista previa en vivo • Tarjeta 3D
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/LOGO_BONTEN_V2.jpeg"
                alt="Logo BONTEN"
                width={18}
                height={18}
                className="rounded-full object-cover"
              />
              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                Sincronizado
              </span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <span className="badge-premium badge-magenta-neon text-[10.5px] mb-2">
                <span className="badge-emoji-halo">⚡</span>
                {data.headerSlogan || 'SLOGAN PRINCIPAL'}
              </span>
              <h2 className="text-xl font-bold text-[var(--title-color)]">
                {data.title || 'Título del Sitio'}
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                {data.description || 'Descripción del sitio'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-200/80 dark:border-white/10">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-sky-400/40 shadow-sm shrink-0">
                <Image
                  src={data.fireboy.avatar || '/assets/avatar_fireboy_1781973753933.webp'}
                  alt={data.fireboy.fullName}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[var(--text-dark)] flex items-center gap-2">
                  <span>{data.fireboy.fullName}</span>
                  <span className="text-[11px] text-[var(--text-muted)] font-normal">{data.fireboy.handle}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(data.fireboy.roles || []).map((r) => {
                    const isGold = r.includes('Fundador') || r.includes('Líder');
                    const isViolet = r.includes('Doctrina') || r.includes('Filosofía');
                    const badgeClass = isGold ? 'badge-gold-fire' : isViolet ? 'badge-imperial-violet' : 'badge-royal-sapphire';
                    const parts = r.split(' ');
                    const emoji = parts[0]?.match(/\p{Extended_Pictographic}/u) ? parts[0] : null;
                    const label = emoji ? parts.slice(1).join(' ') : r;
                    return (
                      <span key={r} className={`badge-premium ${badgeClass} text-[10px]`}>
                        {emoji && <span className="badge-emoji-halo">{emoji}</span>}
                        <span>{label}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TiltCard3D>

      {/* Formulario de Edición */}
      <form onSubmit={handleSave} className="admin-card space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <h3 className="text-sm font-semibold text-[var(--title-color)]">
              Contenido & Identidad
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Personaliza el título, slogan y optimización en buscadores
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerAudio('pop');
              setData(initialMetadata);
            }}
            className="text-xs text-slate-500 hover:text-sky-600 transition-colors"
          >
            Restaurar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Título del Sitio
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="admin-input"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Slogan Principal
            </label>
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
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Descripción SEO
          </label>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="admin-input h-20 resize-none"
            rows={2}
          />
        </div>

        <div className="pt-2">
          <div className="pb-3 border-b border-slate-200/80 dark:border-white/10 mb-4">
            <h4 className="text-sm font-semibold text-[var(--title-color)]">
              Perfil de Fireboy
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              Insignias, redes y biografía del fundador
            </p>
          </div>

          {/* Selector visual de Fotos Oficiales de Fireboy */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Fotografía Oficial de Fireboy (Selección en 1 Clic):
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {FIREBOY_GALLERY.map((photo) => {
                const isSelected = (data.fireboy.avatar || '/assets/avatar_fireboy_1781973753933.webp') === photo.url;
                return (
                  <button
                    key={photo.url}
                    type="button"
                    onClick={() => {
                      triggerAudio('pop');
                      setData({ ...data, fireboy: { ...data.fireboy, avatar: photo.url } });
                    }}
                    className={`relative group rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 ring-2 ring-sky-400/50 shadow-md scale-105'
                        : 'border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100 hover:scale-102'
                    }`}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.label}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 py-0.5 bg-black/60 backdrop-blur-xs text-[9.5px] text-center font-semibold text-white">
                      {photo.label}
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold shadow">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Nombre Público
              </label>
              <input
                type="text"
                value={data.fireboy.fullName}
                onChange={(e) => setData({ ...data, fireboy: { ...data.fireboy, fullName: e.target.value } })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                value={data.fireboy.handle}
                onChange={(e) => setData({ ...data, fireboy: { ...data.fireboy, handle: e.target.value } })}
                className="admin-input"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Insignias Doctrinales & Roles de Prestigio (Clic para activar/desactivar):
            </label>
            <div className="flex flex-wrap gap-2">
              {ROLE_PRESETS.map((preset) => {
                const active = (data.fireboy.roles || []).includes(preset);
                const isGold = preset.includes('Fundador') || preset.includes('Líder');
                const isViolet = preset.includes('Doctrina') || preset.includes('Filosofía');
                const badgeClass = isGold ? 'badge-gold-fire' : isViolet ? 'badge-imperial-violet' : 'badge-royal-sapphire';
                const parts = preset.split(' ');
                const emoji = parts[0]?.match(/\p{Extended_Pictographic}/u) ? parts[0] : null;
                const label = emoji ? parts.slice(1).join(' ') : preset;

                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => toggleRole(preset)}
                    className={`badge-premium cursor-pointer transition-all ${
                      active
                        ? `${badgeClass} scale-105 shadow-md`
                        : 'opacity-50 hover:opacity-90 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <span className="badge-emoji-halo font-bold">{active ? '✓' : '+'}</span>
                    {emoji && <span className="badge-emoji-halo">{emoji}</span>}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">TikTok</label>
                {data.fireboy.tiktok && (
                  <a href={data.fireboy.tiktok} target="_blank" rel="noopener noreferrer" className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline">
                    Probar ↗
                  </a>
                )}
              </div>
              <input
                type="url"
                value={data.fireboy.tiktok}
                onChange={(e) => setData({ ...data, fireboy: { ...data.fireboy, tiktok: e.target.value } })}
                className="admin-input"
                placeholder="https://tiktok.com/@..."
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">YouTube</label>
                {data.fireboy.youtube && (
                  <a href={data.fireboy.youtube} target="_blank" rel="noopener noreferrer" className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline">
                    Probar ↗
                  </a>
                )}
              </div>
              <input
                type="url"
                value={data.fireboy.youtube}
                onChange={(e) => setData({ ...data, fireboy: { ...data.fireboy, youtube: e.target.value } })}
                className="admin-input"
                placeholder="https://youtube.com/@..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Biografía
            </label>
            <textarea
              value={data.fireboy.bio}
              onChange={(e) => setData({ ...data, fireboy: { ...data.fireboy, bio: e.target.value } })}
              className="admin-input h-20 resize-none"
              rows={2}
            />
          </div>
        </div>

        {status.msg && (
          <div className={`p-3 rounded-xl text-xs font-medium animate-fadeIn ${
            status.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50'
          }`}>
            {status.msg}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-admin-primary w-full py-2.5 text-xs"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}
