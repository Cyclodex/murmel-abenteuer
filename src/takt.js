// Taktlisten für getaktete Bauteile (Hammer, Schieber, Felsen, Falltür, Wind, Band, Pendel, Riesenrad, Schraubstock).
// Ein Takt-Feld ist eine Zahl (immer gleich) oder eine Liste: Zyklus k nimmt liste[k % länge]. Die Zeit zählt ab dem
// Level-Reset, darum läuft bei jedem Start derselbe Ablauf, aber ohne gleichmässige Periode. Kein Zufall.
import { lerp3, ease } from './math.js';

// Wert für Zyklus k (Zahl bleibt Zahl, Liste zyklisch, fehlt = def)
export const nimm = (v, k, def) => v == null ? def : Array.isArray(v) ? v[((k % v.length) + v.length) % v.length] : v;
// Ist eines der Felder eine Liste?
export const hatListe = (...vs) => vs.some(v => Array.isArray(v));
const ggt = (a, b) => b ? ggt(b, a % b) : a;
// Anzahl Zyklen, bis sich alle Listen zusammen wiederholen (kgV der Längen, mindestens m)
export const zyklen = (m, ...vs) => vs.reduce((n, v) => Array.isArray(v) && v.length ? n * v.length / ggt(n, v.length) : n, m || 1);

// Plan aus n Zyklen, Zyklus k dauert dauer(k) s: { n, lens, starts, per }
export function plan(n, dauer) {
  const lens = [], starts = [];
  let s = 0;
  for (let k = 0; k < n; k++) { starts.push(s); const d = Math.max(1e-3, dauer(k)); lens.push(d); s += d; }
  return { n, lens, starts, per: s };
}
// Wo im Plan ist die Zeit t? k = Zyklus fortlaufend (über die Runden), i = Zyklus im Plan, u = s seit Zyklusbeginn, len = Dauer
export function wo(P, t) {
  const r = Math.floor(t / P.per);
  let u = t - r * P.per, i = 0;
  while (i < P.n - 1 && u >= P.starts[i + 1]) i++;
  u = Math.max(0, u - P.starts[i]);
  return { k: r * P.n + i, i, u, len: P.lens[i] };
}
// Start des Zyklus k (fortlaufend)
export const startVon = (P, k) => { const r = Math.floor(k / P.n), i = k - r * P.n; return r * P.per + P.starts[i]; };

// Faktor-Takt [[dauer, faktor, …], …] (Wind, Band): Faktor zur Zeit t, ohne Takt 1
export function faktor(el, t) {
  if (!el.takt || !el.takt.length) return 1;
  const P = el.taktPlan || (el.taktPlan = plan(el.takt.length, k => el.takt[k][0]));
  return el.takt[wo(P, t + (el.offset || 0)).i][1];
}

// Hin und her zwischen from und to (Plattform, Schieber, Schraubstock): Pause bei from, Fahrt, Pause bei to, Fahrt zurück.
// time/pause als Zahl oder Liste: mit Liste zählt jeder Halt mit der folgenden Fahrt als ein Zyklus.
export function hinUndHer(el, t) {
  const time = el.time ?? 3, pause = el.pause ?? 1.5;
  if (!hatListe(time, pause)) { // bisheriges Verhalten, genau gleich gerechnet
    const per = 2 * (time + pause), u = t % per;
    if (u < pause) return el.from;
    if (u < pause + time) return lerp3(el.from, el.to, ease((u - pause) / time));
    if (u < 2 * pause + time) return el.to;
    return lerp3(el.to, el.from, ease((u - 2 * pause - time) / time));
  }
  // Liste: Zyklus = halbe Fahrt (Pause an einem Ende, dann Fahrt zum anderen); gerade Zyklen bei from, ungerade bei to
  const P = el.hhPlan || (el.hhPlan = plan(2 * zyklen(1, time, pause), k => nimm(pause, k, 1.5) + nimm(time, k, 3)));
  const { k, u } = wo(P, t), pa = nimm(pause, k, 1.5), mv = nimm(time, k, 3), [a, b] = k % 2 ? [el.to, el.from] : [el.from, el.to];
  return u < pa ? a : lerp3(a, b, ease((u - pa) / mv));
}

// Zeitpunkte s in [0, rest] (alle 1/30 s), für frei(rest): gilt bed(s) für alle?
export const immer = (rest, bed) => { for (let s = 0; s <= rest + 1e-9; s += 1 / 30) if (!bed(s)) return false; return true; };
