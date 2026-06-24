"use client";
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    // Simularemos una carga rápida para el impacto visual (en el futuro se puede atar a Spline/Three.js)
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        // Animación de salida
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
          delay: 0.2
        });
      }
      setProgress(currentProgress);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
    >
      <div className="text-6xl font-light tracking-widest mb-4">
        {progress}%
      </div>
      <div className="text-sm tracking-[0.3em] uppercase opacity-50">
        Iniciando BONTEN NG
      </div>
    </div>
  );
}
