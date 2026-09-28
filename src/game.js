// Physik + Spiellogik ohne Grafik. Läuft im Browser und headless (Node) mit CANNON.
import { TYPES } from './elements.js';
import { add } from './math.js';

export const R = 0.5;
export const G = 9.82;
export const MAX_TILT = 25 * Math.PI / 180;

// Oberflächen: Reibung und Abprallen. Neue Oberflächen hier ergänzen (z. B. eis, schlamm).
export const SURFACES = {
  normal: { friction: 0.4, restitution: 0.15 }
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
      surfaceMat[key] = new CANNON.Material(key);
      world.addContactMaterial(new CANNON.ContactMaterial(surfaceMat[key], mBall, SURFACES[key]));
    }
    return surfaceMat[key];
  };

  const g = { world, level, els: [], solids: [], checkpoints: [], st: { stars: 0, starTotal: 0, cp: -1, won: false } };

  level.parts.forEach((d, i) => {
    const t = TYPES[d.type];
    if (!t) throw new Error(`Level "${level.id}": unbekanntes Bauteil "${d.type}" (Teil ${i})`);
    const el = { ...d, index: i };
    g.els.push(el);
    for (const s of (t.solids ? t.solids(el) : [])) {
      const body = new CANNON.Body({ mass: 0, material: matFor(s.surface), shape: new CANNON.Box(new CANNON.Vec3(...s.half)) });
      body.position.set(...s.pos);
      body.quaternion.set(...s.quat);
      world.addBody(body);
      g.solids.push(s);
    }
  });
  for (const el of g.els) TYPES[el.type].init?.(el, g);

  const ball = new CANNON.Body({ mass: 1, material: mBall, shape: new CANNON.Sphere(R), linearDamping: 0.12, angularDamping: 0.3 });
  world.addBody(ball);
  g.ball = ball;

  const killY = level.killY ?? -8;
  const spawnPoint = () => add(g.st.cp < 0 ? level.start : g.checkpoints[g.st.cp].at, [0, 1, 0]);

  g.spawn = p => {
    ball.position.set(...p); ball.velocity.set(0, 0, 0); ball.angularVelocity.set(0, 0, 0);
  };
  g.reset = () => {
    Object.assign(g.st, { stars: 0, cp: -1, won: false });
    for (const el of g.els) TYPES[el.type].reset?.(el, g);
    g.spawn(spawnPoint());
  };
  // ix/iz: Eingabe in Welt-Richtung (-1..1), x = rechts, z = nach hinten
  g.step = (ix, iz, dt) => {
    const ev = [];
    world.gravity.set(Math.sin(MAX_TILT) * G * ix, -G, Math.sin(MAX_TILT) * G * iz);
    world.step(1 / 60, dt, 4);
    for (const el of g.els) TYPES[el.type].step?.(el, g, dt, ev);
    if (ball.position.y < killY) { g.spawn(spawnPoint()); ev.push('fall'); }
    return ev;
  };
  return g;
}
