// Kinderzimmer 2: Bett und Nachttisch (Echte Orte, grauer Rohbau). 1 Einheit = 1.6 cm, Murmel Ø 1.6 cm.
// Vom Kissen am Kopfende den Kissenhang hinunter, über die Falten der Bettdecke nach Süden, um den Teddy am Fussende,
// auf der Ostseite zwischen den Kuscheltieren zurück, das Bilderbuch hinauf in die Kurve einer Spielzeug-Rennbahn
// und über die Lücke (5 cm) aufs Nachttischchen in die Schale vor dem Wecker.
// Raum und Möbel: src/orte/kinderzimmer.js. Level-Nullpunkt = Matratze oben, Ostkante des Betts, am Kopfteil;
// yaw 180: Süden = -z (vorwärts), Westen = +x, Osten (Nachttisch) = -x.
// Matratze: x 0..56.25, z 0..-122.5, Oberkante y 0. Nachttisch: x -3.13..-31.25, z -22.5..5.63, Oberkante y 0.
// Zimmerboden: y -31.25 (= killY - 1).
import kinderzimmer from '../../orte/kinderzimmer.js';

const U = 1.6;                  // cm pro Einheit
const BETT = { x: 90 / U, z: -196 / U, d: 20 / U };  // Matratze 90 × 196 × 20 cm (Kopfteil 4 cm)
const KISSEN = { x0: 6.25, x1: 56.25, z0: -25, z1: 0, h: 9.38, oben: -10 }; // 80 × 40 × 15 cm, an der Westwand
const NT = { x0: -3.125, x1: -31.25, z0: -22.5, z1: 5.625, h: 50 / U };     // Nachttisch 45 × 45 × 50 cm
const FALTE = { x0: 28, x1: BETT.x, h: 2.5, l: 28 }; // Falten der Decke: 4 cm hoch, 45 cm lang, westliche Betthälfte
const SCHALE = [-12, 0, -6];

// Falte als Welle (Kosinus) aus geraden Stücken, von z0 nach Süden
function falte(z0) {
  const n = 8, xc = (FALTE.x0 + FALTE.x1) / 2, w = FALTE.x1 - FALTE.x0, out = [];
  const y = i => FALTE.h * (1 - Math.cos(2 * Math.PI * i / n)) / 2, z = i => z0 - FALTE.l * i / n;
  for (let i = 0; i < n; i++) {
    out.push({ type: 'weg', from: [xc, y(i), z(i)], to: [xc, y(i + 1), z(i + 1)], width: w, thick: FALTE.h + 0.5, surface: 'matratze', look: 'decke' });
  }
  return out;
}

export default {
  id: 'kz2', name: 'Bett und Nachttisch', emoji: '🧸', theme: 'zuhause',
  ort: kinderzimmer,
  bereich: { at: [90, 50, 336], yaw: 180, strecke: ['bett', 'nachttisch'] },
  start: [42, KISSEN.h, -5], killY: -50 / U + 1,
  parts: [
    // Matratze mit Bettdecke (weich: Oberfläche matratze)
    { type: 'klotz', at: [BETT.x / 2, -BETT.d / 2, BETT.z / 2], size: [BETT.x, BETT.d, -BETT.z], look: 'decke', surface: 'matratze' },
    // Westwand (hinter der Wand des Zimmers, nur damit die Murmel nicht durch die Wand fällt)
    { type: 'klotz', at: [BETT.x + 1.15, 10, BETT.z / 2], size: [2, 40, -BETT.z], look: 'wand' },

    // Kissen am Kopfende: oben flach, nach Süden ein Hang
    { type: 'klotz', at: [(KISSEN.x0 + KISSEN.x1) / 2, KISSEN.h / 2, KISSEN.oben / 2], size: [KISSEN.x1 - KISSEN.x0, KISSEN.h, -KISSEN.oben], look: 'kissen', surface: 'matratze' },
    { type: 'weg', from: [(KISSEN.x0 + KISSEN.x1) / 2, KISSEN.h, KISSEN.oben], to: [(KISSEN.x0 + KISSEN.x1) / 2, 0, KISSEN.z0], width: KISSEN.x1 - KISSEN.x0, thick: 3, surface: 'matratze', look: 'kissen' },

    // Bettdecke: zwei Falten
    ...falte(-30), ...falte(-30 - FALTE.l),

    // Kuscheltiere (weich): Teddy am Fussende, Hase und Hund auf der Ostseite
    { type: 'klotz', at: [26, 15.63 / 2, -95], size: [12, 15.63, 10], look: 'kuscheltier', surface: 'matratze' },
    { type: 'klotz', at: [8, 6, -72], size: [9, 12, 8], look: 'hase', surface: 'matratze' },
    { type: 'klotz', at: [21, 6, -56], size: [9, 12, 8], look: 'kuscheltier', surface: 'matratze', yaw: 15 },

    // Bilderbuch als Rampe (25 cm), oben auf einer Kurve der Spielzeug-Rennbahn, die auf Bauklötzen steht
    { type: 'checkpoint', at: [3.1, 0, -44], size: [6, 3, 3] },
    { type: 'weg', from: [3.1, 0, -39], to: [3.1, 2.5, -23], width: 4.5, thick: 0.63, look: 'bilderbuch' },
    { type: 'kurve', at: [3.1, 2.5, -23], yaw: 180, turn: 90, radius: 3, width: 4, walls: 1, look: 'rennbahn' },
    { type: 'klotz', at: [2.6, 0.75, -21.4], size: [4, 1.5, 4], look: 'bauklotz', deko: true },

    // Nachttisch mit Wecker, Wasserglas und Schale (Ziel)
    { type: 'klotz', at: [(NT.x0 + NT.x1) / 2, -NT.h / 2, (NT.z0 + NT.z1) / 2], size: [NT.x0 - NT.x1, NT.h, NT.z1 - NT.z0], look: 'nachttisch' },
    { type: 'klotz', at: [-22, 3.125, -2], size: [6.25, 6.25, 3.13], look: 'wecker' },          // Wecker 10 × 10 × 5 cm
    { type: 'klotz', at: [-25, 3.125, -14], size: [4.38, 6.25, 4.38], look: 'glas' },           // Wasserglas Ø 7 × 10 cm
    { type: 'schuessel', at: SCHALE, r: 2, R: 3.5, h: 0.8, rim: 0.3, art: 'schuessel', offen: [0] },
    { type: 'ziel', at: SCHALE, r: 1.8 },

    { type: 'stern', at: [42, 4.69 + 0.9, -17.5] },         // auf dem Kissenhang
    { type: 'stern', at: [42, FALTE.h + 0.9, -30 - FALTE.l / 2] }, // auf der ersten Falte
    { type: 'stern', at: [26, 0.9, -106] },                 // hinter dem Teddy
    { type: 'stern', at: [19, 0.9, -72] },                  // neben dem Hasen
    { type: 'stern', at: [-14, 0.9, -19] }                  // auf dem Nachttisch
  ]
};
