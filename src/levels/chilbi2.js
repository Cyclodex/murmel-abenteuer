// Chilbi 2: Riesenrad. Durch den Torbogen auf die Putschauto-Bahn: drei Autos fahren quer hin und her und schubsen
// die Murmel weg. Dann unter dem Hammer vom «Hau den Lukas» durch und unten in eine Gondel des Riesenrads: sie trägt
// die Murmel in drei Schritten nach oben (unterwegs zwei Sterne). Oben aussteigen, um den Rutschturm herum hinunter
// auf den Platz vor dem Zirkuszelt. Wer oben sitzen bleibt und eine Gondel weiter fährt, findet den Bonusstern.
const RAD = [0, 0, -42], RR = 5;                 // Riesenrad: Einstieg (unterste Gondel) und Radius
const SX = RR * Math.sin(Math.PI / 3);           // so weit seitlich halten die Gondeln auf halber Höhe
const OBEN = 2 * RR, HALB = 1.5 * RR, UNTEN = 5; // Höhe der Plattform oben, des Bonus-Stegs, des Platzes am Ende
// Putschauto: fährt quer über die Bahn und hält an beiden Enden 1.4 m vor der Bande (dort wird niemand eingeklemmt)
const AUTO = { type: 'schieber', form: 'putschauto', size: [2.4, 1.4, 3.4], time: 1.8, pause: 2.2 };
const BANDE = { type: 'wand', height: 1, look: 'pfosten' };
const PFOSTEN = { type: 'klotz', size: [0.6, 3, 0.6], look: 'pfosten' };

export default {
  id: 'c2', name: 'Riesenrad', emoji: '🎡', theme: 'chilbi',
  start: [0, 0, 2], killY: -8,
  parts: [
    // Start auf dem Holzsteg, durch den Torbogen auf die Putschauto-Bahn
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 6, walls: 0.8, caps: 'start' },
    { type: 'deko', form: 'torbogen', at: [0, 0, -5.8] },

    // Putschauto-Bahn: Boden mit Bande rundherum, drei Autos fahren quer (sie schubsen nur, hinaus fällt niemand)
    { type: 'klotz', at: [0, -0.5, -15], size: [14, 1, 18] },
    { ...BANDE, from: [-7.2, 0, -5.6], to: [-7.2, 0, -24.4] },
    { ...BANDE, from: [7.2, 0, -5.6], to: [7.2, 0, -24.4] },
    { ...BANDE, from: [-7, 0, -5.8], to: [-3.4, 0, -5.8] },
    { ...BANDE, from: [3.4, 0, -5.8], to: [7, 0, -5.8] },
    { ...BANDE, from: [-7, 0, -24.2], to: [-2.4, 0, -24.2] },
    { ...BANDE, from: [2.4, 0, -24.2], to: [7, 0, -24.2] },
    { ...AUTO, from: [-3.9, 0, -10], to: [3.9, 0, -10], yaw: -90, farbe: 0xE53935 },
    { ...AUTO, from: [3.9, 0, -15], to: [-3.9, 0, -15], yaw: 90, farbe: 0x1E88E5, offset: 2.3 },
    { ...AUTO, from: [-3.9, 0, -20], to: [3.9, 0, -20], yaw: -90, farbe: 0xFDD835, offset: 0.6 },

    // Hau den Lukas: der Hammer schlägt auf den Steg (Schlitz in der Wand für den Stiel)
    { type: 'weg', from: [0, 0, -24], to: [0, 0, -36], width: 4 },
    { type: 'wand', from: [-2.2, 0, -24], to: [-2.2, 0, -36] },
    { type: 'wand', from: [2.2, 0, -24], to: [2.2, 0, -30.75] },
    { type: 'wand', from: [2.2, 0, -31.25], to: [2.2, 0, -36] },
    { type: 'checkpoint', at: [0, 0, -26], size: [4, 3, 2] },
    { type: 'hammer', at: [0, 0, -31], side: 1, length: 4, size: [3.2, 1.4, 1.6], up: 2, farbe: 'rot' },

    // Schmaler Steg zum Einstieg des Riesenrads
    { type: 'wand', from: [-2.4, 0, -36.2], to: [-1.7, 0, -36.2] },
    { type: 'wand', from: [1.7, 0, -36.2], to: [2.4, 0, -36.2] },
    { type: 'weg', from: [0, 0, -36], to: [0, 0, -40], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -37.5], size: [3, 3, 2] },

    // Riesenrad: unten einsteigen, rechts hinauf, nach drei Schritten oben aussteigen
    { type: 'riesenrad', at: RAD, radius: RR, gondeln: 6, size: [3.2, 4] },

    // Oben: Plattform mit Aussicht, wird zur Rutsche hin schmaler
    { type: 'weg', from: [0, OBEN, -44], to: [0, OBEN, -52], width: 4, walls: 0.8 },
    { type: 'wand', from: [-2.2, OBEN, -49], to: [-1.3, OBEN, -52] },
    { type: 'wand', from: [2.2, OBEN, -49], to: [1.3, OBEN, -52] },
    { type: 'checkpoint', at: [0, OBEN, -46.5], size: [4, 3, 2] },
    // Rutschturm: eine Runde um den Turm hinunter, Auslauf mit hohen Wänden
    { type: 'rinne', at: [0, OBEN, -52], yaw: 0, turn: 360, radius: 5, rise: UNTEN - OBEN, r: 1.6, bogen: 75, farbe: 0xFDD835 },
    { type: 'weg', from: [0, UNTEN, -52], to: [0, UNTEN, -60], width: 4, walls: 1.2 },

    // Versteckt: eine Gondel weiter (links, etwas tiefer) liegt ein Steg mit dem Bonusstern, von dort eine Rampe zum Platz
    { type: 'weg', from: [-SX, HALB, -44], to: [-SX, HALB, -50], width: 3, walls: 0.8 },
    { type: 'weg', from: [-SX, HALB, -50], to: [-SX, UNTEN, -60], width: 3, walls: 0.8 },

    // Platz vor dem Zirkuszelt: Ziel
    { type: 'klotz', at: [-2.2, UNTEN - 0.5, -67], size: [12, 1, 14] },
    { type: 'wand', from: [-8.4, UNTEN, -59.6], to: [-8.4, UNTEN, -74.4], height: 1.2 },
    { type: 'wand', from: [4, UNTEN, -59.6], to: [4, UNTEN, -74.4], height: 1.2 },
    { type: 'wand', from: [-8.2, UNTEN, -74.2], to: [3.8, UNTEN, -74.2], height: 1.2 },
    { type: 'wand', from: [-8.2, UNTEN, -59.8], to: [-SX - 1.9, UNTEN, -59.8], height: 1.2 },
    { type: 'wand', from: [2.4, UNTEN, -59.8], to: [3.8, UNTEN, -59.8], height: 1.2 },
    { type: 'ziel', at: [-2.2, UNTEN, -70] },

    // Sterne: auf der Putschauto-Bahn, unter dem Hammer, zwei auf dem Weg der Gondel nach oben, im Auslauf der Rutsche
    { type: 'stern', at: [4.5, 0.9, -12.5] },
    { type: 'stern', at: [0, 0.9, -31] },
    { type: 'stern', at: [SX, RR / 2 + 0.9, RAD[2]], r: 1.6 },
    { type: 'stern', at: [SX, HALB + 0.9, RAD[2]], r: 1.6 },
    { type: 'stern', at: [0, UNTEN + 0.9, -56] },
    { type: 'stern', at: [-SX, HALB + 0.9, -47], bonus: true },

    // Chilbi rundherum (Böden unter den Buden nur Grafik)
    { type: 'klotz', at: [-7.5, -0.5, 1], size: [8.2, 1, 8], deko: true },
    { type: 'deko', form: 'bude', at: [-7.6, 0, 1], yaw: -90 },
    { type: 'klotz', at: [5.4, -0.5, 1], size: [4, 1, 6], deko: true },
    { type: 'deko', form: 'ballons', at: [5.2, 0, 2.6] },
    { type: 'deko', form: 'zuckerwatte', at: [5.5, 0, -0.6] },
    { ...PFOSTEN, at: [-7.2, 1.5, -5.8] },
    { ...PFOSTEN, at: [7.2, 1.5, -5.8] },
    { ...PFOSTEN, at: [-7.2, 1.5, -24.2] },
    { ...PFOSTEN, at: [7.2, 1.5, -24.2] },
    { type: 'klotz', at: [-4.3, -0.5, -31], size: [3.4, 1, 3.4], deko: true },
    { type: 'deko', form: 'lukas', at: [-4.3, 0, -31], yaw: -150 },
    { type: 'deko', form: 'lolli', at: [-2.05, 0.8, -36.2], scale: 0.7 },
    { type: 'deko', form: 'lolli', at: [2.05, 0.8, -36.2], scale: 0.7, farbe: 0x29B6F6 },
    { type: 'deko', form: 'ballons', at: [2.2, OBEN + 0.8, -47.5], scale: 0.8, farbe: 0x8E24AA },
    { type: 'klotz', at: [5, -4.5, -52], size: [4.4, 9, 4.4], look: 'zelt-rot', deko: true }, // Sockel des Rutschturms bis zum Boden
    { type: 'deko', form: 'turm', at: [5, 0, -52], scale: 1.05 },
    { type: 'deko', form: 'popcorn', at: [2.3, UNTEN, -72.4], fest: true },
    { type: 'deko', form: 'zuckerwatte', at: [-7, UNTEN, -72.8], fest: true },
    { type: 'klotz', at: [-2.2, UNTEN - 0.5, -80.2], size: [12, 1, 12], deko: true },
    { type: 'deko', form: 'zelt', at: [-2.2, UNTEN, -80.2], yaw: 180 },
    { type: 'deko', form: 'herz', at: [-8.4, UNTEN + 1.2, -66], yaw: -90, scale: 0.9 }
  ]
};
