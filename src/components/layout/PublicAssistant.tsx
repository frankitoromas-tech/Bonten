'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PublicAssistant() {
  const triggerAudio = () => {
    if (
      typeof window !== 'undefined' &&
      (window as unknown as {
        bontenAudio?: {
          playToggle: () => void;
        };
      }).bontenAudio
    ) {
      (window as unknown as {
        bontenAudio: {
          playToggle: () => void;
        };
      }).bontenAudio.playToggle();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      <Link href="/wilfredo" onClick={triggerAudio} aria-label="Abrir Guía Doctrinal WILFREDO AI" title="Abrir Guía Doctrinal WILFREDO AI">
        <motion.div
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-2.5 h-10 px-3.5 sm:px-4 rounded-full backdrop-blur-2xl transition-all duration-300 cursor-pointer bg-[#060c1d]/85 hover:bg-[#0a1532]/95 border border-sky-500/30 hover:border-sky-400/60 text-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_15px_rgba(56,189,248,0.12)] hover:shadow-[0_6px_28px_rgba(56,189,248,0.28)]"
        >
          {/* Icono AI Sparkle 4-point Star con micro-resplandor */}
          <div className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              className="text-sky-400 group-hover:text-cyan-300 transition-colors duration-200"
              fill="currentColor"
            >
              <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
            </svg>
            <span className="absolute -inset-1 rounded-full bg-sky-400/20 blur-[2px] group-hover:bg-sky-400/40 transition-all" />
          </div>

          {/* Tipografía Ejecutiva & Micro-Badge de Wilfredo */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11.5px] font-bold tracking-wider text-slate-200 group-hover:text-white uppercase font-mono">
              WILFREDO
            </span>
            <span className="text-[9px] px-1 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-semibold border border-sky-400/30">
              AI
            </span>
          </div>

          {/* Beacon sutil de estado en vivo */}
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
        </motion.div>
      </Link>
    </div>
  );
}
