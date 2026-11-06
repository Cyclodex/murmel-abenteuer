// Chilbi 2: Riesenrad. Die Putschauto-Arena hat keine Bande mehr: drei Autos mit verschiedenen Takten fahren quer bis an
// die Kante und schieben die Murmel hinaus. Man wartet in den Gassen zwischen den Spuren und quert im Zickzack (links,
// rechts, links), immer dort, wo das Auto gerade weggefahren ist. Hau den Lukas als Doppelhammer: zwei Hämmer von beiden
// Seiten, im Wechsel; zwischen ihnen warten. Das Riesenrad trägt die Murmel hinauf, oben geht es auf einen schmalen
// Hochsteg ohne Rand, im Zickzack zum Rutschturm und hinunter vors Zirkuszelt. Wer eine Gondel weiter fährt, findet
// links den Bonusstern und eine schmale Rampe ohne Rand hinunter.
const A = 4.5;                                   // Arena: Mitte quer
const XR = A + 4.5;                              // rechts wird gequert, dort geht es hinaus
const RAD = [XR, 0, -56], RR = 5;                // Riesenrad: Einstieg (unterste Gondel) und Radius
const SX = RR * Math.sin(Math.PI / 3);           // so weit seitlich halten die Gondeln auf halber Höhe
const OBEN = 2 * RR, HALB = 1.5 * RR, UNTEN = 5; // Höhe oben, des Bonus-Stegs, des Platzes am Ende
// Putschauto: fährt quer über die ganze Arena bis an die Kante (3.4 m lang, 2.4 m breit)
const AUTO = { type: 'schieber', form: 'putschauto', size: [2.4, 1.4, 3.4] };
const L = A - 5.3, R = A + 5.3;                   // Mitte der Autos an den Enden
const PFOSTEN = { type: 'klotz', size: [0.6, 3, 0.6], look: 'pfosten', deko: true };
const STEG = 1.5;                                // Breite des Hochstegs

export default {
  id: 'c2', name: 'Riesenrad', emoji: '🎡', theme: 'chilbi',
  start: [0, 0, 2], killY: -8,
  parts: [
    // Start auf dem Holzsteg, durch den Torbogen in die Arena
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -4], width: 4, walls: 0.8, caps: 'start' },
    { type: 'deko', form: 'torbogen', at: [0, 0, -3.8] },

    // Putschauto-Arena ohne Bande: Spuren bei z -9, -14.5, -20, dazwischen Gassen zum Warten
    { type: 'klotz', at: [A, -0.5, -14], size: [14, 1, 20] },
    { ...AUTO, from: [L, 0, -9], to: [R, 0, -9], yaw: -90, time: 1.6, pause: 1.6, farbe: 0xE53935 },
    { ...AUTO, from: [R, 0, -14.5], to: [L, 0, -14.5], yaw: 90, time: 2.4, pause: 1.0, farbe: 0x1E88E5 },
    { ...AUTO, from: [L, 0, -20], to: [R, 0, -20], yaw: -90, time: 1.1, pause: 2.2, farbe: 0xFDD835 },

    // Hinaus rechts über einen schmalen Steg ohne Rand
    { type: 'weg', from: [XR, 0, -24], to: [XR, 0, -31], width: 1.6 },
    { type: 'weg', from: [XR, 0, -31], to: [XR, 0, -35], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [XR, 0, -33], size: [4, 3, 2] },

    // Hau den Lukas, doppelt: zwei Hämmer von beiden Seiten, im Wechsel; Steg ohne Rand
    { type: 'weg', from: [XR, 0, -35], to: [XR, 0, -50], width: 3.4 },
    { type: 'hammer', at: [XR, 0, -39], side: 1, length: 4, size: [3.2, 1.4, 1.6], up: 1.2, down: 0.5, farbe: 'rot' },
    { type: 'hammer', at: [XR, 0, -44.5], side: -1, length: 4, size: [3.2, 1.4, 1.6], up: 1.2, down: 0.5, offset: 1.54, farbe: 'blau' },

    // Podest vor dem Riesenrad
    { type: 'weg', from: [XR, 0, -50], to: [XR, 0, -54], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [XR, 0, -52], size: [3, 3, 2] },

    // Riesenrad: unten einsteigen, rechts hinauf, nach drei Schritten oben aussteigen
    { type: 'riesenrad', at: RAD, radius: RR, gondeln: 6, size: [3.2, 4] },

    // Oben: kleines Podest, dann der Hochsteg ohne Rand im Zickzack, leicht bergab
    { type: 'weg', from: [XR, OBEN, -58], to: [XR, OBEN, -61], width: 3.2, walls: 0.8 },
    { type: 'checkpoint', at: [XR, OBEN, -59.5], size: [3.2, 3, 2] },
    { type: 'weg', from: [XR, OBEN, -61], to: [XR, OBEN, -65], width: STEG },
    { type: 'kurve', at: [XR, OBEN, -65], yaw: 0, turn: -90, radius: 3, width: STEG },
    { type: 'weg', from: [XR - 3, OBEN, -68], to: [XR - 7, OBEN - 0.5, -68], width: STEG },
    { type: 'kurve', at: [XR - 7, OBEN - 0.5, -68], yaw: 90, turn: 90, radius: 3, width: STEG },
    { type: 'weg', from: [XR - 10, OBEN - 0.5, -71], to: [XR - 10, OBEN - 0.5, -74], width: 2.6, walls: 0.8 },
    // Rutschturm: eine Runde links um den Turm hinunter, dann ein kurzer Auslauf ohne Rand
    { type: 'rinne', at: [XR - 10, OBEN - 0.5, -74], yaw: 0, turn: -360, radius: 5, rise: UNTEN - OBEN + 0.5, r: 1.6, bogen: 75, farbe: 0xFDD835 },
    { type: 'weg', from: [XR - 10, UNTEN, -74], to: [XR - 10, UNTEN, -80], width: 2.2 },

    // Versteckt: eine Gondel weiter (links, tiefer) ein Steg mit dem Bonusstern, dann eine schmale Rampe ohne Rand
    { type: 'weg', from: [XR - SX, HALB, -58], to: [XR - SX, HALB, -61], width: 1.4 },
    { type: 'weg', from: [XR - SX, HALB, -61], to: [XR - SX, UNTEN, -80], width: 1.4 },

    // Platz vor dem Zirkuszelt: Ziel
    { type: 'klotz', at: [0, UNTEN - 0.5, -87], size: [14, 1, 14] },
    { type: 'wand', from: [-7.2, UNTEN, -79.8], to: [-7.2, UNTEN, -94.2], height: 1.2 },
    { type: 'wand', from: [7.2, UNTEN, -79.8], to: [7.2, UNTEN, -94.2], height: 1.2 },
    { type: 'wand', from: [-7, UNTEN, -94.2], to: [7, UNTEN, -94.2], height: 1.2 },
    { type: 'wand', from: [-7, UNTEN, -79.8], to: [XR - 11.3, UNTEN, -79.8], height: 1.2 },
    { type: 'wand', from: [XR - 8.7, UNTEN, -79.8], to: [XR - SX - 0.9, UNTEN, -79.8], height: 1.2 },
    { type: 'wand', from: [XR - SX + 0.9, UNTEN, -79.8], to: [7, UNTEN, -79.8], height: 1.2 },
    { type: 'ziel', at: [0, UNTEN, -89] },

    // Sterne: in den Gassen der Arena ganz aussen an der Kante, zwischen den Hämmern am Rand, auf dem Weg der Gondel,
    // auf dem Hochsteg, versteckt eine Gondel weiter
    { type: 'stern', at: [L - 0.6, 0.9, -11.75] },
    { type: 'stern', at: [R + 0.6, 0.9, -17.25] },
    { type: 'stern', at: [XR + 1.2, 0.9, -41.75] },
    { type: 'stern', at: [XR + SX, RR / 2 + 0.9, RAD[2]], r: 1.6 },
    { type: 'stern', at: [XR - 5, OBEN - 0.25 + 0.9, -68] },
    { type: 'stern', at: [XR - SX, HALB + 0.9, -60], bonus: true },

    // Chilbi rundherum (Böden unter den Buden nur Grafik)
    { type: 'klotz', at: [-6.5, -0.5, 1], size: [8.2, 1, 8], deko: true },
    { type: 'deko', form: 'bude', at: [-6.6, 0, 1], yaw: -90 },
    { type: 'klotz', at: [5, -0.5, 1], size: [4, 1, 6], deko: true },
    { type: 'deko', form: 'ballons', at: [4.8, 0, 2.6] },
    { type: 'deko', form: 'zuckerwatte', at: [5.1, 0, -0.6] },
    { ...PFOSTEN, at: [A - 7, 1.5, -4] },
    { ...PFOSTEN, at: [A + 7, 1.5, -4] },
    { ...PFOSTEN, at: [A - 7, 1.5, -24] },
    { ...PFOSTEN, at: [A + 7, 1.5, -24] },
    { type: 'klotz', at: [XR + 4.3, -0.5, -44.5], size: [3.4, 1, 3.4], deko: true },
    { type: 'deko', form: 'lukas', at: [XR + 4.3, 0, -44.5], yaw: 150 },
    { type: 'deko', form: 'lolli', at: [XR - 2.05, 0.8, -35], scale: 0.7 },
    { type: 'deko', form: 'lolli', at: [XR + 2.05, 0.8, -35], scale: 0.7, farbe: 0x29B6F6 },
    { type: 'deko', form: 'ballons', at: [XR + 1.4, OBEN + 0.8, -59.5], scale: 0.8, farbe: 0x8E24AA },
    { type: 'klotz', at: [XR - 15, -4.5, -74], size: [4.4, 9, 4.4], look: 'zelt-rot', deko: true }, // Sockel des Rutschturms
    { type: 'deko', form: 'turm', at: [XR - 15, 0, -74], scale: 1.05 },
    { type: 'deko', form: 'popcorn', at: [5, UNTEN, -92.4], fest: true },
    { type: 'deko', form: 'zuckerwatte', at: [-5, UNTEN, -92.6], fest: true },
    { type: 'klotz', at: [0, UNTEN - 0.5, -100.2], size: [12, 1, 12], deko: true },
    { type: 'deko', form: 'zelt', at: [0, UNTEN, -100.2], yaw: 180 },
    { type: 'deko', form: 'herz', at: [-7.2, UNTEN + 1.2, -86], yaw: -90, scale: 0.9 }
  ]
};
