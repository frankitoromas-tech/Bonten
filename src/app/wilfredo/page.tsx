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
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const timer = setInterval(() => {
      if (i < content.length) {
        setDisplayed((prev) => prev + content.charAt(i));
        i++;
        if (onUpdateRef.current && i % 3 === 0) onUpdateRef.current();
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [content, speed]);

  return (
    <div className="space-y-2 leading-relaxed text-base sm:text-[15px]">
      {displayed.split('\n').map((line, lIdx) => {
        if (!line.trim()) return <div key={lIdx} className="h-1.5" />;

        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-semibold text-sky-100 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
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
            className={isBullet ? 'flex items-start gap-2 pl-2' : ''}
          >
            {isBullet && <span className="text-sky-400 font-bold">•</span>}
            <span>{isBullet ? rendered.slice(1) : rendered}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function WilfredoPage() {
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
        'He asimilado el vasto conocimiento de nuestra doctrina. Estoy aquí para elevar el debate y reflexionar contigo sobre **Filosofía, Bioética, Derecho, Teología, Geopolítica y Sociología**.\n\n' +
        'Te invito a sumergirte en las profundidades del conocimiento intelectual. ¿Sobre qué tema de gran envergadura te gustaría dialogar hoy?',
      routes: [
        { label: 'Tratado de Posmodernidad (Fireboy)', href: '/manifiestos/posmodernidad' },
        { label: 'Biblioteca de Tratados', href: '/#biblioteca-seccion' },
        { label: 'Diálogo Socrático (Ilan)', href: '/integrantes/ilan' },
        { label: 'Comunidad Provida', href: '/comunidad' },
      ],
      suggestions: [
        '⚖️ Análisis: Ética positiva vs ética negativa',
        '🧬 Biología Clínica: Singamia y genoma del cigoto',
        '🏛️ Filosofía del Derecho: Iusnaturalismo vs positivismo',
        '🎨 Estética: Belleza clásica frente al feísmo posmoderno',
        '📜 Sociología y Geopolítica: Decadencia de occidente',
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading, currentThinkingStep]);

  const triggerAudio = (type: 'pop' | 'success' | 'toggle' | 'chime') => {
    if (
      typeof window !== 'undefined' &&
      (window as unknown as { bontenAudio?: any }).bontenAudio
    ) {
      const audio = (window as unknown as { bontenAudio: any }).bontenAudio;
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
          { label: 'Biblioteca Doctrinal', href: '/#biblioteca-seccion' },
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
      // Fallback
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    triggerAudio('pop');
    const userMsgId = Date.now().toString();

    const userMsg: AssistantMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

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
    { label: '⚖️ Ética', prompt: 'Explícame la diferencia entre ética positiva y ética negativa aplicada a la defensa del concebido' },
    { label: '🏛️ Derecho', prompt: '¿Por qué el iusnaturalismo defiende que el concebido es sujeto de derecho frente al positivismo kelseniano?' },
    { label: '🧬 Bioética Avanzada', prompt: 'Argumentos genéticos y clínicos sobre la singamia como inicio irrefutable de la vida humana' },
    { label: '🎨 Estética Clásica', prompt: 'Análisis de la kalokagathía frente al nihilismo estético de la posmodernidad' },
    { label: '🔥 Filosofía', prompt: 'Explica las tesis de Fireboy sobre la fractura posmoderna y el relativismo moral' },
    { label: '🏺 Historia y Ética', prompt: 'La alegoría del tonel en el Gorgias de Platón y su crítica al hedonismo contemporáneo' },
    { label: '📖 Dialéctica Hegeliana', prompt: 'Analiza el debate provida actual usando el marco de la dialéctica del amo y el esclavo' },
    { label: '💬 Debates', prompt: '¿Cuáles son los debates activos en el Ágora y cómo se estructuran?' },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] mt-20 p-4 sm:p-6 lg:p-8 flex items-center justify-center max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl h-[85vh] sm:h-[80vh] flex flex-col rounded-3xl border border-sky-400/30 bg-gradient-to-br from-[#060c1d]/95 via-[#081229]/90 to-[#030816]/95 shadow-[0_0_60px_-15px_rgba(14,165,233,0.25),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl overflow-hidden relative"
      >
        {/* Decoración superior */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent pointer-events-none" />

        {/* Header Wilfredo */}
        <div className="p-4 sm:p-5 border-b border-slate-800/90 flex flex-wrap items-center justify-between bg-gradient-to-r from-slate-950 via-[#0a142c] to-slate-950 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <Image
                src="/LOGO_BONTEN_V2.jpeg"
                alt="Logo BONTEN"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                <span>Wilfredo • IA BONTEN</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Polímata Digital
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Filosofía, Bioética, Derecho & Estética
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleClearChat}
            className="px-4 py-2 text-sm rounded-xl font-semibold flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-500 transition-all cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reiniciar
          </button>
        </div>

        {/* Área Principal del Chat */}
        <div 
          ref={chatContainerRef} 
          className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-sky-900/50 scrollbar-track-transparent font-sans text-base select-text"
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] lg:max-w-[75%] p-4 sm:p-5 rounded-2xl relative ${
                    isUser
                      ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white rounded-br-sm shadow-[0_8px_30px_rgba(2,132,199,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-sky-300/40 font-medium'
                      : 'bg-slate-900/60 backdrop-blur-md border border-slate-700/60 text-slate-100 rounded-bl-sm shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)]'
                  }`}
                >
                  {msg.isStreaming ? (
                    <TypewriterText 
                      content={msg.text} 
                      speed={14} 
                      onUpdate={() => {
                        if (chatContainerRef.current) {
                          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                        }
                      }} 
                    />
                  ) : (
                    <div className="space-y-2 leading-relaxed text-[15px]">
                      {msg.text.split('\n').map((line, lIdx) => {
                        if (!line.trim()) return <div key={lIdx} className="h-1.5" />;
                        
                        const parts = line.split(/(\*\*[^*]+\*\*)/g);
                        const rendered = parts.map((part, pIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={pIdx} className="font-semibold text-sky-100 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return part;
                        });

                        const isBullet = line.trim().startsWith('•');
                        return (
                          <div key={lIdx} className={isBullet ? 'flex items-start gap-2 pl-2' : ''}>
                            {isBullet && <span className="text-sky-400 font-bold mt-0.5">•</span>}
                            <span>{isBullet ? rendered.slice(1) : rendered}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Sugerencias Analíticas */}
                  {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-700/60 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-sky-400">
                        <span>💡</span>
                        <span>Sugerencias Analíticas:</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleSend(sug.replace(/^💡\s*Sugerencia:\s*/i, ''))}
                            className="text-left px-3 py-2 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/20 hover:border-sky-400/50 text-slate-300 hover:text-sky-200 text-sm transition-all cursor-pointer flex items-center justify-between group/sug"
                          >
                            <span>{sug}</span>
                            <span className="text-sky-400 opacity-0 group-hover/sug:opacity-100 transition-opacity">↵</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botones de Rutas */}
                  {msg.routes && msg.routes.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap gap-2">
                      {msg.routes.map((rt, rIdx) => (
                        <Link
                          key={rIdx}
                          href={rt.href}
                          onClick={() => triggerAudio('pop')}
                          className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-950/70 to-[#0a1b3a] hover:from-sky-900/80 hover:to-[#0f2854] border border-sky-500/30 hover:border-sky-400 text-sky-200 hover:text-white text-sm font-semibold transition-all hover:scale-[1.02]"
                        >
                          <span className="transition-transform group-hover/btn:rotate-45">🧭</span>
                          <span>{rt.label}</span>
                          <span className="text-sky-400 group-hover/btn:translate-x-1 transition-transform">→</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Acciones del mensaje */}
                  {!isUser && (
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700/40 text-xs">
                      <span className="font-mono text-slate-400">WILFREDO • BONTEN</span>
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <><span className="text-emerald-400">✓ Copiado</span></>
                        ) : (
                          <><span>Copiar</span></>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-xs text-slate-500 mt-1.5 px-1">{msg.timestamp}</span>
              </div>
            );
          })}

          {/* Estado de carga animado */}
          {loading && (
            <div className="flex flex-col items-start animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-sky-500/40 text-slate-200 rounded-bl-sm shadow-lg space-y-3 min-w-[200px]">
                <div className="flex items-center gap-2.5 text-sky-400 font-mono text-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-80" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-400" />
                  </span>
                  <span className="font-semibold uppercase tracking-wider">Procesando...</span>
                </div>
                <div className="text-sm text-slate-300 italic flex items-center gap-2">
                  <span className="animate-spin-slow">⚙️</span>
                  <span>{currentThinkingStep}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Área y Chips Rápidos */}
        <div className="bg-slate-950/80 border-t border-slate-800/80 backdrop-blur-md flex flex-col">
          <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-800/50">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q.prompt)}
                disabled={loading}
                className="shrink-0 text-sm px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-sky-900/50 border border-slate-700/60 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 transition-all cursor-pointer disabled:opacity-50"
              >
                {q.label}
              </button>
            ))}
          </div>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Pregunta sobre filosofía, historia, biología o doctrina... (Presiona Enter para enviar)"
              disabled={loading}
              maxLength={500}
              rows={1}
              className="flex-1 min-h-[48px] max-h-32 px-4 py-3 rounded-2xl border border-slate-700 bg-slate-900 text-white placeholder-slate-400 text-base focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none overflow-y-auto"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-base transition-all shadow-lg shadow-sky-900/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 min-w-[120px]"
            >
              {loading ? (
                <span className="animate-pulse">Enviando...</span>
              ) : (
                <>
                  <span>Enviar</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
