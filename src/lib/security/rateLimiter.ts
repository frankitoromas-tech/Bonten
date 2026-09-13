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
  type:
    | 'RATE_LIMIT_BLOCK'
    | 'LOGIN_FAILED'
    | 'LOGIN_SUCCESS'
    | 'CSRF_REJECTED'
    | 'IP_MANUALLY_BANNED'
    | 'IP_UNBANNED'
    | 'SUSPICIOUS_PROBE'
    | 'PROMPT_INJECTION_BLOCKED'
    | 'SESSION_HIJACK_ATTEMPT';
  detail: string;
}

interface BannedIpRecord {
  reason: string;
  bannedAt: number;
  bannedUntil: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();
const bannedIps = new Map<string, BannedIpRecord>();
const securityEvents: SecurityEvent[] = [];
const MAX_AUDIT_LOGS = 100;

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

export function isIpBanned(ip: string): { banned: boolean; reason?: string; remainingSec?: number } {
  const record = bannedIps.get(ip);
  if (!record) return { banned: false };

  const now = Date.now();
  if (now >= record.bannedUntil) {
    bannedIps.delete(ip);
    recordSecurityEvent(ip, 'IP_UNBANNED', `Expiración automática del bloqueo para IP ${ip}`);
    return { banned: false };
  }

  const remainingSec = Math.ceil((record.bannedUntil - now) / 1000);
  return { banned: true, reason: record.reason, remainingSec };
}

export function banIp(ip: string, reason = 'Bloqueo manual por administrador', durationMinutes = 60): boolean {
  const now = Date.now();
  const bannedUntil = now + durationMinutes * 60 * 1000;
  bannedIps.set(ip, { reason, bannedAt: now, bannedUntil });
  recordSecurityEvent(ip, 'IP_MANUALLY_BANNED', `IP ${ip} bloqueada por ${durationMinutes} min. Causa: ${reason}`);
  return true;
}

export function unbanIp(ip: string): boolean {
  if (bannedIps.has(ip)) {
    bannedIps.delete(ip);
    recordSecurityEvent(ip, 'IP_UNBANNED', `IP ${ip} desbloqueada manualmente`);
    return true;
  }
  return false;
}

export function listBannedIps(): { ip: string; reason: string; remainingSec: number }[] {
  const now = Date.now();
  const result: { ip: string; reason: string; remainingSec: number }[] = [];
  bannedIps.forEach((rec, ip) => {
    if (now < rec.bannedUntil) {
      result.push({
        ip,
        reason: rec.reason,
        remainingSec: Math.ceil((rec.bannedUntil - now) / 1000),
      });
    } else {
      bannedIps.delete(ip);
    }
  });
  return result;
}

export function checkRateLimit(
  ip: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  // 1. Verificación prioritaria de IP Jail
  const banStatus = isIpBanned(ip);
  if (banStatus.banned) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: banStatus.remainingSec || 3600,
    };
  }

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

export function getRateLimitStats(): {
  totalTrackedIps: number;
  blockedCount: number;
  bannedCount: number;
  threatLevel: 'OPTIMAL' | 'ELEVATED' | 'HIGH';
} {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  let blockedCount = 0;

  loginAttempts.forEach((rec) => {
    if (now - rec.firstAttempt <= windowMs && rec.count >= 5) {
      blockedCount++;
    }
  });

  const bannedCount = bannedIps.size;
  const threatLevel =
    blockedCount > 3 || bannedCount > 2
      ? 'HIGH'
      : blockedCount > 0 || bannedCount > 0
      ? 'ELEVATED'
      : 'OPTIMAL';

  return {
    totalTrackedIps: loginAttempts.size,
    blockedCount,
    bannedCount,
    threatLevel,
  };
}
