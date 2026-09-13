// =======================================================================
//  API DE GESTIÓN DE EQUIPO ADMINISTRATIVO — BONTEN DEFENSE
//  Fireboy (ROLE_SUPERADMIN) administra roles y accesos de la directiva.
// =======================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { listAdmins, createUser, updateAdminRole, deleteAdmin } from '@/lib/db/database';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/auth';
import { validateRequestOrigin } from '@/lib/security/csrf';

function getAdminSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token || '');
}

export async function GET(req: NextRequest) {
  const session = getAdminSession(req);
  if (!session.valid || (session.payload?.role !== 'ROLE_SUPERADMIN' && session.payload?.role !== 'ROLE_ADMIN')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const admins = listAdmins();
  return NextResponse.json({
    admins,
    currentUserRole: session.payload?.role,
    isSuperadmin: session.payload?.role === 'ROLE_SUPERADMIN',
  });
}

export async function POST(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 });
  }

  const session = getAdminSession(req);
  if (!session.valid || session.payload?.role !== 'ROLE_SUPERADMIN') {
    return NextResponse.json(
      { error: 'Solo el Superadmin Principal (Fireboy) puede designar nuevos administradores' },
      { status: 403 }
    );
  }

  try {
    const { username, email, password, role } = await req.json();
    const assignedRole = role === 'ROLE_SUPERADMIN' ? 'ROLE_ADMIN' : role || 'ROLE_ADMIN';

    const result = createUser({ username, email, password, role: assignedRole });
    if (result.error || !result.user) {
      return NextResponse.json({ error: result.error || 'Error al crear administrador' }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: result.user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error procesando solicitud' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 });
  }

  const session = getAdminSession(req);
  if (!session.valid || session.payload?.role !== 'ROLE_SUPERADMIN') {
    return NextResponse.json({ error: 'Solo el Superadmin Principal (Fireboy) puede modificar roles' }, { status: 403 });
  }

  try {
    const { userId, role } = await req.json();
    const result = updateAdminRole(Number(userId), role, session.payload?.role || '');

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json({ success: true, message: 'Rol actualizado exitosamente' });
  } catch {
    return NextResponse.json({ error: 'Error actualizando rol' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 });
  }

  const session = getAdminSession(req);
  if (!session.valid || session.payload?.role !== 'ROLE_SUPERADMIN') {
    return NextResponse.json({ error: 'Solo el Superadmin Principal (Fireboy) puede revocar accesos' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const targetId = Number(searchParams.get('userId'));

  const result = deleteAdmin(targetId, session.payload?.role || '');
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  return NextResponse.json({ success: true, message: 'Acceso de administrador revocado' });
}
