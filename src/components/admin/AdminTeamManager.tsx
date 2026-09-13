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
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>👥</span> Equipo de Administración & Roles (RBAC)
          </h3>
          <p className="text-xs text-slate-400">Fireboy es el Superadmin Principal con jerarquía de gobernanza y directiva</p>
        </div>
        {isSuperadmin && (
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-admin-primary text-xs">
            {showAddForm ? 'Cerrar' : '+ Designar Administrador'}
          </button>
        )}
      </div>

      {feedback && <div className="p-3 text-xs font-mono rounded bg-slate-800 border border-cyan-500/30 text-cyan-300">{feedback}</div>}

      {showAddForm && isSuperadmin && (
        <form onSubmit={handleCreate} className="admin-card space-y-4 border-cyan-500/30">
          <h4 className="text-xs font-mono text-cyan-400 font-bold">Designar Nuevo Administrador</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Usuario" value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} className="admin-input" required />
            <input type="email" placeholder="Correo electrónico" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} className="admin-input" required />
            <input type="password" placeholder="Contraseña (mín 8)" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} className="admin-input" required minLength={8} />
          </div>
          <button type="submit" className="btn-admin-primary text-xs">Confirmar y Asignar Privilegios</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {admins.map((admin) => (
          <div key={admin.id} className="admin-card flex justify-between items-center hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center font-bold text-sm text-cyan-300">
                {admin.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{admin.username}</span>
                  {admin.role === 'ROLE_SUPERADMIN' ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-700/50">🔥 Superadmin Principal</span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">🛡️ Administrador</span>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{admin.email}</div>
              </div>
            </div>
            {isSuperadmin && admin.role !== 'ROLE_SUPERADMIN' && (
              <button onClick={() => handleRevoke(admin.id)} className="px-2.5 py-1 rounded text-[11px] font-mono bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 transition-colors">
                Revocar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
