// =======================================================================
//  API DE REGISTRO DE MIEMBROS — BONTEN COMMUNITY
//  Creación de cuenta con validaciones de seguridad y emisión de sesión.
// =======================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createUser } from '@/lib/db/database';
import { createMemberToken, USER_SESSION_COOKIE } from '@/lib/security/memberAuth';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/security/rateLimiter';
import { validateRequestOrigin } from '@/lib/security/csrf';

export async function POST(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Petición rechazada por política anti-CSRF' }, { status: 403 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const rate = checkRateLimit(ip, 5, 15 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Demasiados intentos desde esta IP. Intenta en ${rate.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const result = createUser({ username, email, password });
    if (result.error || !result.user) {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: result.error || 'Error registrando usuario' }, { status: 400 });
    }

    resetRateLimit(ip);
    const token = createMemberToken(result.user);

    const res = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
        avatarUrl: result.user.avatarUrl,
      },
    });

    res.cookies.set({
      name: USER_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 días
    });

    return res;
  } catch {
    return NextResponse.json({ error: 'Error procesando solicitud de registro' }, { status: 500 });
  }
}
