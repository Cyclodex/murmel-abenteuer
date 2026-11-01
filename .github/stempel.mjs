// Veröffentlichen (.github/workflows/pages.yml): stempelt eine Kopie der Seite mit der Version (Commit), damit Browser
// nach einem Update keine alten Dateien aus dem Cache mit neuen mischen und das Spiel ein Update erkennt (src/update.js).
//   node .github/stempel.mjs <ordner> <version> [<zeit>]
// - index.html: <meta name="version" content="dev"> bekommt die Version, <meta name="version-zeit" content="">
//   die Zeit der Version (ISO 8601, Standard: jetzt; die Action gibt die Zeit des Commits), lokale Dateien
//   (style.css, vendor/, src/main.js) ?v=<version>. Beides zeigt das Spiel klein unten auf der Karte.
// - alle .js-Dateien ausser vendor/: relative Imports (statisch, dynamisch, export … from) bekommen ?v=<version>
// - version.json: { "version", "zeit" }, holt das Spiel ohne Cache, um eine neue Version zu erkennen
// Bricht ab, wenn danach noch ein relativer Import ohne Version übrig ist.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const [dir, version, zeitArg] = process.argv.slice(2);
const zeit = zeitArg || new Date().toISOString();
if (!dir || !/^[\w.-]+$/.test(version || '') || isNaN(Date.parse(zeit)) || /["<>&]/.test(zeit)) {
  console.error('Aufruf: node .github/stempel.mjs <ordner> <version> [<zeit, ISO 8601>]'); process.exit(1);
}
const v = `?v=${version}`;

// relative .js-Pfade in from '…', import '…' und import('…')
const IMPORT = /(\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.\.?\/[^'"?]+\.js)\2/g;
const LEFT = /(\bfrom\s*|\bimport\s*\(?\s*)(['"])\.\.?\/[^'"?]+\.js\2/g;

const files = d => readdirSync(d).flatMap(f => {
  const p = join(d, f);
  if (f === 'node_modules' || f === 'vendor' || f.startsWith('.')) return [];
  return statSync(p).isDirectory() ? files(p) : [p];
});

let n = 0;
const missing = [];
for (const f of files(dir).filter(f => f.endsWith('.js'))) {
  const s = readFileSync(f, 'utf8'), t = s.replace(IMPORT, (m, a, q, p) => { n++; return `${a}${q}${p}${v}${q}`; });
  if (t !== s) writeFileSync(f, t);
  for (const m of t.matchAll(LEFT)) missing.push(`${relative(dir, f)}: ${m[0]}`);
}

const html = join(dir, 'index.html');
let h = readFileSync(html, 'utf8');
const before = h;
h = h.replace('<meta name="version" content="dev">', `<meta name="version" content="${version}">`);
if (h === before) missing.push('index.html: <meta name="version" content="dev"> fehlt');
const ohneZeit = h;
h = h.replace('<meta name="version-zeit" content="">', `<meta name="version-zeit" content="${zeit}">`);
if (h === ohneZeit) missing.push('index.html: <meta name="version-zeit" content=""> fehlt');
h = h.replace(/(\s(?:src|href)=")((?!https?:|\/\/|#)[^"?]+\.(?:js|css))"/g, (m, a, p) => { n++; return `${a}${p}${v}"`; });
writeFileSync(html, h);
writeFileSync(join(dir, 'version.json'), JSON.stringify({ version, zeit }) + '\n');

if (missing.length) { console.error('Ohne Version:\n' + missing.join('\n')); process.exit(1); }
console.log(`Version ${version} (${zeit}): ${n} Verweise gestempelt`);
