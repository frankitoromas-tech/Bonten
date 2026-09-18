// =========================================
//  MOTOR DE AUTENTICACIÓN & SESIONES SEGURAS
//  HMAC-SHA256, timingSafeEqual y cookies HttpOnly.
// =========================================

import crypto from 'node:crypto';
import { getRequiredSecret, safeEqualText } from './env.ts';

export interface AdminSessionPayload {
  username: string;
  role: 'ROLE_SUPERADMIN' | 'ROLE_ADMIN' | 'ROLE_EDITOR';
  iat: number;
  exp: number;
  jti: string;
  fingerprint?: string;
}

function getSecret() {
  return getRequiredSecret('ADMIN_JWT_SECRET', 32);
}

function getAdminCredentials(): { user: string; pass: string } {
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.npm_lifecycle_event === 'build') {
    return { user: 'build-placeholder', pass: 'build-placeholder-pass-32-chars-x' };
  }
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;
  if (process.env.NODE_ENV === 'production' && (!user || !pass)) {
    throw new Error('ADMIN_USER and ADMIN_PASS must be configured in production');
  }
  return { user: user || 'fireboy', pass: pass || 'fireboy_bonten_2026' };
}

export const SESSION_COOKIE_NAME = 'bonten_admin_session';

/** Genera huella de sesión para mitigar Session Hijacking / Cookie Replay */
export function createSessionFingerprint(ip: string, userAgent = ''): string {
  return crypto
    .createHash('sha256')
    .update(`${ip}:${userAgent.substring(0, 100)}`)
    .digest('hex')
    .substring(0, 16);
}

/** Genera hash seguro con sal SHA-256 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .createHmac('sha256', getSecret())
    .update(`${chosenSalt}:${password}`)
    .digest('hex');
  return { hash, salt: chosenSalt };
}

/** Verificación a prueba de timing attacks (ataques de canal lateral) */
export function verifyPassword(password: string, expectedPassword?: string): boolean {
  const target = expectedPassword || getAdminCredentials().pass;
  const secret = getSecret();
  const hashA = crypto.createHmac('sha256', secret).update(password).digest();
  const hashB = crypto.createHmac('sha256', secret).update(target).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/** Verifica usuario administrador */
export function verifyUsername(username: string): boolean {
  return username.trim().toLowerCase() === getAdminCredentials().user.toLowerCase();
}

/** Emite un token firmado con HMAC-SHA256, TTL de 2 horas y huella de cliente */
export function createSessionToken(
  username = getAdminCredentials().user,
  role: AdminSessionPayload['role'] = 'ROLE_SUPERADMIN',
  fingerprint?: string
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    username,
    role,
    iat: now,
    exp: now + 2 * 60 * 60, // 2 horas
    jti: crypto.randomBytes(8).toString('hex'),
    ...(fingerprint ? { fingerprint } : {}),
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/** Valida firma, expiración, estructura del token y huella opcional */
export function verifySessionToken(
  token: string,
  expectedFingerprint?: string
): {
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
    .createHmac('sha256', getSecret())
    .update(encodedPayload)
    .digest('base64url');

  if (!safeEqualText(receivedSignature, expectedSignature)) {
    return { valid: false, error: 'Firma manipulada' };
  }

  try {
    const raw = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const payload = JSON.parse(raw) as AdminSessionPayload;
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Sesión expirada' };
    }

    if (expectedFingerprint && payload.fingerprint && payload.fingerprint !== expectedFingerprint) {
      return { valid: false, error: 'Secuestro de sesión detectado (fingerprint mismatch)' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Carga útil corrupta' };
  }
}
