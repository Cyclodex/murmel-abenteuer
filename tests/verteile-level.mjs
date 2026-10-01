// Verteilt die Fahrten (Level × 16 Kombinationen) auf mehrere Jobs der PR-Tests (.github/workflows/pr.yml).
//   node tests/verteile-level.mjs <teil> <teile> <id> ...   -> Fahrten für Job <teil> (1..teile), eine pro Zeile: "<id> <kombi>"
// Gewicht einer Fahrt = Richtzeit des Levels (src/levels/richtzeiten.js). Längste Fahrt zuerst an den Job mit der
// kleinsten Summe; jeder Job bekommt so ungefähr gleich viel und fährt seine längsten Fahrten zuerst.
import { KOMBIS } from './kombis.mjs';

const { RICHTZEIT } = await import('../src/levels/richtzeiten.js');
const [teil, teile, ...ids] = process.argv.slice(2);
const n = +teile, k = +teil;
if (!(n >= 1 && k >= 1 && k <= n)) { console.error('Aufruf: node tests/verteile-level.mjs <teil> <teile> <id> ...'); process.exit(1); }

const bekannt = Object.values(RICHTZEIT), ohne = Math.max(...bekannt); // Level ohne Richtzeit: vorsichtig als längstes zählen
const fahrten = ids.flatMap(id => KOMBIS.map((_, i) => ({ id, i, t: RICHTZEIT[id] ?? ohne })))
  .sort((a, b) => b.t - a.t || a.id.localeCompare(b.id) || a.i - b.i);
const summe = Array(n).fill(0), meine = [];
for (const f of fahrten) {
  const j = summe.indexOf(Math.min(...summe));
  summe[j] += f.t;
  if (j === k - 1) meine.push(f);
}
for (const f of meine) console.log(f.id, f.i);
