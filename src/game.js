// Physik + Spiellogik ohne Grafik. Läuft im Browser und headless (Node) mit CANNON.
import { TYPES } from './elements.js';
import { add } from './math.js';

export const R = 0.5;
export const G = 9.82;
export const MAX_TILT = 25 * Math.PI / 180;
export const H = 1 / 60; // fester Physikschritt

// Oberflächen: friction/restitution für die Physik,
// grip = wie stark die Steuerung wirkt, drag = Abbremsen pro Sekunde (negativ = gleitet länger).
export const SURFACES = {
  normal: { friction: 0.4, restitution: 0.15, grip: 1, drag: 0 },
  eis: { friction: 0.02, restitution: 0.1, grip: 0.45, drag: -0.1 },
  schlamm: { friction: 0.9, restitution: 0, grip: 1, drag: 2.2 }
};

export function createGame(CANNON, level) {
  const world = new CANNON.World();
  world.gravity.set(0, -G, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 12;

  const mBall = new CANNON.Material('ball');
  const surfaceMat = {};
  const matFor = name => {
    const key = SURFACES[name] ? name : 'normal';
    if (!surfaceMat[key]) {
      const s = SURFACES[key];
      surfaceMat[key] = new CANNON.Material(key);
      world.addContactMaterial(new CANNON.ContactMaterial(surfaceMat[key], mBall, { friction: s.friction, restitution: s.restitution }));
    }
    return surfaceMat[key];
  };

  const g = {
    C: CANNON, world, level, matFor, els: [], solids: [], checkpoints: [], switches: {},
    st: { stars: 0, starTotal: 0, cp: -1, won: false },
    groundBody: null, touchBody: null, surface: SURFACES.normal,
    track: { yaw: (level.startYaw || 0) * Math.PI / 180, lateral: 0 }
  };

  level.parts.forEach((d, i) => {
    const t = TYPES[d.type];
    if (!t) throw new Error(`Level "${level.id}": unbekanntes Bauteil "${d.type}" (Teil ${i})`);
    const el = { ...d, index: i };
    g.els.push(el);
    for (const s of (t.solids ? t.solids(el) : [])) {
      g.solids.push(s);
      if (s.deko) continue;
      const body = new CANNON.Body({ mass: 0, material: matFor(s.surface), shape: new CANNON.Box(new CANNON.Vec3(...s.half)) });
      body.position.set(...s.pos);
      body.quaternion.set(...s.quat);
      body.collisionFilterGroup = 1; body.collisionFilterMask = 2;
      body.userData = s;
      world.addBody(body);
    }
  });
  for (const el of g.els) TYPES[el.type].init?.(el, g);

  const ball = new CANNON.Body({ mass: 1, material: mBall, shape: new CANNON.Sphere(R), linearDamping: 0.12, angularDamping: 0.3 });
  ball.collisionFilterGroup = 2; ball.collisionFilterMask = 1;
  world.addBody(ball);
  g.ball = ball;

  const killY = level.killY ?? -8;
  const spawnPoint = () => add(g.st.cp < 0 ? level.start : g.checkpoints[g.st.cp].at, [0, 1, 0]);
  let acc = 0;

  g.spawn = p => {
    ball.position.set(...p); ball.velocity.set(0, 0, 0); ball.angularVelocity.set(0, 0, 0);
    g.groundBody = g.touchBody = null;
  };
  g.reset = () => {
    Object.assign(g.st, { stars: 0, cp: -1, won: false });
    g.switches = {}; acc = 0; g.time = 0;
    g.track.yaw = (level.startYaw || 0) * Math.PI / 180;
    for (const el of g.els) TYPES[el.type].reset?.(el, g);
    g.spawn(spawnPoint());
  };

  // Welcher Körper berührt die Murmel? (Boden = Berührung von unten)
  function contacts() {
    let best = null, bestNy = -2, ground = null;
    for (const c of world.contacts) {
      let other = null, ny = 0;
      if (c.bi === ball) { other = c.bj; ny = -c.ni.y; } else if (c.bj === ball) { other = c.bi; ny = c.ni.y; }
      if (!other) continue;
      if (ny > bestNy) { bestNy = ny; best = other; }
      if (ny > 0.3) ground = other;
    }
    g.touchBody = best; g.groundBody = ground;
    const u = best && best.userData;
    if (u && u.track) {
      const tr = u.track, p = ball.position;
      g.track.yaw = tr.yaw;
      g.track.lateral = (p.x - tr.mid[0]) * tr.right[0] + (p.y - tr.mid[1]) * tr.right[1] + (p.z - tr.mid[2]) * tr.right[2];
    }
    g.surface = SURFACES[ground && ground.userData && ground.userData.surface] || SURFACES.normal;
  }

  function substep(ix, iz, ev) {
    const grip = g.surface.grip;
    world.gravity.set(Math.sin(MAX_TILT) * G * ix * grip, -G, Math.sin(MAX_TILT) * G * iz * grip);
    for (const el of g.els) TYPES[el.type].pre?.(el, g, H);
    world.step(H);
    g.time += H;
    contacts();
    if (g.surface.drag) { const f = Math.exp(-g.surface.drag * H); ball.velocity.x *= f; ball.velocity.z *= f; }
    for (const el of g.els) TYPES[el.type].step?.(el, g, H, ev);
    if (ball.position.y < killY) { g.spawn(spawnPoint()); ev.push('fall'); }
  }

  // ix/iz: Eingabe in Welt-Richtung (-1..1), x = rechts, z = nach hinten
  g.step = (ix, iz, dt) => {
    const ev = [];
    acc += dt;
    let n = 0;
    while (acc >= H - 1e-9 && n < 4) { substep(ix, iz, ev); acc -= H; n++; }
    if (n === 4) acc = Math.min(acc, H);
    return ev;
  };
  return g;
}
