// =========================================
//  ESCUDO ANTI-CSRF & VALIDACIÓN DE ORIGEN
//  Previene ataques de falsificación de
//  peticiones entre sitios y phishing cruzado.
// =========================================

import type { NextRequest } from 'next/server';

/** Valida que las peticiones mutantes (POST, PUT, DELETE) provengan del mismo host o localhost */
export function validateRequestOrigin(req: NextRequest): { valid: boolean; reason?: string } {
  const method = req.method.toUpperCase();

  // Métodos seguros (idempotentes de lectura) no requieren validación estricta de origen CSRF
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }

  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');

  // En llamadas API de backend de la misma aplicación, al menos uno debe coincidir con el Host
  const targetHeader = origin || referer;

  if (!targetHeader) {
    // Si no hay encabezado en un entorno estricto de producción, rechazar
    if (process.env.NODE_ENV === 'production') {
      return { valid: false, reason: 'Encabezado Origin/Referer ausente en petición mutante' };
    }
    return { valid: true };
  }

  try {
    const parsedTarget = new URL(targetHeader);
    const targetHost = parsedTarget.host;

    if (host && targetHost === host) {
      return { valid: true };
    }

    // Permitir hosts locales estándar para desarrollo y pruebas
    const isAllowedLocal =
      targetHost.startsWith('localhost:') ||
      targetHost === 'localhost' ||
      targetHost.startsWith('127.0.0.1:') ||
      targetHost === '127.0.0.1' ||
      targetHost.startsWith('192.168.');

    if (isAllowedLocal) {
      return { valid: true };
    }

    return {
      valid: false,
      reason: `Origen no autorizado: ${targetHost} no coincide con ${host}`,
    };
  } catch {
    return { valid: false, reason: 'Formato de URL en cabecera de origen inválido' };
  }
}
