import type { Leader, Member, MemberDetails } from '@/types';

export const LEADER: Leader = {
  name: 'Fireboy 🔥',
  slug: 'fireboy',
  fullName: 'Fireboy (Fundador)',
  handle: '@fireboyphilosophy',
  role: 'Líder Fundador',
  bio: 'El único impulso que no puede ser frenado es la curiosidad 🔥 #BontenTeam',
  avatar: '/assets/b5.jpeg',
  tiktok: 'https://www.tiktok.com/@fireboyphilosophy',
  youtube: 'https://youtube.com/@fireboyphilosophy?si=5nOPKIestJFXdJOl',
  publication: {
    title: 'La Necesidad Ineludible de la Resistencia Intelectual',
    category: 'Apologética & Principios Fundacionales',
    date: '10 de septiembre de 2026',
    readTime: '4 min de lectura',
    subtitle: 'Por qué la confrontación de ideas es el deber supremo de nuestra época',
    summary: 'Una disección sobre la pasividad cultural contemporánea y el llamado a levantar una voz inquebrantable en defensa de la verdad objetiva.',
    paragraphs: [
      'El letargo del pensamiento es la antesala de la sumisión cultural. En una sociedad que premia el consenso hueco por encima de la verdad, cuestionar los dogmas mediáticos no es una opción de disidencia: es una obligación moral irreductible.',
      '<blockquote>No nos conformamos con el eco de lo políticamente correcto. Existimos para encender el debate donde otros imponen el silencio.</blockquote>',
      'BONTEN nace precisamente en ese cruce histórico: como un bastión para quienes no temen pensar con rigor, fundamentar sus convicciones con datos y principios inmutables, y liderar la resistencia en la plaza pública digital.',
      'El conocimiento no es un adorno académico; es la espada con la que se desarman las falacias y se rescata la dignidad de la vida.',
    ],
  },
};

export const ADMINS: Leader[] = [
  {
    name: 'Daniel',
    slug: 'daniel',
    fullName: 'Daniel (Administrador)',
    handle: '@brightburn.1895.t',
    role: 'Administrador',
    bio: 'Defensor incansable de los valores y la ética pro-vida. Construyendo un futuro con bases sólidas. 🛡️',
    avatar: '/assets/b4.jpeg',
    tiktok: 'https://www.tiktok.com/@brightburn.1895.t?_r=1&_t=ZT-97gBFTR4uCL',
    youtube: '#',
    publication: {
      title: 'Bases Ontológicas y Éticas de la Defensa de la Vida',
      category: 'Bioética & Filosofía del Derecho',
      date: '11 de septiembre de 2026',
      readTime: '3 min de lectura',
      subtitle: 'La dignidad del ser humano como límite infranqueable al arbitrio estatal',
      summary: 'Análisis sobre cómo el derecho natural y la evidencia biológica fundamentan la personalidad jurídica de todo individuo de la especie humana.',
      paragraphs: [
        'El valor del ser humano no proviene de una concesión legal ni de la utilidad que reporte a un sistema económico o político. Radica en su propia naturaleza intrínseca.',
        '<blockquote>Toda sociedad que condiciona la dignidad humana a la etapa de desarrollo o al grado de autonomía termina justificando la tiranía del fuerte sobre el indefenso.</blockquote>',
        'Frente a las corrientes utilitaristas que degradan la existencia a una función de conveniencia, la ética pro-vida sostiene un principio universal: la vida humana es inviolable en todo momento y circunstancia.',
      ],
    },
  },
  {
    name: 'Mijail',
    slug: 'mijail',
    fullName: 'Mijail (Administrador)',
    handle: '@mijail0712',
    role: 'Administrador',
    bio: 'Analizando la realidad desde una perspectiva crítica y fundamentada. Por la verdad y la vida. 🧠',
    avatar: '/assets/b3.jpeg',
    tiktok: 'https://www.tiktok.com/@mijail0712?_r=1&_t=ZT-97gBFoakkAQ',
    youtube: '#',
    publication: {
      title: 'Desmontando Falacias: Dialéctica y Rigor en el Discurso Público',
      category: 'Lógica & Crítica Cultural',
      date: '08 de septiembre de 2026',
      readTime: '4 min de lectura',
      subtitle: 'Herramientas para identificar y refutar sofismas contemporáneos',
      summary: 'Un manual analítico para desenmascarar argumentos emocionales y sesgos cognitivos en los debates ideológicos de nuestro tiempo.',
      paragraphs: [
        'En la era de la hiperconexión, las falacias proliferan con la velocidad de un algoritmo. El ataque ad hominem, el falso dilema y el hombre de paja se han normalizado como sustitutos del pensamiento.',
        '<blockquote>El debate honesto no busca humillar al interlocutor, sino demoler la mentira para que la verdad resplandezca por su propio peso.</blockquote>',
        'Analizar la realidad desde una perspectiva crítica exige rigor metodológico: verificar premisas, rastrear fuentes primarias y jamás subordinar la evidencia empírica al sentimiento colectivo.',
      ],
    },
  },
  {
    name: 'Ilan',
    slug: 'ilan',
    fullName: 'Ilan J. Jiménez R.',
    handle: '@ianhbelmonte',
    role: 'Administrador',
    bio: 'Comprometido con la difusión de argumentos racionales a favor de la vida y la dignidad humana. ⚖️',
    avatar: '/assets/b2.jpeg',
    tiktok: 'https://www.tiktok.com/@ianhbelmonte?_r=1&_t=ZT-97gBA2To8KM',
    youtube: '#',
    publication: {
      title: 'Sócrates sobre el placer, la virtud y el bien',
      category: 'Disquisiciones Filosóficas',
      date: '12 de septiembre de 2026',
      readTime: '3 min de lectura',
      subtitle: 'La alegoría de los dos toneles (Gorgias de Platón)',
      summary: 'Reflexión profunda sobre el diálogo platónico ante Calicles: el contraste entre la templanza y el deseo insaciable, y la tesis metaética antihedonista.',
      sourceUrl: 'https://www.filosofia.org/cla/pla/img/azf05115.pdf',
      sourceLabel: 'Gorgias, Platón (filosofia.org)',
      paragraphs: [
        'Les comparto una muy breve pero poderosa reflexión de Sócrates en el diálogo <em>Gorgias</em> de Platón ante Calicles.',
        'Calicles cree que la felicidad consiste en tener deseos grandes y poder satisfacerlos sin límite; la templanza es solo cobardía disfrazada de virtud por los débiles.',
        '<blockquote>Sócrates opone la alegoría de dos hombres con toneles (odres): uno con toneles sanos que llena una vez y no necesita más (vida moderada, autosuficiente); otro con toneles agujereados que debe llenar sin cesar día y noche (vida de deseo insaciable).</blockquote>',
        'Esto lleva a la pregunta clave: si el placer fuera idéntico al bien, entonces el hombre que se rasca constantemente por comezón, o el que satisface cualquier apetito por bajo que sea, viviría feliz — conclusión que Calicles mismo encuentra absurda y de la que intenta escapar, aunque sin lograr una salida consistente.',
        '<blockquote>Con esto Sócrates establece una tesis metaética antihedonista: placer y bien no son la misma cosa, porque hay placeres malos (los del cobarde, los del intemperante) y males que producen bien (el dolor del castigo curativo). El criterio del bien no puede ser, entonces, la mera intensidad o cantidad de placer, sino algo relacionado con el orden, la medida y la virtud del alma.</blockquote>',
      ],
    },
  },
  {
    name: 'Laura',
    slug: 'laura',
    fullName: 'Laura (Administradora)',
    handle: '@lauhernandez982',
    role: 'Administradora',
    bio: 'Llevando la voz de la resistencia a cada rincón. Inspirando acción y conciencia en nuestra generación. 🌟',
    avatar: '/assets/b1.jpeg',
    tiktok: 'https://www.tiktok.com/@lauhernandez982?_r=1&_t=ZT-97gBFKjk9eQ',
    youtube: '#',
    publication: {
      title: 'Voz, Conciencia y Juventud: La Resistencia en Acción',
      category: 'Activismo & Comunicación Estratégica',
      date: '09 de septiembre de 2026',
      readTime: '3 min de lectura',
      subtitle: 'Estrategias para movilizar a una generación adormecida hacia causas trascendentales',
      summary: 'Cómo articular un mensaje valiente que conecte con la juventud sin transigir con las modas ideológicas del momento.',
      paragraphs: [
        'Las redes sociales no deben ser meros escaparates de vanidad. Son las nuevas plazas de debate donde se libra la batalla cultural por el corazón y la mente de nuestra generación.',
        '<blockquote>Inspirar a otros no requiere gritar más fuerte, sino sembrar con convicción y coherencia testimonios vivos de verdad.</blockquote>',
        'Cada joven que despierta y asume la defensa de la vida y la libertad es un eslabón que fortalece nuestra resistencia colectiva.',
      ],
    },
  },
];

export const MEMBERS: Member[] = [];

/** Detalle ampliado por miembro para el modal de perfil. */
export const MEMBER_DETAILS: Record<string, MemberDetails> = {
  [LEADER.name]: {
    stats: { debates: 48, library: 9, votes: 512 },
    activities: [
      { id: 1, text: 'Fundó <strong>BONTEN</strong> y redactó el manifiesto de <strong>Nuestra Resistencia</strong>.' },
      { id: 2, text: 'Publica contenido de apologética y filosofía en <strong>TikTok</strong> y <strong>YouTube</strong>.' },
      { id: 3, text: 'Dirige la Mesa Directiva y coordina los debates de la comunidad.' },
    ],
  },
  'Daniel': {
    stats: { debates: 10, library: 5, votes: 150 },
    activities: [
      { id: 1, text: 'Co-administra la comunidad de <strong>BONTEN</strong> y modera debates pro-vida.' },
      { id: 2, text: 'Aporta perspectivas éticas a los fundamentos del grupo.' },
    ],
  },
  'Mijail': {
    stats: { debates: 12, library: 3, votes: 120 },
    activities: [
      { id: 1, text: 'Estratega y pilar en la administración de <strong>BONTEN</strong>.' },
      { id: 2, text: 'Fomenta el diálogo crítico en plataformas digitales.' },
    ],
  },
  'Ilan': {
    stats: { debates: 15, library: 4, votes: 180 },
    activities: [
      { id: 1, text: 'Desarrolla argumentos racionales para la defensa de la vida humana y la dignidad.' },
      { id: 2, text: 'Asesora en temas de bioética, diálogo socrático y filosofía en la comunidad.' },
      { id: 3, text: 'Publicó la disquisición filosófica sobre la alegoría de los dos toneles (Gorgias de Platón).' },
    ],
  },
  'Ian': {
    stats: { debates: 15, library: 4, votes: 180 },
    activities: [
      { id: 1, text: 'Desarrolla argumentos racionales para la defensa de la vida humana y la dignidad.' },
      { id: 2, text: 'Asesora en temas de bioética, diálogo socrático y filosofía en la comunidad.' },
      { id: 3, text: 'Publicó la disquisición filosófica sobre la alegoría de los dos toneles (Gorgias de Platón).' },
    ],
  },
  'Laura': {
    stats: { debates: 11, library: 2, votes: 90 },
    activities: [
      { id: 1, text: 'Dirige las estrategias de comunicación y activismo en <strong>BONTEN</strong>.' },
      { id: 2, text: 'Inspira a nuevos miembros a unirse a la causa de la resistencia.' },
    ],
  },
};

export function getAllLeaders(): Leader[] {
  return [LEADER, ...ADMINS];
}

export function getMemberBySlug(slug: string): Leader | undefined {
  const normalized = slug.toLowerCase().trim();
  return getAllLeaders().find(
    (l) =>
      l.slug.toLowerCase() === normalized ||
      (normalized === 'ian' && l.slug === 'ilan') ||
      (normalized === 'ilan' && l.slug === 'ian')
  );
}

