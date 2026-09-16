'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DocumentReader from './DocumentReader';
import { DOCUMENTS } from '@/data/library';
import { getAuthorProfile } from '@/data/members';
import type { LibraryDocument } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Todas',
  'Posmodernidad & Filosofía',
  'Bioética Provida',
  'Doctrina',
  'Filosofía Clásica',
  'Teología',
] as const;

export default function Library() {
  const [selectedDoc, setSelectedDoc] = useState<LibraryDocument | null>(null);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const playAudioPop = () => {
    if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playTactilePop: () => void } }).bontenAudio) {
      (window as unknown as { bontenAudio: { playTactilePop: () => void } }).bontenAudio.playTactilePop();
    }
  };

  // Filtrado reactivo en tiempo real
  const filteredDocs = useMemo(() => {
    return DOCUMENTS.filter((doc) => {
      const matchesCategory = activeCategory === 'Todas' || doc.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesSearch =
        doc.title.toLowerCase().includes(query) ||
        doc.author.toLowerCase().includes(query) ||
        doc.category.toLowerCase().includes(query) ||
        (doc.excerpt && doc.excerpt.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Contadores por categoría
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todas: DOCUMENTS.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'Todas') {
        counts[cat] = DOCUMENTS.filter((d) => d.category === cat).length;
      }
    });
    return counts;
  }, []);

  const featuredDoc = DOCUMENTS.find((d) => d.featured) || DOCUMENTS[0];

  return (
    <section className="library-section" id="biblioteca-seccion">
      {/* Encabezado Editorial con KPIs y Atmósfera de Santuario Archival */}
      <div className="library-header-cluster">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2.5 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
              Archivo Doctrinal & Filosófico
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-white/5 border border-slate-300/60 dark:border-white/10">
              {DOCUMENTS.length} Tratados Disponibles
            </span>
          </div>

          <h2 className="section-title" style={{ color: 'var(--title-color)', textAlign: 'left', marginBottom: '0.6rem' }}>
            Biblioteca y Tratados Doctrinales
          </h2>
          <p className="library-subtitle">
            Tratados de bioética, filosofía clásica, teología y análisis crítico contra el relativismo posmoderno. Una recopilación documental custodiada para el debate razonado y la defensa incondicional de la vida.
          </p>
        </motion.div>
      </div>

      {/* Tratado Insignia (Hero Showcase de Fireboy) */}
      {featuredDoc && activeCategory === 'Todas' && !searchQuery && (
        <motion.article
          className="library-featured-banner"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="featured-backdrop" style={{ backgroundImage: `url("${featuredDoc.image}")` }} />
          <div className="featured-content">
            <div className="featured-meta-bar">
              <span className="featured-badge-fire">Tratado Destacado • Obra Cumbre</span>
              <span className="featured-pill-time">⏱️ {featuredDoc.readTime} de lectura</span>
              {featuredDoc.isReferential && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-wider border border-slate-700">Referencial</span>}
            </div>
            <h3 className="featured-title">{featuredDoc.title}</h3>
            <p className="featured-excerpt">{featuredDoc.excerpt}</p>
            {(() => {
              const profile = getAuthorProfile(featuredDoc.author);
              return (
                <Link
                  href="/integrantes/fireboy"
                  className="featured-author-row group/author hover:opacity-95 transition-opacity"
                  title="Ver perfil oficial y corpus de Fireboy"
                >
                  <div className="featured-author-avatar-wrap">
                    <Image
                      src={profile.avatar}
                      alt={featuredDoc.author}
                      width={44}
                      height={44}
                      className="featured-author-img"
                    />
                  </div>
                  <div>
                    <strong className="featured-author-name group-hover/author:text-amber-300 transition-colors flex items-center gap-1.5">
                      <span>{featuredDoc.author}</span>
                      <span className="text-[10px] font-mono font-normal text-amber-400">Ver Perfil →</span>
                    </strong>
                    <span className="featured-author-desc">{profile.role}</span>
                  </div>
                </Link>
              );
            })()}
            <div className="featured-actions">
              <button
                className="featured-btn-primary"
                onClick={() => {
                  playAudioPop();
                  setAutoPlayAudio(true);
                  setSelectedDoc(featuredDoc);
                }}
              >
                <span>Lectura Inmersiva</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                </svg>
              </button>
              <Link
                href="/manifiestos/posmodernidad"
                className="featured-btn-secondary"
                onClick={playAudioPop}
              >
                <span>Leer Ensayo Completo</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href="/integrantes/fireboy"
                className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                onClick={playAudioPop}
              >
                <span>Corpus de Fireboy</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </motion.article>
      )}

      {/* Barra de Herramientas Editorial: Buscador & Categorías */}
      <div className="library-toolbar">
        <div className="library-search-wrap">
          <svg className="library-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="library-search-input"
            placeholder="Buscar por título, autor, concepto o palabra clave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="library-search-clear"
              onClick={() => {
                playAudioPop();
                setSearchQuery('');
              }}
              title="Borrar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {/* Chips de Categoría */}
        <div className="library-categories-scroll">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                className={`library-cat-chip ${isActive ? 'active' : ''}`}
                onClick={() => {
                  playAudioPop();
                  setActiveCategory(cat);
                }}
              >
                <span>{cat}</span>
                <span className="library-chip-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resumen de resultados */}
      <div className="library-results-bar">
        <span>Mostrando <strong>{filteredDocs.length}</strong> de {DOCUMENTS.length} tratados filosóficos</span>
        {activeCategory !== 'Todas' && (
          <button
            className="library-reset-filter"
            onClick={() => {
              playAudioPop();
              setActiveCategory('Todas');
            }}
          >
            Ver todos los temas ×
          </button>
        )}
      </div>

      {/* Grid de Tarjetas de Tratados */}
      {filteredDocs.length > 0 ? (
        <div className="library-cards-grid">
          {filteredDocs.map((doc, idx) => (
            <motion.article
              key={doc.id}
              className="editorial-doc-card"
              onClick={() => {
                playAudioPop();
                setAutoPlayAudio(false);
                setSelectedDoc(doc);
              }}
              role="button"
              tabIndex={0}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              whileHover={{ y: -6 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  playAudioPop();
                  setAutoPlayAudio(false);
                  setSelectedDoc(doc);
                }
              }}
              aria-label={`Leer tratado: ${doc.title}`}
            >
              {/* Portada de Imagen con Metadatos Claros */}
              <div
                className="doc-cover-wrapper"
                style={{ backgroundImage: `url("${doc.image}")` }}
              >
                <div className="doc-cover-overlay" />
                <div className="doc-cover-badges">
                  <span className="doc-cat-badge">{doc.category}</span>
                  <span className="doc-time-badge">{doc.readTime}</span>
                  {doc.isReferential && <span className="doc-cat-badge !bg-slate-800/80 !text-slate-300 !border-slate-600/50">Referencial</span>}
                </div>
              </div>

              {/* Cuerpo del Documento */}
              <div className="doc-card-body">
                <h3 className="doc-card-title">{doc.title}</h3>
                
                {(() => {
                  const cardProfile = getAuthorProfile(doc.author);
                  return (
                    <div className="doc-author-line">
                      <div className="doc-author-mini-avatar">
                        <Image
                          src={cardProfile.avatar}
                          alt={doc.author}
                          width={22}
                          height={22}
                          className="doc-author-mini-img"
                        />
                      </div>
                      <span className="doc-author-name">{doc.author}</span>
                    </div>
                  );
                })()}

                <p className="doc-card-excerpt">
                  {doc.excerpt || 'Disquisición doctrinal y filosófica archivada en el corpus oficial de la resistencia BONTEN.'}
                </p>

                <div className="doc-card-footer">
                  <span className="doc-read-cta">
                    <span>Leer Tratado</span>
                    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="library-empty-state">
          <div className="empty-state-icon">📖</div>
          <h3>No se hallaron tratados con ese criterio</h3>
          <p>Prueba buscando con otros términos o restablece la categoría seleccionada.</p>
          <button
            className="empty-state-btn"
            onClick={() => {
              playAudioPop();
              setSearchQuery('');
              setActiveCategory('Todas');
            }}
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* Lector Modal Inmersivo */}
      <AnimatePresence>
        {selectedDoc && (
          <DocumentReader
            document={selectedDoc}
            autoPlayAudio={autoPlayAudio}
            onClose={() => {
              setSelectedDoc(null);
              setAutoPlayAudio(false);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
