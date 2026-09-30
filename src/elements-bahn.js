// Kugelbahn-Teile: Spiraltrichter und Rinne (schmal = Rutsche, breit = Halfpipe).
// Physik aus vielen schmalen Klötzen (hide), Grafik als glatte Fläche. Gleiche Schnittstelle wie in elements.js.
import { DEG, add, sub, scale, fwdOf, rightOf, quatYawPitch } from './math.js';
import { segment } from './elements.js';

const R = 0.5;
const dirOf = a => [Math.cos(a), 0, Math.sin(a)];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = v => { const l = Math.hypot(...v) || 1; return scale(v, 1 / l); };
// Quaternionen multiplizieren (a danach b in lokalen Achsen)
const mulQ = (a, b) => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
];

// Drehkörper aus Ringen: prof = [[radius, höhe], ...] von innen nach aussen, c = Mitte unten.
// Pro Winkelstück und Ring ein schräger Klotz (Oberkante = Fläche). skip(a) = Winkel a auslassen.
export function ringSolids(c, prof, { n = 32, skip = () => false, surface, look = 'floor', th = 0.4 } = {}) {
  const out = [];
  for (let k = 0; k < n; k++) {
    const a = (k + 0.5) * 2 * Math.PI / n;
    if (skip(a)) continue;
    const u = dirOf(a);
    for (let i = 0; i + 1 < prof.length; i++) {
      const [x0, y0] = prof[i], [x1, y1] = prof[i + 1], m = (y1 - y0) / (x1 - x0);
      // an den Enden 5 cm verlängern (keine Spalten), aber nur wo die Fläche nach aussen steiler wird (wie in einer
      // Schüssel): wird sie flacher (Trichter), ragte die Verlängerung als Grat über die nächste Fläche
      const steiler = j => j > 0 && j < prof.length - 1 && (prof[j + 1][1] - prof[j][1]) / (prof[j + 1][0] - prof[j][0]) > (prof[j][1] - prof[j - 1][1]) / (prof[j][0] - prof[j - 1][0]) + 1e-9;
      const e0 = i === 0 || steiler(i) ? 0.05 : 0, e1 = i + 2 === prof.length || steiler(i + 1) ? 0.05 : 0;
      const d = Math.hypot(1, m), q0 = [x0 - e0 / d, y0 - e0 * m / d], q1 = [x1 + e1 / d, y1 + e1 * m / d];
      const s = segment(add(c, add(scale(u, q0[0]), [0, q0[1], 0])), add(c, add(scale(u, q1[0]), [0, q1[1], 0])));
      const wid = 2 * x1 * Math.sin(Math.PI / n) + 0.1;
      out.push({ pos: add(s.mid, scale(s.up, -th / 2)), half: [wid / 2, th / 2, s.L / 2], quat: s.q, look, surface, hide: true, rund: true });
    }
  }
  return out;
}

// Lücken (offen = Liste von yaw in Grad) als Test für einen Winkel a der Ringe
export function gapTest(offen, breite, radius, n) {
  const gaps = (offen || []).map(y => { const f = fwdOf(y * DEG); return Math.atan2(f[2], f[0]); });
  const half = breite / 2 / radius + Math.PI / n;
  return a => gaps.some(ga => Math.abs(Math.atan2(Math.sin(a - ga), Math.cos(a - ga))) < half);
}

// Streifen-Textur (Kugelbahn-Kunststoff)
const stripes = (v, c1, c2, n = 8, dir = 'x') => v.canvasTex(64, 64, (x, W, H) => {
  x.fillStyle = c1; x.fillRect(0, 0, W, H); x.fillStyle = c2;
  for (let i = 0; i < n; i += 2) dir === 'x' ? x.fillRect(i * W / n, 0, W / n, H) : x.fillRect(0, i * H / n, W, H / n);
});
const hex = c => '#' + c.toString(16).padStart(6, '0');
const lighter = c => { const r = c >> 16, g = (c >> 8) & 255, b = c & 255, f = x => Math.min(255, Math.round(x + (255 - x) * 0.45)); return (f(r) << 16) | (f(g) << 8) | f(b); };

// Rinne: Pfad aus Stücken (unten Mitte) -> Rahmen je Stück
function rinnePath(d) {
  if (d.from) return [[d.from, d.to]];
  const h0 = (d.yaw || 0) * DEG, T = Math.abs(d.turn) * DEG, s = Math.sign(d.turn), r = d.radius ?? 6, rise = d.rise || 0;
  const n = Math.max(2, Math.ceil(Math.abs(d.turn) / 10)), R0 = rightOf(h0), F0 = fwdOf(h0), C = add(d.at, scale(R0, s * r));
  const P = phi => add(add(C, add(scale(R0, -s * Math.cos(phi) * r), scale(F0, Math.sin(phi) * r))), [0, rise * phi / T, 0]);
  const out = [];
  for (let k = 0; k < n; k++) out.push([P(k * T / n), P((k + 1) * T / n)]);
  return out;
}
// Querschnitt: Winkel der Latten (0 = unten), eine Latte genau unten, dazu je Seite m Latten bis zum Rand (bogen)
function rinneSlats(d) {
  const bogen = (d.bogen ?? 75) * DEG, m = Math.max(1, Math.round(bogen / (12 * DEG))), dphi = bogen / (m + 0.5);
  const out = [];
  for (let j = -m; j <= m; j++) out.push(j * dphi);
  return { phis: out, dphi, bogen };
}

export const BAHN = {
  // Rinne mit rundem Querschnitt (Radius r): schmal als Rutsche, breit als Halfpipe. Gerade (from, to = Mitte unten)
  // oder als Kurve/Spirale (at, yaw, turn, radius = bis zur Mitte, rise). bogen = Grad je Seite (90 = senkrechter Rand).
  // Wer schnell ist, fährt in der Kurve die Wand hoch; in der Halfpipe pendelt die Murmel von Seite zu Seite.
  // {type:'rinne', from?, to?, at?, yaw?, turn?, radius?, rise?, r?, bogen?, surface?, farbe?}
  rinne: {
    solids(d) {
      const r = d.r ?? 1.6, th = 0.4, { phis, dphi } = rinneSlats(d), out = [], turnS = d.turn ? Math.sign(d.turn) : 0;
      const segs = rinnePath(d);
      const dT = d.turn ? Math.abs(d.turn) * DEG / segs.length : 0;
      for (const [pa, pb] of segs) {
        const sg = segment(pa, pb), tr = { yaw: sg.yaw, mid: sg.mid, right: sg.right };
        for (const phi of phis) {
          const lat = r * Math.sin(phi), rad = (d.radius ?? 6) - turnS * lat;
          const L = d.turn ? (2 * rad * Math.sin(dT / 2) + 0.06) / Math.cos(sg.pitch) : sg.L + 0.02;
          const S = add(add(sg.mid, scale(sg.right, lat)), scale(sg.up, r * (1 - Math.cos(phi))));
          const N = add(scale(sg.right, -Math.sin(phi)), scale(sg.up, Math.cos(phi)));
          const q = mulQ(sg.q, [0, 0, Math.sin(phi / 2), Math.cos(phi / 2)]);
          // Seitenlatten ohne Hangabtrieb (pendel), sonst schaukelt sich die Murmel von Seite zu Seite auf
          out.push({ pos: add(S, scale(N, -th / 2)), half: [r * Math.sin(dphi / 2) + 0.04, th / 2, L / 2], quat: q, look: 'floor', surface: d.surface || 'kunststoff', hide: true, rund: true, track: tr, pendel: Math.abs(phi) > 0.2 });
        }
      }
      return out;
    },
    view(el, v) {
      const T = v.THREE, r = el.r ?? 1.6, { bogen } = rinneSlats(el), m = 16;
      // Rahmen entlang des Pfads: Punkt unten Mitte, rechts (waagrecht), oben (senkrecht zur Bahn)
      const frames = [];
      if (el.from) {
        const s = segment(el.from, el.to);
        for (const p of [el.from, el.to]) frames.push({ p, right: s.right, up: s.up });
      } else {
        const h0 = (el.yaw || 0) * DEG, TT = Math.abs(el.turn) * DEG, sg = Math.sign(el.turn), rr = el.radius ?? 6, rise = el.rise || 0;
        const R0 = rightOf(h0), F0 = fwdOf(h0), C = add(el.at, scale(R0, sg * rr)), n = Math.max(2, Math.ceil(Math.abs(el.turn) / 5));
        for (let k = 0; k <= n; k++) {
          const phi = k * TT / n, p = add(add(C, add(scale(R0, -sg * Math.cos(phi) * rr), scale(F0, Math.sin(phi) * rr))), [0, rise * phi / TT, 0]);
          const t = norm(add(add(scale(R0, sg * Math.sin(phi) * rr), scale(F0, Math.cos(phi) * rr)), [0, rise / TT, 0])); // Tangente
          const right = norm(cross(t, [0, 1, 0])), up = cross(right, t);
          frames.push({ p, right, up });
        }
      }
      const pos = [], uv = [], idx = [];
      let len = 0;
      frames.forEach((f, i) => {
        if (i > 0) len += Math.hypot(...sub(f.p, frames[i - 1].p));
        for (let j = 0; j <= m; j++) {
          const phi = -bogen + 2 * bogen * j / m, q = add(add(f.p, scale(f.right, r * Math.sin(phi))), scale(f.up, r * (1 - Math.cos(phi))));
          pos.push(...q); uv.push(j / m, len / 2);
        }
      });
      for (let i = 0; i + 1 < frames.length; i++) for (let j = 0; j < m; j++) {
        const a = i * (m + 1) + j, b = a + m + 1;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
      const geo = new T.BufferGeometry();
      geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
      geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
      geo.setIndex(idx); geo.computeVertexNormals();
      const col = el.farbe ?? 0x42A5F5, tex = stripes(v, hex(col), hex(lighter(col)), 4, 'y');
      tex.wrapS = tex.wrapT = T.RepeatWrapping;
      const mesh = new T.Mesh(geo, new T.MeshPhongMaterial({ map: tex, shininess: 90, specular: 0x555555, side: T.DoubleSide }));
      mesh.receiveShadow = true; mesh.castShadow = true;
      v.scene.add(mesh); v.blocker?.(mesh); // z. B. obere Runde einer Spirale: Kamera rückt davor näher an die Murmel
    }
  },

  // Spiraltrichter wie bei der Kugelbahn: at = Mitte des Lochs (Höhe des Lochrands), R = Radius oben, h = Höhe oben,
  // loch = Lochradius, rim = flacher Rand, wand = Bande am Rand (offen = yaw der Einfahrten, dort keine Bande).
  // Die Wand wird zur Mitte immer steiler (wie ein Schwerkraft-Trichter): tangential hinein kreist die Murmel
  // immer schneller hinunter und fällt durchs Loch. Darunter einen Weg legen.
  // {type:'trichter', at, R?, h?, loch?, rim?, wand?, offen?, luecke?, surface?, farbe?}
  trichter: {
    profil(d) {
      const Rr = d.R ?? 6, h = d.h ?? 3.5, lo = d.loch ?? 0.9, rim = d.rim ?? 1.2, n = 9, k = 1 / lo - 1 / Rr, prof = [];
      for (let i = 0; i <= n; i++) {
        const x = lo * Math.pow(Rr / lo, i / n); // dichter zur Mitte hin
        // 70 % Schwerkraft-Trichter (innen steil) + 30 % Kegel (aussen nicht zu flach, sonst bleibt die Murmel liegen)
        prof.push([x, h * (0.7 * (1 / lo - 1 / x) / k + 0.3 * (x - lo) / (Rr - lo))]);
      }
      if (rim > 0) prof.push([Rr + rim, h + rim * 0.12]); // Rand leicht nach innen geneigt
      return prof;
    },
    solids(d) {
      const Rr = d.R ?? 6, h = d.h ?? 3.5, rim = d.rim ?? 1.2, wand = d.wand ?? 0.8, n = 40, prof = BAHN.trichter.profil(d);
      const out = ringSolids(d.at, prof, { n, surface: d.surface || 'trichter' }), top = prof[prof.length - 1][1];
      const skip = gapTest(d.offen, d.luecke ?? 3, Rr + rim, n);
      for (let k = 0; k < n; k++) {
        const a = (k + 0.5) * 2 * Math.PI / n;
        if (wand <= 0 || skip(a)) continue;
        const u = dirOf(a), q = quatYawPitch(Math.atan2(-u[0], -u[2]), 0), wr = 2 * (Rr + rim) * Math.sin(Math.PI / n) + 0.1;
        out.push({ pos: add(add(d.at, scale(u, Rr + rim + 0.15)), [0, top + wand / 2 - 0.2, 0]), half: [wr / 2, wand / 2 + 0.2, 0.15], quat: q, look: 'wall' });
      }
      return out;
    },
    view(el, v) {
      const T = v.THREE, prof = BAHN.trichter.profil(el);
      const pts = prof.map(([x, y]) => new T.Vector2(x, y));
      // Spiralstreifen (schräge Streifen in u = rundherum, v = von innen nach aussen) zeigen, wie die Murmel kreist
      const col = el.farbe ?? 0xFFB300, c1 = hex(col), c2 = hex(lighter(col));
      const tex = v.canvasTex(128, 128, (x, W, H) => {
        x.fillStyle = c1; x.fillRect(0, 0, W, H); x.fillStyle = c2;
        for (let i = -8; i < 8; i += 2) { x.beginPath(); x.moveTo(i * W / 8, 0); x.lineTo((i + 1) * W / 8, 0); x.lineTo((i + 1) * W / 8 + W, H); x.lineTo(i * W / 8 + W, H); x.fill(); }
      });
      tex.wrapS = tex.wrapT = T.RepeatWrapping;
      const mesh = new T.Mesh(new T.LatheGeometry(pts, 64), new T.MeshPhongMaterial({ map: tex, shininess: 90, specular: 0x555555, side: T.DoubleSide }));
      mesh.position.set(...el.at); mesh.receiveShadow = true; mesh.castShadow = true;
      v.scene.add(mesh); v.blocker?.(mesh);
      // Ring um das Loch
      const ring = new T.Mesh(new T.TorusGeometry(el.loch ?? 0.9, 0.08, 8, 32), new T.MeshPhongMaterial({ color: 0x37474F, shininess: 60 }));
      ring.rotation.x = Math.PI / 2; ring.position.set(...el.at); v.scene.add(ring);
    }
  }
};
