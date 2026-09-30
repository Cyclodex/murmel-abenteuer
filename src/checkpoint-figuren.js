// Checkpoint-Grafik: Zielband quer über den Weg und eine Figur je Welt, die mit der Fahne jubelt.
// Nur Grafik: Zone, Neustartpunkt und Ereignis 'cp' stehen in elements.js (checkpoint), die Murmel rollt ungebremst durch.
//   buildCheckpoint(v, el, types) -> {tick(dt, g)}; hängt die Gruppe 'checkpoint' an v.scene.
//   userData der Gruppe: figur, zustand ('schlaf' bis erreicht, dann 'jubel', danach 'winken'), band ('ganz' | 'gerissen').
//   Neustart (el.active wieder false): Figur schläft wieder, Band ist wieder ganz.
// Figur-Koordinaten: steht auf y = 0, Gesicht nach -z (wie in props.js).
import { DEG, rotate, add, sub, scale, rightOf, toLocal, ease } from './math.js';
import { PROPS, PROP_SIZE, mat, mesh, group, cyl } from './props.js';

const R = 0.5;          // Murmel-Radius
const JUBEL = 1.8;      // s Jubel nach dem Erreichen, danach winken
const GRAU = 0xBBBBBB, GRUEN = 0x3BB273;
const FIG_R = 1.1, FIG_H = 3.2; // Platzbedarf der Figur (Radius, Höhe)
export const FIGUR_JE_WELT = { spielzimmer: 'springteufel', garten: 'zwerg', kueche: 'toaster', badezimmer: 'ente', weltraum: 'astronaut', unterwasser: 'oktopus', vulkan: 'geysir' };

const inv = (q, v) => rotate([-q[0], -q[1], -q[2], q[3]], v);

// Weg unter dem Checkpoint: Richtung und halbe Breite (sonst yaw und Breite der Zone)
export function cpRahmen(el, solids) {
  const p = add(el.at, [0, -0.05, 0]);
  for (const s of solids) {
    if (!s.track || s.deko) continue;
    const l = inv(s.quat, sub(p, s.pos));
    if (Math.abs(l[0]) <= s.half[0] + 0.01 && Math.abs(l[1]) <= s.half[1] + 0.1 && Math.abs(l[2]) <= s.half[2] + 0.01) return { yaw: s.track.yaw, halfW: s.half[0] };
  }
  return { yaw: (el.yaw || 0) * DEG, halfW: (el.size || [6, 3, 3])[0] / 2 };
}

// Platz für die Figur neben dem Weg: zuerst rechts (el.side = -1: links; gesetzt = nur diese Seite), möglichst nah am
// Band (sonst bis 5 m davor oder dahinter), nicht auf einer Bahn und ohne Klotz oder Bauteil (Stern, Plattform, Deko ...)
// im Weg. Findet sich nichts, steht sie am ersten Platz.
export function figurPlatz(el, rahmen, solids, els, types) {
  const right = rightOf(rahmen.yaw), sides = el.side ? [el.side] : [1, -1], cands = [];
  const back = [-right[2], 0, right[0]]; // lokal +z (quer zum Band)
  for (const lz of [0, -2.5, 2.5, -5, 5]) for (const d of [1.6, 2.6, 3.8]) for (const side of sides) {
    const x = side * (rahmen.halfW + d);
    cands.push({ side, x, lz, pos: add(add(el.at, scale(right, x)), scale(back, lz)) });
  }
  // zuletzt ganz nah am Rand (ohne Wände, z. B. Schiffchen in der Badewanne), dafür schlanker gerechnet
  for (const side of sides) { const x = side * (rahmen.halfW + 1.2); cands.push({ side, x, lz: 0, pos: add(el.at, scale(right, x)), eng: true }); }
  const frei = (pos, fr) => {
    for (const s of solids) for (const y of s.track ? [-0.1, 0.35, 1.2, 2.1, 3] : [0.35, 1.2, 2.1, 3]) { // Bahnen auch knapp darunter
      const l = inv(s.quat, sub(add(pos, [0, y, 0]), s.pos));
      if (Math.abs(l[0]) < s.half[0] + fr && Math.abs(l[1]) < s.half[1] && Math.abs(l[2]) < s.half[2] + fr) return false;
    }
    for (const e of els) {
      if (e === el || (types[e.type]?.solids && e.type !== 'deko')) continue; // Klötze prüft die Schleife oben
      const sz = PROP_SIZE[e.form] || [2, 2, 2], r = e.type === 'deko' ? Math.max(sz[0], sz[2]) / 2 * (e.scale ?? 1) : e.length ? e.length / 2 : 1;
      for (const p of [e.at, e.from, e.to]) {
        if (!Array.isArray(p)) continue;
        const dy = p[1] - pos[1];
        if (dy > -1.5 && dy < FIG_H + 0.5 && Math.hypot(p[0] - pos[0], p[2] - pos[2]) < fr + r) return false;
      }
    }
    return true;
  };
  const c = cands.find(c => frei(c.pos, c.eng ? 0.95 : FIG_R));
  return c ? { ...c, frei: true } : { ...cands[0], frei: false };
}

// ---------- Fahnen: alle Tücher eines Checkpoints teilen Form und Farbe ----------
function fahnen(T, tuchMat, stabMat) {
  const W = 0.8, H = 0.5, geo = new T.PlaneGeometry(W, H, 8, 2).translate(W / 2, -H / 2, 0);
  const base = Float32Array.from(geo.attributes.position.array), tuecher = [], knauf = mat(T, 0xFFC928, { shininess: 120 });
  let ph = 0;
  return {
    // Stab von y = 0 bis len, Tuch oben daran (s = Grösse des Tuchs)
    make(len = 1.6, s = 1) {
      const g = group(T, mesh(T, cyl(T, 0.04, 0.04, len, 8), stabMat, 0, len / 2, 0), mesh(T, new T.SphereGeometry(0.07, 8, 6), knauf, 0, len, 0));
      const t = mesh(T, geo, tuchMat, 0.03, len - 0.05, 0); t.scale.setScalar(s); g.add(t); tuecher.push(t);
      return g;
    },
    // Wehen: tempo, amp = Wellenhöhe, haengt = Tuch hängt schlaff am Stab (Bogenmass)
    tick(dt, tempo, amp, haengt) {
      ph += dt * tempo;
      const a = geo.attributes.position.array;
      for (let i = 0; i < a.length; i += 3) { const x = base[i]; a[i + 2] = Math.sin(x * 6 - ph) * amp * x / W; }
      geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
      for (const t of tuecher) t.rotation.z = -haengt;
    }
  };
}

// Schlafende Figur: "Z" steigen auf
function zzz(T, v, kopf) {
  const tex = v.canvasTex(64, 64, (x, w, h) => {
    x.font = 'bold 54px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.lineWidth = 8; x.strokeStyle = '#2B3A67'; x.strokeText('Z', w / 2, h / 2 + 2); x.fillStyle = '#FFFFFF'; x.fillText('Z', w / 2, h / 2 + 2);
  });
  const g = new T.Group(), zs = [0, 1, 2].map(() => new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })));
  g.add(...zs);
  return {
    g,
    tick(t) {
      zs.forEach((z, i) => {
        const p = (t * 0.45 + i / 3) % 1;
        z.position.set(kopf[0] + 0.25 + p * 0.5, kopf[1] + p * 1.3, kopf[2]);
        z.scale.setScalar(0.25 + 0.35 * p); z.material.opacity = Math.sin(p * Math.PI);
      });
    }
  };
}

// Auge: offen (1) bis zu (0)
function auge(T, r) {
  const g = group(T, mesh(T, new T.SphereGeometry(r, 12, 8), mat(T, 0xFFFFFF)), mesh(T, new T.SphereGeometry(r * 0.5, 10, 6), mat(T, 0x111111), 0, 0, -r * 0.75));
  g.auf = k => { g.scale.y = 0.12 + 0.88 * k; };
  return g;
}
const huepf = (t, dauer, hoch) => Math.abs(Math.sin(t * Math.PI / dauer)) * hoch * Math.max(0, 1 - t / JUBEL);

// ---------- Figuren: (T, F) -> {g, kopf: Ort der Zzz, sockel: Farbe, pose(zustand, t, dt)} ----------
export const FIGUREN = {
  // Gartenzwerg: döst an die Fahne gelehnt, springt auf und schwenkt sie über dem Kopf
  zwerg(T, F) {
    const koerper = mesh(T, cyl(T, 0.42, 0.58, 1.1, 16), mat(T, 0x1E88E5), 0, 0.55, 0);
    const bart = mesh(T, new T.ConeGeometry(0.3, 0.6, 12), mat(T, 0xFFFFFF), 0, 0.05, -0.26); bart.rotation.x = Math.PI;
    const kopf = group(T, mesh(T, new T.SphereGeometry(0.38, 16, 12), mat(T, 0xFFCCBC), 0, 0.3, 0), bart,
      mesh(T, new T.SphereGeometry(0.1, 8, 6), mat(T, 0xFF8A80), 0, 0.3, -0.38), mesh(T, new T.ConeGeometry(0.4, 0.95, 14), mat(T, 0xE53935), 0, 0.95, 0));
    kopf.position.y = 1.15;
    const arme = [-1, 1].map(k => {
      const a = group(T, mesh(T, cyl(T, 0.1, 0.1, 0.55, 8), mat(T, 0x1E88E5), 0, -0.27, 0), mesh(T, new T.SphereGeometry(0.13, 8, 6), mat(T, 0xFFCCBC), 0, -0.55, 0));
      a.position.set(k * 0.5, 0.95, 0); a.rotation.z = k * 0.25; return a;
    });
    const arm = arme[1], fahne = F.make(1.7); fahne.position.y = -0.25; fahne.rotation.z = Math.PI; arm.add(fahne);
    const g = group(T, koerper, kopf, ...arme);
    return {
      g, kopf: [0, 2.1, 0], sockel: 0x7CB342,
      pose(z, t) {
        if (z === 'schlaf') {
          const b = Math.sin(t * 2);
          g.position.y = 0; g.rotation.z = 0.08; koerper.scale.y = 1 + 0.03 * b;
          kopf.rotation.set(-0.4 + 0.05 * b, 0, 0.1); arm.rotation.z = 2.2 + 0.03 * b;
        } else if (z === 'jubel') {
          g.position.y = huepf(t, 0.45, 0.6); g.rotation.z = 0; koerper.scale.y = 1;
          kopf.rotation.set(0, 0, 0.15 * Math.sin(t * 12)); arm.rotation.z = 2.8 + 0.5 * Math.sin(t * 14);
        } else {
          g.position.y = 0.04 * Math.abs(Math.sin(t * 4)); g.rotation.z = 0;
          kopf.rotation.set(0, 0.2 * Math.sin(t * 1.5), 0.08 * Math.sin(t * 2)); arm.rotation.z = 2.7 + 0.35 * Math.sin(t * 4);
        }
      }
    };
  },

  // Springteufel: Kiste rappelt im Schlaf, dann springt der Kopf an der Feder heraus
  springteufel(T, F) {
    const gelb = mat(T, 0xFDD835);
    const deckel = group(T, mesh(T, new T.BoxGeometry(1.36, 0.1, 1.36), mat(T, 0x1E88E5), 0, 0.05, -0.68));
    deckel.position.set(0, 1.2, 0.68);
    const ringe = [];
    for (let i = 0; i < 7; i++) { const r = mesh(T, new T.TorusGeometry(0.22, 0.05, 6, 16), mat(T, 0xB0BEC5, { shininess: 120 })); r.rotation.x = Math.PI / 2; ringe.push(r); }
    const auge2 = [-1, 1].map(k => { const a = auge(T, 0.09); a.position.set(k * 0.15, 0.1, -0.34); return a; });
    const kopf = group(T, mesh(T, new T.SphereGeometry(0.42, 16, 12), mat(T, 0xFFE0B2)), mesh(T, new T.SphereGeometry(0.11, 10, 8), mat(T, 0xE53935), 0, -0.02, -0.42),
      ...auge2, mesh(T, new T.ConeGeometry(0.3, 0.6, 12), mat(T, 0x8E24AA), 0, 0.62, 0), mesh(T, new T.SphereGeometry(0.1, 8, 6), gelb, 0, 0.95, 0));
    const kragen = mesh(T, new T.TorusGeometry(0.32, 0.1, 6, 16), gelb, 0, -0.38, 0); kragen.rotation.x = Math.PI / 2; kopf.add(kragen);
    const fahne = F.make(1.3); fahne.position.set(0.45, -0.35, 0); fahne.rotation.z = -0.35; kopf.add(fahne);
    const teufel = group(T, ...ringe, kopf); teufel.position.y = 0.15;
    const kiste = group(T, mesh(T, new T.BoxGeometry(1.3, 1.2, 1.3), mat(T, 0xE53935), 0, 0.6, 0),
      mesh(T, new T.BoxGeometry(1.36, 0.12, 1.36), gelb, 0, 0.06, 0), mesh(T, new T.BoxGeometry(1.36, 0.12, 1.36), gelb, 0, 1.14, 0), deckel, teufel);
    const feder = gap => { ringe.forEach((r, i) => { r.position.y = i * gap; }); kopf.position.y = 6 * gap + 0.45; };
    return {
      g: kiste, kopf: [0, 1.4, 0], sockel: 0x90CAF9,
      pose(z, t) {
        if (z === 'schlaf') {
          const rappel = Math.max(0, Math.sin(t * 1.2)) ** 8;
          kiste.rotation.z = 0.06 * rappel * Math.sin(t * 25); deckel.rotation.x = 0.12 * rappel * Math.abs(Math.sin(t * 25));
          teufel.visible = false; feder(0.03);
          return;
        }
        kiste.rotation.z = 0; teufel.visible = true; auge2.forEach(a => a.auf(1));
        if (z === 'jubel') {
          deckel.rotation.x = 1.9 * Math.min(1, t / 0.12);
          feder(0.03 + 0.19 * (1 - Math.exp(-5 * t) * Math.cos(13 * t)));
          kopf.rotation.z = 0.35 * Math.sin(t * 11) * Math.exp(-1.5 * t);
        } else {
          deckel.rotation.x = 1.9; feder(0.2 + 0.02 * Math.sin(t * 5)); kopf.rotation.z = 0.2 * Math.sin(t * 3);
        }
      }
    };
  },

  // Toaster: schläft mit Fahne im Toast, dann fliegen die Toasts hoch
  toaster(T, F) {
    const toaster = PROPS.toaster(T, {}); toaster.scale.setScalar(0.33);
    const augen = [-1, 1].map(k => { const a = auge(T, 0.14); a.position.set(k * 0.35, 0.85, -0.58); return a; });
    const REST = 1.12;
    const toasts = [-1, 1].map(k => {
      const t = group(T, mesh(T, new T.BoxGeometry(0.58, 0.62, 0.12), mat(T, 0xC68642)), mesh(T, new T.BoxGeometry(0.5, 0.54, 0.125), mat(T, 0xF2D29B)));
      t.position.set(k * 0.43, REST, 0); return t;
    });
    const fahne = F.make(1.0); fahne.position.set(0.1, 0.3, 0); toasts[1].add(fahne);
    const g = group(T, toaster, ...augen, ...toasts);
    return {
      g, kopf: [0, 1.5, -0.3], sockel: 0xECEFF1,
      pose(z, t) {
        augen.forEach(a => a.auf(z === 'schlaf' ? 0 : 1));
        toaster.position.y = z === 'jubel' && t < 0.5 ? 0.1 * Math.abs(Math.sin(t * Math.PI / 0.25)) : 0;
        toasts.forEach((to, i) => {
          if (z === 'schlaf') { to.position.y = REST + 0.02 * Math.sin(t * 2 + i); to.rotation.x = 0; }
          else if (z === 'jubel') {
            const tt = Math.max(0, t - i * 0.12);
            to.position.y = REST + Math.max(0.25 * Math.min(1, tt / 0.05), 6.5 * tt * (1 - tt));
            to.rotation.x = tt < 1 ? Math.PI * 2 * ease(tt) : 0;
          } else { to.position.y = REST + 0.25 + 0.12 * Math.max(0, Math.sin(t * 4 + i * Math.PI)); to.rotation.x = 0; }
        });
      }
    };
  },

  // Quietscheente: schaukelt halb eingesunken, taucht auf, dreht sich und winkt mit dem Flügel
  ente(T, F) {
    const gelb = mat(T, 0xFFD600, { shininess: 70 });
    const schnabel = mesh(T, new T.ConeGeometry(0.18, 0.45, 12), mat(T, 0xFF6D00), 0, -0.05, -0.55); schnabel.rotation.x = -Math.PI / 2;
    const augen = [-1, 1].map(k => { const a = auge(T, 0.08); a.position.set(k * 0.2, 0.12, -0.38); return a; });
    const kopf = group(T, mesh(T, new T.SphereGeometry(0.48, 18, 14), gelb), schnabel, ...augen); kopf.position.set(0, 1.3, -0.45);
    const schwanz = mesh(T, new T.ConeGeometry(0.2, 0.5, 10), gelb, 0, 0.85, 0.9); schwanz.rotation.x = 0.9;
    const fluegel = group(T, mesh(T, new T.SphereGeometry(0.35, 12, 8).scale(0.3, 0.6, 1), gelb, 0.05, 0, 0.1));
    fluegel.position.set(0.72, 0.7, 0);
    const fahne = F.make(1.3); fahne.position.set(0.15, -0.1, 0); fahne.rotation.z = -0.3; fluegel.add(fahne);
    const ente = group(T, mesh(T, new T.SphereGeometry(0.8, 20, 14).scale(1, 0.75, 1.2), gelb, 0, 0.6, 0), kopf, schwanz, fluegel);
    const wasser = mesh(T, cyl(T, 1.0, 1.0, 0.08, 24), mat(T, 0x7FC4F5, { transparent: true, opacity: 0.75, shininess: 120 }), 0, 0.04, 0);
    return {
      g: group(T, wasser, ente), kopf: [0, 1.6, -0.45], sockel: 0xFFFFFF,
      pose(z, t) {
        augen.forEach(a => a.auf(z === 'schlaf' ? 0 : 1));
        if (z === 'schlaf') {
          ente.position.y = -0.3; ente.rotation.set(0, 0, 0.12 * Math.sin(t * 1.5)); kopf.rotation.set(-0.3, 0, 0); fluegel.rotation.z = 0;
        } else if (z === 'jubel') {
          ente.position.y = t < 0.7 ? -0.3 + 1.5 * Math.sin(Math.PI * t / 0.7) + 0.3 * t / 0.7 : 0;
          ente.rotation.set(0, Math.PI * 2 * ease(t / 0.9), 0); kopf.rotation.set(0, 0, 0); fluegel.rotation.z = 0.5 + 0.5 * Math.sin(t * 16);
        } else {
          ente.position.y = 0; ente.rotation.set(0, 0, 0.15 * Math.sin(t * 4)); kopf.rotation.set(0, 0.3 * Math.sin(t * 2), 0);
          fluegel.rotation.z = 0.4 + 0.4 * Math.sin(t * 5);
        }
      }
    };
  },

  // Astronaut: schwebt schlafend, macht einen Mondsprung mit der Fahne
  astronaut(T, F) {
    const weiss = mat(T, 0xF5F5F5, { shininess: 60 }), grau = mat(T, 0x9E9E9E);
    const helm = group(T, mesh(T, new T.SphereGeometry(0.42, 18, 14), weiss),
      mesh(T, new T.SphereGeometry(0.36, 16, 12).scale(1, 0.8, 0.7), mat(T, 0x1A237E, { shininess: 150, specular: 0xffffff, emissive: 0x0a0f40 }), 0, 0.02, -0.2));
    helm.position.y = 1.75;
    const arme = [-1, 1].map(k => {
      const a = group(T, mesh(T, cyl(T, 0.12, 0.12, 0.6, 10), weiss, 0, -0.3, 0), mesh(T, new T.SphereGeometry(0.14, 10, 8), grau, 0, -0.6, 0));
      a.position.set(k * 0.48, 1.3, 0); a.rotation.z = k * 0.3; return a;
    });
    const arm = arme[1], fahne = F.make(1.8); fahne.position.y = -0.3; fahne.rotation.z = Math.PI; arm.add(fahne);
    const astro = group(T, mesh(T, cyl(T, 0.4, 0.38, 0.8, 16), weiss, 0, 0.95, 0), mesh(T, new T.BoxGeometry(0.3, 0.2, 0.05), mat(T, 0xFF7043), 0, 1.05, -0.39),
      mesh(T, new T.BoxGeometry(0.6, 0.7, 0.3), grau, 0, 1.0, 0.45), helm, ...arme);
    for (const k of [-1, 1]) astro.add(mesh(T, cyl(T, 0.14, 0.16, 0.6, 10), weiss, k * 0.18, 0.3, 0), mesh(T, new T.BoxGeometry(0.26, 0.14, 0.36), grau, k * 0.18, 0.07, -0.05));
    return {
      g: astro, kopf: [0, 2.2, 0.4], sockel: 0x9E9E9E,
      pose(z, t) {
        if (z === 'schlaf') {
          astro.position.y = 0.6 + 0.12 * Math.sin(t * 1.2); astro.rotation.set(0.6 + 0.05 * Math.sin(t * 0.8), 0, 0);
          helm.rotation.x = -0.2; arm.rotation.z = 2.4;
        } else if (z === 'jubel') {
          astro.position.y = t < 1.5 ? 0.6 * Math.max(0, 1 - t / 0.3) + 2 * Math.sin(Math.PI * t / 1.5) : 0;
          astro.rotation.set(0.6 * Math.max(0, 1 - t / 0.3), 0, 0); helm.rotation.x = 0; arm.rotation.z = 2.9 + 0.3 * Math.sin(t * 8);
        } else {
          astro.position.y = 0.05 * Math.abs(Math.sin(t * 1.5)); astro.rotation.set(0, 0, 0);
          helm.rotation.set(0, 0.2 * Math.sin(t), 0); arm.rotation.z = 2.6 + 0.4 * Math.sin(t * 3);
        }
      }
    };
  },

  // Oktopus: Arme eingerollt, dann schnellen sie auseinander und winken mit sechs Fähnchen
  oktopus(T, F) {
    const haut = mat(T, 0xEC6FA0, { shininess: 60 });
    const augen = [-1, 1].map(k => { const a = auge(T, 0.17); a.position.set(k * 0.25, 1.4, -0.52); return a; });
    const kopf = group(T, mesh(T, new T.SphereGeometry(0.65, 20, 16).scale(1, 1.2, 1), haut, 0, 1.35, 0), ...augen);
    const arme = [];
    for (let i = 0; i < 6; i++) {
      const pivot = new T.Group(); pivot.position.y = 0.75; pivot.rotation.y = i * Math.PI / 3 + Math.PI / 6;
      let parent = pivot, x = 0.45;
      const segs = [];
      for (let k = 0; k < 3; k++) {
        const s = new T.Group(); s.position.x = x;
        const m = mesh(T, cyl(T, 0.12 - k * 0.035, 0.15 - k * 0.035, 0.42, 8).rotateZ(-Math.PI / 2), haut, 0.2, 0, 0); s.add(m);
        parent.add(s); segs.push(s); parent = s; x = 0.4;
      }
      const f = F.make(0.8, 0.6); f.position.x = 0.4; f.rotation.z = -Math.PI / 2; parent.add(f);
      kopf.add(pivot); arme.push(segs);
    }
    const g = group(T, kopf);
    return {
      g, kopf: [0, 2.3, 0], sockel: 0xF4D58D,
      pose(z, t) {
        augen.forEach(a => a.auf(z === 'schlaf' ? 0 : 1));
        kopf.position.y = z === 'jubel' ? huepf(t, 0.4, 0.3) : 0;
        kopf.scale.y = z === 'schlaf' ? 0.95 + 0.04 * Math.sin(t * 2) : 1;
        arme.forEach((segs, i) => segs.forEach((s, k) => {
          s.rotation.z = z === 'schlaf' ? -0.35 + 0.03 * Math.sin(t * 2 + i)
            : z === 'jubel' ? -0.35 + 0.8 * (1 - Math.exp(-5 * t) * Math.cos(10 * t)) + 0.25 * Math.sin(t * 10 + i)
            : 0.3 + 0.25 * Math.sin(t * 3 + i + k * 0.6);
        }));
      }
    };
  },

  // Geysir: raucht im Schlaf ein wenig, dann schiesst die Dampfsäule die Fahne hoch, sie landet auf der Spitze
  geysir(T, F) {
    const stein = mat(T, 0x3E3438, { flatShading: true });
    const augen = [-1, 1].map(k => { const a = auge(T, 0.12); a.position.set(k * 0.22, 0.85, -0.57); return a; });
    const flug = group(T, F.make(1.6)); flug.position.y = 0.9;
    const puffGeo = new T.SphereGeometry(0.25, 10, 8), puffs = [];
    for (let i = 0; i < 12; i++) {
      const m = new T.Mesh(puffGeo, new T.MeshLambertMaterial({ color: 0xEEEEEE, transparent: true, opacity: 0, depthWrite: false }));
      m.visible = false; puffs.push({ m, age: 1, life: 1, vy: 0, dx: 0, dz: 0, size: 1 });
    }
    const g = group(T, mesh(T, cyl(T, 0.35, 1.0, 1.3, 9), stein, 0, 0.65, 0), mesh(T, cyl(T, 0.3, 0.3, 0.05, 12), mat(T, 0xFF7A1A, { emissive: 0xFF4500, emissiveIntensity: 0.8 }), 0, 1.31, 0),
      mesh(T, new T.DodecahedronGeometry(0.3, 0), stein, 0.8, 0.15, 0.3), mesh(T, new T.DodecahedronGeometry(0.22, 0), stein, -0.7, 0.1, 0.5), ...augen, flug, ...puffs.map(p => p.m));
    let next = 0, n = 0;
    const puff = (vy, life, size) => {
      const p = puffs[n++ % puffs.length];
      Object.assign(p, { age: 0, life, vy, size, dx: (Math.sin(n * 2.3)) * 0.3, dz: Math.cos(n * 1.7) * 0.3 });
    };
    return {
      g, kopf: [0, 1.7, 0], sockel: 0x2E2A2B,
      pose(z, t, dt) {
        augen.forEach(a => a.auf(z === 'schlaf' ? 0 : 1));
        next -= dt;
        if (z === 'schlaf') {
          flug.visible = false;
          if (next <= 0) { puff(0.8, 1.4, 0.6); next = 1.4; }
        } else if (z === 'jubel') {
          flug.visible = true;
          const f = Math.min(t, 1.5);
          flug.position.y = 0.9 + 9 * f - 6 * f * f; flug.rotation.y = t < 1.5 ? t * 12 : 0;
          if (t < 0.8 && next <= 0) { puff(5, 0.9, 1.2); next = 0.05; }
        } else {
          flug.visible = true; flug.position.y = 0.9; flug.rotation.y = 0;
          if (next <= 0) { puff(1.5, 1.1, 0.8); next = 0.9; }
        }
        for (const p of puffs) {
          p.age += dt; p.m.visible = p.age < p.life;
          if (!p.m.visible) continue;
          const k = p.age / p.life;
          p.m.position.set(p.dx * k, 1.35 + p.vy * p.age, p.dz * k); p.m.scale.setScalar(p.size * (1 + p.age * 2)); p.m.material.opacity = 0.7 * (1 - k);
        }
      }
    };
  }
};

// ---------- Zielband: zwei Pfosten am Wegrand, das Band beult sich mit der Murmel aus und reisst ----------
function zielband(T, v, hw, root) {
  const Y = 0.55, H = 0.16, N = 10;
  const tex = v.canvasTex(64, 16, (x, w, h) => { x.fillStyle = '#E53935'; x.fillRect(0, 0, w, h); x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, w / 2, h); });
  tex.repeat.set(hw / 0.5, 1);
  const m = new T.MeshLambertMaterial({ map: tex, side: T.DoubleSide });
  const haelften = [-1, 1].map(k => {
    const geo = new T.PlaneGeometry(1, 1, N, 1), me = new T.Mesh(geo, m);
    me.frustumCulled = false; root.add(me);
    const pf = mesh(T, cyl(T, 0.05, 0.05, 0.85, 8), v.mats.pole, k * hw, 0.425, 0), knauf = mesh(T, new T.SphereGeometry(0.09, 10, 8), mat(T, 0xE53935), k * hw, 0.87, 0);
    root.add(pf, knauf);
    return { k, geo };
  });
  let gerissen = false, tr = 0, seite = 1;
  // Form setzen: pos(k, u, off) -> [x, y, z] (u = Abstand vom Pfosten, off = oben/unten)
  const setze = (len, pos) => {
    for (const { k, geo } of haelften) {
      const a = geo.attributes.position.array;
      for (let iy = 0; iy <= 1; iy++) for (let ix = 0; ix <= N; ix++) {
        const p = pos(k, ix / N * len, iy === 0 ? H / 2 : -H / 2), i = (iy * (N + 1) + ix) * 3;
        a[i] = p[0]; a[i + 1] = p[1]; a[i + 2] = p[2];
      }
      geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
    }
  };
  return {
    get gerissen() { return gerissen; },
    heile() { gerissen = false; },
    // l = Murmel in Koordinaten des Checkpoints; tA = s seit dem Erreichen (null: nicht erreicht)
    tick(dt, l, tA) {
      if (!gerissen) {
        if (Math.abs(l[2]) >= R) seite = l[2] < 0 ? -1 : 1;              // von dieser Seite kommt die Murmel
        const drin = Math.abs(l[0]) < hw && l[1] > -0.3 && l[1] < 1.5;
        const b = drin ? Math.max(0, R - seite * l[2]) : 0;             // so weit drückt die Murmel das Band
        if (b > 0.9 || (tA !== null && tA > 0.6)) { gerissen = true; tr = 0; }
        else {
          const lx = Math.max(-hw + 0.01, Math.min(hw - 0.01, l[0]));
          setze(hw, (k, u, off) => {
            const x = k * (hw - u), f = x < lx ? (x + hw) / (lx + hw) : (hw - x) / (hw - lx);
            return [x, Y + off, -seite * b * f];
          });
          return;
        }
      }
      // Gerissen: beide Hälften schnellen zum Pfosten zurück und hängen dort
      tr += dt;
      const Lf = Math.min(0.5, hw * 0.4), L = Math.max(0.1, Lf + (hw - Lf) * Math.exp(-6 * tr) * Math.cos(9 * tr));
      const aZiel = Math.asin(Math.min(1, (Y - 0.08) / L)), a = aZiel * (1 - Math.exp(-5 * tr)) + 0.15 * Math.sin(tr * 6) * Math.exp(-1.5 * tr);
      setze(L, (k, u, off) => {
        const d = [-k * Math.cos(a), -Math.sin(a)], n = [Math.sin(a), -k * Math.cos(a)];
        return [k * hw + u * d[0] + off * n[0], Y + u * d[1] + off * n[1], 0.1 * u * Math.sin(tr * 5 + u * 3) * Math.exp(-tr)];
      });
    }
  };
}

export function buildCheckpoint(v, el, types) {
  const T = v.THREE, game = v.game;
  const rahmen = cpRahmen(el, game.solids), platz = figurPlatz(el, rahmen, game.solids, game.els, types);
  const root = new T.Group(); root.name = 'checkpoint';
  root.position.set(...el.at); root.rotation.y = rahmen.yaw; v.scene.add(root);
  const band = zielband(T, v, rahmen.halfW, root);

  const tuchMat = new T.MeshLambertMaterial({ color: GRAU, side: T.DoubleSide });
  const F = fahnen(T, tuchMat, v.mats.pole);
  const art = FIGUREN[el.figur] ? el.figur : FIGUR_JE_WELT[game.level.theme] || 'zwerg';
  const fig = FIGUREN[art](T, F);
  const z = zzz(T, v, fig.kopf); fig.g.add(z.g);
  // Sockel neben dem Weg, Figur schaut schräg zum Weg
  const stand = group(T, mesh(T, cyl(T, 0.9, 0.95, 0.3, 20), mat(T, fig.sockel), 0, -0.15, 0), mesh(T, cyl(T, 0.5, 0.25, 1.5, 12), mat(T, fig.sockel), 0, -1.05, 0), fig.g);
  stand.position.set(platz.x, 0, platz.lz); stand.rotation.y = platz.side * 2.21;
  root.add(stand);

  const ud = root.userData = { figur: art, zustand: 'schlaf', band: 'ganz', seite: platz.side };
  let t = 0, tA = null;
  const setz = zs => { ud.zustand = zs; t = 0; };
  return {
    tick(dt, g) {
      const act = !!el.active;
      if (act && ud.zustand === 'schlaf') { setz('jubel'); tA = 0; }
      else if (!act && ud.zustand !== 'schlaf') { setz('schlaf'); tA = null; band.heile(); }
      else if (ud.zustand === 'jubel' && t > JUBEL) setz('winken');
      t += dt; if (tA !== null) tA += dt;
      fig.pose(ud.zustand, t, dt);
      const schlaf = ud.zustand === 'schlaf';
      if (schlaf) F.tick(dt, 1, 0.03, 1.1); else if (ud.zustand === 'jubel') F.tick(dt, 14, 0.15, 0); else F.tick(dt, 6, 0.1, 0.1);
      tuchMat.color.setHex(act ? GRUEN : GRAU);
      z.g.visible = schlaf; if (schlaf) z.tick(t);
      const p = g.ball.position;
      band.tick(dt, toLocal([p.x, p.y, p.z], el.at, rahmen.yaw), tA);
      ud.band = band.gerissen ? 'gerissen' : 'ganz';
    }
  };
}
