// Küche 1: Förderband. Neu: Bänder, die mitnehmen – und eines, das zurückschiebt.
export default {
  id: 'k1', name: 'Förderband', emoji: '🥫', theme: 'kueche',
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    { type: 'band', from: [0, 0, -6], to: [0, 0, -22], width: 4, walls: 0.8 },
    { type: 'kurve', at: [0, 0, -22], yaw: 0, turn: -90, radius: 5, width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [-7, 0, -27], yaw: 90, size: [4, 3, 3] },
    // dieses Band läuft zurück: dagegen rollen
    { type: 'band', from: [-19, 0, -27], to: [-5, 0, -27], width: 4, walls: 0.8, speed: 1, grip: 1 },
    { type: 'weg', from: [-19, 0, -27], to: [-27, 0, -27], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [-21, 0, -27], yaw: 90, size: [5, 3, 3] },
    // Band die Rampe hoch
    { type: 'band', from: [-27, 0, -27], to: [-37, 3, -27], width: 4, walls: 0.8 },
    { type: 'weg', from: [-37, 3, -27], to: [-47, 3, -27], width: 6 },
    { type: 'wand', from: [-37, 3, -30.2], to: [-47, 3, -30.2] },
    { type: 'wand', from: [-37, 3, -23.8], to: [-40, 3, -23.8] },
    { type: 'wand', from: [-42.5, 3, -23.8], to: [-47, 3, -23.8] },
    { type: 'wand', from: [-47, 3, -30.6], to: [-47, 3, -23.4] },
    { type: 'nische', at: [-41.25, 3, -24], yaw: 180 },
    { type: 'ziel', at: [-44.5, 3, -27] },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 0.9, -14] },
    { type: 'stern', at: [-13, 0.9, -27] },
    { type: 'stern', at: [-32, 2.4, -27] },
    { type: 'stern', at: [-39, 3.9, -27] },
    { type: 'stern', at: [-41.25, 3.9, -21.5], bonus: true }
  ]
};
