// Richtzeiten für die Punkte (src/score.js) neu messen und in src/levels/richtzeiten.js schreiben (Node, ohne Browser).
// Richtzeit = Zeit des Autopiloten wie in pruefe-level.mjs, mit Stärke normal (🐇) und der Standard-Murmel.
//   node tests/richtzeiten.mjs          -> alle Level
//   node tests/richtzeiten.mjs sz1 k2   -> nur diese Level, die anderen bleiben
import fs from 'fs';
import vm from 'vm';

const ctx = { window: {}, console }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(new URL('../vendor/cannon.min.js', import.meta.url), 'utf8'), ctx);
const CANNON = ctx.CANNON || ctx.window.CANNON;
const { createGame } = await import('../src/game.js');
const { LEVELS } = await import('../src/levels/index.js');
const { checkLevel, ROUTES } = await import('./autopilot.js');
const { SKINS } = await import('../src/skins.js');
const { POWERS } = await import('../src/input.js');
const { RICHTZEIT } = await import('../src/levels/richtzeiten.js');

const ids = process.argv.slice(2);
const out = { ...RICHTZEIT };
let bad = 0;
for (const L of LEVELS) {
  if (ids.length && !ids.includes(L.id)) continue;
  if (!ROUTES[L.id]) { console.log('Keine Route für', L.id); bad++; continue; }
  const P = POWERS[1], S = SKINS[0];
  const c = checkLevel(() => { const g = createGame(CANNON, L, S.ball); g.tilt = P.tilt * Math.PI / 180; return g; }, ROUTES[L.id]);
  if (!c.won) { console.log('NICHT GESCHAFFT', L.id); bad++; continue; }
  console.log(L.id, RICHTZEIT[L.id] ?? '-', '->', c.time);
  out[L.id] = c.time;
}
const body = LEVELS.filter(L => out[L.id]).map(L => `  ${/^[a-z]\w*$/.test(L.id) ? L.id : `'${L.id}'`}: ${out[L.id]}`).join(',\n');
fs.writeFileSync(new URL('../src/levels/richtzeiten.js', import.meta.url),
  `// Richtzeit pro Level in Sekunden für die Punkte (src/score.js): Autopilot mit Stärke normal und Standard-Murmel.\n` +
  `// Erzeugt mit node tests/richtzeiten.mjs, nicht von Hand ändern.\nexport const RICHTZEIT = {\n${body}\n};\n`);
process.exit(bad ? 1 : 0);
