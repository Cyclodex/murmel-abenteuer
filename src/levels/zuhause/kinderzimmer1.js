// Kinderzimmer 1: Schreibtisch (Echte Orte, grauer Rohbau). Die Murmel ist echt gross (Ø 1.6 cm, 1 Einheit = 1.6 cm).
// Vom Bücherstapel die Bücher hinunter, übers Heft zwischen zwei Farbstiften durch, durch eine Kartonrolle,
// an der Schreibtischlampe vorbei und über die Tischkante in die offene Schublade.
// Raum und Möbel: src/orte/kinderzimmer.js. Level-Nullpunkt = Tischplatte oben, 10 cm vom Westende, Mitte der Tiefe;
// yaw 90: Osten = -z (vorwärts), Fenster (Süden) rechts (+x), Stuhl und Schublade links (-x).
// Tischplatte: x -25..25, z 6.25..-68.75, Oberkante y 0. Zimmerboden: y -46.875 (= killY - 1).
import kinderzimmer from '../../orte/kinderzimmer.js';

const U = 1.6;                    // cm pro Einheit
const BUCH = [13.13, 1.56, 17.5]; // Buch 21 × 2.5 × 28 cm
const STIFT = [10.94, 0.44, 0.44]; // Farbstift 17.5 cm, Ø 0.7 cm (als Kante)
const HEFT_Y = 0.1;               // Heft liegt 1.6 mm hoch
// Schublade: 24 cm herausgezogen nach Norden (links), Boden 15 cm unter der Tischplatte, bis unter die Platte (4 cm) hoch
const SB = { x0: -40, x1: -25, z0: -65.63, z1: -43.75 };

export default {
  id: 'kz1', name: 'Schreibtisch', emoji: '✏️', theme: 'zuhause',
  ort: kinderzimmer,
  bereich: { at: [150, 75, 50], yaw: 90, strecke: ['schreibtisch'] },
  start: [10, 3 * BUCH[1], 3], killY: -75 / U + 1,
  parts: [
    // Tischplatte (4 cm), ohne richtung: der Blick folgt der Rollrichtung (Kurve zur Schublade)
    { type: 'klotz', at: [0, -1.25, -31.25], size: [50, 2.5, 75], look: 'holz' },

    // Bücherstapel am Start: drei Bücher versetzt wie eine Treppe
    { type: 'klotz', at: [10, BUCH[1] / 2, -9], size: BUCH, look: 'buch-blau', richtung: 0 },
    { type: 'klotz', at: [10.5, BUCH[1] * 1.5, -5], size: BUCH, look: 'buch-gruen', richtung: 0 },
    { type: 'klotz', at: [9.5, BUCH[1] * 2.5, -1], size: BUCH, look: 'buch-rot', richtung: 0 },

    // Heft A4 mit zwei Farbstiften quer: Slalom
    { type: 'klotz', at: [10, HEFT_Y / 2, -29], size: [18.56, HEFT_Y, 13.13], look: 'papier', richtung: 0 }, // quer
    { type: 'klotz', at: [13, HEFT_Y + STIFT[1] / 2, -24], size: STIFT, look: 'stift-gelb' },
    { type: 'klotz', at: [7, HEFT_Y + STIFT[1] / 2, -33], size: STIFT, look: 'stift-blau' },

    // Kartonrolle (Ø 4.5 cm) als Tunnel
    { type: 'roehre', from: [10, 0, -42], yaw: 0, to: [10, 0, -50], toYaw: 0, bogen: 0, out: 3, farbe: 0xC69C6D },
    { type: 'checkpoint', at: [10, 0, -55], size: [8, 3, 3] },

    // Schreibtischlampe: runder Fuss (als Klotz), Arm und Schirm nur zum Anschauen
    { type: 'klotz', at: [-2, 0.6, -60], size: [9.38, 1.2, 9.38], look: 'lampe' },
    { type: 'klotz', at: [-2, 12, -62], size: [1.2, 22, 1.2], look: 'lampe', deko: true },
    { type: 'klotz', at: [-2, 22.5, -57], size: [7, 3, 9], look: 'lampe', deko: true },

    // Dinge auf dem Tisch neben der Strecke
    { type: 'klotz', at: [-14, 3.125, -64], size: [5, 6.25, 5], look: 'becher' },           // Stiftebecher 8 × 10 cm
    { type: 'klotz', at: [-12, 1.56, -30], size: [5, 3.13, 12.5], look: 'maeppchen' },      // Federmäppchen 20 × 8 × 5 cm
    { type: 'klotz', at: [18, 0.31, -48], size: [3.13, 0.63, 1.25], look: 'radierer' },     // Radiergummi 5 × 2 × 1 cm
    { type: 'klotz', at: [-10, BUCH[1] / 2, -10], size: BUCH, look: 'buch-gruen', yaw: 20 },

    // Schublade: Boden, Front und Seiten (hinten schliesst die Tischplatte ab)
    { type: 'klotz', at: [(SB.x0 + SB.x1) / 2, -9.69, (SB.z0 + SB.z1) / 2], size: [SB.x1 - SB.x0, 0.63, SB.z1 - SB.z0], look: 'schublade', richtung: 90 },
    { type: 'wand', from: [SB.x0, -9.375, SB.z1], to: [SB.x0, -9.375, SB.z0], height: 6.88, thick: 0.63, look: 'schublade' },
    { type: 'wand', from: [SB.x0, -9.375, SB.z1], to: [SB.x1, -9.375, SB.z1], height: 6.88, thick: 0.63, look: 'schublade' },
    { type: 'wand', from: [SB.x0, -9.375, SB.z0], to: [SB.x1, -9.375, SB.z0], height: 6.88, thick: 0.63, look: 'schublade' },
    { type: 'wand', from: [SB.x1, -9.375, SB.z1], to: [SB.x1, -9.375, SB.z0], height: 6.88, thick: 0.63, look: 'schublade' },
    { type: 'ziel', at: [(SB.x0 + SB.x1) / 2, -9.375, (SB.z0 + SB.z1) / 2], r: 6 },

    { type: 'stern', at: [10, 3 * BUCH[1] + 0.9, -4] },
    { type: 'stern', at: [3.5, HEFT_Y + 0.9, -24] },
    { type: 'stern', at: [15.5, HEFT_Y + 0.9, -33] },
    { type: 'stern', at: [2, 0.9, -52] },
    { type: 'stern', at: [-20, 0.9, -53] }
  ]
};
