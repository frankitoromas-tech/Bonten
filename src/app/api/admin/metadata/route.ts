// =========================================
//  API DE METADATOS — BONTEN ADMIN
//  Consulta pública y actualización protegida.
// =========================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSiteMetadata, updateSiteMetadata } from '@/lib/data/runtimeStore';
import { requireAdmin } from '@/lib/security/authorization';
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
  const auth = requireAdmin(req, ['ROLE_SUPERADMIN', 'ROLE_ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const updated = updateSiteMetadata(body);
    return NextResponse.json({ success: true, metadata: updated });
  } catch {
    return NextResponse.json({ error: 'Error procesando la actualización de metadatos' }, { status: 400 });
  }
}
