'use client';

import { useState, useEffect } from 'react';

interface AdminMember {
  id: number;
  username: string;
  email: string;
  role: string;
  avatarUrl: string;
}

export function AdminTeamManager() {
  const [admins, setAdmins] = useState<AdminMember[]>([]);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '', role: 'ROLE_ADMIN' });
  const [feedback, setFeedback] = useState('');

  // Gestión de Contraseña del Admin
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdFeedback, setPwdFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdFeedback({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
      return;
    }
    if (newPassword.length < 8) {
      setPwdFeedback({ type: 'error', text: 'La nueva contraseña debe tener al menos 8 caracteres.' });
      return;
    }

    setPwdLoading(true);
    setPwdFeedback(null);
    try {
      const res = await fetch('/api/admin/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar credenciales');
      setPwdFeedback({ type: 'success', text: data.message || 'Contraseña actualizada correctamente.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setPwdFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Error desconocido' });
    } finally {
      setPwdLoading(false);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/admin/team');
      if (res.ok) {
        const json = await res.json();
        setAdmins(json.admins);
        setIsSuperadmin(json.isSuperadmin);
      }
    } catch {
      // Silencioso
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFeedback('✓ Administrador asignado exitosamente');
      setShowAddForm(false);
      setNewAdmin({ username: '', email: '', password: '', role: 'ROLE_ADMIN' });
      fetchTeam();
    } catch (err: unknown) {
      setFeedback(`✗ ${err instanceof Error ? err.message : 'Error al crear'}`);
    }
  };

  const handleRevoke = async (id: number) => {
    if (!confirm('¿Revocar privilegios de administrador a este usuario?')) return;
    try {
      const res = await fetch(`/api/admin/team?userId=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFeedback('✓ Acceso revocado');
      fetchTeam();
    } catch (err: unknown) {
      setFeedback(`✗ ${err instanceof Error ? err.message : 'Error al revocar'}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="admin-card flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-[var(--title-color)]">
            Equipo de Administración
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Fireboy tiene control exclusivo para delegar o revocar accesos
          </p>
        </div>
        {isSuperadmin && (
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playTactilePop: () => void } }).bontenAudio) {
                (window as unknown as { bontenAudio: { playTactilePop: () => void } }).bontenAudio.playTactilePop();
              }
              setShowAddForm(!showAddForm);
            }}
            className="btn-admin-primary text-xs !py-2 !px-3.5"
          >
            {showAddForm ? 'Cerrar' : '+ Designar Administrador'}
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 text-xs font-medium rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/40 text-sky-700 dark:text-sky-300">
          {feedback}
        </div>
      )}

      {showAddForm && isSuperadmin && (
        <form onSubmit={handleCreate} className="admin-card space-y-4 border-sky-500/30">
          <h4 className="text-xs font-semibold text-[var(--title-color)]">Designar Nuevo Administrador</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Usuario" value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} className="admin-input" required />
            <input type="email" placeholder="Correo" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} className="admin-input" required />
            <input type="password" placeholder="Contraseña (mín 8)" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} className="admin-input" required minLength={8} />
          </div>
          <button type="submit" className="btn-admin-primary text-xs">Confirmar y Asignar</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {admins.map((admin) => (
          <div key={admin.id} className="admin-card flex justify-between items-center hover:border-sky-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-500/20 flex items-center justify-center font-bold text-sm text-sky-600 dark:text-sky-400">
                {admin.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text-dark)] flex items-center gap-2">
                  <span>{admin.username}</span>
                  {admin.role === 'ROLE_SUPERADMIN' ? (
                    <span className="badge-premium badge-gold-fire text-[10.5px]">
                      <span className="badge-emoji-halo">👑</span>
                      Superadmin
                    </span>
                  ) : (
                    <span className="badge-premium badge-royal-sapphire text-[10.5px]">
                      <span className="badge-emoji-halo">🛡️</span>
                      Administrador
                    </span>
                  )}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{admin.email}</div>
              </div>
            </div>
            {isSuperadmin && admin.role !== 'ROLE_SUPERADMIN' && (
              <button
                onClick={() => handleRevoke(admin.id)}
                className="px-2.5 py-1 rounded-lg text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
              >
                Revocar
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Gestión de Credenciales de Mi Cuenta */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-white/10">
        <div className="pb-3 mb-3">
          <h4 className="text-sm font-semibold text-[var(--title-color)] flex items-center gap-2">
            <span className="badge-emoji-halo">🔑</span>
            <span>Seguridad de Mi Cuenta</span>
            <span className="badge-premium badge-royal-sapphire text-[10px] !py-0.5 !px-2">PBKDF2 SHA-256</span>
          </h4>
          <p className="text-xs text-[var(--text-muted)]">
            Actualiza tu clave de acceso de administrador con cifrado criptográfico robusto
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 space-y-3 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Clave Actual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="admin-input text-xs"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Nueva Clave</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="admin-input text-xs"
                placeholder="Mín. 8 caracteres"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Confirmar Nueva</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="admin-input text-xs"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {pwdFeedback && (
            <div className={`p-2.5 rounded-lg text-xs font-medium ${
              pwdFeedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50'
            }`}>
              {pwdFeedback.text}
            </div>
          )}

          <button
            type="submit"
            disabled={pwdLoading}
            className="btn-admin-primary text-xs !py-1.5 !px-4 cursor-pointer"
          >
            {pwdLoading ? 'Actualizando...' : 'Actualizar Mi Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
