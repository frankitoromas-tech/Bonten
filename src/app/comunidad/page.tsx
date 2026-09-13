'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import TiltCard3D from '@/components/ui/TiltCard3D';

interface CommunityPost {
  id: string;
  author: string;
  role: string;
  avatar: string;
  timestamp: string;
  tag: string;
  content: string;
  likes: number;
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Fireboy',
    role: 'Fundador & Superadmin',
    avatar: '/assets/fireboy_dorsal_7.webp',
    timestamp: 'Hace 2 horas',
    tag: 'Proclama Oficial',
    content: 'La defensa de la vida no es una postura negociable ni una moda coyuntural: es un imperativo ontológico. Invitamos a todos los nuevos miembros a estudiar a fondo el nuevo tratado sobre la Posmodernidad en la sección de Manifiestos.',
    likes: 38,
  },
  {
    id: 'post-2',
    author: 'Daniel',
    role: 'Bioética & Mesa Directiva',
    avatar: '/assets/b5.jpeg',
    timestamp: 'Hace 5 horas',
    tag: 'Bioética Médica',
    content: 'En las próximas jornadas estaremos compartiendo las últimas evidencias embriológicas y genéticas que demuestran la individualidad biológica ininterrumpida desde la concepción. ¡La ciencia es nuestra aliada fundamental!',
    likes: 24,
  },
  {
    id: 'post-3',
    author: 'Comunidad BONTEN',
    role: 'Comité de Difusión',
    avatar: '/LOGO_BONTEN_V2.jpeg',
    timestamp: 'Ayer',
    tag: 'Convocatoria',
    content: 'El Foro de Debates está abierto para todos los miembros registrados. Plantea tus argumentos con respeto, datos empíricos y solidez apologética.',
    likes: 19,
  },
];

export default function ComunidadPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [memberAlias, setMemberAlias] = useState('');
  const [hasPledged, setHasPledged] = useState(false);
  const [pledgeCount, setPledgeCount] = useState(142);
  const [activeTab, setActiveTab] = useState<'muro' | 'principios' | 'directorio'>('muro');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pledged = localStorage.getItem('bonten:pledge') === 'true';
      setHasPledged(pledged);
    }
  }, []);

  const triggerAudio = (type: 'pop' | 'success' | 'toggle') => {
    if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio) {
      const audio = (window as unknown as { bontenAudio: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio;
      if (type === 'pop') audio.playTactilePop();
      else if (type === 'success') audio.playSuccess();
      else if (type === 'toggle') audio.playToggle();
    }
  };

  const handleLike = (id: string) => {
    triggerAudio('pop');
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    triggerAudio('success');
    const newEntry: CommunityPost = {
      id: 'post-' + Date.now(),
      author: memberAlias.trim() || 'Defensor Provida',
      role: 'Miembro Acreditado',
      avatar: '/LOGO_BONTEN_V2.jpeg',
      timestamp: 'Ahora mismo',
      tag: 'Aporte de la Comunidad',
      content: newPostText.trim(),
      likes: 1,
    };

    setPosts([newEntry, ...posts]);
    setNewPostText('');
  };

  const handleTogglePledge = () => {
    triggerAudio('success');
    const nextState = !hasPledged;
    setHasPledged(nextState);
    setPledgeCount((prev) => (nextState ? prev + 1 : prev - 1));
    if (typeof window !== 'undefined') {
      localStorage.setItem('bonten:pledge', nextState ? 'true' : 'false');
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl space-y-10">
      {/* Banner Hero de la Comunidad */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-2xl bg-gradient-to-br from-[#06152d] via-[#0b1b38] to-[#150a26] text-white"
      >
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-premium badge-magenta-neon text-xs font-semibold">
            <span className="badge-emoji-halo">🌐</span>
            <span>Fraternidad Provida Nueva Generación</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Comunidad BONTEN: La Resistencia en Acción
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Un bastión digital para quienes defienden la vida con rigor intelectual, fraternidad inquebrantable y valentía en la plaza pública.
          </p>

          {/* Métricas Comunitarias en Vivo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-xs text-slate-400 block">Adherentes</span>
              <span className="text-xl font-bold text-sky-400 font-mono">{pledgeCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-xs text-slate-400 block">Debates Abiertos</span>
              <span className="text-xl font-bold text-purple-400 font-mono">4</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-xs text-slate-400 block">Tratados & Ensayos</span>
              <span className="text-xl font-bold text-pink-400 font-mono">5</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-xs text-slate-400 block">Estado Muro</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Activo
              </span>
            </div>
          </div>
        </div>

        {/* Acciones de Cuenta & Compromiso */}
        <div className="relative z-10 pt-6 flex flex-wrap gap-3">
          <button
            onClick={handleTogglePledge}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg cursor-pointer flex items-center gap-2 ${
              hasPledged
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25'
            }`}
          >
            <span>{hasPledged ? '✓ Manifiesto Firmado' : '✍️ Firmar Manifiesto de Adhesión'}</span>
          </button>
          <Link
            href="/debates"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition-all flex items-center gap-2"
          >
            <span>💬 Ir al Foro de Debates</span>
          </Link>
          <Link
            href="/auth/register"
            className="px-5 py-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-semibold text-xs transition-all flex items-center gap-2"
          >
            <span>🛡️ Crear Cuenta de Miembro</span>
          </Link>
        </div>
      </motion.section>

      {/* Pestañas de Navegación de la Comunidad */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/10 pb-3">
        <button
          onClick={() => {
            triggerAudio('toggle');
            setActiveTab('muro');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'muro'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--title-color)]'
          }`}
        >
          📰 Muro de la Resistencia
        </button>
        <button
          onClick={() => {
            triggerAudio('toggle');
            setActiveTab('principios');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'principios'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--title-color)]'
          }`}
        >
          📜 Decálogo Comunitario
        </button>
        <button
          onClick={() => {
            triggerAudio('toggle');
            setActiveTab('directorio');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'directorio'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--title-color)]'
          }`}
        >
          🛡️ Liderazgo & Directiva
        </button>
      </div>

      {/* Contenido según Pestaña */}
      {activeTab === 'muro' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Principal: Publicar y Feed */}
          <div className="lg:col-span-8 space-y-6">
            {/* Formulario de Aporte Comunitario */}
            <form onSubmit={handleCreatePost} className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--title-color)] flex items-center gap-1.5">
                  <span>✍️</span> Comparte una reflexión con la Fraternidad
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Tu alias o nombre (ej. Carlos Provida)"
                  value={memberAlias}
                  onChange={(e) => setMemberAlias(e.target.value)}
                  className="admin-input !text-xs"
                />
              </div>
              <textarea
                placeholder="Escribe tu mensaje, testimonio o aporte de debate..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="admin-input h-24 text-xs leading-relaxed"
                required
              />
              <div className="flex justify-between items-center pt-1">
                <span className="text-[11px] text-[var(--text-muted)]">
                  Publicación abierta sujeta a normas de rigor y fraternidad.
                </span>
                <button type="submit" className="btn-admin-primary text-xs !py-2 !px-4">
                  Publicar en el Muro
                </button>
              </div>
            </form>

            {/* Lista de Publicaciones del Muro */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 transition-all hover:border-sky-400/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                        <Image
                          src={post.avatar}
                          alt={post.author}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[var(--title-color)]">{post.author}</span>
                          <span className="badge-premium badge-royal-sapphire text-[10px] !py-0.5 !px-2">
                            {post.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-[var(--text-muted)]">{post.timestamp}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                      #{post.tag}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--text-dark)] leading-relaxed">
                    {post.content}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <span>❤️</span>
                      <span className="font-semibold">{post.likes}</span>
                    </button>
                    <Link href="/debates" className="text-sky-600 dark:text-sky-400 hover:underline">
                      Debatir en el Foro →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Lateral: Acciones Rápidas & Tratado Destacado */}
          <div className="lg:col-span-4 space-y-6">
            <TiltCard3D intensity={8} glare={true} style={{ borderRadius: 'var(--radius-lg)' }}>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-purple-950 text-white border border-purple-500/30 shadow-xl space-y-3">
                <span className="badge-premium badge-magenta-neon text-[10px]">
                  📖 Tratado Magistral de Fireboy
                </span>
                <h3 className="text-base font-bold text-white">La Fractura Posmoderna</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Crítica radical contra el relativismo nihilista y fundamentación ontológica de la resistencia provida.
                </p>
                <Link
                  href="/manifiestos/posmodernidad"
                  className="btn-admin-primary text-xs !py-2 !px-3 inline-block mt-2"
                >
                  Leer Tratado Completo →
                </Link>
              </div>
            </TiltCard3D>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-[var(--title-color)] uppercase tracking-wider">
                Recursos de Formación
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/manifiestos" className="text-sky-600 dark:text-sky-400 hover:underline block">
                    • Manifiestos Fundacionales BONTEN
                  </Link>
                </li>
                <li>
                  <Link href="/integrantes" className="text-sky-600 dark:text-sky-400 hover:underline block">
                    • Perfiles y Ensayos de la Mesa Directiva
                  </Link>
                </li>
                <li>
                  <Link href="/debates" className="text-sky-600 dark:text-sky-400 hover:underline block">
                    • Foro Dialéctico y Votación de Argumentos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña de Principios */}
      {activeTab === 'principios' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 space-y-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-[var(--title-color)]">
            Decálogo de la Resistencia Provida BONTEN
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-[var(--text-dark)] leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
              <strong className="text-sky-600 dark:text-sky-400 block mb-1">1. Inviolabilidad de la Vida Humana</strong>
              Toda vida humana posee dignidad ontológica intrínseca desde el instante de la fecundación hasta la muerte natural.
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
              <strong className="text-sky-600 dark:text-sky-400 block mb-1">2. Primacía de la Evidencia Biológica</strong>
              El embrión humano no es una hipótesis ni una masa indiferenciada: es un organismo completo de la especie Homo sapiens con su propio genoma único.
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
              <strong className="text-sky-600 dark:text-sky-400 block mb-1">3. Rigor Dialéctico sin Falacias</strong>
              En el debate público, respondemos a la provocación con lógica, a la mentira con datos y al sofisma con claridad moral.
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
              <strong className="text-sky-600 dark:text-sky-400 block mb-1">4. Fraternidad y Ayuda Integral</strong>
              No solo defendemos el derecho a nacer; apoyamos a la madre gestante y combatimos la cultura del descarte social.
            </div>
          </div>
        </div>
      )}

      {/* Pestaña de Directorio */}
      {activeTab === 'directorio' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 space-y-2">
            <span className="badge-premium badge-royal-sapphire text-[10px]">Fundador Soberano</span>
            <h3 className="text-base font-bold text-[var(--title-color)]">Fireboy</h3>
            <p className="text-xs text-[var(--text-muted)]">Dirección estratégica, apologética central y autor de los tratados de resistencia.</p>
            <Link href="/integrantes/fireboy" className="text-xs text-sky-600 dark:text-sky-400 font-semibold inline-block pt-1">
              Ver perfil y ensayos →
            </Link>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 space-y-2">
            <span className="badge-premium badge-radiant-emerald text-[10px]">Mesa Directiva</span>
            <h3 className="text-base font-bold text-[var(--title-color)]">Daniel</h3>
            <p className="text-xs text-[var(--text-muted)]">Coordinación de Bioética, fundamentación médica y ontología jurídica.</p>
            <Link href="/integrantes/daniel" className="text-xs text-sky-600 dark:text-sky-400 font-semibold inline-block pt-1">
              Ver perfil y ensayos →
            </Link>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 space-y-2">
            <span className="badge-premium badge-radiant-emerald text-[10px]">Mesa Directiva</span>
            <h3 className="text-base font-bold text-[var(--title-color)]">Mijail</h3>
            <p className="text-xs text-[var(--text-muted)]">Estrategia dialéctica, detección de falacias y apologética en redes.</p>
            <Link href="/integrantes/mijail" className="text-xs text-sky-600 dark:text-sky-400 font-semibold inline-block pt-1">
              Ver perfil y ensayos →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
