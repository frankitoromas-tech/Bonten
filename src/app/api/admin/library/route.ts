// =========================================
//  API DE BIBLIOTECA — BONTEN ADMIN
//  CRUD protegido para gestión de documentos.
// =========================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getLibraryDocuments,
  addLibraryDocument,
  updateLibraryDocument,
  deleteLibraryDocument,
} from '@/lib/data/runtimeStore';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/auth';
import { validateRequestOrigin } from '@/lib/security/csrf';

function requireAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token || '').valid;
}

export async function GET() {
  return NextResponse.json(getLibraryDocuments());
}

export async function POST(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 });
  }
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.category) {
      return NextResponse.json({ error: 'Título y categoría son requeridos' }, { status: 400 });
    }
    const doc = addLibraryDocument(body);
    return NextResponse.json({ success: true, document: doc }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error agregando documento' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 });
  }
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID de documento requerido' }, { status: 400 });
    }
    const updated = updateLibraryDocument(Number(body.id), body);
    if (!updated) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true, document: updated });
  } catch {
    return NextResponse.json({ error: 'Error actualizando documento' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 });
  }
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));

  if (!id) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const deleted = deleteLibraryDocument(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Documento eliminado' });
}
