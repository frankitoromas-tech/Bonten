'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = height > 0 ? Math.min(100, Math.max(0, (winScroll / height) * 100)) : 0;
      setScrollProgress(pct);
      setIsVisible(winScroll > 260);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (
      typeof window !== 'undefined' &&
      (window as unknown as { bontenAudio?: { playChime: (x: number, y: number, f: number) => void } }).bontenAudio
    ) {
      (window as unknown as { bontenAudio: { playChime: (x: number, y: number, f: number) => void } }).bontenAudio.playChime(
        0.5,
        0.2,
        528
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const radius = 21;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * scrollProgress) / 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="back-to-top-wrapper"
          initial={{ opacity: 0, scale: 0.5, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 15 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <motion.button
            className="back-to-top visible"
            onClick={scrollToTop}
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.92 }}
            aria-label={`Subir al inicio (${Math.round(scrollProgress)}%)`}
            title={`Subir al inicio (${Math.round(scrollProgress)}%)`}
          >
            <svg className="progress-ring" viewBox="0 0 52 52">
              <circle
                className="progress-ring-bg"
                strokeWidth="2.5"
                fill="transparent"
                r={radius}
                cx="26"
                cy="26"
              />
              <circle
                className="progress-ring-indicator"
                stroke="url(#bontenProgressGradient)"
                strokeWidth="2.8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx="26"
                cy="26"
              />
              <defs>
                <linearGradient id="bontenProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
            </svg>
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="arrow-icon"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
