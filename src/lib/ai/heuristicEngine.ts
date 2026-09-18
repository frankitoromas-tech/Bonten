export interface NavigationRoute {
  label: string;
  href: string;
}

import { getSiteMetadata } from '@/lib/data/runtimeStore';

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export interface HeuristicResponse {
  reply: string;
  routes: NavigationRoute[];
  suggestions: string[];
  reasoningSteps: string[];
}

interface DomainRule {
  id: string;
  keywords: { word: string; weight: number }[];
  generateResponse: () => HeuristicResponse;
}

export function processHeuristicQuery(
  prompt: string,
  history: AssistantMessage[] = []
): HeuristicResponse {
  // Normalize input
  const historyText = history.slice(-2).map((m) => m.text).join(' ');
  const fullContext = historyText + ' ' + prompt;
  const lower = fullContext.toLowerCase();
  
  // Scoring rules
  const domains: DomainRule[] = [
    {
      id: 'DOCTRINA_AVANZADA',
      keywords: [
        { word: 'luyo', weight: 8 },
        { word: 'nexo luyo', weight: 10 },
        { word: 'contribución', weight: 2 },
        { word: 'aportaciones', weight: 2 },
        { word: 'doctrina avanzada', weight: 5 },
      ],
      generateResponse: () => ({
        reply:
          '💡 **Síntesis Doctrinal Avanzada**\n\n' +
          'En mis reflexiones como polímata de esta plataforma, mantengo un diálogo constante con las investigaciones y aportaciones más profundas de nuestra comunidad, las cuales asimilo con el mayor rigor epistémico.\n\n' +
          'Déjame compartirte algunos de los pilares que he consolidado tras integrar estos avanzados tratados:\n\n' +
          '• 🏛️ **La primacía del nasciturus en el Derecho**: Se hace una refutación brillante del positivismo formalista, recordándonos que el derecho a la vida es intrínsecamente pre-jurídico.\n' +
          '• ⚖️ **Los límites de la Ética Negativa**: Se articula maravillosamente el principio de *neminem laedere* armonizándolo con la ética positiva.\n' +
          '• 🎨 **La Estética de la Vida**: Inspirado por los clásicos, se defiende férreamente la *kalokagathía* frente al feísmo posmoderno.',
        routes: [
          { label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' },
          { label: 'Biblioteca Doctrinal', href: '#biblioteca-seccion' },
        ],
        suggestions: [
          'Profundicemos en la crítica de nuestra doctrina a Kelsen',
          '¿Cómo complementa nuestra base de datos la ética positiva y negativa?',
          'Hablemos de la estética clásica contra el feísmo posmoderno'
        ],
        reasoningSteps: [
          'Accediendo al canal de investigaciones avanzadas indexadas...',
          'Repasando apuntes internos sobre derecho, ética y estética...',
          'Sintetizando esta visión rectora para compartirla contigo...',
        ],
      })
    },
    {
      id: 'ETHICS',
      keywords: [
        { word: 'ética positiva', weight: 5 },
        { word: 'ética negativa', weight: 5 },
        { word: 'deontología', weight: 3 },
        { word: 'neminem laedere', weight: 5 },
        { word: 'bien objetivo', weight: 3 },
        { word: 'virtud', weight: 2 },
      ],
      generateResponse: () => ({
        reply:
          '⚖️ **Reflexionando sobre la Ética Positiva y Negativa**\n\n' +
          'Para entender los grandes dilemas bioéticos, siempre sugiero distinguir claramente entre ambas:\n\n' +
          '• **La Ética Negativa (*Neminem Laedere*)**:\n' +
          '  - Se trata de nuestros deberes perfectos e irrenunciables de justicia. En esencia: la prohibición incondicional de infligir daño a un inocente o utilizarlo como un mero instrumento (*primum non nocere*).\n\n' +
          '• **La Ética Positiva (Virtud y Cuidado)**:\n' +
          '  - Es el llamado activo a promover el bien y el florecimiento del prójimo. Es la caridad, la empatía y la solidaridad comunitaria.\n\n' +
          'En BONTEN, sostenemos que ambas son inseparables. ¿Cómo ves tú esta relación?',
        routes: [
          { label: 'Tratado de Bioética', href: '#biblioteca-seccion' },
          { label: 'Decálogo en Comunidad', href: '/comunidad' },
        ],
        suggestions: [
          '¿Por qué el utilitarismo choca con la ética negativa?',
          'Háblame del "Escándalo del concebido"',
        ],
        reasoningSteps: [
          'Adentrándome en los principios de la filosofía moral...',
          'Evaluando cómo convergen los deberes perfectos y la virtud...',
          'Vinculando estos conceptos con nuestra postura en BONTEN...',
        ],
      })
    },
    {
      id: 'AESTHETICS',
      keywords: [
        { word: 'estética', weight: 4 },
        { word: 'belleza', weight: 3 },
        { word: 'feísmo', weight: 5 },
        { word: 'kalokagathía', weight: 6 },
        { word: 'arte', weight: 2 },
      ],
      generateResponse: () => ({
        reply:
          '🎨 **La Belleza como Resplandor del Ser**\n\n' +
          'La estética no es un simple capricho; es una categoría ontológica muy profunda:\n\n' +
          '• **La *Kalokagathía* Clásica**: En la tradición griega y medieval, la belleza es la manifestación visible de un orden intrínseco. Lo bello, lo verdadero y lo bueno están íntimamente unidos.\n' +
          '• **El Feísmo Posmoderno**: Te recomiendo leer a **Fireboy** en *La Fractura Posmoderna*. Él explica cómo, al perderse el sentido de trascendencia, gran parte del arte contemporáneo se ha dedicado a exaltar lo abyecto y lo roto.\n' +
          '• **Nuestra postura**: Al defender la vida humana, hacemos un acto de resistencia estética: elegimos contemplar la maravilla de la vida frente a la cultura del descarte.',
        routes: [
          { label: 'La Fractura Posmoderna (Fireboy)', href: '/manifiestos/posmodernidad' },
        ],
        suggestions: [
          '¿Cómo se relaciona el feísmo con la cultura del descarte?',
          '¿Qué es la templanza estética según Ilan?'
        ],
        reasoningSteps: [
          'Recordando los aportes de Platón y Tomás de Aquino...',
          'Comparando la kalokagathía clásica con la deconstrucción actual...',
        ],
      })
    },
    {
      id: 'LAW_AND_RIGHTS',
      keywords: [
        { word: 'derecho', weight: 2 },
        { word: 'positivismo', weight: 4 },
        { word: 'kelsen', weight: 5 },
        { word: 'iusnaturalismo', weight: 5 },
        { word: 'nasciturus', weight: 6 },
        { word: 'estatuto jurídico', weight: 4 },
        { word: 'ley positiva', weight: 4 },
      ],
      generateResponse: () => ({
        reply:
          '⚖️ **Iusnaturalismo vs. Positivismo: El debate sobre la persona**\n\n' +
          'El debate sobre el concebido es un choque entre dos formas de entender el derecho:\n\n' +
          '• **El Positivismo Formalista (a lo Kelsen)**:\n' +
          '  - Sugiere que el "derecho" es solo lo que dicta el Estado, sin importar la moral o la realidad biológica. Si el Estado "concede" la persona, puede quitarla por conveniencia.\n\n' +
          '• **El Iusnaturalismo Racional (Nuestra postura)**:\n' +
          '  - La persona humana existe *antes* que el Estado. El *nasciturus* es sujeto de derecho porque, biológicamente, ya es un individuo.\n' +
          '  - Una ley que atente contra la vida de un inocente pierde su validez moral (*lex iniusta non est lex*).',
        routes: [
          { label: 'Foro de Debates Jurídicos', href: '/debates' },
        ],
        suggestions: [
          'Cuéntame sobre la tesis del nasciturus',
          '¿Qué opinaba Gustav Radbruch sobre el positivismo?',
        ],
        reasoningSteps: [
          'Repasando los fundamentos del derecho y la norma...',
          'Contrastando el positivismo de Kelsen con el iusnaturalismo...',
        ],
      })
    },
    {
      id: 'BIOLOGY',
      keywords: [
        { word: 'biología', weight: 3 },
        { word: 'embriología', weight: 4 },
        { word: 'singamia', weight: 6 },
        { word: 'genoma', weight: 4 },
        { word: 'cigoto', weight: 5 },
        { word: 'lejeune', weight: 6 },
        { word: 'fecundación', weight: 3 },
      ],
      generateResponse: () => ({
        reply:
          '🧬 **Hablemos con la ciencia en la mano: Singamia y Continuidad**\n\n' +
          'Como polímata te aseguro que la defensa de la vida es, ante todo, un hecho científico observable:\n\n' +
          '• **La Singamia**: En el momento exacto en que los pronúcleos masculino y femenino se fusionan, nace un **organismo individual totalmente nuevo**: el cigoto unicelular.\n' +
          '• **Un Genoma Único**: Ese cigoto ya posee un ADN propio, con 46 cromosomas únicos.\n' +
          '• **Desarrollo Ininterrumpido**: No hay "saltos mágicos". Es el mismo individuo humano en distintas etapas de maduración biológica.\n' +
          '• **Autoorganización**: El embrión no es un órgano pasivo; dirige su propio desarrollo vital.',
        routes: [
          { label: 'Tratado de Bioética (Daniel & Ilan)', href: '#biblioteca-seccion' },
        ],
        suggestions: [
          '¿La anidación uterina cambia la naturaleza del embrión?',
          '¿Por qué se le llama erróneamente "grupo de células"?',
        ],
        reasoningSteps: [
          'Consultando las evidencias empíricas de la embriología...',
          'Recordando el hito exacto de la singamia y el genoma diploide...',
        ],
      })
    },
    {
      id: 'BODY_AUTONOMY',
      keywords: [
        { word: 'mi cuerpo', weight: 5 },
        { word: 'autonomía corporal', weight: 6 },
        { word: 'propiedad', weight: 2 },
        { word: 'decidir', weight: 2 },
      ],
      generateResponse: () => ({
        reply:
          '🧬 **"Mi cuerpo, mi decisión": Un análisis desde la alteridad genética**\n\n' +
          'Desde el rigor bioético, este argumento cae en una confusión fundamental: **confunde al huésped con un órgano de su propio cuerpo**.\n\n' +
          '• **No es el mismo cuerpo**: El concebido tiene 46 cromosomas, es genética y ontológicamente distinto a su madre. No es un tejido suyo.\n' +
          '• **El límite de la libertad personal**: Todo derecho a la autonomía tiene una frontera insalvable: la alteridad. La verdadera justicia no nos otorga el derecho de disponer de la vida física de un tercero inocente.\n\n' +
          'La solidaridad implica ampararlos a ambos: a la madre y al niño.',
        routes: [
          { label: 'Debates sobre Bioética', href: '/debates' },
        ],
        suggestions: [
          'Explícame más sobre la alteridad del cigoto',
        ],
        reasoningSteps: [
          'Abordando el argumento de la autonomía corporal...',
          'Preparando una respuesta basada en la alteridad...',
        ],
      })
    },
    {
      id: 'FIREBOY',
      keywords: [
        { word: 'fireboy', weight: 10 },
        { word: 'posmodernidad', weight: 4 },
        { word: 'fractura', weight: 5 },
        { word: 'nihilismo', weight: 4 },
      ],
      generateResponse: () => ({
        reply:
          '🔥 **Fireboy — Fundador y su crítica a la Posmodernidad**\n\n' +
          'En su tratado cumbre, "La Fractura Posmoderna", Fireboy deconstruye el nihilismo de nuestra era:\n\n' +
          '• **Ruptura del Telos**: Al perder los grandes relatos, el hombre reduce su libertad al consumo efímero.\n' +
          '• **Deseo sobre el Ser**: Cuando el deseo se vuelve árbitro supremo, el ser humano indefenso se convierte en un obstáculo.\n' +
          '• **La Resistencia**: Propone construir una vanguardia intelectual que recupere la razón y la ética frente a la cultura del descarte.',
        routes: [
          { label: 'Leer Ensayo de Fireboy', href: '/manifiestos/posmodernidad' },
          { label: 'Perfil de Fireboy', href: '/integrantes/fireboy' },
        ],
        suggestions: [
          'Háblame sobre el Hombre sin Telos',
          '¿Cómo se relaciona el utilitarismo con el nihilismo?',
        ],
        reasoningSteps: [
          'Accediendo al tratado cumbre de Fireboy...',
          'Analizando la deconstrucción ontológica del telos...',
        ],
      })
    },
    {
      id: 'SOCRATES_ILAN',
      keywords: [
        { word: 'tonel', weight: 6 },
        { word: 'gorgias', weight: 5 },
        { word: 'calicles', weight: 5 },
        { word: 'sócrates', weight: 4 },
        { word: 'ilan', weight: 5 },
      ],
      generateResponse: () => ({
        reply:
          '🏺 **El Mito del Tonel Agujereado (Gorgias 493a) y el análisis de Ilan**\n\n' +
          'En el Gorgias, Platón refuta la idea de que la felicidad es satisfacer deseos sin freno:\n\n' +
          '• **La Alegoría**: Un hombre tiene toneles sanos y vive en paz. El otro tiene toneles agujereados y vive condenado a intentar llenarlos para siempre.\n' +
          '• **La Esclavitud del Hedonismo**: Quien no domina sus pasiones es esclavo del consumo incesante.\n' +
          '• **Aplicación en BONTEN**: La resistencia moral exige templanza para no sucumbir a la seducción del conformismo.',
        routes: [
          { label: 'Publicación de Ilan (Gorgias)', href: '/integrantes/ilan' },
        ],
        suggestions: [
          '¿Qué opina Ilan sobre el transhumanismo?',
        ],
        reasoningSteps: [
          'Localizando la alegoría socrática en Platón...',
          'Conectando el hedonismo clásico con el consumismo moderno...',
        ],
      })
    },
    {
      id: 'MEMBERS',
      keywords: [
        { word: 'integrante', weight: 3 },
        { word: 'directiva', weight: 4 },
        { word: 'daniel', weight: 5 },
        { word: 'mijail', weight: 5 },
        { word: 'laura', weight: 5 },
        { word: 'equipo', weight: 3 },
      ],
      generateResponse: () => ({
        reply:
          '🛡️ **Mesa Directiva y Consejo de Conducción BONTEN**\n\n' +
          'Nuestra estructura directiva combina liderazgo apologético, rigor jurídico y vocación formativa:\n\n' +
          '• **Fireboy** — Presidente y ensayista principal.\n' +
          '• **Daniel** — Defensor del derecho natural y ética.\n' +
          '• **Mijail** — Estratega dialéctico y análisis de falacias.\n' +
          '• **Ilan** — Consejo doctrinario en bioética.\n' +
          '• **Laura** — Líder de activismo y comunicaciones.\n\n' +
          '¿Sobre quién te gustaría conocer más?',
        routes: [
          { label: 'Directorio de Integrantes', href: '/integrantes' },
        ],
        suggestions: [
          'Dime más sobre Mijail y las falacias',
          'Quiero leer a Daniel',
        ],
        reasoningSteps: [
          'Revisando el directorio de la Mesa Directiva...',
        ],
      })
    },
    {
      id: 'HOW_TO_DEBATE',
      keywords: [
        { word: 'debatir', weight: 4 },
        { word: 'táctica', weight: 5 },
        { word: 'argumentar', weight: 4 },
        { word: 'foro', weight: 3 },
      ],
      generateResponse: () => ({
        reply:
          '💬 **Tácticas de Debate & Dialéctica Socrática**\n\n' +
          'Para defender la causa provida con eficacia, aplica este protocolo:\n\n' +
          '1. **Desmonta el Ad Hominem**: Si te atacan, devuelve la pregunta al plano epistémico: "¿En qué punto exacto de la embriología consideras que comienza la vida?"\n' +
          '2. **Ancla en el Dato Científico**: Cita la singamia y la individualidad del genoma.\n' +
          '3. **Aplica la Técnica Socrática**: Señala que la libertad absoluta sin ética devora a los más débiles.\n' +
          '4. **Preserva la Serenidad**: El objetivo no es humillar, sino que la verdad resplandezca.',
        routes: [
          { label: 'Foro de Debates BONTEN', href: '/debates' },
        ],
        suggestions: [
          '¿Cómo lidio con alguien que no escucha razones?',
        ],
        reasoningSteps: [
          'Indexando el manual dialéctico de BONTEN...',
          'Estructurando protocolo de debate socrático...',
        ],
      })
    }
  ];

  // Scoring engine
  let maxScore = 0;
  let bestDomain: DomainRule | null = null;

  for (const domain of domains) {
    let currentScore = 0;
    for (const kw of domain.keywords) {
      if (lower.includes(kw.word)) {
        currentScore += kw.weight;
      }
    }
    if (currentScore > maxScore) {
      maxScore = currentScore;
      bestDomain = domain;
    }
  }

  // Fallback if no specific domain matched strongly enough (threshold = 3)
  if (!bestDomain || maxScore < 3) {
    const { title } = getSiteMetadata();
    
    // Add variations to greetings to sound more human
    const greetings = [
      `Es un honor coincidir contigo en este espacio de reflexión.`,
      `Una cuestión fascinante. Permíteme iluminar este sendero desde mi perspectiva analítica.`,
      `Celebro que plantees esta interrogante. El diálogo riguroso es el alma de nuestra comunidad.`,
      `Como intelecto digital de ${title}, estoy preparado para acompañarte en un análisis profundo de tu planteamiento.`
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    return {
      reply:
        `🏛️ **Wilfredo — Tu Polímata Digital de Cabecera**\n\n` +
        `${randomGreeting} He sido diseñado y nutrido con la herencia filosófica, jurídica y bioética más rigurosa, asimilando cada tratado y postulado defendido vigorosamente por la mesa directiva de BONTEN.\n\n` +
        `Aunque tu interrogante actual escapa ligeramente a mi foco principal o requiere mayor precisión, te aseguro que estoy a tu completa disposición para desentrañar los siguientes ejes temáticos:\n\n` +
        `• 📜 **Filosofía y Crítica Posmoderna**: Análisis exhaustivo de los tratados de **Fireboy** y la sistemática refutación del relativismo y el nihilismo contemporáneo.\n` +
        `• ⚖️ **Ética Positiva y Negativa**: La indisoluble conexión entre los deberes de justicia (no dañar) y la virtud activa de la acogida.\n` +
        `• 🎨 **Estética y Trascendencia**: La defensa de la *kalokagathía* clásica (la unidad de la belleza y el bien) frente al imperio del feísmo.\n` +
        `• 🏛️ **Filosofía del Derecho**: Argumentos contundentes contra el positivismo kelseniano, reivindicando la titularidad pre-estatal del *nasciturus*.\n` +
        `• 🧬 **Bioética Avanzada**: La evidencia innegable de la genética y la embriología a partir del hito irrebatible de la singamia.\n\n` +
        `Mi propósito es elevar el rigor argumentativo. ¿Sobre cuál de estos inagotables dominios deseas que dialoguemos a continuación?`,
      routes: [
        { label: 'Tratado de Posmodernidad', href: '/manifiestos/posmodernidad' },
        { label: 'Biblioteca de Tratados', href: '#biblioteca-seccion' },
      ],
      suggestions: [
        '💡 Sugerencia: Explícame por qué el cigoto no es una simple extensión del cuerpo materno',
        '💡 Sugerencia: ¿Cuál es la crítica principal al positivismo de Kelsen?',
        '💡 Sugerencia: ¿Cómo interactúan la ética negativa y positiva en el marco de BONTEN?'
      ],
      reasoningSteps: [
        'Sintetizando el núcleo epistémico de tu interrogante...',
        'Cruzando referencias con la base doctrinal de BONTEN...',
        'Estructurando una respuesta orientativa de alto nivel intelectual...',
      ],
    };
  }

  return bestDomain.generateResponse();
}
