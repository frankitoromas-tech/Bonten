// =======================================================================
//  API DE GESTIÓN DE EQUIPO ADMINISTRATIVO — BONTEN DEFENSE
//  Fireboy (ROLE_SUPERADMIN) administra roles y accesos de la directiva.
// =======================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { listAdmins, createUser, updateAdminRole, deleteAdmin } from '@/lib/db/database';
import { requireAdmin } from '@/lib/security/authorization';
import { validateRequestOrigin } from '@/lib/security/csrf';

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req, ['ROLE_SUPERADMIN', 'ROLE_ADMIN']);
  if (!auth.ok) return auth.response;

  const admins = listAdmins();
  return NextResponse.json({
    admins,
    currentUserRole: auth.actor.role,
    isSuperadmin: auth.actor.role === 'ROLE_SUPERADMIN',
  });
}

export async function POST(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 });
  }

  const auth = requireAdmin(req, ['ROLE_SUPERADMIN']);
  if (!auth.ok) {
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

  const auth = requireAdmin(req, ['ROLE_SUPERADMIN']);
  if (!auth.ok) {
    return NextResponse.json({ error: 'Solo el Superadmin Principal (Fireboy) puede modificar roles' }, { status: 403 });
  }

  try {
    const { userId, role } = await req.json();
    const result = updateAdminRole(Number(userId), role, auth.actor.role);

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

  const auth = requireAdmin(req, ['ROLE_SUPERADMIN']);
  if (!auth.ok) {
    return NextResponse.json({ error: 'Solo el Superadmin Principal (Fireboy) puede revocar accesos' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const targetId = Number(searchParams.get('userId'));

  const result = deleteAdmin(targetId, auth.actor.role);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  return NextResponse.json({ success: true, message: 'Acceso de administrador revocado' });
}
