import type { MemberDetails } from '@/types';

const ILAN_DETAILS: MemberDetails = {
  stats: { debates: 15, library: 4, votes: 180 },
  activities: [
    { id: 1, text: 'Desarrolla argumentos racionales para la defensa de la vida humana y la dignidad.' },
    { id: 2, text: 'Asesora en temas de bioética, diálogo socrático y filosofía en la comunidad.' },
    { id: 3, text: 'Publicó la disquisición filosófica sobre la alegoría de los dos toneles (Gorgias de Platón).' },
  ],
};

/**
 * Métricas y actividades detalladas por integrante.
 * Módulo desacoplado para auditoría independiente de estadísticas.
 */
export const MEMBER_DETAILS: Record<string, MemberDetails> = {
  'Fireboy 🔥': {
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
  'Ilan': ILAN_DETAILS,
  'Ian': ILAN_DETAILS,
  'Laura': {
    stats: { debates: 11, library: 2, votes: 90 },
    activities: [
      { id: 1, text: 'Dirige las estrategias de comunicación y activismo en <strong>BONTEN</strong>.' },
      { id: 2, text: 'Inspira a nuevos miembros a unirse a la causa de la resistencia.' },
    ],
  },
};
