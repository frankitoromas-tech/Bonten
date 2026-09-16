// =======================================================================
//  AUTENTICACIÓN DE MIEMBROS DE LA COMUNIDAD — BONTEN DEFENSE
//  Tokens de sesión firmados con HMAC para participantes de debates.
// =======================================================================

import crypto from 'node:crypto';
import type { User } from '../db/database';
import { USER_SESSION_COOKIE } from './constants.ts';
import { getRequiredSecret, safeEqualText } from './env.ts';

export { USER_SESSION_COOKIE };

const SECRET = getRequiredSecret('COMMUNITY_JWT_SECRET', 32);

export interface MemberSessionPayload {
  userId: number;
  username: string;
  email: string;
  role: User['role'];
  avatarUrl: string;
  exp: number;
}

export function createMemberToken(user: User): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: MemberSessionPayload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    exp: now + 7 * 24 * 60 * 60, // 7 días de validez para miembros
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

export function verifyMemberToken(token: string): {
  valid: boolean;
  payload?: MemberSessionPayload;
  error?: string;
} {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token no provisto' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Formato inválido' };
  }

  const [encodedPayload, receivedSignature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SECRET)
    .update(encodedPayload)
    .digest('base64url');

  if (!safeEqualText(receivedSignature, expectedSignature)) {
    return { valid: false, error: 'Firma de sesión de miembro manipulada' };
  }

  try {
    const raw = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const payload = JSON.parse(raw) as MemberSessionPayload;
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Sesión de miembro expirada' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Error decodificando token' };
  }
}
