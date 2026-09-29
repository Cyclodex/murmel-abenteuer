// Weitere Bauteile (Röhre, Förderband, Wind, Balken, Magnet, Kanone, Dominos, Spirale).
// Gleiche Schnittstelle wie in elements.js; wird dort in TYPES eingetragen.
import { DEG, quatYawPitch, rotate, add, sub, scale, lerp3, toLocal, fwdOf } from './math.js';
import { TYPES, segment, kinematicBody, ballPos } from './elements.js';

const R = 0.5;
const UP = [0, 1, 0];
const norm = v => { const l = Math.hypot(...v) || 1; return scale(v, 1 / l); };
const bezier = (P, t) => {
  const u = 1 - t;
  return add(add(scale(P[0], u * u * u), scale(P[1], 3 * u * u * t)), add(scale(P[2], 3 * u * t * t), scale(P[3], t * t * t)));
};
const setBall = (g, p) => { g.ball.position.set(...p); g.ball.velocity.set(0, 0, 0); };

export const EXTRA = {
  // Spirale = Kurve mit mehreren Runden und Gefälle. {type:'spirale', at, yaw?, turn:720, radius, rise:-8, width, walls}
  spirale: { solids: d => TYPES.kurve.solids({ turn: 720, rise: -8, ...d }) },

  // Röhre: Murmel rollt hinein, fliegt im Bogen durch die Röhre und kommt am Ziel heraus.
  // from/to = Bodenpunkt vor der Öffnung, yaw = Richtung hinein, toYaw = Richtung heraus,
  // bogen = Höhe des Bogens, speed = Tempo in der Röhre, out = Tempo beim Herauskommen.
  // down = Abfluss: die Röhre geht bei from senkrecht nach unten (z. B. Lavabo, Badewanne), fang = Fangradius
  // {type:'roehre', from, yaw?, to, toYaw?, bogen?, speed?, out?, down?, fang?}
  roehre: {
    init(el) {
      const f = fwdOf((el.yaw || 0) * DEG), e = fwdOf((el.toYaw ?? el.yaw ?? 0) * DEG), b = el.bogen ?? 4;
      const p0 = add(el.from, [0, 0.9, 0]), p3 = add(el.to, [0, 0.9, 0]);
      el.P = el.down
        ? [p0, add(p0, [0, -b, 0]), sub(p3, scale(e, Math.max(3, b))), p3]
        : [p0, add(add(p0, scale(f, 3)), [0, b, 0]), add(sub(p3, scale(e, 3)), [0, b, 0]), p3];
      let L = 0, last = p0;
      for (let i = 1; i <= 30; i++) { const q = bezier(el.P, i / 30); L += Math.hypot(...sub(q, last)); last = q; }
      el.len = L; el.exitDir = e;
    },
    reset(el) { el.t = -1; el.cool = 0; },
    pre(el, g) { if (el.t >= 0) setBall(g, bezier(el.P, el.t)); },
    step(el, g, h, ev) {
      el.cool -= h;
      if (el.t < 0) {
        const p = g.ball.position, m = el.P[0];
        if (el.cool <= 0 && Math.hypot(p.x - m[0], p.z - m[2]) < (el.fang ?? 0.9) && Math.abs(p.y - m[1]) < 1) { el.t = 0; g.lock = true; ev.push(el.down ? 'gurgel' : 'roehre'); }
        return;
      }
      el.t += h * (el.speed ?? 9) / el.len;
      g.hitCool = 0.3;
      if (el.t >= 1) {
        el.t = -1; el.cool = 1.5; g.lock = false;
        setBall(g, el.P[3]);
        const o = el.out ?? 5, vx = el.exitDir[0] * o, vz = el.exitDir[2] * o;
        // herausrutschen und dabei vorwärts rollen (sonst wirft der alte Drall von vor der Röhre die Murmel beim Aufsetzen zurück)
        g.ball.velocity.set(vx, -1, vz); g.ball.angularVelocity.set(vz / R, 0, -vx / R);
        ev.push('plopp');
      } else setBall(g, bezier(el.P, el.t));
    },
    view(el, v) {
      const T = v.THREE, V = p => new T.Vector3(...p);
      // Abfluss: Röhre erst unter dem Boden zeigen (die Öffnung malt das Becken)
      const pts = el.down ? [add(el.from, [0, -0.9, 0]), ...el.P.slice(1)] : el.P;
      const curve = new T.CubicBezierCurve3(...pts.map(V));
      const tube = new T.Mesh(new T.TubeGeometry(curve, 48, 0.8, 16, false),
        new T.MeshPhongMaterial({ color: el.farbe ?? 0x3BB273, transparent: true, opacity: 0.45, side: T.DoubleSide, shininess: 80, depthWrite: false }));
      v.scene.add(tube);
      for (const t of el.down ? [1] : [0, 1]) { // Ringe an den Öffnungen
        const ring = new T.Mesh(new T.TorusGeometry(0.85, 0.12, 10, 28), new T.MeshLambertMaterial({ color: el.farbe ?? 0x3BB273 }));
        const p = curve.getPoint(t), tan = curve.getTangent(t);
        ring.position.copy(p); ring.lookAt(p.clone().add(tan)); v.scene.add(ring);
      }
    }
  },

  // Förderband: Weg, der die Murmel in seine Richtung mitnimmt. speed in m/s (Standard 8), grip = wie stark (pro Sekunde, Standard 10).
  // {type:'band', from, to, width, walls?, caps?, speed?, grip?}
  band: {
    solids(d) {
      const out = TYPES.weg.solids({ ...d, look: 'band' });
      out[0].band = d; // Boden
      return out;
    },
    init(el) { el.seg = segment(el.from, el.to); el.dir = norm(sub(el.to, el.from)); },
    step(el, g, h) {
      const u = g.groundBody && g.groundBody.userData;
      if (!u || u.band !== el) return;
      const v = g.ball.velocity, al = v.x * el.dir[0] + v.y * el.dir[1] + v.z * el.dir[2], k = Math.min(1, (el.grip ?? 10) * h);
      const dv = ((el.speed ?? 8) - al) * k;
      if (dv > 0) { v.x += el.dir[0] * dv; v.y += el.dir[1] * dv; v.z += el.dir[2] * dv; }
    },
    view(el, v) {
      const T = v.THREE, w = el.width ?? 4, s = el.seg;
      const tex = v.canvasTex(64, 64, (x, W, H) => {
        x.fillStyle = '#3A3F47'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#FFD23F'; x.beginPath(); x.moveTo(14, 40); x.lineTo(32, 20); x.lineTo(50, 40); x.lineTo(42, 46); x.lineTo(32, 34); x.lineTo(22, 46); x.closePath(); x.fill();
        x.fillStyle = '#2B2F36'; x.fillRect(0, 0, W, 4);
      });
      tex.repeat.set(Math.max(1, Math.round(w / 2)), s.L / 1.5);
      const m = new T.Mesh(new T.PlaneGeometry(w, s.L), new T.MeshLambertMaterial({ map: tex }));
      m.quaternion.set(...s.q); m.rotateX(-Math.PI / 2);
      m.position.set(...add(s.mid, scale(s.up, 0.02))); v.scene.add(m);
      return { tick(dt) { tex.offset.y = (tex.offset.y - dt * (el.speed ?? 8) / 1.5) % 1; } };
    }
  },

  // Wind (Ventilator): in der Zone wird die Murmel geschoben. up:true = Aufwind nach oben.
  // at = Mitte der Zone am Boden, size = [breit, hoch, tief], yaw = Blasrichtung, strength = Beschleunigung m/s²
  // look = 'schlauch' (Gartenschlauch) oder 'hahn' (Wasserhahn): Wasserstrahl statt Ventilator, wäscht stärker
  // {type:'wind', at, size?, yaw?, up?, strength?, look?}
  wind: {
    init(el) {
      el.size = el.size || [3, 4, 6]; el.yw = (el.yaw || 0) * DEG;
      el.dir = el.up ? UP : fwdOf(el.yw);
    },
    reset(el) { el.inside = false; },
    step(el, g, h, ev) {
      const l = toLocal(ballPos(g), el.at, el.yw), [b, hh, t] = el.size;
      const inside = Math.abs(l[0]) < b / 2 && l[1] > 0 && l[1] < hh && Math.abs(l[2]) < t / 2;
      if (inside) {
        const a = (el.strength ?? (el.up ? 16 : 8)) * h, v = g.ball.velocity;
        v.x += el.dir[0] * a; v.y += el.dir[1] * a; v.z += el.dir[2] * a;
        g.washK += el.look ? 6 : 3; // Wind bläst den Dreck weg, Wasser wäscht ihn ab
        if (!el.inside) ev.push('wind');
      }
      el.inside = inside;
    },
    view(el, v) {
      const T = v.THREE, [b, hh, t] = el.size, q = quatYawPitch(el.yw, 0), wet = !!el.look;
      // Ventilator (oder Schlauch / Wasserhahn)
      const fan = new T.Group(), blades = new T.Group();
      if (wet) {
        const nozzle = new T.Group(), chrome = new T.MeshPhongMaterial({ color: 0xD7DCE2, shininess: 150, specular: 0xffffff });
        if (el.look === 'hahn') {
          const pipe = new T.Mesh(new T.CylinderGeometry(0.35, 0.35, 1.8, 16), chrome); pipe.rotation.x = Math.PI / 2; pipe.position.z = 0.4;
          const top = new T.Mesh(new T.SphereGeometry(0.5, 16, 10), chrome); top.position.z = 1.3;
          nozzle.add(pipe, top);
        } else {
          const green = new T.MeshPhongMaterial({ color: 0x2E9E48, shininess: 60 });
          const hose = new T.Mesh(new T.CylinderGeometry(0.4, 0.4, 3, 14), green); hose.rotation.x = Math.PI / 2; hose.position.z = 1.5;
          const tip = new T.Mesh(new T.CylinderGeometry(0.25, 0.45, 0.6, 14), new T.MeshPhongMaterial({ color: 0xFFA000 })); tip.rotation.x = Math.PI / 2; tip.position.z = -0.2;
          const coil = new T.Mesh(new T.TorusGeometry(1.4, 0.4, 10, 24), green); coil.position.set(0, -hh / 2 + 0.4, 4); coil.rotation.x = Math.PI / 2;
          nozzle.add(hose, tip, coil);
        }
        if (el.up) { nozzle.rotation.x = -Math.PI / 2; nozzle.position.set(el.at[0], el.at[1] + 0.3, el.at[2]); }
        else { nozzle.quaternion.set(...q); nozzle.position.set(...add(add(el.at, rotate(q, [0, 0, t / 2])), [0, hh / 2, 0])); }
        v.scene.add(nozzle);
      } else {
      const ring = new T.Mesh(new T.TorusGeometry(Math.min(b, hh) * 0.45, 0.1, 8, 28), v.mats.pole);
      for (let i = 0; i < 3; i++) {
        const bl = new T.Mesh(new T.BoxGeometry(0.35, Math.min(b, hh) * 0.4, 0.05), new T.MeshLambertMaterial({ color: 0xE0F4FF }));
        bl.position.y = Math.min(b, hh) * 0.2; const pivot = new T.Group(); pivot.rotation.z = i * 2.094; pivot.add(bl); blades.add(pivot);
      }
      fan.add(ring, blades);
      if (el.up) { fan.rotation.x = -Math.PI / 2; fan.position.set(el.at[0], el.at[1] + 0.15, el.at[2]); }
      else { fan.quaternion.set(...q); fan.position.set(...add(add(el.at, rotate(q, [0, 0, t / 2])), [0, hh / 2, 0])); }
      v.scene.add(fan);
      }
      // Luftstriche bzw. Wassertropfen (Strahl in der Mitte der Zone)
      const n = wet ? 30 : 14, streakGeo = wet ? new T.SphereGeometry(0.14, 6, 4) : el.up ? new T.BoxGeometry(0.05, 0.6, 0.05) : new T.BoxGeometry(0.05, 0.05, 0.6);
      const mat = new T.MeshBasicMaterial({ color: wet ? 0x6EC6FF : 0xffffff, transparent: true, opacity: wet ? 0.8 : 0.55 });
      const streaks = [];
      for (let i = 0; i < n; i++) {
        const m = new T.Mesh(streakGeo, mat); m.quaternion.set(...q); v.scene.add(m);
        const sprd = wet ? 0.35 : 1; // Wasser: gebündelter Strahl
        streaks.push({ m, x: (Math.random() - 0.5) * b * sprd, y: wet && !el.up ? hh / 2 + (Math.random() - 0.5) * hh * 0.3 : Math.random() * hh, z: (Math.random() - 0.5) * t });
      }
      const sp = (el.strength ?? 8) * 0.6;
      return {
        tick(dt) {
          blades.rotation.z += dt * 12;
          for (const s of streaks) {
            if (el.up) { s.y += dt * sp; if (s.y > hh) s.y = 0; } else { s.z -= dt * sp; if (s.z < -t / 2) s.z = t / 2; }
            s.m.position.set(...add(el.at, rotate(q, [s.x, s.y, s.z])));
          }
        }
      };
    }
  },

  // Drehender Balken, der die Murmel sanft schubst. {type:'balken', at (Drehpunkt am Boden), length?, speed?:Grad/s, height?}
  balken: {
    init(el, g) {
      const L = el.length ?? 6, hh = el.height ?? 0.6;
      el.body = kinematicBody(g, [{ half: [L / 2, hh / 2, 0.2], off: [0, hh / 2 + 0.05, 0], look: 'klotz-' + (el.farbe || 'rot') }], el.surface);
      el.body.position.set(...el.at);
      el.body.userData = { surface: el.surface };
    },
    reset(el) { el.a = (el.yaw || 0) * DEG; },
    pre(el, g, h) {
      const w = (el.speed ?? 40) * DEG;
      el.body.quaternion.set(...quatYawPitch(el.a, 0));
      el.body.angularVelocity.set(0, w, 0);
      el.a += w * h;
    },
    view(el, v) {
      const T = v.THREE, hub = new T.Mesh(new T.CylinderGeometry(0.35, 0.45, (el.height ?? 0.6) + 0.3, 16), v.mats.pole);
      hub.position.set(el.at[0], el.at[1] + ((el.height ?? 0.6) + 0.3) / 2, el.at[2]); v.scene.add(hub);
      return v.bodyGroup(el.body);
    }
  },

  // Magnet über dem Boden: zieht die Murmel an (strength > 0) oder stösst sie ab (< 0).
  // at = Bodenpunkt darunter, radius = Reichweite. {type:'magnet', at, radius?, strength?}
  magnet: {
    reset(el) { el.inside = false; },
    step(el, g, h, ev) {
      const p = g.ball.position, dx = el.at[0] - p.x, dz = el.at[2] - p.z, d = Math.hypot(dx, dz), r = el.radius ?? 4;
      const inside = d < r && Math.abs(p.y - el.at[1] - R) < 2;
      if (inside && d > 0.05) {
        const a = (el.strength ?? 7) * (1 - d / r) * h;
        g.ball.velocity.x += dx / d * a; g.ball.velocity.z += dz / d * a;
        if (!el.inside) ev.push('magnet');
      }
      el.inside = inside;
    },
    view(el, v) {
      const T = v.THREE, grp = new T.Group(), red = new T.MeshPhongMaterial({ color: (el.strength ?? 7) >= 0 ? 0xE53935 : 0x1E88E5, shininess: 60 });
      const white = new T.MeshPhongMaterial({ color: 0xEEEEEE });
      const arc = new T.Mesh(new T.TorusGeometry(0.5, 0.2, 10, 20, Math.PI), red); grp.add(arc);
      for (const k of [-1, 1]) {
        const leg = new T.Mesh(new T.BoxGeometry(0.4, 0.5, 0.4), red); leg.position.set(k * 0.5, -0.25, 0); grp.add(leg);
        const tip = new T.Mesh(new T.BoxGeometry(0.4, 0.2, 0.4), white); tip.position.set(k * 0.5, -0.6, 0); grp.add(tip);
      }
      grp.position.set(el.at[0], el.at[1] + 2.4, el.at[2]); v.scene.add(grp);
      const r = el.radius ?? 4;
      const ring = new T.Mesh(new T.RingGeometry(r - 0.12, r, 48), new T.MeshBasicMaterial({ color: red.color, transparent: true, opacity: 0.35, side: T.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.set(el.at[0], el.at[1] + 0.03, el.at[2]); v.scene.add(ring);
      let t = 0;
      return { tick(dt) { t += dt; grp.rotation.y += dt * 1.5; grp.position.y = el.at[1] + 2.4 + Math.sin(t * 2) * 0.15; ring.material.opacity = el.inside ? 0.7 : 0.35; } };
    }
  },

  // Kanone: Murmel rollt hinein, wird geladen und im Bogen genau auf target geschossen.
  // at = Bodenpunkt der Kanone, target = Bodenpunkt, wo die Murmel landet, time = Flugzeit s
  // {type:'kanone', at, target, time?}
  kanone: {
    init(el, g) {
      const T = el.time ?? 1.4, base = add(el.at, [0, 0.9, 0]), aim = add(el.target, [0, R, 0]);
      let dir = norm(sub(aim, base)), v0;
      for (let i = 0; i < 3; i++) { // Mündung hängt von der Richtung ab: zweimal nachrechnen
        const muzzle = add(base, scale(dir, 1.6));
        v0 = add(scale(sub(aim, muzzle), 1 / T), [0, 0.5 * g.G * T, 0]);
        dir = norm(v0);
      }
      Object.assign(el, { base, dir, v0, muzzle: add(base, scale(dir, 1.6)) });
    },
    reset(el) { el.state = 'bereit'; el.t = 0; },
    pre(el, g) { if (el.state === 'laden') setBall(g, el.base); },
    step(el, g, h, ev) {
      const p = g.ball.position;
      el.t += h;
      if (el.state === 'bereit') {
        if (Math.hypot(p.x - el.base[0], p.z - el.base[2]) < 1.1 && Math.abs(p.y - el.base[1]) < 1.2) { el.state = 'laden'; el.t = 0; g.lock = true; ev.push('laden'); }
      } else if (el.state === 'laden') {
        setBall(g, el.base); g.hitCool = 0.3;
        if (el.t > 0.8) {
          g.ball.position.set(...el.muzzle); g.ball.velocity.set(...el.v0);
          el.state = 'flug'; el.t = 0; ev.push('boom');
        }
      } else if (el.state === 'flug') {
        if ((g.groundBody && el.t > 0.2) || el.t > 5 || !g.lock) {
          g.lock = false; el.state = 'pause'; el.t = 0;
        }
      } else if (el.state === 'pause' && el.t > 1.5) el.state = 'bereit';
    },
    view(el, v) {
      const T = v.THREE, grp = new T.Group();
      const dark = new T.MeshPhongMaterial({ color: 0x37474F, shininess: 50 });
      const barrel = new T.Mesh(new T.CylinderGeometry(0.75, 0.9, 2.4, 20, 1, true), dark);
      barrel.material.side = T.DoubleSide;
      barrel.position.set(0, 0.4, 0); grp.add(barrel);
      const rim = new T.Mesh(new T.TorusGeometry(0.75, 0.12, 8, 24), new T.MeshPhongMaterial({ color: 0xFFC928 }));
      rim.rotation.x = Math.PI / 2; rim.position.y = 1.6; grp.add(rim);
      grp.position.set(...el.base);
      grp.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(...el.dir));
      v.scene.add(grp);
      const foot = new T.Mesh(new T.CylinderGeometry(1.1, 1.3, 0.5, 20), v.mats.pole);
      foot.position.set(el.at[0], el.at[1] + 0.25, el.at[2]); v.scene.add(foot);
      // Zielkreis
      const ring = new T.Mesh(new T.RingGeometry(0.9, 1.2, 32), new T.MeshBasicMaterial({ color: 0xFFC928, side: T.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.set(el.target[0], el.target[1] + 0.03, el.target[2]); v.scene.add(ring);
      let s = 1;
      return { tick(dt) { const want = el.state === 'laden' ? 1.12 : 1; s += (want - s) * Math.min(1, dt * 10); grp.scale.set(s, 1, s); } };
    }
  },

  // Dominos: Reihe von Steinen, die umfallen. {type:'domino', from, to, count?, size?:[b,h,t]}
  domino: {
    init(el, g) {
      const C = g.C, n = el.count ?? 8, [b, hh, t] = el.size || [1.2, 1.8, 0.3], yaw = segment(el.from, el.to).yaw;
      const cols = ['rot', 'gelb', 'blau', 'gruen', 'orange', 'lila'];
      el.q = quatYawPitch(yaw, 0);
      el.bodies = [];
      for (let i = 0; i < n; i++) {
        const body = new C.Body({ mass: 0.25, material: g.matFor('normal'), shape: new C.Box(new C.Vec3(b / 2, hh / 2, t / 2)) });
        body.collisionFilterGroup = 4; body.collisionFilterMask = 1 | 2 | 4;
        body.home = add(lerp3(el.from, el.to, n > 1 ? i / (n - 1) : 0), [0, hh / 2, 0]);
        body.looks = ['klotz-' + cols[i % cols.length]];
        body.userData = {};
        g.world.addBody(body); el.bodies.push(body);
      }
    },
    reset(el) {
      el.fallen = el.bodies.map(() => false);
      for (const b of el.bodies) {
        b.position.set(...b.home); b.quaternion.set(...el.q);
        b.velocity.set(0, 0, 0); b.angularVelocity.set(0, 0, 0); b.wakeUp && b.wakeUp();
      }
    },
    // Das Kippen verschiebt die Schwerkraft der ganzen Welt, gilt aber nur für die Murmel:
    // Dominos bekommen die Gegenkraft, sonst fallen sie schon beim Anrollen ohne Berührung um.
    pre(el, g) {
      const gr = g.world.gravity;
      for (const b of el.bodies) { b.force.x -= b.mass * gr.x; b.force.y += b.mass * (-gr.y - g.gy); b.force.z -= b.mass * gr.z; }
    },
    step(el, g, h, ev) {
      el.bodies.forEach((b, i) => {
        if (!el.fallen[i] && Math.hypot(b.angularVelocity.x, b.angularVelocity.z) > 1.5) { el.fallen[i] = true; g.tockIdx = i; ev.push('tock'); }
      });
    },
    view(el, v) {
      const groups = el.bodies.map(b => v.bodyGroup(b));
      return { tick() { groups.forEach(x => x.tick()); } };
    }
  }
};


