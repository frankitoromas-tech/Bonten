'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MANIFIESTOS } from '@/data/manifiestos';
import { DOCUMENTS } from '@/data/library';
import { INITIAL_DEBATES } from '@/data/debates';
import { getAllLeaders } from '@/data/members';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  url: string;
  icon: string;
}

export default function QuickSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Escuchar atajo de teclado Ctrl+K o Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Bloqueo de scroll cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [open]);

  // Recopilar todos los resultados
  const allResults: SearchResult[] = [
    ...MANIFIESTOS.map((m) => ({
      id: `m-${m.slug}`,
      title: m.title,
      category: 'Manifiesto',
      url: `/manifiestos/${m.slug}`,
      icon: '📜',
    })),
    ...DOCUMENTS.map((d) => ({
      id: `doc-${d.id}`,
      title: d.title,
      category: 'Biblioteca',
      url: '/',
      icon: '📚',
    })),
    ...INITIAL_DEBATES.map((d) => ({
      id: `deb-${d.id}`,
      title: d.title,
      category: 'Debate',
      url: '/debates',
      icon: '💬',
    })),
    ...getAllLeaders().map((l) => ({
      id: `mem-${l.slug}`,
      title: `${l.name} (${l.role})`,
      category: 'Integrante',
      url: `/integrantes/${l.slug}`,
      icon: '👤',
    })),
    ...getAllLeaders()
      .filter((l) => l.publication)
      .map((l) => ({
        id: `pub-${l.slug}`,
        title: `${l.publication!.title} — ${l.name}`,
        category: 'Ensayo / Disquisición',
        url: `/integrantes/${l.slug}`,
        icon: '✍️',
      })),
  ];

  const filtered = query.trim() === ''
    ? allResults.slice(0, 5)
    : allResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="modal-overlay"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 2500 }}
          >
            <motion.div
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ maxWidth: '600px', padding: 0, overflow: 'hidden' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.4rem',
                  borderBottom: '1px solid var(--border-color)',
                  gap: '0.8rem',
                  background: 'var(--bg-base)',
                }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" style={{ color: 'var(--text-muted)' }}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar manifiestos, debates, integrantes... (Esc para cerrar)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-dark)',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                  }}
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.6rem',
                    background: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                  }}
                >
                  ESC
                </span>
              </div>

              <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '0.8rem' }}>
                {filtered.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No se encontraron resultados para &quot;{query}&quot;
                  </p>
                ) : (
                  filtered.map((item) => (
                    <motion.div
                      key={item.id}
                      onClick={() => handleSelect(item.url)}
                      whileHover={{ x: 4, background: 'rgba(217, 70, 239, 0.12)' }}
                      style={{
                        padding: '0.9rem 1.2rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.98rem' }}>
                          {item.title}
                        </span>
                      </div>
                      <span className="debate-tag">{item.category}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
