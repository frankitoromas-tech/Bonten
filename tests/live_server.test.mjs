import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:3000';

let isServerRunning = false;
try {
  const probe = await fetch(BASE_URL, { signal: AbortSignal.timeout(800) });
  isServerRunning = Boolean(probe.status);
} catch {
  isServerRunning = false;
}

const skipReason = !isServerRunning ? 'Servidor local no detectado en http://localhost:3000 (ejecutar npm run dev)' : false;

test('Live Server: 1. Ruta /integrantes responde con HTTP 200 y botones Ver Perfil Completo', { skip: skipReason }, async () => {
  const res = await fetch(`${BASE_URL}/integrantes`);
  assert.equal(res.status, 200, 'Debe responder con 200 OK');
  const html = await res.text();

  assert.ok(html.includes('Ver Perfil Completo'), 'Debe incluir el texto Ver Perfil Completo');
  assert.ok(html.includes('/integrantes/fireboy'), 'Debe enlazar a /integrantes/fireboy');
  assert.ok(html.includes('/integrantes/ilan') || html.includes('/integrantes/ian'), 'Debe enlazar a la ficha de Ilan');
  assert.ok(html.includes('BLOQUE PROVIDA'), 'El footer debe mostrar BLOQUE PROVIDA');
});

test('Live Server: 2. Ruta /integrantes/ilan responde con HTTP 200 y el ensayo socrático', { skip: skipReason }, async () => {
  const res = await fetch(`${BASE_URL}/integrantes/ilan`);
  assert.equal(res.status, 200, 'Debe responder con 200 OK');
  const html = await res.text();

  assert.ok(html.includes('Ilan J. Jiménez R.') || html.includes('Ilan'), 'Debe mostrar el nombre de Ilan');
  assert.ok(html.includes('Sócrates sobre el placer, la virtud y el bien'), 'Debe incluir el título del ensayo');
  assert.ok(html.includes('La alegoría de los dos toneles'), 'Debe incluir la alegoría de los dos toneles');
  assert.ok(html.includes('metaética antihedonista'), 'Debe incluir la conclusión metaética');
  assert.ok(html.includes('filosofia.org'), 'Debe incluir la referencia a la fuente original');
  assert.ok(html.includes('Volver a Integrantes'), 'Debe incluir el botón de retorno');
  assert.ok(html.includes('tiktok.com/@ianhbelmonte'), 'Debe incluir su TikTok real');
});

test('Live Server: 3. Compatibilidad de alias /integrantes/ian responde con HTTP 200', { skip: skipReason }, async () => {
  const res = await fetch(`${BASE_URL}/integrantes/ian`);
  assert.equal(res.status, 200, 'Debe responder con 200 OK');
  const html = await res.text();
  assert.ok(html.includes('Sócrates sobre el placer, la virtud y el bien'));
});

test('Live Server: 4. Ruta /manifiestos/fundamentos responde con Fundamentos del Bloque Provida', { skip: skipReason }, async () => {
  const res = await fetch(`${BASE_URL}/manifiestos/fundamentos`);
  assert.equal(res.status, 200, 'Debe responder con 200 OK');
  const html = await res.text();

  assert.ok(html.includes('Fundamentos del Bloque Provida'), 'Debe mostrar Fundamentos del Bloque Provida');
  assert.doesNotMatch(html, /Fundamentos del Bloque Protestante/, 'No debe mostrar Bloque Protestante');
});
