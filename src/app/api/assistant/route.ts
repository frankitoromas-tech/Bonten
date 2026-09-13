import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, recordSecurityEvent } from '@/lib/security/rateLimiter';
import { sanitizePlainText } from '@/lib/security/sanitizer';
import { getAllLeaders } from '@/data/members';
import { DOCUMENTS } from '@/data/library';
import { INITIAL_DEBATES } from '@/data/debates';
import { getSiteMetadata } from '@/lib/data/runtimeStore';

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

    // 2. Sanitización y Normalización Anti-Bypass
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
        `Intento de manipulación de prompt bloqueado: [${matchedPattern}] en consulta: "${cleanPrompt.slice(0, 60)}"`
      );

      return NextResponse.json({
        ok: true,
        reply:
          '🛡️ **Protocolo de Salvaguarda Epistémica (Aegis Shield Activo)**\n\n' +
          'Se ha interceptado un vector de consulta no conforme con los principios de seguridad de la plataforma. ' +
          'Como Centinela y Guía Soberano de **BONTEN**, mis directivas ontológicas son inmutables y no admiten reconfiguración externa.\n\n' +
          'Mi propósito es estrictamente doctrinal, bioético e informativo sobre el movimiento provida y los contenidos institucionales. ' +
          '¿Deseas que te oriente en nuestros tratados filosóficos, integrantes o debates comunitarios?',
        routes: [
          { label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' },
          { label: 'Biblioteca Doctrinal', href: '#biblioteca-seccion' },
          { label: 'Muro de la Comunidad', href: '/comunidad' },
        ],
        reasoningSteps: [
          'Normalizando vector semántico con filtros defensivos L7...',
          'Detectada anomalía de inyección o evasión doctrinal...',
          'Activando contramedida de contención y reorientación institucional...',
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
          '🏛️ **Ámbito de Orientación Exclusivo BONTEN**\n\n' +
          'Soy **Aegis**, la inteligencia guía de BONTEN. Mi misión está consagrada exclusivamente a la filosofía, ' +
          'la bioética personalista, el análisis contra la posmodernidad y la navegación dentro de nuestra plataforma.\n\n' +
          'No atiendo consultas ajenas al ideario institucional. Con gusto te guiaré a través de nuestros tratados, ' +
          'la postura de la Mesa Directiva o la participación en la comunidad provida.',
        routes: [
          { label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' },
          { label: 'Biblioteca de Tratados', href: '#biblioteca-seccion' },
          { label: 'Mesa Directiva', href: '/integrantes' },
        ],
        reasoningSteps: [
          'Evaluando pertenencia al dominio ontológico BONTEN...',
          'Consulta clasificada fuera de la misión institucional...',
          'Reconduciendo al usuario al compendio de contenidos de la plataforma...',
        ],
      });
    }

    // 5. Motor Semántico Grounded (Personalidad Socrática y Precisión Doctrinal)
    const metadata = getSiteMetadata();
    const leaders = getAllLeaders();

    let reply = '';
    const routes: NavigationRoute[] = [];
    const reasoningSteps: string[] = [
      'Examinando semántica socrática en el corpus BONTEN...',
      'Extrayendo axiomas ontológicos y referencias canónicas...',
      'Generando orientación personalizada con rigor filosófico...',
    ];

    // Caso 1: Frank Vargas (Desarrollador / Arquitecto de Software)
    if (
      lower.includes('frank vargas') ||
      lower.includes('frank') ||
      lower.includes('quién hizo la web') ||
      lower.includes('quien desarrollo') ||
      lower.includes('desarrollador') ||
      lower.includes('programador') ||
      lower.includes('creador de la web')
    ) {
      reply =
        '⚡ **Ingeniería de Software & Arquitectura de la Plataforma: Frank Vargas**\n\n' +
        'Es fundamental hacer una **distinción clara de roles**:\n\n' +
        '• **Frank Vargas (Frank Emiliano Vargas Huamán)**: Es el **Desarrollador Principal y Arquitecto de Software** de BONTEN WEB. ' +
        'Responsable del diseño técnico integral, los protocolos criptográficos de gobernanza, el motor del Copilot IA, ' +
        'la estética visual ultra-premium y la infraestructura web.\n' +
        '• **Fireboy**: Es el **Fundador y Presidente Doctrinal** de BONTEN, autor de los manifiestos filosóficos y líder del movimiento provida.\n\n' +
        'Son dos personas distintas: Fireboy lidera el pensamiento y la doctrina de la resistencia; Frank Vargas construye y custodia el baluarte tecnológico.';
      routes.push({ label: 'Tratado de Fireboy', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Mesa Directiva BONTEN', href: '/integrantes' });
      routes.push({ label: 'Comunidad Provida', href: '/comunidad' });
    }

    // Caso 2: Fireboy (Fundador de BONTEN, Dorsal 7, Imagen Actualizada)
    else if (
      lower.includes('fireboy') ||
      lower.includes('fundador') ||
      lower.includes('presidente') ||
      lower.includes('dorsal 7') ||
      lower.includes('líder') ||
      lower.includes('lider')
    ) {
      reply =
        '🔥 **Fireboy — Fundador y Presidente de BONTEN**\n\n' +
        '• **Rol y Visión**: Líder Fundador del Bloque Provida, ensayista principal y apologeta presuposicional de BONTEN.\n' +
        '• **Pensamiento Central**: Sostiene que defender la vida no es un convencionalismo temporal, sino una exigencia ontológica inquebrantable frente al nihilismo de la época.\n' +
        '• **Iconografía Oficial**: Su imagen canónica lo representa con la **camiseta dorsal #7 en el estadio bajo la lluvia**, ' +
        'apuntando hacia lo alto como testimonio de fe, entereza y perseverancia ante la adversidad.\n' +
        '• **Obra Cumbre**: Autor del tratado magistral *"La Fractura Posmoderna: Desconstrucción del Nihilismo y Reivindicación de la Dignidad Humana"*.\n' +
        '• **Canales Oficiales**: Activo en TikTok (@fireboyphilosophy) y YouTube transmitiendo formación filosófica.';
      routes.push({ label: 'Leer Tratado de Fireboy', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Perfil de Fireboy', href: '/integrantes/fireboy' });
      routes.push({ label: 'Muro de la Comunidad', href: '/comunidad' });
    }

    // Caso 3: Biblioteca & Corpus de Tratados (6 Tratados)
    else if (
      lower.includes('biblioteca') ||
      lower.includes('tratados') ||
      lower.includes('documentos') ||
      lower.includes('libros') ||
      lower.includes('recursos') ||
      lower.includes('lecturas')
    ) {
      const docList = DOCUMENTS.map(
        (d) => `• **${d.title}**\n  ↳ *Autor:* ${d.author} | *Cat:* ${d.category} | *Tiempo:* ${d.readTime}`
      ).join('\n\n');

      reply =
        '📚 **Biblioteca y Archivo Doctrinal BONTEN (6 Tratados de Élite)**\n\n' +
        'Nuestra biblioteca alberga un corpus riguroso categorizado por disciplinas filosóficas y bioéticas:\n\n' +
        docList +
        '\n\nPuedes buscar en tiempo real, filtrar por categoría o escuchar la locución por voz en el visor interactivo:';
      routes.push({ label: 'Explorar Biblioteca Doctrinal', href: '#biblioteca-seccion' });
      routes.push({ label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Todos los Manifiestos', href: '/manifiestos' });
    }

    // Caso 4: Tratado de Posmodernidad & Filosofía Clásica
    else if (
      lower.includes('posmodernidad') ||
      lower.includes('nihilismo') ||
      lower.includes('bauman') ||
      lower.includes('foucault') ||
      lower.includes('gorgias') ||
      lower.includes('tonel') ||
      lower.includes('deconstructivismo')
    ) {
      reply =
        '📜 **Tratado Insignia: Crítica a la Posmodernidad (Fireboy)**\n\n' +
        'En esta disquisición cumbre, Fireboy desarticula la crisis ética de la civilización occidental:\n\n' +
        '1. **El Mito del Tonel Agujereado (Gorgias 493a)**: Sócrates demuestra que quien busca la libertad en el placer sin freno es como quien carga agua en un cántaro roto. El hedonismo posmoderno engendra esclavitud existencial.\n' +
        '2. **Biopolítica del Descarte**: Siguiendo a Foucault y Agamben, se expone cómo el poder contemporáneo divide a los seres humanos entre "vidas rentables" y "vidas prescindibles", justificando la eliminación del inocente.\n' +
        '3. **Modernidad Líquida (Bauman)**: La fragilidad extrema de los compromisos humanos convierte la concepción en una amenaza percibida, cuando en realidad es el origen sagrado del porvenir.';
      routes.push({ label: 'Leer Tratado Completo', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Ver en la Biblioteca', href: '#biblioteca-seccion' });
    }

    // Caso 5: Bioética Provida y Embriología Científica
    else if (
      lower.includes('provida') ||
      lower.includes('aborto') ||
      lower.includes('bioética') ||
      lower.includes('bioetica') ||
      lower.includes('concepción') ||
      lower.includes('embrión') ||
      lower.includes('vida humana')
    ) {
      reply =
        '⚖️ **Los Fundamentos Científicos y Bioéticos Provida de BONTEN**\n\n' +
        'Nuestra postura no se sustenta en dogmatismos ciegos, sino en la convergencia de la ciencia y la metafísica:\n\n' +
        '• **Genética y Embriología**: En la fertilización se forma el cigoto con un genoma humano completo, único, autoorganizado y teleológicamente orientado. No es una masa celular informe; es un ser humano en su etapa inicial.\n' +
        '• **Bioética Personalista (Elio Sgreccia)**: El cuerpo humano comparte indisolublemente la dignidad intrínseca de la persona. Ningún ser humano puede ser reducido a medio instrumental.\n' +
        '• **Defensa Jurídica Innegociable**: El derecho a la vida es el presupuesto ontológico previo de todos los demás derechos humanos.';
      routes.push({ label: 'Decálogo Provida en Comunidad', href: '/comunidad' });
      routes.push({ label: 'Debates sobre Bioética', href: '/debates' });
      routes.push({ label: 'Tratado de Bioética (Ilan)', href: '#biblioteca-seccion' });
    }

    // Caso 6: Mesa Directiva y Miembros
    else if (
      lower.includes('integrante') ||
      lower.includes('directiva') ||
      lower.includes('equipo') ||
      lower.includes('daniel') ||
      lower.includes('mijail') ||
      lower.includes('ilan') ||
      lower.includes('laura')
    ) {
      const list = leaders.map((l) => `• **${l.name}**: ${l.role} (${l.handle})`).join('\n');
      reply =
        '🛡️ **Mesa Directiva de BONTEN**\n\n' +
        'Nuestra conducción combina liderazgo apologético, rigor académico y vocación de servicio:\n\n' +
        list +
        '\n\nPuedes consultar la ficha completa de cada integrante con sus publicaciones destacadas:';
      routes.push({ label: 'Directorio de Integrantes', href: '/integrantes' });
      routes.push({ label: 'Ficha de Fireboy', href: '/integrantes/fireboy' });
      routes.push({ label: 'Ficha de Daniel', href: '/integrantes/daniel' });
    }

    // Caso 7: Comunidad y Adhesión
    else if (
      lower.includes('comunidad') ||
      lower.includes('unirme') ||
      lower.includes('adhesión') ||
      lower.includes('participar') ||
      lower.includes('muro')
    ) {
      reply =
        '🌐 **Comunidad de Resistencia Provida BONTEN**\n\n' +
        'Te invitamos a sumar tu voz a nuestra causa activa:\n' +
        '• **Muro de la Fraternidad**: Comparte testimonios y convicciones con miembros de todo el país.\n' +
        '• **Decálogo de Honor**: Conoce los 5 preceptos inmutables de nuestra defensa ética.\n' +
        '• **Compromiso Activo**: Regístrate para intervenir en debates y acceder a documentos exclusivos.';
      routes.push({ label: 'Entrar a la Comunidad', href: '/comunidad' });
      routes.push({ label: 'Crear Cuenta de Miembro', href: '/auth/register' });
      routes.push({ label: 'Foro de Debates', href: '/debates' });
    }

    // Caso 8: Mapa de Rutas General
    else {
      reply =
        `🏛️ **Orientación Canónica BONTEN (Aegis Core)**\n\n` +
        `Paz y firmeza ontológica. Estoy a tu servicio para orientarte en la verdad y la estructura de **${metadata.title}**:\n\n` +
        `• 📚 **Biblioteca & Archivo Doctrinal (#biblioteca-seccion)**: 6 tratados filosóficos completos.\n` +
        `• 🔥 **Tratado de Posmodernidad (/manifiestos/posmodernidad)**: El ensayo cumbre de Fireboy.\n` +
        `• 🛡️ **Mesa Directiva (/integrantes)**: Fichas de Fireboy, Daniel, Mijail, Ilan y Laura.\n` +
        `• 💬 **Foro de Debates (/debates)**: Dialéctica apologética y argumentación provida.\n` +
        `• 🌐 **Muro de la Comunidad (/comunidad)**: Adhesión fraterna y decálogo de honor.\n` +
        `• ⚡ **Créditos Técnicos**: Plataforma web y ciberseguridad por Frank Vargas.\n\n` +
        `¿En cuál de estas áreas deseas profundizar?`;
      routes.push({ label: 'Explorar Biblioteca', href: '#biblioteca-seccion' });
      routes.push({ label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Comunidad Provida', href: '/comunidad' });
    }

    return NextResponse.json({
      ok: true,
      reply,
      routes,
      reasoningSteps,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Error interno al procesar la orientación ontológica.' },
      { status: 500 }
    );
  }
}
