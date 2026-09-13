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

export async function POST(req: NextRequest) {
  // 1. Escudo Anti-CSRF
  const originCheck = validateRequestOrigin(req);
  if (!originCheck.valid) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    recordSecurityEvent(ip, 'CSRF_REJECTED', originCheck.reason || 'Origen no permitido');
    return NextResponse.json({ error: 'Petición rechazada por política anti-CSRF' }, { status: 403 });
  }

  // 2. Mitigación de saturación de carga útil (DoS L7)
  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > 100 * 1024) {
    return NextResponse.json({ error: 'Carga útil excesiva (límite 100KB)' }, { status: 413 });
  }

  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña requeridos' }, { status: 400 });
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

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
