'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface NavigationRoute {
  label: string;
  href: string;
}

interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  routes?: NavigationRoute[];
  suggestions?: string[];
  reasoningSteps?: string[];
  isThinking?: boolean;
  activeStep?: string;
  isStreaming?: boolean;
  timestamp: string;
}

const TypewriterText = ({
  content,
  speed = 10,
  onUpdate
}: {
  content: string;
  speed?: number;
  onUpdate?: () => void;
}) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const timer = setInterval(() => {
      if (i < content.length) {
        setDisplayed((prev) => prev + content.charAt(i));
        i++;
        if (onUpdate && i % 3 === 0) onUpdate(); // Scroll update
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [content, speed]);

  // Formateo de texto en tiempo real
  return (
    <div className="space-y-1.5 leading-relaxed">
      {displayed.split('\n').map((line, lIdx) => {
        if (!line.trim()) return <div key={lIdx} className="h-1" />;

        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-semibold text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        const isBullet = line.trim().startsWith('•');
        return (
          <div
            key={lIdx}
            className={isBullet ? 'flex items-start gap-1.5 pl-1 text-[13.5px]' : 'text-[13.5px]'}
          >
            {isBullet && <span className="text-sky-400 font-bold">•</span>}
            <span>{isBullet ? rendered.slice(1) : rendered}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function PublicAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentThinkingStep, setCurrentThinkingStep] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        '¡Hola! Soy **Wilfredo**. Me gusta pensar en mí como un polímata digital al servicio de la comunidad de **BONTEN**.\n\n' +
        'He leído a fondo nuestros tratados, los incisivos escritos de Fireboy y las valiosas aportaciones de Luyo. Más que darte respuestas automáticas, estoy aquí para dialogar y reflexionar contigo sobre **filosofía, ética, estética, derecho y biología**.\n\n' +
        '¿Sobre qué te gustaría que conversemos o debatamos hoy?',
      routes: [
        { label: 'Tratado de Posmodernidad (Fireboy)', href: '/manifiestos/posmodernidad' },
        { label: 'Biblioteca de Tratados', href: '#biblioteca-seccion' },
        { label: 'Diálogo Socrático (Ilan)', href: '/integrantes/ilan' },
        { label: 'Comunidad Provida', href: '/comunidad' },
      ],
      suggestions: [
        '⚖️ Ética positiva vs ética negativa',
        '🧬 Singamia y genoma del cigoto',
        '🏛️ Derecho natural vs positivismo de Kelsen',
        '🎨 Belleza clásica frente al feísmo posmoderno',
        '🤝 Consultar nexo doctrinal con Luyo',
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen, currentThinkingStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerAudio('toggle');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.setAttribute('data-assistant-open', 'true');
      } else {
        document.body.removeAttribute('data-assistant-open');
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.removeAttribute('data-assistant-open');
      }
    };
  }, [isOpen]);

  const triggerAudio = (type: 'pop' | 'success' | 'toggle' | 'chime') => {
    if (
      typeof window !== 'undefined' &&
      (window as unknown as {
        bontenAudio?: {
          playTactilePop: () => void;
          playSuccess: () => void;
          playToggle: () => void;
          playChime: () => void;
        };
      }).bontenAudio
    ) {
      const audio = (window as unknown as {
        bontenAudio: {
          playTactilePop: () => void;
          playSuccess: () => void;
          playToggle: () => void;
          playChime: () => void;
        };
      }).bontenAudio;

      if (type === 'pop') audio.playTactilePop();
      else if (type === 'success') audio.playSuccess();
      else if (type === 'toggle') audio.playToggle();
      else if (type === 'chime') audio.playChime();
    }
  };

  const handleClearChat = () => {
    triggerAudio('toggle');
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text:
          '¡Hola de nuevo! Como tu compañero polímata en **BONTEN**, estoy listo para empezar una nueva charla.\n\n' +
          'Puedo orientarte para explorar los tratados de la biblioteca, debatir sobre los escritos de nuestra mesa directiva o guiarte por cualquier sección del sitio. ' +
          '¿Por dónde te gustaría que empecemos ahora?',
        routes: [
          { label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' },
          { label: 'Biblioteca Doctrinal (6)', href: '#biblioteca-seccion' },
          { label: 'Mesa Directiva', href: '/integrantes' },
          { label: 'Comunidad Provida', href: '/comunidad' },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      triggerAudio('pop');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback silente
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    triggerAudio('pop');
    const userMsgId = Date.now().toString();

    // Mensaje del usuario
    const userMsg: AssistantMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    // Margen Cognitivo y Bucle de Procesamiento de IA
    const thinkingSteps = [
      'Procesando consulta...',
      'Buscando en la biblioteca y rutas...',
      'Preparando respuesta...',
    ];

    setCurrentThinkingStep(thinkingSteps[0]);

    const stepInterval = setInterval(() => {
      setCurrentThinkingStep((current) => {
        const nextIdx = (thinkingSteps.indexOf(current) + 1) % thinkingSteps.length;
        return thinkingSteps[nextIdx];
      });
    }, 420);

    const startTime = Date.now();

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, history: messages }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No pude procesar la orientación');

      // Garantizar un margen cognitivo realista de al menos 1100ms para procesar con vida
      const elapsed = Date.now() - startTime;
      const remainingMargin = Math.max(0, 1100 - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remainingMargin));

      clearInterval(stepInterval);
      triggerAudio('chime');

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.reply,
          routes: data.routes || [],
          suggestions: data.suggestions || [],
          reasoningSteps: data.reasoningSteps || [],
          isStreaming: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      const msg = err instanceof Error ? err.message : 'Error de conexión';
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: `⚠️ ${msg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setCurrentThinkingStep('');
    }
  };

  const quickPrompts = [
    { label: '⚖️ Ética Positiva vs Negativa', prompt: 'Explícame la diferencia entre ética positiva y ética negativa aplicada a la defensa del concebido' },
    { label: '🏛️ Derecho & Nasciturus', prompt: '¿Por qué el iusnaturalismo defiende que el concebido es sujeto de derecho frente al positivismo kelseniano?' },
    { label: '🧬 Singamia & Genoma', prompt: '¿Cuáles son los fundamentos biológicos de la singamia y el cigoto frente al lema mi cuerpo mi decisión?' },
    { label: '🎨 Estética & Belleza', prompt: 'Explícame la estética clásica de la kalokagathía frente al feísmo posmoderno en los tratados' },
    { label: '🔥 Escritos de Fireboy', prompt: '¿Cuáles son las tesis centrales de La Fractura Posmoderna de Fireboy?' },
    { label: '🤝 Nexo Doctrinal Luyo', prompt: '¿Cuáles son las contribuciones asimiladas de Luyo en la base doctrinal de Wilfredo?' },
    { label: '🏺 Mito del Tonel (Ilan)', prompt: 'Explícame la alegoría del tonel agujereado en el Gorgias de Platón y su crítica al hedonismo' },
    { label: '💬 Ágora de Debates', prompt: '¿Cuáles son los debates activos en la plataforma y cómo puedo participar?' },
  ];

  return (
    <>
      {/* Botón Flotante en Pantalla (Minimalista, Estético & Moderno) */}
      <div className="fixed bottom-5 right-5 z-40 select-none">
        <motion.button
          type="button"
          onClick={() => {
            triggerAudio('toggle');
            setIsOpen(!isOpen);
          }}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className={`group relative flex items-center gap-2.5 h-10 px-3.5 sm:px-4 rounded-full backdrop-blur-2xl transition-all duration-300 cursor-pointer ${
            isOpen
              ? 'bg-slate-900/90 border border-rose-500/40 text-rose-300 shadow-[0_4px_20px_rgba(244,63,94,0.25)]'
              : 'bg-[#060c1d]/85 hover:bg-[#0a1532]/95 border border-sky-500/30 hover:border-sky-400/60 text-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_15px_rgba(56,189,248,0.12)] hover:shadow-[0_6px_28px_rgba(56,189,248,0.28)]'
          }`}
          aria-label={isOpen ? 'Cerrar Asistente' : 'Abrir Asistente WILFREDO AI'}
          title={isOpen ? 'Cerrar Asistente' : 'Abrir Guía Doctrinal WILFREDO AI'}
        >
          {isOpen ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Cerrar</span>
            </div>
          ) : (
            <>
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
                <span className="text-[9px] px-1 py-0.2 rounded bg-sky-500/20 text-sky-300 font-mono font-semibold border border-sky-400/30">
                  AI
                </span>
              </div>

              {/* Beacon sutil de estado en vivo */}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            </>
          )}
        </motion.button>
      </div>

      {/* Ventana Modal / Dock Flotante del Asistente */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[460px] max-h-[650px] h-[82vh] flex flex-col rounded-3xl border border-sky-500/30 bg-[#060c1d]/95 shadow-[0_20px_60px_-15px_rgba(3,105,161,0.35)] backdrop-blur-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 select-none">
          {/* Reflejo Especular Superior */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent pointer-events-none" />

          {/* Cabecera de Wilfredo */}
          <div className="p-3.5 sm:p-4 border-b border-slate-800/90 flex items-center justify-between bg-gradient-to-r from-slate-950 via-[#0a142c] to-slate-950 relative">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
                <Image
                  src="/LOGO_BONTEN_V2.jpeg"
                  alt="Logo BONTEN"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 flex-wrap">
                  <span>Wilfredo • IA BONTEN</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    Imparcial & Reactivo
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Filosofía, Bioética, Derecho, Estética & Nexo Luyo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-300 hover:bg-slate-800/80 transition-all cursor-pointer"
                title="Reiniciar conversación"
                aria-label="Reiniciar conversación"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerAudio('toggle');
                  setIsOpen(false);
                }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                title="Cerrar (Esc)"
                aria-label="Cerrar asistente"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Chips de Consultas Frecuentes */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q.prompt)}
                disabled={loading}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-sky-950/70 border border-slate-800 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 transition-all cursor-pointer disabled:opacity-50"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Área de Mensajes del Chat */}
          <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto font-sans text-sm select-text">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl relative overflow-hidden ${
                      isUser
                        ? 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white rounded-br-xs shadow-lg shadow-sky-600/25 border border-sky-400/40'
                        : 'glass-luxury-delight text-slate-100 rounded-bl-xs shadow-md before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-sky-400/40 before:to-transparent'
                    }`}
                  >
                    {msg.isStreaming ? (
                      <TypewriterText 
                        content={msg.text} 
                        speed={14} 
                        onUpdate={() => chatBottomRef.current?.scrollIntoView({ behavior: 'auto' })} 
                      />
                    ) : (
                      <div className="space-y-1.5 leading-relaxed">
                        {msg.text.split('\n').map((line, lIdx) => {
                          if (!line.trim()) return <div key={lIdx} className="h-1" />;

                          // Formateo de negritas **texto**
                          const parts = line.split(/(\*\*[^*]+\*\*)/g);
                          const rendered = parts.map((part, pIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <strong key={pIdx} className="font-semibold text-white">
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return part;
                          });

                          const isBullet = line.trim().startsWith('•');
                          return (
                            <div
                              key={lIdx}
                              className={isBullet ? 'flex items-start gap-1.5 pl-1 text-[13.5px]' : 'text-[13.5px]'}
                            >
                              {isBullet && <span className="text-sky-400 font-bold">•</span>}
                              <span>{isBullet ? rendered.slice(1) : rendered}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Botones de Navegación Sugeridos */}
                    {msg.routes && msg.routes.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                        {msg.routes.map((rt, rIdx) => (
                          <Link
                            key={rIdx}
                            href={rt.href}
                            onClick={() => {
                              triggerAudio('pop');
                              setIsOpen(false);
                            }}
                            className="group/btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-950/70 to-[#0a1b3a] hover:from-sky-900/80 hover:to-[#0f2854] border border-sky-500/30 hover:border-sky-400 text-sky-200 hover:text-white text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-[1.03] shadow-sm hover:shadow-sky-500/20"
                          >
                            <span className="text-sm transition-transform duration-200 group-hover/btn:rotate-45">🧭</span>
                            <span>{rt.label}</span>
                            <span className="text-xs text-sky-400 group-hover/btn:translate-x-0.5 transition-transform">→</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Sugerencias Analíticas de Wilfredo */}
                    {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/60 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 font-mono">
                          <span>💡</span>
                          <span>Sugerencias Analíticas de Wilfredo:</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {msg.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleSend(sug.replace(/^💡\s*Sugerencia:\s*/i, ''))}
                              className="text-left px-2.5 py-1.5 rounded-lg bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/20 hover:border-sky-400/50 text-slate-300 hover:text-sky-200 text-xs transition-all cursor-pointer flex items-center justify-between group/sug"
                            >
                              <span>{sug}</span>
                              <span className="text-[10px] text-sky-400 opacity-0 group-hover/sug:opacity-100 transition-opacity">↵</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botón de Copiado de Respuesta */}
                    {!isUser && (
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-700/40 text-xs">
                        <span className="font-mono text-[10px] text-slate-400">WILFREDO • BONTEN</span>
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-sky-300 transition-colors cursor-pointer"
                          title="Copiar respuesta"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <svg viewBox="0 0 24 24" width="11" height="11" stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span className="text-emerald-400 font-semibold">Copiado</span>
                            </>
                          ) : (
                            <>
                              <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10.5px] text-slate-500 px-1 mt-0.5">{msg.timestamp}</span>
                </div>
              );
            })}

            {/* Bucle de Procesamiento Cognitivo en Tiempo Real */}
            {loading && (
              <div className="flex flex-col items-start animate-in fade-in duration-200">
                <div className="max-w-[85%] p-3.5 rounded-2xl glass-luxury-delight border border-sky-500/40 text-slate-200 rounded-bl-xs shadow-lg space-y-2.5 relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                  <div className="flex items-center gap-2 text-sky-400 font-mono text-xs">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-80" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-tr from-sky-400 to-indigo-300 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                    </span>
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-sky-400">
                      Procesando...
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 italic flex items-center gap-2 font-mono">
                    <span className="animate-spin-slow text-sm">⚙️</span>
                    <span>{currentThinkingStep}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Fila de Sugerencias Rápidas / Prompt Chips */}
          <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              '✨ Axioma de Resistencia',
              '🛡️ Tácticas de Debate',
              '📚 Recomendar Tratado',
              '🔥 Escritos de Fireboy',
              '🏛️ Ágora de Debates',
              '📖 Biblioteca Doctrinal',
              '👥 Mesa Directiva',
            ].map((chip, cIdx) => (
              <button
                key={cIdx}
                type="button"
                disabled={loading}
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap text-xs px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-sky-950/80 border border-slate-700/60 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 transition-all cursor-pointer disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Formulario de Entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-800/90 bg-slate-950/90 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre manifiestos, integrantes o rutas..."
              disabled={loading}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? '...' : 'Enviar'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
