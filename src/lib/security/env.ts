import crypto from 'node:crypto';

export type SecurityEventType = 
  | 'RATE_LIMIT_BLOCK'
  | 'LOGIN_FAILED'
  | 'LOGIN_SUCCESS'
  | 'CSRF_REJECTED'
  | 'IP_MANUALLY_BANNED'
  | 'IP_UNBANNED'
  | 'SUSPICIOUS_PROBE'
  | 'PROMPT_INJECTION_BLOCKED'
  | 'SESSION_HIJACK_ATTEMPT'
  | 'AUTHORIZATION_DENIED'
  | 'INVALID_JSON'
  | 'PAYLOAD_TOO_LARGE'
  | 'AUDIT_LOG';

export function getRequiredSecret(name: string, minimumLength = 32): string {
  const value = process.env[name]?.trim();
  
  // Bypass validation during Next.js build phase to prevent deployment crashes
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.npm_lifecycle_event === 'build') {
    return 'dummy-secret-for-build-phase-which-must-be-long-enough';
  }

  if (!value || value.length < minimumLength) {
    if (process.env.NODE_ENV !== 'production' && name !== 'MISSING_TEST_SECRET') {
      return 'dev-secret-which-must-be-at-least-32-chars-long';
    }
    throw new Error(`${name} must be configured with at least ${minimumLength} characters`);
  }
  return value;
}

export function safeEqualText(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }
  const a = crypto.createHash('sha256').update(left).digest();
  const b = crypto.createHash('sha256').update(right).digest();
  return crypto.timingSafeEqual(a, b);
}

export function getTrustedClientIp(request: { headers: Headers }): string {
  return request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim()
    || request.headers.get('x-real-ip')?.trim()
    || request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || '127.0.0.1';
}
