// =======================================================================
//  API DE ARGUMENTOS DE DEBATE — BONTEN COMMUNITY
//  Requiere sesión verificada para publicar argumentos.
// =======================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { addDebateArgument, getDebateArguments } from '@/lib/db/database';
import { getAuthenticatedActor } from '@/lib/security/authorization';
import { validateRequestOrigin } from '@/lib/security/csrf';
import { getTrustedClientIp } from '@/lib/security/env';
import { readLimitedJson } from '@/lib/security/body';
import { checkRateLimit } from '@/lib/security/rateLimiter';

function getAuthenticatedUser(req: NextRequest) {
  const actor = getAuthenticatedActor(req);

  if (actor?.kind === 'admin') {
    return {
      id: 1,
      username: actor.payload.username,
      role: 'Líder / Fundador',
      avatarUrl: '/assets/fireboy_client.webp',
    };
  }

  if (actor?.kind === 'member') {
    return {
      id: actor.payload.userId,
      username: actor.payload.username,
      role: 'Miembro de Comunidad',
      avatarUrl: actor.payload.avatarUrl,
    };
  }

  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const debateId = Number(searchParams.get('debateId') || 1);
  return NextResponse.json(getDebateArguments(debateId));
}

export async function POST(req: NextRequest) {
  try {
    if (!validateRequestOrigin(req).valid) {
    return NextResponse.json({ error: 'Petición rechazada por política anti-CSRF' }, { status: 403 });
  }

  const ip = getTrustedClientIp(req);
  const rate = checkRateLimit(ip, 10, 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Demasiadas aportaciones seguidas. Aguarda ${rate.retryAfterSec}s para volver a argumentar.` },
      { status: 429 }
    );
  }

  const currentUser = getAuthenticatedUser(req);
  if (!currentUser) {
    return NextResponse.json(
      { error: 'Se requiere una cuenta activa en BONTEN para argumentar en debates doctrinales.' },
      { status: 401 }
    );
  }

  const bodyResult = await readLimitedJson<{ debateId?: number | string; stance?: string; text?: string }>(req, 8 * 1024);
  if (!bodyResult.ok || !bodyResult.value) {
    return NextResponse.json({ error: bodyResult.error || 'Cuerpo de petición inválido' }, { status: bodyResult.status || 400 });
  }

  const { debateId, stance, text } = bodyResult.value;
  const stanceVal = typeof stance === 'string' ? stance : '';
  const textVal = typeof text === 'string' ? text.trim() : '';

  if (!debateId || !stanceVal || !textVal) {
    return NextResponse.json({ error: 'Parámetros incompletos' }, { status: 400 });
  }

  if (stanceVal !== 'pro' && stanceVal !== 'contra') {
    return NextResponse.json({ error: 'Postura no permitida (solo pro o contra)' }, { status: 400 });
  }

  if (textVal.length < 10) {
    return NextResponse.json({ error: 'El argumento debe tener al menos 10 caracteres' }, { status: 400 });
  }

  const argument = addDebateArgument({
    debateId: Number(debateId),
    userId: currentUser.id,
    username: currentUser.username,
    userRole: currentUser.role,
    avatarUrl: currentUser.avatarUrl,
    stance: stanceVal,
    text: textVal,
  });

    return NextResponse.json({ success: true, argument }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error registrando argumento' }, { status: 500 });
  }
}
