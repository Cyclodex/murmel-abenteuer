// Level ohne Browser prüfen (Node): fährt den Autopilot wie die Tests.
//   node tests/pruefe-level.mjs <id>            -> 3 Stärken (Standard-Murmel) + alle Murmeln (Stärke normal), wie npm test
//   node tests/pruefe-level.mjs <id> --voll     -> alle Stärken x alle Murmeln
//   node tests/pruefe-level.mjs <id> --fahrt [stärke 0-2] [murmel] [startverzögerung]
//                                               -> eine Fahrt mit Wegpunkten, Ereignissen und Stellen, an denen die Murmel runterfällt
import fs from 'fs';
import vm from 'vm';

const ctx = { window: {}, console }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(new URL('../vendor/cannon.min.js', import.meta.url), 'utf8'), ctx);
const CANNON = ctx.CANNON || ctx.window.CANNON;
const { createGame } = await import('../src/game.js');
const { LEVELS } = await import('../src/levels/index.js');
const { checkLevel, createPilot, mainRoute, ROUTES } = await import('./autopilot.js');
const { SKINS } = await import('../src/skins.js');
const { POWERS } = await import('../src/input.js');

const [id, mode, ...args] = process.argv.slice(2);
const L = LEVELS.find(l => l.id === id);
if (!L) { console.log('Unbekanntes Level:', id, '\nVorhanden:', LEVELS.map(l => l.id).join(' ')); process.exit(1); }
if (!ROUTES[id]) { console.log('Keine Route für', id, 'in tests/autopilot.js bzw. tests/routes/'); process.exit(1); }
const mk = (P, S) => () => { const g = createGame(CANNON, L, S.ball); g.tilt = P.tilt * Math.PI / 180; return g; };

if (mode === '--fahrt') {
  const P = POWERS[+(args[0] ?? 1)], S = SKINS.find(s => s.id === (args[1] || 'standard')), delay = +(args[2] || 0);
  const g = mk(P, S)(); g.reset();
  const pilot = createPilot(g, mainRoute(ROUTES[id]));
  const hist = [], f = v => v.toFixed(2);
  let t = 0, last = -1;
  while (t < 400 && !g.st.won) {
    let [ix, iz] = pilot.drive(); if (t < delay) ix = iz = 0;
    const p = g.ball.position, v = g.ball.velocity;
    hist.push(`${f(t)} wp${pilot.i}${pilot.waiting ? '(wartet)' : ''} p=${f(p.x)},${f(p.y)},${f(p.z)} v=${f(v.x)},${f(v.y)},${f(v.z)}`);
    if (pilot.i !== last) { console.log('->', hist[hist.length - 1]); last = pilot.i; }
    const ev = g.step(ix, iz, 1 / 60); t += 1 / 60;
    for (const e of ev) if (!e.startsWith('hit') && e !== 'tock') console.log('   ', e, '@', f(t));
    if (ev.includes('fall') || ev.includes('quetsch')) { console.log('!! davor:'); for (const h of hist.slice(-90).filter((_, k) => k % 15 === 0)) console.log('    ', h); }
    if (ev.includes('fall') || ev.includes('zurueck')) pilot.fell();
  }
  console.log(g.st.won ? 'GESCHAFFT' : 'NICHT GESCHAFFT', f(t), 's, Sterne', g.st.stars, '/', g.st.starTotal);
} else {
  const combos = mode === '--voll'
    ? POWERS.flatMap(P => SKINS.map(S => [P, S]))
    : [...POWERS.map(P => [P, SKINS[0]]), ...SKINS.slice(1).map(S => [POWERS[1], S])];
  let bad = 0; const times = [];
  for (const [P, S] of combos) {
    const c = checkLevel(mk(P, S), ROUTES[id]);
    if (!c.won || c.falls || c.stars !== c.total) { bad++; console.log('FEHLER', P.emoji, S.id, JSON.stringify(c)); } else times.push(c.time);
  }
  const avg = times.length ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1) : '-';
  console.log(`${id}: ${combos.length - bad}/${combos.length} ok, Zeit im Schnitt ${avg} s`);
  process.exit(bad ? 1 : 0);
}
