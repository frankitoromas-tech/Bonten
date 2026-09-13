// =========================================
//  SANITIZADOR & DEFECT-PREVENTION XSS
//  Sanitización estricta de entradas y URLs
//  conforme a lineamientos OWASP Top 10.
// =========================================

/** Limpia scripts, eventos intrusivos y etiquetas potencialmente maliciosas */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';

  let clean = input
    // Bloquear scripts y ejecución embebida
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Eliminar manipuladores de eventos (onload, onclick, onerror, etc.)
    .replace(/\s*on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '')
    // Bloquear protocolos peligrosos en atributos href o src
    .replace(/(href|src)\s*=\s*["']\s*(javascript|data|vbscript):/gi, '$1="#blocked-')
    // Prevenir expresiones CSS peligrosas
    .replace(/expression\s*\(.*?\)/gi, '');

  return clean.trim();
}

/** Valida que una URL sea segura (solo http, https o relativa local /) */
export function sanitizeUrl(url: string, fallback = '#'): string {
  if (!url || typeof url !== 'string') return fallback;

  const trimmed = url.trim();

  // Permitir rutas relativas locales seguras
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

/** Sanitiza cadenas de texto plano (nombres, títulos, slugs) */
export function sanitizePlainText(text: string, maxLength = 250): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}
