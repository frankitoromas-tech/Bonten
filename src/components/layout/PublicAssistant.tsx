'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavigationRoute {
  label: string;
  href: string;
}

interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  routes?: NavigationRoute[];
  reasoningSteps?: string[];
  isThinking?: boolean;
  activeStep?: string;
  timestamp: string;
}

export default function PublicAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentThinkingStep, setCurrentThinkingStep] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        'Paz y firmeza ontológica. Soy **Aegis**, el Centinela y Guía Soberano de **BONTEN** ⚡\n\n' +
        'Custodio los tratados de la biblioteca, la doctrina provida de Fireboy y la orientación canónica del sitio. ' +
        '¿En qué verdad filosófica o sección de nuestra resistencia deseas profundizar?',
      routes: [
        { label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' },
        { label: 'Biblioteca Doctrinal (6)', href: '#biblioteca-seccion' },
        { label: 'Mesa Directiva', href: '/integrantes' },
        { label: 'Comunidad Provida', href: '/comunidad' },
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
      'Analizando consulta semántica...',
      'Consultando corpus doctrinal y grafo de rutas BONTEN...',
      'Estructurando síntesis y referencias de navegación...',
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
        body: JSON.stringify({ prompt: textToSend }),
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
          reasoningSteps: data.reasoningSteps || [],
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
    { label: '📖 Tratado de Posmodernidad', prompt: '¿De qué trata el Tratado de Posmodernidad de Fireboy y dónde puedo leerlo?' },
    { label: '⚖️ Doctrina Provida', prompt: '¿Cuál es la postura bioética provida que defiende BONTEN?' },
    { label: '👥 Mesa Directiva', prompt: '¿Quiénes conforman la directiva de BONTEN y qué rol tiene cada uno?' },
    { label: '💬 Debates Activos', prompt: '¿Cómo puedo participar en los debates de la comunidad?' },
    { label: '🧭 Mapa de Navegación', prompt: '¿Cuáles son las rutas principales del sitio web?' },
  ];

  return (
    <>
      {/* Botón Flotante en Pantalla (Esquina Inferior Derecha con Aurora Breathing) */}
      <div className="fixed bottom-5 right-5 z-40 select-none">
        <div className="relative group">
          {/* Halo Aurora Respirante */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 opacity-70 blur-md group-hover:opacity-100 transition-all duration-500 aurora-breathing" />

          <button
            type="button"
            onClick={() => {
              triggerAudio('toggle');
              setIsOpen(!isOpen);
            }}
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#070e22]/90 hover:bg-[#0a1533] border border-sky-400/40 hover:border-sky-300 text-white shadow-2xl shadow-sky-950/60 backdrop-blur-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            title="Abrir Asistente de Navegación BONTEN"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-tr from-sky-500 to-cyan-300 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            </span>

            <div className="relative w-5 h-5 rounded-full overflow-hidden border border-sky-400/50 shadow-[0_0_8px_rgba(56,189,248,0.4)]">
              <Image
                src="/LOGO_BONTEN_V2.jpeg"
                alt="Logo BONTEN"
                width={20}
                height={20}
                className="object-cover"
              />
            </div>

            <span className="text-xs font-semibold tracking-wide text-slate-100 group-hover:text-white">
              {isOpen ? 'Cerrar Guía' : 'Guía BONTEN'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-sky-500/20 to-purple-500/20 text-sky-300 font-mono border border-sky-400/30">
              IA
            </span>
          </button>
        </div>
      </div>

      {/* Ventana Modal / Dock Flotante del Asistente */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[430px] max-h-[590px] h-[78vh] flex flex-col rounded-3xl border border-sky-500/30 bg-[#060c1d]/95 shadow-[0_20px_60px_-15px_rgba(3,105,161,0.35)] backdrop-blur-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 select-none">
          {/* Reflejo Especular Superior */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent pointer-events-none" />

          {/* Cabecera del Asistente */}
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
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                  <span className="shimmer-text-delight">Aegis • Guía BONTEN</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 flex items-center gap-1">
                    🛡️ Anti-Injection L7
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  Centinela doctrinal, bioética y navegación soberana
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerAudio('toggle');
                setIsOpen(false);
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              title="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* Chips de Consultas Frecuentes */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
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
          <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto font-sans text-xs select-text">
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
                    {/* Render de texto con soporte para negritas y listas */}
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
                            className={isBullet ? 'flex items-start gap-1.5 pl-1 text-[11.5px]' : 'text-[11.5px]'}
                          >
                            {isBullet && <span className="text-sky-400 font-bold">•</span>}
                            <span>{isBullet ? rendered.slice(1) : rendered}</span>
                          </div>
                        );
                      })}
                    </div>

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
                            className="group/btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-950/70 to-[#0a1b3a] hover:from-sky-900/80 hover:to-[#0f2854] border border-sky-500/30 hover:border-sky-400 text-sky-200 hover:text-white text-[11px] font-semibold transition-all duration-200 hover:scale-[1.03] shadow-sm hover:shadow-sky-500/20"
                          >
                            <span className="text-xs transition-transform duration-200 group-hover/btn:rotate-45">🧭</span>
                            <span>{rt.label}</span>
                            <span className="text-[10px] text-sky-400 group-hover/btn:translate-x-0.5 transition-transform">→</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9.5px] text-slate-500 px-1 mt-0.5">{msg.timestamp}</span>
                </div>
              );
            })}

            {/* Bucle de Procesamiento Cognitivo en Tiempo Real */}
            {loading && (
              <div className="flex flex-col items-start animate-in fade-in duration-200">
                <div className="max-w-[85%] p-3.5 rounded-2xl glass-luxury-delight border border-sky-500/40 text-slate-200 rounded-bl-xs shadow-lg space-y-2.5 relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                  <div className="flex items-center gap-2 text-sky-400 font-mono text-[11px]">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-80" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-tr from-sky-400 to-indigo-300 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                    </span>
                    <span className="font-semibold uppercase tracking-wider text-[10px] shimmer-text-delight">
                      Razonando en BONTEN Core...
                    </span>
                  </div>
                  <div className="text-[11.5px] text-slate-300 italic flex items-center gap-2 font-mono">
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
              '🔥 ¿Quién es Fireboy?',
              '⚡ ¿Quién desarrolló la web?',
              '📚 Biblioteca (6 Tratados)',
              '📜 Tratado de Posmodernidad',
              '⚖️ Argumentos Provida',
              '🌐 Unirme a la Comunidad',
            ].map((chip, cIdx) => (
              <button
                key={cIdx}
                type="button"
                disabled={loading}
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap text-[10.5px] px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-sky-950/80 border border-slate-700/60 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 transition-all cursor-pointer disabled:opacity-50"
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
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/90 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? '...' : 'Enviar'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
