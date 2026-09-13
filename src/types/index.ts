// =========================================
//  MODELO DE DATOS CENTRAL — BONTEN
//  Tipos compartidos por toda la aplicación.
// =========================================

export type RoleClass =
  | 'role-mod'
  | 'role-investigator'
  | 'role-contributor';

/** Publicación o ensayo destacado del integrante (referencia a disquisiciones filosóficas / doctrinales). */
export interface MemberPublication {
  title: string;
  category: string;
  date: string;
  readTime: string;
  subtitle?: string;
  summary?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  /** Párrafos con soporte de blockquote (prefijo '<blockquote>') y HTML enriquecido */
  paragraphs: string[];
}

/** Miembro base de la comunidad. */
export interface Member {
  name: string;
  fullName?: string;
  slug?: string;
  role: string;
  roleClass: RoleClass;
  bio: string;
  avatar: string;
}

/** Líder fundador / Administrador: miembro con slug, redes y publicación destacada. */
export interface Leader extends Omit<Member, 'roleClass'> {
  slug: string;
  handle: string;
  tiktok: string;
  youtube: string;
  publication?: MemberPublication;
}

/** Métricas y actividad reciente mostradas en el modal de perfil. */
export interface MemberStats {
  debates: number;
  library: number;
  votes: number;
}

export interface MemberActivity {
  id: number;
  /** Puede contener HTML enriquecido (<strong>…</strong>). */
  text: string;
}

export interface MemberDetails {
  stats: MemberStats;
  activities: MemberActivity[];
}

/** Documento de la biblioteca. */
export interface LibraryDocument {
  id: number;
  title: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  excerpt?: string;
  level?: 'Esencial' | 'Intermedio' | 'Avanzado';
  featured?: boolean;
  /** Párrafos; los que empiezan por <blockquote> se renderizan como cita. */
  content: string[];
}

/** Reacciones disponibles en cada argumento de un debate. */
export type ReactionType = 'solido' | 'persuasivo' | 'respetuoso';

export type ArgumentStance = 'pro' | 'contra';

export interface DebateArgument {
  id: number;
  author: string;
  role: string;
  avatar: string;
  roleClass: RoleClass;
  type: ArgumentStance;
  text: string;
  reactions: Record<ReactionType, number>;
  userReactions: ReactionType[];
}

export interface Debate {
  id: number;
  title: string;
  description: string;
  tag: string;
  commentsCount: number;
  voters: number;
  arguments: DebateArgument[];
}

/** Manifiesto de la sección doctrinal (rutas /manifiestos/[slug]). */
export interface Manifiesto {
  slug: string;
  title: string;
  summary: string;
  /** Párrafos con HTML enriquecido admitido. */
  content: string[];
}
