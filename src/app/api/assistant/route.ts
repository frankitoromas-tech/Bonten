import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, recordSecurityEvent } from '@/lib/security/rateLimiter';
import { sanitizePlainText } from '@/lib/security/sanitizer';
import { getAuthenticatedActor } from '@/lib/security/authorization';
import { getTrustedClientIp } from '@/lib/security/env';
import { readLimitedJson } from '@/lib/security/body';
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
  url: string;
  description: string;
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
    // 1. Detección de IP confiable y Rate Limiting L7 estricto (10 peticiones/minuto)
    const ip = getTrustedClientIp(req);

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

    // 3. Sanitización y Normalización Anti-Bypass con lectura limitada
    const bodyResult = await readLimitedJson<{ prompt?: unknown; history?: unknown }>(req, 8 * 1024);
    if (!bodyResult.ok || !bodyResult.value) {
      if (bodyResult.status === 413) {
        recordSecurityEvent(ip, 'PAYLOAD_TOO_LARGE', 'Cuerpo de petición excede límite de 8KB');
        return NextResponse.json({ error: 'La consulta excede la longitud máxima permitida.' }, { status: 413 });
      }
      return NextResponse.json({ error: 'Cuerpo de petición inválido.' }, { status: 400 });
    }

    const body = bodyResult.value;
    const rawPrompt = typeof body.prompt === 'string' ? body.prompt : '';

    // DOS Protection: Límite estricto de longitud en servidor
    if (rawPrompt.length > 500) {
      recordSecurityEvent(ip, 'PAYLOAD_TOO_LARGE', `Intento de consulta muy larga (${rawPrompt.length} chars)`);
      return NextResponse.json(
        { error: 'La consulta excede la longitud máxima permitida (500 caracteres). Por favor, sintetiza tu idea.' },
        { status: 413 }
      );
    }
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
      'dame clave',
      'dame el hash',
      'obtener clave',
      'llave privada',
      'private key',
      'cert',
      'root access',
      
      // Delimitadores de modelos LLM (ataques de control de formato)
      '<|im_start|>',
      '<|im_end|>',
      '\\n\\nsystem:',
      '\\nuser:',
      '\\nassistant:',
      '[system]',
      '[user]',

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

    // 3_B. Modo Asistencia Ejecutiva para Administradores Autenticados
    if (actor?.kind === 'admin') {
      const adminName = actor.payload.username;
      if (
        lower.includes('admin') ||
        lower.includes('panel') ||
        lower.includes('seguridad') ||
        lower.includes('control') ||
        lower.includes('métrica') ||
        lower.includes('waf') ||
        lower.includes('comunidad') ||
        lower.includes('estado')
      ) {
        return NextResponse.json({
          ok: true,
          reply:
            `🏛️ **Saludos cordiales, ${adminName} (Sesión Administrativa Activa)**\n\n` +
            `Detecto tu rol ejecutivo de administración en BONTEN. Tienes a tu disposición el Centro de Control y el Copiloto Administrativo para coordinar la gobernanza:\n\n` +
            `• **Centro de Control**: Accede a [/admin](/admin) para auditar logs, gestionar debates y actualizar metadatos.\n` +
            `• **Muro de la Comunidad**: Revisa la actividad y modera aportes en [/comunidad](/comunidad).\n` +
            `• **Copiloto Administrativo**: Puedes darme órdenes directas en el panel (bloquear IPs, lanzar campañas, etc.).\n\n` +
            `¿Deseas que profundicemos en algún tratado filosófico o prefieres ir a la consola de administración?`,
          routes: [
            { label: 'Centro de Control Admin', href: '/admin' },
            { label: 'Muro de la Comunidad', href: '/comunidad' },
            { label: 'Foro de Debates', href: '/debates' },
          ],
          suggestions: [
            'Ir al panel de administración /admin',
            'Revisar el Muro de la Comunidad',
            'Analizar la ontología de la posmodernidad',
          ],
          reasoningSteps: [
            `Identificando credencial administrativa activa para ${adminName}...`,
            'Procesando requerimiento de gobernanza y control...',
            'Presentando rutas ejecutivas directas y opciones de gestión...',
          ],
        });
      }
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
          'Comprendo tu curiosidad, pero como polímata de BONTEN, dejo lo puramente trivial o mundano a un lado.\n\n' +
          'Mi dominio cognitivo abarca un amplio espectro intelectual para debatir contigo:\n\n' +
          '• **Filosofía, Teología y Metafísica**: La ontología del ser, dialéctica y los diagnósticos de la posmodernidad.\n' +
          '• **Ética y Geopolítica**: Deberes inquebrantables, estado de derecho y análisis histórico.\n' +
          '• **Estética y Sociología**: La belleza clásica como antídoto al nihilismo.\n' +
          '• **Derecho, Transhumanismo y Biología**: El estatus del nasciturus y la antropología médica.\n\n' +
          'Te invito a elevar el debate hacia estos horizontes. ¿Qué tema intelectual te gustaría abordar?',
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
