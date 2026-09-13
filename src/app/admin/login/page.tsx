'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockCountdown, setLockCountdown] = useState<number | null>(null);

  const triggerAudio = (type: 'pop' | 'success' | 'toggle') => {
    if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio) {
      const audio = (window as unknown as { bontenAudio: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio;
      if (type === 'pop') audio.playTactilePop();
      else if (type === 'success') audio.playSuccess();
      else if (type === 'toggle') audio.playToggle();
    }
  };

  useEffect(() => {
    if (lockCountdown === null || lockCountdown <= 0) return;
    const timer = setInterval(() => {
      setLockCountdown((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockCountdown) return;

    setLoading(true);
    setError('');
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
        throw new Error(data.error || 'Credenciales no autorizadas en perímetro BONTEN');
      }

      triggerAudio('success');
      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fallo en autenticación';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#040814] text-slate-100 relative overflow-hidden select-none">
      {/* Malla táctica y luces ambientales */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.25) 1px, transparent 1px), radial-gradient(rgba(134, 25, 143, 0.2) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px',
        }}
      />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Tarjeta Inmersiva de Dos Secciones */}
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
                  Terminal Privilegiada
                </span>
                <span className="text-lg font-bold text-white tracking-tight">
                  BONTEN CORE
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-white">Gobernanza Doctrinal</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Acceso restringido para el fundador Fireboy y administradores acreditados de la Mesa Directiva.
                </p>
              </div>

              {/* Telemetría Activa en Tiempo Real */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800/90 space-y-2.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    WAF Perimetral
                  </span>
                  <span className="text-emerald-400 font-semibold">L7 ACTIVO</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Cifrado de Credenciales</span>
                  <span className="text-sky-300">PBKDF2 SHA-256</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Session Fingerprint</span>
                  <span className="text-purple-400">HMAC Sentinel</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Aislamiento en Jail</span>
                  <span className="text-amber-400">Anti-Bruteforce</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 lg:mt-0">
            <blockquote className="text-[11.5px] text-slate-400 italic leading-relaxed">
              &ldquo;La soberanía intelectual y la defensa intransigente de la vida exigen bastiones inexpugnables.&rdquo;
            </blockquote>
            <span className="text-[10.5px] font-semibold text-sky-400 mt-1 block">
              — Fireboy, Fundador de BONTEN
            </span>
          </div>
        </div>

        {/* Columna Derecha: Formulario de Autenticación Soberana */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between bg-slate-900/50">
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-premium badge-royal-sapphire text-xs font-semibold mb-2">
                <span className="badge-emoji-halo">🛡️</span>
                <span>Puerta de Acceso Soberana</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Iniciar Sesión de Comando</h1>
              <p className="text-xs text-slate-400 mt-1">Ingresa las credenciales de alta seguridad para administrar la plataforma.</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
                <span className="text-base">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {lockCountdown !== null && (
              <div className="mb-5 p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs text-center font-mono">
                🔒 Bloqueo defensivo activado. Reintentos disponibles en <strong>{lockCountdown}s</strong>.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Identificador de Administrador</span>
                  <span className="text-[10px] text-slate-500 font-mono">USUARIO SOBERANO</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 select-none text-xs">👤</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs transition-all"
                    placeholder="Ej. fireboy"
                    required
                    disabled={loading || lockCountdown !== null}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Contraseña Criptográfica</span>
                  <span className="text-[10px] text-slate-500 font-mono">100K PBKDF2</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 select-none text-xs">🔑</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-12 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs transition-all font-mono"
                    placeholder="••••••••••••"
                    required
                    disabled={loading || lockCountdown !== null}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      triggerAudio('toggle');
                      setShowPass(!showPass);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400 transition-colors p-1"
                    title={showPass ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPass ? (
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || lockCountdown !== null || !username.trim() || !password.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Autenticando en Perímetro...</span>
                  </>
                ) : (
                  <>
                    <span>Acceder a Gobernanza</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <Link href="/" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
              <span>←</span> Volver al sitio público
            </Link>
            <span className="font-mono text-[10px] text-slate-600">ID: BONTEN-WAF-v2.5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
