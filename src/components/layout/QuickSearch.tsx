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
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const CATEGORIES = ['Todos', 'Manifiesto', 'Integrante', 'Debate', 'Biblioteca'];

  // Escuchar atajo de teclado Ctrl+K o Cmd+K y navegación dentro del modal
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
      setSelectedIndex(0);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedCategory('Todos');
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

  const filtered = allResults.filter((r) => {
    const matchesCategory =
      selectedCategory === 'Todos' ||
      r.category.toLowerCase().includes(selectedCategory.toLowerCase());
    if (!matchesCategory) return false;

    if (query.trim() === '') return true;
    const q = query.toLowerCase();
    return r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
  }).slice(0, 8);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex].url);
    }
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
              className="modal-container search-palette-container"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1.1rem 1.4rem',
                  borderBottom: '1px solid var(--border-color)',
                  gap: '0.8rem',
                  background: 'var(--bg-base)',
                }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.2" fill="none" style={{ color: 'var(--accent-pink)' }}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar manifiestos, debates, integrantes..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleInputKeyDown}
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

              {/* Categorías de filtro rápido */}
              <div className="search-category-chips">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`search-chip ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedIndex(0);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.6rem 0.8rem' }}>
                {filtered.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem 1rem' }}>
                    No se encontraron resultados para &quot;{query}&quot;
                  </p>
                ) : (
                  filtered.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <motion.div
                        key={item.id}
                        onClick={() => handleSelect(item.url)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`search-result-item ${isSelected ? 'selected' : ''}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0 }}>
                          <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.96rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.title}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                          <span className="debate-tag">{item.category}</span>
                          {isSelected && (
                            <span className="search-enter-hint">↵ Abrir</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              <div className="search-palette-footer">
                <span>Usa <kbd>↑</kbd> <kbd>↓</kbd> para navegar</span>
                <span><kbd>Enter</kbd> para seleccionar</span>
                <span><kbd>Esc</kbd> para cerrar</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
