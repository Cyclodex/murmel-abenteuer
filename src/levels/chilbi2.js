// Chilbi 2: Riesenrad. Putschauto-Ballett in der Arena ohne Bande: drei Autos fahren je eine eigene Schleife über die ganze
// Arena (Rahmen rot, schnell und andersherum, Raute blau und gemächlich, schiefes Viereck gelb), jedes mit eigenem Tempo und
// Halten verschieden lang an den Ecken. Alle drei Schleifen dauern gleich lang: Das Ballett wiederholt sich alle 16.4 s, aber
// nicht in gleichmässigen Schlägen. Sicher ist nur die Insel am Mast in der Mitte: vom Tor zur Insel, um den Mast herum und
// hinüber zum Steg, jedes Mal, wenn eine Lücke im Verkehr ist. Auf dem schmalen Steg ohne Rand schwenkt ein Arm des
// Kettenkarussells darüber (hält verschieden lang quer und zur Seite). Hau den Lukas als Doppelhammer: zwei Hämmer von
// beiden Seiten mit unregelmässigen Schlägen; zwischen ihnen warten. Das Riesenrad (hält mal kurz, mal lang) trägt die
// Murmel hinauf, oben geht es auf einen schmalen Hochsteg ohne Rand, im Zickzack zum Rutschturm und hinunter vors
// Zirkuszelt. Wer eine Gondel weiter fährt, findet links den Bonusstern und eine schmale Rampe ohne Rand hinunter.
const A = 4.5;                                   // Arena: Mitte quer
const XR = A + 4.5;                              // rechts wird gequert, dort geht es hinaus
const RAD = [XR, 0, -56], RR = 5;                // Riesenrad: Einstieg (unterste Gondel) und Radius
const SX = RR * Math.sin(Math.PI / 3);           // so weit seitlich halten die Gondeln auf halber Höhe
const OBEN = 2 * RR, HALB = 1.5 * RR, UNTEN = 5; // Höhe oben, des Bonus-Stegs, des Platzes am Ende
// Putschauto: fährt quer über die ganze Arena bis an die Kante (3.4 m lang, 2.4 m breit)
const AUTO = { type: 'schieber', form: 'putschauto', size: [2.4, 1.4, 3.4] };
const MAST = [A, -14];                           // Insel in der Mitte der Arena
const PFOSTEN = { type: 'klotz', size: [0.6, 3, 0.6], look: 'pfosten', deko: true };
const STEG = 1.5;                                // Breite des Hochstegs

export default {
  id: 'c2', name: 'Riesenrad', emoji: '🎡', theme: 'chilbi',
  start: [0, 0, 2], killY: -8,
  parts: [
    // Start auf dem Holzsteg, durch den Torbogen in die Arena
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -4], width: 4, walls: 0.8, caps: 'start' },
    { type: 'deko', form: 'torbogen', at: [0, 0, -3.8] },

    // Putschauto-Arena ohne Bande: drei Autos fahren je eine eigene Schleife über die ganze Arena, in der Mitte ein Mast
    // (Schleifen und Versatz so, dass sich die Autos nie überlappen und die Insel um den Mast frei bleibt)
    { type: 'klotz', at: [A, -0.5, -14], size: [18, 1, 20] },
    { type: 'klotz', at: [MAST[0], 1.5, MAST[1]], size: [0.8, 3, 0.8], look: 'pfosten' },
    { type: 'deko', form: 'ballons', at: [MAST[0], 3, MAST[1]], scale: 0.7 },
    { ...AUTO, pfad: [[-2.6, -6], [11.6, -6], [11.6, -22], [-2.6, -22]], speed: [5, 4, 5, 4], pause: [0.2, 0.6, 0.2, 1.72], farbe: 0xE53935 },
    { ...AUTO, pfad: [[4.5, -5.6], [-2.8, -14], [4.5, -22.4], [11.8, -14]], speed: [3, 3.5, 3, 3.5], pause: [1.2, 0.3, 0.8, 0.32], offset: 2.2, farbe: 0x1E88E5 },
    { ...AUTO, pfad: [[-1.5, -8.5], [1.5, -21.5], [11.5, -19], [8.5, -6.5]], speed: [4, 3, 4.5, 3], pause: [0.4, 1.4, 0.2, 1.37], offset: 7.9, farbe: 0xFDD835 },

    // Hinaus rechts über einen schmalen Steg ohne Rand, ein Arm des Kettenkarussells schwenkt darüber (180 = zur Seite, 90 = quer)
    { type: 'weg', from: [XR, 0, -24], to: [XR, 0, -31], width: 1.6 },
    { type: 'besen', pos: [XR + 3.6, 0, -29], len: 5, h: 0.9, look: 'kette', farbe: 0x8E24AA, gasse: 100, gasseBreite: 35,
      takt: [[90, 0.6], [180, 1.6], [120, 0.3], [180, 2.6], [90, 1.2], [180, 1.0]], speed: [110, 80, 140, 90, 120, 70] },
    { type: 'weg', from: [XR, 0, -31], to: [XR, 0, -35], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [XR, 0, -33], size: [4, 3, 2] },

    // Hau den Lukas, doppelt: zwei Hämmer von beiden Seiten, im Wechsel; Steg ohne Rand
    { type: 'weg', from: [XR, 0, -35], to: [XR, 0, -50], width: 3.4 },
    { type: 'hammer', at: [XR, 0, -39], side: 1, length: 4, size: [3.2, 1.4, 1.6], up: [1.6, 0.7, 2.4, 1.0], down: [0.5, 0.4], farbe: 'rot' },
    { type: 'hammer', at: [XR, 0, -44.5], side: -1, length: 4, size: [3.2, 1.4, 1.6], up: [0.8, 1.9, 0.5, 1.4], down: [0.4, 0.6, 0.5], offset: 1.54, farbe: 'blau' },

    // Podest vor dem Riesenrad
    { type: 'weg', from: [XR, 0, -50], to: [XR, 0, -54], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [XR, 0, -52], size: [3, 3, 2] },

    // Riesenrad: unten einsteigen, rechts hinauf, nach drei Schritten oben aussteigen; hält mal kurz, mal lang
    { type: 'riesenrad', at: RAD, radius: RR, gondeln: 6, size: [3.2, 4], time: [2.2, 1.8, 2.6], pause: [2.6, 1.9, 3.4, 2.2] },

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

    // Sterne: auf dem Weg zur Insel und hinter dem Mast, zwischen den Hämmern am Rand, auf dem Weg der Gondel,
    // auf dem Hochsteg, versteckt eine Gondel weiter
    { type: 'stern', at: [1.5, 0.9, -7.7] },
    { type: 'stern', at: [MAST[0] - 1.2, 0.9, MAST[1] - 1.2] },
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
    { ...PFOSTEN, at: [A - 9, 1.5, -4] },
    { ...PFOSTEN, at: [A + 9, 1.5, -4] },
    { ...PFOSTEN, at: [A - 9, 1.5, -24] },
    { ...PFOSTEN, at: [A + 9, 1.5, -24] },
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
