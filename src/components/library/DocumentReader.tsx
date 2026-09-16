'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { LibraryDocument } from '@/types';
import { getAuthorProfile } from '@/data/members';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';

function getAuthorSlug(author: string) {
  const lower = author.toLowerCase();
  if (lower.includes('fireboy')) return '/integrantes/fireboy';
  if (lower.includes('daniel')) return '/integrantes/daniel';
  if (lower.includes('mijail')) return '/integrantes/mijail';
  if (lower.includes('ilan') || lower.includes('ian')) return '/integrantes/ilan';
  if (lower.includes('ana')) return '/integrantes/ana';
  return '/integrantes';
}

interface DocumentReaderProps {
  document: LibraryDocument | null;
  onClose: () => void;
  autoPlayAudio?: boolean;
}

export default function DocumentReader({ document: doc, onClose, autoPlayAudio = false }: DocumentReaderProps) {
  const [fontSize, setFontSize] = useState(1.1); // en rem
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { showToast } = useToast();

  // Detener la reproducción de voz cuando se desmonta o cierra el modal
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (autoPlayAudio && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setTimeout(() => {
        if (!isPlayingAudio) {
          window.speechSynthesis.cancel();
          const plainText = `${doc?.title}. ${doc?.content.map((p) => p.replace(/<[^>]*>/g, '')).join('. ')}`;
          const utterance = new SpeechSynthesisUtterance(plainText);
          utterance.lang = 'es-ES';
          utterance.rate = 1.0;
          utterance.onend = () => setIsPlayingAudio(false);
          utterance.onerror = () => setIsPlayingAudio(false);
          window.speechSynthesis.speak(utterance);
          setIsPlayingAudio(true);
          showToast('Reproduciendo audio del manifiesto...', 'info');
        }
      }, 500);
    }
  }, [autoPlayAudio, doc]);

  // Cierre con Escape + bloqueo de scroll del fondo mientras el modal está abierto.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!doc) return null;

  const increaseFont = () => setFontSize((prev) => Math.min(prev + 0.1, 1.6));
  const decreaseFont = () => setFontSize((prev) => Math.max(prev - 0.1, 0.8));

  const handleCopy = () => {
    const fullText = `${doc.title}\n\n${doc.content.map((p) => p.replace(/<[^>]*>/g, '')).join('\n\n')}`;
    navigator.clipboard
      .writeText(fullText)
      .then(() => {
        setCopied(true);
        showToast('Cita copiada al portapapeles con éxito', 'success');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => showToast('No se pudo copiar la cita', 'warning'));
  };

  const toggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Tu navegador no soporta lectura por voz', 'warning');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      showToast('Audio pausado', 'info');
    } else {
      window.speechSynthesis.cancel();
      const plainText = `${doc.title}. ${doc.content.map((p) => p.replace(/<[^>]*>/g, '')).join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      showToast('Reproduciendo audio del manifiesto...', 'info');
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onClose();
  };

  return (
    <motion.div 
      className="modal-overlay" 
      onClick={handleClose} 
      role="dialog" 
      aria-modal="true" 
      aria-label={doc.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className="modal-close-btn" onClick={handleClose} aria-label="Cerrar modal" title="Cerrar lectura (Esc)">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <header className="document-reader-header">
          <div className="document-reader-meta">
            <span className="debate-tag">{doc.category}</span>
            {(() => {
              const authorProf = getAuthorProfile(doc.author);
              const authorSlug = getAuthorSlug(doc.author);
              return (
                <Link
                  href={authorSlug}
                  onClick={handleClose}
                  className="reader-author-badge flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                  title={`Ver perfil y escritos de ${doc.author}`}
                >
                  <span className="reader-author-avatar-wrap inline-block w-5 h-5 rounded-full overflow-hidden border border-white/20">
                    <Image
                      src={authorProf.avatar}
                      alt={doc.author}
                      width={20}
                      height={20}
                      className="w-full h-full object-cover"
                    />
                  </span>
                  <span>Por: <strong>{doc.author}</strong> ↗</span>
                </Link>
              );
            })()}
            <span>• {doc.readTime}</span>
          </div>
          <h2 className="document-reader-title">{doc.title}</h2>

          <div className="document-reader-controls">
            <button
              className="font-btn"
              onClick={toggleAudio}
              style={{ width: 'auto', padding: '0 0.8rem', gap: '0.4rem' }}
              title="Escuchar audio"
            >
              <span>{isPlayingAudio ? '⏸ Pausar Voz' : '🔊 Escuchar Audio'}</span>
            </button>
            <span className="font-size-label">Letra:</span>
            <button className="font-btn" onClick={decreaseFont} title="Disminuir letra" aria-label="Disminuir letra" disabled={fontSize <= 0.8}>
              A-
            </button>
            <button className="font-btn" onClick={increaseFont} title="Aumentar letra" aria-label="Aumentar letra" disabled={fontSize >= 1.6}>
              A+
            </button>
          </div>
        </header>

        <main className="document-reader-body" style={{ fontSize: `${fontSize}rem` }}>
          {doc.content.map((p, index) => {
            if (p.startsWith('<blockquote>')) {
              const cleanText = p.replace('<blockquote>', '').replace('</blockquote>', '');
              return <blockquote key={index} dangerouslySetInnerHTML={{ __html: cleanText }} />;
            }
            return <p key={index} dangerouslySetInnerHTML={{ __html: p }} />;
          })}
        </main>

        <footer className="document-reader-footer flex-wrap gap-2 justify-between">
          <div className="flex items-center gap-2">
            <button className="btn-outline" style={{ width: 'auto' }} onClick={handleCopy}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '0.4rem', verticalAlign: 'middle' }}>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              {copied ? '¡Copiado!' : 'Copiar Cita'}
            </button>

            {doc.id === 1 && (
              <Link
                href="/manifiestos/posmodernidad"
                onClick={handleClose}
                className="btn-outline text-xs !py-2 !px-3 font-semibold text-amber-400 hover:text-amber-300"
                style={{ width: 'auto' }}
              >
                Ver Ensayo Web Extenso →
              </Link>
            )}
          </div>

          <button className="btn-primary" style={{ width: 'auto' }} onClick={handleClose}>
            Cerrar Lectura (Esc)
          </button>
        </footer>
      </motion.div>
    </motion.div>
  );
}
