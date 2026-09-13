'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MemberRegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar la cuenta');

      router.push('/debates');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fallo en registro';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#060b18] relative">
      <div className="w-full max-w-md admin-card border-white/10 shadow-2xl backdrop-blur-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 mb-3 text-xl">
            ✍️
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Registro de Miembro</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">Únete a la resistencia y debate con rigor filosófico</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Nombre de Usuario (Pseudónimo)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-input"
              required
              minLength={3}
              placeholder="Ej. Socrates2026"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              required
              placeholder="tu_correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Contraseña (Mínimo 8 caracteres)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              required
              minLength={8}
              placeholder="••••••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-admin-primary w-full mt-2">
            {loading ? 'Cifrando credenciales con PBKDF2...' : 'Crear Cuenta Segura'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-slate-400 flex justify-between items-center">
          <Link href="/auth/login" className="hover:text-cyan-400">
            ¿Ya tienes cuenta? <strong className="text-cyan-400 underline">Inicia Sesión</strong>
          </Link>
          <Link href="/debates" className="hover:text-slate-300">
            ← Debates
          </Link>
        </div>
      </div>
    </div>
  );
}
