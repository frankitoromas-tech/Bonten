import type { Leader, Member, MemberDetails } from '@/types';

export const LEADER: Leader = {
  name: 'Fireboy 🔥',
  handle: '@fireboyphilosophy',
  role: 'Líder Fundador',
  bio: 'El único impulso que no puede ser frenado es la curiosidad 🔥 #BontenTeam',
  avatar: '/assets/b5.jpeg',
  tiktok: 'https://www.tiktok.com/@fireboyphilosophy',
  youtube: 'https://youtube.com/@fireboyphilosophy?si=5nOPKIestJFXdJOl',
};

export const ADMINS: Leader[] = [
  {
    name: 'Daniel',
    handle: '@brightburn.1895.t',
    role: 'Administrador',
    bio: 'Defensor incansable de los valores y la ética pro-vida. Construyendo un futuro con bases sólidas. 🛡️',
    avatar: '/assets/b4.jpeg',
    tiktok: 'https://www.tiktok.com/@brightburn.1895.t?_r=1&_t=ZT-97gBFTR4uCL',
    youtube: '#',
  },
  {
    name: 'Mijail',
    handle: '@mijail0712',
    role: 'Administrador',
    bio: 'Analizando la realidad desde una perspectiva crítica y fundamentada. Por la verdad y la vida. 🧠',
    avatar: '/assets/b3.jpeg',
    tiktok: 'https://www.tiktok.com/@mijail0712?_r=1&_t=ZT-97gBFoakkAQ',
    youtube: '#',
  },
  {
    name: 'Ian',
    handle: '@ianhbelmonte',
    role: 'Administrador',
    bio: 'Comprometido con la difusión de argumentos racionales a favor de la vida y la dignidad humana. ⚖️',
    avatar: '/assets/b2.jpeg',
    tiktok: 'https://www.tiktok.com/@ianhbelmonte?_r=1&_t=ZT-97gBA2To8KM',
    youtube: '#',
  },
  {
    name: 'Laura',
    handle: '@lauhernandez982',
    role: 'Administradora',
    bio: 'Llevando la voz de la resistencia a cada rincón. Inspirando acción y conciencia en nuestra generación. 🌟',
    avatar: '/assets/b1.jpeg',
    tiktok: 'https://www.tiktok.com/@lauhernandez982?_r=1&_t=ZT-97gBFKjk9eQ',
    youtube: '#',
  }
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
  'Ian': {
    stats: { debates: 15, library: 4, votes: 180 },
    activities: [
      { id: 1, text: 'Desarrolla argumentos racionales para la defensa de la vida humana.' },
      { id: 2, text: 'Asesora en temas de bioética y derechos humanos en la comunidad.' },
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

