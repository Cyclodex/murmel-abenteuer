// Vulkan 3 💀: Schlund des Vulkans. Schlamm mit Schieber, Kanone über den Lavasee auf eine Insel, Steg ohne Rand
// mit abstossenden und anziehenden Magneten, Spirale ohne Rand hinunter in den Krater, Dominos, Brücke mit
// Steinstampfern und Schieber, Pfütze, Looping und zum Schluss mit der Kanone hinauf auf den Kraterrand.
export default {
  id: 'v3s', schwer: 'v3', name: 'Schlund des Vulkans', emoji: '☄️', theme: 'vulkan',
  start: [0, 0, 2], killY: -6,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -4], width: 5, walls: 0.8, caps: 'start' },
    // Schlamm ohne Rand, ein Schieber stösst quer
    { type: 'weg', from: [0, 0, -4], to: [0, 0, -12], width: 3, surface: 'schlamm' },
    { type: 'schieber', from: [-3.4, 0, -7.5], to: [2.4, 0, -7.5], size: [2.4, 1.2, 1.6], time: 1, pause: 2.2, look: 'basalt-rot' },
    // Trichter in die Kanone, Schuss über den Lavasee auf die Insel
    { type: 'weg', from: [0, 0, -12], to: [0, 0, -17], width: 2.6, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.7, 0, -12], to: [-1.5, 0, -12] },
    { type: 'wand', from: [1.5, 0, -12], to: [2.7, 0, -12] },
    { type: 'kanone', at: [0, 0, -15], target: [0, 6, -33], time: 2 },
    { type: 'weg', from: [0, 6, -29], to: [0, 6, -45], width: 4, walls: 0.5, caps: 'start' },
    { type: 'checkpoint', at: [0, 6, -41], size: [4, 3, 3] },
    // Magnet-Steg ohne Rand: blau stösst ab, rot zieht in die Lava; rechts ein ganz schmaler Abzweig zum Bonusstern
    { type: 'weg', from: [0, 6, -45], to: [0, 6, -65], width: 2.4 },
    { type: 'weg', from: [1.2, 6, -49], to: [7, 6, -49], width: 1.2 },
    { type: 'magnet', at: [4, 6, -50.3], radius: 1.8, strength: -5 },
    { type: 'magnet', at: [-1.3, 6, -52], radius: 2.6, strength: -8 },
    { type: 'magnet', at: [3.4, 6, -56], radius: 3.8, strength: 8 },
    { type: 'magnet', at: [1.3, 6, -60], radius: 2.6, strength: -8 },
    { type: 'magnet', at: [-3.4, 6, -63], radius: 3.4, strength: 8 },
    // Spirale in den Krater
    { type: 'spirale', at: [0, 6, -65], yaw: 0, turn: 360, rise: -6, radius: 6, width: 3 },
    { type: 'weg', from: [0, 0, -65], to: [0, 0, -69], width: 3 },
    { type: 'checkpoint', at: [0, 0, -67], size: [3, 3, 2] },
    // Dominos
    { type: 'weg', from: [0, 0, -69], to: [0, 0, -81], width: 5, walls: 0.8 },
    { type: 'wand', from: [-2.7, 0, -69], to: [-1.5, 0, -69] },
    { type: 'wand', from: [1.5, 0, -69], to: [2.7, 0, -69] },
    { type: 'wand', from: [-2.7, 0, -81], to: [-1.2, 0, -81] },
    { type: 'wand', from: [1.2, 0, -81], to: [2.7, 0, -81] },
    { type: 'domino', from: [0, 0, -72], to: [0, 0, -78], count: 4, quer: 3 },
    // Brücke ohne Rand: Stampfer, Schieber, Stampfer
    { type: 'weg', from: [0, 0, -81], to: [0, 0, -99], width: 2.4 },
    { type: 'hammer', at: [0, 0, -85], side: 1, length: 4, size: [3, 1.4, 1.6], farbe: 'rot' },
    { type: 'schieber', from: [3.4, 0, -90], to: [-2.2, 0, -90], size: [2.2, 1.2, 1.6], time: 0.9, pause: 1.4, look: 'basalt-rot' },
    { type: 'hammer', at: [0, 0, -95], side: -1, length: 4, size: [3, 1.4, 1.6], farbe: 'orange', offset: 1.7 },
    // Pfütze wäscht den Schlamm ab, dann mit Schwung durch den Looping
    { type: 'weg', from: [0, 0, -99], to: [0, 0, -103], width: 3, walls: 0.6, surface: 'pfuetze' },
    { type: 'checkpoint', at: [0, 0, -101], size: [3, 3, 2] },
    { type: 'weg', from: [0, 0, -103], to: [0, 0, -107], width: 3, walls: 0.8 },
    { type: 'turbo', at: [0, 0, -105.5], size: [2.6, 2], speed: 13 },
    { type: 'looping', at: [0, 0, -107], yaw: 0, radius: 3, width: 3, shift: 5 },
    // Kanone hinauf auf den Kraterrand
    { type: 'weg', from: [5, 0, -107], to: [5, 0, -117], width: 4, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [5, 0, -109.5], size: [4, 3, 2] },
    { type: 'kanone', at: [5, 0, -114], target: [5, 10, -129], time: 2 },
    { type: 'weg', from: [5, 10, -128], to: [5, 10, -141], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [5, 10, -137] },

    // Lavasee, Kraterboden und Kraterrand
    { type: 'deko', form: 'vulkanstein', at: [-7, -7, -24], scale: 2.2 },
    { type: 'deko', form: 'vulkanstein', at: [6, -7, -36], scale: 1.8, yaw: 50 },
    { type: 'klotz', at: [0, 1, -37], size: [3, 10, 3], look: 'basalt-dunkel', deko: true },
    { type: 'deko', form: 'kristall', at: [-1.5, 6, -31], scale: 0.4, farbe: 0xFF7043 },
    { type: 'deko', form: 'kristall', at: [6, 0, -65], scale: 0.8 },
    { type: 'deko', form: 'vulkanstein', at: [-6, -7, -88], scale: 2.4 },
    { type: 'deko', form: 'vulkanstein', at: [9, -7, -95], scale: 2, yaw: 20 },
    { type: 'deko', form: 'kristall', at: [2, 10, -140], scale: 0.5, farbe: 0xFF7043 },
    { type: 'deko', form: 'kristall', at: [8, 10, -140], scale: 0.5 },

    { type: 'stern', at: [0, 0.9, -8] },
    { type: 'stern', at: [0, 6.9, -40] },
    { type: 'stern', at: [0, 6.9, -56] },
    { type: 'stern', at: [12, 3.9, -65] },
    { type: 'stern', at: [0, 0.9, -79.5] },
    { type: 'stern', at: [0, 0.9, -87.8] },
    { type: 'stern', at: [2.5, 5.3, -107] },
    { type: 'stern', at: [5, 10.9, -134] },
    { type: 'stern', at: [6.5, 6.9, -49], bonus: true }
  ]
};
