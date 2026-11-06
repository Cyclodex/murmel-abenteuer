// Stösse: Bauteile, die die Murmel wegstossen (Flipper-Pilz, Knall aus dem Boden, fallende Dinge, Besen, kippende Platte).
// Gleiche Schnittstelle wie in elements.js. Stösse ändern das Tempo der Murmel direkt (Δv statt Kraft): Pingpong und Gold
// fliegen gleich weit. Takte (Zahl oder Array, zyklisch: Zyklus k nimmt arr[k % arr.length]) zählen ab dem Level-Start
// (el.t), der Ablauf ist bei jedem Start gleich; kein Zufall in Physik und Takt (nur in Funken und Staub).
// Jedes getaktete Teil hat el.frei(rest): true = die nächsten rest Sekunden sind sicher (Autopilot: wait: ['frei', type, n, rest]).
import { DEG, quatYawPitch, rotate, add, sub, scale, fwdOf, rightOf, ease, mulQ, toLocal, angleDiff } from './math.js';
import { kinematicBody, driveTo, ballPos, norm } from './elements.js';

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
  },

  // Knall aus dem Boden: eine Scheibe im Weg (Luftdüse, Kompressor, Käsekessi-Blubber, Lawinenstoss, Dachluke) knallt im
  // Takt; jede Murmel über der Scheibe bekommt einen Stoss radial vom Zentrum weg (bzw. in richtung) und nach oben.
  // Vorher warnt sie warn s lang (hebt sich, leuchtet). Nur Grafik und Stoss: einen Weg darunter legen.
  // pos = Mitte (Oberkante des Bodens), r = Radius der Scheibe, kick = Tempo quer (m/s; Zahl oder Array pro Knall),
  // up = Anteil nach oben (Tempo nach oben = up · kick), takt = Lücken zwischen den Knällen (s, Zahl oder Array),
  // warn = s Vorwarnung, offset = Startverzögerung, richtung = [x, z] statt radial (z. B. quer vom Weg),
  // look: 'duese' (Chilbi), 'kompressor' (Werkstatt), 'kessi' (Schweiz), 'lawine' (Winter), 'luke' (Dach)
  // Autopilot: wait: ['frei', ['knall', n, rest]] = die nächsten rest s knallt es nicht.
  // {type:'knall', pos, r?, kick?, up?, takt?, warn?, offset?, richtung?, look?}
  knall: {
    init(el) { el.frei = rest => STOSS.knall.plan(el).bis > rest; },
    reset(el) { el.t = 0; el.k = -1; el.warnt = false; el.seit = 9; el.traf = false; },
    plan: el => takt(el.takt ?? 3, el.t + (el.offset || 0)),
    pre(el, g, h) { el.t += h; },
    step(el, g, h, ev) {
      const s = STOSS.knall.plan(el), r = el.r ?? 1.5;
      el.warnt = s.bis < (el.warn ?? 0.5); el.seit = s.seit;
      if (s.k < 0 || s.k === el.k) return;
      el.k = s.k;
      const p = ballPos(g), dx = p[0] - el.pos[0], dz = p[2] - el.pos[2], d = Math.hypot(dx, dz);
      el.traf = d < r + R * 0.5 && p[1] > el.pos[1] - 0.3 && p[1] < el.pos[1] + 1.5 + R;
      if (d < 25) ev.push('boom');
      if (!el.traf) return;
      const kick = zyk(el.kick ?? 6, s.k), v = g.ball.velocity;
      const dir = el.richtung ? norm([el.richtung[0], 0, el.richtung[1]]) : d > 0.05 ? [dx / d, 0, dz / d] : [0, 0, -1];
      v.x += dir[0] * kick; v.z += dir[2] * kick; v.y = Math.max(v.y, 0) + kick * (el.up ?? 0.4);
    },
    view(el, v) {
      const T = v.THREE, r = el.r ?? 1.5, look = el.look || 'duese', grp = new T.Group();
      const F = { duese: [0x37474F, 0xFDD835, 0xFFFFFF], kompressor: [0x607D8B, 0xE53935, 0xECEFF1], kessi: [0xF2C230, 0xC98A2B, 0xFFF3C4], lawine: [0xF5F9FF, 0xB3E5FC, 0xFFFFFF], luke: [0x8D6E63, 0x5D4037, 0xD7CCC8] }[look] || [0x37474F, 0xFDD835, 0xFFFFFF];
      const platte = new T.MeshPhongMaterial({ color: F[0], shininess: look === 'lawine' ? 10 : 70 });
      const eck = look === 'luke';
      const scheibe = new T.Mesh(eck ? new T.BoxGeometry(r * 1.6, 0.1, r * 1.6) : new T.CylinderGeometry(r, r, 0.1, 32), platte);
      scheibe.position.y = 0.05; grp.add(scheibe);
      const ring = new T.Mesh(eck ? new T.BoxGeometry(r * 1.75, 0.06, r * 1.75) : new T.TorusGeometry(r, 0.09, 8, 36).rotateX(Math.PI / 2), new T.MeshPhongMaterial({ color: F[1], shininess: 40 }));
      ring.position.y = eck ? 0.03 : 0.06; grp.add(ring);
      if (!eck) for (let i = 0; i < 3; i++) { // Düsenringe bzw. Blasen in der Mitte
        const m = new T.Mesh(new T.TorusGeometry(r * (0.2 + i * 0.22), 0.04, 6, 24).rotateX(Math.PI / 2), new T.MeshPhongMaterial({ color: F[1] }));
        m.position.y = 0.11; grp.add(m);
      }
      if (el.richtung) { // Pfeil in Stossrichtung
        const pf = new T.Mesh(new T.ConeGeometry(r * 0.3, r * 0.6, 3).rotateX(-Math.PI / 2), new T.MeshPhongMaterial({ color: F[1] }));
        pf.rotation.y = Math.atan2(el.richtung[0], el.richtung[1]); pf.position.y = 0.14; grp.add(pf);
      }
      grp.position.set(...el.pos); v.scene.add(grp);
      const fx = puffs(v, F[2], 14, look === 'lawine' ? 0.3 : 0.2);
      let k = -1;
      return {
        tick(dt) {
          scheibe.position.y = el.warnt ? 0.12 + Math.sin(el.seit * 60) * 0.03 : 0.05;
          platte.emissive.setHex(el.warnt ? 0x882200 : el.seit < 0.2 ? 0x664400 : 0);
          if (eck) scheibe.rotation.x = el.seit < 0.6 ? -Math.sin(el.seit / 0.6 * Math.PI) * 1.2 : 0; // Luke klappt auf und zu
          if (el.k !== k) { k = el.k; if (k >= 0) fx.go(add(el.pos, [0, 0.3, 0]), r * 2.5, 4); }
          fx.tick(dt);
        }
      };
    }
  },

  // Fallende Dinge: fallen im Takt von oben auf den Weg (Eiszapfen, Kastanien, Schrauben aus dem Regal, Käselaibe, Ziegel),
  // bleiben liegt s als Hindernis liegen und versinken dann. Vorher warn s: Schatten am Boden, das Ding wackelt oben.
  // Trifft es die Murmel, stösst es sie zur Seite (Tempo kick, das Vorwärtstempo ist weg) oder quetscht sie (quetscht: true,
  // zurück zum Checkpoint wie beim Hammer). Wo es aufschlägt, sucht ein Strahl nach unten (erster fester Boden).
  // from = [x, Höhe, z] Startpunkt oben, to = [x, z] (Linie, auf der es fällt; ohne to immer bei from),
  // stellen = Anteil 0..1 auf der Linie (Zahl oder Array, pro Fall zyklisch), every = Lücken zwischen den Fällen (s, Zahl oder
  // Array), offset, warn, liegt, r = Grösse, form: 'ziegel' | 'eiszapfen' | 'kastanie' | 'schraube' | 'laib', farbe,
  // kick (m/s), quetscht, anzahl = so viele gleichzeitig unterwegs (Standard 3)
  // Autopilot: wait: ['frei', ['fallend', n, rest]] = nichts in der Luft, und die nächsten rest s fällt nichts.
  // {type:'fallend', from, to?, stellen?, every?, offset?, warn?, liegt?, r?, form?, farbe?, kick?, quetscht?, anzahl?}
  fallend: {
    FORM: {
      ziegel: { r: 0.6, h: 0.3, t: 0.45, farbe: 0xB5552F, liegt: 1.5 },
      eiszapfen: { r: 0.3, h: 2.2, t: 1, farbe: 0xCFEFFF, liegt: 0.4 },
      kastanie: { r: 0.4, h: 0.9, t: 1, farbe: 0x6D3B1E, liegt: 1.5 },
      schraube: { r: 0.25, h: 2.4, t: 1, farbe: 0x9EA7B0, liegt: 1.5 },
      laib: { r: 0.8, h: 0.45, t: 1, farbe: 0xF2C230, liegt: 1.5 }
    },
    init(el, g) {
      const f = STOSS.fallend.FORM[el.form] || STOSS.fallend.FORM.ziegel, r = el.r ?? f.r;
      el.half = [r, r * f.h, r * f.t]; el.f = f;
      const to = el.to ? [el.to[0], el.to[el.to.length - 1]] : [el.from[0], el.from[2]];
      el.a0 = [el.from[0], el.from[2]]; el.a1 = to;
      el.yw = el.to ? Math.atan2(-(to[0] - el.a0[0]), -(to[1] - el.a0[1])) : 0;
      el.pool = [];
      for (let i = 0; i < (el.anzahl ?? 3); i++) {
        const b = kinematicBody(g, [{ half: el.half, off: [0, 0, 0], look: 'floor' }]);
        b.collisionFilterGroup = 4; b.collisionFilterMask = 2; // nur die Murmel; der Strahl zum Aufschlagpunkt sieht sie nicht
        b.quaternion.set(...quatYawPitch(el.yw, 0)); b.userData = {};
        el.pool.push({ b, k: -1 });
      }
      el.ray = new g.C.RaycastResult(); el.rA = new g.C.Vec3(); el.rB = new g.C.Vec3();
      el.frei = rest => {
        const u = el.t + (el.offset || 0);
        return el.pool.every(s => s.k < 0 || u - s.T >= s.tf) && takt(el.every ?? 3, u + (el.warn ?? 0.6)).bis > rest;
      };
    },
    reset(el) {
      el.t = 0; el.evs = [];
      for (const s of el.pool) { s.k = -1; s.zustand = 'weg'; STOSS.fallend.park(s); }
    },
    park(s) { s.b.position.set(0, -300, 0); s.b.velocity.set(0, 0, 0); s.b.collisionFilterMask = 2; },
    // Fall k planen: Stelle auf der Linie, Aufschlag (Strahl nach unten), Fallzeit
    plan(el, g, s, k) {
      const a = zyk(el.stellen ?? [0.5, 0.15, 0.85, 0.35, 0.65], k), x = el.a0[0] + (el.a1[0] - el.a0[0]) * a, z = el.a0[1] + (el.a1[1] - el.a0[1]) * a;
      el.rA.set(x, el.from[1], z); el.rB.set(x, el.from[1] - 60, z); el.ray.reset();
      g.world.raycastClosest(el.rA, el.rB, { collisionFilterMask: 1, skipBackfaces: true }, el.ray);
      const yl = el.ray.hasHit ? el.ray.hitPointWorld.y : el.from[1] - 60, y0 = el.from[1] + el.half[1];
      Object.assign(s, { k, T: zeitVon(el.every ?? 3, k), x, z, yl, y0, tf: Math.sqrt(2 * Math.max(0.01, y0 - yl - el.half[1]) / g.gy), hit: false, zustand: 'warnt' });
      s.b.position.set(x, y0, z); s.b.velocity.set(0, 0, 0); s.b.collisionFilterMask = 2;
    },
    // Höhe der Mitte zur Zeit tau nach dem Fallbeginn (null = weg)
    hoehe(el, g, s, tau) {
      const hy = el.half[1], liegt = el.liegt ?? el.f.liegt;
      if (tau < 0) return s.y0;
      if (tau < s.tf) return s.y0 - g.gy * tau * tau / 2;
      if (tau < s.tf + liegt) return s.yl + hy;
      if (tau < s.tf + liegt + 0.6) return s.yl + hy - (tau - s.tf - liegt) / 0.6 * (2 * hy + 0.1); // versinkt
      return null;
    },
    pre(el, g, h) {
      el.t += h;
      const u = el.t + (el.offset || 0), m = el.pool.length, kw = takt(el.every ?? 3, u + (el.warn ?? 0.6)).k, [hx, hy, hz] = el.half;
      for (let j = 0; j < m; j++) { const k = kw - j; if (k >= 0 && el.pool[k % m].k !== k) STOSS.fallend.plan(el, g, el.pool[k % m], k); }
      const p = ballPos(g), busy = g.squashT > 0 || g.holdT > 0;
      for (const s of el.pool) {
        if (s.k < 0 || s.zustand === 'weg') continue;
        const tau = u - s.T, y1 = STOSS.fallend.hoehe(el, g, s, tau + h);
        if (y1 === null) { s.zustand = 'weg'; STOSS.fallend.park(s); continue; }
        const z0 = s.zustand;
        s.zustand = tau < 0 ? 'warnt' : tau < s.tf ? 'faellt' : 'liegt';
        if (z0 === 'faellt' && s.zustand === 'liegt' && Math.hypot(p[0] - s.x, p[2] - s.z) < 20) el.evs.push('rumpel');
        driveTo(s.b, [s.x, y1, s.z], h);
        const l = toLocal(p, [s.x, 0, s.z], el.yw), y = s.b.position.y;
        if (s.zustand === 'faellt' && !s.hit && !busy && Math.abs(l[0]) < hx + R * 0.8 && Math.abs(l[2]) < hz + R * 0.8 && y1 - hy < p[1] + R && y + hy > p[1] - R) {
          // getroffen: das Ding fällt durch die Murmel hindurch, die Murmel fliegt zur Seite (oder wird zerquetscht)
          s.hit = true; s.b.collisionFilterMask = 0; el.evs.push('klapp'); // ohne Kontakt (auch kein Abprall in game.js)
          if (el.quetscht) g.squash();
          else {
            let d = [p[0] - s.x, 0, p[2] - s.z];
            if (Math.hypot(d[0], d[2]) < 0.05) d = scale(rightOf(el.yw), s.k % 2 ? 1 : -1);
            d = norm(d);
            const v = g.ball.velocity, kick = el.kick ?? 5;
            v.x = d[0] * kick; v.z = d[2] * kick; v.y = Math.min(v.y, 0);
          }
        }
        // durchgefallen: erst wieder fest, wenn die Murmel weg ist
        if (!s.b.collisionFilterMask && s.zustand !== 'faellt' && (Math.abs(l[0]) > hx + R + 0.05 || Math.abs(l[2]) > hz + R + 0.05)) s.b.collisionFilterMask = 2;
      }
    },
    step(el, g, h, ev) { if (el.evs.length) { ev.push(...el.evs); el.evs = []; } },
    view(el, v) {
      const T = v.THREE, [hx, hy, hz] = el.half, form = el.form || 'ziegel', farbe = el.farbe ?? el.f.farbe;
      const M = (color, extra) => new T.MeshPhongMaterial({ color, shininess: 50, ...extra });
      const bau = () => {
        const grp = new T.Group();
        if (form === 'eiszapfen') grp.add(new T.Mesh(new T.ConeGeometry(hx, hy * 2, 10).rotateX(Math.PI), M(farbe, { transparent: true, opacity: 0.85, shininess: 120 })));
        else if (form === 'kastanie') {
          grp.add(new T.Mesh(new T.SphereGeometry(hx, 14, 10).scale(1, hy / hx, 1), M(farbe, { shininess: 90 })));
          const kappe = new T.Mesh(new T.SphereGeometry(hx * 0.75, 10, 6, 0, TAU, 0, 1).scale(1, 0.5, 1), M(0xD7B98E, { shininess: 10 }));
          kappe.position.y = hy * 0.55; grp.add(kappe);
        } else if (form === 'schraube') {
          grp.add(new T.Mesh(new T.CylinderGeometry(hx * 0.45, hx * 0.3, hy * 1.7, 10), M(farbe, { shininess: 120 })));
          const kopf = new T.Mesh(new T.CylinderGeometry(hx, hx, hy * 0.3, 6), M(farbe, { shininess: 120 }));
          kopf.position.y = hy * 0.85; grp.add(kopf);
        } else if (form === 'laib') grp.add(new T.Mesh(new T.CylinderGeometry(hx, hx, hy * 2, 24), [M(0xC98A2B, { shininess: 10 }), M(farbe, { shininess: 10 }), M(farbe, { shininess: 10 })]));
        else { // Dachziegel: gewölbt (Halbrohr) auf einer Platte
          grp.add(new T.Mesh(new T.BoxGeometry(hx * 2, hy, hz * 2), M(farbe, { shininess: 10 })));
          const w = new T.Mesh(new T.CylinderGeometry(hz * 0.9, hz * 0.9, hx * 2, 12, 1, false, 0, Math.PI).rotateZ(Math.PI / 2), M(farbe, { shininess: 10 }));
          w.position.y = hy * 0.4; w.scale.y = 0.6; grp.add(w);
        }
        grp.traverse(m => { if (m.isMesh) m.castShadow = true; });
        grp.rotation.y = el.yw; v.scene.add(grp); return grp;
      };
      const schatten = new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, depthWrite: false });
      const teile = el.pool.map(() => {
        const sh = new T.Mesh(new T.CircleGeometry(Math.max(hx, hz) * 1.2, 20).rotateX(-Math.PI / 2), schatten.clone());
        v.scene.add(sh); return { g: bau(), sh, fx: puffs(v, form === 'eiszapfen' ? 0xE1F5FE : 0xBCAAA4, 8, 0.14), z: 'weg' };
      });
      let t = 0;
      return {
        tick(dt) {
          t += dt;
          el.pool.forEach((s, i) => {
            const o = teile[i], p = s.b.position, sichtbar = s.k >= 0 && s.zustand !== 'weg';
            o.g.visible = sichtbar; o.sh.visible = sichtbar && s.zustand !== 'liegt';
            if (sichtbar) {
              o.g.position.copy(p);
              o.g.rotation.z = s.zustand === 'warnt' ? Math.sin(t * 40) * 0.12 : 0; // wackelt oben vor dem Fall
              o.sh.position.set(s.x, s.yl + 0.03, s.z);
              o.sh.material.opacity = 0.45 * Math.min(1, Math.max(0.2, 1 - (p.y - s.yl) / Math.max(1, s.y0 - s.yl)));
            }
            if (o.z === 'faellt' && s.zustand === 'liegt') o.fx.go([s.x, s.yl + 0.2, s.z], 2.5, 1.5); // Staub bzw. Eissplitter
            o.z = s.zustand; o.fx.tick(dt);
          });
        }
      };
    }
  }
};
