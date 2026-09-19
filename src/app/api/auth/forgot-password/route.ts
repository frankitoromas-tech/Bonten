// =======================================================================
//  API DE SOLICITUD DE RESTABLECIMIENTO — BONTEN DEFENSE (OWASP)
//  Mitigación de enumeración de usuarios y emisión de tokens con hash SHA-256.
// =======================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { findUserByEmail, createPasswordResetToken } from '@/lib/db/database';
import { checkRateLimit, recordFailedAttempt } from '@/lib/security/rateLimiter';
import { validateRequestOrigin } from '@/lib/security/csrf';
import { getTrustedClientIp } from '@/lib/security/env';
import { readLimitedJson } from '@/lib/security/body';

export async function POST(req: NextRequest) {
  try {
    if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Petición rechazada por política anti-CSRF' }, { status: 403 });
  }

  const ip = getTrustedClientIp(req);
  // Rate limit estricto: 3 solicitudes cada 15 min
  const rate = checkRateLimit(ip, 3, 15 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Límite de solicitudes alcanzado. Por seguridad, reintenta en ${rate.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  const bodyResult = await readLimitedJson<{ email?: string }>(req, 4 * 1024);
  if (!bodyResult.ok || !bodyResult.value) {
    return NextResponse.json({ error: bodyResult.error || 'Cuerpo de petición inválido' }, { status: bodyResult.status || 400 });
  }

  const { email } = bodyResult.value;

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Correo electrónico requerido' }, { status: 400 });
  }

    const user = findUserByEmail(email);
    let devResetUrl: string | undefined = undefined;

    if (user) {
      const { plainToken } = createPasswordResetToken(user.id, ip);
      devResetUrl = `/auth/reset-password?token=${plainToken}`;
    } else {
      recordFailedAttempt(ip);
    }

    // Respuesta genérica defensiva contra User Enumeration Attack (OWASP)
    return NextResponse.json({
      success: true,
      message: 'Si el correo electrónico está registrado, hemos generado el enlace de restablecimiento con validez de 15 minutos.',
      ...(process.env.NODE_ENV !== 'production' && devResetUrl ? { devResetUrl } : {}),
    });
  } catch {
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}
