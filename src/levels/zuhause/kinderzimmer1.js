// Kinderzimmer 1: Schreibtisch (Echte Orte, grauer Rohbau). Die Murmel ist echt gross (Ø 1.6 cm, 1 Einheit = 1.6 cm).
// S-förmig über den ganzen Tisch: vom Bücherstapel (links hinten) über das Lineal, das auf einem Radiergummi wippt,
// aufs Heft und im Slalom zwischen fünf Farbstiften durch nach rechts, im Bogen ums Federmäppchen, durch den Wind
// des Tischventilators an der Fensterkante entlang, durch die Kartonrolle (Checkpoint 1), am Hufeisenmagneten vorbei
// in den Kugelschreiber, der sie über den Lampenfuss auf Lexikon und Atlas schiesst (Checkpoint 2), die Bücher
// hinunter unter dem Lampenarm durch, unter dem Locher durch (Checkpoint 3), über das kleine Lineal von der Tischkante
// in die offene Schublade und durch die Bauklötze ins Ziel.
// Raum und Möbel: src/orte/kinderzimmer.js. Level-Nullpunkt = Tischplatte oben, 10 cm vom Westende, Mitte der Tiefe;
// yaw 90: Osten = -z (vorwärts), Fenster (Süden) rechts (+x), Stuhl und Schublade links (-x).
// Tischplatte: x -25..25, z 6.25..-68.75, Oberkante y 0. Zimmerboden: y -46.875 (= killY - 1).
import kinderzimmer from '../../orte/kinderzimmer.js';

const U = 1.6;                    // cm pro Einheit
const BUCH = [13.13, 1.56, 17.5]; // Buch 21 × 2.5 × 28 cm
const STIFT = [7.5, 0.63, 0.63];  // dicker Farbstift, schon kurz gespitzt: 12 cm, Ø 1 cm (zu hoch zum Drüberrollen)
const HEFT_Y = 0.1;               // Heft liegt 1.6 mm hoch
const RADIERER = [0.63, 1.25, 3.13]; // Radiergummi 5 × 2 × 1 cm, hochkant
// Schublade: 24 cm herausgezogen nach Norden (links), Boden 15 cm unter der Tischplatte, bis unter die Platte (4 cm) hoch
const SB = { x0: -40, x1: -25, z0: -65.63, z1: -43.75 };
const SB_Y = -9.375;              // Oberkante Schubladenboden
// Slalom auf dem Heft: Stifte quer (entlang z), abwechselnd oben und unten, die Murmel fährt nach rechts (+x)
const SLALOM = [[10.5, 'stift-gelb', -18], [13.5, 'stift-rot', -25], [16.5, 'stift-blau', -18], [19.5, 'stift-gruen', -25], [22.5, 'stift-gelb', -18]];

export default {
  id: 'kz1', name: 'Schreibtisch', emoji: '✏️', theme: 'zuhause',
  ort: kinderzimmer,
  bereich: { at: [150, 75, 50], yaw: 90, strecke: ['schreibtisch'] },
  start: [-14, 3 * BUCH[1], 3], killY: -75 / U + 1,
  parts: [
    // Tischplatte (4 cm), ohne richtung: der Blick folgt der Rollrichtung
    { type: 'klotz', at: [0, -1.25, -31.25], size: [50, 2.5, 75], look: 'holz' },

    // 1. Bücherstapel am Start: drei Bücher versetzt wie eine Treppe
    { type: 'klotz', at: [-14, BUCH[1] / 2, -9], size: BUCH, look: 'buch-blau', richtung: 0 },
    { type: 'klotz', at: [-13.5, BUCH[1] * 1.5, -5], size: BUCH, look: 'buch-gruen', richtung: 0 },
    { type: 'klotz', at: [-14.5, BUCH[1] * 2.5, -1], size: BUCH, look: 'buch-rot', richtung: 0 },

    // 2. Lineal 30 × 3 cm wippt auf einem Radiergummi: hinauf, es kippt nach vorne aufs Heft. Schmal und ohne Rand.
    { type: 'wippe', at: [0, 1.73, -22.85], size: [1.875, 18.75], yaw: -90, angle: 10, rim: 0, look: 'lineal' },
    { type: 'klotz', at: [0, RADIERER[1] / 2, -22.85], size: RADIERER, look: 'radierer', deko: true },

    // 3. Heft A4 quer, darauf der Slalom zwischen fünf Farbstiften
    { type: 'klotz', at: [15.5, HEFT_Y / 2, -22], size: [18.56, HEFT_Y, 13.13], look: 'papier', richtung: -90 },
    ...SLALOM.map(([x, look, z]) => ({ type: 'klotz', at: [x, HEFT_Y + STIFT[1] / 2, z], size: STIFT, yaw: 90, look })),
    // Federmäppchen 20 × 8 × 5 cm: der Bogen nach dem Slalom führt rechts darum herum
    { type: 'klotz', at: [6, 1.56, -30.5], size: [12.5, 3.13, 5], look: 'maeppchen' },

    // 4. Tischventilator (Kopf Ø 15 cm) neben dem Atlas bläst quer über den Tisch zum Fenster: gegenhalten, sonst vom Tisch
    { type: 'wind', at: [12.5, 0, -38], size: [10, 12, 25], yaw: -90, strength: 2.5 },
    { type: 'klotz', at: [-0.8, 0.3, -38], size: [3.5, 0.6, 5], look: 'ventilator', deko: true },  // Fuss
    { type: 'klotz', at: [-0.8, 3.3, -38], size: [0.9, 5.4, 0.9], look: 'ventilator', deko: true }, // Stiel
    { type: 'klotz', at: [-0.6, 6, -38], size: [1.6, 2.5, 2.5], look: 'ventilator', deko: true },   // Motor

    // 5. Kartonrolle (Ø 4.5 cm) als Tunnel, dahinter Checkpoint 1
    { type: 'roehre', from: [15, 0, -44], yaw: 0, to: [15, 0, -50], toYaw: 0, bogen: 0, out: 3, farbe: 0xC69C6D },
    { type: 'checkpoint', at: [15, 0, -53], size: [8, 3, 3] },

    // 6. Hufeisenmagnet nahe der Fensterkante zieht die Murmel zur Kante
    { type: 'magnet', at: [22, 0, -57], radius: 7, strength: 3 },

    // 7. Kugelschreiber als Katapult: schiesst über den Lampenfuss auf Lexikon und Atlas (Mauspad fängt sie auf)
    { type: 'kanone', at: [8, 0, -62], target: [-10, 4.57, -37], time: 2.5, look: 'kugelschreiber' },
    { type: 'klotz', at: [-11, 1.25, -40], size: [15.63, 2.5, 21.25], look: 'buch-rot', richtung: 0 },  // Atlas 25 × 4 × 34 cm
    { type: 'klotz', at: [-11, 3.44, -37], size: [13.13, 1.88, 17.5], look: 'buch-blau', richtung: 0 }, // Lexikon 21 × 3 × 28 cm
    { type: 'klotz', at: [-11, 4.47, -35], size: [11, 0.19, 9], look: 'mauspad', surface: 'handtuch' }, // Mauspad 18 × 14 cm, Neopren
    { type: 'checkpoint', at: [-11, 4.38, -43.5], size: [8, 3, 3] },

    // 8. Schreibtischlampe: runder Fuss und Stange (als Klötze), Arm und Schirm über den Büchern nur zum Anschauen
    { type: 'klotz', at: [1.5, 0.6, -47], size: [9.38, 1.2, 9.38], look: 'lampe' },
    { type: 'klotz', at: [2.5, 12.6, -43.5], size: [1.2, 22.8, 1.2], look: 'lampe' },
    { type: 'klotz', at: [-4.25, 24, -46.25], size: [14.6, 1, 1], yaw: -22, look: 'lampe', deko: true },
    { type: 'klotz', at: [-11, 22.5, -49], size: [7, 3, 7], look: 'lampe', deko: true },

    // 9. Locher: der Hebel schlägt auf die Strecke, Gehäuse daneben
    { type: 'hammer', at: [-11, 0, -55.5], side: 1, length: 4, size: [3.2, 1.4, 1.6], look: 'locher', offset: 1.7 },
    { type: 'klotz', at: [-6.3, 0.7, -55.5], size: [2.4, 1.4, 4], look: 'locher-dunkel', deko: true },
    { type: 'checkpoint', at: [-13.5, 0, -62], size: [3, 3, 3], yaw: 90 },

    // 10. Kleines Lineal (15 cm) auf einem Radiergummi als Sprungschanze über die Tischkante in die Schublade
    { type: 'weg', from: [-15.4, 0.1, -62], to: [-24.75, 1.35, -62], width: 1.875, look: 'lineal' },
    { type: 'klotz', at: [-24, RADIERER[1] / 2, -62], size: RADIERER, look: 'radierer', deko: true },

    // Dinge auf dem Tisch neben der Strecke
    { type: 'klotz', at: [-3, 3.125, -64], size: [5, 6.25, 5], look: 'becher' },           // Stiftebecher 8 × 10 cm
    { type: 'klotz', at: [21, 0.31, -12], size: [3.13, 0.63, 1.25], look: 'radierer' },     // Radiergummi 5 × 2 × 1 cm
    { type: 'klotz', at: [12, BUCH[1] / 2, -5], size: BUCH, look: 'buch-gruen', yaw: 20 },

    // 11. Schublade: Boden, Front und Seiten (hinten schliesst die Tischplatte ab), Filz zum Landen, Bauklötze, Ziel
    { type: 'klotz', at: [(SB.x0 + SB.x1) / 2, -9.69, (SB.z0 + SB.z1) / 2], size: [SB.x1 - SB.x0, 0.63, SB.z1 - SB.z0], look: 'schublade' },
    { type: 'wand', from: [SB.x0, SB_Y, SB.z1], to: [SB.x0, SB_Y, SB.z0], height: 6.88, thick: 0.63, look: 'schublade' },
    { type: 'wand', from: [SB.x0, SB_Y, SB.z1], to: [SB.x1, SB_Y, SB.z1], height: 6.88, thick: 0.63, look: 'schublade' },
    { type: 'wand', from: [SB.x0, SB_Y, SB.z0], to: [SB.x1, SB_Y, SB.z0], height: 6.88, thick: 0.63, look: 'schublade' },
    { type: 'wand', from: [SB.x1, SB_Y, SB.z1], to: [SB.x1, SB_Y, SB.z0], height: 6.88, thick: 0.63, look: 'schublade' },
    { type: 'klotz', at: [-30, SB_Y + 0.15, -61], size: [9, 0.3, 7], look: 'filz', surface: 'handtuch' }, // Filzmatte
    { type: 'domino', from: [-33, SB_Y, -55.5], to: [-33, SB_Y, -50.5], count: 5, size: [1.9, 2.5, 0.63], look: 'bauklotz' }, // Bauklötze 3 × 4 × 1 cm
    { type: 'ziel', at: [-33, SB_Y, -47.5], r: 2 },

    { type: 'stern', at: [-14, 3 * BUCH[1] + 0.9, -4] },
    { type: 'stern', at: [16.5, HEFT_Y + 0.9, -22.85] },
    { type: 'stern', at: [21, 0.9, -38] },
    { type: 'stern', at: [18, 0.9, -57.5] },
    { type: 'stern', at: [-11, 0.9, -59.5] }
  ]
};
