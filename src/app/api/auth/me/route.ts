import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyMemberToken, USER_SESSION_COOKIE } from '@/lib/security/memberAuth';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/auth';

export async function GET(req: NextRequest) {
  // 1. Revisar sesión de Administrador
  const adminCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (adminCookie) {
    const adminCheck = verifySessionToken(adminCookie);
    if (adminCheck.valid && adminCheck.payload) {
      return NextResponse.json({
        authenticated: true,
        user: {
          username: adminCheck.payload.username,
          role: adminCheck.payload.role,
          avatarUrl: '/assets/fireboy_client.webp',
        },
      });
    }
  }

  // 2. Revisar sesión de Miembro de Comunidad
  const userCookie = req.cookies.get(USER_SESSION_COOKIE)?.value;
  if (userCookie) {
    const memberCheck = verifyMemberToken(userCookie);
    if (memberCheck.valid && memberCheck.payload) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: memberCheck.payload.userId,
          username: memberCheck.payload.username,
          email: memberCheck.payload.email,
          role: memberCheck.payload.role,
          avatarUrl: memberCheck.payload.avatarUrl,
        },
      });
    }
  }

  return NextResponse.json({ authenticated: false, user: null });
}
