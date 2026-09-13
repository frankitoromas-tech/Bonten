'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Token de restablecimiento ausente en la URL');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 8) {
      setError('La contraseña debe tener un mínimo de 8 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fallo al restablecer contraseña');

      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar contraseña';
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
            🔒
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Nueva Contraseña</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">Actualización segura con expiración de token</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        {success ? (
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono text-center space-y-4">
            <p>✓ ¡Tu contraseña ha sido actualizada con éxito!</p>
            <p className="text-slate-300">El token de restablecimiento ha sido invalidado automáticamente.</p>
            <Link href="/auth/login" className="btn-admin-primary inline-block text-xs py-2 px-6">
              Iniciar Sesión Ahora
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Nueva Contraseña (Mínimo 8 caracteres)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="admin-input"
                required
                minLength={8}
                placeholder="••••••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="admin-input"
                required
                minLength={8}
                placeholder="••••••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-admin-primary w-full mt-2">
              {loading ? 'Validando y Hasheando...' : 'Guardar Nueva Contraseña'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-slate-400 flex justify-between items-center">
          <Link href="/auth/login" className="hover:text-cyan-400">
            ← Volver al login
          </Link>
          <span className="font-mono text-[10px]">PBKDF2 RE-ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
}
