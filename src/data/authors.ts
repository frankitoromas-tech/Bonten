import { LEADER, ADMINS } from './members';

export interface AuthorProfile {
  name: string;
  role: string;
  avatar: string;
}

export function getAuthorProfile(authorName: string): AuthorProfile {
  const norm = authorName.toLowerCase().trim();
  if (norm.includes('fireboy')) {
    return {
      name: LEADER.name,
      role: 'Fundador y Teórico Principal de BONTEN',
      avatar: LEADER.avatar,
    };
  }
  if (norm.includes('ilan') || norm.includes('ian')) {
    const m = ADMINS.find((a) => a.slug === 'ilan');
    return {
      name: m?.fullName || 'Ilan J. Jiménez R.',
      role: 'Consejo Doctrinal • Administrador',
      avatar: m?.avatar || '/assets/b2.jpeg',
    };
  }
  if (norm.includes('daniel')) {
    const m = ADMINS.find((a) => a.slug === 'daniel');
    return {
      name: m?.name || 'Daniel',
      role: 'Formación Académica • Administrador',
      avatar: m?.avatar || '/assets/b4.jpeg',
    };
  }
  if (norm.includes('mijail')) {
    const m = ADMINS.find((a) => a.slug === 'mijail');
    return {
      name: m?.name || 'Mijail',
      role: 'Investigación Crítica • Administrador',
      avatar: m?.avatar || '/assets/b3.jpeg',
    };
  }
  if (norm.includes('laura')) {
    const m = ADMINS.find((a) => a.slug === 'laura');
    return {
      name: m?.name || 'Laura',
      role: 'Comité de Difusión • Administradora',
      avatar: m?.avatar || '/assets/b1.jpeg',
    };
  }
  if (norm.includes('ana')) {
    return {
      name: 'Ana L.',
      role: 'Área Teológica & Hermenéutica',
      avatar: '/assets/avatar_ana_1781465403711.webp',
    };
  }
  if (norm.includes('directiva') || norm.includes('comité') || norm.includes('editorial') || norm.includes('bonten')) {
    return {
      name: authorName,
      role: 'Cuerpo Doctrinal BONTEN',
      avatar: '/LOGO_BONTEN_V2.jpeg',
    };
  }
  return {
    name: authorName,
    role: 'Autor BONTEN',
    avatar: '/LOGO_BONTEN_V2.jpeg',
  };
}
