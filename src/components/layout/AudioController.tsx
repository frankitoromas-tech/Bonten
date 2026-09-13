'use client';
import React, { useState, useEffect, useRef } from 'react';

// =======================================================================
//  MOTOR DE AUDIO NEURO-ACÚSTICO 3D (Web Audio API & Psicoacústica Áurea)
//  Afinación pitagórica 432 Hz / 528 Hz, paneo biaural 3D (X/Y) y ASMR táctil.
// =======================================================================
class NeuroAudioEngine {
  private ctx: AudioContext | null = null;

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /** Chime celestial neuro-agradable con paneo 3D biaural (X: Estéreo, Y: Elevación acústica) */
  playChime(panX = 0, panY = 0.5, fundamental = 432) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const oscSparkle = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      // Paneo espacial 3D X (-0.85 a +0.85)
      let nodeOut: AudioNode = gain;
      if (ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-0.85, Math.min(0.85, panX)), now);
        gain.connect(panner);
        nodeOut = panner;
      }

      // Elevación acústica 3D Y: modula la calidez/aire del filtro pasabajos
      const cutoff = 1300 + (1 - Math.max(0, Math.min(1, panY))) * 900;
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(cutoff, now);
      filter.Q.setValueAtTime(1.1, now);

      // Fundamental áurea (432Hz o 528Hz)
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(fundamental, now);

      // Quinta armónica perfecta (1.5x)
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(fundamental * 1.5, now);

      // Brillo áureo armónico (2.0x) con desvanecimiento ultra-rápido
      oscSparkle.type = 'sine';
      oscSparkle.frequency.setValueAtTime(fundamental * 2.0, now);

      const gainSparkle = ctx.createGain();
      gainSparkle.gain.setValueAtTime(0.012, now);
      gainSparkle.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
      oscSparkle.connect(gainSparkle);
      gainSparkle.connect(filter);

      // Envolvente aterciopelada (Ataque 14ms libre de clics, decaimiento exponencial 220ms)
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.032, now + 0.014);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      nodeOut.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      oscSparkle.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
      oscSparkle.stop(now + 0.1);
    } catch {
      // Silencioso
    }
  }

  /** Pop táctil aterciopelado tipo interruptor ASMR (con sub-frecuencia cálida) */
  playTactilePop(panX = 0) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Sub-cuerpo cálido (85Hz a 42Hz)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      const subFilter = ctx.createBiquadFilter();

      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(450, now);

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(95, now);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

      subGain.gain.setValueAtTime(0.045, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      subOsc.connect(subFilter);
      subFilter.connect(subGain);

      // Pop táctil de gota de cristal (310Hz a 150Hz)
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(320, now);
      clickOsc.frequency.exponentialRampToValueAtTime(140, now + 0.045);

      clickGain.gain.setValueAtTime(0.03, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      clickOsc.connect(clickGain);

      let panner: StereoPannerNode | null = null;
      if (ctx.createStereoPanner) {
        panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-0.8, Math.min(0.8, panX)), now);
        subGain.connect(panner);
        clickGain.connect(panner);
        panner.connect(ctx.destination);
      } else {
        subGain.connect(ctx.destination);
        clickGain.connect(ctx.destination);
      }

      subOsc.start(now);
      clickOsc.start(now);
      subOsc.stop(now + 0.08);
      clickOsc.stop(now + 0.06);
    } catch {
      // Silencioso
    }
  }

  /** Triada Áurea Ascendente (Confirmación de Éxito / Guardado: 432Hz -> 540Hz -> 648Hz) */
  playSuccess(panX = 0) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [432, 540, 648]; // Do, Mi, Sol en afinación 432 Hz
      const panOffsets = [-0.2, 0.0, 0.2];

      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.065;
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, noteTime);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(0.035, noteTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.22);

        osc.connect(filter);
        filter.connect(gain);

        if (ctx.createStereoPanner) {
          const panner = ctx.createStereoPanner();
          const targetPan = Math.max(-0.8, Math.min(0.8, panX + panOffsets[idx]));
          panner.pan.setValueAtTime(targetPan, noteTime);
          gain.connect(panner);
          panner.connect(ctx.destination);
        } else {
          gain.connect(ctx.destination);
        }

        osc.start(noteTime);
        osc.stop(noteTime + 0.23);
      });
    } catch {
      // Silencioso
    }
  }

  /** Pulso de fase biaural al alternar modo Claro/Oscuro */
  playToggle(panX = 0) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const gain = ctx.createGain();

      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(432, now);
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(442, now); // 10Hz ritmo alfa de enfoque

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      oscL.connect(gain);
      oscR.connect(gain);
      gain.connect(ctx.destination);

      oscL.start(now);
      oscR.start(now);
      oscL.stop(now + 0.17);
      oscR.stop(now + 0.17);
    } catch {
      // Silencioso
    }
  }
}

const neuroAudio = new NeuroAudioEngine();

export default function AudioController() {
  const [enabled, setEnabled] = useState(true);
  const lastHoverRef = useRef<number>(0);

  // Sincronizar estado inicial desde localStorage (encendido por defecto)
  useEffect(() => {
    const saved = localStorage.getItem('bonten:sound');
    if (saved !== null) {
      setEnabled(saved === 'true');
    } else {
      localStorage.setItem('bonten:sound', 'true');
      setEnabled(true);
    }

    const unlockAudio = () => {
      neuroAudio.getContext();
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Registro del despachador global window.bontenAudio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { bontenAudio: unknown }).bontenAudio = {
        playChime: (panX = 0, panY = 0.5, freq = 432) => {
          if (enabled) neuroAudio.playChime(panX, panY, freq);
        },
        playTactilePop: (panX = 0) => {
          if (enabled) neuroAudio.playTactilePop(panX);
        },
        playSuccess: (panX = 0) => {
          if (enabled) neuroAudio.playSuccess(panX);
        },
        playToggle: (panX = 0) => {
          if (enabled) neuroAudio.playToggle(panX);
        },
        isEnabled: () => enabled,
      };
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.interactive-card') ||
        target.closest('.admin-card') ||
        target.closest('.quick-action-chip')
      ) {
        const panX = (e.clientX / window.innerWidth) * 2 - 1;
        neuroAudio.playTactilePop(panX);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastHoverRef.current < 110) return; // Throttle neuro-agradable
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.debate-card') ||
        target.closest('.leader-card') ||
        target.closest('.admin-tab-btn') ||
        target.closest('.quick-action-chip')
      ) {
        lastHoverRef.current = now;
        const panX = (e.clientX / window.innerWidth) * 2 - 1;
        const panY = e.clientY / window.innerHeight;
        neuroAudio.playChime(panX, panY, 432);
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [enabled]);

  const toggleSound = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem('bonten:sound', String(next));
    if (next) {
      neuroAudio.playSuccess(0);
    }
  };

  return (
    <div className="audio-controller-wrapper">
      <button
        onClick={toggleSound}
        className={`audio-toggle-btn ${enabled ? 'active' : ''}`}
        aria-label={enabled ? 'Silenciar sonido' : 'Activar sonido'}
        title={enabled ? 'Sonido activo (clic para silenciar)' : 'Activar sonido háptico 3D'}
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
      </button>
    </div>
  );
}
