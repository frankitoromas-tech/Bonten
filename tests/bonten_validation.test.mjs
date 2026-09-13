import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('1. Doctrina: Bloque Protestante ha sido reemplazado por Bloque Provida', () => {
  const manifiestosPath = path.join(rootDir, 'src/data/manifiestos.ts');
  const footerPath = path.join(rootDir, 'src/components/layout/Footer.tsx');
  const manifiestosContent = fs.readFileSync(manifiestosPath, 'utf8');
  const footerContent = fs.readFileSync(footerPath, 'utf8');

  assert.doesNotMatch(manifiestosContent, /Bloque Protestante/i, 'No debe existir Bloque Protestante en manifiestos.ts');
  assert.match(manifiestosContent, /Bloque Provida/i, 'Debe contener Bloque Provida en manifiestos.ts');

  assert.doesNotMatch(footerContent, /BLOQUE PROTESTANTE/, 'No debe existir BLOQUE PROTESTANTE en Footer.tsx');
  assert.match(footerContent, /BLOQUE PROVIDA/, 'Debe contener BLOQUE PROVIDA en Footer.tsx');
});

test('2. Integridad de Integrantes y Slugs en members.ts', async () => {
  const membersPath = path.join(rootDir, 'src/data/members.ts');
  const membersContent = fs.readFileSync(membersPath, 'utf8');

  // Comprobación de slugs de los líderes
  const expectedSlugs = ['fireboy', 'daniel', 'mijail', 'ilan', 'laura'];
  for (const slug of expectedSlugs) {
    assert.ok(
      membersContent.includes(`slug: '${slug}'`),
      `Debe existir la definición de slug '${slug}' en members.ts`
    );
  }

  // Comprobación de la función getMemberBySlug
  assert.ok(membersContent.includes('export function getMemberBySlug'), 'Debe exportar getMemberBySlug');
  assert.ok(membersContent.includes('normalized === \'ian\' && l.slug === \'ilan\''), 'Debe soportar alias ian e ilan');
});

test('3. Botón Ver Perfil Completo en las cartas de Members.tsx', () => {
  const membersComponentPath = path.join(rootDir, 'src/components/integrantes/Members.tsx');
  const content = fs.readFileSync(membersComponentPath, 'utf8');

  assert.match(content, /btn-profile-complete/, 'Debe utilizar la clase btn-profile-complete');
  assert.match(content, /<span>Ver Perfil Completo<\/span>/, 'Debe mostrar el texto exacto Ver Perfil Completo');
  assert.match(content, /href=\{`\/integrantes\/\$\{LEADER\.slug\}`\}/, 'El líder debe enlazar a su ruta de integrante');
  assert.match(content, /href=\{`\/integrantes\/\$\{person\.slug\}`\}/, 'Los administradores deben enlazar a su ruta de integrante');
});

test('4. Estilos Responsive y adaptabilidad en index.css', () => {
  const cssPath = path.join(rootDir, 'src/index.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  assert.ok(cssContent.includes('.btn-profile-complete'), 'Debe definir .btn-profile-complete');
  assert.ok(cssContent.includes('.integrante-detail-container'), 'Debe definir .integrante-detail-container');
  assert.ok(cssContent.includes('.integrante-meta-grid'), 'Debe definir .integrante-meta-grid');
  assert.ok(cssContent.includes('.integrante-nav-footer'), 'Debe definir .integrante-nav-footer');
  assert.ok(cssContent.includes('@media (max-width: 640px)'), 'Debe incluir media query de 640px para la navegación');
  assert.ok(cssContent.includes('@media (max-width: 480px)'), 'Debe incluir media query de 480px para móviles');
});

test('5. Contenido de referencia filosófica en módulo desacoplado publications.ts', () => {
  const pubPath = path.join(rootDir, 'src/data/publications.ts');
  const pubContent = fs.readFileSync(pubPath, 'utf8');

  assert.ok(pubContent.includes('Sócrates sobre el placer, la virtud y el bien'), 'Debe incluir el título del ensayo');
  assert.ok(pubContent.includes('La alegoría de los dos toneles'), 'Debe incluir el subtítulo de la alegoría');
  assert.ok(pubContent.includes('metaética antihedonista'), 'Debe incluir la tesis metaética');
  assert.ok(pubContent.includes('https://www.filosofia.org/cla/pla/img/azf05115.pdf'), 'Debe incluir la cita de fuente');
});

test('6. Arquitectura Modular y Fácilmente Auditable (archivos concisos < 100 líneas)', () => {
  const filesToCheck = [
    'src/data/members.ts',
    'src/data/publications.ts',
    'src/data/member_details.ts',
    'src/app/integrantes/[slug]/page.tsx',
    'src/components/integrantes/IntegranteHero.tsx',
    'src/components/integrantes/IntegranteStats.tsx',
    'src/components/integrantes/IntegrantePublication.tsx',
    'src/components/integrantes/IntegranteNavFooter.tsx',
    'src/components/debates/ArgumentBubble.tsx',
    'src/components/debates/ArgumentForm.tsx',
    'src/components/debates/DebateCard.tsx',
    'src/components/debates/DebateDetail.tsx',
    'src/components/debates/Debates.tsx',
  ];

  for (const relativePath of filesToCheck) {
    const fullPath = path.join(rootDir, relativePath);
    assert.ok(fs.existsSync(fullPath), `El archivo modular ${relativePath} debe existir`);
    const lineCount = fs.readFileSync(fullPath, 'utf8').split('\n').length;
    assert.ok(
      lineCount <= 120,
      `El archivo ${relativePath} tiene ${lineCount} líneas (debe ser conciso <= 120 líneas para fácil auditoría)`
    );
  }
});

test('7. Organización Limpia por Dominios en src/components/', () => {
  const componentsDir = path.join(rootDir, 'src/components');
  const items = fs.readdirSync(componentsDir, { withFileTypes: true });

  const rootFiles = items.filter((item) => item.isFile());
  assert.equal(
    rootFiles.length,
    0,
    `src/components/ no debe contener archivos sueltos en la raíz; debe organizarse por dominios. Archivos encontrados: ${rootFiles.map((f) => f.name).join(', ')}`
  );

  const expectedDirs = ['debates', 'home', 'integrantes', 'layout', 'library', 'ui'];
  const dirNames = items.filter((item) => item.isDirectory()).map((d) => d.name).sort();
  for (const exp of expectedDirs) {
    assert.ok(dirNames.includes(exp), `Debe existir el dominio de componentes '${exp}'`);
  }
});
