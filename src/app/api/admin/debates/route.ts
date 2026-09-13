// =========================================
//  API DE DEBATES — BONTEN ADMIN
//  CRUD protegido para gestión de temas de debate.
// =========================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getStoreDebates,
  addStoreDebate,
  updateStoreDebate,
  deleteStoreDebate,
} from '@/lib/data/runtimeStore';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/auth';
import { validateRequestOrigin } from '@/lib/security/csrf';

function requireAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const { valid, payload } = verifySessionToken(token || '');
  return valid && (payload?.role === 'ROLE_SUPERADMIN' || payload?.role === 'ROLE_ADMIN');
}

export async function GET() {
  return NextResponse.json(getStoreDebates());
}

export async function POST(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 });
  }
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'No autorizado: se requiere rol de administrador' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.description) {
      return NextResponse.json({ error: 'Título y descripción son requeridos' }, { status: 400 });
    }
    const debate = addStoreDebate(body);
    return NextResponse.json({ success: true, debate }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al registrar el debate' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 });
  }
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'No autorizado: se requiere rol de administrador' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID del debate es obligatorio' }, { status: 400 });
    }
    const updated = updateStoreDebate(Number(body.id), body);
    if (!updated) {
      return NextResponse.json({ error: 'Debate no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true, debate: updated });
  } catch {
    return NextResponse.json({ error: 'Error al actualizar el debate' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 });
  }
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'No autorizado: se requiere rol de administrador' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  if (!id) {
    return NextResponse.json({ error: 'ID de debate inválido' }, { status: 400 });
  }

  const deleted = deleteStoreDebate(id);
  if (!deleted) {
    return NextResponse.json({ error: 'No se pudo eliminar el debate' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Debate eliminado con éxito' });
}
