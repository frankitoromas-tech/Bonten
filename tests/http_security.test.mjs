import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import nextConfig from '../next.config.mjs';

const rootDir = process.cwd();

test('1. next.config.mjs: Cabeceras defensivas OWASP configuradas para /(.*)', async () => {
  const headerConfigs = await nextConfig.headers();
  const globalConfig = headerConfigs.find((c) => c.source === '/(.*)');
  assert.ok(globalConfig, 'Debe existir configuración de cabeceras para /(.*)');

  const headersMap = new Map(globalConfig.headers.map((h) => [h.key.toLowerCase(), h.value]));

  assert.equal(headersMap.get('x-content-type-options'), 'nosniff');
  assert.equal(headersMap.get('x-frame-options'), 'DENY');
  assert.match(headersMap.get('content-security-policy') || '', /frame-ancestors 'none'/);
  assert.equal(headersMap.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.ok(headersMap.has('permissions-policy'));
  assert.ok(headersMap.has('strict-transport-security'));

  // Eliminación deliberada de cabecera insegura/obsoleta
  assert.equal(headersMap.get('x-xss-protection'), undefined, 'X-XSS-Protection obsoleto no debe estar presente');
});

test('2. vercel.json: Cabeceras de producción perimetral alineadas con OWASP', () => {
  const vercelJsonPath = path.join(rootDir, 'vercel.json');
  assert.ok(fs.existsSync(vercelJsonPath), 'vercel.json debe existir');

  const config = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
  const globalRoute = config.headers.find((h) => h.source === '/(.*)');
  assert.ok(globalRoute, 'Debe definir cabeceras globales');

  const headersMap = new Map(globalRoute.headers.map((h) => [h.key.toLowerCase(), h.value]));

  assert.equal(headersMap.get('x-content-type-options'), 'nosniff');
  assert.equal(headersMap.get('x-frame-options'), 'DENY');
  assert.match(headersMap.get('content-security-policy') || '', /frame-ancestors 'none'/);
  assert.equal(headersMap.get('x-xss-protection'), undefined, 'X-XSS-Protection no debe estar en vercel.json');
});
