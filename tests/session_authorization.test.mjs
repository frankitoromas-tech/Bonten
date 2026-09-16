import test from 'node:test';
import assert from 'node:assert/strict';
import { createSessionToken, verifySessionToken } from '../src/lib/security/auth.ts';
import { requireAdmin } from '../src/lib/security/authorization.ts';

test('tampered admin token is rejected by protected API', async () => {
  const token = `${createSessionToken()}x`;
  const result = verifySessionToken(token);
  assert.equal(result.valid, false);
});

test('editor cannot execute superadmin action', async () => {
  const actor = { username: 'editor', role: 'ROLE_EDITOR', iat: 0, exp: 0, jti: '' };
  
  // Fake request with editor token
  const req = {
    headers: new Headers(),
    cookies: {
      get: (n) => n === 'bonten_admin_session' ? { value: createSessionToken('editor', 'ROLE_EDITOR') } : undefined
    }
  };
  
  const result = requireAdmin(req, ['ROLE_SUPERADMIN']);
  assert.equal(result.ok, false);
});
