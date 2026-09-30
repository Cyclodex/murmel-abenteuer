// Treppe: alle Murmeln fallen gleichzeitig eine Treppe hinunter (Vergleich + Hintergrund der Menüs).
// Jede Murmel hat ihre eigene Physik-Welt mit derselben Treppe, so stören sie sich nicht.
import { createGame } from './game.js';
import { createView, createBallMesh } from './view.js';
import { canvasTex, COLORS } from './themes.js';

export const STEPS = 12, TREAD = 1.2, RISE = 1, LANE = 1.15, RUN = 12;
const ROUND = 11;  // Sekunden, dann starten alle wieder oben (die Domino-Kette ist nach gut 8 s umgefallen)
const PUSH = 0.3;  // leichte Neigung nach vorne (Anteil der Kipp-Eingabe), damit sie in Schwung kommen
const GLASS = 10;  // Glaswand am Ende des Auslaufs: Flummi, Pingpong und Basketball springen dort bis 7.4 m hoch
const DECK = -1.2, DEPTH = 5.5; // Domino-Podest vor der Glaswand: Oberkante, Tiefe
const width = n => n * LANE + 1.2;

// Treppe nach vorne (+z) hinunter (12 m hoch, 40° steil), unten ein Auslauf mit Lego-Seitenwänden und einer
// Glaswand, an der die Murmeln zurückprallen. Davor ein tieferes Podest für die Domino-Kette (nur Grafik).
export function treppenLevel(n) {
  const w = width(n), top = STEPS * RISE, parts = [];
  for (let k = 0; k < STEPS; k++) {
    const y = top - k * RISE, z0 = -STEPS * TREAD + k * TREAD;
    parts.push({ type: 'weg', from: [0, y, z0], to: [0, y, z0 + TREAD], width: w, walls: 1, thick: y + 1, caps: k === 0 ? 'start' : undefined });
  }
  const e = w / 2 + 0.4, zg = RUN + 0.2;
  parts.push(
    { type: 'weg', from: [0, 0, 0], to: [0, 0, RUN], width: w, walls: 3, thick: 1 },
    { type: 'wand', from: [-e, -1, zg], to: [e, -1, zg], height: GLASS + 1, look: 'glas' },
    // Rahmen der Scheibe
    { type: 'klotz', at: [-w / 2 - 0.2, (GLASS - 1) / 2, zg], size: [0.6, GLASS + 1, 0.6], look: 'lego-rot', deko: true },
    { type: 'klotz', at: [w / 2 + 0.2, (GLASS - 1) / 2, zg], size: [0.6, GLASS + 1, 0.6], look: 'lego-blau', deko: true },
    { type: 'klotz', at: [0, GLASS + 0.25, zg], size: [w + 1.4, 0.5, 0.6], look: 'lego-gelb', deko: true },
    { type: 'klotz', at: [0, DECK - 0.5, RUN + 0.4 + DEPTH / 2], size: [w + 0.8, 1, DEPTH], look: 'floor', deko: true }
  );
  return { id: 'treppe', name: 'Treppe', emoji: '🪜', theme: 'spielzimmer', start: [0, top, -STEPS * TREAD + 1], killY: -8, parts };
}

// Nur Physik (auch headless): games[i] gehört zu skins[i]
export function createTreppe(CANNON, skins) {
  const level = treppenLevel(skins.length);
  const games = skins.map(s => createGame(CANNON, level, s.ball));
  const t = {
    level, games, time: 0,
    laneX: i => (i - (skins.length - 1) / 2) * LANE,
    reset() {
      t.time = 0;
      games.forEach((g, i) => {
        g.reset(); g.brake = 0;
        g.spawn([t.laneX(i), STEPS * RISE + 0.6, -STEPS * TREAD + 0.8]);
        g.ball.velocity.set(0, 0, 3); // Schubs Richtung Treppe
      });
    },
    step(dt) {
      t.time += dt;
      if (t.time > ROUND) t.reset();
      for (const g of games) g.step(0, g.ball.position.z < 0 ? PUSH : 0, dt); // Neigung nur auf der Treppe
    }
  };
  t.reset();
  return t;
}

// Domino-Kette auf dem Podest: der mittlere Stein fällt, sobald die erste Murmel an die Scheibe prallt, dann laufen
// zwei Äste in Wellen nach links und rechts, die Steine werden dabei immer grösser. Nur Grafik, ohne Physik:
// jeder Stein kippt um seine vordere Unterkante, bis er auf dem nächsten liegt (der letzte fällt flach hin).
const DOT = [[], [[1, 1]], [[0, 0], [2, 2]], [[0, 0], [1, 1], [2, 2]], [[0, 0], [2, 0], [0, 2], [2, 2]],
  [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]]];
function createDominos(THREE, scene, w) {
  const H = 1.4, B = 0.7, T = 0.22, GAP = 0.62, GROW = 1.8; // Masse des ersten Steins, der letzte ist GROW-mal so gross
  const FALL = 0.35; // Sekunden, bis ein Stein der ersten Grösse liegt (grössere fallen langsamer)
  const lean = Math.acos(T / GAP), touch = Math.asin((GAP - T) / H); // Ruhewinkel, Winkel beim Anstossen des nächsten
  const cols = ['rot', 'orange', 'gelb', 'gruen', 'blau', 'lila'].map(c => COLORS[c]);
  const side = cols.map(c => new THREE.MeshLambertMaterial({ color: c })), faces = {};
  const face = (c, a, b) => faces[`${c}-${a}-${b}`] ||= new THREE.MeshLambertMaterial({
    map: canvasTex(THREE, 64, 128, (x, wd, ht) => {
      x.fillStyle = '#' + cols[c].toString(16).padStart(6, '0'); x.fillRect(0, 0, wd, ht);
      x.fillStyle = '#fff'; x.fillRect(8, ht / 2 - 2, wd - 16, 4);
      [a, b].forEach((n, k) => DOT[n].forEach(([i, j]) => { x.beginPath(); x.arc(14 + i * 18, 14 + j * 18 + k * ht / 2, 6, 0, 7); x.fill(); }));
    }, false)
  });
  // rechter Ast (x, z ab der Scheibe), der linke ist gespiegelt; gezeichnet für 14 Murmeln (17.3 m breit)
  const z0 = RUN + 0.4;
  const pts = [[0.4, 1.1], [1.2, 2.5], [2.4, 3.5], [3.7, 2.8], [4.7, 1.5], [5.9, 1.3], [7, 2.4], [7.5, 3.6]];
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x * w / 17.3, DECK, z0 + z)));
  const len = curve.getLength(), list = [];
  let n = 0;
  for (let s = 0; ; n++) { s += GAP * (1 + (GROW - 1) * s / len); if (s > len) break; }
  const geo = new THREE.BoxGeometry(B, H, T);
  const add = (x, z, dir, k, size, t0, last) => {
    const grp = new THREE.Group(), m = new THREE.Mesh(geo, [...Array(4).fill(side[k % 6]), face(k % 6, k % 7, (k * 3 + 2) % 7), face(k % 6, (k + 4) % 7, k % 7)]);
    m.position.set(0, H / 2, -T / 2); m.castShadow = true;
    grp.add(m); grp.scale.setScalar(size); grp.rotation.order = 'YXZ';
    grp.position.set(x, DECK, z); grp.rotation.y = Math.atan2(dir.x, dir.z);
    scene.add(grp);
    list.push({ grp, t0, end: last ? Math.PI / 2 : lean, dur: FALL * Math.sqrt(size) * (last ? 1.2 : 1) });
  };
  add(0, z0 + 0.35, new THREE.Vector3(0, 0, 1), 0, 1, 0, false);
  for (const sx of [1, -1]) {
    let s = 0, t0 = FALL * Math.sqrt(touch / lean); // der mittlere Stein stösst beide Äste an
    for (let k = 1; k <= n; k++) {
      const size = 1 + (GROW - 1) * s / len, u = s / len, p = curve.getPointAt(u), d = curve.getTangentAt(u);
      add(sx * p.x, p.z, new THREE.Vector3(sx * d.x, 0, d.z), k, size, t0, k === n);
      t0 += FALL * Math.sqrt(size) * Math.sqrt(touch / lean);
      s += GAP * size;
    }
  }
  let start = null;
  return {
    count: list.length, duration: Math.max(...list.map(d => d.t0 + d.dur)),
    get started() { return start !== null; },
    start(time) { start = time; },
    reset() { start = null; for (const d of list) d.grp.rotation.x = 0; },
    update(time) {
      if (start === null) return;
      for (const d of list) { const a = Math.max(0, Math.min(1, (time - start - d.t0) / d.dur)); d.grp.rotation.x = d.end * a * a; }
    }
  };
}

// Mit Grafik: Szene der ersten Welt + je eine Kugel pro Murmel, feste Kamera von vorne, 30° von oben, die alles zeigt
export function createTreppenView(THREE, CANNON, renderer, skins) {
  const t = createTreppe(CANNON, skins);
  const view = createView(THREE, renderer, t.games[0]);
  view.setSkin(skins[0]);
  const meshes = [view.ballMesh];
  skins.slice(1).forEach(s => { const b = createBallMesh(THREE); b.setSkin(s); view.scene.add(b.mesh); meshes.push(b.mesh); });
  Object.assign(view.sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, far: 100 });
  view.sun.shadow.camera.updateProjectionMatrix();
  const w = width(skins.length), dominos = createDominos(THREE, view.scene, w);
  // ganze Welt: von der obersten Stufe bis zum Podest, vom Podest bis über die Scheibe
  const lo = [-w / 2 - 0.8, DECK - 1, -STEPS * TREAD - 0.4], hi = [w / 2 + 0.8, GLASS + 0.5, RUN + 0.4 + DEPTH];
  const look = new THREE.Vector3((lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2);
  const PITCH = 30 * Math.PI / 180, back = [0, Math.sin(PITCH), Math.cos(PITCH)], up = [0, Math.cos(PITCH), -Math.sin(PITCH)];
  view.fixedCam = cam => {
    // so weit weg, dass alle Ecken ins Bild passen (Hochformat braucht mehr Abstand)
    const tv = Math.tan(cam.fov * Math.PI / 360), th = tv * cam.aspect;
    let d = 0;
    for (const x of [lo[0], hi[0]]) for (const y of [lo[1], hi[1]]) for (const z of [lo[2], hi[2]]) {
      const c = [x - look.x, y - look.y, z - look.z], dot = v => c[0] * v[0] + c[1] * v[1] + c[2] * v[2];
      d = Math.max(d, Math.max(Math.abs(c[0]) / th, Math.abs(dot(up)) / tv) * 1.05 + dot(back));
    }
    cam.position.set(look.x, look.y + d * back[1], look.z + d * back[2]);
    cam.lookAt(look);
    return look;
  };
  let last = 0;
  return {
    treppe: t, view, dominos,
    frame(dt) {
      t.step(dt);
      if (t.time < last) dominos.reset(); // neue Runde
      last = t.time;
      if (!dominos.started && t.games.some(g => g.ball.position.z > RUN - 0.6)) dominos.start(t.time); // erste Murmel an der Scheibe
      dominos.update(t.time);
      t.games.forEach((g, i) => {
        const b = g.ball, m = meshes[i];
        m.position.set(b.position.x, b.position.y, b.position.z);
        m.quaternion.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
      });
      view.render(dt, 0, 0, 0);
    },
    resize: () => view.resize(),
    dispose: () => view.dispose()
  };
}
