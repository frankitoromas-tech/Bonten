import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/auth';
import { validateRequestOrigin } from '@/lib/security/csrf';
import { findAdminByUsername, updateAdminPassword } from '@/lib/db/database';
import { recordSecurityEvent } from '@/lib/security/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    // 1. Anti-CSRF
    const csrfCheck = validateRequestOrigin(req);
    if (!csrfCheck.valid) {
      return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 });
    }

    // 2. Sesión y RBAC
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? verifySessionToken(token) : null;

    if (!session?.valid || !session.payload || (session.payload.role !== 'ROLE_SUPERADMIN' && session.payload.role !== 'ROLE_ADMIN')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const admin = findAdminByUsername(session.payload.username);
    if (!admin) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const result = updateAdminPassword(admin.id, currentPassword, newPassword);

    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    if (!result.success) {
      recordSecurityEvent(clientIp, 'LOGIN_FAILED', `Fallo al cambiar contraseña para admin ${session.payload.username}: ${result.error}`);
      return NextResponse.json({ error: result.error || 'No se pudo actualizar la contraseña' }, { status: 400 });
    }

    recordSecurityEvent(clientIp, 'LOGIN_SUCCESS', `Contraseña actualizada exitosamente por ${session.payload.username}`);

    return NextResponse.json({
      ok: true,
      message: '✓ Contraseña actualizada correctamente de forma segura.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error interno al actualizar la cuenta';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
