// =========================================
//  MIDDLEWARE DE PROTECCIÓN EDGE — BONTEN DEFENSE
//  Bloqueo de acceso no autorizado, control de
//  sesiones e inyección de cabeceras de seguridad.
// =========================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from './lib/security/constants';

function isEdgeSessionExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return true;
    // Decodificación base64 segura para Edge
    const base64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp < now;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Control de acceso en la zona privada /admin
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie || isEdgeSessionExpired(sessionCookie)) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      if (sessionCookie) {
        response.cookies.delete(SESSION_COOKIE_NAME);
      }
      return response;
    }
  }

  // 2. Inyección de Cabeceras de Seguridad Estrictas (OWASP / Enterprise Hardening)
  const response = NextResponse.next();

  // Anti-Clickjacking & Phishing en iframes maliciosos
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'none';");

  // Anti-MIME sniffing y filtrado XSS
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Política de aislamiento de origen y referenciador
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  // HTTP Strict Transport Security (HSTS)
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Bloqueo de APIs de dispositivo innecesarias
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon.ico|assets).*)'],
};
