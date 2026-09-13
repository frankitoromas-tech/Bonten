'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('fireboy');
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
      {/* Luz ambiental de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="admin-card border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mb-4 text-2xl">
              🛡️
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Portal de Administración</h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">BONTEN CORE // ZONA PRIVADA SEGURA</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {lockCountdown !== null && (
            <div className="mb-6 p-3 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono text-center">
              🔒 Bloqueo temporal por tasa de peticiones. Espera <strong>{lockCountdown}s</strong> antes de reintentar.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Identificador de Administrador</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="admin-input"
                required
                disabled={loading || lockCountdown !== null}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Clave de Seguridad</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input pr-10"
                  required
                  disabled={loading || lockCountdown !== null}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  {showPass ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || lockCountdown !== null}
              className="btn-admin-primary w-full mt-2"
            >
              {loading ? 'Verificando con timingSafeEqual...' : 'Ingresar al Sistema'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-slate-500 flex justify-between items-center">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              ← Volver al sitio público
            </Link>
            <span className="font-mono text-[10px]">OWASP TOP 10 HARDENED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
