// Riesige Alltagsgegenstände aus einfachen Formen (three.js), damit die Murmel wirklich in der Küche,
// im Garten, im Bad ... unterwegs ist. Massstab: Murmel = 1 m, also ist eine Tasse etwa 5 m hoch.
//   PROPS[form](T, opts) -> THREE.Group, steht auf y = 0, Mitte bei x = z = 0
//   PROP_SIZE[form]      -> ungefähre Grösse [b, h, t] für einen Kollisions-Klotz (deko mit fest:true)
// opts.farbe überschreibt die Hauptfarbe.

const mat = (T, color, extra = {}) => new T.MeshPhongMaterial({ color, shininess: 40, ...extra });
const mesh = (T, geo, m, x = 0, y = 0, z = 0) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; return o; };
const group = (T, ...kids) => { const g = new T.Group(); kids.forEach(k => g.add(k)); return g; };
const cyl = (T, rt, rb, h, n = 24, ...rest) => new T.CylinderGeometry(rt, rb, h, n, ...rest);

export const PROP_SIZE = {
  apfel: [4, 4, 4], orange: [3.6, 3.6, 3.6], tomate: [3, 2.6, 3], tasse: [5, 5, 4], teekanne: [7, 6, 5], toaster: [6, 4.1, 3.5],
  loeffel: [2.4, 0.6, 12], teller: [9, 0.6, 9], glas: [3.4, 6, 3.4], milch: [3.5, 7, 3.5], kaese: [4, 2.4, 4], salz: [1.6, 3.6, 1.6],
  flasche: [2.4, 7, 2.4], ente: [4, 4, 4.4], zahnbuerste: [1, 1, 11], becher: [3, 4, 3], seife: [4, 1.4, 2.6], shampoo: [2.6, 6, 1.8],
  blume: [3, 6, 3], zwerg: [3, 6, 3], giesskanne: [7, 5, 3], eimer: [4, 4, 4], schaufel: [1.6, 0.5, 9], burg: [9, 7, 9], baum: [6, 12, 6],
  pilz: [3, 3, 3], stein: [4, 2.4, 3.4], teddy: [5, 6, 4], wuerfel: [3, 3, 3], auto: [3.6, 2.4, 6], kreisel: [3, 3.2, 3],
  fisch: [2, 2.4, 5], muschel: [4, 1.6, 4], anker: [5, 6, 1], truhe: [5, 4, 3.4], seestern: [4, 0.6, 4], koralle: [3, 5, 3],
  rakete: [3, 10, 3], satellit: [8, 3, 3], ufo: [6, 2.4, 6], kristall: [2.4, 5, 2.4], vulkanstein: [4, 3, 4]
};

export const PROPS = {
  // ---------- Küche ----------
  apfel(T, o) {
    const m = mat(T, o.farbe ?? 0xE53935, { shininess: 90 });
    return group(T, mesh(T, new T.SphereGeometry(2, 24, 18), m, 0, 2, 0), mesh(T, cyl(T, 0.12, 0.15, 1), mat(T, 0x6D4C41), 0, 4.2, 0),
      mesh(T, new T.SphereGeometry(0.5, 10, 6).scale(1.4, 0.3, 0.7), mat(T, 0x43A047), 0.5, 4.3, 0));
  },
  orange(T, o) { return group(T, mesh(T, new T.SphereGeometry(1.8, 24, 18), mat(T, o.farbe ?? 0xFB8C00, { shininess: 20 }), 0, 1.8, 0), mesh(T, new T.SphereGeometry(0.2, 8, 6), mat(T, 0x558B2F), 0, 3.6, 0)); },
  tomate(T, o) { return group(T, mesh(T, new T.SphereGeometry(1.5, 22, 16).scale(1, 0.85, 1), mat(T, o.farbe ?? 0xD32F2F, { shininess: 100 }), 0, 1.3, 0), mesh(T, cyl(T, 0.6, 0.6, 0.15, 5), mat(T, 0x388E3C), 0, 2.55, 0)); },
  tasse(T, o) {
    const m = mat(T, o.farbe ?? 0xFFFFFF, { shininess: 80, side: T.DoubleSide });
    const handle = mesh(T, new T.TorusGeometry(1.3, 0.3, 10, 20, Math.PI), m, 2.3, 2.6, 0); handle.rotation.z = -Math.PI / 2;
    return group(T, mesh(T, cyl(T, 2.2, 1.9, 5, 28, 1, true), m, 0, 2.5, 0), mesh(T, cyl(T, 1.9, 1.9, 0.2), m, 0, 0.1, 0),
      mesh(T, cyl(T, 2.05, 2.05, 0.1), mat(T, 0x5D4037), 0, 4.3, 0), handle);
  },
  teekanne(T, o) {
    const m = mat(T, o.farbe ?? 0x4FC3F7, { shininess: 90 });
    const spout = mesh(T, cyl(T, 0.3, 0.6, 3, 12), m, 3, 3, 0); spout.rotation.z = -0.9;
    const handle = mesh(T, new T.TorusGeometry(1.2, 0.3, 10, 20, Math.PI), m, -2.6, 3, 0); handle.rotation.z = Math.PI / 2;
    return group(T, mesh(T, new T.SphereGeometry(2.8, 24, 18).scale(1, 0.85, 1), m, 0, 2.5, 0), mesh(T, new T.SphereGeometry(0.4, 10, 8), m, 0, 5.1, 0), spout, handle);
  },
  toaster(T, o) {
    const m = mat(T, o.farbe ?? 0xC0C6CF, { shininess: 140, specular: 0xffffff });
    const g = group(T, mesh(T, new T.BoxGeometry(6, 4, 3.4), m, 0, 2, 0));
    for (const x of [-1.3, 1.3]) g.add(mesh(T, new T.BoxGeometry(2, 0.1, 0.6), mat(T, 0x222222), x, 4.02, 0));
    g.add(mesh(T, new T.BoxGeometry(0.3, 0.8, 0.4), mat(T, 0x222222), 3.1, 2.6, 0));
    return g;
  },
  loeffel(T, o) {
    const m = mat(T, o.farbe ?? 0xD7DCE2, { shininess: 150, specular: 0xffffff });
    return group(T, mesh(T, new T.SphereGeometry(1.2, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2).scale(1, 0.4, 1.5), m, 0, 0.5, -4), mesh(T, new T.BoxGeometry(0.6, 0.2, 8), m, 0, 0.3, 1.5));
  },
  teller(T, o) { const m = mat(T, o.farbe ?? 0xFAFAFA, { shininess: 80 }); return group(T, mesh(T, cyl(T, 4.5, 3, 0.6, 36), m, 0, 0.3, 0), mesh(T, cyl(T, 3, 3, 0.05, 36), mat(T, 0x90CAF9), 0, 0.62, 0)); },
  glas(T, o) { return group(T, mesh(T, cyl(T, 1.7, 1.4, 6, 24, 1, true), mat(T, o.farbe ?? 0xE3F2FD, { transparent: true, opacity: 0.4, shininess: 120, side: T.DoubleSide, depthWrite: false }), 0, 3, 0), mesh(T, cyl(T, 1.55, 1.35, 3.5, 24), mat(T, 0xFF7043, { transparent: true, opacity: 0.8 }), 0, 1.8, 0)); },
  milch(T, o) {
    const g = group(T, mesh(T, new T.BoxGeometry(3.4, 6, 3.4), mat(T, 0xFFFFFF), 0, 3, 0));
    const roof = mesh(T, new T.CylinderGeometry(0, 2.4, 1.2, 4), mat(T, o.farbe ?? 0x1E88E5), 0, 6.6, 0); roof.rotation.y = Math.PI / 4; g.add(roof);
    g.add(mesh(T, new T.BoxGeometry(3.45, 1.4, 3.45), mat(T, o.farbe ?? 0x1E88E5), 0, 3.5, 0));
    return g;
  },
  kaese(T, o) {
    const shape = new T.Shape(); shape.moveTo(0, 0); shape.lineTo(4, 0); shape.lineTo(0, 3); shape.closePath();
    const geo = new T.ExtrudeGeometry(shape, { depth: 2.4, bevelEnabled: false }); geo.rotateX(-Math.PI / 2); geo.translate(-1.3, 0, 1);
    return group(T, mesh(T, geo, mat(T, o.farbe ?? 0xFFCA28)));
  },
  salz(T, o) { return group(T, mesh(T, cyl(T, 0.8, 0.8, 3, 16), mat(T, 0xFFFFFF, { transparent: true, opacity: 0.8 }), 0, 1.5, 0), mesh(T, new T.SphereGeometry(0.8, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(T, o.farbe ?? 0xB0BEC5, { shininess: 120 }), 0, 3, 0)); },
  flasche(T, o) { const m = mat(T, o.farbe ?? 0x66BB6A, { transparent: true, opacity: 0.75, shininess: 120 }); return group(T, mesh(T, cyl(T, 1.2, 1.2, 4.5, 20), m, 0, 2.25, 0), mesh(T, cyl(T, 0.45, 1.2, 1.5, 20), m, 0, 5.25, 0), mesh(T, cyl(T, 0.45, 0.45, 1, 16), m, 0, 6.5, 0)); },

  // ---------- Bad ----------
  ente(T, o) {
    const y = mat(T, o.farbe ?? 0xFFD600, { shininess: 70 });
    const beak = mesh(T, new T.ConeGeometry(0.5, 1.2, 12), mat(T, 0xFF6D00), 0, 3.2, -2.2); beak.rotation.x = -Math.PI / 2;
    const g = group(T, mesh(T, new T.SphereGeometry(2, 22, 16).scale(1, 0.8, 1.2), y, 0, 1.6, 0), mesh(T, new T.SphereGeometry(1.2, 20, 14), y, 0, 3.3, -1), beak);
    for (const x of [-0.5, 0.5]) g.add(mesh(T, new T.SphereGeometry(0.18, 8, 6), mat(T, 0x111111), x, 3.7, -2));
    return g;
  },
  zahnbuerste(T, o) {
    const g = group(T, mesh(T, new T.BoxGeometry(0.8, 0.5, 9), mat(T, o.farbe ?? 0x29B6F6, { shininess: 80 }), 0, 0.25, 1));
    const bristle = mat(T, 0xFFFFFF);
    for (let i = 0; i < 5; i++) g.add(mesh(T, new T.BoxGeometry(0.7, 0.8, 0.3), bristle, 0, 0.9, -3.2 - i * 0.35));
    return g;
  },
  becher(T, o) { return group(T, mesh(T, cyl(T, 1.5, 1.3, 4, 20, 1, true), mat(T, o.farbe ?? 0x80CBC4, { side: T.DoubleSide }), 0, 2, 0), mesh(T, cyl(T, 0.15, 0.15, 5, 8), mat(T, 0xEC407A), 0.4, 3.4, 0)); },
  seife(T, o) { return group(T, mesh(T, new T.BoxGeometry(4, 1.4, 2.6), mat(T, o.farbe ?? 0xF48FB1, { shininess: 90 }), 0, 0.7, 0)); },
  shampoo(T, o) { return group(T, mesh(T, new T.BoxGeometry(2.6, 5, 1.8), mat(T, o.farbe ?? 0xAB47BC, { shininess: 90 }), 0, 2.5, 0), mesh(T, cyl(T, 0.6, 0.6, 1, 12), mat(T, 0xFFFFFF), 0, 5.5, 0)); },

  // ---------- Garten ----------
  blume(T, o) {
    const g = group(T, mesh(T, cyl(T, 0.15, 0.15, 5, 8), mat(T, 0x388E3C), 0, 2.5, 0), mesh(T, new T.SphereGeometry(0.6, 12, 8), mat(T, 0xFFD54F), 0, 5.2, 0));
    const p = mat(T, o.farbe ?? 0xFF5A8A);
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; g.add(mesh(T, new T.SphereGeometry(0.6, 10, 6).scale(1.2, 0.4, 0.8), p, Math.cos(a) * 1.1, 5.1, Math.sin(a) * 1.1)); }
    return g;
  },
  zwerg(T, o) {
    return group(T, mesh(T, cyl(T, 1, 1.4, 2.6, 16), mat(T, o.farbe ?? 0x1E88E5), 0, 1.3, 0), mesh(T, new T.SphereGeometry(0.9, 16, 12), mat(T, 0xFFCCBC), 0, 3.2, 0),
      mesh(T, new T.ConeGeometry(0.8, 1.6, 12), mat(T, 0xFFFFFF), 0, 2.6, -0.6), mesh(T, new T.ConeGeometry(1, 2.2, 16), mat(T, 0xE53935), 0, 4.8, 0));
  },
  giesskanne(T, o) {
    const m = mat(T, o.farbe ?? 0x43A047, { shininess: 60 });
    const spout = mesh(T, cyl(T, 0.25, 0.5, 4, 10), m, 3.2, 3, 0); spout.rotation.z = -0.8;
    const handle = mesh(T, new T.TorusGeometry(1.4, 0.25, 8, 20, Math.PI), m, -0.3, 4, 0);
    return group(T, mesh(T, cyl(T, 1.8, 1.8, 4, 22), m, 0, 2, 0), spout, handle);
  },
  eimer(T, o) { const m = mat(T, o.farbe ?? 0x1E88E5, { side: T.DoubleSide }); const h = mesh(T, new T.TorusGeometry(1.9, 0.08, 6, 24, Math.PI), mat(T, 0x333333), 0, 4, 0); return group(T, mesh(T, cyl(T, 2, 1.5, 4, 22, 1, true), m, 0, 2, 0), mesh(T, cyl(T, 1.5, 1.5, 0.1, 22), m, 0, 0.05, 0), h); },
  schaufel(T, o) { const m = mat(T, o.farbe ?? 0xFDD835); return group(T, mesh(T, new T.BoxGeometry(2.4, 0.2, 3), m, 0, 0.2, -3), mesh(T, new T.BoxGeometry(0.5, 0.4, 6), m, 0, 0.25, 1.5)); },
  burg(T, o) {
    const s = mat(T, o.farbe ?? 0xE6C27A), g = group(T, mesh(T, new T.BoxGeometry(7, 3.5, 7), s, 0, 1.75, 0));
    for (const [x, z] of [[-3.5, -3.5], [3.5, -3.5], [-3.5, 3.5], [3.5, 3.5]]) {
      g.add(mesh(T, cyl(T, 1.1, 1.3, 5, 14), s, x, 2.5, z));
      g.add(mesh(T, new T.ConeGeometry(1.3, 2, 14), s, x, 6, z));
    }
    g.add(mesh(T, cyl(T, 0.05, 0.05, 2, 6), mat(T, 0x6D4C41), 0, 4.5, 0));
    g.add(mesh(T, new T.BoxGeometry(1.2, 0.7, 0.05), mat(T, 0xE53935), 0.6, 5.1, 0));
    return g;
  },
  baum(T, o) { return group(T, mesh(T, cyl(T, 0.8, 1.1, 6, 12), mat(T, 0x795548), 0, 3, 0), mesh(T, new T.SphereGeometry(3.4, 18, 14), mat(T, o.farbe ?? 0x43A047), 0, 8, 0), mesh(T, new T.SphereGeometry(2.4, 16, 12), mat(T, o.farbe ?? 0x4CAF50), 1.8, 9.5, 0.8)); },
  pilz(T, o) { const g = group(T, mesh(T, cyl(T, 0.6, 0.8, 2, 12), mat(T, 0xFFF3E0), 0, 1, 0), mesh(T, new T.SphereGeometry(1.5, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(T, o.farbe ?? 0xE53935), 0, 1.9, 0)); for (let i = 0; i < 5; i++) { const a = i * 1.3; g.add(mesh(T, new T.SphereGeometry(0.22, 8, 6), mat(T, 0xFFFFFF), Math.cos(a) * 0.9, 2.9, Math.sin(a) * 0.9)); } return g; },
  stein(T, o) { const m = mesh(T, new T.DodecahedronGeometry(1.8, 0).scale(1.1, 0.7, 0.95), mat(T, o.farbe ?? 0x9E9E9E, { flatShading: true }), 0, 1.1, 0); return group(T, m); },

  // ---------- Spielzimmer ----------
  teddy(T, o) {
    const b = mat(T, o.farbe ?? 0xA1887F, { shininess: 5 }), g = group(T, mesh(T, new T.SphereGeometry(2, 18, 14), b, 0, 2, 0), mesh(T, new T.SphereGeometry(1.4, 18, 14), b, 0, 4.6, 0));
    for (const x of [-1, 1]) { g.add(mesh(T, new T.SphereGeometry(0.55, 12, 8), b, x * 1.1, 5.8, 0)); g.add(mesh(T, new T.SphereGeometry(0.7, 12, 8), b, x * 1.9, 2.6, -0.4)); g.add(mesh(T, new T.SphereGeometry(0.15, 8, 6), mat(T, 0x111111), x * 0.45, 4.9, -1.25)); }
    g.add(mesh(T, new T.SphereGeometry(0.45, 10, 8), mat(T, 0xD7CCC8), 0, 4.4, -1.3));
    return g;
  },
  wuerfel(T, o) { const g = group(T, mesh(T, new T.BoxGeometry(3, 3, 3), mat(T, o.farbe ?? 0xFFFFFF, { shininess: 60 }), 0, 1.5, 0)); const d = mat(T, 0x222222); for (const [x, y] of [[-0.8, 0.8], [0, 0], [0.8, -0.8]]) g.add(mesh(T, new T.SphereGeometry(0.25, 8, 6), d, x, 1.5 + y, -1.5)); return g; },
  auto(T, o) {
    const m = mat(T, o.farbe ?? 0xE53935, { shininess: 90 }), g = group(T, mesh(T, new T.BoxGeometry(3.4, 1.2, 6), m, 0, 1.2, 0), mesh(T, new T.BoxGeometry(2.8, 1, 3), m, 0, 2.3, 0.4));
    g.add(mesh(T, new T.BoxGeometry(2.6, 0.8, 0.1), mat(T, 0x90CAF9), 0, 2.3, -1.12));
    for (const x of [-1.7, 1.7]) for (const z of [-1.9, 1.9]) { const w = mesh(T, cyl(T, 0.7, 0.7, 0.5, 16), mat(T, 0x222222), x, 0.7, z); w.rotation.z = Math.PI / 2; g.add(w); }
    return g;
  },
  kreisel(T, o) { return group(T, mesh(T, new T.ConeGeometry(1.5, 1.5, 20).rotateX(Math.PI), mat(T, o.farbe ?? 0x8E24AA), 0, 0.75, 0), mesh(T, cyl(T, 1.5, 1.5, 0.6, 20), mat(T, 0xFDD835), 0, 1.8, 0), mesh(T, cyl(T, 0.2, 0.2, 1.2, 8), mat(T, 0x8E24AA), 0, 2.6, 0)); },

  // ---------- Unterwasser ----------
  fisch(T, o) { const m = mat(T, o.farbe ?? 0xFF9800, { shininess: 80 }); const tail = mesh(T, new T.ConeGeometry(0.9, 1.4, 4), m, 0, 1.2, 2.6); tail.rotation.x = -Math.PI / 2; return group(T, mesh(T, new T.SphereGeometry(1, 16, 12).scale(0.6, 1, 2), m, 0, 1.2, 0), tail, mesh(T, new T.SphereGeometry(0.15, 8, 6), mat(T, 0x111111), 0.5, 1.5, -1.3)); },
  muschel(T, o) { return group(T, mesh(T, new T.SphereGeometry(2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.6, 1), mat(T, o.farbe ?? 0xFFCCBC, { flatShading: true }), 0, 0, 0)); },
  anker(T, o) { const m = mat(T, o.farbe ?? 0x546E7A, { shininess: 60 }); const arc = mesh(T, new T.TorusGeometry(2, 0.3, 8, 20, Math.PI), m, 0, 1.6, 0); arc.rotation.z = Math.PI; return group(T, mesh(T, new T.BoxGeometry(0.5, 5.5, 0.5), m, 0, 2.9, 0), arc, mesh(T, new T.TorusGeometry(0.6, 0.2, 8, 16), m, 0, 6, 0), mesh(T, new T.BoxGeometry(3, 0.4, 0.4), m, 0, 4.8, 0)); },
  truhe(T, o) { const w = mat(T, o.farbe ?? 0x8D6E63), gold = mat(T, 0xFFC928, { shininess: 120 }); return group(T, mesh(T, new T.BoxGeometry(5, 2.6, 3.4), w, 0, 1.3, 0), mesh(T, cyl(T, 1.7, 1.7, 5, 16, 1, false, 0, Math.PI).rotateZ(Math.PI / 2), w, 0, 2.6, 0), mesh(T, new T.BoxGeometry(0.6, 0.8, 0.1), gold, 0, 2.3, -1.72)); },
  seestern(T, o) { const s = new T.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.8 : 2, a = i * Math.PI / 5; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(r, 0); } const geo = new T.ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: false }); geo.rotateX(-Math.PI / 2); return group(T, mesh(T, geo, mat(T, o.farbe ?? 0xFF7043))); },
  koralle(T, o) { const m = mat(T, o.farbe ?? 0xFF6F61), g = group(T); for (let i = 0; i < 5; i++) { const b = mesh(T, cyl(T, 0.2, 0.4, 3 + (i % 3), 8), m, (i - 2) * 0.5, 1.8, (i % 2) * 0.6); b.rotation.z = (i - 2) * 0.3; g.add(b); } return g; },

  // ---------- Weltraum / Vulkan ----------
  rakete(T, o) { const w = mat(T, 0xFAFAFA, { shininess: 80 }), r = mat(T, o.farbe ?? 0xE53935); const g = group(T, mesh(T, cyl(T, 1.2, 1.2, 6, 20), w, 0, 4, 0), mesh(T, new T.ConeGeometry(1.2, 2.5, 20), r, 0, 8.25, 0), mesh(T, new T.SphereGeometry(0.5, 12, 8), mat(T, 0x4FC3F7), 0, 5.5, -1.1)); for (let i = 0; i < 3; i++) { const f = mesh(T, new T.BoxGeometry(0.2, 2, 1.4), r, Math.cos(i * 2.1) * 1.3, 1.5, Math.sin(i * 2.1) * 1.3); f.rotation.y = -i * 2.1; g.add(f); } return g; },
  satellit(T, o) { const g = group(T, mesh(T, new T.BoxGeometry(2, 2, 2), mat(T, 0xFFC928, { shininess: 120 }), 0, 1.5, 0)); for (const x of [-3, 3]) g.add(mesh(T, new T.BoxGeometry(3, 0.1, 1.6), mat(T, o.farbe ?? 0x1565C0, { shininess: 120 }), x, 1.5, 0)); return g; },
  ufo(T, o) { return group(T, mesh(T, new T.SphereGeometry(3, 24, 12).scale(1, 0.3, 1), mat(T, 0xB0BEC5, { shininess: 150 }), 0, 1, 0), mesh(T, new T.SphereGeometry(1.4, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(T, o.farbe ?? 0x76FF03, { transparent: true, opacity: 0.6 }), 0, 1.5, 0)); },
  kristall(T, o) { const m = mat(T, o.farbe ?? 0xB388FF, { emissive: o.farbe ?? 0x5E35B1, emissiveIntensity: 0.4, flatShading: true, shininess: 120 }); return group(T, mesh(T, new T.OctahedronGeometry(1.2, 0).scale(1, 2, 1), m, 0, 2.4, 0), mesh(T, new T.OctahedronGeometry(0.7, 0).scale(1, 2, 1), m, 1, 1.4, 0.3)); },
  vulkanstein(T, o) { return group(T, mesh(T, new T.DodecahedronGeometry(2, 0).scale(1, 0.75, 1), mat(T, o.farbe ?? 0x3E3438, { flatShading: true }), 0, 1.4, 0)); }
};

// Gegenstand bauen (unbekannte Form: Klotz als Platzhalter)
export function buildProp(T, form, opts = {}) {
  const f = PROPS[form];
  return f ? f(T, opts) : group(T, mesh(T, new T.BoxGeometry(2, 2, 2), mat(T, 0xFF00FF), 0, 1, 0));
}
