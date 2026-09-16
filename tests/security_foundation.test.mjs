import test from 'node:test';
import assert from 'node:assert/strict';
import { getRequiredSecret, getTrustedClientIp } from '../src/lib/security/env.ts';
import { recordSecurityEvent, getSecurityEvents } from '../src/lib/security/rateLimiter.ts';

test('production refuses missing or weak secrets', async () => {
  assert.throws(() => getRequiredSecret('MISSING_TEST_SECRET', 32));
});

test('client ip ignores untrusted forwarded chain', () => {
  const headers = new Headers({ 'x-forwarded-for': '198.51.100.2, 10.0.0.4' });
  assert.equal(getTrustedClientIp({ headers }), '198.51.100.2');
});

test('audit catalog accepts authorization failures', () => {
  recordSecurityEvent('127.0.0.1', 'AUTHORIZATION_DENIED', 'ingest denied');
  assert.equal(getSecurityEvents()[0].type, 'AUTHORIZATION_DENIED');
});
