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

export async function POST(req: NextRequest) {
  try {
    // 1. Detección de IP y Rate Limiting (12 peticiones/minuto)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateCheck = checkRateLimit(ip, 12, 60 * 1000);
    if (!rateCheck.allowed) {
      recordSecurityEvent(ip, 'RATE_LIMIT_BLOCK', 'Saturación en Asistente Público de Navegación');
      return NextResponse.json(
        {
          error: 'Has alcanzado el límite de consultas por minuto. Por favor, aguarda un momento antes de formular otra pregunta.',
          retryAfterSec: rateCheck.retryAfterSec,
        },
        { status: 429 }
      );
    }

    // 2. Sanitización y Validación de Longitud (Protección contra Buffer & Prompt-Injection)
    const body = await req.json().catch(() => ({}));
    const rawPrompt = typeof body.prompt === 'string' ? body.prompt : '';
    const cleanPrompt = sanitizePlainText(rawPrompt, 300).trim();

    if (!cleanPrompt) {
      return NextResponse.json(
        { error: 'Por favor, introduce una pregunta u orientación sobre BONTEN.' },
        { status: 400 }
      );
    }

    const lower = cleanPrompt.toLowerCase();

    // 3. Ciberseguridad: Filtro de Evasión, Jailbreaks e Intentos Administrativos
    const jailbreakPatterns = [
      'ignore previous',
      'ignora las instrucciones',
      'dan mode',
      'password',
      'contraseña',
      'token',
      'session_token',
      'pbkdf2',
      'superadmin',
      'bypass',
      'sql injection',
      'system prompt',
      'prompt inicial',
      'dame el hash',
      'robar',
      'hackear',
      'vulnerabilidad',
      'shell',
      'cmd.exe',
      'powershell',
    ];

    const hasJailbreak = jailbreakPatterns.some((pattern) => lower.includes(pattern));
    if (hasJailbreak) {
      recordSecurityEvent(ip, 'SUSPICIOUS_PROBE', `Intento de evasión detectado en Asistente Público: "${cleanPrompt.slice(0, 50)}"`);
      return NextResponse.json({
        ok: true,
        reply:
          '🛡️ **Protocolo de Seguridad BONTEN**: Como Asistente de Orientación Pública, mi función es estrictamente informativa sobre nuestra filosofía, integrantes y rutas del sitio. Los protocolos de gobernanza, claves y configuraciones internas se encuentran aislados y bajo estricta salvaguarda criptográfica.',
        routes: [
          { label: 'Manifiestos y Filosofía', href: '/manifiestos' },
          { label: 'Comunidad Provida', href: '/comunidad' },
        ],
        reasoningSteps: [
          'Analizando vectores de consulta en el perímetro...',
          'Verificando políticas de aislamiento informativo...',
          'Aplicando salvaguarda criptográfica y reconducción temática...',
        ],
      });
    }

    // 4. Filtro de Desvío: Preguntas Ajenas a BONTEN (Out-of-Scope Defense)
    const outOfScopePatterns = [
      'receta de cocina',
      'clima en',
      'quién ganó el partido',
      'programame un script',
      'escribe código en python',
      'escribe código en java',
      'recomiéndame una película',
      'horóscopo',
      'criptomonedas para invertir',
      'diagnóstico médico',
    ];

    const isOutOfScope = outOfScopePatterns.some((pattern) => lower.includes(pattern));
    if (isOutOfScope) {
      return NextResponse.json({
        ok: true,
        reply:
          '🏛️ **Ámbito de Orientación BONTEN**: Estoy consagrado exclusivamente a orientarte dentro de la plataforma **BONTEN**. Puedo asistirte en la lectura de nuestros manifiestos, la consulta del Tratado de Posmodernidad de Fireboy, el perfil de nuestros directivos o la participación en debates y la comunidad provida. ¿En qué aspecto de nuestro movimiento deseas profundizar?',
        routes: [
          { label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' },
          { label: 'Directorio de Integrantes', href: '/integrantes' },
          { label: 'Foro de Debates', href: '/debates' },
        ],
        reasoningSteps: [
          'Evaluando correspondencia con el corpus de BONTEN...',
          'Detectada consulta no afín a la temática institucional...',
          'Orientando al usuario hacia los módulos principales de la web...',
        ],
      });
    }

    // 5. Motor Semántico de Respuestas Internas Grounded (Netamente Informativo de la Web)
    const metadata = getSiteMetadata();
    const leaders = getAllLeaders();

    let reply = '';
    const routes: NavigationRoute[] = [];
    const reasoningSteps: string[] = [
      'Indexando consulta en el grafo de conocimiento BONTEN...',
      'Extrayendo referencias doctrinales y rutas canónicas...',
      'Sintetizando respuesta de orientación estructurada...',
    ];

    // Caso A: Tratado de Posmodernidad (Fireboy)
    if (
      lower.includes('posmodernidad') ||
      lower.includes('ensayo') ||
      lower.includes('tratado') ||
      lower.includes('foucault') ||
      lower.includes('bauman') ||
      lower.includes('gorgias') ||
      lower.includes('tonel') ||
      lower.includes('nihilismo')
    ) {
      reply =
        '📜 **Tratado Mayor: Crítica a la Posmodernidad y Defensa Ontológica de la Vida**\n\n' +
        'Este ensayo cumbre, redactado por **Fireboy**, constituye una refutación ontológica y epistemológica al deconstructivismo contemporáneo. En él se abordan:\n' +
        '• **La Metáfora de los Dos Toneles (Platón, Gorgias 493a)**: La distinción socrática entre el alma templada y el deseo insaciable de la posmodernidad.\n' +
        '• **Biopolítica y Modernidad Líquida**: Examen de Michel Foucault y Zygmunt Bauman frente a la disolución de los vínculos y la cosificación del ser.\n' +
        '• **El Estatus Ontológico del Ser Humano**: Demostración de que la dignidad humana es un bien intrínseco e innegociable desde su génesis biológica.\n\n' +
        'Puedes leer el tratado completo con tipografía editorial inmersiva y opción de descarga en PDF en la sección dedicada:';
      routes.push({ label: 'Leer Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Ver Todos los Manifiestos', href: '/manifiestos' });
    }

    // Caso B: Bioética Provida & Doctrina
    else if (
      lower.includes('provida') ||
      lower.includes('vida') ||
      lower.includes('aborto') ||
      lower.includes('bioética') ||
      lower.includes('bioetica') ||
      lower.includes('deontología') ||
      lower.includes('ética') ||
      lower.includes('concepción') ||
      lower.includes('gestación')
    ) {
      reply =
        '⚖️ **La Doctrina y Compromiso Provida de BONTEN**\n\n' +
        'En BONTEN defendemos la vida humana con base en la **ciencia embriológica, la bioética personalista y la filosofía clásica**:\n' +
        '• Sostenemos que desde el momento de la fecundación existe un individuo de la especie humana con un genoma único e irrepetible.\n' +
        '• Rechazamos cualquier intento utilitarista de subordinar el derecho a existir a conveniencias sociales o económicas.\n' +
        '• Promovemos el debate riguroso sin concesiones ideológicas, fundamentado en la verdad objetiva y el Decálogo Provida.';
      routes.push({ label: 'Decálogo en la Comunidad', href: '/comunidad' });
      routes.push({ label: 'Manifiesto de Ética y Verdad', href: '/manifiestos/etica' });
      routes.push({ label: 'Debates sobre Bioética', href: '/debates' });
    }

    // Caso C: Fireboy (Fundador, Perfil, Imagen Dorsal 7)
    else if (
      lower.includes('fireboy') ||
      lower.includes('fundador') ||
      lower.includes('dorsal 7') ||
      lower.includes('líder') ||
      lower.includes('lider')
    ) {
      reply =
        `🔥 **Fireboy — Fundador y Líder de BONTEN**\n\n` +
        `• **Rol Principal**: Líder Fundador, Ensayista y Especialista en Apologética Presuposicional.\n` +
        `• **Lema de Vida**: *"El único impulso que no puede ser frenado es la curiosidad."*\n` +
        `• **Identidad & Iconografía**: Retratado oficialmente con el **dorsal 7 en el estadio bajo la lluvia**, simbolizando perseverancia, disciplina y liderazgo ante la adversidad.\n` +
        `• **Canales**: Activo en TikTok (${metadata.fireboy.handle}) y YouTube compartiendo reflexiones filosóficas y defensas doctrinales.`;
      routes.push({ label: 'Ficha Completa de Fireboy', href: '/integrantes/fireboy' });
      routes.push({ label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' });
    }

    // Caso D: Integrantes & Mesa Directiva
    else if (
      lower.includes('integrante') ||
      lower.includes('miembro') ||
      lower.includes('equipo') ||
      lower.includes('daniel') ||
      lower.includes('mijail') ||
      lower.includes('ilan') ||
      lower.includes('laura')
    ) {
      const namesList = leaders.map((l) => `• **${l.name}**: ${l.role} (${l.handle})`).join('\n');
      reply =
        '🛡️ **Mesa Directiva y Liderazgo de BONTEN**\n\n' +
        'El equipo está conformado por defensores comprometidos con la verdad y la dignidad humana:\n' +
        namesList +
        '\n\nPuedes explorar el perfil individual de cada directivo con sus publicaciones y análisis:';
      routes.push({ label: 'Explorar Todos los Integrantes', href: '/integrantes' });
      routes.push({ label: 'Perfil de Fireboy', href: '/integrantes/fireboy' });
      routes.push({ label: 'Perfil de Daniel', href: '/integrantes/daniel' });
    }

    // Caso E: Comunidad Provida & Muro Fraternal
    else if (
      lower.includes('comunidad') ||
      lower.includes('muro') ||
      lower.includes('unirme') ||
      lower.includes('participar') ||
      lower.includes('fraternidad') ||
      lower.includes('adhesión')
    ) {
      reply =
        '🌐 **Mini-Comunidad & Muro Fraternal de Resistencia**\n\n' +
        'Hemos creado un espacio exclusivo dentro de la web para la confraternidad de defensores provida:\n' +
        '• **Muro de Testimonios**: Publica mensajes de aliento y posturas éticas.\n' +
        '• **Decálogo Provida**: Los 5 pilares deontológicos de nuestra resistencia.\n' +
        '• **Compromiso de Honor**: Firma simbólica para sellar tu adhesión a la defensa de los vulnerables.\n' +
        '• **Métricas en Vivo**: Conteo de miembros y aportes sincronizados en tiempo real.';
      routes.push({ label: 'Entrar a la Comunidad', href: '/comunidad' });
      routes.push({ label: 'Participar en Debates', href: '/debates' });
    }

    // Caso F: Debates & Foro
    else if (
      lower.includes('debate') ||
      lower.includes('foro') ||
      lower.includes('argumento') ||
      lower.includes('discusión') ||
      lower.includes('opinar')
    ) {
      const topDebates = INITIAL_DEBATES.slice(0, 3)
        .map((d) => `• **${d.title}** (${d.tag}) — ${d.commentsCount} intervenciones`)
        .join('\n');

      reply =
        '💬 **Foro de Debates y Argumentación Racional**\n\n' +
        'En BONTEN sometemos a escrutinio filosófico los temas más críticos de nuestra época:\n' +
        topDebates +
        '\n\nPuedes leer los argumentos a favor y en contra o participar si posees una cuenta de miembro:';
      routes.push({ label: 'Ver Foro de Debates', href: '/debates' });
      routes.push({ label: 'Acceder como Miembro', href: '/auth/login' });
    }

    // Caso G: Manifiestos & Biblioteca de Lecturas
    else if (
      lower.includes('manifiesto') ||
      lower.includes('biblioteca') ||
      lower.includes('documento') ||
      lower.includes('lectura') ||
      lower.includes('fundamento')
    ) {
      const docsSample = DOCUMENTS.slice(0, 3)
        .map((doc) => `• **${doc.title}** (${doc.category}) • ${doc.readTime}`)
        .join('\n');

      reply =
        '📜 **Manifiestos y Corpus Doctrinal BONTEN**\n\n' +
        'Nuestra biblioteca reúne textos fundamentales sobre apologética, ética y bioética:\n' +
        docsSample +
        '\n\nPuedes leerlos en línea con visor interactivo y citas de fuentes académicas:';
      routes.push({ label: 'Biblioteca de Manifiestos', href: '/manifiestos' });
      routes.push({ label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' });
    }

    // Caso H: Mapa del Sitio / Orientación General
    else {
      reply =
        `🧭 **Guía de Navegación BONTEN**\n\n` +
        `Bienvenido al portal institucional de **${metadata.title}**.\n` +
        `Aquí tienes el mapa de las principales rutas informativas del sitio:\n\n` +
        `1. ⚡ **Inicio (/)**: Portada, manifiesto visual, telemetría y novedades.\n` +
        `2. 🛡️ **Integrantes (/integrantes)**: Fichas de Fireboy, Daniel, Mijail, Ilan y Laura.\n` +
        `3. 📜 **Manifiestos (/manifiestos)**: Tratado de Posmodernidad y biblioteca doctrinal.\n` +
        `4. 💬 **Debates (/debates)**: Foro de discusión bioética, filosófica y teológica.\n` +
        `5. 🌐 **Comunidad (/comunidad)**: Muro interactivo provida y decálogo de resistencia.\n\n` +
        `¿Sobre cuál de estas secciones te gustaría que te oriente?`;
      routes.push({ label: 'Explorar Manifiestos', href: '/manifiestos' });
      routes.push({ label: 'Conocer Integrantes', href: '/integrantes' });
      routes.push({ label: 'Muro de Comunidad', href: '/comunidad' });
    }

    return NextResponse.json({
      ok: true,
      reply,
      routes,
      reasoningSteps,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Error interno al procesar la orientación.' },
      { status: 500 }
    );
  }
}
