import type { Leader, Member, MemberDetails } from '@/types';
import { MEMBER_PUBLICATIONS } from './publications';

export const LEADER: Leader = {
  name: 'Fireboy 🔥',
  slug: 'fireboy',
  fullName: 'Fireboy (Fundador)',
  handle: '@fireboyphilosophy',
  role: 'Líder Fundador',
  bio: 'El único impulso que no puede ser frenado es la curiosidad 🔥 #BontenTeam',
  avatar: '/assets/fireboy_dorsal_7.webp',
  tiktok: 'https://www.tiktok.com/@fireboyphilosophy',
  youtube: 'https://youtube.com/@fireboyphilosophy?si=5nOPKIestJFXdJOl',
  publication: MEMBER_PUBLICATIONS.fireboy,
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
    publication: MEMBER_PUBLICATIONS.daniel,
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
    publication: MEMBER_PUBLICATIONS.mijail,
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
    publication: MEMBER_PUBLICATIONS.ilan,
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
    publication: MEMBER_PUBLICATIONS.laura,
  },
];

export const MEMBERS: Member[] = [];

export { MEMBER_DETAILS } from './member_details';

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

export { getAuthorProfile, type AuthorProfile } from './authors';


