'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface DoctrinalChallenge {
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

const CHALLENGES: DoctrinalChallenge[] = [
  {
    question: 'En el Tratado de la Posmodernidad de Fireboy (Gorgias 493a), ¿qué figura simboliza al alma desenfrenada que jamás logra saciarse?',
    options: [
      'El tonel perforado (ánfora rota condenada a derramar su contenido)',
      'La caverna subterránea de sombras ilusorias',
      'El mito de Sísifo empujando la roca de la indiferencia',
    ],
    correctIndex: 0,
    hint: 'Alegoría socrática sobre la templanza frente a la modernidad líquida.',
  },
  {
    question: '¿Cuál es el núcleo ontológico no negociable defendido por Fireboy y BONTEN desde la fecundación?',
    options: [
      'La dignidad humana intrínseca, individual e irrepetible del ser en gestación',
      'El bienestar utilitarista subordinado a acuerdos estatales',
      'La autonomía temporal según la etapa de gestación',
    ],
    correctIndex: 0,
    hint: 'Fundamento biológico y ético del Decálogo Provida.',
  },
  {
    question: '¿Cuál es la consigna axiomática de Fireboy que rige a la comunidad BONTEN?',
    options: [
      'El único impulso que no puede ser frenado es la curiosidad',
      'La masa siempre define el rumbo de la historia',
      'El conformismo es la virtud de los prudentes',
    ],
    correctIndex: 0,
    hint: 'Lema grabado en la ficha del fundador de la resistencia.',
  },
];

export default function GobernanzaPage() {
  // Estado del paso: 1 = Filtro de Seguridad Doctrinal, 2 = Credenciales de Gobernanza
  const [step, setStep] = useState<1 | 2>(1);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [filterError, setFilterError] = useState('');

  // Estados del Formulario de Credenciales
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [lockCountdown, setLockCountdown] = useState<number | null>(null);
  const [authSuccessStage, setAuthSuccessStage] = useState(false);

  const currentChallenge = CHALLENGES[challengeIndex];

  const triggerAudio = (type: 'pop' | 'success' | 'toggle') => {
    if (
      typeof window !== 'undefined' &&
      (window as unknown as { bontenAudio?: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio
    ) {
      const audio = (window as unknown as { bontenAudio: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio;
      if (type === 'pop') audio.playTactilePop();
      else if (type === 'success') audio.playSuccess();
      else if (type === 'toggle') audio.playToggle();
    }
  };

  useEffect(() => {
    // Selección aleatoria inicial del desafío
    const randomIndex = Math.floor(Math.random() * CHALLENGES.length);
    setChallengeIndex(randomIndex);
  }, []);

  useEffect(() => {
    if (lockCountdown === null || lockCountdown <= 0) return;
    const timer = setInterval(() => {
      setLockCountdown((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockCountdown]);

  // Manejo del Filtro de Seguridad Doctrinal
  const handleValidateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === null) {
      setFilterError('Por favor selecciona una opción doctrinal para continuar.');
      triggerAudio('pop');
      return;
    }

    if (selectedOption === currentChallenge.correctIndex) {
      setFilterError('');
      triggerAudio('success');
      setStep(2);
    } else {
      triggerAudio('pop');
      setFilterError('Respuesta doctrinal incorrecta. El acceso permanece bloqueado por salvaguarda epistémica.');
    }
  };

  // Manejo de la Autenticación Criptográfica
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockCountdown) return;

    setLoading(true);
    setLoginError('');
    triggerAudio('pop');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429 && data.retryAfterSec) {
          setLockCountdown(data.retryAfterSec);
        }
        throw new Error(data.error || 'Credenciales no autorizadas en el perímetro BONTEN');
      }

      triggerAudio('success');
      setAuthSuccessStage(true);

      // Redirección directa por window.location para garantizar inyección íntegra de cookies
      setTimeout(() => {
        window.location.href = '/admin';
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fallo en autenticación';
      setLoginError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#040814] text-slate-100 relative overflow-hidden select-none">
      {/* Fondo con malla táctica y resplandor sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(rgba(56, 189, 248, 0.25) 1px, transparent 1px), radial-gradient(rgba(134, 25, 143, 0.2) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px',
        }}
      />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Contenedor Principal */}
      <div className="w-full max-w-4xl relative z-10 grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-slate-700/60 bg-slate-900/80 shadow-2xl backdrop-blur-2xl">
        
        {/* Columna Izquierda: Telemetría & Soberanía */}
        <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-[#0a1226]/90 to-[#070d1e]/90">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-sky-400/40 shadow-lg shadow-sky-500/10">
                <Image
                  src="/LOGO_BONTEN_V2.jpeg"
                  alt="Logo BONTEN"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[11px] font-mono tracking-wider text-sky-400 font-semibold block uppercase">
                  Puerta de Gobernanza
                </span>
                <span className="text-lg font-bold text-white tracking-tight">
                  BONTEN SOVEREIGN
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-white">Puesto de Mando Administrativo</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ruta protegida por doble factor: Desafío Doctrinal Previo y Cifrado PBKDF2 SHA-256.
                </p>
              </div>

              {/* Indicador de Fases */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800/90 space-y-2.5 font-mono text-[11.5px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                    Fase 1: Desafío Doctrinal
                  </span>
                  <span className={`font-semibold ${step === 1 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {step === 1 ? 'ACTIVO' : 'APROBADO ✓'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-sky-400 animate-pulse' : 'bg-slate-600'}`} />
                    Fase 2: Criptografía PBKDF2
                  </span>
                  <span className={`font-semibold ${step === 2 ? 'text-sky-400' : 'text-slate-500'}`}>
                    {step === 2 ? (authSuccessStage ? 'AUTORIZADO ✓' : 'DESBLOQUEADO') : 'EN ESPERA'}
                  </span>
                </div>
              </div>

              {/* Telemetría Activa */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-[10.5px] space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>WAF L7 Perimetral</span>
                  <span className="text-emerald-400 font-semibold">100% BLINDADO</span>
                </div>
                <div className="flex justify-between">
                  <span>Firma de Sesión</span>
                  <span className="text-purple-400">HMAC-SHA256</span>
                </div>
                <div className="flex justify-between">
                  <span>Aislamiento en Jail</span>
                  <span className="text-sky-400">Activo (IP Sharding)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 lg:mt-0">
            <blockquote className="text-[11.5px] text-slate-400 italic leading-relaxed">
              &ldquo;La soberanía intelectual y la defensa intransigente de la vida no toleran la debilidad ni el azar.&rdquo;
            </blockquote>
            <span className="text-[10.5px] font-semibold text-sky-400 mt-1 block">
              — Fireboy, Fundador de BONTEN
            </span>
          </div>
        </div>

        {/* Columna Derecha: Contenido según Fase */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between bg-slate-900/50">
          <div>
            {step === 1 ? (
              /* FASE 1: DESAFÍO DOCTRINAL PREVIO */
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-premium badge-royal-sapphire text-xs font-semibold mb-2">
                    <span className="badge-emoji-halo">🧠</span>
                    <span>Filtro de Seguridad Epistémica</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Desafío Doctrinal de Entrada
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Responde al principio fundacional de BONTEN para desbloquear la terminal de comando.
                  </p>
                </div>

                <form onSubmit={handleValidateChallenge} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-amber-400 block font-semibold">
                      Pregunta de Validación #{challengeIndex + 1}:
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
                      {currentChallenge.question}
                    </p>
                    <span className="text-[10px] text-slate-500 italic block">
                      Pista: {currentChallenge.hint}
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {currentChallenge.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            triggerAudio('pop');
                            setSelectedOption(idx);
                            setFilterError('');
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? 'border-sky-500 bg-sky-950/40 text-white ring-1 ring-sky-400/50 shadow-md'
                              : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border ${
                              isSelected
                                ? 'bg-sky-500 border-sky-400 text-white'
                                : 'border-slate-700 text-slate-400 bg-slate-900'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {filterError && (
                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{filterError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-lg shadow-sky-500/20 active:scale-[0.99] cursor-pointer"
                  >
                    Verificar y Desbloquear Terminal →
                  </button>
                </form>
              </div>
            ) : (
              /* FASE 2: TERMINAL DE AUTENTICACIÓN CRIPTOGRÁFICA */
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-premium badge-radiant-emerald text-xs font-semibold mb-2">
                    <span className="badge-emoji-halo">🔓</span>
                    <span>Desafío Aprobado • Terminal Habilitada</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Autenticación Soberana
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Introduce las credenciales maestras de Fireboy o de la Mesa Directiva.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Identificador de Operador
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="fireboy"
                        required
                        autoComplete="username"
                        disabled={loading || authSuccessStage}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950/60 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all font-mono"
                      />
                      <span className="absolute left-3.5 top-2.5 text-slate-400 select-none text-xs">👤</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Clave de Comando PBKDF2
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        autoComplete="current-password"
                        disabled={loading || authSuccessStage}
                        className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-slate-700 bg-slate-950/60 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all font-mono"
                      />
                      <span className="absolute left-3.5 top-2.5 text-slate-400 select-none text-xs">🔑</span>
                      <button
                        type="button"
                        onClick={() => {
                          triggerAudio('toggle');
                          setShowPass(!showPass);
                        }}
                        className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-sky-400 transition-colors"
                      >
                        {showPass ? 'Ocultar' : 'Ver'}
                      </button>
                    </div>
                  </div>

                  {lockCountdown && (
                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-300 text-xs flex items-center gap-2 font-mono">
                      <span>⏳</span>
                      <span>Protección DoS: Bloqueado temporalmente. Reintentar en {lockCountdown}s</span>
                    </div>
                  )}

                  {loginError && (
                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{loginError}</span>
                    </div>
                  )}

                  {authSuccessStage && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 font-mono animate-pulse">
                      <span>✓</span>
                      <span>Firma HMAC verificada. Entrando al Centro de Comando BONTEN...</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        triggerAudio('toggle');
                        setStep(1);
                      }}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/60 text-slate-300 text-xs font-medium transition-all"
                    >
                      ← Volver al Desafío
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !username.trim() || !password.trim() || Boolean(lockCountdown) || authSuccessStage}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-lg shadow-sky-500/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? 'Verificando con PBKDF2...' : authSuccessStage ? 'Acceso Autorizado ✓' : 'Acceder a Gobernanza →'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between text-[11px] text-slate-400">
            <Link
              href="/"
              onClick={() => triggerAudio('pop')}
              className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Regresar al Portal Público</span>
            </Link>
            <span className="font-mono text-slate-500">BONTEN OS v2.6.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
