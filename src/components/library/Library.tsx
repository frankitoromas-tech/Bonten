'use client';
import React, { useState } from 'react';
import DocumentReader from './DocumentReader';
import { DOCUMENTS } from '@/data/library';
import type { LibraryDocument } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function Library() {
  const [selectedDoc, setSelectedDoc] = useState<LibraryDocument | null>(null);

  return (
    <section className="library-section" id="biblioteca-seccion">
      <motion.h2 
        className="section-title" 
        style={{ color: 'var(--title-color)' }}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        BIBLIOTECA
      </motion.h2>
      <div className="carousel-layout">
        <div className="cards-grid">
          {DOCUMENTS.map((doc, idx) => (
            <motion.article
              key={doc.id}
              className="library-card"
              onClick={() => setSelectedDoc(doc)}
              role="button"
              tabIndex={0}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedDoc(doc);
                }
              }}
              aria-label={`Leer: ${doc.title}`}
            >
              <div
                className="card-image-wrapper"
                style={{ height: '140px', backgroundImage: `url("${doc.image}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div
                className="card-header"
                style={{ height: '60px', padding: '0 1rem', fontSize: '1rem', textAlign: 'center', lineHeight: '1.2' }}
              >
                {doc.title.length > 40 ? doc.title.substring(0, 38) + '...' : doc.title}
              </div>
              <div className="card-body">
                <span className="debate-tag" style={{ alignSelf: 'flex-start' }}>
                  {doc.category}
                </span>
                <div className="mock-line" style={{ marginTop: '0.5rem' }} />
                <div className="mock-line short" />
              </div>
            </motion.article>
          ))}
        </div>

        <motion.button 
          className="action-arrow" 
          aria-label="Abrir primer documento" 
          onClick={() => setSelectedDoc(DOCUMENTS[0])}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {selectedDoc && <DocumentReader document={selectedDoc} onClose={() => setSelectedDoc(null)} />}
      </AnimatePresence>
    </section>
  );
}

