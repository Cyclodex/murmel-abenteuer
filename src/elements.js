// Alle Bauteile, die in Level-Daten vorkommen dürfen.
// Ein Bauteil-Typ kann haben:
//   solids(d)            -> feste Klötze [{pos, half, quat, look, surface}] (Physik + Grafik automatisch)
//   init(el, g)          -> Zustand anlegen (einmal)
//   reset(el, g)         -> Zustand auf Anfang (bei Neustart)
//   step(el, g, dt, ev)  -> Spiellogik pro Physikschritt, Ereignisse in ev schreiben
//   view(el, v)          -> zusätzliche Grafik; darf {tick(dt, g)} zurückgeben
// Winkel in Level-Daten sind in Grad.
import { DEG, quatYawPitch, rotate, add, scale, yawOf, toLocal } from './math.js';

const R = 0.5; // Murmel-Radius

function segment(from, to, fallbackYaw) {
  const dx = to[0] - from[0], dy = to[1] - from[1], dz = to[2] - from[2];
  const hl = Math.hypot(dx, dz);
  const yaw = hl > 1e-6 ? yawOf(dx, dz) : (fallbackYaw || 0) * DEG;
  const pitch = Math.atan2(dy, hl);
  const q = quatYawPitch(yaw, pitch);
  return { q, L: Math.hypot(hl, dy), mid: scale(add(from, to), 0.5), up: rotate(q, [0, 1, 0]), right: rotate(q, [1, 0, 0]), yaw, pitch };
}

export const TYPES = {
  // Weg von A nach B (Oberkante). Wenn die Höhe sich ändert, wird er zur Rampe.
  // {type:'weg', from, to, width, walls?:Höhe, caps?:'start'|'end'|'both', thick?, surface?}
  weg: {
    solids(d) {
      const s = segment(d.from, d.to), w = d.width ?? 4, th = d.thick ?? 1, look = d.look || (Math.abs(s.pitch) > 1e-3 ? 'ramp' : 'floor');
      const out = [{ pos: add(s.mid, scale(s.up, -th / 2)), half: [w / 2, th / 2, s.L / 2], quat: s.q, look, surface: d.surface }];
      const h = d.walls || 0;
      if (h > 0) {
        for (const k of [-1, 1]) out.push({ pos: add(add(s.mid, scale(s.right, k * (w / 2 + 0.2))), scale(s.up, h / 2)), half: [0.2, h / 2, s.L / 2], quat: s.q, look: 'wall' });
        const cap = p => out.push({ pos: add(p, scale(s.up, h / 2)), half: [w / 2 + 0.4, h / 2, 0.2], quat: s.q, look: 'wall' });
        if (d.caps === 'start' || d.caps === 'both') cap(d.from);
        if (d.caps === 'end' || d.caps === 'both') cap(d.to);
      }
      return out;
    }
  },

  // Einzelne Wand von A nach B (Unterkante). {type:'wand', from, to, height, thick?}
  wand: {
    solids(d) {
      const s = segment(d.from, d.to), h = d.height ?? 0.8, t = d.thick ?? 0.4;
      return [{ pos: add(s.mid, scale(s.up, h / 2)), half: [t / 2, h / 2, s.L / 2], quat: s.q, look: 'wall' }];
    }
  },

  // Klotz: Mittelpunkt + Grösse. {type:'klotz', at, size:[b,h,t], yaw?, look?, surface?}
  klotz: {
    solids(d) {
      return [{ pos: d.at, half: scale(d.size, 0.5), quat: quatYawPitch((d.yaw || 0) * DEG, 0), look: d.look || 'floor', surface: d.surface }];
    }
  },

  // Stern zum Sammeln. {type:'stern', at}
  stern: {
    init(el, g) { g.st.starTotal++; },
    reset(el) { el.got = false; },
    step(el, g, dt, ev) {
      const p = g.ball.position, s = el.at;
      if (!el.got && Math.hypot(p.x - s[0], p.y - s[1], p.z - s[2]) < 1.1) { el.got = true; g.st.stars++; ev.push('star'); }
    },
    view(el, v) {
      const m = new v.THREE.Mesh(v.starGeo, v.mats.star);
      m.position.set(...el.at); v.scene.add(m);
      return { tick(dt) { m.visible = !el.got; m.rotation.y += dt * 2; } };
    }
  },

  // Checkpoint: Zone auf einer Fläche (at = Punkt auf der Oberfläche, dort wird neu gestartet).
  // {type:'checkpoint', at, size?:[b,h,t], yaw?}
  checkpoint: {
    init(el, g) { el.order = g.checkpoints.push(el) - 1; },
    reset(el) { el.active = false; },
    step(el, g, dt, ev) {
      if (el.order <= g.st.cp) return;
      const size = el.size || [6, 3, 3];
      const l = toLocal([g.ball.position.x, g.ball.position.y, g.ball.position.z], el.at, (el.yaw || 0) * DEG);
      if (Math.abs(l[0]) < size[0] / 2 && l[1] > 0 && l[1] < size[1] && Math.abs(l[2]) < size[2] / 2) {
        for (const c of g.checkpoints) if (c.order <= el.order) c.active = true;
        g.st.cp = el.order; ev.push('cp');
      }
    },
    view(el, v) {
      const T = v.THREE, size = el.size || [6, 3, 3], q = quatYawPitch((el.yaw || 0) * DEG, 0);
      const base = add(el.at, rotate(q, [size[0] / 2 - 0.3, 0, 0]));
      const pole = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 1.6, 8), v.mats.wall);
      pole.position.set(base[0], base[1] + 0.8, base[2]);
      const flagMat = new T.MeshLambertMaterial({ color: 0xBBBBBB });
      const flag = new T.Mesh(new T.BoxGeometry(0.05, 0.45, 0.65), flagMat);
      flag.position.set(base[0], base[1] + 1.35, base[2] + 0.33);
      v.scene.add(pole, flag);
      return { tick() { flagMat.color.setHex(el.active ? 0x3BB273 : 0xBBBBBB); } };
    }
  },

  // Trampolin: Rechteck auf dem Boden. {type:'trampolin', at, size:[b,t], yaw?, jump?, push?}
  // push = Schwung in Blickrichtung (yaw 0 = nach vorne, -z).
  trampolin: {
    reset(el) { el.cool = 0; },
    step(el, g, dt, ev) {
      el.cool -= dt;
      const p = g.ball.position, v = g.ball.velocity, yaw = (el.yaw || 0) * DEG;
      const l = toLocal([p.x, p.y, p.z], el.at, yaw);
      if (el.cool <= 0 && Math.abs(l[0]) < el.size[0] / 2 && Math.abs(l[2]) < el.size[1] / 2 && l[1] < R + 0.15) {
        const f = [-Math.sin(yaw), -Math.cos(yaw)];          // Vorwärtsrichtung (x, z)
        const along = Math.max(0, v.x * f[0] + v.z * f[1]);   // Schwung nach vorne bleibt
        const px = v.x - (v.x * f[0] + v.z * f[1]) * f[0], pz = v.z - (v.x * f[0] + v.z * f[1]) * f[1];
        const fw = along + (el.push ?? 4);
        v.set(px * 0.3 + f[0] * fw, el.jump ?? 11, pz * 0.3 + f[1] * fw);
        el.cool = 0.5; ev.push('jump');
      }
    },
    view(el, v) {
      const m = new v.THREE.Mesh(new v.THREE.BoxGeometry(el.size[0], 0.06, el.size[1]), v.mats.pad);
      m.position.set(el.at[0], el.at[1] + 0.03, el.at[2]); m.rotation.y = (el.yaw || 0) * DEG; v.scene.add(m);
    }
  },

  // Ziel-Ring. {type:'ziel', at, r?}
  ziel: {
    reset(el) { el.done = false; },
    step(el, g, dt, ev) {
      const p = g.ball.position, a = el.at, r = el.r ?? 1.2;
      if (!el.done && !g.st.won && Math.hypot(p.x - a[0], p.z - a[2]) < r && p.y < a[1] + 1.2 && p.y > a[1] - 1) {
        el.done = true; g.st.won = true; ev.push('win');
      }
    },
    view(el, v) {
      const T = v.THREE, r = el.r ?? 1.2;
      const ring = new T.Mesh(new T.TorusGeometry(r, 0.15, 12, 40), v.mats.goal);
      ring.rotation.x = -Math.PI / 2; ring.position.set(el.at[0], el.at[1] + 0.05, el.at[2]);
      const flag = new T.Mesh(new T.ConeGeometry(0.5, 1, 3), v.mats.goalFlag);
      flag.position.set(el.at[0], el.at[1] + 2.2, el.at[2]);
      v.scene.add(ring, flag); v.goal = ring;
      return { tick(dt) { flag.rotation.y += dt; } };
    }
  }
};
