// =========================================
//  API TELEMETRÍA DE SEGURIDAD — BONTEN DEFENSE
//  Auditoría en tiempo real y estadísticas defensivas.
// =========================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSecurityEvents, getRateLimitStats } from '@/lib/security/rateLimiter';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const { valid, payload } = verifySessionToken(token || '');

  if (!valid) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const events = getSecurityEvents();
  const rateLimit = getRateLimitStats();

  return NextResponse.json({
    activeSession: {
      username: payload?.username,
      role: payload?.role,
      expiresAt: payload?.exp ? new Date(payload.exp * 1000).toISOString() : null,
    },
    rateLimit,
    events,
    defenseEngine: process.env.SPRING_SECURITY_ENABLED === 'true' ? 'Spring Security 6' : 'Edge Crypto Guard',
    securityHeaders: {
      xFrameOptions: 'DENY',
      contentSecurityPolicy: "frame-ancestors 'none'",
      xContentTypeOptions: 'nosniff',
      sameSiteCookies: 'Strict',
    },
  });
}
