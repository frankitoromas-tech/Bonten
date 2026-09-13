'use client';

import { useState, useEffect } from 'react';
import type { SecurityEvent } from '@/lib/security/rateLimiter';

interface SecurityData {
  defenseEngine: string;
  activeSession: { username: string; role: string; expiresAt: string | null };
  rateLimit: { totalTrackedIps: number; blockedCount: number };
  events: SecurityEvent[];
  securityHeaders: Record<string, string>;
}

export function SecurityMonitor() {
  const [data, setData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-400 font-mono text-xs">Cargando telemetría de seguridad...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30">
          <div className="text-[11px] font-mono text-cyan-400">Motor de Seguridad</div>
          <div className="text-base font-bold text-white mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {data.defenseEngine}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Spring Security 6 Ready</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30">
          <div className="text-[11px] font-mono text-purple-400">IPs en Rastreo / Bloqueadas</div>
          <div className="text-base font-bold text-white mt-1">
            {data.rateLimit.totalTrackedIps} <span className="text-rose-400 text-xs">({data.rateLimit.blockedCount} bloqueadas)</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Ventana deslizante 15 min</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
          <div className="text-[11px] font-mono text-emerald-400">Protección Clickjacking</div>
          <div className="text-base font-bold text-white mt-1">frame-ancestors 'none'</div>
          <div className="text-[10px] text-slate-400 mt-1">Anti-phishing en iframes</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
          <div className="text-[11px] font-mono text-amber-400">Sesión Activa</div>
          <div className="text-base font-bold text-white mt-1">{data.activeSession.username}</div>
          <div className="text-[10px] text-slate-400 mt-1">{data.activeSession.role}</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Registro de Eventos de Seguridad y Auditoría (SAST / WAF)
          </h4>
          <button onClick={fetchStats} className="text-xs font-mono text-cyan-400 hover:underline">Refrescar</button>
        </div>

        {data.events.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4">No se han registrado incidentes ni violaciones de acceso.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-white/10 text-slate-400">
                <tr>
                  <th className="pb-2">Fecha / Hora</th>
                  <th className="pb-2">Tipo</th>
                  <th className="pb-2">IP Origen</th>
                  <th className="pb-2">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.events.slice(0, 10).map((ev) => (
                  <tr key={ev.id} className="hover:bg-white/5">
                    <td className="py-2 text-slate-400">{new Date(ev.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${ev.type === 'LOGIN_SUCCESS' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                        {ev.type}
                      </span>
                    </td>
                    <td className="py-2 text-cyan-400">{ev.ip}</td>
                    <td className="py-2 text-slate-300">{ev.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
