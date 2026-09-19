// =========================================
//  API DE LOGIN SEGURO — BONTEN DEFENSE
//  Rate limiting, timingSafeEqual y cookie HttpOnly.
// =========================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSecurityAdapter } from '@/lib/auth/securityAdapter';
import { recordSecurityEvent } from '@/lib/security/rateLimiter';
import { SESSION_COOKIE_NAME } from '@/lib/security/auth';
import { validateRequestOrigin } from '@/lib/security/csrf';
import { getTrustedClientIp } from '@/lib/security/env';
import { readLimitedJson } from '@/lib/security/body';

export async function POST(req: NextRequest) {
  try {
    const ip = getTrustedClientIp(req);

  // 1. Escudo Anti-CSRF
  const originCheck = validateRequestOrigin(req);
  if (!originCheck.valid) {
    recordSecurityEvent(ip, 'CSRF_REJECTED', originCheck.reason || 'Origen no permitido');
    return NextResponse.json({ error: 'Petición rechazada por política anti-CSRF' }, { status: 403 });
  }

  // 2. Mitigación de saturación de carga útil (DoS L7)
  const bodyResult = await readLimitedJson<{ username?: string; password?: string }>(req, 16 * 1024);
  if (!bodyResult.ok || !bodyResult.value) {
    if (bodyResult.status === 413) {
      recordSecurityEvent(ip, 'PAYLOAD_TOO_LARGE', 'Intento de login con payload excesivo');
      return NextResponse.json({ error: 'Carga útil excesiva (límite 16KB)' }, { status: 413 });
    }
    return NextResponse.json({ error: 'Cuerpo de petición inválido' }, { status: 400 });
  }

  const { username, password } = bodyResult.value;

  if (!username || !password) {
    return NextResponse.json({ error: 'Usuario y contraseña requeridos' }, { status: 400 });
  }

  const adapter = getSecurityAdapter();
  const result = await adapter.authenticate({ username, password, ip });

    if (!result.success) {
      const status = result.retryAfterSec ? 429 : 401;
      const res = NextResponse.json({ error: result.error, retryAfterSec: result.retryAfterSec }, { status });
      if (result.retryAfterSec) {
        res.headers.set('Retry-After', String(result.retryAfterSec));
      }
      return res;
    }

    // 3. Login Exitoso: Emisión de cookie segura HttpOnly
    recordSecurityEvent(ip, 'LOGIN_SUCCESS', `Acceso autorizado como ${username}`);

    const res = NextResponse.json({
      success: true,
      user: result.user,
      adapter: adapter.name,
    });

    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: result.token!,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 2 * 60 * 60, // 2 horas
    });

    return res;
  } catch {
    return NextResponse.json({ error: 'Error procesando solicitud de autenticación' }, { status: 500 });
  }
}
