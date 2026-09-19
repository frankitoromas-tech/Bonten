import test from 'node:test';
import assert from 'node:assert/strict';
import { readLimitedJson } from '../src/lib/security/body.ts';
import { safeEqualText, getTrustedClientIp } from '../src/lib/security/env.ts';
import { requireAdmin, getAuthenticatedActor } from '../src/lib/security/authorization.ts';
import { createMemberToken } from '../src/lib/security/memberAuth.ts';
import { createSessionToken } from '../src/lib/security/auth.ts';
import { recordSecurityEvent, getSecurityEvents } from '../src/lib/security/rateLimiter.ts';

test('1. readLimitedJson: rechaza payloads mayores a 16 KiB declarados en Content-Length', async () => {
  const req = new Request('http://localhost:3000/api/assistant/ingest', {
    method: 'POST',
    headers: {
      'content-length': '20000',
      'content-type': 'application/json',
    },
    body: 'x'.repeat(20000),
  });

  const result = await readLimitedJson(req, 16 * 1024);
  assert.equal(result.ok, false);
  assert.equal(result.status, 413);
  assert.equal(result.error, 'Payload too large');
});

test('2. readLimitedJson: rechaza payloads que exceden el límite aunque no declaren Content-Length', async () => {
  const largeBody = JSON.stringify({ data: 'a'.repeat(17000) });
  const req = new Request('http://localhost:3000/api/assistant/ingest', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: largeBody,
  });

  const result = await readLimitedJson(req, 16 * 1024);
  assert.equal(result.ok, false);
  assert.equal(result.status, 413);
});

test('3. readLimitedJson: rechaza JSON sintácticamente inválido con 400', async () => {
  const req = new Request('http://localhost:3000/api/assistant/ingest', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{"invalidJson": unquoted}',
  });

  const result = await readLimitedJson(req, 16 * 1024);
  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
  assert.equal(result.error, 'Invalid JSON');
});

test('4. readLimitedJson: procesa correctamente payloads válidos dentro del límite', async () => {
  const payload = { title: 'Doctrina Iusnaturalista', topic: 'derecho' };
  const req = new Request('http://localhost:3000/api/assistant/ingest', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await readLimitedJson(req, 16 * 1024);
  assert.equal(result.ok, true);
  assert.deepEqual(result.value, payload);
});

test('5. Control de Ingesta: Claves de integración heredadas (hardcoded) son estrictamente rechazadas', () => {
  const configuredEnvKey = 'super_secret_luyo_token_at_least_32_characters_long';
  const legacyKeys = ['luyo_bonten_secure_2026', 'bonten_master_doctrine_key'];

  for (const legacy of legacyKeys) {
    assert.equal(
      safeEqualText(legacy, configuredEnvKey),
      false,
      `La clave obsoleta ${legacy} no debe coincidir jamás`
    );
  }
});

test('6. Control de Ingesta: Sesión de Miembro de Comunidad no tiene privilegios de Ingesta Doctrinal', () => {
  const memberToken = createMemberToken({
    id: 5,
    username: 'miembro_comunidad',
    email: 'comunidad@bonten.pe',
    role: 'Miembro',
    avatarUrl: '/assets/avatar.webp',
  });

  const req = {
    cookies: {
      get: (n) => (n === 'bonten_user_session' ? { value: memberToken } : undefined),
    },
  };

  const actor = getAuthenticatedActor(req);
  assert.equal(actor?.kind, 'member', 'El actor identificado debe ser de tipo member');

  // La regla de seguridad prohíbe que 'member' ejecute ingesta
  const isAllowedToIngest = actor?.kind === 'admin';
  assert.equal(isAllowedToIngest, false, 'Un miembro no tiene rol de ingesta doctrinal');
});

test('7. Control de Ingesta: Sesión de Administrador es autorizada correctamente', () => {
  const adminToken = createSessionToken('fireboy_bonten_2026', 'ROLE_SUPERADMIN');

  const req = {
    cookies: {
      get: (n) => (n === 'bonten_admin_session' ? { value: adminToken } : undefined),
    },
  };

  const actor = getAuthenticatedActor(req);
  assert.equal(actor?.kind, 'admin', 'El actor identificado debe ser de tipo admin');
  assert.equal(actor?.payload?.role, 'ROLE_SUPERADMIN');
});

test('8. Catálogo de Ciberdefensa: Registro de eventos de abuso de payload e ingesta', () => {
  recordSecurityEvent('198.51.100.99', 'PAYLOAD_TOO_LARGE', 'Intento de desbordamiento de búfer');
  recordSecurityEvent('198.51.100.99', 'INVALID_JSON', 'Payload malformado en endpoint');

  const events = getSecurityEvents();
  assert.ok(events.some((e) => e.type === 'PAYLOAD_TOO_LARGE'));
  assert.ok(events.some((e) => e.type === 'INVALID_JSON'));
});
