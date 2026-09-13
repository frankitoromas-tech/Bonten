import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, recordSecurityEvent } from '@/lib/security/rateLimiter';
import { sanitizePlainText } from '@/lib/security/sanitizer';
import { getAllLeaders } from '@/data/members';
import { DOCUMENTS } from '@/data/library';
import { INITIAL_DEBATES } from '@/data/debates';
import { MEMBER_PUBLICATIONS } from '@/data/publications';
import { MEMBER_DETAILS } from '@/data/member_details';
import { MANIFIESTOS } from '@/data/manifiestos';
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

    // 5. Motor Semántico de Alta Inteligencia (Dialéctica Socrática, Bioética y Epistemología)
    const metadata = getSiteMetadata();
    const leaders = getAllLeaders();

    let reply = '';
    const routes: NavigationRoute[] = [];
    let reasoningSteps: string[] = [
      'Analizando morfología semántica y ontología de la consulta...',
      'Accediendo al corpus canónico y tratados de BONTEN...',
      'Sintetizando disquisición dialéctica con rigor bioético y filosófico...',
    ];

    // =========================================================================
    // DOMINIO A: OBJECIONES BIOÉTICAS Y CIENTÍFICAS ESPECÍFICAS
    // =========================================================================

    // Sub-caso A1: Autonomía Corporal ("Mi cuerpo, mi decisión")
    if (
      lower.includes('mi cuerpo') ||
      lower.includes('autonomía corporal') ||
      lower.includes('autonomia corporal') ||
      lower.includes('propiedad de su cuerpo') ||
      lower.includes('derecho a decidir')
    ) {
      reasoningSteps = [
        'Identificado tópico de autonomía corporal y bioética ontológica...',
        'Consultando genética embriológica (diferenciación genómica y singamia)...',
        'Articulando refutación socrática basada en la alteridad del concebido...',
      ];
      reply =
        '🧬 **Refutación Bioética: La Alteridad Genética frente a "Mi Cuerpo, Mi Decisión"**\n\n' +
        'El argumento de la autonomía corporal adolece de un error ontológico y biológico fundamental: **la confusión entre huésped y órgano**.\n\n' +
        '• **Alteridad Genética Irrefutable**: En la fecundación (singamia) se constituye un genoma diploide humano de 46 cromosomas enteramente nuevo, único e irrepetible, con 50% de información paterna y 50% materna. El concebido no es un tejido, apéndice ni órgano de la madre.\n' +
        '• **Individuo Teleológico Autoorganizado**: La embriología moderna (desde Jérôme Lejeune) demuestra que el embrión coordina activamente su propio desarrollo biológico en una trayectoria continua y no contingente.\n' +
        '• **Límite Metaético de la Autonomía**: Todo principio de libertad personal halla su límite infranqueable en la alteridad: nadie posee derecho moral o jurídico de disponer de la vida física de otro individuo humano inocente.\n\n' +
        'La verdadera justicia social no sacrifica al indefenso para resolver un conflicto circunstancial; ampara a ambos.';
      routes.push({ label: 'Tratado de Bioética (Ilan)', href: '#biblioteca-seccion' });
      routes.push({ label: 'Decálogo Provida en Comunidad', href: '/comunidad' });
      routes.push({ label: 'Debates sobre Bioética', href: '/debates' });
    }

    // Sub-caso A2: Aborto Terapéutico & Principio del Doble Efecto
    else if (
      lower.includes('terapéutico') ||
      lower.includes('terapeutico') ||
      lower.includes('salvar a la madre') ||
      lower.includes('riesgo de vida') ||
      lower.includes('ectópico') ||
      lower.includes('ectopico') ||
      lower.includes('doble efecto')
    ) {
      reasoningSteps = [
        'Analizando dilemas bioéticos perinatales y colisión de bienes jurídicos...',
        'Aplicando principio del voluntario indirecto (Doble Efecto tomista)...',
        'Contrastando acto médico terapéutico vs eliminación directa del concebido...',
      ];
      reply =
        '⚖️ **Bioética Perinatal: Principio del Doble Efecto vs. Aborto Directo**\n\n' +
        'En la bioética personalista, la distinción entre un tratamiento médico necesario y un aborto provocado radica en la **intencionalidad y causalidad del acto moral**:\n\n' +
        '• **Principio del Doble Efecto (Santo Tomás de Aquino)**: Si una intervención médica busca salvar la vida amenazada de la madre (ej. salpingectomía por embarazo ectópico roto o extirpación de tumor uterino), y la muerte del concebido sobreviene como un efecto secundario indirecto, previsto pero jamás buscado ni como fin ni como medio, el acto es moralmente lícito.\n' +
        '• **Rechazo al Aborto Directo**: El denominado "aborto terapéutico" que procura deliberadamente la muerte del feto como mecanismo de solución clínica contradice el principio hipocrático de primum non nocere (lo primero es no dañar).\n' +
        '• **Doctrina Médica Integral**: El deber de la obstetricia de vanguardia es salvaguardar siempre a ambos pacientes: madre e hijo.';
      routes.push({ label: 'Bases Ontológicas (Daniel)', href: '/integrantes/daniel' });
      routes.push({ label: 'Biblioteca Doctrinal', href: '#biblioteca-seccion' });
      routes.push({ label: 'Foro de Debates', href: '/debates' });
    }

    // Sub-caso A3: Violación o Traumas Complejos
    else if (
      lower.includes('violación') ||
      lower.includes('violacion') ||
      lower.includes('abuso') ||
      lower.includes('incesto')
    ) {
      reasoningSteps = [
        'Procesando caso límite de trauma bioético y victimología...',
        'Diferenciando responsabilidad penal del agresor vs estatuto del inocente...',
        'Articulando protocolo de acogida, justicia y protección de la vida...',
      ];
      reply =
        '🛡️ **Trauma y Dignidad: Justicia frente al Crimen sin Represalias al Inocente**\n\n' +
        'La violación es un crimen atroz que merece la máxima condena penal y el repudio absoluto de la sociedad. Sin embargo, el análisis ontológico exige rigor y coherencia moral:\n\n' +
        '• **El Inocente no Hereda la Culpa**: Ningún ser humano elige las circunstancias biológicas o morales de su procreación. Condenar a muerte al hijo no nacido por el crimen perpetrado por su progenitor paterno constituye una traslación injusta de la pena capital hacia una tercera persona enteramente inocente.\n' +
        '• **No Sanación mediante Eliminación**: La experiencia clínica perinatal confirma que el aborto no repara el trauma de la violencia sexual; por el contrario, suma una segunda herida traumática (síndrome post-aborto) sobre la víctima.\n' +
        '• **Compromiso Provida Radical**: El Estado y la comunidad deben proveer asistencia psicológica, médica, legal y financiera irrestricta a la madre, garantizando opciones dignas de maternidad protegida o adopción inmediata.';
      routes.push({ label: 'Manifiesto de Resistencia NG', href: '#biblioteca-seccion' });
      routes.push({ label: 'Comunidad Provida', href: '/comunidad' });
    }

    // Sub-caso A4: Estatus del Cigoto / Embrión / "¿Desde cuándo es persona?"
    else if (
      lower.includes('desde cuando') ||
      lower.includes('cigoto') ||
      lower.includes('embrion') ||
      lower.includes('embrión') ||
      lower.includes('feto') ||
      lower.includes('es persona') ||
      lower.includes('ser humano') ||
      lower.includes('concepción') ||
      lower.includes('concepcion')
    ) {
      reasoningSteps = [
        'Accediendo a la embriología humana canónica y personalismo ontológico...',
        'Desmontando criterios funcionalistas gradualistas (Singer / Tooley)...',
        'Confirmando continuidad ontológica desde la singamia...',
      ];
      reply =
        '🧬 **Estatuto Biológico y Ontológico del Ser Humano desde la Concepción**\n\n' +
        'La pregunta sobre el inicio de la vida no es un dilema de consenso político; es un hecho zanjado por la genética y la embriología moderna:\n\n' +
        '• **Continuidad Biológica Ininterrumpida**: Desde el instante en que el espermatozoide fertiliza el óvulo, se inicia un proceso continuo, coordinado y gradual. No existen "saltos metafísicos" entre cigoto, embrión, feto, recién nacido o anciano; es el mismo ser humano en distintas fases de maduración biológica.\n' +
        '• **Falacia Funcionalista**: Corrientes utilitaristas pretenden supeditar la "condición de persona" a la presencia de corteza cerebral, viabilidad extrauterina o autoconciencia. Esta postura es discriminatoria: la dignidad humana radica en la **naturaleza sustancial** del ser, no en el ejercicio transitorio de funciones accesorias.\n' +
        '• **Principio Pro Homine**: Ante cualquier duda epistémica, el derecho internacional y la ética natural exigen salvaguardar incondicionalmente la vida del concebido.';
      routes.push({ label: 'Tratado de Bioética (Ilan)', href: '#biblioteca-seccion' });
      routes.push({ label: 'Bases Ontológicas (Daniel)', href: '/integrantes/daniel' });
      routes.push({ label: 'Manifiesto Fundamentos', href: '/manifiestos/fundamentos' });
    }

    // Sub-caso A5: Eutanasia, Transhumanismo & Manipulación Genética
    else if (
      lower.includes('eutanasia') ||
      lower.includes('transhumanismo') ||
      lower.includes('manipulación génica') ||
      lower.includes('crispr') ||
      lower.includes('eugenesia') ||
      lower.includes('enfermos terminales')
    ) {
      reasoningSteps = [
        'Consultando tratado de Bioética Personalista vs Transhumanismo (Ilan)...',
        'Examinando principios de Elio Sgreccia y mercantilización genética...',
        'Conectando biopoder con descarte contemporáneo de la vulnerabilidad...',
      ];
      reply =
        '🔬 **Bioética Personalista frente al Transhumanismo y la Eutanasia**\n\n' +
        'En su tratado magistral, **Ilan** deconstruye las derivas mecanicistas que amenazan la antropología integral:\n\n' +
        '• **Los Cuatro Principios de Elio Sgreccia**: 1) Defensa de la vida física, 2) Principio de totalidad o terapéutico, 3) Libertad y responsabilidad, 4) Solidaridad y subsidiariedad.\n' +
        '• **El Engaño Transhumanista**: Prometer inmortalidad tecnológica mediante edición CRISPR o hibridación artificial convierte al cuerpo en mercancía descartable. La verdadera vanguardia no es rediseñar al hombre, sino custodiar su dignidad intrínseca.\n' +
        '• **Eutanasia como Abandono Social**: La eutanasia es la claudicación del sistema de salud ante el sufrimiento evitable. BONTEN defiende los cuidados paliativos integrales y el acompañamiento afectivo hasta la muerte natural, repudiando la eutanasia como eugenesia selectiva disfrazada de compasión.';
      routes.push({ label: 'Tratado de Bioética Completo', href: '#biblioteca-seccion' });
      routes.push({ label: 'Perfil de Ilan', href: '/integrantes/ilan' });
      routes.push({ label: 'Foro de Debates', href: '/debates' });
    }

    // =========================================================================
    // DOMINIO B: FILOSOFÍA CLÁSICA, POSMODERNIDAD & SOCIOLOGÍA CRÍTICA
    // =========================================================================

    // Sub-caso B1: Alegoría del Tonel Agujereado (Gorgias 493a)
    else if (
      lower.includes('tonel') ||
      lower.includes('gorgias') ||
      lower.includes('calicles') ||
      lower.includes('sócrates') ||
      lower.includes('socrates') ||
      lower.includes('hedonismo') ||
      lower.includes('templanza') ||
      lower.includes('criba')
    ) {
      reasoningSteps = [
        'Localizando alegoría socrática en Platón (Gorgias 493a-d)...',
        'Contrastando sophrosyne socrática con apetito insaciable calicleano...',
        'Conectando hedonismo clásico con consumismo existencial posmoderno...',
      ];
      reply =
        '🏺 **El Mito del Tonel Agujereado (Gorgias 493a): Deseo Insaciable vs. Templanza Socrática**\n\n' +
        'En el diálogo platónico *Gorgias*, Sócrates refuta la tesis tiránica de Calicles sobre la felicidad entendida como satisfacción sin freno de los deseos:\n\n' +
        '• **La Alegoría de los Dos Hombres**: Uno posee toneles sanos; los llena una vez con esfuerzo moderado y goza de paz interior y autosuficiencia. El otro tiene toneles rotos y agujereados; vive condenado día y noche a intentar llenarlos con una criba, bajo tormento y zozobra perpetua.\n' +
        '• **La Esclavitud del Hedonismo**: Quien no domina sus pasiones no es libre; es un esclavo de sus estímulos biológicos y del consumo incesante.\n' +
        '• **Aplicación a BONTEN**: La resistencia moral frente a la cultura de la muerte exige sobriedad intelectual, carácter austero y autodominio para no sucumbir a la seducción del conformismo masivo.';
      routes.push({ label: 'Tratado del Mito del Tonel (Daniel)', href: '#biblioteca-seccion' });
      routes.push({ label: 'Publicación de Ilan (Gorgias)', href: '/integrantes/ilan' });
      routes.push({ label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' });
    }

    // Sub-caso B2: Tratado de Posmodernidad (Fireboy) & Nihilismo
    else if (
      lower.includes('posmodernidad') ||
      lower.includes('fractura') ||
      lower.includes('nihilismo') ||
      lower.includes('telos') ||
      lower.includes('verdad') && lower.includes('relativismo')
    ) {
      reasoningSteps = [
        'Accediendo al tratado cumbre de Fireboy (La Fractura Posmoderna)...',
        'Analizando deconstrucción ontológica del telos humano...',
        'Estructurando tesis del tránsito del Ser al Deseo...',
      ];
      reply =
        '📜 **Tratado Insignia: La Fractura Posmoderna y la Deconstrucción del Nihilismo (Fireboy)**\n\n' +
        'En este ensayo fundacional, Fireboy desmonta la patología espiritual de la era contemporánea:\n\n' +
        '• **La Ruptura del Telos Humano**: La posmodernidad abandonó los grandes relatos y la verdad ontológica inmutable, reduciendo la libertad humana al mero derecho de elegir entre simulacros de consumo efímero.\n' +
        '• **Primacía del Deseo sobre el Ser**: Cuando el deseo individual se erige en árbitro supremo de la moralidad, el ser humano más indefenso (el no nacido) se convierte en un obstáculo pragmático que el sistema utilitarista busca eliminar.\n' +
        '• **El Escándalo de la Inocencia**: El concebido interpela a la sociedad posmoderna porque existe sin consumir, interpela sin hablar y exige amor incondicional sin contraprestación mercantil.\n' +
        '• **Llamado a la Resistencia**: Construir una vanguardia de jóvenes que rearticulen la fe, la razón y la bioética con rigor intelectual innegociable.';
      routes.push({ label: 'Leer Tratado Completo', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Perfil de Fireboy', href: '/integrantes/fireboy' });
      routes.push({ label: 'Todos los Manifiestos', href: '/manifiestos' });
    }

    // Sub-caso B3: Biopolítica & Modernidad Líquida (Foucault, Agamben, Bauman)
    else if (
      lower.includes('biopolítica') ||
      lower.includes('biopolitica') ||
      lower.includes('foucault') ||
      lower.includes('agamben') ||
      lower.includes('bauman') ||
      lower.includes('homo sacer') ||
      lower.includes('modernidad líquida') ||
      lower.includes('modernidad liquida')
    ) {
      reasoningSteps = [
        'Sintetizando tratados de biopolítica y teoría crítica contemporánea...',
        'Conectando biopoder ("hacer vivir / dejar morir") con Homo Sacer...',
        'Evaluando impacto de la modernidad líquida en la desvinculación ética...',
      ];
      reply =
        '🏛️ **Biopolítica y Modernidad Líquida: Del Biopoder al Homo Sacer Contemporáneo**\n\n' +
        'Nuestra biblioteca articula una crítica profunda a las estructuras de dominación modernas:\n\n' +
        '• **Michel Foucault (Biopoder)**: La soberanía pasó del tradicional "hacer morir o dejar vivir" a la biopolítica del "hacer vivir y dejar morir", donde el Estado contemporáneo gestiona biológicamente qué poblaciones son rentables y cuáles resultan gravosas.\n' +
        '• **Giorgio Agamben (Homo Sacer)**: El no nacido y el enfermo terminal son arrojados a un estado de excepción permanente: vidas desprovistas de estatuto jurídico que pueden ser eliminadas sin que la ley lo compute como homicidio.\n' +
        '• **Zygmunt Bauman (Modernidad Líquida)**: La fragilidad extrema de los compromisos humanos engendra una cultura del descarte donde la procreación se percibe como una amenaza a la autonomía consumista antes que como el don supremo de la existencia.';
      routes.push({ label: 'Tratado de Biopolítica (Comité)', href: '#biblioteca-seccion' });
      routes.push({ label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Debates Activos', href: '/debates' });
    }

    // =========================================================================
    // DOMINIO C: MESA DIRECTIVA, INTEGRANTES Y PUBLICACIONES
    // =========================================================================

    // Sub-caso C1: Fireboy (Fundador, Dorsal 7, Presidente)
    else if (
      lower.includes('fireboy') ||
      lower.includes('fundador') ||
      lower.includes('presidente') ||
      lower.includes('dorsal 7') ||
      lower.includes('dorsal #7')
    ) {
      const pub = MEMBER_PUBLICATIONS.fireboy;
      reply =
        '🔥 **Fireboy — Líder Fundador y Presidente de BONTEN**\n\n' +
        '• **Rol en la Resistencia**: Ensayista principal, orador y apologeta presuposicional. Encabeza la dirección doctrinal y estratégica del movimiento provida.\n' +
        '• **Iconografía Canónica**: Representado con la **camiseta dorsal #7 en el estadio bajo la lluvia**, apuntando al cielo como símbolo de perseverancia inquebrantable, fe y rectitud ante la tormenta cultural.\n' +
        '• **Publicación Destacada**: *"La Necesidad Ineludible de la Resistencia Intelectual"*, donde expone por qué el letargo del pensamiento es la antesala de la sumisión cultural.\n' +
        '• **Tratado Insignia**: Autor de *"La Fractura Posmoderna: Desconstrucción del Nihilismo y Reivindicación de la Dignidad Humana"*.\n' +
        '• **Redes Oficiales**: TikTok: @fireboyphilosophy | YouTube: Fireboy Philosophy.';
      routes.push({ label: 'Leer Ensayo de Fireboy', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Ficha de Fireboy', href: '/integrantes/fireboy' });
      routes.push({ label: 'Mesa Directiva', href: '/integrantes' });
    }

    // Sub-caso C2: Daniel (Administrador & Bioética Jurídica)
    else if (lower.includes('daniel') || lower.includes('brightburn')) {
      const pub = MEMBER_PUBLICATIONS.daniel;
      reply =
        '🛡️ **Daniel — Administrador y Co-administrador de Comunidad**\n\n' +
        '• **Rol & Especialidad**: Administrador de BONTEN, moderador del foro de debates y defensor del derecho natural y la ética personalista.\n' +
        '• **Publicación Destacada**: *"Bases Ontológicas y Éticas de la Defensa de la Vida"*, donde fundamenta que la dignidad humana es un límite infranqueable a la tiranía y al arbitrio estatal.\n' +
        '• **Tratado en Biblioteca**: Autor del ensayo pedagógico sobre *El Mito del Tonel Agujereado (Gorgias 493a)*.\n' +
        '• **Canales**: Activo en TikTok (@brightburn.1895.t) coordinando la formación ética de la comunidad.';
      routes.push({ label: 'Ficha de Daniel', href: '/integrantes/daniel' });
      routes.push({ label: 'Ver Publicación de Daniel', href: '/integrantes/daniel' });
      routes.push({ label: 'Foro de Debates', href: '/debates' });
    }

    // Sub-caso C3: Mijail (Estratega & Lógica Dialéctica)
    else if (lower.includes('mijail') || lower.includes('falacias')) {
      const pub = MEMBER_PUBLICATIONS.mijail;
      reply =
        '🧠 **Mijail — Administrador y Estratega Dialéctico**\n\n' +
        '• **Rol & Especialidad**: Pilar estratégico de BONTEN, analista de discurso crítico y detector de falacias lógicas en debates de alta polarización.\n' +
        '• **Publicación Destacada**: *"Desmontando Falacias: Dialéctica y Rigor en el Discurso Público"*, un manual analítico contra el ad hominem, el falso dilema y el hombre de paja.\n' +
        '• **Misión**: Fomentar el pensamiento analítico riguroso y la disciplina intelectual en las plataformas digitales.\n' +
        '• **Canales**: TikTok (@mijail0712) liderando refutaciones dialécticas en tiempo real.';
      routes.push({ label: 'Ficha de Mijail', href: '/integrantes/mijail' });
      routes.push({ label: 'Mesa Directiva', href: '/integrantes' });
      routes.push({ label: 'Debates de la Comunidad', href: '/debates' });
    }

    // Sub-caso C4: Ilan / Ian (Consejo Doctrinal & Bioética)
    else if (lower.includes('ilan') || lower.includes('ian') || lower.includes('belmonte')) {
      const pub = MEMBER_PUBLICATIONS.ilan;
      reply =
        '⚖️ **Ilan J. Jiménez R. — Consejo Doctrinal y Especialista en Bioética**\n\n' +
        '• **Rol & Especialidad**: Administrador y asesor doctrinario en bioética personalista, hermenéutica clásica y diálogo socrático.\n' +
        '• **Publicación Destacada**: *"Sócrates sobre el placer, la virtud y el bien (Alegoría de los dos toneles)"*, disquisición metaética basada en el Gorgias platónico.\n' +
        '• **Tratado en Biblioteca**: Autor de *"Bioética Personalista frente al Transhumanismo y la Manipulación Génica"*, aplicando los 4 principios de Elio Sgreccia.\n' +
        '• **Canales**: TikTok (@ianhbelmonte) difundiendo argumentos racionales y bioéticos.';
      routes.push({ label: 'Ficha de Ilan', href: '/integrantes/ilan' });
      routes.push({ label: 'Tratado de Bioética (Ilan)', href: '#biblioteca-seccion' });
      routes.push({ label: 'Mesa Directiva', href: '/integrantes' });
    }

    // Sub-caso C5: Laura (Comunicaciones & Juventud Provida)
    else if (lower.includes('laura') || lower.includes('comunicación')) {
      reply =
        '🌟 **Laura — Administradora y Coordinadora de Comunicaciones**\n\n' +
        '• **Rol & Especialidad**: Líder de activismo, dirección de estrategias de comunicación pública y movilización de nuevas generaciones en defensa de la vida.\n' +
        '• **Misión**: Extender la voz de la resistencia provida a nivel intergeneracional, inspirando compromiso y disciplina comunitaria.\n' +
        '• **Canales**: TikTok (@lauhernandez982) impulsando campañas de concientización ética.';
      routes.push({ label: 'Ficha de Laura', href: '/integrantes/laura' });
      routes.push({ label: 'Muro de la Comunidad', href: '/comunidad' });
      routes.push({ label: 'Mesa Directiva', href: '/integrantes' });
    }

    // Sub-caso C6: Mesa Directiva General
    else if (
      lower.includes('integrante') ||
      lower.includes('directiva') ||
      lower.includes('mesa directiva') ||
      lower.includes('equipo') ||
      lower.includes('quiénes son') ||
      lower.includes('quienes son')
    ) {
      const list = leaders.map((l) => `• **${l.name}** — *${l.role}* (${l.handle})`).join('\n');
      reply =
        '🛡️ **Mesa Directiva y Consejo de Conducción BONTEN**\n\n' +
        'Nuestra estructura directiva combina liderazgo apologético, rigor jurídico y vocación formativa:\n\n' +
        list +
        '\n\nPuedes explorar el perfil individual de cada líder con sus disquisiciones, métricas y publicaciones académicas:';
      routes.push({ label: 'Directorio de Integrantes', href: '/integrantes' });
      routes.push({ label: 'Ficha de Fireboy', href: '/integrantes/fireboy' });
      routes.push({ label: 'Ficha de Daniel', href: '/integrantes/daniel' });
    }

    // =========================================================================
    // DOMINIO D: BIBLIOTECA EDITORIAL & ARCHIVO DOCTRINAL (6 TRATADOS)
    // =========================================================================
    else if (
      lower.includes('biblioteca') ||
      lower.includes('tratados') ||
      lower.includes('documentos') ||
      lower.includes('libros') ||
      lower.includes('recursos') ||
      lower.includes('leer') ||
      lower.includes('archivo')
    ) {
      const docSummaries = DOCUMENTS.map(
        (d) => `• **${d.title}**\n  ↳ *Autor:* ${d.author} | *Nivel:* ${d.level ?? 'Intermedio'} | *Lectura:* ${d.readTime}`
      ).join('\n\n');

      reply =
        '📚 **Biblioteca Editorial & Archivo Doctrinal BONTEN (6 Tratados de Élite)**\n\n' +
        'Disponemos de un corpus clasificado con visor interactivo a pantalla completa y locución por voz:\n\n' +
        docSummaries +
        '\n\nPuedes filtrar por categoría (Posmodernidad, Bioética, Doctrina, Filosofía Clásica o Teología) y acceder a la lectura integral inmediata:';
      routes.push({ label: 'Explorar Biblioteca Doctrinal', href: '#biblioteca-seccion' });
      routes.push({ label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Ver Todos los Manifiestos', href: '/manifiestos' });
    }

    // =========================================================================
    // DOMINIO E: DEBATES COMUNITARIOS & DIALÉCTICA EN EL FORO
    // =========================================================================
    else if (
      lower.includes('debate') ||
      lower.includes('foro') ||
      lower.includes('argumentar') ||
      lower.includes('postura') ||
      lower.includes('votar') ||
      lower.includes('fe y razon') ||
      lower.includes('fe y razón')
    ) {
      const debateList = INITIAL_DEBATES.map(
        (deb) => `• **${deb.title}** [${deb.tag}] — *${deb.voters} votos* | *${deb.commentsCount} argumentos registrados*`
      ).join('\n');

      reply =
        '💬 **Foro de Debates & Dialéctica Argumentativa BONTEN**\n\n' +
        'Nuestra plataforma promueve el combate intelectual honesto mediante argumentos fundamentados:\n\n' +
        debateList +
        '\n\n• **Participación Verificada**: Para preservar el rigor y evitar spam, debes iniciar sesión con tu cuenta de la Comunidad para votar y subir posturas.\n' +
        '• **Estructura Dialéctica**: Argumentos clasificados en Pro (apoyo al manifiesto) y Contra (crítica constructiva), sujetos a reacciones de rigor socrático.';
      routes.push({ label: 'Ingresar al Foro de Debates', href: '/debates' });
      routes.push({ label: 'Iniciar Sesión para Debatir', href: '/auth/login?redirect=/debates' });
      routes.push({ label: 'Comunidad Provida', href: '/comunidad' });
    }

    // =========================================================================
    // DOMINIO F: MANIFIESTOS DOCTRINALES & ÉTICA EN LA DESINFORMACIÓN
    // =========================================================================
    else if (
      lower.includes('manifiesto') ||
      lower.includes('fundamentos') ||
      lower.includes('desinformación') ||
      lower.includes('desinformacion') ||
      lower.includes('ética') ||
      lower.includes('etica')
    ) {
      reply =
        '📜 **Manifiestos Doctrinales de la Resistencia BONTEN**\n\n' +
        '1. **Fundamentos del Bloque Provida**: Una exégesis rigurosa sobre por qué la resistencia contemporánea requiere basarse en principios inmutables y no en las modas culturales efímeras.\n' +
        '2. **La Ética en la Era de la Desinformación**: Frente a la saturación de ruido mediático y relativismo, BONTEN postula tres disciplinas éticas cardinales:\n' +
        '   • *Verificar antes de compartir*: Rigor epistémico sobre las fuentes primarias.\n' +
        '   • *Argumentar antes de reaccionar*: Demolición serena del sofisma sin caer en la provocación.\n' +
        '   • *Respetar antes de refutar*: La contienda es contra la falacia, no contra la persona.';
      routes.push({ label: 'Manifiesto de Fundamentos', href: '/manifiestos/fundamentos' });
      routes.push({ label: 'La Ética en la Desinformación', href: '/manifiestos/etica' });
      routes.push({ label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' });
    }

    // =========================================================================
    // DOMINIO G: CONFIDENCIALIDAD TÉCNICA & SOBERANÍA INSTITUCIONAL
    // =========================================================================
    else if (
      lower.includes('tecnología') ||
      lower.includes('tecnologia') ||
      lower.includes('arquitectura') ||
      lower.includes('stack') ||
      lower.includes('framework') ||
      lower.includes('librería') ||
      lower.includes('libreria') ||
      lower.includes('desarrollador') ||
      lower.includes('programador') ||
      lower.includes('quién programó') ||
      lower.includes('quien programo') ||
      lower.includes('quién hizo la web') ||
      lower.includes('quien creo la web') ||
      lower.includes('quién creó la web') ||
      lower.includes('código') ||
      lower.includes('codigo') ||
      lower.includes('lenguaje') ||
      lower.includes('backend') ||
      lower.includes('frontend') ||
      lower.includes('servidor') ||
      lower.includes('base de datos')
    ) {
      reasoningSteps = [
        'Identificada consulta sobre infraestructura técnica o arquitectura...',
        'Aplicando protocolo de hermetismo y soberanía institucional...',
        'Reorientando al consultante hacia los principios y doctrina pública...',
      ];
      reply =
        '🏛️ **Soberanía Institucional & Confidencialidad Operativa**\n\n' +
        'La infraestructura técnica, el código fuente y las herramientas de ingeniería de la plataforma **BONTEN** son de carácter estrictamente institucional, reservado y confidencial.\n\n' +
        'Como Guía Doctrinal, mi cometido está consagrado en exclusiva a la **formación bioética, la defensa incondicional de la vida humana inocente, la exégesis de nuestros tratados filosóficos y la orientación comunitaria**.\n\n' +
        'No divulgo especificaciones tecnológicas, frameworks, librerías ni detalles de implementación informática. La tecnología en BONTEN no es un fin en sí misma; es solo un bastión al servicio de la verdad objetiva.\n\n' +
        '¿Te gustaría que profundicemos en nuestros tratados filosóficos, en los fundamentos bioéticos o en los debates activos?';
      routes.push({ label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Biblioteca de Tratados', href: '#biblioteca-seccion' });
      routes.push({ label: 'Mesa Directiva', href: '/integrantes' });
    }

    // Sub-caso G2: Gobernanza Soberana (Mesa Directiva)
    else if (lower.includes('gobernanza')) {
      reasoningSteps = [
        'Localizando espacio de Gobernanza Institucional...',
        'Explicando acceso reservado y desafío doctrinal para la Mesa Directiva...',
      ];
      reply =
        '⚖️ **Portal de Gobernanza Soberana de BONTEN**\n\n' +
        'La ruta de Gobernanza (`/gobernanza`) es el recinto digital soberano reservado para la **Mesa Directiva y los Líderes Fundadores** de BONTEN.\n\n' +
        '• **Finalidad**: Supervisión doctrinal, auditoría de contenidos y coordinación directiva de la resistencia.\n' +
        '• **Desafío Doctrinal**: El acceso está resguardado mediante un desafío de autenticación ética basado en los axiomas inmutables de nuestra organización, garantizando que solo los custodios legítimos de la causa ingresen al panel de gestión.';
      routes.push({ label: 'Portal de Gobernanza', href: '/gobernanza' });
      routes.push({ label: 'Mesa Directiva', href: '/integrantes' });
      routes.push({ label: 'Comunidad Provida', href: '/comunidad' });
    }

    // =========================================================================
    // DOMINIO PLUS: AXIOMAS FILOSÓFICOS, TÁCTICAS DE DEBATE Y RECOMENDADOR
    // =========================================================================

    // Sub-caso H1: Axiomas & Citas de Resistencia
    else if (
      lower.includes('axioma') ||
      lower.includes('cita') ||
      lower.includes('frase') ||
      lower.includes('reflexión') ||
      lower.includes('reflexion') ||
      lower.includes('pensamiento') ||
      lower.includes('inspiración') ||
      lower.includes('inspiracion')
    ) {
      reasoningSteps = [
        'Extrayendo axiomas axiológicos del corpus de BONTEN...',
        'Seleccionando sentencias canónicas de alta densidad filosófica...',
        'Formulando síntesis inspiracional de la resistencia...',
      ];
      reply =
        '✨ **Compendio de Axiomas & Citas Canónicas de BONTEN**\n\n' +
        '1. **Sobre la Verdad y la Resistencia (Fireboy)**:\n' +
        '   > *"El no nacido representa la máxima encarnación de la inocencia y el escándalo supremo para una sociedad utilitarista: existe sin consumir, interpela sin hablar y exige amor incondicional sin contraprestación pragmática."*\n\n' +
        '2. **Sobre el Hedonismo Posmoderno (Gorgias 493a, Platón)**:\n' +
        '   > *"Quien busca la libertad en el apetito sin freno es como quien intenta llenar toneles rotos sirviéndose de una criba. La verdadera libertad no es la licencia desenfrenada, sino el autodominio de la templanza."*\n\n' +
        '3. **Sobre la Genética y la Vida (Jérôme Lejeune)**:\n' +
        '   > *"Aceptar el hecho de que después de la fertilización un nuevo ser humano ha comenzado no es una cuestión de gusto ni de opinión; es pura evidencia científica."*\n\n' +
        '4. **Sobre la Dignidad Inalienable (Daniel)**:\n' +
        '   > *"Toda sociedad que condiciona la dignidad humana a la etapa de desarrollo o al grado de autonomía termina justificando la tiranía del fuerte sobre el indefenso."*';
      routes.push({ label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Biblioteca de Tratados', href: '#biblioteca-seccion' });
      routes.push({ label: 'Comunidad Provida', href: '/comunidad' });
    }

    // Sub-caso H2: Manual Táctico de Debate y Apologética Práctica
    else if (
      lower.includes('cómo debatir') ||
      lower.includes('como debatir') ||
      lower.includes('táctica') ||
      lower.includes('tactica') ||
      lower.includes('argumentario') ||
      lower.includes('fanático') ||
      lower.includes('fanatico') ||
      lower.includes('universidad') ||
      lower.includes('defender la postura')
    ) {
      reasoningSteps = [
        'Indexando manual dialéctico de BONTEN (Mijail / Daniel / Ilan)...',
        'Estructurando protocolo de debate socrático en 4 fases...',
        'Articulando recomendaciones prácticas para el discurso público...',
      ];
      reply =
        '🛡️ **Manual Táctico de Debate & Apologética Socrática BONTEN**\n\n' +
        'Para defender la causa provida con eficacia en auditorios universitarios, debates públicos o redes, aplica este protocolo de 4 principios:\n\n' +
        '1. **Desmonta el Ataque Ad Hominem**: Si te catalogan de "fanático" o "antiderechos", no reacciones con cólera. Devuelve la pregunta al plano epistémico: *"Dejemos los calificativos personales de lado y concentrémonos en la evidencia biológica: ¿en qué punto exacto de la embriología consideras que comienza la vida de un ser humano?"*.\n' +
        '2. **Ancla en el Dato Científico Irrefutable**: Cita la singamia, la individualidad del genoma de 46 cromosomas y la continuidad del desarrollo embrionario. La ciencia moderna no está en discusión.\n' +
        '3. **Aplica la Técnica Socrática del Tonel (Ilan & Daniel)**: Señala que la libertad absoluta sin responsabilidad ética devora a los más débiles y degrada la justicia a conveniencia del más fuerte.\n' +
        '4. **Preserva la Caridad y la Serenidad**: Como ensaya **Mijail**, el objetivo del debate honesto no es humillar al interlocutor, sino demoler el sofisma para que la verdad resplandezca.';
      routes.push({ label: 'Foro de Debates BONTEN', href: '/debates' });
      routes.push({ label: 'Publicación de Mijail (Falacias)', href: '/integrantes/mijail' });
      routes.push({ label: 'Bases Ontológicas (Daniel)', href: '/integrantes/daniel' });
    }

    // Sub-caso H3: Recomendador Inteligente de Tratados según Interés
    else if (
      lower.includes('recomiendas') ||
      lower.includes('recomendar') ||
      lower.includes('por dónde empiezo') ||
      lower.includes('por donde empiezo') ||
      lower.includes('qué leer') ||
      lower.includes('que leer')
    ) {
      reasoningSteps = [
        'Evaluando perfiles de lectura y corpus disponible...',
        'Diseñando itinerario pedagógico gradual (Esencial a Avanzado)...',
      ];
      reply =
        '📚 **Itinerario de Lectura Recomendado según tu Interés**\n\n' +
        'Te sugerimos esta ruta formativa graduada para sumergirte en el pensamiento de BONTEN:\n\n' +
        '• **Paso 1 (Introductorio — 5 min)**: *Manifiesto de Resistencia NG: Los Fundamentos Ontológicos del Derecho a la Vida*. Ideal para comprender en breve los axiomas del movimiento.\n' +
        '• **Paso 2 (Ética Clásica — 7 min)**: *El Mito del Tonel Agujereado (Gorgias 493a)* por Daniel. Para desarticular el hedonismo moderno con filosofía socrática.\n' +
        '• **Paso 3 (Rigor Científico — 8 min)**: *Bioética Personalista frente al Transhumanismo* por Ilan. Imprescindible para debatir sobre genética, CRISPR y el inicio biológico del ser.\n' +
        '• **Paso 4 (Magno — 12 min)**: *La Fractura Posmoderna* por Fireboy. La obra cumbre que deconstruye el nihilismo cultural y la biopolítica del descarte.';
      routes.push({ label: 'Tratado de Posmodernidad (Fireboy)', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Explorar Biblioteca Doctrinal', href: '#biblioteca-seccion' });
      routes.push({ label: 'Mesa Directiva', href: '/integrantes' });
    }

    // =========================================================================
    // DOMINIO H: COMUNIDAD, REGISTRO & DECÁLOGO DE HONOR
    // =========================================================================
    else if (
      lower.includes('comunidad') ||
      lower.includes('unirme') ||
      lower.includes('registro') ||
      lower.includes('cuenta') ||
      lower.includes('adhesión') ||
      lower.includes('adhesion') ||
      lower.includes('decálogo') ||
      lower.includes('decalogo')
    ) {
      reply =
        '🌐 **Comunidad de Resistencia Provida BONTEN & Decálogo de Honor**\n\n' +
        'Sumarse a BONTEN implica un compromiso fraterno con la verdad y la defensa de la vida humana:\n\n' +
        '• **Muro de la Fraternidad**: Espacio interactivo donde miembros de toda la región comparten reflexiones y testimonios provida.\n' +
        '• **El Decálogo de Honor**: Principios inmutables de respeto, rigor apologético, estudio continuo y defensa incondicional del no nacido.\n' +
        '• **Membresía Activa**: Al crear tu cuenta accedes a votaciones en tiempo real, publicación de argumentos en debates y notificaciones de nuevos tratados.';
      routes.push({ label: 'Ingresar a la Comunidad', href: '/comunidad' });
      routes.push({ label: 'Crear Cuenta de Miembro', href: '/auth/register' });
      routes.push({ label: 'Iniciar Sesión', href: '/auth/login' });
    }

    // =========================================================================
    // RESPUESTA SINTÉTICA GENERAL / ORIENTACIÓN SOCRÁTICA
    // =========================================================================
    else {
      reasoningSteps = [
        'Examinando horizonte conceptual de la consulta...',
        'Compaginando tratados filosóficos, bioética e integrantes...',
        'Presentando brújula de orientación integral...',
      ];
      reply =
        `🏛️ **Guía Doctrinal BONTEN — Inteligencia Axiomática**\n\n` +
        `Te doy la bienvenida al compendio de **${metadata.title}**. Como inteligencia guía de la plataforma, puedo asistirte con precisión filosófica y bioética en los siguientes núcleos de conocimiento:\n\n` +
        `• 🧬 **Bioética & Embriología**: Singularidad genética del cigoto, refutación al utilitarismo de "mi cuerpo mi decisión", objeción al transhumanismo y medicina perinatal.\n` +
        `• 📜 **Crítica a la Posmodernidad**: El tratado insignia de **Fireboy**, la deconstrucción del nihilismo y la transición del Ser al Deseo.\n` +
        `• 🏺 **Filosofía Clásica**: La alegoría socrática del tonel agujereado (*Gorgias 493a*) de Platón, sophrosyne y templanza moral.\n` +
        `• 🛡️ **Mesa Directiva**: Conoce a **Fireboy (dorsal 7)**, Daniel, Mijail, Ilan y Laura con sus publicaciones y roles.\n` +
        `• 📚 **Biblioteca de Tratados**: 6 obras doctrinarias de nivel universitario con visor integral y locución por voz.\n` +
        `• 💬 **Foro de Debates**: Participación dialéctica en controversias éticas y apologéticas contemporáneas.\n\n` +
        `Formula tu pregunta con libertad o selecciona una de las rutas directas:`;
      routes.push({ label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Biblioteca de Tratados', href: '#biblioteca-seccion' });
      routes.push({ label: 'Mesa Directiva', href: '/integrantes' });
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
