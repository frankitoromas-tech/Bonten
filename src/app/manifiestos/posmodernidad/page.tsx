'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PosmodernidadPage() {
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setReadingProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerAudio = (type: 'pop' | 'success' | 'toggle') => {
    if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio) {
      const audio = (window as unknown as { bontenAudio: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio;
      if (type === 'pop') audio.playTactilePop();
      else if (type === 'success') audio.playSuccess();
      else if (type === 'toggle') audio.playToggle();
    }
  };

  const handleShare = () => {
    triggerAudio('pop');
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <article className="min-h-screen bg-[var(--background)] text-[var(--text-dark)] pb-20">
      {/* Barra de progreso de lectura superior fija */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200/50 dark:bg-white/5 z-50">
        <div
          className="h-full bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-4xl pt-10 sm:pt-14 space-y-8">
        {/* Navegación y Controles Editoriales */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-white/10 text-xs">
          <Link
            href="/manifiestos"
            className="text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1.5"
          >
            <span>←</span> Volver a Manifiestos
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">Tipografía:</span>
            <button
              onClick={() => {
                triggerAudio('toggle');
                setFontSizeMultiplier((prev) => Math.max(0.85, prev - 0.08));
              }}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 hover:border-sky-400 font-mono text-xs cursor-pointer"
              title="Reducir tamaño de letra"
            >
              A-
            </button>
            <button
              onClick={() => {
                triggerAudio('toggle');
                setFontSizeMultiplier((prev) => Math.min(1.25, prev + 0.08));
              }}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 hover:border-sky-400 font-mono text-xs cursor-pointer"
              title="Aumentar tamaño de letra"
            >
              A+
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/40 font-semibold text-xs cursor-pointer ml-2"
            >
              {isCopied ? '✓ Enlace Copiado' : '🔗 Compartir'}
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 font-semibold text-xs cursor-pointer"
              title="Exportar a PDF / Imprimir"
            >
              📄 Guardar PDF
            </button>
          </div>
        </div>

        {/* Portada y Cabecera del Tratado */}
        <header className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge-premium badge-magenta-neon text-xs">
              <span className="badge-emoji-halo">📜</span>
              Tratado Doctrinal Mayor
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              • 12 min de lectura • Filosofía & Ontología Provida
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--title-color)] leading-tight">
            La Fractura Posmoderna: Desconstrucción del Nihilismo y Reivindicación de la Dignidad Humana
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed italic">
            Una investigación crítica sobre el ocaso de los metarrelatos, la mercantilización biopolítica y la fundamentación del derecho inalienable a la vida frente al relativismo moral contemporáneo.
          </p>

          {/* Tarjeta de Autor Ultra-Premium: Fireboy (Fundador de BONTEN) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-amber-400/30 dark:border-amber-400/25 shadow-lg shadow-amber-950/5 dark:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />
            
            <div className="flex items-center gap-3.5">
              <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-md shadow-amber-500/20 flex-shrink-0">
                <Image
                  src="/assets/fireboy_dorsal_7.webp"
                  alt="Fireboy (Fundador de BONTEN)"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover object-top"
                  priority
                />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base sm:text-lg font-extrabold text-[var(--title-color)]">
                    Fireboy
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                    👑 Líder Fundador
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-sky-600 dark:text-sky-400 font-medium block">
                  Fundador y Presidente de BONTEN • Bloque Provida
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                Edición Canónica BONTEN 2026
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">
                Registro Doctrinal #001 • Acceso Público
              </span>
            </div>
          </div>
        </header>

        {/* Resumen Ejecutivo / Abstract */}
        <section className="p-6 rounded-2xl bg-gradient-to-r from-sky-50/70 to-purple-50/70 dark:from-sky-950/20 dark:to-purple-950/20 border border-sky-200/60 dark:border-white/10 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            Tesis Central del Tratado
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-dark)] leading-relaxed font-serif italic">
            &ldquo;La posmodernidad no es una simple evolución estética o literaria; representa la implosión deliberada de los criterios normativos universales. Al consagrar el deconstructivismo como dogma imperante, se ha despojado a la criatura humana de su condición ontológica inviolable, reduciendo la vida embrionaria a un objeto disponible para el arbitrio político del poder de turno. BONTEN se erige como la resistencia intelectual necesaria para restablecer el fundamento del ser.&rdquo;
          </p>
        </section>

        {/* Cuerpo del Ensayo */}
        <div
          className="space-y-8 font-serif leading-relaxed text-[var(--text-dark)] pt-4"
          style={{ fontSize: `${1.05 * fontSizeMultiplier}rem` }}
        >
          {/* Capítulo I */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-[var(--title-color)] border-l-4 border-sky-500 pl-3">
              I. El Ocaso de los Metarrelatos y la Tiranía del Deseo
            </h2>
            <p>
              Jean-François Lyotard definió célebremente la condición posmoderna como una <em>&quot;incredulidad hacia los metarrelatos&quot;</em>. Al dinamitar las nociones universales de justicia, verdad ontológica y naturaleza humana, el pensamiento contemporáneo no alcanzó la pretendida emancipación, sino que cayó rehén del más voraz de los tiranos: el deseo subjetivo ilimitado.
            </p>
            <p>
              Cuando no existe un criterio objetivo que trascienda la voluntad individual, la ética se degrada en una mera correlación de fuerzas. Si la verdad es declarada inexistente, la justicia deja de ser la defensa del inocente para convertirse en la imposición del más fuerte sobre el más débil.
            </p>
            <blockquote className="p-4 my-4 rounded-xl border-l-4 border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 italic font-sans text-sm">
              &ldquo;Al igual que en la alegoría socrática de los toneles perforados (Gorgias 493a), el hombre posmoderno cree encontrar la libertad en un apetito que jamás se sacia, consagrando una cultura del consumo y del descarte que termina por consumir a la propia persona humana.&rdquo;
            </blockquote>
          </section>

          {/* Capítulo II */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-[var(--title-color)] border-l-4 border-purple-500 pl-3">
              II. Nihilismo Biopolítico y la Deshumanización del Ser en Gestación
            </h2>
            <p>
              Michel Foucault advirtió sobre la entrada de la vida en los mecanismos del cálculo estatal a través de la biopolítica. Sin embargo, la posmodernidad radicalizó este dispositivo: hoy no es solo el Estado quien administra la vida, sino el mercado de las conciencias que decide quién merece el estatus de &quot;persona&quot; y quién queda relegado a la categoría de residuo biológico descartable.
            </p>
            <p>
              La ciencia embriológica moderna es categórica y no deja margen a la ambigüedad: desde el instante de la singamia cromosómica existe un nuevo individuo de la especie <em>Homo sapiens</em>, biológicamente completo, autoorganizado e ininterrumpido en su desarrollo. Negar la dignidad de este ser humano en su etapa más vulnerable bajo el pretexto de que &quot;carece de conciencia funcional&quot; es resucitar el utilitarismo más oscuro, condicionado a parámetros arbitrarios de utilidad social.
            </p>
          </section>

          {/* Capítulo III */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-[var(--title-color)] border-l-4 border-pink-500 pl-3">
              III. Modernidad Líquida y la Roca de la Resistencia
            </h2>
            <p>
              Zygmunt Bauman diagnosticó con agudeza la fragilidad de los vínculos humanos en la sociedad líquida. En una cultura donde los compromisos son volátiles y las responsabilidades se perciben como cargas onerosas, la maternidad y la paternidad son presentadas como amenazas a la autorrealización hedonista.
            </p>
            <p>
              BONTEN no acepta el fatalismo de este diagnóstico. Frente a la liquidez posmoderna, oponemos la solidez de los principios fundamentales. La resistencia no es una nostalgia del pasado, sino la afirmación categórica de que el futuro de la humanidad depende de nuestra capacidad para salvaguardar a quienes no pueden defenderse por sí mismos.
            </p>
          </section>

          {/* Conclusión */}
          <section className="space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-sm font-sans">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--title-color)]">
              Conclusión: El Mandato de la Nueva Generación
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              La batalla cultural de nuestro tiempo no se librará con consignas vacías ni con descalificaciones emotivas, sino con la contundencia de la verdad fundamentada. Invitamos a cada joven, a cada estudiante y a cada ciudadano a sumarse a esta fraternidad de resistencia intelectual y compromiso moral.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span>🔥</span> — Fireboy • Fundador y Presidente de BONTEN
              </span>
              <Link
                href="/comunidad"
                className="btn-admin-primary text-xs !py-2 !px-4"
              >
                Unirse a la Comunidad Provida →
              </Link>
            </div>

            {/* Colofón Editorial & Créditos Técnicos */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[var(--text-muted)] gap-2">
              <span>✍️ <strong>Autor del Tratado:</strong> Fireboy (Líder Doctrinal BONTEN)</span>
              <span>⚡ <strong>Ingeniería & Arquitectura Web:</strong> Equipo de Tecnología BONTEN</span>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
