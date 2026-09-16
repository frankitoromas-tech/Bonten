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
            El bullying como fenómeno normativo del cuerpo
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed italic">
            Una aproximación analítica y sociológica para entender cómo las estructuras de dominación patriarcal y mercantilista inscriben la violencia normativa directamente sobre los cuerpos en los espacios de socialización.
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

            <div className="flex flex-col sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800">
              <div className="text-left sm:text-right">
                <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 block">
                  Edición Canónica BONTEN 2026
                </span>
                <span className="text-[10px] text-[var(--text-muted)] block">
                  Registro Doctrinal #001 • Acceso Público
                </span>
              </div>
              <Link
                href="/integrantes/fireboy"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-600 dark:text-amber-300 text-xs font-bold transition-all duration-200 hover:scale-105"
              >
                <span>Ver Perfil & Corpus de Fireboy</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Resumen Ejecutivo / Abstract */}
        <section className="p-6 rounded-2xl bg-gradient-to-r from-sky-50/70 to-purple-50/70 dark:from-sky-950/20 dark:to-purple-950/20 border border-sky-200/60 dark:border-white/10 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            Tesis Central del Tratado
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-dark)] leading-relaxed font-serif italic">
            &ldquo;Si bien el bullying suele definirse convencionalmente como un comportamiento violento e intimidatorio en el ámbito escolar, este trabajo busca expandir el concepto para entenderlo como un fenómeno normativo arraigado en la cultura y el mundo social. Una forma de comportamiento relacional establecido por un sistema político patriarcal que ejerce control sobre la subjetividad de los cuerpos.&rdquo;
          </p>
        </section>

        {/* Cuerpo del Ensayo */}
        <div
          className="space-y-8 font-serif leading-relaxed text-[var(--text-dark)] pt-4"
          style={{ fontSize: `${1.05 * fontSizeMultiplier}rem` }}
        >
          {/* Capítulo I - Introducción */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-[var(--title-color)] border-l-4 border-sky-500 pl-3">
              I. Introducción
            </h2>
            <p>
              Si bien el bullying es un fenómeno que consiste en un tipo de comportamiento violento e intimidatorio que se ejerce de manera verbal, física o psicológica entre niños o adolescentes en etapa escolar, de hecho <em>“El bullying se puede definir como la intimidación, el abuso, el maltrato físico y psicológico de un niño o grupo de niños sobre otro u otros. Incluye una serie de acciones negativas de distinta índole, como bromas, burlas, golpes, exclusión, conductas de abuso con connotaciones sexuales y, desde luego, agresiones físicas. El término deriva de una palabra inglesa, aceptada a nivel mundial para referirse al acoso entre compañeros, y definido como una forma ilegítima de confrontación de intereses o necesidades en la que uno de los protagonistas, persona, grupo, institución, adopta un rol dominante y obliga por la fuerza a que otro se ubique en uno de sumisión, causándole con ello un daño que puede ser físico, psicológico, social o moral (Ortega, Ramírez y Castelán, 2005:788)”</em>.
            </p>
            <p>
              Sin embargo, en este trabajo pretendo expandir el concepto de bullying no sólo al espacio escolar sino a un fenómeno, que si bien es cierto se identificó en dichos ambientes, puede ser rastreado, en sustancia, a la cultura y el mundo social, es decir, un comportamiento violento ejercido por diversos individuos de una sociedad, comportamiento implantado en la psique colectiva, una forma de comportamiento relacional que se ha establecido, quizás involuntariamente, por un tipo de sistema político. 
            </p>
            <blockquote className="p-4 my-4 rounded-xl border-l-4 border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 italic font-sans text-sm">
              &ldquo;El bullying es una conducta violenta y recurrente que se da entre pares, pero no es la única en el contexto de la violencia escolar, pues no da cuenta de las muchas acciones, actitudes y hechos que diversos protagonistas emprenden en el espacio escolar.&rdquo;
            </blockquote>
            <p>
              Ahora bien, para este análisis usaré a dos autores feministas que serán útiles para explicar desde sus conceptos el fenómeno del bullying, el por qué de su aparición y las consecuencias de este comportamiento sobre el cuerpo y su forma de expresarse en la cultura.
            </p>
          </section>

          {/* Capítulo II - Desarrollo */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-[var(--title-color)] border-l-4 border-purple-500 pl-3">
              II. Desarrollo
            </h2>
            <p>
              El feminismo es un movimiento ideológico que busca crear conciencia y condiciones para transformar las relaciones sociales, lograr la igualdad y suprimir la violencia contra las mujeres. Respecto del último punto quiero expandir que la violencia va dirigida no solo a las mujeres sino a toda persona, esto para hacer inteligible la investigación. En esta línea Rita Segato, antropóloga argentina y activista feminista, desde la perspectiva crítica de la colonialidad del poder y del saber, que esta pensadora adopta de Aníbal Quijano, permite explicar la forma de dominación colonial eurocéntrica que normatiza una estructura patriarcal en las sociedades occidentales.
            </p>
            <p>
              Ahora bien, desde esta perspectiva es útil para fines de esta presente investigación el análisis respecto al control de la subjetividad e intersubjetividad, el cual permite tejer una red de percepciones de la realidad, lo cual produce sentidos sociales que a su vez permiten al sujeto actuar y relacionarse en el mundo. El patriarcado como sistema político es estructuralmente <em>“la primera forma de desigualdad, de usurpación del poder, prestigio, autoridad y soberanía”</em> la que denomina <em>“la prehistoria patriarcal de la humanidad”</em>.
            </p>
            <p>
              Ahora bien, el “género” como estructura desigual es ya en sí misma violencia, es la categoría que uniformiza y universaliza una forma de ser del hombre y la mujer, en ese sentido dice <em>“el destino de los cuerpos femeninos, violados e inseminados en las guerras de todas las edades dan testimonio de esto” (Segato, 2003, 2006)</em>. Esta forma de ser se encarna o materializa en el cuerpo, por ello este es normado por el género que lo envuelve en una serie de características preestablecidas desde el sistema político patriarcal, que perpetúa a través del control de la subjetividad e intersubjetividad, implantados y retroalimentados por diversos <em>“dispositivos de poder”</em> que establecen un control tal que el individuo no tiene conciencia de este control ya implantado en su psique social.
            </p>
            <blockquote className="p-4 my-4 rounded-xl border-l-4 border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 italic font-sans text-sm">
              Y Butler apoya diciendo que “las estructuras jurídicas del lenguaje y de la política crean el campo actual de poder” (p. 52).
            </blockquote>
            <p>
              Este control sobre el género y, por tanto, sobre el cuerpo genera un rechazo a lo diferente, es decir se tiene una idea fija y clara de cómo ser determinado género. Por lo cual “el afeminado” o “la machona”, diferentes formas de expresar el género, generan rechazo. Este rechazo, además sumado al contexto actual, donde la “competencia” ha sido instaurada desde un paradigma de “capitalismo salvaje” que ha exacerbado el espíritu, y promueve una batalla encarnizada por el “éxito”, donde no solo las diferencias económicas sino en todos los aspectos generan rivalidad. Entonces es cuando este rechazo se vuelve violento, se implanta en el individuo un carácter normatizante, que busca perpetuar una forma de ser, de expresar el género a través del cuerpo, la forma patriarcal ya establecida previamente.
            </p>
            <p>
              Es en este punto donde Judith Butler hace su aparición, ya que lo que intenta explicar es cómo el sistema político puede darle cabida a sujetos políticos y sociales que no están representados. Esto es fundamental si lo que se quiere es suprimir este comportamiento violento surgido a partir de una estructura sobre el género y la política ya establecidos previamente y además liberar el cuerpo de una normatividad entretejida por el control de la subjetividad e intersubjetividad.
            </p>
            <p>
              Lo que Butler plantea que la diferencia entre sexos aparece como construidos socialmente a través de ciertos discursos performativos, de esta manera se van construyendo ciertas identidades (género) disímiles, son estas diferencias van diagramando roles distintos en la sociedades (formas de ser según el género) y esos roles van estructurando un status social (en un sistema político patriarcal), el status social respondería a una jerarquía de valor y esa jerarquía a su vez a una preeminencia de uno respecto al otro. Por tanto, así se justificaría la dialéctica del opresor y el oprimido, la preeminencia de un sexo, de un género, de un grupo, de una normalidad, etc, respecto a la otra.
            </p>
            <p>
              Por tanto, el fenómeno del bullying respondería a una estructura patriarcal que genera una cultura opresora, que a su vez se establece en el inconsciente colectivo y genera relaciones violentas entre individuos, una de estas formas vendría a ser el bullying, que de forma específica se presenta en ambientes escolares, pero que de manera amplia se manifiesta en el rechazo violento hacia lo diferente respecto a lo establecido por el sistema político patriarcal, donde el capitalismo como eje económico tiene sus implicaciones en las relaciones sociales, la subjetividad y la cultura. Por ello el género es performativo, es decir, que produce una serie de efectos. Estos efectos consolidan la impresión normatizante de ser un hombre o una mujer. En este sentido el género no sería una realidad interna, una proyección del sexo a una realidad social sino una realidad externa construida a partir de ciertos parámetros establecidos por una estructura patriarcal.
            </p>
          </section>

          {/* Capítulo III - Conclusión */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-[var(--title-color)] border-l-4 border-pink-500 pl-3">
              III. Conclusión
            </h2>
            <p>
              Establecido que el bullying es un epifenómeno surgido de la relación entre estructuras, un fenómeno que surge de la forma en cómo funciona la sociedad, es decir, la política patriarcal que instaura formas fijas de ser, hombre, mujer, pobre, rico, etc. Por ello <em>“la espectacularización de aspectos visibles de la diferencia étnica, religiosa, racial, etaria, etc. entre los antagonistas es más importante que los contenidos de la misma, por su propia instrumentalidad en la producción y reproducción de los conflictos que, en nuestro tiempo, se han constituido en un fin en sí mismo por su carácter lucrativo para la industria bélica y para las compañías militares privadas” (Azzellini 2005 y 2007, Münkler 2005)</em>. Al instaurar estas formas y además al crear ciertos dispositivos de poder que buscan perpetuar estas formas de ser, y así mantener un control sobre los cuerpos.
            </p>
            <p>
              En esta lucha por el dominio de los cuerpos es donde nos preguntamos ¿Es posible salir del yugo de la opresión? Es posible si se cambia el discurso normalizante y totalizante por un discurso de pluralidad y diversidad, el cual permitiría modificar la forma de relacionarse y ser más empático con lo diferente, pues reconoce que no hay una sola forma de ser, no hay una única forma de manifestar la feminidad o la masculinidad.
            </p>
            <p>
              Sin embargo, esto sería solo un aspecto importante, de una serie de estructuras o dispositivos formados dentro del sistema patriarcal. Uno de ellos sería el sistema económico que forma una parte vital de la perpetuación de este comportamiento y tipos de relaciones instaurados en la cultura ya estructurada previamente.
            </p>
          </section>

          {/* Bibliografía */}
          <section className="space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-white/10 font-sans text-sm">
            <h2 className="text-lg font-bold text-[var(--title-color)]">
              Bibliografía
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[var(--text-muted)]">
              <li>Butler, J. (2022). <em>Cuerpos que importan</em>. Paidós.</li>
              <li>Butler, J. & García, M. M. A. (2022). <em>El género en disputa</em>. Paidós.</li>
              <li>Segato, R (2013). <em>Las nuevas formas de la guerra y el cuerpo de las mujeres</em>. Tinta limón.</li>
              <li><em>Las estructuras de la violencia: Análisis capitalismo-patriarcado</em>. Entrevista a Rita Segato. (2022, 19 mayo). [Vídeo]. Youtube. <a href="https://youtu.be/IRDyp9_GBe4" target="_blank" rel="noreferrer" className="text-sky-500 hover:underline">https://youtu.be/IRDyp9_GBe4</a></li>
              <li>Gómez Nashiki, Antonio. (2013). <em>Bullying: El poder de la violencia. Una perspectiva cualitativa sobre acosadores y víctimas en escuelas primarias de Colima</em>. Revista mexicana de investigación educativa.</li>
            </ul>
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

            {/* Colofón Editorial & Créditos Institucionales */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[var(--text-muted)] gap-2">
              <Link
                href="/integrantes/fireboy"
                className="hover:text-amber-500 transition-colors inline-flex items-center gap-1 font-medium"
              >
                <span>✍️ <strong>Autor del Tratado:</strong> Fireboy (Ver perfil oficial y corpus →)</span>
              </Link>
              <span>🛡️ <strong>Custodia Doctrinal:</strong> Bloque Provida BONTEN</span>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
