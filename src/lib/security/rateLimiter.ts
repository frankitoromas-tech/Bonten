// =========================================
//  RATE LIMITER EN MEMORIA — BONTEN DEFENSE
//  Ventana deslizante por IP para mitigar
//  fuerza bruta y saturación de peticiones L7.
// =========================================

interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  ip: string;
  type: 'RATE_LIMIT_BLOCK' | 'LOGIN_FAILED' | 'LOGIN_SUCCESS' | 'CSRF_REJECTED';
  detail: string;
}

const loginAttempts = new Map<string, RateLimitRecord>();
const securityEvents: SecurityEvent[] = [];
const MAX_AUDIT_LOGS = 50;

export function recordSecurityEvent(
  ip: string,
  type: SecurityEvent['type'],
  detail: string
): void {
  const event: SecurityEvent = {
    id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ip,
    type,
    detail,
  };
  securityEvents.unshift(event);
  if (securityEvents.length > MAX_AUDIT_LOGS) {
    securityEvents.pop();
  }
}

export function getSecurityEvents(): SecurityEvent[] {
  return [...securityEvents];
}

export function checkRateLimit(
  ip: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) {
    return { allowed: true, remaining: maxAttempts, retryAfterSec: 0 };
  }

  // Si la ventana de tiempo ya expiró, resetear
  if (now - record.firstAttempt > windowMs) {
    loginAttempts.delete(ip);
    return { allowed: true, remaining: maxAttempts, retryAfterSec: 0 };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSec = Math.ceil((record.firstAttempt + windowMs - now) / 1000);
    recordSecurityEvent(ip, 'RATE_LIMIT_BLOCK', `IP bloqueada tras ${record.count} intentos fallidos`);
    return { allowed: false, remaining: 0, retryAfterSec: Math.max(1, retryAfterSec) };
  }

  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    retryAfterSec: 0,
  };
}

export function recordFailedAttempt(ip: string, windowMs = 15 * 60 * 1000): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now - record.firstAttempt > windowMs) {
    loginAttempts.set(ip, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
  } else {
    record.count += 1;
    record.lastAttempt = now;
  }
  recordSecurityEvent(ip, 'LOGIN_FAILED', `Credencial incorrecta desde IP ${ip}`);
}

export function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}

export function getRateLimitStats(): { totalTrackedIps: number; blockedCount: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  let blockedCount = 0;

  loginAttempts.forEach((rec) => {
    if (now - rec.firstAttempt <= windowMs && rec.count >= 5) {
      blockedCount++;
    }
  });

  return {
    totalTrackedIps: loginAttempts.size,
    blockedCount,
  };
}
