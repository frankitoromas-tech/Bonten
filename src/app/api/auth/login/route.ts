// =======================================================================
//  API DE LOGIN DE MIEMBROS — BONTEN COMMUNITY
//  Autenticación con timingSafeEqual, rate limiting y cookie HttpOnly.
// =======================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { findUserByEmail, findUserByUsername } from '@/lib/db/database';
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
      { error: `Demasiados intentos fallidos. Bloqueado temporalmente por ${rate.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Identificador y contraseña requeridos' }, { status: 400 });
    }

    const trimmed = String(identifier).trim();
    const user = trimmed.includes('@') ? findUserByEmail(trimmed) : findUserByUsername(trimmed);

    if (!user) {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Verificación criptográfica timing-safe con sal
    const secret = process.env.ADMIN_JWT_SECRET || 'bonten_enterprise_crypto_shield_secret_key_frank_vargas_2026';
    const computedHash = crypto
      .createHmac('sha256', secret)
      .update(`${user.passwordSalt}:${password}`)
      .digest('hex');

    const bufA = Buffer.from(computedHash);
    const bufB = Buffer.from(user.passwordHash);

    if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    resetRateLimit(ip);
    const token = createMemberToken(user);

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
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
    return NextResponse.json({ error: 'Error procesando login' }, { status: 500 });
  }
}
