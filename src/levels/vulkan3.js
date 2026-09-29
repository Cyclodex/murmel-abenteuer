// Vulkan 3: Krater. Profi: Schlamm, Kanone auf den Kraterrand, abstossende Magnete am Steg ohne Rand,
// Spirale hinunter, Dominos, Pfütze, Looping.
export default {
  id: 'v3', name: 'Krater', emoji: '🌋', theme: 'vulkan',
  start: [0, 0, 2], killY: -6,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -4], width: 5, walls: 0.8, caps: 'start' },
    { type: 'weg', from: [0, 0, -4], to: [0, 0, -10], width: 5, walls: 0.8, surface: 'schlamm' },
    // Trichter in die Kanone
    { type: 'weg', from: [0, 0, -10], to: [0, 0, -15], width: 2.6, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.7, 0, -10], to: [-1.5, 0, -10] },
    { type: 'wand', from: [1.5, 0, -10], to: [2.7, 0, -10] },
    { type: 'kanone', at: [0, 0, -13], target: [0, 4, -30], time: 1.6 },
    // Kraterrand
    { type: 'weg', from: [0, 4, -25], to: [0, 4, -38], width: 4, walls: 0.6, caps: 'start' },
    { type: 'checkpoint', at: [0, 4, -28], size: [4, 3, 3] },
    // Steg ohne Rand mit abstossenden Magneten, rechts ein schmaler Abzweig zum Bonusstern
    { type: 'weg', from: [0, 4, -38], to: [0, 4, -50], width: 3 },
    { type: 'weg', from: [1.5, 4, -40], to: [7, 4, -40], width: 1.4 },
    { type: 'magnet', at: [-1.2, 4, -42], radius: 2.2, strength: -5 },
    { type: 'magnet', at: [1.2, 4, -47], radius: 2.2, strength: -5 },
    // Spirale in den Krater
    { type: 'spirale', at: [0, 4, -50], yaw: 0, turn: 360, rise: -4, radius: 4, width: 3, walls: 0.6 },
    { type: 'weg', from: [0, 0, -50], to: [0, 0, -54], width: 3, walls: 0.6 },
    { type: 'checkpoint', at: [0, 0, -52.5], size: [3, 3, 2] },
    // Dominos umwerfen
    { type: 'weg', from: [0, 0, -54], to: [0, 0, -66], width: 5, walls: 0.8 },
    { type: 'wand', from: [-2.7, 0, -54], to: [-1.9, 0, -54] },
    { type: 'wand', from: [1.9, 0, -54], to: [2.7, 0, -54] },
    { type: 'wand', from: [-2.7, 0, -66], to: [-1.9, 0, -66] },
    { type: 'wand', from: [1.9, 0, -66], to: [2.7, 0, -66] },
    { type: 'domino', from: [0, 0, -57], to: [0, 0, -63], count: 6, size: [3.6, 1.8, 0.3] },
    // Pfütze wäscht den Schlamm ab, dann mit Schwung durch den Looping
    { type: 'weg', from: [0, 0, -66], to: [0, 0, -70], width: 3, walls: 0.6, surface: 'pfuetze' },
    { type: 'weg', from: [0, 0, -70], to: [0, 0, -74], width: 3, walls: 0.8 },
    { type: 'turbo', at: [0, 0, -72.5], size: [2.6, 2], speed: 13 },
    { type: 'looping', at: [0, 0, -74], yaw: 0, radius: 3, width: 3, shift: 5 },
    { type: 'weg', from: [5, 0, -74], to: [5, 0, -84], width: 4, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [5, 0, -78], size: [4, 3, 2] },
    { type: 'ziel', at: [5, 0, -81] },

    { type: 'stern', at: [0, 0.9, -7] },
    { type: 'stern', at: [0, 4.9, -34] },
    { type: 'stern', at: [0, 4.9, -44.5] },
    { type: 'stern', at: [8, 2.9, -50] },
    { type: 'stern', at: [2.5, 5.3, -74] },
    { type: 'stern', at: [5, 0.9, -79.5] },
    { type: 'stern', at: [6.5, 4.9, -40], bonus: true }
  ]
};
