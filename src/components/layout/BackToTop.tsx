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
      const pct = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(pct);
      setIsVisible(winScroll > 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * scrollProgress) / 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="back-to-top-wrapper"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="back-to-top visible"
            onClick={scrollToTop}
            aria-label={`Volver arriba (${Math.round(scrollProgress)}%)`}
            title={`Volver arriba (${Math.round(scrollProgress)}%)`}
          >
            <svg className="progress-ring" width="52" height="52" viewBox="0 0 52 52">
              <circle
                className="progress-ring-bg"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="3"
                fill="transparent"
                r={radius}
                cx="26"
                cy="26"
              />
              <circle
                className="progress-ring-indicator"
                stroke="url(#bontenProgressGradient)"
                strokeWidth="3"
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
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
            </svg>
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" className="arrow-icon">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
