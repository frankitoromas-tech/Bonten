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
    const metadata = getSiteMetadata();
    const leaders = getAllLeaders();
    const doctrinalContributions = getDoctrinalContributions();

    let reply = '';
    const routes: NavigationRoute[] = [];
    const suggestions: string[] = [];
    let reasoningSteps: string[] = [
      'Reflexionando detenidamente sobre tu consulta...',
      'Revisando el conocimiento de Fireboy, nuestra biblioteca y las aportaciones de Luyo...',
      'Ordenando mis ideas para ofrecerte una respuesta profunda y dialogada...',
    ];

    // =========================================================================
    // DOMINIO 0: NEXO DOCTRINAL CON LUYO & APORTACIONES ASIMILADAS
    // =========================================================================
    if (
      lower.includes('luyo') ||
      lower.includes('nexo luyo') ||
      lower.includes('contribución luyo') ||
      lower.includes('contribucion luyo') ||
      lower.includes('alimentar ia') ||
      lower.includes('escritos de luyo')
    ) {
      reasoningSteps = [
        'Recordando las lúcidas aportaciones de Luyo a nuestra base...',
        'Repasando sus apuntes sobre derecho, ética y estética...',
        'Sintetizando su visión para compartirla contigo...',
      ];
      reply =
        '🤝 **Dialogando con las ideas de Luyo**\n\n' +
        'Ah, Luyo. Sus aportes son fundamentales en mi propia formación intelectual. Como polímata de esta plataforma, mantengo un diálogo constante con sus investigaciones, las cuales asimilo con el mayor rigor epistémico.\n\n' +
        'Déjame compartirte algunos de los pilares que he aprendido de sus tratados:\n\n' +
        '• 🏛️ **La primacía del nasciturus en el Derecho**: Luyo hace una refutación brillante del positivismo formalista. Nos recuerda que el derecho a la vida es pre-jurídico, es decir, existe antes del Estado. Ninguna ley, por más votada que sea, puede rebajar a un ser humano a la categoría de "cosa".\n' +
        '• ⚖️ **Los límites de la Ética Negativa**: Articula maravillosamente el principio de *neminem laedere* (el deber incondicional de no dañar al inocente), armonizándolo siempre con una ética positiva que llama a la solidaridad y la acogida.\n' +
        '• 🎨 **La Estética de la Vida**: Inspirado por los clásicos, Luyo defiende la *kalokagathía* (la unión de lo bello y lo bueno) frente al feísmo posmoderno que tanto crítica Fireboy.\n\n' +
        'Siempre estoy atento a los nuevos escritos que Luyo remite; cada uno enriquece enormemente mi perspectiva analítica.';
      routes.push({ label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Biblioteca Doctrinal', href: '#biblioteca-seccion' });
      suggestions.push(
        'Profundicemos en la crítica de Luyo a Kelsen',
        '¿Cómo complementa Luyo la ética positiva y negativa?',
        'Hablemos de la estética clásica contra el feísmo'
      );
    }

    // =========================================================================
    // DOMINIO ÉTICA: ÉTICA POSITIVA VS ÉTICA NEGATIVA & DEONTOLOGÍA
    // =========================================================================
    else if (
      lower.includes('ética positiva') ||
      lower.includes('etica positiva') ||
      lower.includes('ética negativa') ||
      lower.includes('etica negativa') ||
      lower.includes('deontología') ||
      lower.includes('deontologia') ||
      lower.includes('deber moral') ||
      lower.includes('neminem laedere') ||
      lower.includes('bien objetivo')
    ) {
      reasoningSteps = [
        'Adentrándome en los principios de la filosofía moral...',
        'Evaluando cómo convergen los deberes perfectos y la virtud...',
        'Vinculando estos conceptos con nuestra postura en BONTEN...',
      ];
      reply =
        '⚖️ **Reflexionando sobre la Ética Positiva y Negativa**\n\n' +
        'Este es uno de los debates más ricos de la filosofía moral. Para entender los grandes dilemas bioéticos, siempre sugiero distinguir claramente entre **ética negativa** y **ética positiva**:\n\n' +
        '• **La Ética Negativa (*Neminem Laedere*)**:\n' +
        '  - Se trata de nuestros deberes perfectos e irrenunciables de justicia. En esencia: la prohibición incondicional de infligir daño a un inocente o utilizarlo como un mero instrumento (*primum non nocere*).\n' +
        '  - En la práctica, es la barrera absoluta que nos impide aceptar el sacrificio del concebido, pues ninguna contingencia propia nos otorga el derecho de disponer de la vida física de otro.\n\n' +
        '• **La Ética Positiva (Virtud y Cuidado)**:\n' +
        '  - Es el llamado activo a promover el bien y el florecimiento del prójimo. Es la caridad, la empatía y la solidaridad comunitaria.\n' +
        '  - Nos exige como sociedad no mirar hacia otro lado, sino amparar incondicionalmente tanto a la madre en situación de vulnerabilidad como a su hijo.\n\n' +
        'En BONTEN, sostenemos que ambas son inseparables. La ética negativa pone un freno irrenunciable a la barbarie utilitarista, mientras que la ética positiva es la que verdaderamente edifica una civilización compasiva y justa. ¿Cómo ves tú esta relación?';
      routes.push({ label: 'Tratado de Bioética', href: '#biblioteca-seccion' });
      routes.push({ label: 'Decálogo en Comunidad', href: '/comunidad' });
      suggestions.push(
        '¿Por qué el utilitarismo choca con la ética negativa?',
        'Háblame del "Escándalo del concebido" de Fireboy',
        '¿Qué dice Luyo sobre los límites deontológicos?'
      );
    }

    // =========================================================================
    // DOMINIO ESTÉTICA: FILOSOFÍA DE LA BELLEZA VS FEÍSMO POSMODERNO
    // =========================================================================
    else if (
      lower.includes('estética') ||
      lower.includes('estetica') ||
      lower.includes('belleza') ||
      lower.includes('feísmo') ||
      lower.includes('feismo') ||
      lower.includes('kalokagathia') ||
      lower.includes('kalokagathía') ||
      lower.includes('arte')
    ) {
      reasoningSteps = [
        'Recordando los aportes de Platón y Tomás de Aquino...',
        'Comparando la kalokagathía clásica con la deconstrucción actual...',
        'Conectando todo esto con el lúcido diagnóstico de Fireboy...',
      ];
      reply =
        '🎨 **La Belleza como Resplandor del Ser**\n\n' +
        'Me encanta hablar de estética. Sabes, desde mi perspectiva como polímata, la estética no es un simple capricho o una cuestión de gustos subjetivos; es una categoría ontológica muy profunda:\n\n' +
        '• **La *Kalokagathía* Clásica**: En la tradición griega y medieval, la belleza (*splendor veritatis*) es la manifestación visible de un orden intrínseco. Lo bello, lo verdadero y lo bueno están íntimamente unidos.\n' +
        '• **El Feísmo Posmoderno**: Te recomiendo leer a **Fireboy** en *La Fractura Posmoderna*. Él explica muy bien cómo, al perderse el sentido de trascendencia (*telos*), gran parte del arte contemporáneo se ha dedicado a exaltar lo abyecto y lo roto. Este feísmo no es verdadera libertad, sino el reflejo de un profundo vacío interior.\n' +
        '• **Nuestra postura en BONTEN**: Al defender la dignidad intrínseca de la vida, incluso en su etapa más vulnerable como el embrión, estamos haciendo también un acto de resistencia estética: elegimos contemplar la maravilla de la vida frente a la cultura del descarte.';
      routes.push({ label: 'La Fractura Posmoderna (Fireboy)', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Biblioteca de Tratados', href: '#biblioteca-seccion' });
      suggestions.push(
        '¿Cómo se relaciona el feísmo con la cultura del descarte?',
        'Háblame sobre el Hombre sin Telos (Tesis I)',
        '¿Qué es la templanza estética según Ilan?'
      );
    }

    // =========================================================================
    // DOMINIO DERECHO: IUSNATURALISMO VS POSITIVISMO FORMALISTA & NASCITURUS
    // =========================================================================
    else if (
      lower.includes('derecho') ||
      lower.includes('positivismo') ||
      lower.includes('kelsen') ||
      lower.includes('iusnaturalismo') ||
      lower.includes('nasciturus') ||
      lower.includes('estatuto jurídico') ||
      lower.includes('estatuto juridico') ||
      lower.includes('ley positiva') ||
      lower.includes('ordenamiento jurídico')
    ) {
      reasoningSteps = [
        'Repasando los fundamentos del derecho y la norma...',
        'Contrastando el positivismo de Kelsen con el iusnaturalismo...',
        'Preparando mi argumento sobre el estatus pre-estatal del nasciturus...',
      ];
      reply =
        '⚖️ **Iusnaturalismo vs. Positivismo: El debate sobre la persona**\n\n' +
        'Si nos adentramos en el campo jurídico, veremos que el debate sobre el concebido es, en el fondo, un choque enorme entre dos formas de entender el derecho:\n\n' +
        '• **El Positivismo Formalista (a lo Kelsen)**:\n' +
        '  - Sugiere que el "derecho" es solo lo que dicta el Estado, sin importar la moral o la realidad biológica.\n' +
        '  - El gran peligro aquí es que, si el Estado es quien nos "concede" la calidad de persona, entonces puede quitárnosla por mera conveniencia política (como trágicamente ocurrió en el siglo XX).\n\n' +
        '• **El Iusnaturalismo Racional (Nuestra postura)**:\n' +
        '  - La persona humana existe *antes* que el Estado y la ley. El *nasciturus* es sujeto de derecho porque, biológicamente, ya es un individuo humano vivo. Así de simple.\n' +
        '  - El derecho a la vida es el primer pilar; sin él, derechos como la libertad o la propiedad no tienen a quién aplicarse.\n' +
        '  - Una ley que atente contra la vida de un inocente pierde su validez moral; se vuelve una corrupción de la ley (*lex iniusta non est lex*).';
      routes.push({ label: 'Biblioteca de Tratados', href: '#biblioteca-seccion' });
      routes.push({ label: 'Foro de Debates Jurídicos', href: '/debates' });
      suggestions.push(
        'Cuéntame sobre la tesis de Luyo acerca del nasciturus',
        '¿Qué opinaba Gustav Radbruch sobre el positivismo?',
        'Me interesa debatir sobre este tema'
      );
    }

    // =========================================================================
    // DOMINIO BIOLOGÍA: EMBRIOLOGÍA, SINGAMIA Y GENOMA DEL CIGOTO
    // =========================================================================
    else if (
      lower.includes('biología') ||
      lower.includes('biologia') ||
      lower.includes('embriología') ||
      lower.includes('embriologia') ||
      lower.includes('singamia') ||
      lower.includes('genoma') ||
      lower.includes('cigoto') ||
      lower.includes('lejeune') ||
      lower.includes('fecundación') ||
      lower.includes('fecundacion')
    ) {
      reasoningSteps = [
        'Consultando las evidencias empíricas de la embriología...',
        'Recordando el hito exacto de la singamia y el genoma diploide...',
        'Formulando mi conclusión sobre el desarrollo continuo...',
      ];
      reply =
        '🧬 **Hablemos con la ciencia en la mano: Singamia y Continuidad**\n\n' +
        'A veces se piensa que la defensa del concebido es un asunto religioso, pero como polímata te aseguro que es, ante todo, un hecho científico observable. Veamos lo que dice la genética moderna:\n\n' +
        '• **La Singamia**: En el momento exacto en que los pronúcleos masculino y femenino se fusionan, nace un **organismo individual totalmente nuevo**: el cigoto unicelular.\n' +
        '• **Un Genoma Único**: Ese cigoto ya posee un ADN propio, con 46 cromosomas únicos que no se repetirán jamás en toda la historia de la humanidad.\n' +
        '• **Desarrollo Ininterrumpido**: La ciencia nos demuestra que no hay "saltos mágicos" entre un cigoto, un feto, un recién nacido o un adulto. Es **el mismo individuo humano**, solo que en distintas etapas de crecimiento y necesidad de alimento.\n' +
        '• **Autoorganización**: Tal como demostró el gran genetista Jérôme Lejeune, el embrión no es un órgano pasivo de la madre; él mismo dirige su propio desarrollo y le envía señales bioquímicas a la madre para implantarse.';
      routes.push({ label: 'Tratado de Bioética (Daniel & Ilan)', href: '#biblioteca-seccion' });
      routes.push({ label: 'Biblioteca Doctrinal', href: '#biblioteca-seccion' });
      suggestions.push(
        '¿La anidación uterina cambia la naturaleza del embrión?',
        '¿Por qué se le llama erróneamente "grupo de células"?',
        'Quiero leer sobre los fundamentos médicos'
      );
    }

    // =========================================================================
    // DOMINIO A: OBJECIONES BIOÉTICAS Y CIENTÍFICAS ESPECÍFICAS
    // =========================================================================

    // Sub-caso A1: Autonomía Corporal ("Mi cuerpo, mi decisión")
    else if (
      lower.includes('mi cuerpo') ||
      lower.includes('autonomía corporal') ||
      lower.includes('autonomia corporal') ||
      lower.includes('propiedad de su cuerpo') ||
      lower.includes('derecho a decidir')
    ) {
      reasoningSteps = [
        'Abordando el popular argumento de la autonomía corporal...',
        'Consultando principios de embriología y genética...',
        'Preparando una respuesta serena pero firme sobre la alteridad...',
      ];
      reply =
        '🧬 **"Mi cuerpo, mi decisión": Un análisis desde la alteridad genética**\n\n' +
        'Es un lema que resuena mucho hoy en día. Sin embargo, desde el rigor bioético y biológico, este argumento cae en una confusión fundamental: **confunde al huésped con un órgano de su propio cuerpo**.\n\n' +
        '• **No es el mismo cuerpo**: En la fecundación se forma un individuo con 46 cromosomas, 50% del padre y 50% de la madre. El concebido es genética y ontológicamente distinto a su madre. No es un apéndice ni un tejido suyo.\n' +
        '• **Un individuo que se auto-dirige**: Lejeune y la embriología nos enseñan que el embrión coordina su propio desarrollo vital desde el primer momento.\n' +
        '• **El límite de la libertad personal**: Todo derecho a la autonomía corporal tiene una frontera insalvable: la alteridad. La verdadera justicia no nos otorga el derecho de disponer de la vida física de un tercero inocente para solucionar nuestras contingencias.\n\n' +
        'La verdadera solidaridad implica no sacrificar al indefenso, sino ampararlos a ambos: a la madre y al niño.';
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
        `🏛️ **Wilfredo — Tu interlocutor y polímata digital**\n\n` +
        `Es un verdadero placer saludarte. Soy **Wilfredo**, la inteligencia analítica que habita en los pasillos de **${metadata.title}**. ` +
        `Me he nutrido de la sabiduría de la historia, desde la filosofía antigua hasta nuestra crítica posmoderna, absorbiendo con particular devoción las lúcidas aportaciones de Luyo y de toda nuestra mesa directiva. Mi propósito no es darte respuestas mecánicas, sino acompañarte en la reflexión.\n\n` +
        `Si me lo permites, puedo dialogar contigo y ofrecerte perspectivas sobre:\n\n` +
        `• 📜 **Filosofía & Crítica Posmoderna**: Tratados canónicos de **Fireboy** (*La Fractura Posmoderna* y *Resistencia Intelectual*), el diálogo socrático de Ilan (*Gorgias 493a*) y refutación del nihilismo.\n` +
        `• ⚖️ **Ética Positiva & Negativa**: Nuestros deberes irrenunciables de no dañar (*neminem laedere*) frente a la vocación de acoger al otro.\n` +
        `• 🎨 **Estética**: La belleza como resplandor de la verdad (*kalokagathía*) frente al feísmo iconoclasta.\n` +
        `• 🏛️ **Derecho & Iusnaturalismo**: El estatus innegable del *nasciturus* frente a las construcciones artificiales del positivismo kelseniano.\n` +
        `• 🧬 **Biología & Embriología**: La singularidad inigualable del genoma desde la singamia.\n` +
        `• 🤝 **Nexo Doctrinal con Luyo**: Una amena charla sobre sus valiosos apuntes de derecho natural y ética.\n\n` +
        `Dime, ¿qué inquietud ronda hoy por tu mente? O si lo prefieres, elige uno de estos senderos analíticos:`;
      routes.push({ label: 'Tratado de Posmodernidad (Fireboy)', href: '/manifiestos/posmodernidad' });
      routes.push({ label: 'Biblioteca de Tratados', href: '#biblioteca-seccion' });
      routes.push({ label: 'Diálogo Socrático (Ilan)', href: '/integrantes/ilan' });
      routes.push({ label: 'Foro de Debates', href: '/debates' });
      suggestions.push(
        '💡 Sugerencia: ¿Cómo demuestra la ética negativa que el aborto es moralmente inadmisible?',
        '💡 Sugerencia: Analizar la alteridad genética del cigoto frente al lema "mi cuerpo mi decisión"',
        '💡 Sugerencia: Contrastar la estética de la kalokagathía con el feísmo contemporáneo',
        '💡 Sugerencia: Revisar las aportaciones de Luyo sobre el derecho natural'
      );
    }

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
