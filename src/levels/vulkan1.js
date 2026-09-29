// Vulkan 1: Lavasteg. Profi: schmale Stege ohne Rand über der Lava, Kurve ohne Rand, Plattform, Wippe.
export default {
  id: 'v1', name: 'Lavasteg', emoji: '🔥', theme: 'vulkan',
  start: [0, 0, 2], killY: -6,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -4], width: 5, walls: 0.8, caps: 'start' },
    // Steg ohne Rand, links ein ganz schmaler Abzweig zum Bonusstern
    { type: 'weg', from: [0, 0, -4], to: [0, 0, -16], width: 2.4 },
    { type: 'weg', from: [-1.2, 0, -12], to: [-7, 0, -12], width: 1.5 },
    { type: 'kurve', at: [0, 0, -16], yaw: 0, turn: 90, radius: 4, width: 2.6 },
    { type: 'weg', from: [4, 0, -20], to: [12, 0, -20], width: 2.4 },
    { type: 'checkpoint', at: [6, 0, -20], yaw: -90, size: [2.4, 3, 2] },
    // Plattform über die Lava
    { type: 'plattform', from: [13.5, 0, -20], to: [18.5, 0, -20], yaw: -90, size: [3, 3], time: 2.2, pause: 1.8, rim: 0.2 },
    { type: 'weg', from: [20, 0, -20], to: [26, 0, -20], width: 2.4 },
    { type: 'checkpoint', at: [21.5, 0, -20], yaw: -90, size: [2.4, 3, 2] },
    // Wippe mit niedrigem Rand
    { type: 'wippe', at: [29.5, 0.608, -20], yaw: -90, size: [2.4, 7], angle: 10, rim: 0.3 },
    { type: 'weg', from: [33, 0, -20], to: [37, 0, -20], width: 2.4 },
    { type: 'kurve', at: [37, 0, -20], yaw: -90, turn: -90, radius: 4, width: 2.6 },
    { type: 'weg', from: [41, 0, -24], to: [41, 0, -34], width: 5, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [41, 0, -25.5], size: [5, 3, 2] },
    { type: 'ziel', at: [41, 0, -31] },

    { type: 'stern', at: [0, 0.9, -8] },
    { type: 'stern', at: [8, 0.9, -20] },
    { type: 'stern', at: [16, 0.9, -20] },
    { type: 'stern', at: [29.5, 1.5, -20] },
    { type: 'stern', at: [41, 0.9, -28] },
    { type: 'stern', at: [-6.3, 0.9, -12], bonus: true }
  ]
};
