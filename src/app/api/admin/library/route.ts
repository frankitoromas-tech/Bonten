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
import { requireAdmin } from '@/lib/security/authorization';
import { validateRequestOrigin } from '@/lib/security/csrf';

export async function GET() {
  return NextResponse.json(getLibraryDocuments());
}

export async function POST(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 });
  }
  const auth = requireAdmin(req, ['ROLE_SUPERADMIN', 'ROLE_ADMIN']);
  if (!auth.ok) return auth.response;

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
  const auth = requireAdmin(req, ['ROLE_SUPERADMIN', 'ROLE_ADMIN']);
  if (!auth.ok) return auth.response;

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
  const auth = requireAdmin(req, ['ROLE_SUPERADMIN', 'ROLE_ADMIN']);
  if (!auth.ok) return auth.response;

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
