import type { Leader, Member, MemberDetails } from '@/types';

export const LEADER: Leader = {
  name: 'Fireboy 🔥',
  handle: '@fireboyphilosophy',
  role: 'Líder Fundador',
  bio: 'El único impulso que no puede ser frenado es la curiosidad 🔥 #BontenTeam',
  avatar: '/assets/fireboy_client.webp',
  tiktok: 'https://www.tiktok.com/@fireboyphilosophy',
  youtube: 'https://youtube.com/@fireboyphilosophy?si=5nOPKIestJFXdJOl',
};

export const ADMINS: Leader[] = [
  {
    name: 'Admin Bonten 1',
    handle: '@bontenteam.provida',
    role: 'Administrador',
    bio: 'La defensa de la vida humana es nuestra prioridad.',
    avatar: '/assets/b1.jpeg',
    tiktok: 'https://www.tiktok.com/@bontenteam.provida',
    youtube: '#',
  },
  {
    name: 'Admin Bonten 2',
    handle: '@bontenteam.provida',
    role: 'Administrador',
    bio: 'La defensa de la vida humana es nuestra prioridad.',
    avatar: '/assets/b2.jpeg',
    tiktok: 'https://www.tiktok.com/@bontenteam.provida',
    youtube: '#',
  },
  {
    name: 'Admin Bonten 3',
    handle: '@bontenteam.provida',
    role: 'Administrador',
    bio: 'La defensa de la vida humana es nusttra prioridad.',
    avatar: '/assets/b3.jpeg',
    tiktok: 'https://www.tiktok.com/@bontenteam.provida',
    youtube: '#',
  },
  {
    name: 'Admin Bonten 4',
    handle: '@bontenteam.provida',
    role: 'Administrador',
    bio: 'La defensa de la vida humana es nusttra prioridad.',
    avatar: '/assets/b4.jpeg',
    tiktok: 'https://www.tiktok.com/@bontenteam.provida',
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
  'Admin Bonten 1': {
    stats: { debates: 10, library: 5, votes: 150 },
    activities: [
      { id: 1, text: 'Co-administra la comunidad de <strong>BONTEN</strong>.' },
      { id: 2, text: 'La defensa de la vida humana es nuestra prioridad.' },
    ],
  },
  'Admin Bonten 2': {
    stats: { debates: 12, library: 3, votes: 120 },
    activities: [
      { id: 1, text: 'Co-administra la comunidad de <strong>BONTEN</strong>.' },
      { id: 2, text: 'La defensa de la vida humana es nuestra prioridad.' },
    ],
  },
  'Admin Bonten 3': {
    stats: { debates: 15, library: 4, votes: 180 },
    activities: [
      { id: 1, text: 'Co-administra la comunidad de <strong>BONTEN</strong>.' },
      { id: 2, text: 'La defensa de la vida humana es nusttra prioridad.' },
    ],
  },
  'Admin Bonten 4': {
    stats: { debates: 11, library: 2, votes: 90 },
    activities: [
      { id: 1, text: 'Co-administra la comunidad de <strong>BONTEN</strong>.' },
      { id: 2, text: 'La defensa de la vida humana es nusttra prioridad.' },
    ],
  },
};

