"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    
    // Forzamos visibilidad inicial
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1, // Suavidad de seguimiento (lag)
        ease: "power2.out"
      });
    };

    const handleHover = () => {
      gsap.to(cursor, {
        scale: 2.5,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        duration: 0.3
      });
    };

    const handleLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: 'white',
        duration: 0.3
      });
    };

    window.addEventListener('mousemove', moveCursor);

    // Añadir eventos a todos los enlaces y botones
    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none mix-blend-difference z-[10000]"
      style={{ transform: 'translate(-50%, -50%)' }}
    />
  );
}
