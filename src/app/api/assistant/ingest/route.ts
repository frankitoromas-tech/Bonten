import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, recordSecurityEvent } from '@/lib/security/rateLimiter';
import { sanitizePlainText } from '@/lib/security/sanitizer';
import { getAuthenticatedActor } from '@/lib/security/authorization';
import { addDoctrinalContribution, DoctrinalContribution } from '@/lib/data/runtimeStore';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting L7 estricto
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateCheck = checkRateLimit(ip, 5, 60 * 1000);
    if (!rateCheck.allowed) {
      recordSecurityEvent(ip, 'RATE_LIMIT_BLOCK', 'Saturación en Ingesta Doctrinal (Nexo Luyo)');
      return NextResponse.json(
        { error: 'Límite de solicitudes de ingesta excedido. Por favor, aguarda un momento.' },
        { status: 429 }
      );
    }

    // 2. Control de Autorización: Admin, Miembro Autorizado o Token de Contribuidor Luyo
    let authorized = false;
    let authorIdentity = 'Luyo';

    const actor = getAuthenticatedActor(req);
    const ingestKey = req.headers.get('x-contributor-key');

    if (actor?.kind === 'admin') {
      authorized = true;
      authorIdentity = actor.payload.username === 'fireboy_bonten_2026' ? 'Fireboy' : actor.payload.username;
    } else if (actor?.kind === 'member') {
      authorized = true;
      authorIdentity = actor.payload.username;
    } else if (ingestKey && (ingestKey === 'luyo_bonten_secure_2026' || ingestKey === 'bonten_master_doctrine_key')) {
      authorized = true;
      authorIdentity = 'Luyo';
    }

    if (!authorized) {
      recordSecurityEvent(ip, 'AUTHORIZATION_DENIED', 'Intento no autorizado de ingesta en la IA Wilfredo');
      return NextResponse.json(
        { error: 'No dispones de credenciales autorizadas para alimentar la base doctrinal de Wilfredo.' },
        { status: 403 }
      );
    }

    // 3. Extracción y Sanitización del Contenido Doctrinal
    const body = await req.json().catch(() => ({}));
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
