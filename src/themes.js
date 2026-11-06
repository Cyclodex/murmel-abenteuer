// Aussehen der Welten: Himmel, Licht, Boden- und Wandmaterial, Untergrund (Teppich, Wiese …), Säulen, Partikel.
// Alle Texturen werden im Code gezeichnet.
//   walls   = Looks, die der Reihe nach für Wände verwendet werden
//   floor / ramp(t) = Material für Bahnen
//   look(t, name)   = eigene Looks dieser Welt (z. B. 'hecke', 'neon-blau')
//   ground(t, y)    = Untergrund unter der Bahn; darf {tick(dt)} zurückgeben
//   pillars         = Looks für Säulen unter flachen Bahnstücken (null = keine)
//   props           = riesige Gegenstände (src/props.js) auf dem Untergrund rund um die Bahn: [[form, farbe?], ...]
import { buildProp, PROP_SIZE } from './props.js';

export const COLORS = { rot: 0xE53935, blau: 0x1E88E5, gelb: 0xFDD835, gruen: 0x43A047, orange: 0xFB8C00, lila: 0x8E24AA };
const PASTELL = { rosa: 0xF8BBD0, mint: 0xB2DFDB, hellblau: 0xBBDEFB, gelb: 0xFFF59D, lila: 0xD1C4E9, weiss: 0xFAFAFA };
const NEON = { blau: 0x00E5FF, pink: 0xFF4FD8, gruen: 0x76FF03, gelb: 0xFFEA00 };
const BASALT = { dunkel: 0x2E2A2B, hell: 0x4A4344, rot: 0x6B2E22 };
const KORALLE = { rot: 0xFF6F61, orange: 0xFFA25C, rosa: 0xFF8FB8, lila: 0xB388FF, gelb: 0xFFD54F };

export function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

export function canvasTex(THREE, w, h, draw, repeat = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export const woodTex = (THREE, base, dark) => canvasTex(THREE, 256, 256, (x, w, h) => {
  x.fillStyle = base; x.fillRect(0, 0, w, h);
  const r = rnd(7);
  for (let i = 0; i < 60; i++) { // Maserung entlang der Bahn
    x.strokeStyle = dark; x.globalAlpha = 0.08 + r() * 0.18; x.lineWidth = 1 + r() * 2;
    const x0 = r() * w; x.beginPath(); x.moveTo(x0, 0);
    for (let y = 0; y <= h; y += 16) x.lineTo(x0 + Math.sin(y / 30 + i) * 4, y);
    x.stroke();
  }
  x.globalAlpha = 0.35; x.fillStyle = dark; x.fillRect(0, 0, w, 2); x.fillRect(0, 0, 2, h); // Brettfugen
});
const dots = (THREE, bg, fg, n, rMin, rMax, seed, size = 256) => canvasTex(THREE, size, size, (x, w, h) => {
  x.fillStyle = bg; x.fillRect(0, 0, w, h);
  const r = rnd(seed);
  for (let i = 0; i < n; i++) { x.fillStyle = fg[i % fg.length]; x.beginPath(); x.arc(r() * w, r() * h, rMin + r() * (rMax - rMin), 0, 7); x.fill(); }
});
const tiles = (THREE, a, b, n, gap = null) => canvasTex(THREE, 128, 128, (x, w, h) => {
  const s = w / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { x.fillStyle = (i + j) % 2 ? a : b; x.fillRect(i * s, j * s, s, s); }
  if (gap) { x.strokeStyle = gap; x.lineWidth = 2; for (let i = 0; i <= n; i++) { x.beginPath(); x.moveTo(i * s, 0); x.lineTo(i * s, h); x.moveTo(0, i * s); x.lineTo(w, i * s); x.stroke(); } }
});
const stoneTex = THREE => canvasTex(THREE, 256, 256, (x, w, h) => {
  x.fillStyle = '#7F776B'; x.fillRect(0, 0, w, h);
  const r = rnd(11);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    const c = 150 + Math.floor(r() * 35); x.fillStyle = `rgb(${c},${c - 8},${c - 22})`;
    x.fillRect(i * 64 + 3, j * 64 + 3, 58, 58);
  }
});
const metalTex = THREE => canvasTex(THREE, 128, 128, (x, w, h) => {
  x.fillStyle = '#8C97A6'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#A7B1BE'; x.fillRect(4, 4, w - 8, h - 8);
  x.fillStyle = '#6E7887'; for (const [a, b] of [[10, 10], [w - 10, 10], [10, h - 10], [w - 10, h - 10]]) { x.beginPath(); x.arc(a, b, 4, 0, 7); x.fill(); }
  x.strokeStyle = '#7C8796'; x.lineWidth = 2; x.beginPath(); x.moveTo(w / 2, 4); x.lineTo(w / 2, h - 4); x.stroke();
});
const carpetTex = THREE => canvasTex(THREE, 256, 256, (x, w, h) => {
  x.fillStyle = '#7FB7E6'; x.fillRect(0, 0, w, h); x.fillStyle = '#9CCBF0';
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { x.beginPath(); x.arc(i * 64 + 32, j * 64 + 32, 18, 0, 7); x.fill(); }
});
// Basalt: dunkle Steinplatten mit glühenden Fugen
const basaltTex = (THREE, base, glow) => canvasTex(THREE, 256, 256, (x, w, h) => {
  x.fillStyle = glow; x.fillRect(0, 0, w, h);
  const r = rnd(19);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    const c = base + Math.floor(r() * 18); x.fillStyle = `rgb(${c},${c - 4},${c - 3})`;
    x.fillRect(i * 64 + 2 + r() * 2, j * 64 + 2 + r() * 2, 59, 59);
  }
});
// Lava: fliessende, glühende Flecken
// Dachziegel (Biberschwanz): zwei Reihen je 1 m, versetzt, unten rund
const ziegelTex = THREE => canvasTex(THREE, 128, 128, (x, w, h) => {
  const r = rnd(29);
  x.fillStyle = '#7A3323'; x.fillRect(0, 0, w, h);
  for (let row = 0; row < 2; row++) for (let k = -1; k < 2; k++) {
    const x0 = k * 64 + (row ? 32 : 0), y0 = row * 64, c = 168 + Math.floor(r() * 26);
    x.fillStyle = `rgb(${c},${Math.round(c * 0.46)},${Math.round(c * 0.33)})`;
    x.beginPath(); x.moveTo(x0 + 2, y0); x.lineTo(x0 + 62, y0); x.lineTo(x0 + 62, y0 + 40); x.arc(x0 + 32, y0 + 40, 30, 0, Math.PI); x.lineTo(x0 + 2, y0); x.fill();
  }
});
const backsteinTex = THREE => canvasTex(THREE, 128, 128, (x, w, h) => {
  const r = rnd(37);
  x.fillStyle = '#D8CFC2'; x.fillRect(0, 0, w, h);
  for (let row = 0; row < 4; row++) for (let k = -1; k < 2; k++) {
    const c = 150 + Math.floor(r() * 40);
    x.fillStyle = `rgb(${c},${Math.round(c * 0.42)},${Math.round(c * 0.3)})`;
    x.fillRect(k * 64 + (row % 2 ? 32 : 0) + 2, row * 32 + 2, 60, 28);
  }
});
const solarTex = THREE => canvasTex(THREE, 128, 128, (x, w, h) => {
  x.fillStyle = '#C7D0D8'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { x.fillStyle = (i + j) % 2 ? '#16335E' : '#1B3E70'; x.fillRect(i * 32 + 1.5, j * 32 + 1.5, 29, 29); }
});
const lavaTex = THREE => dots(THREE, '#E8480C', ['#FF7A1A', '#FFB020', '#B8290A', '#FFD54A'], 160, 6, 22, 23);
const hedgeTex = THREE => dots(THREE, '#2E7D32', ['#388E3C', '#1B5E20', '#43A047', '#4CAF50'], 260, 4, 11, 5, 128);

// Riesige Gegenstände verstreut auf dem Untergrund (unter und neben der Bahn), fest je Welt
function scatter(t, y, list, seed, n = 26) {
  if (!list || !list.length) return;
  const r = rnd(seed);
  for (let i = 0; i < n; i++) {
    const [form, farbe] = list[i % list.length], a = r() * Math.PI * 2, d = 14 + r() * 55;
    const g = buildProp(t.THREE, form, { farbe }), top = (PROP_SIZE[form] || [2, 2, 2])[1];
    // nicht durch die Bahn (meist auf y = 0 und höher) hinaufragen
    g.position.set(Math.cos(a) * d, y, Math.sin(a) * d - 25); g.rotation.y = r() * 6.3; g.scale.setScalar(Math.min(0.8 + r() * 0.6, (-1.5 - y) / top));
    t.scene.add(g);
  }
}

// Hilfen für eigene Looks
function phong(THREE, color, extra) { return new THREE.MeshPhongMaterial({ color, ...extra }); }

export const THEMES = {
  standard: {
    sky: 0x9ED8F5, fog: [40, 90],
    floor: t => t.lambert(0xE2B26F), ramp: t => t.lambert(0xF0C382), wall: 0xA8743A
  },

  spielzimmer: {
    sky: 0xFFE7C2, fog: [50, 120],
    walls: ['lego-rot', 'lego-blau', 'lego-gelb', 'lego-gruen'],
    floor: t => t.lambert(0xffffff, { map: woodTex(t.THREE, '#D9A066', '#7A4A1E') }),
    ramp: t => t.lambert(0xffffff, { map: woodTex(t.THREE, '#EBC08A', '#8A5A2A') }),
    pillars: ['klotz-rot', 'klotz-blau', 'klotz-gelb', 'klotz-gruen'],
    props: [['teddy'], ['wuerfel', 0xE53935], ['wuerfel', 0x1E88E5], ['auto'], ['auto', 0x43A047], ['kreisel'], ['teddy', 0xFFCC80]],
    ground(t, y) { const tex = carpetTex(t.THREE); tex.repeat.set(60, 60); t.plane(tex, y); scatter(t, y, THEMES.spielzimmer.props, 3); }
  },

  garten: {
    sky: 0x8FD3FF, fog: [55, 130], hemi: [0xffffff, 0x4a7a3a, 0.8],
    walls: ['hecke'],
    floor: t => t.lambert(0xffffff, { map: stoneTex(t.THREE) }),
    ramp: t => t.lambert(0xffffff, { map: woodTex(t.THREE, '#C98B4F', '#6D4220') }),
    pillars: ['stamm'],
    props: [['zwerg'], ['zwerg', 0xE53935], ['giesskanne'], ['eimer'], ['eimer', 0xE53935], ['burg'], ['baum'], ['pilz'], ['blume', 0xB388FF], ['stein']],
    look(t, look) {
      if (look === 'hecke') return t.lambert(0xffffff, { map: hedgeTex(t.THREE) });
      if (look === 'stamm') return t.lambert(0x7B5230);
      return null;
    },
    ground(t, y) {
      const tex = dots(t.THREE, '#6CBF4B', ['#5EAE3F', '#7ACB57', '#5AA23A'], 500, 1, 3, 9); tex.repeat.set(50, 50);
      t.plane(tex, y);
      // Blumen
      const T = t.THREE, r = rnd(21), n = 160, geo = new T.SphereGeometry(0.35, 8, 6);
      for (const col of [0xFF5A8A, 0xFFD23F, 0xFFFFFF, 0xB388FF]) {
        const im = new T.InstancedMesh(geo, t.lambert(col), n / 4), m = new T.Matrix4();
        for (let i = 0; i < n / 4; i++) { m.makeTranslation((r() - 0.5) * 160, y + 0.3, (r() - 0.5) * 160 - 20); im.setMatrixAt(i, m); }
        t.scene.add(im);
      }
      scatter(t, y, THEMES.garten.props, 5);
    }
  },

  kueche: {
    sky: 0xFFF1DC, fog: [55, 130], hemi: [0xffffff, 0x9a8a7a, 0.85],
    walls: ['kachel-rosa', 'kachel-mint', 'kachel-hellblau', 'kachel-gelb'],
    floor: t => { const tx = tiles(t.THREE, '#F4F4F4', '#8EC8EE', 4, '#6F9CBC'); return t.lambert(0xffffff, { map: tx }); },
    ramp: t => t.lambert(0xffffff, { map: woodTex(t.THREE, '#E7C9A0', '#9A7650') }),
    pillars: ['kachel-weiss'],
    look(t, look) {
      const [k, c] = look.split('-');
      if (k === 'kachel') return phong(t.THREE, PASTELL[c] ?? PASTELL.weiss, { shininess: 90, specular: 0x444444 });
      return null;
    },
    props: [['apfel'], ['apfel', 0x7CB342], ['orange'], ['tomate'], ['tasse'], ['tasse', 0xE53935], ['teekanne'], ['toaster'], ['milch'], ['kaese'], ['salz'], ['glas'], ['teller']],
    ground(t, y) { const tex = tiles(t.THREE, '#303030', '#F2F2F2', 2); tex.repeat.set(60, 60); t.plane(tex, y); scatter(t, y, THEMES.kueche.props, 7); }
  },

  weltraum: {
    sky: 0x070B24, fog: [90, 220], hemi: [0xAFC4FF, 0x1A1030, 0.6], sun: 0.9,
    walls: ['neon-blau', 'neon-pink', 'neon-gruen', 'neon-gelb'],
    floor: t => t.lambert(0xffffff, { map: metalTex(t.THREE) }),
    ramp: t => t.lambert(0xC9D2DE),
    pillars: null,
    look(t, look) {
      const [k, c] = look.split('-');
      if (k === 'neon') return phong(t.THREE, NEON[c] ?? NEON.blau, { emissive: NEON[c] ?? NEON.blau, emissiveIntensity: 0.55, shininess: 100 });
      return null;
    },
    ground(t) {
      const T = t.THREE, r = rnd(4), n = 700, pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { // Sterne auf einer grossen Kugel
        const a = r() * Math.PI * 2, b = Math.acos(2 * r() - 1), d = 150;
        pos.set([Math.sin(b) * Math.cos(a) * d, Math.cos(b) * d, Math.sin(b) * Math.sin(a) * d], i * 3);
      }
      const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      const stars = new T.Points(geo, new T.PointsMaterial({ color: 0xffffff, size: 1.2, fog: false }));
      t.scene.add(stars);
      const planet = new T.Mesh(new T.SphereGeometry(18, 32, 20), new T.MeshLambertMaterial({ color: 0xFF9E5E, emissive: 0x401a00, fog: false }));
      planet.position.set(-70, -30, -120); t.scene.add(planet);
      const ring = new T.Mesh(new T.RingGeometry(24, 32, 48), new T.MeshBasicMaterial({ color: 0xFFD6A0, side: T.DoubleSide, transparent: true, opacity: 0.6, fog: false }));
      ring.position.copy(planet.position); ring.rotation.x = 1.2; t.scene.add(ring);
      return { tick(dt, cam) { stars.position.copy(cam.position); planet.rotation.y += dt * 0.05; } };
    }
  },

  badezimmer: {
    // Kontrast: helle Bahn (Fliesen) über dunklem Mosaikboden, Wände in kräftigen Fliesenfarben
    sky: 0xBFE6F2, fog: [50, 130], hemi: [0xffffff, 0x6a8aa0, 0.85],
    walls: ['fliese-blau', 'fliese-petrol', 'fliese-blau', 'fliese-koralle'],
    floor: t => { const tx = tiles(t.THREE, '#F4FCFD', '#8FDDEA', 4, '#3E8A9A'); return t.lambert(0xffffff, { map: tx }); },
    ramp: t => t.lambert(0xffffff, { map: woodTex(t.THREE, '#E8C89A', '#8A6440') }),
    pillars: ['fliese-weiss'],
    bank: 0x78909C,
    props: [['ente'], ['ente', 0xFF8A65], ['shampoo'], ['shampoo', 0x26C6DA], ['becher'], ['seife'], ['zahnbuerste'], ['flasche', 0x80DEEA]],
    look(t, look) {
      const [k, c] = look.split('-');
      if (k === 'fliese') return phong(t.THREE, { weiss: 0xFAFAFA, blau: 0x2F8FE0, petrol: 0x00897B, koralle: 0xFF7F6E }[c] ?? 0xFAFAFA, { shininess: 110, specular: 0x555555 });
      if (k === 'spiegel') return phong(t.THREE, 0xCFE8F3, { shininess: 200, specular: 0xffffff, emissive: 0x1a2a33 });
      return null;
    },
    ground(t, y) {
      const tex = tiles(t.THREE, '#2B5D8C', '#33709F', 2, '#1C3F61'); tex.repeat.set(50, 50); t.plane(tex, y);
      // Badvorleger
      const T = t.THREE, mat = new T.Mesh(new T.PlaneGeometry(30, 18), t.lambert(0xF48FB1)); mat.rotation.x = -Math.PI / 2; mat.position.set(-20, y + 0.05, -30); t.scene.add(mat);
      scatter(t, y, THEMES.badezimmer.props, 9);
    }
  },

  vulkan: {
    sky: 0x5A2418, fog: [35, 110], hemi: [0xFFC9A8, 0x5A1A08, 0.8], sun: 0.75,
    walls: ['basalt-dunkel', 'basalt-rot'],
    floor: t => t.lambert(0xffffff, { map: basaltTex(t.THREE, 72, '#E0561A') }),
    ramp: t => t.lambert(0xffffff, { map: basaltTex(t.THREE, 88, '#C84A16') }),
    pillars: ['basalt-dunkel'],
    look(t, look) {
      const [k, c] = look.split('-');
      if (k === 'basalt') return t.lambert(BASALT[c] ?? BASALT.dunkel);
      return null;
    },
    ground(t, y) {
      const T = t.THREE, tex = lavaTex(T); tex.repeat.set(30, 30);
      const lava = t.plane(tex, y); lava.material.dispose(); lava.material = new T.MeshBasicMaterial({ map: tex }); // leuchtet selbst
      // aufsteigende Funken
      const n = 50, r = rnd(31), im = new T.InstancedMesh(new T.OctahedronGeometry(0.12), new T.MeshBasicMaterial({ color: 0xFFB020 }), n);
      const b = Array.from({ length: n }, () => ({ x: (r() - 0.5) * 60, y: y + r() * 20, z: (r() - 0.5) * 60, sp: 1.5 + r() * 2 }));
      const m = new T.Matrix4(), p = new T.Vector3(), q = new T.Quaternion(), sc = new T.Vector3(1, 1, 1);
      t.scene.add(im);
      return {
        tick(dt, cam) {
          tex.offset.x = (tex.offset.x + dt * 0.02) % 1; tex.offset.y = (tex.offset.y + dt * 0.013) % 1;
          b.forEach((o, i) => {
            o.y += o.sp * dt; if (o.y > y + 20) o.y = y;
            p.set(cam.position.x + o.x, o.y, cam.position.z + o.z);
            im.setMatrixAt(i, m.compose(p, q, sc));
          });
          im.instanceMatrix.needsUpdate = true;
        }
      };
    }
  },

  unterwasser: {
    sky: 0x1B6CA8, fog: [18, 75], hemi: [0xBFEFFF, 0x0B3A55, 0.85], sun: 0.6,
    walls: ['koralle-rot', 'koralle-orange', 'koralle-rosa', 'koralle-lila', 'koralle-gelb'],
    floor: t => t.lambert(0xffffff, { map: dots(t.THREE, '#CDB47A', ['#BDA267', '#DAC48F', '#B39A62'], 400, 1, 3, 13) }),
    ramp: t => t.lambert(0xffffff, { map: dots(t.THREE, '#C2A56B', ['#B0935B', '#D0B57F'], 300, 1, 3, 14) }),
    pillars: ['fels'],
    look(t, look) {
      const [k, c] = look.split('-');
      if (k === 'koralle') return phong(t.THREE, KORALLE[c] ?? KORALLE.rot, { shininess: 30, emissive: 0x220a10 });
      if (k === 'fels') return t.lambert(0x5D6B73);
      return null;
    },
    ground(t, y) {
      const tex = dots(t.THREE, '#C9B27C', ['#BBA36D', '#D6C08C'], 300, 2, 6, 17); tex.repeat.set(40, 40);
      t.plane(tex, y);
      scatter(t, y, [['muschel'], ['seestern'], ['anker'], ['truhe'], ['koralle'], ['koralle', 0xB388FF], ['fisch']], 11);
      // aufsteigende Blasen
      const T = t.THREE, n = 60, r = rnd(8), im = new T.InstancedMesh(new T.SphereGeometry(0.18, 8, 6),
        new T.MeshPhongMaterial({ color: 0xDFF6FF, transparent: true, opacity: 0.6, shininess: 120 }), n);
      const b = Array.from({ length: n }, () => ({ x: (r() - 0.5) * 60, y: y + r() * 25, z: (r() - 0.5) * 60, s: 0.5 + r() * 1.2, sp: 1 + r() * 1.5 }));
      const m = new T.Matrix4(), sc = new T.Vector3(), q = new T.Quaternion(), p = new T.Vector3();
      t.scene.add(im);
      return {
        tick(dt, cam) {
          b.forEach((o, i) => {
            o.y += o.sp * dt; if (o.y > y + 25) o.y = y;
            p.set(cam.position.x + o.x, o.y, cam.position.z + o.z); sc.setScalar(o.s);
            im.setMatrixAt(i, m.compose(p, q, sc));
          });
          im.instanceMatrix.needsUpdate = true;
        }
      };
    }
  },

  // Dach: echte Kulisse statt Gegenständen im Leeren. Das Level liegt auf dem Dach eines Hauses (Masse in level.haus),
  // darunter der Garten, ringsum Nachbarhäuser, Bäume und Wolken.
  dach: {
    sky: 0x9FD4F7, fog: [80, 190], hemi: [0xffffff, 0x6f8f5a, 0.85],
    walls: ['zink'],
    floor: t => t.lambert(0xffffff, { map: woodTex(t.THREE, '#C9A06A', '#7A5530') }),
    ramp: t => t.lambert(0xffffff, { map: woodTex(t.THREE, '#C9A06A', '#7A5530') }),
    pillars: null,
    look(t, look) {
      const T = t.THREE;
      if (look === 'ziegel') return t.lambert(0xffffff, { map: ziegelTex(T) });
      if (look === 'backstein') return t.lambert(0xffffff, { map: backsteinTex(T) });
      if (look === 'putz') return t.lambert(0xF4EFE6);
      if (look === 'zink') return phong(T, 0x8E9AA3, { shininess: 110, specular: 0x666666 });
      if (look === 'fenster') return phong(T, 0x7FB4E6, { shininess: 160, specular: 0xffffff, emissive: 0x10202c });
      if (look === 'solar') return phong(T, 0xffffff, { map: solarTex(T), shininess: 180, specular: 0xBFD8FF });
      return null;
    },
    ground(t, y) {
      const T = t.THREE, r = rnd(41);
      const gras = dots(T, '#6CBF4B', ['#5EAE3F', '#7ACB57', '#5AA23A'], 500, 1, 3, 9); gras.repeat.set(50, 50);
      t.plane(gras, y);
      const box = (sx, sy, sz, m, x, yy, z) => { const o = new T.Mesh(new T.BoxGeometry(sx, sy, sz), m); o.position.set(x, yy, z); t.scene.add(o); return o; };
      const putz = t.lambert(0xF4EFE6), glas = THEMES.dach.look(t, 'fenster'), weiss = t.lambert(0xffffff), holz = t.lambert(0x7A5530);
      // Ziegelfläche in beliebiger Grösse (Textur so oft wiederholt, dass ein Ziegel 1 m breit bleibt)
      const ziegel = (b, l) => { const tx = ziegelTex(T); tx.repeat.set(b / 2, l / 2); return t.lambert(0xffffff, { map: tx }); };
      // Giebeldach als Prisma: Dreieck (Breite b, Höhe h) quer, Länge l entlang x
      const prisma = (b, h, l, m) => {
        const s = new T.Shape(); s.moveTo(-b / 2, 0); s.lineTo(b / 2, 0); s.lineTo(0, h); s.lineTo(-b / 2, 0);
        const g = new T.ExtrudeGeometry(s, { depth: l, bevelEnabled: false }); g.translate(0, 0, -l / 2);
        const o = new T.Mesh(g, m); o.rotation.y = Math.PI / 2; return o;
      };

      // ----- das Haus unter dem Level -----
      const h = t.level && t.level.haus;
      if (h) {
        const [x0, x1] = h.x, [zf, zb] = h.z, n = h.neigung ?? 0.5, tief = (zb - zf) / 2, mx = (x0 + x1) / 2, mz = (zf + zb) / 2, b = x1 - x0;
        const yTop = -1.3 - n * (h.first - zf); // Oberkante der Mauern: knapp unter den Ziegeln an der Traufe
        box(b, yTop - y, zb - zf, putz, mx, (yTop + y) / 2, mz);
        const giebel = prisma(zb - zf, n * tief, b, putz); giebel.position.set(mx, yTop, mz); giebel.rotation.y = -Math.PI / 2; t.scene.add(giebel);
        // hintere Dachfläche (die vordere ist das Level): vom First hinunter bis über die Rückwand
        const L = Math.hypot(tief + 0.8, n * (tief + 0.8)), hinten = box(b + 1.2, 0.8, L, ziegel(b + 1.2, L), mx, 0, 0);
        hinten.rotation.x = Math.atan(n);
        hinten.position.set(mx, -n * (tief + 0.8) / 2 - 0.45, h.first + (tief + 0.8) / 2);
        // Pfosten unter dem Holzdeck
        for (const px of [-2.2, 2.2]) box(0.5, n * (5.5 - h.first) - 0.9, 0.5, holz, px, -(n * (5.5 - h.first) + 0.9) / 2, 5.5);
        // Fenster und Tür vorne, Fenster an der Seite
        const fenster = (x, yy, z, quer) => { box(quer ? 0.1 : 4.6, 5.1, quer ? 4.6 : 0.1, weiss, x, yy, z); box(quer ? 0.2 : 4, 4.5, quer ? 4 : 0.2, glas, x, yy, z); };
        for (const fx of [x0 + 4, x1 - 4]) fenster(fx, y + 8, zf - 0.03);
        box(3.6, 7.6, 0.2, t.lambert(0x8D4B2D), mx, y + 3.8, zf - 0.05);
        for (const fz of [zf + 8, zb - 8]) { fenster(x1 + 0.03, y + 8, fz, true); fenster(x0 - 0.03, y + 8, fz, true); }
        // Gartenweg von der Tür zur Hecke
        const platten = tiles(T, '#C9C4BA', '#B8B2A6', 2, '#8F897D'); platten.repeat.set(2, 9);
        const weg = new T.Mesh(new T.PlaneGeometry(4, 22), t.lambert(0xffffff, { map: platten })); weg.rotation.x = -Math.PI / 2; weg.position.set(mx, y + 0.04, zf - 11); t.scene.add(weg);
        const hecke = hedgeTex(T); hecke.repeat.set(30, 2);
        for (const s of [-1, 1]) box(34, 3.4, 2.4, t.lambert(0xffffff, { map: hecke }), mx + s * 19.5, y + 1.7, zf - 23);
      }

      // ----- Nachbarhäuser, Bäume, Blumen, Wolken -----
      for (const [x, z, b, d, hh, wand, dach, yaw] of [[-62, -8, 24, 20, 15, 0xF2E3C6, 0x8E4A38, 0.1], [66, 6, 22, 18, 13, 0xE8EEF2, 0x5C6470, -0.15],
        [-18, -84, 26, 18, 14, 0xF7D9C4, 0x9C4F3A, Math.PI / 2], [34, -88, 22, 20, 16, 0xE4EBD8, 0x6B4A3A, Math.PI / 2 + 0.1], [8, 70, 26, 20, 15, 0xF0E6D8, 0x8E4A38, Math.PI / 2]]) {
        const g = new T.Group(), body = new T.Mesh(new T.BoxGeometry(b, hh, d), t.lambert(wand)); body.position.y = hh / 2;
        const roof = prisma(d + 1.6, d * 0.42, b + 1.6, t.lambert(dach)); roof.position.y = hh;
        g.add(body, roof);
        for (const s of [-1, 1]) for (const fx of [-b / 4, b / 4]) { const f = new T.Mesh(new T.BoxGeometry(3.6, 4.2, 0.2), glas); f.position.set(fx, hh * 0.55, s * (d / 2 + 0.05)); g.add(f); }
        g.position.set(x, y, z); g.rotation.y = yaw; t.scene.add(g);
      }
      for (const [x, z, s] of [[-24, -34, 1.7], [32, -44, 1.5], [-30, 8, 1.6], [36, 24, 1.8], [-44, -60, 1.5], [58, -52, 1.6], [-8, 44, 1.5]]) {
        const g = buildProp(T, 'baum'); g.position.set(x, y, z); g.scale.setScalar(s); g.rotation.y = r() * 6.3; t.scene.add(g);
      }
      const blume = new T.SphereGeometry(0.35, 8, 6);
      for (const col of [0xFF5A8A, 0xFFD23F, 0xFFFFFF, 0xB388FF]) {
        const im = new T.InstancedMesh(blume, t.lambert(col), 40), m = new T.Matrix4();
        for (let i = 0; i < 40; i++) { m.makeTranslation((r() - 0.5) * 150, y + 0.3, (r() - 0.5) * 150 - 20); im.setMatrixAt(i, m); }
        t.scene.add(im);
      }
      const wolke = new T.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0.9 }), kugel = new T.SphereGeometry(1, 12, 8), wolken = new T.Group();
      for (let i = 0; i < 7; i++) {
        const a = r() * Math.PI * 2, d = 90 + r() * 50, g = new T.Group();
        for (let k = 0; k < 4; k++) { const m = new T.Mesh(kugel, wolke); m.scale.set(9 + r() * 7, 4 + r() * 2, 6 + r() * 4); m.position.set((k - 1.5) * 9, r() * 2, r() * 4); g.add(m); }
        g.position.set(Math.cos(a) * d, 35 + r() * 25, Math.sin(a) * d - 20); wolken.add(g);
      }
      t.scene.add(wolken);
      return { tick(dt) { wolken.rotation.y += dt * 0.004; } };
    }
  }
};

