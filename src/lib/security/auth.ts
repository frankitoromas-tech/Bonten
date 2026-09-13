// =========================================
//  MOTOR DE AUTENTICACIÓN & SESIONES SEGURAS
//  HMAC-SHA256, timingSafeEqual y cookies HttpOnly.
// =========================================

import crypto from 'node:crypto';

export interface AdminSessionPayload {
  username: string;
  role: 'ROLE_SUPERADMIN' | 'ROLE_ADMIN' | 'ROLE_EDITOR';
  iat: number;
  exp: number;
  jti: string;
}

const SECRET =
  process.env.ADMIN_JWT_SECRET ||
  'bonten_enterprise_crypto_shield_secret_key_frank_vargas_2026';

const DEFAULT_ADMIN_USER = process.env.ADMIN_USER || 'fireboy';
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASS || 'fireboy_bonten_2026';

export const SESSION_COOKIE_NAME = 'bonten_admin_session';

/** Genera hash seguro con sal SHA-256 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .createHmac('sha256', SECRET)
    .update(`${chosenSalt}:${password}`)
    .digest('hex');
  return { hash, salt: chosenSalt };
}

/** Verificación a prueba de timing attacks (ataques de canal lateral) */
export function verifyPassword(password: string, expectedPassword?: string): boolean {
  const target = expectedPassword || DEFAULT_ADMIN_PASS;
  const bufferA = Buffer.from(password);
  const bufferB = Buffer.from(target);

  if (bufferA.length !== bufferB.length) {
    // Si difiere la longitud, realizamos una comparación ficticia para igualar tiempo
    crypto.timingSafeEqual(bufferA, bufferA);
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}

/** Verifica usuario administrador */
export function verifyUsername(username: string): boolean {
  return username.trim().toLowerCase() === DEFAULT_ADMIN_USER.toLowerCase();
}

/** Emite un token firmado con HMAC-SHA256 y TTL de 2 horas */
export function createSessionToken(
  username = DEFAULT_ADMIN_USER,
  role: AdminSessionPayload['role'] = 'ROLE_SUPERADMIN'
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    username,
    role,
    iat: now,
    exp: now + 2 * 60 * 60, // 2 horas
    jti: crypto.randomBytes(8).toString('hex'),
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/** Valida firma, expiración y estructura del token */
export function verifySessionToken(token: string): {
  valid: boolean;
  payload?: AdminSessionPayload;
  error?: string;
} {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token inexistente' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Formato de token inválido' };
  }

  const [encodedPayload, receivedSignature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SECRET)
    .update(encodedPayload)
    .digest('base64url');

  const sigBufferA = Buffer.from(receivedSignature);
  const sigBufferB = Buffer.from(expectedSignature);

  if (sigBufferA.length !== sigBufferB.length) {
    return { valid: false, error: 'Firma criptográfica inválida' };
  }

  if (!crypto.timingSafeEqual(sigBufferA, sigBufferB)) {
    return { valid: false, error: 'Firma manipulada' };
  }

  try {
    const raw = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const payload = JSON.parse(raw) as AdminSessionPayload;
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Sesión expirada' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Carga útil corrupta' };
  }
}
