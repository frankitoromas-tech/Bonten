'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setDevResetUrl(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al solicitar restablecimiento');

      setMessage(data.message);
      if (data.devResetUrl) {
        setDevResetUrl(data.devResetUrl);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fallo en solicitud';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#060b18] relative">
      <div className="w-full max-w-md admin-card border-white/10 shadow-2xl backdrop-blur-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-3 text-xl">
            🔑
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Recuperar Contraseña</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">Generación de token criptográfico de un solo uso</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono space-y-3">
            <p>✓ {message}</p>
            {devResetUrl && (
              <div className="pt-2 border-t border-emerald-500/20">
                <p className="text-[10px] text-slate-300 mb-1">Enlace generado para pruebas directas:</p>
                <Link href={devResetUrl} className="text-cyan-400 underline break-all hover:text-cyan-200">
                  {devResetUrl}
                </Link>
              </div>
            )}
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Correo Electrónico Registrado</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                required
                placeholder="tu_correo@ejemplo.com"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-admin-primary w-full mt-2">
              {loading ? 'Generando token SHA-256...' : 'Enviar Enlace de Recuperación'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-slate-400 flex justify-between items-center">
          <Link href="/auth/login" className="hover:text-cyan-400">
            ← Volver a Iniciar Sesión
          </Link>
          <span className="font-mono text-[10px]">OWASP ANTI-ENUMERATION</span>
        </div>
      </div>
    </div>
  );
}
