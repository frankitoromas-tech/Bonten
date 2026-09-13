'use client';

import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  role?: string;
}

export function AdminAccountModal({ isOpen, onClose, username = 'fireboy', role = 'ROLE_SUPERADMIN' }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'idle' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: '',
  });

  if (!isOpen) return null;

  const triggerAudio = (type: 'pop' | 'success') => {
    if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playTactilePop: () => void; playSuccess: () => void } }).bontenAudio) {
      const audio = (window as unknown as { bontenAudio: { playTactilePop: () => void; playSuccess: () => void } }).bontenAudio;
      if (type === 'pop') audio.playTactilePop();
      else if (type === 'success') audio.playSuccess();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setFeedback({ type: 'error', msg: 'La nueva clave debe tener al menos 8 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', msg: 'Las nuevas contraseñas no coinciden.' });
      return;
    }

    setLoading(true);
    setFeedback({ type: 'idle', msg: '' });

    try {
      const res = await fetch('/api/admin/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo actualizar la clave.');

      triggerAudio('success');
      setFeedback({ type: 'success', msg: data.message || 'Contraseña actualizada con éxito.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setFeedback({ type: 'error', msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="admin-card w-full max-w-md shadow-2xl !p-6 space-y-5 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="badge-emoji-halo text-lg">🔐</span>
            <div>
              <h3 className="text-sm font-bold text-[var(--title-color)]">Seguridad de la Cuenta</h3>
              <p className="text-xs text-[var(--text-muted)]">@{username} • {role === 'ROLE_SUPERADMIN' ? 'Superadmin Soberano' : 'Admin'}</p>
            </div>
          </div>
          <button onClick={() => { triggerAudio('pop'); onClose(); }} className="btn-admin-secondary !py-1 !px-2.5 text-xs">✕</button>
        </div>

        {feedback.msg && (
          <div className={`p-3 rounded-xl text-xs font-medium border ${feedback.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/40 text-rose-700 dark:text-rose-300'}`}>
            {feedback.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Contraseña Actual</label>
            <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="admin-input text-xs" placeholder="••••••••••••" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Nueva Contraseña (mínimo 8 caracteres)</label>
            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="admin-input text-xs" placeholder="••••••••••••" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Confirmar Nueva Contraseña</label>
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="admin-input text-xs" placeholder="••••••••••••" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { triggerAudio('pop'); onClose(); }} className="btn-admin-secondary text-xs">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-admin-primary text-xs">
              {loading ? 'Cifrando...' : 'Actualizar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
