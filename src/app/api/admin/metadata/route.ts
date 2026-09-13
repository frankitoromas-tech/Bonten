// =========================================
//  API DE METADATOS — BONTEN ADMIN
//  Consulta pública y actualización protegida.
// =========================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSiteMetadata, updateSiteMetadata } from '@/lib/data/runtimeStore';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/auth';
import { validateRequestOrigin } from '@/lib/security/csrf';

export async function GET() {
  return NextResponse.json(getSiteMetadata());
}

export async function POST(req: NextRequest) {
  // 1. Control de Origen Anti-CSRF
  const originCheck = validateRequestOrigin(req);
  if (!originCheck.valid) {
    return NextResponse.json({ error: originCheck.reason || 'Origen no autorizado' }, { status: 403 });
  }

  // 2. Verificación de sesión de administrador RBAC
  const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const { valid, payload } = verifySessionToken(sessionToken || '');
  if (!valid || (payload?.role !== 'ROLE_SUPERADMIN' && payload?.role !== 'ROLE_ADMIN')) {
    return NextResponse.json({ error: 'No autorizado. Se requiere sesión de administrador activa.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = updateSiteMetadata(body);
    return NextResponse.json({ success: true, metadata: updated });
  } catch {
    return NextResponse.json({ error: 'Error procesando la actualización de metadatos' }, { status: 400 });
  }
}
