// Garten 3: Baumhaus. Neu: Rutschbahn als Spirale um den Stamm, Dominos (Blumentöpfe), Magnet.
export default {
  id: 'g3', name: 'Baumhaus', emoji: '🏡', theme: 'garten',
  start: [0, 10, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 10, 6], to: [0, 10, -4], width: 4, walls: 0.8, caps: 'start' },
    // Rutschbahn: 2 Runden um den Stamm, 8 m runter
    { type: 'rinne', at: [0, 10, -4], yaw: 0, turn: 720, radius: 5, rise: -8, r: 1.6, bogen: 80, farbe: 0xFFCA28 },
    { type: 'klotz', at: [5, 1, -4], size: [2.4, 20, 2.4], look: 'stamm', deko: true },
    { type: 'weg', from: [0, 2, -4], to: [0, 2, -12], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [0, 2, -8], size: [4, 3, 3] },
    // Dominos: umwerfen, um durchzukommen
    { type: 'weg', from: [0, 2, -12], to: [0, 2, -30], width: 5, walls: 0.8 },
    { type: 'domino', from: [0, 2, -16], to: [0, 2, -23.6], count: 5, quer: 3 },
    // Ziel-Weg; links eine Nische mit Magnet, der die Murmel hineinzieht
    { type: 'weg', from: [0, 2, -30], to: [0, 2, -40], width: 5 },
    { type: 'wand', from: [2.7, 2, -30], to: [2.7, 2, -40] },
    { type: 'wand', from: [-2.7, 2, -30], to: [-2.7, 2, -30.5] },
    { type: 'wand', from: [-2.7, 2, -33], to: [-2.7, 2, -40] },
    { type: 'wand', from: [-2.9, 2, -40.2], to: [2.9, 2, -40.2] },
    { type: 'nische', at: [-2.5, 2, -31.75], yaw: 90 },
    { type: 'magnet', at: [-4.8, 2, -31.75], radius: 3.2, strength: 4 },
    { type: 'ziel', at: [0, 2, -36] },

    { type: 'stern', at: [0, 10.9, 0] },
    { type: 'stern', at: [10, 8.9, -4] },
    { type: 'stern', at: [10, 4.9, -4] },
    { type: 'stern', at: [0, 2.9, -26] },
    { type: 'stern', at: [0, 2.9, -33.5] },
    { type: 'stern', at: [-5, 2.9, -31.75], bonus: true }
  ]
};
