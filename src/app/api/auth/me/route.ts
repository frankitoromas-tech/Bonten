import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthenticatedActor } from '@/lib/security/authorization';

export async function GET(req: NextRequest) {
  const actor = getAuthenticatedActor(req);

  if (actor?.kind === 'admin') {
    return NextResponse.json({
      authenticated: true,
      user: {
        username: actor.payload.username,
        role: actor.payload.role,
        avatarUrl: '/assets/fireboy_client.webp',
      },
    });
  }

  if (actor?.kind === 'member') {
    return NextResponse.json({
      authenticated: true,
      user: {
        id: actor.payload.userId,
        username: actor.payload.username,
        email: actor.payload.email,
        role: actor.payload.role,
        avatarUrl: actor.payload.avatarUrl,
      },
    });
  }

  return NextResponse.json({ authenticated: false, user: null });
}
