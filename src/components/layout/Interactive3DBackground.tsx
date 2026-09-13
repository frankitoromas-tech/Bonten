'use client';
import React, { useEffect, useRef } from 'react';

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseRadius: number;
  color: string;
}

const BONTEN_PALETTE = ['#38bdf8', '#d946ef', '#818cf8', '#0284c7', '#c084fc'];

export default function Interactive3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Detección de dispositivos de bajo rendimiento o preferencia de movimiento reducido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = width < 768;
    const particleCount = prefersReducedMotion ? 0 : isMobile ? 35 : 75;

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Inicializar campo 3D
    const fov = 400;
    const particles: Particle3D[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 - 400,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.5,
        baseRadius: Math.random() * 1.8 + 1.2,
        color: BONTEN_PALETTE[Math.floor(Math.random() * BONTEN_PALETTE.length)],
      });
    }

    let isVisible = !document.hidden;
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Suavizado del mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const centerX = width / 2;
      const centerY = height / 2;
      const mouseOffsetX = (mouse.x - centerX) * 0.0004;
      const mouseOffsetY = (mouse.y - centerY) * 0.0004;

      // Actualizar y proyectar partículas 3D a 2D
      const projected: Array<{ x: number; y: number; scale: number; p: Particle3D }> = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Rotación en espacio 3D basada en el movimiento del cursor
        if (mouse.active) {
          const cosX = Math.cos(mouseOffsetX);
          const sinX = Math.sin(mouseOffsetX);
          const cosY = Math.cos(mouseOffsetY);
          const sinY = Math.sin(mouseOffsetY);

          const x1 = p.x * cosX - p.z * sinX;
          const z1 = p.z * cosX + p.x * sinX;
          const y1 = p.y * cosY - z1 * sinY;
          const z2 = z1 * cosY + p.y * sinY;

          p.x = x1;
          p.y = y1;
          p.z = z2;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Rebotes en los límites del cubo 3D
        if (p.x < -width) p.x = width;
        if (p.x > width) p.x = -width;
        if (p.y < -height) p.y = height;
        if (p.y > height) p.y = -height;
        if (p.z < -400) p.z = 400;
        if (p.z > 400) p.z = -400;

        // Proyección de perspectiva
        const scale = fov / (fov + p.z + 500);
        const projX = centerX + p.x * scale;
        const projY = centerY + p.y * scale;

        projected.push({ x: projX, y: projY, scale, p });

        // Renderizar punto de partícula con glow suave
        const radius = Math.max(0.5, p.baseRadius * scale);
        const alpha = Math.min(0.85, Math.max(0.15, scale * 0.7));

        ctx.beginPath();
        ctx.arc(projX, projY, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 12 * scale;
        ctx.shadowColor = p.color;
        ctx.fill();
      }

      // Conexiones de red neuronal 3D entre partículas cercanas
      const maxDistance = isMobile ? 85 : 120;
      ctx.shadowBlur = 0;

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.22 * Math.min(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#38bdf8';
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.8 * Math.min(p1.scale, p2.scale);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="interactive-3d-canvas"
      aria-hidden="true"
    />
  );
}
