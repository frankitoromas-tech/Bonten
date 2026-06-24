"use client";
import React, { useState, useRef, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sphere, MeshDistortMaterial, Environment } from '@react-three/drei';
import gsap from 'gsap';

// Componente 3D (Animado)
function AnimatedShape() {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[1, 100, 100]} scale={2.5}>
                <MeshDistortMaterial 
                    color="#1e3a8a"
                    emissive="#0f172a"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.1}
                    metalness={0.9}
                />
            </Sphere>
            <Environment preset="city" />
        </Float>
    );
}

export default function Hero() {
    const [expanded, setExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useLayoutEffect(() => {
        setMounted(true);
        let ctx = gsap.context(() => {
            gsap.from(".hero-element", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                stagger: 0.2,
                delay: 1.5 // Espera a que termine el preloader
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full min-h-[80vh] flex items-center justify-center p-4 overflow-hidden rounded-2xl mb-12 mt-8">
            {/* Fondo 3D */}
            <div className="absolute inset-0 z-0">
                {mounted && (
                    <Canvas camera={{ position: [0, 0, 5] }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        <AnimatedShape />
                        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                    </Canvas>
                )}
            </div>

            {/* Capa Glassmorphism Superior */}
            <article className={`relative z-10 w-full max-w-4xl p-8 md:p-12 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-700 ease-out hero-element ${expanded ? 'scale-100' : 'scale-[0.98]'}`}>
                <h2 className="text-4xl md:text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6 tracking-tighter">
                    Nuestra Resistencia
                </h2>
                
                <div className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8">
                    <p className="hero-element mb-4">En un mundo que ha olvidado el valor de lo esencial, nosotros nos alzamos como la última línea de defensa. <strong className="text-white">BONTEN no es solo una organización; es un manifiesto de resistencia</strong> por aquellos que aún no tienen voz.</p>

                    <div className={`overflow-hidden transition-all duration-700 ease-in-out ${expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pt-4 border-t border-white/10 space-y-4">
                            <p className="hero-element">Al igual que en la inspiración de este nombre, donde el destino parece escrito en piedra y la tragedia acecha en cada esquina, hoy vivimos en una era contemporánea donde defender la vida es visto como un acto de rebeldía. En la "línea temporal" actual, se nos criminaliza por proteger el derecho más básico; se nos tacha de sombras cuando buscamos ser la luz.</p>
                            <p className="hero-element">Nuestra visión a futuro es clara: <strong className="text-white">Queremos cambiar el futuro alterando el presente.</strong> No somos un grupo que busca el conflicto, sino una fraternidad que busca reescribir el guion de la sociedad. En un mundo que nos persigue por nuestras convicciones, nosotros nos mantenemos firmes como la "Resistencia" de la vida.</p>
                            <p className="text-xl font-medium text-[#2368b8] mt-6 hero-element">La batalla por el futuro de la humanidad se libra hoy. <br/>No dejes que la historia se escriba sin ti.</p>
                        </div>
                    </div>
                </div>

                <button 
                    className="hero-element flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all interactive group"
                    onClick={() => setExpanded(!expanded)}
                >
                    <span className="font-semibold tracking-wider text-sm uppercase">{expanded ? 'Ocultar manifiesto' : 'Leer manifiesto completo'}</span>
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" className={`transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            </article>
        </section>
    );
}
