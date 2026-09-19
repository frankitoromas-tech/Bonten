'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function MemberLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitRedirect = searchParams.get('redirect');
  const redirectUrl = explicitRedirect || '/comunidad';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Credenciales no válidas');

      // Automatización de Membresía y Pertenencia a la Comunidad
      if (typeof window !== 'undefined') {
        localStorage.setItem('bonten:pledge', 'true');
        if (data.user?.username) {
          localStorage.setItem('bonten:member_alias', data.user.username);
        }
        if (data.user?.role) {
          localStorage.setItem('bonten:member_role', data.user.role);
        }
        if (data.user?.email) {
          localStorage.setItem('bonten:member_email', data.user.email);
        }
      }

      // Si es administrador sin redirección forzada previa, enviar al Centro de Control o Comunidad
      const targetDestination = data.isAdmin && !explicitRedirect ? '/admin' : redirectUrl;

      router.push(targetDestination);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error en inicio de sesión';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#060b18] relative">
      <div className="w-full max-w-md admin-card border-white/10 shadow-2xl backdrop-blur-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 mb-3 text-xl">
            ⚔️
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Acceso a la Comunidad BONTEN</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Ingreso unificado de miembros y administración con adhesión comunitaria inmediata
          </p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono">
            <span>✓</span> Adhesión automatizada al Muro & Debates
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Usuario o Correo Electrónico</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="admin-input"
              required
              placeholder="tu_usuario o correo@ejemplo.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-mono text-slate-300">Contraseña</label>
              <Link href="/auth/forgot-password" className="text-[11px] text-cyan-400 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input pr-10"
                required
                placeholder="••••••••"
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

          <button type="submit" disabled={loading} className="btn-admin-primary w-full mt-2">
            {loading ? 'Verificando con timingSafeEqual...' : 'Ingresar a la Comunidad'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-slate-400 flex justify-between items-center">
          <Link href="/auth/register" className="hover:text-cyan-400">
            ¿No tienes cuenta? <strong className="text-cyan-400 underline">Regístrate</strong>
          </Link>
          <Link href="/debates" className="hover:text-slate-300">
            ← Debates
          </Link>
        </div>
      </div>
    </div>
  );
}
