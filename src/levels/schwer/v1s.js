// Vulkan 1 💀: Glutsee. Stege ohne Rand quer über den Lavasee: Schieber stossen vom Steg, Gabelung
// (Feld mit Löchern kurz und riskant, oder Plattform und Wippe), Steinstampfer vor der einstürzenden Brücke
// (Falltüren), Stampfer-Gasse mit drei Hämmern, zwei Wippen und eine Plattform zur Zielinsel.
export default {
  id: 'v1s', schwer: 'v1', name: 'Glutsee', emoji: '🌉', theme: 'vulkan',
  start: [0, 0, 2], killY: -6,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -4], width: 5, walls: 0.8, caps: 'start' },
    // schmaler Steg, zwei Schieber stossen abwechselnd von links und rechts
    { type: 'weg', from: [0, 0, -4], to: [0, 0, -20], width: 2 },
    { type: 'schieber', from: [-3.2, 0, -8], to: [2.4, 0, -8], size: [2.2, 1.2, 1.6], time: 0.9, pause: 1.4, look: 'basalt-rot' },
    { type: 'schieber', from: [3.2, 0, -14], to: [-2.4, 0, -14], size: [2.2, 1.2, 1.6], time: 0.9, pause: 1.4, offset: 1.6, look: 'basalt-rot' },
    // Gabelung
    { type: 'weg', from: [0, 0, -20], to: [0, 0, -26], width: 16 },
    { type: 'checkpoint', at: [0, 0, -22], size: [16, 3, 4] },
    // links: Feld mit Löchern über der Lava (kurz, riskant, Bonusstern in der Sackgasse)
    {
      type: 'feld', at: [-5, 0, -26], cell: 2, map: [
        '.#.',
        '.#.',
        '##.',
        '#..',
        '#.#',
        '###',
        '..#',
        '.##',
        '.#.',
        '###'
      ]
    },
    { type: 'weg', from: [-5, 0, -46], to: [-5, 0, -50], width: 2 },
    // rechts: Plattform und Wippe (länger, sicherer)
    { type: 'weg', from: [5, 0, -26], to: [5, 0, -29], width: 2.4 },
    { type: 'plattform', from: [5, 0, -30.5], to: [5, 0, -37.5], size: [3, 3], time: 2.4, pause: 1.6, rim: 0.3 },
    { type: 'weg', from: [5, 0, -39], to: [5, 0, -41], width: 2.4 },
    { type: 'wippe', at: [5, 0.608, -44.5], size: [2.4, 7], angle: 10, rim: 0.3 },
    { type: 'weg', from: [5, 0, -48], to: [5, 0, -50], width: 2.4 },
    // Treffpunkt
    { type: 'weg', from: [0, 0, -50], to: [0, 0, -56], width: 16 },
    { type: 'checkpoint', at: [0, 0, -53], size: [16, 3, 4] },
    { type: 'kurve', at: [0, 0, -56], yaw: 0, turn: 90, radius: 4, width: 2.4 },
    // Steinstampfer vor der einstürzenden Brücke
    { type: 'weg', from: [4, 0, -60], to: [13, 0, -60], width: 2.4 },
    { type: 'hammer', at: [8.5, 0, -60], yaw: -90, side: 1, length: 4, size: [2.8, 1.4, 1.6], farbe: 'orange' },
    { type: 'falltuer', at: [14.5, 0, -60], yaw: -90, size: [2.4, 3] },
    { type: 'weg', from: [16, 0, -60], to: [17.5, 0, -60], width: 2.4 },
    { type: 'falltuer', at: [19, 0, -60], yaw: -90, size: [2.4, 3] },
    { type: 'weg', from: [20.5, 0, -60], to: [22, 0, -60], width: 2.4 },
    { type: 'falltuer', at: [23.5, 0, -60], yaw: -90, size: [2.4, 3] },
    { type: 'weg', from: [25, 0, -60], to: [31, 0, -60], width: 4 },
    { type: 'checkpoint', at: [28, 0, -60], yaw: -90, size: [4, 3, 3] },
    { type: 'kurve', at: [31, 0, -60], yaw: -90, turn: -90, radius: 4, width: 2.6 },
    // Stampfer-Gasse: drei Hämmer im Takt versetzt
    { type: 'weg', from: [35, 0, -64], to: [35, 0, -84], width: 2.2 },
    { type: 'hammer', at: [35, 0, -68], side: 1, length: 4, size: [3, 1.4, 1.6], farbe: 'rot' },
    { type: 'hammer', at: [35, 0, -74], side: -1, length: 4, size: [3, 1.4, 1.6], farbe: 'orange', offset: 1.2 },
    { type: 'hammer', at: [35, 0, -80], side: 1, length: 4, size: [3, 1.4, 1.6], farbe: 'rot', offset: 2.4 },
    { type: 'weg', from: [35, 0, -84], to: [35, 0, -88], width: 4 },
    { type: 'checkpoint', at: [35, 0, -86], size: [4, 3, 3] },
    // zwei Wippen hintereinander, dann mit der Plattform zur Zielinsel
    { type: 'wippe', at: [35, 0.608, -91.5], size: [2.4, 7], angle: 10, rim: 0.2 },
    { type: 'weg', from: [35, 0, -95], to: [35, 0, -97], width: 2 },
    { type: 'wippe', at: [35, 0.608, -100.5], size: [2.4, 7], angle: 10, rim: 0.2 },
    { type: 'weg', from: [35, 0, -104], to: [35, 0, -107], width: 2.4 },
    { type: 'checkpoint', at: [35, 0, -105.5], size: [2.4, 3, 2] },
    { type: 'plattform', from: [35, 0, -108.5], to: [35, 0, -116.5], size: [3, 3], time: 2.6, pause: 1.6, rim: 0.2 },
    { type: 'weg', from: [35, 0, -118], to: [35, 0, -128], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [35, 0, -124] },

    // Lavasee: Basaltsäulen unter den Stegen, Brocken und Kristalle
    { type: 'klotz', at: [0, -3.5, -12], size: [1, 7, 1], look: 'basalt-dunkel', deko: true },
    { type: 'klotz', at: [19, -3.5, -60], size: [1, 7, 1], look: 'basalt-dunkel', deko: true },
    { type: 'klotz', at: [35, -3.5, -96], size: [1, 7, 1], look: 'basalt-dunkel', deko: true },
    { type: 'deko', form: 'vulkanstein', at: [-6, -7, -10], scale: 1.6 },
    { type: 'deko', form: 'vulkanstein', at: [0, -7, -38], scale: 2 },
    { type: 'deko', form: 'vulkanstein', at: [22, -7, -72], scale: 2.2, yaw: 40 },
    { type: 'deko', form: 'vulkanstein', at: [44, -7, -100], scale: 1.8 },
    { type: 'deko', form: 'kristall', at: [-7, 0, -21.5], scale: 0.5 },
    { type: 'deko', form: 'kristall', at: [7, 0, -54.5], scale: 0.5, farbe: 0xFF7043 },
    { type: 'deko', form: 'kristall', at: [37.8, 0, -126], scale: 0.6 },
    { type: 'deko', form: 'kristall', at: [32.2, 0, -126], scale: 0.6, farbe: 0xFF7043 },

    { type: 'stern', at: [0, 0.9, -11] },
    { type: 'stern', at: [-5, 0.9, -29] },
    { type: 'stern', at: [1.17, 0.9, -58.83] },
    { type: 'stern', at: [8.5, 0.9, -60] },
    { type: 'stern', at: [19, 0.9, -60] },
    { type: 'stern', at: [35, 0.9, -77] },
    { type: 'stern', at: [35, 1.5, -100.5] },
    { type: 'stern', at: [35, 0.9, -112.5] },
    { type: 'stern', at: [-3, 0.9, -37], bonus: true }
  ]
};
