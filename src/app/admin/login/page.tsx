'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockCountdown, setLockCountdown] = useState<number | null>(null);

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
        throw new Error(data.error || 'Credenciales no autorizadas');
      }

      // Redirigir al panel de administración
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#060b18] relative overflow-hidden">
      {/* Luz ambiental sutil */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-3xl shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="relative w-14 h-14 mx-auto rounded-2xl overflow-hidden border-2 border-sky-400/40 shadow-lg mb-3">
              <img
                src="/LOGO_BONTEN_V2.jpeg"
                alt="BONTEN Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-premium badge-royal-sapphire text-xs font-semibold mb-2">
              <span className="badge-emoji-halo">🔒</span>
              <span>Acceso Administrador Soberano</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Autenticación Soberana</h1>
            <p className="text-xs text-slate-400 mt-1">Gobernanza Administrativa BONTEN</p>
            <div className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>PBKDF2 SHA-256 • Ventana Deslizante Anti-Bruteforce</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span className="badge-emoji-halo">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {lockCountdown !== null && (
            <div className="mb-4 p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs text-center">
              🔒 Espera <strong>{lockCountdown}s</strong> para reintentar.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm transition-all"
                placeholder="Nombre de usuario"
                required
                disabled={loading || lockCountdown !== null}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-14 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm transition-all"
                  placeholder="••••••••"
                  required
                  disabled={loading || lockCountdown !== null}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-sky-400 transition-colors"
                >
                  {showPass ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || lockCountdown !== null}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-sky-400 transition-colors">
              ← Volver al sitio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
