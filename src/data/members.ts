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

export const MEMBERS: Member[] = [
  {
    name: 'Ana L.',
    role: 'Moderadora',
    roleClass: 'role-mod',
    bio: 'Especialista en teología sistemática y gestión de la biblioteca central.',
    avatar: '/assets/avatar_ana_1781465403711.webp',
  },
  {
    name: 'Carlos M.',
    role: 'Investigador',
    roleClass: 'role-investigator',
    bio: 'Encargado de recopilar documentación histórica y análisis de textos.',
    avatar: '/assets/avatar_carlos_1781465414008.webp',
  },
  {
    name: 'Elena R.',
    role: 'Contribuidora',
    roleClass: 'role-contributor',
    bio: 'Activa en los debates sobre apologética y exégesis moderna.',
    avatar: '/assets/avatar_elena_1781465424361.webp',
  },
];

/** Detalle ampliado por miembro para el modal de perfil. */
export const MEMBER_DETAILS: Record<string, MemberDetails> = {
  'Ana L.': {
    stats: { debates: 14, library: 4, votes: 142 },
    activities: [
      { id: 1, text: 'Aportó el documento <strong>Tipologías Teológicas y Exégesis Clandestina</strong> a la Biblioteca.' },
      { id: 2, text: 'Publicó una postura a favor en el debate <strong>La línea temporal actual y la criminalización de la vida</strong>.' },
      { id: 3, text: 'Moderó la discusión sobre <strong>Hermenéutica Bíblica del Antiguo Testamento</strong>.' },
    ],
  },
  'Carlos M.': {
    stats: { debates: 22, library: 2, votes: 98 },
    activities: [
      { id: 1, text: 'Publicó una postura en contra en el debate <strong>¿Es posible separar fe y ciencia en el ámbito académico?</strong>' },
      { id: 2, text: 'Aportó el documento histórico <strong>Manifiestos y Cartas de la Reforma Temprana</strong>.' },
      { id: 3, text: 'Completó la transcripción de manuscritos del siglo XVI para el archivo general.' },
    ],
  },
  'Elena R.': {
    stats: { debates: 8, library: 1, votes: 56 },
    activities: [
      { id: 1, text: 'Publicó una postura a favor en el debate <strong>La fe y la razón en la apologética del siglo XXI</strong>.' },
      { id: 2, text: 'Realizó un aporte crítico a la columna exegética sobre la Gracia.' },
      { id: 3, text: 'Inició el debate abierto sobre <strong>El libre albedrío en la dogmática contemporánea</strong>.' },
    ],
  },
};
