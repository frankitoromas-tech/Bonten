'use client';
import React, { useState } from 'react';
import DocumentReader from './DocumentReader';
import { DOCUMENTS } from '@/data/library';
import type { LibraryDocument } from '@/types';

export default function Library() {
  const [selectedDoc, setSelectedDoc] = useState<LibraryDocument | null>(null);

  return (
    <section className="library-section">
      <h2 className="section-title" style={{ color: 'var(--title-color)' }}>
        BIBLIOTECA
      </h2>
      <div className="carousel-layout">
        <div className="cards-grid">
          {DOCUMENTS.map((doc) => (
            <article
              key={doc.id}
              className="library-card"
              onClick={() => setSelectedDoc(doc)}
              role="button"
              tabIndex={0}
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
            </article>
          ))}
        </div>

        <button className="action-arrow" aria-label="Abrir primer documento" onClick={() => setSelectedDoc(DOCUMENTS[0])}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {selectedDoc && <DocumentReader document={selectedDoc} onClose={() => setSelectedDoc(null)} />}
    </section>
  );
}
