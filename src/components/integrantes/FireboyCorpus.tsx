'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Member, Leader } from '@/types';
import { MEMBER_PUBLICATIONS } from '@/data/publications';
import { DOCUMENTS } from '@/data/library';
import { useToast } from '@/components/ui/Toast';

interface FireboyCorpusProps {
  member: Leader;
}

export default function FireboyCorpus({ member }: FireboyCorpusProps) {
  const [activeTab, setActiveTab] = useState<'insignia' | 'apologetica' | 'biblioteca' | 'manifiesto'>('insignia');
  const [isLarge, setIsLarge] = useState(false);
  const { showToast } = useToast();

  const pubFireboy = MEMBER_PUBLICATIONS.fireboy;
  const docPosmodernidad = DOCUMENTS[0]; // Crítica a la Posmodernidad y la Cultura de la Muerte
  const docManifiesto = DOCUMENTS[1]; // Manifiesto de Resistencia NG

  const handleCopyQuote = (quoteText: string, source: string) => {
    const cleanText = quoteText.replace(/<[^>]*>/g, '').trim();
    navigator.clipboard.writeText(`"${cleanText}" — ${source} (Fireboy • BONTEN)`);
    showToast('¡Cita copiada al portapapeles con atribución oficial!', 'success');
  };

  return (
    <section className="mt-8 space-y-6">
      {/* Encabezado del Corpus Editorial */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0a1226]/95 to-slate-950 border border-amber-500/30 shadow-[0_10px_40px_-15px_rgba(245,158,11,0.2)] backdrop-blur-2xl relative overflow-hidden">
        {/* Glow Superior */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40">
                🔥 Corpus Editorial & Tratados Canónicos
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-slate-400 bg-slate-800/60 border border-slate-700/60">
                4 Obras Catalogadas
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Escritos & Pensamiento de Fireboy
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Archivo completo y ordenado de los tratados filosóficos, ensayos apologéticos y manifiestos ontológicos redactados por el Líder Fundador de BONTEN.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Link
              href="/manifiestos/posmodernidad"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02]"
            >
              <span>Ver Tratado Cumbre Web</span>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Pestañas de Navegación del Corpus */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          {[
            { id: 'insignia', label: '📜 1. La Fractura Posmoderna', tag: 'Obra Cumbre (12 min)' },
            { id: 'apologetica', label: '⚔️ 2. Resistencia Intelectual', tag: 'Ensayo (4 min)' },
            { id: 'biblioteca', label: '🏛️ 3. Cultura de la Muerte', tag: 'Biblioteca #1' },
            { id: 'manifiesto', label: '🛡️ 4. Manifiesto de Resistencia NG', tag: 'Doctrina (5 min)' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-200 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800/70 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-amber-400/30 text-amber-100' : 'bg-slate-800 text-slate-500'}`}>
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido Dinámico según la Pestaña Seleccionada */}
      <AnimatePresence mode="wait">
        {/* PESTAÑA 1: OBRA CUMBRE (LA FRACTURA POSMODERNA) */}
        {activeTab === 'insignia' && (
          <motion.div
            key="insignia"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl bg-slate-900/75 border border-amber-500/25 shadow-xl backdrop-blur-xl relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="relative w-full lg:w-72 h-48 sm:h-56 rounded-2xl overflow-hidden border border-amber-400/30 shrink-0">
                <Image
                  src="/assets/hero_bg_1781465357241.webp"
                  alt="La Fractura Posmoderna"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                  Tratado Magno BONTEN
                </span>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-400/30">
                    Posmodernidad & Filosofía del Ser
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    12 min de lectura • Nivel Avanzado
                  </span>
                  <span className="text-xs text-slate-500">• Edición Canónica 2026</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  La Fractura Posmoderna: Deconstrucción del Nihilismo y Reivindicación de la Dignidad Humana
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  En esta investigación cumbre, <strong>Fireboy</strong> emprende una deconstrucción ontológica de la patología espiritual contemporánea: el declive de los metarrelatos, la ilusión de la autonomía hedonista desprovista de telos y la reducción del ser humano a mercancía biopolítica descartable.
                </p>

                {/* Cita Insignia */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border-l-4 border-amber-400 text-slate-200 text-xs sm:text-sm italic leading-relaxed relative">
                  <p>
                    &ldquo;El no nacido representa la máxima encarnación de la inocencia y el escándalo supremo para una sociedad utilitarista: existe sin consumir, interpela sin hablar y exige amor incondicional sin contraprestación pragmática.&rdquo;
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] not-italic">
                    <span className="text-amber-300 font-bold font-mono">— Fireboy, Tesis IV</span>
                    <button
                      type="button"
                      onClick={() => handleCopyQuote('El no nacido representa la máxima encarnación de la inocencia y el escándalo supremo para una sociedad utilitarista: existe sin consumir, interpela sin hablar y exige amor incondicional sin contraprestación pragmática.', 'La Fractura Posmoderna')}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>Copiar Cita</span>
                    </button>
                  </div>
                </div>

                {/* Tesis Cardinales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <strong className="text-amber-300 block mb-1">I. El Hombre sin Telos</strong>
                    <span className="text-slate-400">La renuncia a la trascendencia deja a la libertad vacía y cautiva de la pulsión mercantil.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <strong className="text-amber-300 block mb-1">II. El Escándalo del Concebido</strong>
                    <span className="text-slate-400">La defensa incondicional de la vida humana como límite irreductible frente a la tiranía del más fuerte.</span>
                  </div>
                </div>

                <div className="pt-3 flex items-center gap-3 flex-wrap">
                  <Link
                    href="/manifiestos/posmodernidad"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all duration-200"
                  >
                    <span>Leer Tratado Completo en Alta Densidad</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>

                  <a
                    href="#biblioteca-seccion"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-all"
                  >
                    <span>Ver en Biblioteca Doctrinal</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PESTAÑA 2: RESISTENCIA INTELECTUAL (APOLOGÉTICA) */}
        {activeTab === 'apologetica' && (
          <motion.div
            key="apologetica"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl bg-slate-900/75 border border-sky-500/25 shadow-xl backdrop-blur-xl space-y-5"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-300 border border-sky-400/30">
                  {pubFireboy.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {pubFireboy.date} • {pubFireboy.readTime}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsLarge(!isLarge)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                {isLarge ? 'A- Normal' : 'A+ Grande'}
              </button>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {pubFireboy.title}
              </h3>
              {pubFireboy.subtitle && (
                <h4 className="text-sm font-semibold text-sky-400 mb-3">
                  {pubFireboy.subtitle}
                </h4>
              )}
              {pubFireboy.summary && (
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed italic border-l-2 border-sky-500 pl-3">
                  {pubFireboy.summary}
                </p>
              )}
            </div>

            <div className={`space-y-4 text-slate-200 leading-relaxed ${isLarge ? 'text-base' : 'text-sm'}`}>
              {pubFireboy.paragraphs.map((p, idx) => {
                if (p.startsWith('<blockquote>')) {
                  const clean = p.replace('<blockquote>', '').replace('</blockquote>', '');
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 my-3">
                      <blockquote className="italic text-sky-200 text-sm sm:text-base mb-2">
                        &ldquo;{clean}&rdquo;
                      </blockquote>
                      <div className="flex items-center justify-between text-xs not-italic">
                        <span className="text-sky-400 font-mono font-bold">— Fireboy</span>
                        <button
                          type="button"
                          onClick={() => handleCopyQuote(clean, pubFireboy.title)}
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-sky-300 transition-colors cursor-pointer"
                        >
                          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <span>Copiar Cita</span>
                        </button>
                      </div>
                    </div>
                  );
                }
                return <p key={idx}>{p}</p>;
              })}
            </div>
          </motion.div>
        )}

        {/* PESTAÑA 3: CULTURA DE LA MUERTE (BIBLIOTECA #1) */}
        {activeTab === 'biblioteca' && (
          <motion.div
            key="biblioteca"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl bg-slate-900/75 border border-purple-500/25 shadow-xl backdrop-blur-xl space-y-5"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-400/30">
                  {docPosmodernidad.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Tratado #001 en Biblioteca • {docPosmodernidad.readTime} • Nivel: {docPosmodernidad.level}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsLarge(!isLarge)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                {isLarge ? 'A- Normal' : 'A+ Grande'}
              </button>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {docPosmodernidad.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed italic border-l-2 border-purple-500 pl-3">
                {docPosmodernidad.excerpt}
              </p>
            </div>

            <div className={`space-y-4 text-slate-200 leading-relaxed ${isLarge ? 'text-base' : 'text-sm'}`}>
              {docPosmodernidad.content.map((p, idx) => {
                if (p.startsWith('<blockquote>')) {
                  const clean = p.replace('<blockquote>', '').replace('</blockquote>', '');
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 my-3">
                      <blockquote
                        className="italic text-purple-200 text-sm sm:text-base mb-2"
                        dangerouslySetInnerHTML={{ __html: clean }}
                      />
                      <div className="flex items-center justify-between text-xs not-italic">
                        <span className="text-purple-400 font-mono font-bold">— Fireboy (Biblioteca BONTEN)</span>
                        <button
                          type="button"
                          onClick={() => handleCopyQuote(clean, docPosmodernidad.title)}
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
                        >
                          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <span>Copiar Cita</span>
                        </button>
                      </div>
                    </div>
                  );
                }
                return <p key={idx} dangerouslySetInnerHTML={{ __html: p }} />;
              })}
            </div>

            <div className="pt-3">
              <Link
                href="/manifiestos/posmodernidad"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <span>Acceder a la Edición Ampliada en Manifiestos</span>
                <span>→</span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* PESTAÑA 4: MANIFIESTO DE RESISTENCIA NG */}
        {activeTab === 'manifiesto' && (
          <motion.div
            key="manifiesto"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl bg-slate-900/75 border border-emerald-500/25 shadow-xl backdrop-blur-xl space-y-5"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                  {docManifiesto.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {docManifiesto.author} • {docManifiesto.readTime}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsLarge(!isLarge)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                {isLarge ? 'A- Normal' : 'A+ Grande'}
              </button>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {docManifiesto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
                {docManifiesto.excerpt}
              </p>
            </div>

            <div className={`space-y-4 text-slate-200 leading-relaxed ${isLarge ? 'text-base' : 'text-sm'}`}>
              {docManifiesto.content.map((p, idx) => {
                if (p.startsWith('<blockquote>')) {
                  const clean = p.replace('<blockquote>', '').replace('</blockquote>', '');
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 my-3">
                      <blockquote
                        className="italic text-emerald-200 text-sm sm:text-base mb-2"
                        dangerouslySetInnerHTML={{ __html: clean }}
                      />
                      <div className="flex items-center justify-between text-xs not-italic">
                        <span className="text-emerald-400 font-mono font-bold">— Presidencia BONTEN (Fireboy)</span>
                        <button
                          type="button"
                          onClick={() => handleCopyQuote(clean, docManifiesto.title)}
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
                        >
                          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <span>Copiar Cita</span>
                        </button>
                      </div>
                    </div>
                  );
                }
                return <p key={idx} dangerouslySetInnerHTML={{ __html: p }} />;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redes Oficiales y Presencia de Fireboy */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400/40 shrink-0">
            <Image
              src="/assets/fireboy_dorsal_7.webp"
              alt="Fireboy"
              width={40}
              height={40}
              className="object-cover object-top w-full h-full"
            />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Canales de Filosofía & Pensamiento de Fireboy
            </h4>
            <p className="text-[11px] text-slate-400">
              Sigue las disertaciones en vivo y los análisis apologéticos en redes oficiales.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {member.tiktok && (
            <a
              href={member.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
            >
              <span>TikTok: @fireboyphilosophy</span>
              <span>↗</span>
            </a>
          )}
          {member.youtube && (
            <a
              href={member.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white text-xs font-semibold transition-all border border-red-500/30 flex items-center gap-1.5"
            >
              <span>YouTube</span>
              <span>↗</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
