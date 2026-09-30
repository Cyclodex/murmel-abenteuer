// Punkte einer Fahrt und Rangliste. Reine Funktionen ohne Speicher, damit das Gerät und später die Online-Rangliste (#9)
// gleich rechnen: Eine Fahrt ist { level, stars, total, time, falls, power }, gespeichert wird pro Spieler und Level die Fahrt
// mit den meisten Punkten (ganze Fahrt, nicht das Beste aus mehreren Fahrten).
// Punkte pro Level höchstens 2050:
//   Sterne  1000 × gesammelt / vorhanden (jedes Level zählt gleich viel, egal wie viele Sterne es hat)
//   Zeit     500 × Richtzeit / Zeit, höchstens 750 (bei ⅔ der Richtzeit); langsam gibt weniger, aber nie 0
//   Sauber   300, pro Absturz (runtergefallen oder zerquetscht) 100 weniger, nie unter 0
// Die Stärke (🐢🐇🚀) zählt nicht, sie wird nur angezeigt.
import { RICHTZEIT } from './levels/richtzeiten.js';

export const SCORE = { stars: 1000, time: 500, timeMax: 1.5, clean: 300, fall: 100 };

export function score({ level, stars, total, time, falls }) {
  const par = RICHTZEIT[level];
  const s = total > 0 ? SCORE.stars * Math.min(stars, total) / total : 0;
  const t = par ? SCORE.time * (time > 0 ? Math.min(SCORE.timeMax, par / time) : SCORE.timeMax) : 0;
  const c = Math.max(0, SCORE.clean - SCORE.fall * falls);
  return Math.round(s + t + c);
}

// Rangliste aus Zeilen { name, level, score, power }, z. B. alle lokalen Spieler oder zusammen mit der Online-Rangliste.
// levelId: nur dieses Level (mit Stärke der Fahrt), sonst Summe über alle Level. Pro Name und Level zählt die beste Zeile.
export function ranking(rows, levelId = null) {
  const best = new Map();
  for (const r of rows) {
    if (levelId && r.level !== levelId) continue;
    const k = r.name.toLowerCase() + '\n' + r.level;
    if (!best.has(k) || best.get(k).score < r.score) best.set(k, r);
  }
  const by = new Map();
  for (const r of best.values()) {
    const k = r.name.toLowerCase(), e = by.get(k) || { name: r.name, score: 0, ...(levelId ? { power: r.power } : {}) };
    e.score += r.score; by.set(k, e);
  }
  return [...by.values()].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}
