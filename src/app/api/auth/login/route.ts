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
import { getTrustedClientIp } from '@/lib/security/env';
import { readLimitedJson } from '@/lib/security/body';
import {
  hashPassword,
  verifyUsername,
  verifyPassword,
  createSessionToken,
  SESSION_COOKIE_NAME,
  createSessionFingerprint,
} from '@/lib/security/auth';

export async function POST(req: NextRequest) {
  try {
    if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Petición rechazada por política anti-CSRF' }, { status: 403 });
  }

  const ip = getTrustedClientIp(req);
  const rate = checkRateLimit(ip, 5, 15 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Demasiados intentos fallidos. Bloqueado temporalmente por ${rate.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  const bodyResult = await readLimitedJson<{ identifier?: string; password?: string }>(req, 8 * 1024);
  if (!bodyResult.ok || !bodyResult.value) {
    return NextResponse.json({ error: bodyResult.error || 'Cuerpo de petición inválido' }, { status: bodyResult.status || 400 });
  }

  const { identifier, password } = bodyResult.value;

  if (!identifier || !password) {
    return NextResponse.json({ error: 'Identificador y contraseña requeridos' }, { status: 400 });
  }

  const trimmed = String(identifier).trim();

  // 1. Detección unificada para Administradores de BONTEN (Fireboy)
  if (verifyUsername(trimmed) && verifyPassword(password)) {
    resetRateLimit(ip);
    const fingerprint = createSessionFingerprint(ip, req.headers.get('user-agent') ?? '');
    const adminToken = createSessionToken(trimmed, 'ROLE_SUPERADMIN', fingerprint);
    const memberToken = createMemberToken({
      id: 1,
      username: trimmed,
      email: `${trimmed.toLowerCase()}@bonten.org`,
      role: 'ROLE_SUPERADMIN',
      avatarUrl: '/assets/fireboy_dorsal_7.webp',
      passwordHash: '',
      passwordSalt: '',
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    const res = NextResponse.json({
      success: true,
      isAdmin: true,
      user: {
        id: 1,
        username: trimmed,
        email: `${trimmed.toLowerCase()}@bonten.org`,
        role: 'ROLE_SUPERADMIN',
        avatarUrl: '/assets/fireboy_dorsal_7.webp',
      },
    });

    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: adminToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 2 * 60 * 60,
    });

    res.cookies.set({
      name: USER_SESSION_COOKIE,
      value: memberToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  }

  // 2. Autenticación de Miembros de la Comunidad
  const user = trimmed.includes('@') ? findUserByEmail(trimmed) : findUserByUsername(trimmed);

  if (!user) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  }

  // Verificación criptográfica timing-safe centralizada
  const { hash: computedHash } = hashPassword(password, user.passwordSalt);
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
