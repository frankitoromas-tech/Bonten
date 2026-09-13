'use client';

import { useState, useEffect } from 'react';
import type { SecurityEvent } from '@/lib/security/rateLimiter';

interface BannedIpEntry {
  ip: string;
  reason: string;
  bannedAt: number;
  expiresAt: number;
}

interface SecurityData {
  defenseEngine: string;
  activeSession: { username: string; role: string; expiresAt: string | null };
  rateLimit: {
    totalTrackedIps: number;
    blockedCount: number;
    bannedCount: number;
    threatLevel: 'OPTIMAL' | 'ELEVATED' | 'HIGH';
  };
  bannedIps: BannedIpEntry[];
  events: SecurityEvent[];
  securityHeaders: Record<string, string>;
}

export function SecurityMonitor() {
  const [data, setData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newBanIp, setNewBanIp] = useState('');
  const [newBanReason, setNewBanReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState('');
  const [eventFilter, setEventFilter] = useState<'ALL' | 'LOGIN' | 'BAN' | 'ATTACK'>('ALL');

  const triggerAudio = (type: 'pop' | 'success' | 'toggle') => {
    if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio) {
      const audio = (window as unknown as { bontenAudio: { playTactilePop: () => void; playSuccess: () => void; playToggle: () => void } }).bontenAudio;
      if (type === 'pop') audio.playTactilePop();
      else if (type === 'success') audio.playSuccess();
      else if (type === 'toggle') audio.playToggle();
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/security-stats');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // Silencioso en caso de error de red
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Polling cada 10s
    return () => clearInterval(interval);
  }, []);

  const handleManualBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanIp.trim() || actionLoading) return;
    setActionLoading(true);
    triggerAudio('pop');

    try {
      const res = await fetch('/api/admin/security-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'ban',
          ip: newBanIp.trim(),
          reason: newBanReason.trim() || 'Bloqueo manual por operador Fireboy',
          durationMinutes: 120,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Fallo al aislar IP');

      triggerAudio('success');
      setActionFeedback(result.message || '✓ IP aislada correctamente en Jail');
      setNewBanIp('');
      setNewBanReason('');
      fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al aislar IP';
      setActionFeedback(`✗ ${msg}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnban = async (ip: string) => {
    if (actionLoading) return;
    setActionLoading(true);
    triggerAudio('toggle');

    try {
      const res = await fetch('/api/admin/security-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'unban', ip }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Fallo al remover IP');

      triggerAudio('success');
      setActionFeedback(result.message || '✓ IP liberada de la lista negra');
      fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al remover IP';
      setActionFeedback(`✗ ${msg}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-400 font-mono text-xs">Cargando telemetría de seguridad...</div>;
  }

  const threat = data.rateLimit.threatLevel || 'OPTIMAL';
  const threatBadgeConfig = {
    OPTIMAL: {
      color: 'bg-emerald-500',
      text: 'Óptimo (Perímetro Seguro)',
      border: 'border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400',
    },
    ELEVATED: {
      color: 'bg-amber-500',
      text: 'Elevado (Vigilancia Activa)',
      border: 'border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400',
    },
    HIGH: {
      color: 'bg-rose-500 animate-pulse',
      text: 'Crítico (Ataque Detectado)',
      border: 'border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400',
    },
  }[threat];

  const filteredEvents = (data.events || []).filter((ev) => {
    if (eventFilter === 'ALL') return true;
    if (eventFilter === 'LOGIN') return ev.type === 'LOGIN_SUCCESS' || ev.type === 'LOGIN_FAILED';
    if (eventFilter === 'BAN') return ev.type.includes('BAN') || ev.type === 'RATE_LIMIT_BLOCK';
    if (eventFilter === 'ATTACK') return ev.type === 'CSRF_REJECTED' || ev.type === 'SUSPICIOUS_PROBE' || ev.type === 'SESSION_HIJACK_ATTEMPT';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Notificación de Acción */}
      {actionFeedback && (
        <div className="p-3 text-xs font-medium rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/40 text-sky-700 dark:text-sky-300 flex justify-between items-center">
          <span>{actionFeedback}</span>
          <button onClick={() => setActionFeedback('')} className="text-slate-400 hover:text-slate-600 text-xs ml-2">×</button>
        </div>
      )}

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-stat-card card-3d-tilt">
          <div className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">Nivel de Amenaza Perimetral</div>
          <div className="text-sm font-bold text-[var(--title-color)] mt-1 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${threatBadgeConfig.color}`} />
            {threatBadgeConfig.text}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">Algoritmo de Frecuencia L7</div>
        </div>

        <div className="admin-stat-card card-3d-tilt">
          <div className="text-[11px] font-semibold text-pink-600 dark:text-pink-400">IPs en Rastreo / En Jail</div>
          <div className="text-base font-bold text-[var(--title-color)] mt-1">
            {data.rateLimit.totalTrackedIps} <span className="text-rose-500 text-xs">({data.rateLimit.bannedCount || data.rateLimit.blockedCount} en Jail)</span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">Ventana deslizante de 15 min</div>
        </div>

        <div className="admin-stat-card card-3d-tilt">
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Blindaje de Cabeceras</div>
          <div className="text-sm font-bold text-[var(--title-color)] mt-1">HSTS & COOP/CORP</div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">Anti-Clickjacking & X-XSS</div>
        </div>

        <div className="admin-stat-card card-3d-tilt">
          <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Sesión Activa & Fingerprint</div>
          <div className="text-sm font-bold text-[var(--title-color)] mt-1">{data.activeSession.username}</div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">{data.activeSession.role} • HMAC-SHA256</div>
        </div>
      </div>

      {/* Consola de Control Perimetral & IP Jail */}
      <div className="admin-card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <h4 className="text-sm font-semibold text-[var(--title-color)] flex items-center gap-2">
              <span>🔒</span> Consola de Control Perimetral & IP Jail
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              Aislamiento inmediato de direcciones IP maliciosas o intrusiones automatizadas
            </p>
          </div>
          <span className="badge-premium badge-royal-sapphire text-[11px]">
            <span className="badge-emoji-halo">🛡️</span>
            {data.bannedIps?.length || 0} IPs Aisladas
          </span>
        </div>

        {/* Formulario de Aislamiento Manual */}
        <form onSubmit={handleManualBan} className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
          <input
            type="text"
            placeholder="Dirección IPv4 o IPv6 (ej. 192.168.1.50)"
            value={newBanIp}
            onChange={(e) => setNewBanIp(e.target.value)}
            className="admin-input sm:col-span-4 !text-xs"
            disabled={actionLoading}
            required
          />
          <input
            type="text"
            placeholder="Motivo del aislamiento (ej. Intento de inyección o scraping no autorizado)"
            value={newBanReason}
            onChange={(e) => setNewBanReason(e.target.value)}
            className="admin-input sm:col-span-6 !text-xs"
            disabled={actionLoading}
          />
          <button
            type="submit"
            disabled={actionLoading || !newBanIp.trim()}
            className="btn-admin-primary sm:col-span-2 text-xs !py-2 flex items-center justify-center gap-1.5"
          >
            <span>⚡</span> Aislar en Jail
          </button>
        </form>

        {/* Lista de IPs en Jail */}
        {(!data.bannedIps || data.bannedIps.length === 0) ? (
          <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-900/30 border border-slate-200/60 dark:border-white/5 text-center text-xs text-[var(--text-muted)]">
            ✓ No hay direcciones IP retenidas en Jail. El perímetro opera sin restricciones activas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200/80 dark:border-white/10 text-[var(--text-muted)] font-medium">
                <tr>
                  <th className="pb-2">IP Aislada</th>
                  <th className="pb-2">Motivo</th>
                  <th className="pb-2">Fecha Aislamiento</th>
                  <th className="pb-2 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {data.bannedIps.map((b) => (
                  <tr key={b.ip} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-2.5 font-mono text-rose-600 dark:text-rose-400 font-semibold">{b.ip}</td>
                    <td className="py-2.5 text-[var(--text-dark)]">{b.reason}</td>
                    <td className="py-2.5 text-[var(--text-muted)]">{new Date(b.bannedAt).toLocaleTimeString()}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleUnban(b.ip)}
                        disabled={actionLoading}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100 transition-all cursor-pointer"
                      >
                        Levantar Bloqueo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Telemetría y Registro de Auditoría WAF */}
      <div className="admin-card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h4 className="text-sm font-semibold text-[var(--title-color)] flex items-center gap-2">
              <span>🛡️</span> Telemetría de Seguridad y Auditoría en Vivo (WAF / L7)
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              Eventos de autenticación, mitigación de ataques y violaciones de política
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchStats} className="btn-admin-secondary text-xs !py-1 !px-2.5">
              Refrescar
            </button>
          </div>
        </div>

        {/* Filtros de Eventos */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-medium text-[var(--text-muted)] mr-1">Filtrar:</span>
          {(['ALL', 'LOGIN', 'BAN', 'ATTACK'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                triggerAudio('toggle');
                setEventFilter(filter);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                eventFilter === filter
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-sky-400/40'
              }`}
            >
              {filter === 'ALL' && 'Todos los Eventos'}
              {filter === 'LOGIN' && 'Accesos & Logins'}
              {filter === 'BAN' && 'Bloqueos & Jail'}
              {filter === 'ATTACK' && 'Alertas L7 (CSRF/Secuestro)'}
            </button>
          ))}
        </div>

        {filteredEvents.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] italic py-4">No se han registrado incidentes en esta categoría.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200/80 dark:border-white/10 text-[var(--text-muted)] font-medium">
                <tr>
                  <th className="pb-2.5">Fecha / Hora</th>
                  <th className="pb-2.5">Tipo de Evento</th>
                  <th className="pb-2.5">IP Origen</th>
                  <th className="pb-2.5">Detalle Operacional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredEvents.slice(0, 15).map((ev) => {
                  const isSuccess = ev.type === 'LOGIN_SUCCESS' || ev.type === 'IP_UNBANNED';
                  const isWarning = ev.type.includes('BAN') || ev.type === 'RATE_LIMIT_BLOCK';
                  const isDanger = ev.type === 'CSRF_REJECTED' || ev.type === 'SUSPICIOUS_PROBE' || ev.type === 'SESSION_HIJACK_ATTEMPT';

                  return (
                    <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-2.5 text-[var(--text-muted)]">{new Date(ev.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          isSuccess
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                            : isWarning
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                            : isDanger
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {ev.type}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-sky-600 dark:text-sky-400">{ev.ip}</td>
                      <td className="py-2.5 text-[var(--text-dark)]">{ev.detail}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
