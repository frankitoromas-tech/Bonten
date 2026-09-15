// =========================================
//  ALMACÉN DINÁMICO DE CONTENIDO & METADATOS
//  Permite a Fireboy y al rol de administración
//  mutar datos en caliente de forma segura.
// =========================================

import { DOCUMENTS as INITIAL_DOCS } from '../../data/library.ts';
import { INITIAL_DEBATES } from '../../data/debates.ts';
import type { LibraryDocument, Debate } from '../../types';
import { sanitizeHtml, sanitizePlainText, sanitizeUrl } from '../security/sanitizer.ts';

export interface SiteMetadata {
  title: string;
  description: string;
  headerSlogan: string;
  logoUrl: string;
  fireboy: {
    fullName: string;
    handle: string;
    avatar: string;
    bio: string;
    tiktok: string;
    youtube: string;
    instagram: string;
    xTwitter: string;
    roles: string[];
  };
}

let currentMetadata: SiteMetadata = {
  title: 'BONTEN | Filosofía, Apologética y Resistencia Intelectual',
  description: 'Comunidad de pensamiento crítico, teología rigurosa y debates de alto impacto.',
  headerSlogan: 'BONTEN // RESISTENCIA INTELECTUAL',
  logoUrl: '/favicon.ico',
  fireboy: {
    fullName: 'Fireboy (Fundador)',
    handle: '@fireboyphilosophy',
    avatar: '/assets/fireboy_dorsal_7.webp',
    bio: 'Fundador y líder de la comunidad BONTEN. Especialista en apologética, debate presuposicional y análisis cultural.',
    tiktok: 'https://www.tiktok.com/@fireboyphilosophy',
    youtube: 'https://youtube.com/@fireboyphilosophy?si=5nOPKIestJFXdJOl',
    instagram: 'https://instagram.com/bonten_oficial',
    xTwitter: 'https://x.com/bonten_philo',
    roles: ['🔥 Fundador', '🛡️ Apologética & Doctrina', '🎙️ Productor'],
  },
};

let currentDocuments: LibraryDocument[] = JSON.parse(JSON.stringify(INITIAL_DOCS));

export function getSiteMetadata(): SiteMetadata {
  return JSON.parse(JSON.stringify(currentMetadata));
}

export function updateSiteMetadata(update: Partial<SiteMetadata>): SiteMetadata {
  if (update.title) currentMetadata.title = sanitizePlainText(update.title, 100);
  if (update.description) currentMetadata.description = sanitizePlainText(update.description, 300);
  if (update.headerSlogan) currentMetadata.headerSlogan = sanitizePlainText(update.headerSlogan, 80);
  if (update.logoUrl) currentMetadata.logoUrl = sanitizeUrl(update.logoUrl, '/favicon.ico');

  if (update.fireboy) {
    const fb = update.fireboy;
    if (fb.fullName) currentMetadata.fireboy.fullName = sanitizePlainText(fb.fullName, 60);
    if (fb.handle) currentMetadata.fireboy.handle = sanitizePlainText(fb.handle, 50);
    if (fb.avatar) currentMetadata.fireboy.avatar = sanitizeUrl(fb.avatar, '/assets/fireboy_client.webp');
    if (fb.bio) currentMetadata.fireboy.bio = sanitizePlainText(fb.bio, 500);
    if (fb.tiktok) currentMetadata.fireboy.tiktok = sanitizeUrl(fb.tiktok, '');
    if (fb.youtube) currentMetadata.fireboy.youtube = sanitizeUrl(fb.youtube, '');
    if (fb.instagram) currentMetadata.fireboy.instagram = sanitizeUrl(fb.instagram, '');
    if (fb.xTwitter) currentMetadata.fireboy.xTwitter = sanitizeUrl(fb.xTwitter, '');
    if (Array.isArray(fb.roles)) {
      currentMetadata.fireboy.roles = fb.roles.map((r) => sanitizePlainText(r, 40));
    }
  }

  return getSiteMetadata();
}

export function getLibraryDocuments(): LibraryDocument[] {
  return JSON.parse(JSON.stringify(currentDocuments));
}

export function addLibraryDocument(doc: Omit<LibraryDocument, 'id' | 'image'> & { image?: string }): LibraryDocument {
  const newId = currentDocuments.length > 0 ? Math.max(...currentDocuments.map((d) => d.id)) + 1 : 1;
  const sanitizedDoc: LibraryDocument = {
    id: newId,
    title: sanitizePlainText(doc.title, 120),
    category: sanitizePlainText(doc.category, 50),
    author: sanitizePlainText(doc.author, 60),
    readTime: sanitizePlainText(doc.readTime, 20),
    image: sanitizeUrl(doc.image || '/assets/lib_docs_1781465368328.webp', '/assets/lib_docs_1781465368328.webp'),
    content: (doc.content || []).map((p) => sanitizeHtml(p)),
  };

  currentDocuments.push(sanitizedDoc);
  return sanitizedDoc;
}

export function updateLibraryDocument(id: number, doc: Partial<LibraryDocument>): LibraryDocument | null {
  const idx = currentDocuments.findIndex((d) => d.id === id);
  if (idx === -1) return null;

  const existing = currentDocuments[idx];
  currentDocuments[idx] = {
    ...existing,
    ...(doc.title && { title: sanitizePlainText(doc.title, 120) }),
    ...(doc.category && { category: sanitizePlainText(doc.category, 50) }),
    ...(doc.author && { author: sanitizePlainText(doc.author, 60) }),
    ...(doc.readTime && { readTime: sanitizePlainText(doc.readTime, 20) }),
    ...(doc.image && { image: sanitizeUrl(doc.image, existing.image) }),
    ...(doc.content && { content: doc.content.map((p) => sanitizeHtml(p)) }),
  };

  return currentDocuments[idx];
}

export function deleteLibraryDocument(id: number): boolean {
  const initialLen = currentDocuments.length;
  currentDocuments = currentDocuments.filter((d) => d.id !== id);
  return currentDocuments.length < initialLen;
}

export function resetSiteMetadata(): SiteMetadata {
  currentMetadata = {
    title: 'BONTEN | Filosofía, Apologética y Resistencia Intelectual',
    description: 'Comunidad de pensamiento crítico, teología rigurosa y debates de alto impacto.',
    headerSlogan: 'BONTEN // RESISTENCIA INTELECTUAL',
    logoUrl: '/favicon.ico',
    fireboy: {
      fullName: 'Fireboy (Fundador)',
      handle: '@fireboyphilosophy',
      avatar: '/assets/fireboy_client.webp',
      bio: 'Fundador y líder de la comunidad BONTEN. Especialista en apologética, debate presuposicional y análisis cultural.',
      tiktok: 'https://www.tiktok.com/@fireboyphilosophy',
      youtube: 'https://youtube.com/@fireboyphilosophy?si=5nOPKIestJFXdJOl',
      instagram: 'https://instagram.com/bonten_oficial',
      xTwitter: 'https://x.com/bonten_philo',
      roles: ['🔥 Fundador', '🛡️ Apologética & Doctrina', '🎙️ Productor'],
    },
  };
  return getSiteMetadata();
}

export const siteMetadataStore = {
  get: getSiteMetadata,
  update: updateSiteMetadata,
  reset: resetSiteMetadata,
};

let currentDebates: Debate[] = JSON.parse(JSON.stringify(INITIAL_DEBATES));

export function getStoreDebates(): Debate[] {
  return JSON.parse(JSON.stringify(currentDebates));
}

export function addStoreDebate(d: Partial<Debate>): Debate {
  const newId = currentDebates.length > 0 ? Math.max(...currentDebates.map((x) => x.id)) + 1 : 1;
  const newDebate: Debate = {
    id: newId,
    title: sanitizePlainText(d.title || 'Nuevo Debate Doctrinal', 140),
    description: sanitizePlainText(d.description || '', 300),
    tag: sanitizePlainText(d.tag || 'General', 40),
    commentsCount: 0,
    voters: 0,
    arguments: d.arguments || [],
  };
  currentDebates.unshift(newDebate);
  return newDebate;
}

export function updateStoreDebate(id: number, d: Partial<Debate>): Debate | null {
  const idx = currentDebates.findIndex((x) => x.id === id);
  if (idx === -1) return null;

  const existing = currentDebates[idx];
  currentDebates[idx] = {
    ...existing,
    ...(d.title && { title: sanitizePlainText(d.title, 140) }),
    ...(d.description && { description: sanitizePlainText(d.description, 300) }),
    ...(d.tag && { tag: sanitizePlainText(d.tag, 40) }),
  };

  return currentDebates[idx];
}

export function deleteStoreDebate(id: number): boolean {
  const initialLen = currentDebates.length;
  currentDebates = currentDebates.filter((x) => x.id !== id);
  return currentDebates.length < initialLen;
}

// =========================================================================
// ALMACÉN DE CONTRIBUCIONES DOCTRINALES (NEXO SEGURO CON LUYO & AUTORES)
// =========================================================================

export interface DoctrinalContribution {
  id: string;
  author: string;
  topic: 'filosofia' | 'etica' | 'estetica' | 'derecho' | 'biologia' | 'politica' | 'general';
  title: string;
  thesis: string;
  content: string;
  verified: boolean;
  createdAt: string;
}

let currentDoctrinalContributions: DoctrinalContribution[] = [
  {
    id: 'luyo-doc-01',
    author: 'Luyo',
    topic: 'derecho',
    title: 'Primacía Iusnaturalista del Nasciturus frente al Positivismo Formalista',
    thesis: 'El derecho a la vida es pre-jurídico y ontológico; ninguna convención legislativa puede degradar a un individuo humano a la categoría de cosa.',
    content: 'El positivismo formalista kelseniano reduce la justicia a la mera validez formal de la norma positiva sancionada. Sin embargo, frente al concebido no nacido, la biología molecular certifica un individuo vivo de la especie Homo sapiens. Si el Estado condiciona la personalidad jurídica a la viabilidad extrauterina o al consenso político, incurre en una ficción biopolítica discriminatoria que subvierte el principio de universalidad de los derechos humanos inalienables.',
    verified: true,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'luyo-doc-02',
    author: 'Luyo',
    topic: 'etica',
    title: 'Límites Deontológicos de la Ética Negativa y Florecimiento Positivo',
    thesis: 'La ética negativa impone la prohibición absoluta de dañar al inocente, mientras la ética positiva demanda acogida comunitaria y subsidiaridad.',
    content: 'En la filosofía moral, la ética negativa establece deberes de justicia estricta (neminem laedere): la proscripción categórica de disponer de la vida ajena como medio instrumental para resolver dificultades ajenas. En complementariedad armónica, la ética positiva compromete a la comunidad política en deberes de benevolencia y amparo hacia la madre gestante y el recién nacido, erradicando el falso dilema utilitarista.',
    verified: true,
    createdAt: '2026-03-05T12:00:00Z',
  },
  {
    id: 'luyo-doc-03',
    author: 'Luyo',
    topic: 'estetica',
    title: 'La Belleza como Resplandor del Ser frente al Feísmo Nihilista',
    thesis: 'La estética no es mero estímulo sensorial arbitrario, sino la manifestación sensible de la verdad y el orden del ser.',
    content: 'En concordancia con el tratado de Fireboy sobre la fractura posmoderna, cuando una civilización extirpa el telos y la trascendencia, el arte colapsa en el feísmo iconoclasta y la glorificación de lo abyecto. Reivindicar la kalokagathía clásica (la unión indisoluble de lo bello, lo verdadero y lo bueno) constituye un acto de resistencia cultural primordial frente al descarte humano.',
    verified: true,
    createdAt: '2026-03-10T14:30:00Z',
  },
];

export function getDoctrinalContributions(): DoctrinalContribution[] {
  return JSON.parse(JSON.stringify(currentDoctrinalContributions));
}

export function addDoctrinalContribution(
  item: Omit<DoctrinalContribution, 'id' | 'createdAt' | 'verified'> & { verified?: boolean }
): DoctrinalContribution {
  const newId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const sanitized: DoctrinalContribution = {
    id: newId,
    author: sanitizePlainText(item.author || 'Luyo', 50),
    topic: item.topic || 'general',
    title: sanitizePlainText(item.title, 140),
    thesis: sanitizePlainText(item.thesis, 280),
    content: sanitizePlainText(item.content, 2500),
    verified: item.verified ?? true,
    createdAt: new Date().toISOString(),
  };

  currentDoctrinalContributions.unshift(sanitized);
  return sanitized;
}
