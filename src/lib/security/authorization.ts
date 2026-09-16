import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME, createSessionFingerprint } from './auth.ts';
import type { AdminSessionPayload } from './auth.ts';
import { verifyMemberToken, USER_SESSION_COOKIE } from './memberAuth.ts';
import type { MemberSessionPayload } from './memberAuth.ts';

import { getTrustedClientIp } from './env.ts';

export function getRequestFingerprint(request: NextRequest | { headers: Headers }): string {
  const ip = getTrustedClientIp(request);
  const ua = request.headers.get('user-agent') ?? '';
  return createSessionFingerprint(ip, ua);
}

export function requireAdmin(request: { cookies: { get(n: string): { value: string } | undefined }, headers: Headers }, roles: AdminSessionPayload['role'][] = ['ROLE_SUPERADMIN']) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? '';
  const verification = verifySessionToken(token, getRequestFingerprint(request));
  if (!verification.valid || !verification.payload || !roles.includes(verification.payload.role)) {
    return { ok: false as const, response: Response.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { ok: true as const, actor: verification.payload };
}

export function getAuthenticatedActor(request: { cookies: { get(n: string): { value: string } | undefined } }): 
  | { kind: 'admin'; payload: AdminSessionPayload }
  | { kind: 'member'; payload: MemberSessionPayload }
  | null {
  const adminToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (adminToken) {
    const v = verifySessionToken(adminToken);
    if (v.valid && v.payload) return { kind: 'admin', payload: v.payload };
  }
  const memberToken = request.cookies.get(USER_SESSION_COOKIE)?.value;
  if (memberToken) {
    const v = verifyMemberToken(memberToken);
    if (v.valid && v.payload) return { kind: 'member', payload: v.payload };
  }
  return null;
}
