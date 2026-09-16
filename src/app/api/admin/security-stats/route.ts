// =========================================
//  API TELEMETRÍA DE SEGURIDAD — BONTEN DEFENSE
//  Auditoría en tiempo real y estadísticas defensivas.
// =========================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getSecurityEvents,
  getRateLimitStats,
  banIp,
  unbanIp,
  listBannedIps,
} from '@/lib/security/rateLimiter';
import { requireAdmin } from '@/lib/security/authorization';
import { validateRequestOrigin } from '@/lib/security/csrf';
import { sanitizePlainText } from '@/lib/security/sanitizer';

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req, ['ROLE_SUPERADMIN', 'ROLE_ADMIN']);
  if (!auth.ok) return auth.response;

  const events = getSecurityEvents();
  const rateLimit = getRateLimitStats();
  const bannedIps = listBannedIps();

  return NextResponse.json({
    activeSession: {
      username: auth.actor.username,
      role: auth.actor.role,
      expiresAt: auth.actor.exp ? new Date(auth.actor.exp * 1000).toISOString() : null,
    },
    rateLimit,
    bannedIps,
    events,
    defenseEngine: process.env.SPRING_SECURITY_ENABLED === 'true' ? 'Spring Security 6' : 'Edge Crypto Guard',
    securityHeaders: {
      xFrameOptions: 'DENY',
      contentSecurityPolicy: "frame-ancestors 'none'",
      xContentTypeOptions: 'nosniff',
      hsts: 'max-age=63072000',
      sameSiteCookies: 'Strict',
    },
  });
}

export async function POST(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 });
  }

  const auth = requireAdmin(req, ['ROLE_SUPERADMIN', 'ROLE_ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { action, ip, reason, durationMinutes } = body;

    if (!ip || typeof ip !== 'string') {
      return NextResponse.json({ error: 'IP requerida' }, { status: 400 });
    }

    const cleanIp = sanitizePlainText(ip);

    if (action === 'ban') {
      banIp(cleanIp, sanitizePlainText(reason || 'Bloqueo manual administrativo'), durationMinutes || 60);
      return NextResponse.json({
        ok: true,
        message: `✓ IP ${cleanIp} ha sido agregada a la lista negra (Jail)`,
        rateLimit: getRateLimitStats(),
        bannedIps: listBannedIps(),
      });
    }

    if (action === 'unban') {
      unbanIp(cleanIp);
      return NextResponse.json({
        ok: true,
        message: `✓ IP ${cleanIp} ha sido removida de la lista negra`,
        rateLimit: getRateLimitStats(),
        bannedIps: listBannedIps(),
      });
    }

    return NextResponse.json({ error: 'Acción no soportada' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Error procesando solicitud de seguridad' }, { status: 500 });
  }
}
