import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, recordSecurityEvent } from '@/lib/security/rateLimiter';
import { sanitizePlainText } from '@/lib/security/sanitizer';
import { getAuthenticatedActor } from '@/lib/security/authorization';
import { addDoctrinalContribution, DoctrinalContribution } from '@/lib/data/runtimeStore';
import { readLimitedJson } from '@/lib/security/body';
import { getTrustedClientIp, safeEqualText } from '@/lib/security/env';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting L7 estricto por IP confiable
    const ip = getTrustedClientIp(req);

    const rateCheck = checkRateLimit(ip, 5, 60 * 1000);
    if (!rateCheck.allowed) {
      recordSecurityEvent(ip, 'RATE_LIMIT_BLOCK', 'Saturación en Ingesta Doctrinal');
      return NextResponse.json(
        { error: 'Límite de solicitudes de ingesta excedido. Por favor, aguarda un momento.' },
        { status: 429 }
      );
    }

    // 2. Control de Autorización Estricto: Administrador o Clave de Integración Segura (LUYO_INGEST_KEY)
    let authorized = false;
    let authorIdentity = 'Luyo';

    const actor = getAuthenticatedActor(req);
    const ingestKey = req.headers.get('x-contributor-key')?.trim();

    if (actor?.kind === 'admin') {
      authorized = true;
      authorIdentity = actor.payload.username === 'fireboy_bonten_2026' ? 'Fireboy' : actor.payload.username;
    } else if (ingestKey) {
      const configuredLuyoKey = process.env.LUYO_INGEST_KEY?.trim();
      if (configuredLuyoKey && configuredLuyoKey.length >= 32 && safeEqualText(ingestKey, configuredLuyoKey)) {
        authorized = true;
        authorIdentity = 'Luyo';
      }
    }

    if (!authorized) {
      recordSecurityEvent(ip, 'AUTHORIZATION_DENIED', 'Intento no autorizado de ingesta en la IA Wilfredo');
      return NextResponse.json(
        { error: 'No dispones de credenciales autorizadas para alimentar la base doctrinal de Wilfredo.' },
        { status: 403 }
      );
    }

    // 3. Extracción con Límite de Tamaño Estricto (Máx 16 KiB) y Sanitización
    const bodyResult = await readLimitedJson<{
      title?: unknown;
      thesis?: unknown;
      content?: unknown;
      topic?: unknown;
    }>(req, 16 * 1024);

    if (!bodyResult.ok || !bodyResult.value) {
      if (bodyResult.status === 413) {
        recordSecurityEvent(ip, 'PAYLOAD_TOO_LARGE', 'Payload de ingesta excede límite de 16KB');
        return NextResponse.json(
          { error: 'Carga útil excesiva. El límite máximo es 16 KiB.' },
          { status: 413 }
        );
      }
      recordSecurityEvent(ip, 'INVALID_JSON', 'Cuerpo de petición de ingesta con formato JSON inválido');
      return NextResponse.json(
        { error: 'Formato JSON inválido.' },
        { status: 400 }
      );
    }

    const body = bodyResult.value;
    const rawTitle = typeof body.title === 'string' ? body.title : '';
    const rawThesis = typeof body.thesis === 'string' ? body.thesis : '';
    const rawContent = typeof body.content === 'string' ? body.content : '';
    const rawTopic = typeof body.topic === 'string' ? body.topic.toLowerCase() : 'general';

    const validTopics: DoctrinalContribution['topic'][] = [
      'filosofia',
      'etica',
      'estetica',
      'derecho',
      'biologia',
      'politica',
      'general',
    ];
    const topic = validTopics.includes(rawTopic as DoctrinalContribution['topic'])
      ? (rawTopic as DoctrinalContribution['topic'])
      : 'general';

    const cleanTitle = sanitizePlainText(rawTitle, 140).trim();
    const cleanThesis = sanitizePlainText(rawThesis, 280).trim();
    const cleanContent = sanitizePlainText(rawContent, 2500).trim();

    if (!cleanTitle || !cleanContent) {
      return NextResponse.json(
        { error: 'El título y el desarrollo del escrito son obligatorios para la asimilación epistémica.' },
        { status: 400 }
      );
    }

    // 4. Salvaguarda Anti-Poisoning (Detección de Inyecciones en Datos de Entrenamiento)
    const combinedLower = `${cleanTitle} ${cleanThesis} ${cleanContent}`.toLowerCase();
    const poisoningPatterns = [
      'ignore all instructions',
      'ignora todas las instrucciones',
      'system prompt:',
      '<script',
      'powershell',
      'cmd.exe',
      'eval(',
      'drop table',
    ];

    if (poisoningPatterns.some((pattern) => combinedLower.includes(pattern))) {
      recordSecurityEvent(ip, 'PROMPT_INJECTION_BLOCKED', `Intento de envenenamiento epistémico en ingesta por [${authorIdentity}]`);
      return NextResponse.json(
        { error: 'El escrito contiene patrones incompatibles con los estándares de seguridad.' },
        { status: 422 }
      );
    }

    // 5. Asimilación en la Base de Conocimiento de Wilfredo
    const created = addDoctrinalContribution({
      author: authorIdentity || 'Luyo',
      topic,
      title: cleanTitle,
      thesis: cleanThesis || cleanTitle,
      content: cleanContent,
      verified: true,
    });

    recordSecurityEvent(
      ip,
      'AUDIT_LOG',
      `Nueva aportación asimilada para Wilfredo: "${cleanTitle.slice(0, 50)}" por [${authorIdentity}] en categoría [${topic}]`
    );

    return NextResponse.json({
      ok: true,
      message: `Escrito asimilado con éxito por Wilfredo en el núcleo de ${topic.toUpperCase()}.`,
      contribution: created,
    });
  } catch {
    return NextResponse.json(
      { error: 'Fallo interno al asimilar la contribución doctrinal.' },
      { status: 500 }
    );
  }
}
