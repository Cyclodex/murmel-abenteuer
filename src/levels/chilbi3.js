// Chilbi 3: Achterbahn. Die Murmel ist der Wagen. Im Bahnhof ohne Rand wartet sie neben dem Gleis, bis der Mitnehmer des
// Kettenlifts unten steht, dann schiebt er sie hinauf (wer zu früh aufs Gleis rollt, den wirft der zurückfahrende
// Mitnehmer hinten aus dem Bahnhof). Oben die rote Schiene hinunter auf einen schmalen Steg ohne Rand, der Turbo wirft
// die Murmel über die Lücke in die nächste Rinne, dann mit dem zweiten Turbo durch den Looping und im Bremssand zum
// Stehen. Eine Kehre ohne Rand führt aufs Band, das rückwärts fährt, an der Strecke entlang zurück: Mitten auf dem Band
// kreuzt ein Wagen der anderen Bahn, und anhalten kann man auf dem Band nicht. Am Ende schiesst die Kanone die Murmel auf
// ein kleines Podest vor der Zielscheibe, eine schmale Rampe ohne Rand führt hinunter zum Zirkuszelt.
// Versteckt: oben am Lift ein schmales Brett ohne Rand mit dem Bonusstern.
const LIFT = 6, SCH = 3, LOOP = -1, PO = 0.5, ZI = -2.5; // Höhen: Lift oben, Schiene, Looping, Podest, Ziel
const BODEN = -12;                                      // Boden der Welt (1 m unter killY), dort stehen die Stützen
const S = LIFT / 16;                                     // Steigung des Lifts
const BAND = 13;                                         // x des Bands (fährt rückwärts, Richtung +z)
const KR = -76;                                          // z der Kreuzung mit der anderen Bahn
// Stütze der Achterbahn vom Boden bis unter die Schiene
const stuetze = (x, z, oben) => ({ type: 'klotz', at: [x, (BODEN + oben) / 2, z], size: [0.6, oben - BODEN, 0.6], look: 'pfosten', deko: true });
// Sockel neben der Bahn (nur Grafik), darauf steht ein Gegenstand
const sockel = (x, y, z, b = 3, t = 3) => ({ type: 'klotz', at: [x, y - 0.5, z], size: [b, 1, t], deko: true });

export default {
  id: 'c3', name: 'Achterbahn', emoji: '🎢', theme: 'chilbi',
  start: [-8, 0, -5], startYaw: -90, killY: -11,
  parts: [
    // Eingang: Steg mit Torbogen quer zum Bahnhof, links die Kasse
    { type: 'weg', from: [-11, 0, -5], to: [-1.5, 0, -5], width: 2.4, walls: 0.8, caps: 'start' },
    { type: 'deko', form: 'torbogen', at: [-6, 0, -5], yaw: 90 },
    sockel(-8, 0, 0, 6, 6),
    { type: 'deko', form: 'bude', at: [-8, 0, 0.5] },
    sockel(-8, 0, -10, 4, 4),
    { type: 'deko', form: 'ballons', at: [-8, 0, -10] },

    // Bahnhof ohne Rand, hinten offen; der Mitnehmer des Kettenlifts wartet unten (schaut aus dem Boden)
    { type: 'weg', from: [0, 0, -1.5], to: [0, 0, -6], width: 3 },
    { type: 'weg', from: [0, 0, -6], to: [0, LIFT, -22], width: 3, walls: 0.8 },
    { type: 'schieber', from: [0, -0.975, -3.4], to: [0, LIFT, -22], size: [2.8, 1.2, 1.2], time: 4.5, pause: 2, look: 'zelt-rot' },
    stuetze(-1.4, -14, LIFT * 0.5 - 1), stuetze(1.4, -14, LIFT * 0.5 - 1), stuetze(-1.4, -21, LIFT - 1), stuetze(1.4, -21, LIFT - 1),
    { type: 'deko', form: 'turm', at: [-8, BODEN, -20], scale: 1.5 },

    // Oben: kurzes Podest, links das schmale Brett zum Bonusstern
    { type: 'weg', from: [0, LIFT, -22], to: [0, LIFT, -26], width: 3 },
    { type: 'wand', from: [1.7, LIFT, -22], to: [1.7, LIFT, -26], height: 0.8 },
    { type: 'wand', from: [-1.7, LIFT, -22], to: [-1.7, LIFT, -23.4], height: 0.8 },
    { type: 'wand', from: [-1.7, LIFT, -24.6], to: [-1.7, LIFT, -26], height: 0.8 },
    { type: 'checkpoint', at: [0, LIFT, -24.5], size: [3, 3, 2] },
    { type: 'weg', from: [-1.5, LIFT, -24], to: [-5.5, LIFT, -24], width: 1.1 },

    // Erste Abfahrt: rote Schiene, oben steil, unten flacher; dann der Steg ohne Rand, Turbo und Lücke
    { type: 'rinne', from: [0, LIFT, -26], to: [0, 3.9, -32], r: 1.6, bogen: 75, farbe: 0xE53935 },
    { type: 'rinne', from: [0, 3.9, -32], to: [0, 3.2, -35], r: 1.6, bogen: 75, farbe: 0xE53935 },
    { type: 'rinne', from: [0, 3.2, -35], to: [0, SCH, -38], r: 1.6, bogen: 75, farbe: 0xE53935 },
    { type: 'weg', from: [0, SCH, -38], to: [0, SCH, -44], width: 1.4 },
    { type: 'checkpoint', at: [0, SCH, -38.8], size: [1.4, 3, 1.2], side: -1 },
    { type: 'turbo', at: [0, SCH, -43], size: [1.4, 1.6], speed: 9 },
    stuetze(0, -30, 4), stuetze(0, -41, SCH - 0.5),
    // Landung in der nächsten Rinne (lang genug auch für die leichten Murmeln), dann flacher
    { type: 'rinne', from: [0, SCH - 0.8, -47], to: [0, LOOP + 0.5, -56], r: 1.6, bogen: 75, farbe: 0xFDD835 },
    { type: 'rinne', from: [0, LOOP + 0.5, -56], to: [0, LOOP, -60], r: 1.6, bogen: 75, farbe: 0xFDD835 },
    stuetze(0, -51, 0.3),
    // Turbo und Looping, Ausfahrt 5 m weiter rechts
    { type: 'weg', from: [0, LOOP, -60], to: [0, LOOP, -66], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [0, LOOP, -61.5], size: [3, 3, 2] },
    { type: 'turbo', at: [0, LOOP, -64.5], size: [2.6, 2], speed: 13 },
    { type: 'looping', at: [0, LOOP, -66], yaw: 0, radius: 3, width: 3, shift: 5 },
    stuetze(-2.2, -66, LOOP + 5), stuetze(7.2, -66, LOOP + 5),
    // Auslauf: der Bremssand schluckt den Schwung
    { type: 'weg', from: [5, LOOP, -66], to: [5, LOOP, -70], width: 3, walls: 0.8 },
    { type: 'weg', from: [5, LOOP, -70], to: [5, LOOP, -79], width: 3, walls: 0.8, surface: 'sand' },
    { type: 'weg', from: [5, LOOP, -79], to: [5, LOOP, -83], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [5, LOOP, -81], size: [3, 3, 2] },

    // Kehre ohne Rand, dann das Band rückwärts an der Strecke entlang; quer fährt ein Wagen der anderen Bahn
    { type: 'weg', from: [5, LOOP, -83], to: [5, LOOP, -85], width: 2 },
    { type: 'kurve', at: [5, LOOP, -85], yaw: 0, turn: 180, radius: 4, width: 2 },
    { type: 'band', from: [BAND, LOOP, -85], to: [BAND, LOOP, -67], width: 2, speed: 3 },
    { type: 'schieber', from: [BAND - 3, LOOP, KR], to: [BAND + 3, LOOP, KR], size: [2.4, 1.2, 1.6], time: 1.4, pause: 2.4, look: 'zelt-blau' },
    { type: 'klotz', at: [BAND - 4.6, LOOP - 0.3, KR], size: [1.6, 0.4, 2], look: 'pfosten', deko: true },
    { type: 'klotz', at: [BAND + 4.6, LOOP - 0.3, KR], size: [1.6, 0.4, 2], look: 'pfosten', deko: true },
    stuetze(BAND, -82, LOOP - 0.5), stuetze(BAND, -70, LOOP - 0.5),

    // Schiessbude: die Kanone schiesst die Murmel auf das kleine Podest vor der Zielscheibe
    { type: 'weg', from: [BAND, LOOP, -67], to: [BAND, LOOP, -62], width: 2.6, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [BAND, LOOP, -65.5], size: [2.6, 3, 1.4] },
    { type: 'kanone', at: [BAND, LOOP, -63.5], target: [21, PO, -63.5], time: 1.5 },
    { type: 'klotz', at: [21, PO - 0.5, -63.5], size: [3.4, 1, 3.4], surface: 'sand' },
    { type: 'wand', from: [22.7, PO, -61.8], to: [22.7, PO, -65.2], height: 1.4, look: 'zelt-blau' },
    { type: 'deko', form: 'zielscheibe', at: [23.2, PO, -63.5], yaw: -90 },
    stuetze(21, -63.5, PO - 1),

    // Schmale Rampe ohne Rand hinunter, Platz vor dem Zirkuszelt
    { type: 'weg', from: [21, PO, -65.2], to: [21, ZI, -75], width: 1.4 },
    { type: 'weg', from: [21, ZI, -75], to: [21, ZI, -84], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [21, ZI, -80] },
    sockel(21, ZI, -90, 11, 11),
    { type: 'deko', form: 'zelt', at: [21, ZI, -90], yaw: 180 },
    sockel(27, ZI, -80, 3, 3),
    { type: 'deko', form: 'lolli', at: [27, ZI, -80], yaw: 180 },
    sockel(9, LOOP, -58.5),
    { type: 'deko', form: 'popcorn', at: [9, LOOP, -58.5] },

    // Sterne: am Rand des Lifts, am Rand des Stegs vor dem Turbo, am Rand im Bremssand, aussen in der Kehre,
    // am Rand des Bands vor der Kreuzung; Bonus am Ende des Bretts oben am Lift
    { type: 'stern', at: [1.15, S * 10 + 0.9, -16] },
    { type: 'stern', at: [1.15, SCH + 0.9, -39.5] },
    { type: 'stern', at: [6.3, LOOP + 0.9, -75] },
    { type: 'stern', at: [9, LOOP + 0.9, -90.15] },
    { type: 'stern', at: [BAND + 1.2, LOOP + 0.9, -80] },
    { type: 'stern', at: [-5, LIFT + 0.9, -24], bonus: true }
  ]
};
