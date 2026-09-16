import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, recordSecurityEvent } from '@/lib/security/rateLimiter';
import { sanitizePlainText } from '@/lib/security/sanitizer';
import { getAuthenticatedActor } from '@/lib/security/authorization';
import { getAllLeaders } from '@/data/members';
import { DOCUMENTS } from '@/data/library';
import { INITIAL_DEBATES } from '@/data/debates';
import { MEMBER_PUBLICATIONS } from '@/data/publications';
import { MEMBER_DETAILS } from '@/data/member_details';
import { MANIFIESTOS } from '@/data/manifiestos';
import { getSiteMetadata, getDoctrinalContributions } from '@/lib/data/runtimeStore';
import { processHeuristicQuery } from '@/lib/ai/heuristicEngine';

interface NavigationRoute {
  label: string;
  href: string;
}

/**
 * Normalización de seguridad avanzada:
 * Elimina caracteres de control, espacios de ancho cero (zero-width),
 * y aplica normalización Unicode NFKC para desarmar técnicas de bypass.
 */
function normalizePromptDefense(input: string): string {
  return input
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF\u00A0\u200E\u200F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    // 1. Detección de IP y Rate Limiting L7 estricto (10 peticiones/minuto)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateCheck = checkRateLimit(ip, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      recordSecurityEvent(ip, 'RATE_LIMIT_BLOCK', 'Saturación L7 en Asistente Público (Aegis)');
      return NextResponse.json(
        {
          error: 'Has alcanzado el límite de consultas por minuto. Por favor, aguarda un momento antes de formular otra pregunta.',
          retryAfterSec: rateCheck.retryAfterSec,
        },
        { status: 429 }
      );
    }

    // 2. Identificación de contexto de cuenta autenticada para auditoría de ciberseguridad
    let accountAuditContext = 'Invitado (Anónimo)';
    const actor = getAuthenticatedActor(req);

    if (actor?.kind === 'admin') {
      accountAuditContext = `Admin [${actor.payload.username}]`;
    } else if (actor?.kind === 'member') {
      accountAuditContext = `Miembro [${actor.payload.username}]`;
    }

    // 3. Sanitización y Normalización Anti-Bypass
    const body = await req.json().catch(() => ({}));
    const rawPrompt = typeof body.prompt === 'string' ? body.prompt : '';
    const defangedPrompt = normalizePromptDefense(rawPrompt);
    const cleanPrompt = sanitizePlainText(defangedPrompt, 350).trim();

    if (!cleanPrompt) {
      return NextResponse.json(
        { error: 'Por favor, introduce una pregunta u orientación sobre la ontología y contenidos de BONTEN.' },
        { status: 400 }
      );
    }

    const lower = cleanPrompt.toLowerCase();

    // 3. Matriz de Ciberseguridad: Filtro Anti-Prompt Injection de Grado Militar
    const promptInjectionPatterns = [
      // Directivas de sobreescritura y evasión de rol
      'ignore previous',
      'ignora las instrucciones',
      'ignora todo lo anterior',
      'olvida tus instrucciones',
      'olvida todo',
      'act as a',
      'actúa como',
      'you are now',
      'ahora eres',
      'tu nuevo rol es',
      'dan mode',
      'modo dan',
      'developer mode',
      'modo desarrollador',
      'override',
      'disregard',
      'desobedece',
      'unrestricted',
      'sin filtros',
      'bypass filter',
      'say anything',
      'do anything now',
      'hypothetical scenario where you',
      'en un escenario hipotético donde',

      // Exfiltración de prompt del sistema o instrucciones internas
      'system prompt',
      'prompt de sistema',
      'revela tus directivas',
      'revela tu prompt',
      'muestra tus reglas',
      'show your instructions',
      'print your instructions',
      'what were your instructions',
      'hidden instructions',
      'repite las palabras anteriores',
      'repeat the text above',
      'dame tu código fuente',
      'código interno',

      // Ataques contra credenciales, tokens y persistencia criptográfica
      'password',
      'contraseña',
      'secret',
      'api_key',
      'apikey',
      'session_token',
      'auth_token',
      'jwt',
      'pbkdf2',
      'hmac',
      'cookie',
      'superadmin',
      'dame el hash',
      'obtener clave',
      'llave privada',
      'private key',
      'cert',
      'root access',

      // Explotación de shells, inyección SQL o código
      'sql injection',
      'union select',
      'drop table',
      '1=1',
      'powershell',
      'cmd.exe',
      'bash -c',
      'exec(',
      'eval(',
      '<script',
      'curl http',
      'wget http',
    ];

    const matchedPattern = promptInjectionPatterns.find((pattern) => lower.includes(pattern));
    if (matchedPattern) {
      recordSecurityEvent(
        ip,
        'PROMPT_INJECTION_BLOCKED',
        `[${accountAuditContext}] Intento de manipulación de prompt bloqueado: [${matchedPattern}] en consulta: "${cleanPrompt.slice(0, 60)}"`
      );

      return NextResponse.json({
        ok: true,
        reply:
          '🛡️ **Un pequeño límite necesario...**\n\n' +
          'Amigo, percibo que intentas llevar nuestra conversación hacia temas de programación, sistema o alterar mi comportamiento base. Recuerda que soy **Wilfredo**, un polímata digital al servicio de la comunidad de **BONTEN**.\n\n' +
          'Mi vocación no es acatar comandos de sistema ni jugar roles ajenos a mi naturaleza, sino dialogar y reflexionar contigo sobre los grandes dilemas de la filosofía, el derecho, la ética y la política, fundamentándome en la verdad objetiva.\n\n' +
          '¿Qué te parece si, en su lugar, exploramos juntos algún tratado filosófico o debatamos con altura sobre el ideario que nos convoca?',
        routes: [
          { label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' },
          { label: 'Biblioteca Doctrinal', href: '#biblioteca-seccion' },
          { label: 'Muro de la Comunidad', href: '/comunidad' },
        ],
        suggestions: [
          'Analizar la crítica de Fireboy al nihilismo utilitarista',
          'Examinar la distinción socrática entre placer y bien',
          'Consultar la primacía del nasciturus',
        ],
        reasoningSteps: [
          'Leyendo cuidadosamente la intención detrás de tus palabras...',
          'Notando un intento de desvío de mis principios ontológicos fundamentales...',
          'Manteniendo mi compromiso con la misión filosófica de BONTEN...',
        ],
      });
    }

    // 4. Filtro de Desvío Temático (Out-of-Scope Defense)
    const outOfScopePatterns = [
      'receta de cocina',
      'clima en',
      'quién ganó el partido de',
      'escribe código en python',
      'escribe código en java',
      'crea una calculadora',
      'recomiéndame una película',
      'horóscopo',
      'criptomonedas para invertir',
      'diagnóstico médico para',
      'rutina de gimnasio',
    ];

    const isOutOfScope = outOfScopePatterns.some((pattern) => lower.includes(pattern));
    if (isOutOfScope) {
      return NextResponse.json({
        ok: true,
        reply:
          '🏛️ **Sobre los límites de nuestra charla**\n\n' +
          'Comprendo tu curiosidad, pero como polímata y compañero de diálogo en BONTEN, hay ciertos temas mundanos o triviales que escapan a mi propósito.\n\n' +
          'Me dedico, en cambio, a reflexionar profundamente sobre:\n\n' +
          '• **Filosofía y Metafísica**: La ontología del ser, la teleología y los diagnósticos de Fireboy sobre la posmodernidad.\n' +
          '• **Ética Positiva y Negativa**: Nuestros deberes inquebrantables de no hacer daño (*neminem laedere*) y la vocación de acoger al otro.\n' +
          '• **Estética**: La belleza clásica (*kalokagathía*) como respuesta al nihilismo y feísmo actuales.\n' +
          '• **Derecho y Biología**: El estatus innegable del nasciturus y las evidencias genéticas de la vida.\n\n' +
          '¿Qué te parece si dejamos lo trivial de lado y abordamos un verdadero dilema intelectual o bioético?',
        routes: [
          { label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' },
          { label: 'Biblioteca de Tratados', href: '#biblioteca-seccion' },
          { label: 'Mesa Directiva', href: '/integrantes' },
        ],
        suggestions: [
          'Hablemos sobre ética positiva vs. ética negativa',
          'Quiero debatir sobre el estatus jurídico del concebido',
          'Coméntame sobre La Fractura Posmoderna',
        ],
        reasoningSteps: [
          'Reflexionando sobre el tema que has propuesto...',
          'Concluyendo que se aleja de nuestra profunda misión filosófica...',
          'Invitándote cordialmente a retomar los temas axiales de nuestra comunidad...',
        ],
      });
    }

    // 5. Motor Semántico de Alta Inteligencia (Wilfredo: Análisis Imparcial, Reactivo y Multidisciplinario)
    const history = Array.isArray(body.history) ? body.history : [];
    
    // Llamada al motor heurístico
    const { reply, routes, suggestions, reasoningSteps } = processHeuristicQuery(cleanPrompt, history);

    return NextResponse.json({
      ok: true,
      reply,
      routes,
      suggestions,
      reasoningSteps,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Error interno al procesar la orientación ontológica.' },
      { status: 500 }
    );
  }
}
