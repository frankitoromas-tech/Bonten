'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { SiteMetadata } from '@/lib/data/runtimeStore';

interface ActionProposal {
  actionType: string;
  title: string;
  field: string;
  currentValue: string;
  proposedValue: string;
  payload: Record<string, unknown>;
  requiresConfirmation: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  proposal?: ActionProposal;
  status?: 'pending' | 'applied' | 'cancelled';
  timestamp: string;
}

interface Props {
  onMetadataUpdated?: (metadata: SiteMetadata) => void;
}

export function AdminCopilot({ onMetadataUpdated }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hola, Fireboy. Puedes pedirme cambios en lenguaje natural o presionar los accesos rápidos:',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const triggerAudio = (type: 'pop' | 'success' | 'toggle') => {
    if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio) {
      const audio = (window as unknown as { bontenAudio: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio;
      if (type === 'pop') audio.playTactilePop();
      else if (type === 'success') audio.playSuccess();
      else if (type === 'toggle') audio.playToggle();
    }
  };

  const handleSend = async (userPrompt?: string) => {
    const textToSend = (userPrompt || input).trim();
    if (!textToSend || loading) return;

    triggerAudio('pop');
    const userMsgId = Date.now().toString();
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!userPrompt) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          mode: 'propose',
          prompt: textToSend,
          history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar la solicitud');

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || 'He recibido tu solicitud.',
        proposal: data.proposal,
        status: data.proposal ? 'pending' : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: `No pude procesar la orden: ${msg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async (msgId: string, proposal: ActionProposal) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          mode: 'execute',
          actionType: proposal.actionType,
          payload: proposal.payload,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fallo al ejecutar la acción');

      triggerAudio('success');

      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? { ...m, status: 'applied', text: `${m.text}\n\n✓ ${data.message || 'Cambio aplicado correctamente.'}` }
            : m
        )
      );

      if (data.metadata && onMetadataUpdated) {
        onMetadataUpdated(data.metadata);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al aplicar';
      alert(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAction = (msgId: string) => {
    triggerAudio('pop');
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: 'cancelled' } : m))
    );
  };

  const handleResetChat = () => {
    triggerAudio('toggle');
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'assistant',
        text: 'Conversación reiniciada. Puedes solicitar cambios de metadatos, activar protocolos de aislamiento de IP o formular consultas doctrinales.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const automatedWorkflows = [
    { label: '⚡ Fireboy Dorsal 7', prompt: 'Cambiar el avatar oficial de Fireboy a la nueva foto del dorsal 7 en el estadio (/assets/fireboy_dorsal_7.webp)' },
    { label: '🚀 Campaña Provida', prompt: 'Lanzar campaña provida con título y slogan actualizados' },
    { label: '🛡️ Aislar IP Maliciosa', prompt: 'Bloquea la IP sospechosa 198.51.100.42 por intento reiterado de intrusión' },
    { label: '⚖️ Ética Socrática (Gorgias 493a)', prompt: 'Explícame la alegoría socrática de los dos toneles perforados de Gorgias 493a y su aplicación ética' },
    { label: '💬 Crear Debate Doctrinal', prompt: 'Crear un nuevo debate sobre bioética y deontología provida' },
    { label: '🖼️ Avatar Estudio', prompt: 'Cambiar avatar oficial de Fireboy a /assets/avatar_fireboy_1781973753933.webp' },
    { label: '🛡️ Auditoría WAF & Seguridad', prompt: 'Realiza una auditoría completa de vulnerabilidades y seguridad' },
    { label: '📚 Publicar Ensayo Bioética', prompt: 'Publicar ensayo sobre bioética titulado "La Dignidad del Ser en Gestación"' },
    { label: '✨ Optimizar Metadatos SEO', prompt: 'Optimiza los metadatos y SEO para posicionamiento' },
  ];

  const helpQueries = [
    '¿Cuál es la doctrina del Bloque Provida?',
    '¿Quiénes son los administradores y qué permisos tienen?',
    '¿Cómo funciona la física 3D y el audio háptico?',
  ];

  return (
    <div className="admin-card space-y-4 max-w-4xl mx-auto">
      {/* Header Sereno con Acciones Rápidas */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <Image
            src="/LOGO_BONTEN_V2.jpeg"
            alt="Logo BONTEN"
            width={36}
            height={36}
            className="rounded-xl border border-slate-200 dark:border-white/10 object-cover shadow-sm float-3d"
          />
          <div>
            <h3 className="text-sm font-semibold text-[var(--title-color)]">
              Copilot Administrativo & Flujos Automatizados
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Multi-ayuda inteligente, resolución doctrinal y mitigación perimetral activa
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetChat}
            className="btn-admin-secondary text-[11px] !py-1 !px-2.5 flex items-center gap-1.5 hover:border-sky-400/50"
            title="Limpiar historial y reiniciar"
          >
            <span>🔄</span> Reiniciar
          </button>
          <span className="badge-premium badge-radiant-emerald text-[11px]">
            <span className="badge-emoji-halo">⚡</span>
            Flujos Activos
          </span>
        </div>
      </div>

      {/* Flujos Automatizados & Consultas */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Flujos:</span>
          {automatedWorkflows.map((w, i) => {
            const parts = w.label.split(' ');
            const emoji = parts[0]?.match(/\p{Extended_Pictographic}/u) ? parts[0] : null;
            const text = emoji ? parts.slice(1).join(' ') : w.label;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(w.prompt)}
                className="badge-premium badge-royal-sapphire cursor-pointer text-[11.5px] transition-all hover:scale-105"
              >
                {emoji && <span className="badge-emoji-halo">{emoji}</span>}
                <span>{text}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Dudas:</span>
          {helpQueries.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(q)}
              className="badge-premium opacity-70 hover:opacity-100 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 cursor-pointer text-[11.5px] transition-all hover:scale-105"
            >
              <span className="badge-emoji-halo text-sky-500">💡</span>
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Flujo de Conversación */}
      <div className="space-y-3 min-h-[220px] max-h-[380px] overflow-y-auto p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 shadow-sm'
              }`}
            >
              <div className="space-y-1.5 leading-relaxed">
                {msg.text.split('\n').map((line, idx) => {
                  if (!line.trim()) return <div key={idx} className="h-1.5" />;
                  
                  // Manejo de títulos o encabezados de sección
                  if (line.startsWith('### ') || line.startsWith('## ')) {
                    return (
                      <div key={idx} className="font-bold text-sky-600 dark:text-sky-400 pt-1 text-[12px]">
                        {line.replace(/^#+\s*/, '')}
                      </div>
                    );
                  }

                  // Manejo de viñetas
                  const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
                  const isNumbered = /^\d+\.\s/.test(line.trim());

                  // Procesamiento de negritas **texto**
                  const parts = line.split(/(\*\*[^*]+\*\*)/g);
                  const renderedLine = parts.map((part, pIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <strong key={pIdx} className="font-semibold text-slate-900 dark:text-white">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    return part;
                  });

                  if (isBullet || isNumbered) {
                    return (
                      <div key={idx} className="flex items-start gap-1.5 pl-1.5 text-[11.5px]">
                        <span className="text-sky-500 font-bold select-none">{isNumbered ? line.trim().split(' ')[0] : '•'}</span>
                        <span className="flex-1">
                          {isNumbered ? renderedLine.slice(1) : renderedLine}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className="text-[11.5px]">
                      {renderedLine}
                    </div>
                  );
                })}
              </div>

              {/* Tarjeta de Propuesta Segura */}
              {msg.proposal && (
                <div className={`mt-3 pt-3 border-t space-y-2 card-3d-layer rounded-lg p-2.5 ${
                  msg.proposal.actionType === 'BAN_SUSPICIOUS_IP'
                    ? 'border-rose-300 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20'
                    : msg.proposal.actionType === 'UNBAN_IP'
                    ? 'border-emerald-300 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-slate-200/80 dark:border-white/10 bg-slate-50/40 dark:bg-slate-900/40'
                }`}>
                  <div className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                    msg.proposal.actionType === 'BAN_SUSPICIOUS_IP'
                      ? 'text-rose-600 dark:text-rose-400'
                      : msg.proposal.actionType === 'UNBAN_IP'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-sky-600 dark:text-sky-400'
                  }`}>
                    <span>{msg.proposal.actionType === 'BAN_SUSPICIOUS_IP' ? '🛡️' : msg.proposal.actionType === 'UNBAN_IP' ? '🔓' : '⚡'}</span>
                    <span>{msg.proposal.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Campo:</span> {msg.proposal.field}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Actual:</span>{' '}
                    <span className="line-through opacity-70">{msg.proposal.currentValue}</span>
                  </div>
                  <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span>Nuevo:</span> {msg.proposal.proposedValue}
                  </div>

                  {msg.status === 'pending' && (
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleConfirmAction(msg.id, msg.proposal!)}
                        disabled={loading}
                        className="btn-admin-primary text-xs !py-1 !px-3"
                      >
                        Confirmar y Aplicar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelAction(msg.id)}
                        disabled={loading}
                        className="btn-admin-secondary text-xs !py-1 !px-2.5"
                      >
                        Descartar
                      </button>
                    </div>
                  )}

                  {msg.status === 'applied' && (
                    <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 pt-1">
                      ✓ Acción completada en tiempo real.
                    </div>
                  )}

                  {msg.status === 'cancelled' && (
                    <div className="text-[11px] text-slate-400 italic pt-1">
                      Operación descartada sin realizar cambios.
                    </div>
                  )}
                </div>
              )}
            </div>
            <span className="text-[9px] text-slate-400 px-1 mt-0.5">{msg.timestamp}</span>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* Barra de Entrada de Texto */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe una instrucción (ej. Cambia el slogan a...)"
          className="admin-input flex-1 !text-xs"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-admin-primary text-xs !py-2 !px-4"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
