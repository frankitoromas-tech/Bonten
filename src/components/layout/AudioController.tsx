'use client';
import React, { useState, useEffect } from 'react';

// Generador de audio sintetizado con Web Audio API (0 assets requeridos)
class SoundFX {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  playChime(freq = 520, duration = 0.12) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignorar de forma segura si el navegador bloquea audio sin interacción
    }
  }
}

const sfx = new SoundFX();

export default function AudioController() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('.nav-link') || target.closest('.quick-hub-card')) {
        sfx.playChime(580, 0.1);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [enabled]);

  const toggleSound = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) {
      sfx.playChime(660, 0.15);
    }
  };

  return (
    <div className="audio-controller-wrapper">
      <button
        onClick={toggleSound}
        className={`audio-toggle-btn ${enabled ? 'active' : ''}`}
        aria-label={enabled ? 'Desactivar efectos de sonido hápticos' : 'Activar efectos de sonido hápticos'}
        title={enabled ? 'Efectos de sonido 3D activos (clic para silenciar)' : 'Activar experiencia de audio háptico 3D'}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {enabled ? (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </>
          ) : (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          )}
        </svg>
        <span className="audio-toggle-label">{enabled ? 'Audio 3D' : 'Mute'}</span>
      </button>
    </div>
  );
}
