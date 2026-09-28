// Aussehen der Welten: Himmel, Licht, Boden- und Wandmaterial, Untergrund (Teppich, Wiese …), Säulen, Partikel.
// Alle Texturen werden im Code gezeichnet.
//   walls   = Looks, die der Reihe nach für Wände verwendet werden
//   floor / ramp(t) = Material für Bahnen
//   look(t, name)   = eigene Looks dieser Welt (z. B. 'hecke', 'neon-blau')
//   ground(t, y)    = Untergrund unter der Bahn; darf {tick(dt)} zurückgeben
//   pillars         = Looks für Säulen unter flachen Bahnstücken (null = keine)
export const COLORS = { rot: 0xE53935, blau: 0x1E88E5, gelb: 0xFDD835, gruen: 0x43A047, orange: 0xFB8C00, lila: 0x8E24AA };
const PASTELL = { rosa: 0xF8BBD0, mint: 0xB2DFDB, hellblau: 0xBBDEFB, gelb: 0xFFF59D, lila: 0xD1C4E9, weiss: 0xFAFAFA };
const NEON = { blau: 0x00E5FF, pink: 0xFF4FD8, gruen: 0x76FF03, gelb: 0xFFEA00 };
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
const hedgeTex = THREE => dots(THREE, '#2E7D32', ['#388E3C', '#1B5E20', '#43A047', '#4CAF50'], 260, 4, 11, 5, 128);

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
    ground(t, y) { const tex = carpetTex(t.THREE); tex.repeat.set(60, 60); t.plane(tex, y); }
  },

  garten: {
    sky: 0x8FD3FF, fog: [55, 130], hemi: [0xffffff, 0x4a7a3a, 0.8],
    walls: ['hecke'],
    floor: t => t.lambert(0xffffff, { map: stoneTex(t.THREE) }),
    ramp: t => t.lambert(0xffffff, { map: woodTex(t.THREE, '#C98B4F', '#6D4220') }),
    pillars: ['stamm'],
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
    ground(t, y) { const tex = tiles(t.THREE, '#303030', '#F2F2F2', 2); tex.repeat.set(60, 60); t.plane(tex, y); }
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
  }
};

