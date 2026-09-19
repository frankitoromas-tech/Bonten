// =======================================================================
//  API DE RESTABLECIMIENTO DEFINITIVO — BONTEN DEFENSE
//  Consumo de token de un solo uso y actualización de contraseña hasheada.
// =======================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAndConsumeResetToken, updateUserPassword } from '@/lib/db/database';
import { validateRequestOrigin } from '@/lib/security/csrf';
import { getTrustedClientIp } from '@/lib/security/env';
import { readLimitedJson } from '@/lib/security/body';
import { checkRateLimit, recordFailedAttempt } from '@/lib/security/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Petición rechazada por política anti-CSRF' }, { status: 403 });
  }

  const ip = getTrustedClientIp(req);
  const rate = checkRateLimit(ip, 5, 15 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Límite de solicitudes alcanzado. Por seguridad, reintenta en ${rate.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  const bodyResult = await readLimitedJson<{ token?: string; newPassword?: string }>(req, 4 * 1024);
  if (!bodyResult.ok || !bodyResult.value) {
    return NextResponse.json({ error: bodyResult.error || 'Cuerpo de petición inválido' }, { status: bodyResult.status || 400 });
  }

  const { token, newPassword } = bodyResult.value;

  if (!token || !newPassword) {
    return NextResponse.json({ error: 'Token y nueva contraseña son requeridos' }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
  }

    // Validación atómica y consumo de token
    const tokenResult = verifyAndConsumeResetToken(token);
    if (!tokenResult.valid || !tokenResult.userId) {
      return NextResponse.json({ error: tokenResult.error || 'Token no válido' }, { status: 400 });
    }

    const updated = updateUserPassword(tokenResult.userId, newPassword);
    if (!updated) {
      return NextResponse.json({ error: 'Usuario no encontrado para actualización' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.',
    });
  } catch {
    return NextResponse.json({ error: 'Error procesando restablecimiento de contraseña' }, { status: 500 });
  }
}
