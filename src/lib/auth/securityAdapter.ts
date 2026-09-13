// =========================================
//  SPRING SECURITY 6 / EDGE ADAPTER PATTERN
//  Permite alternar entre el motor Edge nativo
//  y un microservicio Spring Boot 3 Enterprise.
// =========================================

import { verifyPassword, verifyUsername, createSessionToken, verifySessionToken, type AdminSessionPayload } from '../security/auth';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '../security/rateLimiter';

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: { username: string; role: string };
  error?: string;
  retryAfterSec?: number;
}

export interface SecurityAdapter {
  name: 'EDGE_CRYPTO' | 'SPRING_SECURITY_6';
  authenticate(credentials: { username: string; password: string; ip: string }): Promise<AuthResult>;
  validateSession(token: string): Promise<{ valid: boolean; payload?: AdminSessionPayload; error?: string }>;
}

/** Proveedor nativo de alta velocidad en Edge / Next.js */
class EdgeSecurityAdapter implements SecurityAdapter {
  name = 'EDGE_CRYPTO' as const;

  async authenticate(credentials: { username: string; password: string; ip: string }): Promise<AuthResult> {
    const { username, password, ip } = credentials;

    // 1. Control de Tasa (Rate Limiting anti-fuerza bruta)
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Demasiados intentos fallidos. Bloqueo temporal por seguridad (${rateCheck.retryAfterSec}s).`,
        retryAfterSec: rateCheck.retryAfterSec,
      };
    }

    // 2. Verificación criptográfica timing-safe
    const userMatches = verifyUsername(username);
    const passMatches = verifyPassword(password);

    if (!userMatches || !passMatches) {
      recordFailedAttempt(ip);
      const remaining = checkRateLimit(ip).remaining;
      return {
        success: false,
        error: `Credenciales inválidas. Intentos restantes: ${remaining}`,
      };
    }

    // 3. Éxito: Resetear contador de fallos y emitir token
    resetRateLimit(ip);
    const token = createSessionToken(username, 'ROLE_SUPERADMIN');
    return {
      success: true,
      token,
      user: { username, role: 'ROLE_SUPERADMIN' },
    };
  }

  async validateSession(token: string) {
    return verifySessionToken(token);
  }
}

/** Proveedor desacoplado listo para Spring Boot 3 + Spring Security 6 */
class SpringBootSecurityAdapter implements SecurityAdapter {
  name = 'SPRING_SECURITY_6' as const;
  private backendUrl = process.env.SPRING_SECURITY_BACKEND_URL || 'http://localhost:8080';

  async authenticate(credentials: { username: string; password: string; ip: string }): Promise<AuthResult> {
    try {
      const res = await fetch(`${this.backendUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': credentials.ip,
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      if (!res.ok) {
        return { success: false, error: 'Rechazado por Spring Security 6' };
      }

      const data = await res.json();
      return {
        success: true,
        token: data.token,
        user: { username: data.username, role: data.role || 'ROLE_SUPERADMIN' },
      };
    } catch {
      return {
        success: false,
        error: 'Microservicio Spring Boot 3 inalcanzable. Revisa el puerto 8080.',
      };
    }
  }

  async validateSession(token: string) {
    // Fallback criptográfico local para Edge o validación remota
    return verifySessionToken(token);
  }
}

export function getSecurityAdapter(): SecurityAdapter {
  if (process.env.SPRING_SECURITY_ENABLED === 'true') {
    return new SpringBootSecurityAdapter();
  }
  return new EdgeSecurityAdapter();
}
