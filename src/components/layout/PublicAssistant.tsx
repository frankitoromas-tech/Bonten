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
      text: '¡Hola! Soy la **Guía de Orientación BONTEN** ⚡\nPuedo orientarte sobre nuestra filosofía, el Tratado de Posmodernidad de Fireboy, el Decálogo Provida, o indicarte cómo navegar por cualquier sección de la web.',
      routes: [
        { label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' },
        { label: 'Comunidad Provida', href: '/comunidad' },
        { label: 'Integrantes', href: '/integrantes' },
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
      {/* Botón Flotante en Pantalla (Esquina Inferior Derecha) */}
      <div className="fixed bottom-5 right-5 z-40 select-none">
        <button
          type="button"
          onClick={() => {
            triggerAudio('toggle');
            setIsOpen(!isOpen);
          }}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-850 border border-sky-500/40 hover:border-sky-400 text-white shadow-xl shadow-sky-950/40 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          title="Abrir Asistente de Navegación BONTEN"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
          </span>

          <div className="relative w-5 h-5 rounded-full overflow-hidden border border-sky-400/40">
            <Image
              src="/LOGO_BONTEN_V2.jpeg"
              alt="Logo BONTEN"
              width={20}
              height={20}
              className="object-cover"
            />
          </div>

          <span className="text-xs font-semibold tracking-wide text-slate-200 group-hover:text-white">
            {isOpen ? 'Cerrar Guía' : 'Guía BONTEN'}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">IA</span>
        </button>
      </div>

      {/* Ventana Modal / Dock Flotante del Asistente */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[580px] h-[78vh] flex flex-col rounded-3xl border border-slate-700/70 bg-[#070d1e]/95 shadow-2xl shadow-sky-950/50 backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 select-none">
          
          {/* Cabecera del Asistente */}
          <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-sky-400/40 shadow">
                <Image
                  src="/LOGO_BONTEN_V2.jpeg"
                  alt="Logo BONTEN"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Guía BONTEN</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    Soberana
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  Orientación doctrinal y rutas institucionales
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
                    className={`max-w-[88%] p-3 rounded-2xl ${
                      isUser
                        ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-br-xs shadow-md'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-xs shadow-sm'
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
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                        {msg.routes.map((rt, rIdx) => (
                          <Link
                            key={rIdx}
                            href={rt.href}
                            onClick={() => {
                              triggerAudio('pop');
                              setIsOpen(false);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-950/60 hover:bg-sky-900/70 border border-sky-500/30 hover:border-sky-400 text-sky-300 hover:text-white text-[10.5px] font-medium transition-all"
                          >
                            <span>🧭</span>
                            <span>{rt.label}</span>
                            <span className="text-[9px]">→</span>
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
                <div className="max-w-[85%] p-3 rounded-2xl bg-slate-900/90 border border-sky-500/30 text-slate-200 rounded-bl-xs shadow-md space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-mono text-[11px]">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
                    </span>
                    <span className="font-semibold uppercase tracking-wider text-[10px]">
                      Razonando en BONTEN Core...
                    </span>
                  </div>
                  <div className="text-[11.5px] text-slate-300 italic flex items-center gap-1.5">
                    <span className="animate-spin text-xs">⚙️</span>
                    <span>{currentThinkingStep}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
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
