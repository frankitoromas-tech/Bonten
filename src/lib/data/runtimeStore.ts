// =========================================
//  ALMACÉN DINÁMICO DE CONTENIDO & METADATOS
//  Permite a Fireboy y al rol de administración
//  mutar datos en caliente de forma segura.
// =========================================

import { DOCUMENTS as INITIAL_DOCS } from '../../data/library.ts';
import type { LibraryDocument } from '../../types';
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
    avatar: '/assets/fireboy_client.webp',
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

export function addLibraryDocument(doc: Omit<LibraryDocument, 'id'>): LibraryDocument {
  const newId = currentDocuments.length > 0 ? Math.max(...currentDocuments.map((d) => d.id)) + 1 : 1;
  const sanitizedDoc: LibraryDocument = {
    id: newId,
    title: sanitizePlainText(doc.title, 120),
    category: sanitizePlainText(doc.category, 50),
    author: sanitizePlainText(doc.author, 60),
    readTime: sanitizePlainText(doc.readTime, 20),
    image: sanitizeUrl(doc.image, '/assets/lib_docs_1781465368328.webp'),
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
