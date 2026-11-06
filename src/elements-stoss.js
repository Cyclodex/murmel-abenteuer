// Stösse: Bauteile, die die Murmel wegstossen (Flipper-Pilz, Knall aus dem Boden, fallende Dinge, Besen, kippende Platte).
// Gleiche Schnittstelle wie in elements.js. Stösse ändern das Tempo der Murmel direkt (Δv statt Kraft): Pingpong und Gold
// fliegen gleich weit. Takte (Zahl oder Array, zyklisch: Zyklus k nimmt arr[k % arr.length]) zählen ab dem Level-Start
// (el.t), der Ablauf ist bei jedem Start gleich; kein Zufall in Physik und Takt (nur in Funken und Staub).
// Jedes getaktete Teil hat el.frei(rest): true = die nächsten rest Sekunden sind sicher (Autopilot: wait: ['frei', type, n, rest]).
import { DEG, quatYawPitch, rotate, add, sub, scale, fwdOf, rightOf, ease, mulQ, toLocal, angleDiff } from './math.js';
import { kinematicBody, ballPos, norm } from './elements.js';

const R = 0.5; // Murmel-Radius
const TAU = Math.PI * 2;
const quatRoll = a => [0, 0, Math.sin(a / 2), Math.cos(a / 2)]; // um die lokale z-Achse: positiv = rechte Seite nach oben

// Wert für Zyklus k: Zahl bleibt, Array zyklisch
export const zyk = (v, k) => Array.isArray(v) ? v[((k % v.length) + v.length) % v.length] : v;
// Ereignisse im Takt: Lücken gaps (Zahl oder Array, zyklisch), Ereignis k bei u = gaps[0] + … + gaps[k].
// Liefert k des letzten Ereignisses bis u (-1 = noch keines), seit = s seit diesem (Infinity: keines), bis = s bis zum nächsten.
export function takt(gaps, u) {
  const a = [].concat(gaps), n = a.length, P = a.reduce((s, x) => s + x, 0), c = Math.floor(u / P);
  let k = c * n - 1, last = c * P;
  for (let i = 0; i < n; i++) {
    if (u < last + a[i] || i === n - 1) return { k, seit: k < 0 ? Infinity : u - last, bis: last + a[i] - u };
    last += a[i]; k++;
  }
}
// Zeitpunkt von Ereignis k (siehe takt)
export function zeitVon(gaps, k) {
  const a = [].concat(gaps), n = a.length, P = a.reduce((s, x) => s + x, 0), c = Math.floor((k + 1) / n);
  let t = c * P;
  for (let i = 0; i < (k + 1) - c * n; i++) t += a[i];
  return t;
}
// Funken/Staub (nur Grafik): kleine Kugeln, die auseinanderfliegen und verblassen
function puffs(v, color, n = 10, size = 0.18) {
  const T = v.THREE, list = [];
  for (let i = 0; i < n; i++) {
    const m = new T.Mesh(new T.SphereGeometry(size, 6, 4), new T.MeshBasicMaterial({ color, transparent: true, opacity: 0 }));
    m.visible = false; v.scene.add(m); list.push({ m, v: [0, 0, 0], t: 9 });
  }
  return {
    go(p, sp = 3, up = 2) {
      for (const q of list) {
        const a = Math.random() * TAU, s = sp * (0.5 + Math.random() * 0.5);
        q.m.position.set(...p); q.v = [Math.cos(a) * s, up * (0.5 + Math.random()), Math.sin(a) * s]; q.t = 0; q.m.visible = true;
      }
    },
    tick(dt) {
      for (const q of list) {
        if (q.t > 0.7) { q.m.visible = false; continue; }
        q.t += dt; q.v[1] -= 6 * dt;
        q.m.position.x += q.v[0] * dt; q.m.position.y += q.v[1] * dt; q.m.position.z += q.v[2] * dt;
        q.m.material.opacity = Math.max(0, 0.9 - q.t * 1.3);
      }
    }
  };
}

export const STOSS = {
  // Bumper (Flipper-Pilz): rundes Hindernis, das die Murmel beim Berühren radial wegschiesst (Tempo weg vom Pilz = kick,
  // für jede Murmel gleich) und kurz aufleuchtet. Steht fest, kein Takt.
  // pos = Mitte unten (Oberkante des Bodens), r = Radius, kick = Tempo m/s, hoch = Höhe,
  // look: 'flipper' (Chilbi), 'pilz' (Fliegenpilz), 'reifen' (Winter: liegender Autoreifen), 'kissen', 'topf' (Dach: Blumentopf)
  // {type:'bumper', pos, r?, kick?, hoch?, look?}
  bumper: {
    init(el, g) {
      const C = g.C, r = el.r ?? 0.5, hb = el.hoch ?? 1;
      const body = new C.Body({ mass: 0, material: g.matFor('normal') });
      // cannon.js: Zylinder liegt entlang z, darum um x aufrichten
      body.addShape(new C.Cylinder(r, r, hb, 16), new C.Vec3(0, hb / 2, 0), new C.Quaternion(Math.SQRT1_2, 0, 0, Math.SQRT1_2));
      body.position.set(...el.pos);
      body.collisionFilterGroup = 1; body.collisionFilterMask = 2 | 4; body.userData = {};
      g.world.addBody(body);
      el.body = body;
      el.frei = () => true;
    },
    reset(el) { el.cool = 0; el.blink = 0; el.n = 0; },
    step(el, g, h, ev) {
      el.cool -= h; el.blink = Math.max(0, el.blink - h);
      const p = ballPos(g), r = el.r ?? 0.5, hb = el.hoch ?? 1, dx = p[0] - el.pos[0], dz = p[2] - el.pos[2], d = Math.hypot(dx, dz);
      if (el.cool > 0 || d > r + R + 0.06 || d < 1e-6 || p[1] < el.pos[1] - R || p[1] > el.pos[1] + hb + R * 0.6) return;
      const v = g.ball.velocity, nx = dx / d, nz = dz / d, kick = el.kick ?? 8, vn = v.x * nx + v.z * nz;
      if (vn > kick * 0.9) return;
      // Tempo weg vom Pilz auf kick setzen (quer dazu bleibt), für jede Murmel gleich
      v.x += nx * (kick - vn); v.z += nz * (kick - vn);
      el.cool = 0.2; el.blink = 0.35; el.n++;
      ev.push('plopp');
    },
    view(el, v) {
      const T = v.THREE, r = el.r ?? 0.5, hb = el.hoch ?? 1, look = el.look || 'flipper', grp = new T.Group();
      const M = (color, extra) => new T.MeshPhongMaterial({ color, shininess: 60, ...extra });
      let glow = null;
      if (look === 'reifen') { // liegender Autoreifen mit Felge
        const tr = Math.min(0.35, hb / 2);
        const reifen = new T.Mesh(new T.TorusGeometry(r - tr, tr, 12, 28).rotateX(Math.PI / 2), M(0x222222, { shininess: 15 }));
        reifen.position.y = tr; grp.add(reifen);
        const felge = new T.Mesh(new T.CylinderGeometry(r - tr * 1.6, r - tr * 1.6, 0.2, 20), M(0xC0C6CC, { shininess: 140 }));
        felge.position.y = tr; grp.add(felge); glow = felge.material;
      } else if (look === 'topf') { // Blumentopf aus Terrakotta mit Pflanze
        const topf = new T.Mesh(new T.CylinderGeometry(r, r * 0.75, hb * 0.8, 20), M(0xC8643B, { shininess: 10 }));
        topf.position.y = hb * 0.4; grp.add(topf);
        const rand = new T.Mesh(new T.CylinderGeometry(r * 1.06, r * 1.06, hb * 0.16, 20), M(0xB5552F, { shininess: 10 }));
        rand.position.y = hb * 0.8; grp.add(rand); glow = rand.material;
        for (let i = 0; i < 5; i++) {
          const b = new T.Mesh(new T.SphereGeometry(r * 0.35, 8, 6), M(0x4CAF50, { shininess: 20 }));
          b.position.set(Math.cos(i * 1.3) * r * 0.4, hb + r * 0.15 + (i % 2) * 0.15, Math.sin(i * 1.3) * r * 0.4); grp.add(b);
        }
      } else if (look === 'kissen') { // weiches Kissen
        const k = new T.Mesh(new T.SphereGeometry(r, 20, 12).scale(1, hb / (2 * r), 1), M(0xF48FB1, { shininess: 15 }));
        k.position.y = hb / 2; grp.add(k); glow = k.material;
      } else { // Flipper-Pilz bzw. Fliegenpilz: Stiel, Hut
        const pilz = look === 'pilz';
        const stiel = new T.Mesh(new T.CylinderGeometry(r * 0.7, r * 0.8, hb * 0.6, 20), pilz ? M(0xFFF8E1, { shininess: 10 }) : M(0xCFD8DC, { shininess: 140 }));
        stiel.position.y = hb * 0.3; grp.add(stiel);
        const hut = new T.Mesh(new T.SphereGeometry(r * 1.05, 24, 12, 0, TAU, 0, Math.PI / 2).scale(1, 0.5 * hb / r, 1), M(pilz ? 0xE53935 : 0x1E88E5));
        hut.position.y = hb * 0.55; grp.add(hut); glow = hut.material;
        const ring = new T.Mesh(new T.TorusGeometry(r * 1.02, 0.07, 8, 28).rotateX(Math.PI / 2), M(pilz ? 0xFFFFFF : 0xFDD835));
        ring.position.y = hb * 0.55; grp.add(ring);
        if (pilz) for (let i = 0; i < 6; i++) {
          const pt = new T.Mesh(new T.SphereGeometry(r * 0.13, 6, 4), M(0xFFFFFF));
          const a = i * TAU / 6, s = i % 2 ? 0.55 : 0.35;
          pt.position.set(Math.cos(a) * r * s * 1.5, hb * 0.55 + Math.sqrt(Math.max(0, 1 - s * s * 2.2)) * hb * 0.48, Math.sin(a) * r * s * 1.5); grp.add(pt);
        }
      }
      grp.traverse(m => { if (m.isMesh) m.castShadow = true; });
      grp.position.set(...el.pos); v.scene.add(grp);
      const base = glow && glow.emissive ? glow.emissive.getHex() : 0;
      return {
        tick() {
          const b = el.blink / 0.35, s = 1 + 0.15 * Math.sin(b * Math.PI);
          grp.scale.set(s, 1 + (s - 1) * 0.5, s);
          if (glow && glow.emissive) glow.emissive.setHex(b > 0 ? 0xFFF59D : base);
        }
      };
    }
  }
};
