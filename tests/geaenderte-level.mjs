// Welche Level muss pruefe-level.mjs nach einer Änderung fahren? (für die PR-Tests in .github/workflows/pr.yml)
//   node tests/geaenderte-level.mjs <datei> ...   -> Level-IDs, eine pro Zeile
// Level-Datei -> ihre Level, Routen-Datei -> die Level mit Route darin,
// Level-Liste, Autopilot, pruefe-level.mjs oder die Kombinationen (kombis.mjs) -> alle Level. Andere Dateien -> nichts.
import path from 'path';
import { pathToFileURL } from 'url';

const { LEVELS } = await import('../src/levels/index.js');
const alle = new Set(LEVELS.map(l => l.id));
const ids = new Set();

// Level stecken als Objekt mit id und parts in den Exporten, auch in Listen (schwer/garten.js, badezimmer.js)
const sammle = v => {
  if (Array.isArray(v)) v.forEach(sammle);
  else if (v && typeof v === 'object' && typeof v.id === 'string' && Array.isArray(v.parts)) ids.add(v.id);
};

for (const datei of process.argv.slice(2)) {
  const f = datei.replace(/\\/g, '/');
  if (!f.endsWith('.js') && !f.endsWith('.mjs')) continue;
  if (['src/levels/index.js', 'tests/autopilot.js', 'tests/pruefe-level.mjs', 'tests/kombis.mjs'].includes(f)) alle.forEach(id => ids.add(id));
  else if (f.startsWith('src/levels/')) Object.values(await import(pathToFileURL(path.resolve(f)))).forEach(sammle);
  else if (f.startsWith('tests/routes/')) Object.keys((await import(pathToFileURL(path.resolve(f)))).default).forEach(id => ids.add(id));
}

for (const id of ids) if (alle.has(id)) console.log(id);
