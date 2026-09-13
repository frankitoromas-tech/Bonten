// =======================================================================
//  API DE ARGUMENTOS DE DEBATE — BONTEN COMMUNITY
//  Requiere sesión verificada para publicar argumentos.
// =======================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { addDebateArgument, getDebateArguments } from '@/lib/db/database';
import { verifyMemberToken, USER_SESSION_COOKIE } from '@/lib/security/memberAuth';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/auth';
import { validateRequestOrigin } from '@/lib/security/csrf';

function getAuthenticatedUser(req: NextRequest) {
  // 1. Revisar administrador (Fireboy)
  const adminCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (adminCookie) {
    const admin = verifySessionToken(adminCookie);
    if (admin.valid && admin.payload) {
      return {
        id: 1,
        username: admin.payload.username,
        role: 'Líder / Fundador',
        avatarUrl: '/assets/fireboy_client.webp',
      };
    }
  }

  // 2. Revisar miembro de comunidad
  const userCookie = req.cookies.get(USER_SESSION_COOKIE)?.value;
  if (userCookie) {
    const member = verifyMemberToken(userCookie);
    if (member.valid && member.payload) {
      return {
        id: member.payload.userId,
        username: member.payload.username,
        role: 'Miembro de Comunidad',
        avatarUrl: member.payload.avatarUrl,
      };
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const debateId = Number(searchParams.get('debateId') || 1);
  return NextResponse.json(getDebateArguments(debateId));
}

export async function POST(req: NextRequest) {
  if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Petición rechazada por política anti-CSRF' }, { status: 403 });
  }

  const currentUser = getAuthenticatedUser(req);
  if (!currentUser) {
    return NextResponse.json(
      { error: 'Se requiere una cuenta activa en BONTEN para argumentar en debates doctrinales.' },
      { status: 401 }
    );
  }

  try {
    const { debateId, stance, text } = await req.json();

    if (!debateId || !stance || !text) {
      return NextResponse.json({ error: 'Parámetros incompletos' }, { status: 400 });
    }

    if (!['pro', 'contra'].includes(stance)) {
      return NextResponse.json({ error: 'Postura no permitida (solo pro o contra)' }, { status: 400 });
    }

    if (String(text).trim().length < 10) {
      return NextResponse.json({ error: 'El argumento debe tener al menos 10 caracteres' }, { status: 400 });
    }

    const argument = addDebateArgument({
      debateId: Number(debateId),
      userId: currentUser.id,
      username: currentUser.username,
      userRole: currentUser.role,
      avatarUrl: currentUser.avatarUrl,
      stance,
      text,
    });

    return NextResponse.json({ success: true, argument }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error registrando argumento' }, { status: 500 });
  }
}
