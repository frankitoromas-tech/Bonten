import test from 'node:test';
import assert from 'node:assert/strict';
import {
  findUserByEmail,
  findUserByUsername,
  createUser,
  updateUserPassword,
  createPasswordResetToken,
  verifyAndConsumeResetToken,
  addDebateArgument,
  getDebateArguments,
} from '../src/lib/db/database.ts';
import {
  isPublicRoute,
  isMemberRoute,
  isAdminRoute,
} from '../src/lib/security/routes.ts';
import {
  createMemberToken,
  verifyMemberToken,
} from '../src/lib/security/memberAuth.ts';

test('1. Base de Datos: Registro de Usuarios, Salting y Hashing PBKDF2', () => {
  // Verificación de semillas iniciales
  const fireboy = findUserByUsername('fireboy');
  assert.ok(fireboy, 'Debe existir la semilla inicial de Fireboy');
  assert.equal(fireboy.role, 'ROLE_SUPERADMIN');
  assert.notEqual(fireboy.passwordHash, 'fireboy_bonten_2026', 'La contraseña nunca debe estar en texto plano');
  assert.ok(fireboy.passwordSalt.length > 10, 'Debe tener una sal criptográfica');

  // Registro de nuevo miembro
  const regResult = createUser({
    username: 'apologista_nuevo',
    email: 'apologista@bonten.org',
    password: 'password_seguro_2026',
  });
  assert.ok(regResult.user, 'Debe registrar con éxito al usuario');
  assert.equal(regResult.user?.username, 'apologista_nuevo');
  assert.equal(regResult.user?.role, 'ROLE_MEMBER');

  // Rechazo de contraseñas cortas (< 8 caracteres)
  const shortPass = createUser({
    username: 'usuario_inseguro',
    email: 'inseguro@bonten.org',
    password: '123',
  });
  assert.ok(shortPass.error?.includes('8 caracteres'), 'Debe rechazar contraseñas < 8 caracteres');

  // Rechazo de emails duplicados
  const duplicate = createUser({
    username: 'otro_alias',
    email: 'apologista@bonten.org',
    password: 'password_seguro_2026',
  });
  assert.ok(duplicate.error?.includes('ya está registrado'), 'Debe impedir correos duplicados');
});

test('2. OWASP: Restablecimiento de Contraseña con Tokens Hasheados de un Solo Uso', () => {
  const user = findUserByUsername('estudiante_filo');
  assert.ok(user, 'Debe existir el usuario de prueba');

  // Generación de token
  const { plainToken, expiresAt } = createPasswordResetToken(user.id, '127.0.0.1');
  assert.equal(plainToken.length, 64, 'El token debe ser de 32 bytes (64 caracteres hex)');
  assert.ok(expiresAt > Date.now(), 'Debe expirar en el futuro');

  // Consumo legítimo del token
  const consume1 = verifyAndConsumeResetToken(plainToken);
  assert.equal(consume1.valid, true, 'El primer consumo debe ser válido');
  assert.equal(consume1.userId, user.id);

  // Intento de reuso del mismo token (Ataque de Replay)
  const consume2 = verifyAndConsumeResetToken(plainToken);
  assert.equal(consume2.valid, false, 'Un segundo consumo del mismo token debe ser rechazado');
  assert.ok(consume2.error?.includes('utilizado previamente'), 'Debe indicar que ya fue usado');

  // Actualización de contraseña tras validación
  const updated = updateUserPassword(user.id, 'nueva_clave_secreta_2026');
  assert.equal(updated, true, 'Debe actualizar la contraseña del usuario');
});

test('3. Sesiones de Miembro: Generación y Validación de Token HMAC', () => {
  const user = findUserByUsername('estudiante_filo');
  assert.ok(user);

  const token = createMemberToken(user);
  assert.ok(typeof token === 'string' && token.includes('.'));

  // Verificación legítima
  const verified = verifyMemberToken(token);
  assert.equal(verified.valid, true);
  assert.equal(verified.payload?.username, 'estudiante_filo');
  assert.equal(verified.payload?.role, 'ROLE_MEMBER');

  // Verificación de manipulación
  const tampered = token.slice(0, -6) + 'xyz123';
  const checkTampered = verifyMemberToken(tampered);
  assert.equal(checkTampered.valid, false, 'Token alterado debe ser rechazado');
});

test('4. Comentarios en Debates: Persistencia y Sanitización XSS', () => {
  const newArg = addDebateArgument({
    debateId: 1,
    userId: 2,
    username: 'defensor_doctrinal',
    userRole: 'Miembro de Comunidad',
    avatarUrl: '/assets/daniel_client.webp',
    stance: 'contra',
    text: 'Argumento filosófico con <script>evil()</script> y <strong>fundamento ético</strong>',
  });

  assert.ok(newArg.id >= 100);
  assert.doesNotMatch(newArg.text, /<script>/i, 'Debe eliminar etiquetas de script');
  assert.ok(newArg.text.includes('<strong>fundamento ético</strong>'), 'Debe preservar formato seguro');

  const debateArgs = getDebateArguments(1);
  assert.ok(debateArgs.some((a) => a.id === newArg.id));
});

test('5. Matriz RBAC: Clasificación de Rutas Públicas, de Miembro y Administrador', () => {
  // Rutas públicas
  assert.equal(isPublicRoute('/'), true);
  assert.equal(isPublicRoute('/debates'), true);
  assert.equal(isPublicRoute('/manifiestos/fundamentos'), true);
  assert.equal(isPublicRoute('/auth/login'), true);
  assert.equal(isPublicRoute('/auth/forgot-password'), true);

  // Rutas protegidas de miembros
  assert.equal(isMemberRoute('/perfil'), true);
  assert.equal(isMemberRoute('/api/debates/argument'), true);
  assert.equal(isMemberRoute('/debates'), false);

  // Rutas de administración (Fireboy)
  assert.equal(isAdminRoute('/admin'), true);
  assert.equal(isAdminRoute('/admin/metadatos'), true);
  assert.equal(isAdminRoute('/api/admin/metadata'), true);
  assert.equal(isAdminRoute('/admin/login'), false, '/admin/login debe ser accesible para identificarse');
});
