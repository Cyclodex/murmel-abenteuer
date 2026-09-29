// Autopilot für Tests (und zum Zuschauen: Spiel mit ?autopilot öffnen): fährt eine Liste von Wegpunkten ab und prüft so, ob ein Level schaffbar ist.
// Wegpunkt: {x, z, speed?, r?, free?, wait?}
//   speed = Wunschtempo (m/s), r = Radius "erreicht", free = nicht lenken (z. B. im Looping),
//   wait = Name einer Bedingung aus WAITS, vorher wird angehalten.
import uebung from './routes/uebung.js';
import spielzimmer from './routes/spielzimmer.js';
import garten from './routes/garten.js';
import kueche from './routes/kueche.js';
import badezimmer from './routes/badezimmer.js';
import weltraum from './routes/weltraum.js';
import unterwasser from './routes/unterwasser.js';
import vulkan from './routes/vulkan.js';

const WAITS = {
  // n-te Plattform steht am Start bzw. am Ziel
  platAtFrom: (g, n = 0) => { const e = g.els.filter(x => x.type === 'plattform')[n]; return dist3(e.body.position, e.from) < 0.05 && speed(e.body.velocity) < 0.01; },
  platAtTo: (g, n = 0) => { const e = g.els.filter(x => x.type === 'plattform')[n]; return dist3(e.body.position, e.to) < 0.05 && speed(e.body.velocity) < 0.01; },
  // alle Brücken oben (oder nur die mit dieser id: wait: ['bridgeUp', 'b1'])
  bridgeUp: (g, id) => g.els.filter(x => x.type === 'bruecke' && (id === undefined || x.id === id)).every(e => e.k >= 1),
  hoehe: (g, y) => g.ball.position.y > y,
  tiefer: (g, y) => g.ball.position.y < y,
  amBoden: g => !!g.groundBody && Math.abs(g.ball.velocity.y) < 0.3,
  // Takt eines bewegten Teils: wait: ['phase', [type, n, a, b]] = n-tes Teil vom Typ type ist in der Phase a..b (0..1) seines Takts
  // (Plattform/Schieber: 0 = Pause bei from, Hammer: 0 = oben, zuschlagen ab up/per, Felsen: 0 = neuer Felsen)
  phase: (g, [type, n, a, b]) => {
    const e = g.els.filter(x => x.type === type)[n];
    const per = e.per ?? 2 * ((e.time ?? 3) + (e.pause ?? 1.5)), t = e.t + (e.per ? e.offset || 0 : 0);
    const u = ((t % per) + per) % per / per;
    return a <= b ? u >= a && u <= b : u >= a || u <= b;
  },
  // Falltür n ist zu (und nicht gerade am Aufgehen)
  tuerZu: (g, n = 0) => { const e = g.els.filter(x => x.type === 'falltuer')[n]; return e.state === 'zu' && e.a < 0.01; },
  // der drehende Balken (oder Rasensprenger) ist gerade am Punkt [x, z] vorbei (10°..80° danach), bis er zurückkommt bleibt Zeit
  balkenWeg: (g, [x, z]) => g.els.filter(e => e.type === 'balken' || e.type === 'sprenger').every(e => {
    const dx = x - e.at[0], dz = z - e.at[2];
    if (Math.hypot(dx, dz) > (e.length ?? 6) / 2 + 1) return true;
    const dir = Math.sign(e.speed ?? 40), pa = Math.atan2(dz, dx); // Balkenachse liegt bei Winkel -a
    const dd = ((dir * (pa + e.a)) % Math.PI + Math.PI) % Math.PI;
    return dd > 10 * Math.PI / 180 && dd < 80 * Math.PI / 180;
  })
};
const dist3 = (p, a) => Math.hypot(p.x - a[0], p.y - a[1], p.z - a[2]);
const speed = v => Math.hypot(v.x, v.y, v.z);
const clamp = v => Math.max(-1, Math.min(1, v));

// Steuerung für einen Schritt: liefert die Eingabe [ix, iz] in Welt-Richtung.
// Wird von autopilot() (Tests) und vom Zuschau-Modus im Spiel (?autopilot) benutzt.
export function createPilot(g, wps) {
  const ok = new Set(); // Wegpunkte, deren Wartebedingung schon erfüllt war (einrasten)
  const pilot = {
    i: 0, waiting: null,
    drive() {
      const cur = Math.min(pilot.i, wps.length - 1), w = wps[cur], p = g.ball.position, v = g.ball.velocity;
      let ix = 0, iz = 0;
      const [wName, wArg] = w.wait ? [].concat(w.wait) : [];
      const waiting = wName && !ok.has(cur) && !WAITS[wName](g, wArg);
      if (wName && !waiting) ok.add(cur);
      pilot.waiting = waiting ? wName : null;
      // Beim Warten den vorherigen Wegpunkt halten
      const tgt = waiting ? wps[Math.max(0, cur - 1)] : w; // auch am Ende der Route (i über das Listenende hinaus)
      const dx = tgt.x - p.x, dz = tgt.z - p.z, d = Math.hypot(dx, dz) || 1e-6;
      const onKin = g.groundBody && g.groundBody.type === g.C.Body.KINEMATIC;
      if (w.follow && !waiting) { // der Bahn folgen (Spirale), bis die Murmel tief genug ist
        const y = g.track.yaw, fx = -Math.sin(y), fz = -Math.cos(y), rx = Math.cos(y), rz = -Math.sin(y), sp = w.speed ?? 4;
        const lat = -(g.track.lateral || 0) * 1.5;
        ix = clamp((fx * sp - v.x) * 0.8 + rx * lat); iz = clamp((fz * sp - v.z) * 0.8 + rz * lat);
        if (p.y < w.bisY) pilot.i++;
      } else if (waiting && onKin) { // mitfahren: relativ zur Plattform stillhalten
        const pv = g.groundBody.velocity;
        ix = clamp(-(v.x - pv.x) * 0.5); iz = clamp(-(v.z - pv.z) * 0.5);
      } else if (!tgt.free || waiting) {
        const sp = waiting ? Math.min(2, d * 2) : Math.min(w.speed ?? 4, d * 1.5 + 1);
        ix = clamp((dx / d * sp - v.x) * 1.2); iz = clamp((dz / d * sp - v.z) * 1.2);
        const l = Math.hypot(ix, iz); if (l > 1) { ix /= l; iz /= l; }
      }
      if (!waiting && !w.follow && d < (w.r ?? 1.2)) pilot.i++;
      return [ix, iz];
    },
    // nach dem Runterfallen beim nächstgelegenen Wegpunkt weitermachen
    fell() {
      ok.clear();
      let best = 0, bd = 1e9;
      wps.forEach((q, k) => { if (q.x === undefined) return; const dd = Math.hypot(q.x - g.ball.position.x, q.z - g.ball.position.z); if (dd < bd) { bd = dd; best = k; } });
      pilot.i = best;
    }
  };
  return pilot;
}

// ROUTES[id] kann eine Liste von Routen sein (z. B. Umweg zum Bonusstern): die erste ist die Hauptroute.
export const mainRoute = r => (r && Array.isArray(r[0]) ? r[0] : r);

// stopAtEnd: Neben-Route (z. B. nur zum Bonusstern): 2 s nach dem letzten Wegpunkt aufhören statt bis maxTime zu fahren
export function autopilot(g, wps, maxTime = 180, delay = 0, stopAtEnd = false) {
  const H = 1 / 60, log = [], pilot = createPilot(g, wps);
  let falls = 0, t = 0, endT = -1;
  g.reset();
  while (t < maxTime && !g.st.won) {
    if (stopAtEnd && pilot.i >= wps.length) { if (endT < 0) endT = t; else if (t - endT > 2) break; }
    let [ix, iz] = pilot.drive();
    if (t < delay) { ix = 0; iz = 0; } // Startverzögerung: andere Phase für Balken/Plattformen
    const ev = g.step(ix, iz, H);
    t += H;
    for (const e of ev) {
      log.push(`${e}@${t.toFixed(1)}`);
      if (e === 'fall' || e === 'quetsch') falls++;
      if (e === 'fall' || e === 'zurueck') pilot.fell();
    }
  }
  const got = g.els.filter(e => e.type === 'stern').map(e => !!e.got);
  return { won: g.st.won, stars: g.st.stars, starTotal: g.st.starTotal, falls, time: +t.toFixed(1), wp: pilot.i, log, got };
}

// Level mit allen Routen prüfen: die erste Route muss gewinnen, alle zusammen sammeln die Sterne.
// ROUTES[id] ist eine Wegpunkt-Liste oder eine Liste von Listen (z. B. Umweg zum Bonusstern).
// Wie ein Kind, das es nochmal probiert: jede Route auch mit Startverzögerung (andere Balken-/Plattform-Phase).
export function checkLevel(makeGame, routes, maxTime = 400, delays = [0, 1.3, 2.6]) {
  const list = Array.isArray(routes[0]) ? routes : [routes];
  const runs = [];
  list.forEach((r, k) => { for (const d of delays) { const res = autopilot(makeGame(), r, maxTime, d, k > 0); res.main = k === 0; runs.push(res); if (res.won && res.falls === 0 && res.got.every(Boolean)) break; } });
  const got = runs[0].got.map((_, k) => runs.some(r => r.got[k]));
  const best = runs.filter(r => r.main && r.won).sort((a, b) => a.falls - b.falls)[0];
  return { won: !!best, falls: best ? best.falls : -1, stars: got.filter(Boolean).length, total: got.length, time: best ? best.time : -1, tries: runs.length };
}

// Wegpunkte pro Level (id -> Liste)
export const ROUTES = {
  ausflug: [{ x: 0, z: -24, speed: 5 }, { x: 0, z: -37.5, speed: 4 }, { x: 0, z: -69, speed: 6 }],
  sz1: [
    { x: 0, z: -8 }, { x: -1, z: -14.25, speed: 2 }, { x: -5, z: -14.25, speed: 2 }, { x: 0, z: -14.25, speed: 2 }, { x: 0, z: -18 }, { x: 1.46, z: -23.54 }, { x: 5, z: -25 }, { x: 9, z: -25 },
    { x: 20, z: -25, speed: 9 }, { x: 28, z: -25, speed: 6 }, { x: 31.5, z: -26.5 }, { x: 33, z: -31 }, { x: 33, z: -36 }
  ],
  sz2: [
    { x: 0, z: -7.3, speed: 2 }, { x: 0, z: -10, speed: 2, wait: 'platAtFrom' }, { x: 0, z: -19, speed: 2, wait: 'platAtTo' },
    { x: 0, z: -24.5 }, { x: 0, z: -28, speed: 2, wait: ['platAtFrom', 1] }, { x: 0, z: -32, speed: 2, wait: ['platAtTo', 1] }, { x: -5, z: -32.25, speed: 2 }, { x: 0, z: -33, speed: 2 },
    { x: 0, z: -39 }, { x: 0, z: -44, speed: 3 }, { x: 0, z: -49, speed: 3 }, { x: 0, z: -54 }
  ],
  sz3: [
    { x: 0, z: -9 }, { x: 0, z: -17 }, { x: 0, z: -20, speed: 2 }, { x: -5, z: -21.25, speed: 1.5, r: 0.8 }, { x: 0, z: -21.25, speed: 1.5 }, { x: 1.2, z: -24, speed: 3 }, { x: -1.2, z: -27.5, speed: 3 },
    { x: 0, z: -31 }, { x: 1.8, z: -35.5, speed: 2 }, { x: 0, z: -37, speed: 2, wait: 'bridgeUp' }, { x: 0, z: -46 }, { x: 0, z: -52 }
  ],
  sz4: [
    { x: 0, z: -4 }, { x: -1.46, z: -9.54 }, { x: -5, z: -11 }, { x: -10, z: -11 }, { x: -13, z: -11, speed: 5 },
    { x: -14.5, z: -11, speed: 8 }, { x: -19, z: -16, free: true, r: 2.5 }, { x: -23, z: -16, speed: 3 },
    { x: -26, z: -16, speed: 2, wait: 'platAtFrom' }, { x: -33, z: -16, speed: 2, wait: 'platAtTo' }, { x: -36.25, z: -15, speed: 2 }, { x: -36.25, z: -10.5, speed: 2 }, { x: -36.25, z: -15, speed: 2 }, { x: -40, z: -16 }
  ],
  g1: [
    { x: 0, z: -8, speed: 3 }, { x: 0, z: -29 }, { x: -1, z: -30.25, speed: 2 }, { x: -5, z: -30.25, speed: 2, r: 0.5 }, { x: 0, z: -30.25, speed: 2 },
    { x: 0, z: -35 }, { x: 1.46, z: -39.54 }, { x: 5, z: -41 }, { x: 12, z: -41, speed: 3 }, { x: 16, z: -41, speed: 2 }, { x: 31, z: -41 }
  ],
  g2: [
    { x: 0, z: -7 }, { x: 0, z: -9, speed: 3 }, { x: 0, z: -24, speed: 3 }, { x: 0, z: -30 }, { x: 0, z: -34, speed: 2 },
    { x: 0, z: -39, wait: ['hoehe', 7] }, { x: 0, z: -41.25, speed: 2 }, { x: -5, z: -41.25, speed: 2, r: 0.5, wait: 'amBoden' }, { x: 0, z: -41.25, speed: 2 }, { x: 0, z: -46 }
  ],
  g3: [
    { x: 0, z: -3 }, { follow: true, bisY: 2.6, speed: 4 }, { x: 0, z: -8 }, { x: 0, z: -26, speed: 4 }, { x: 0, z: -30 },
    { x: -5, z: -31.75, speed: 2, r: 0.5 }, { x: 0, z: -31.75, speed: 3 }, { x: 0, z: -36 }
  ],
  k1: [
    { x: 0, z: -6 }, { x: 0, z: -20, speed: 5 }, { x: -1.46, z: -25.54 }, { x: -5, z: -27 }, { x: -19, z: -27, speed: 4 }, { x: -27, z: -27 },
    { x: -37, z: -27, speed: 4 }, { x: -41.25, z: -26 }, { x: -41.25, z: -21.5, speed: 2, r: 0.5 }, { x: -41.25, z: -26, speed: 2 }, { x: -44.5, z: -27 }
  ],
  k2: [
    { x: 0, z: -5 }, { x: 5, z: -7, speed: 2, r: 0.5 }, { x: 4, z: -8, speed: 2 },
    { x: 3.5, z: -12, speed: 4, r: 0.6, wait: ['balkenWeg', [3.8, -9.5]] }, { x: 0, z: -18, speed: 4 }, { x: 0, z: -26 }, { x: 0, z: -38, speed: 3 }, { x: 0, z: -47.5 }
  ],
  k3: [
    { x: 0, z: -8, speed: 4 }, { x: 0, z: -18 }, { x: 0, z: -22, speed: 3 }, { x: 10, z: -30 }, { x: 13.75, z: -31, speed: 2 },
    { x: 13.75, z: -35, speed: 2, r: 0.5 }, { x: 13.75, z: -30, speed: 2 }, { x: 18, z: -30 }, { x: 36, z: -30 }
  ],
  w1: [
    [{ x: 0, z: -6, speed: 3 }, { x: 0, z: -22, speed: 5 }, { x: 0, z: -26, speed: 3 }, { x: 0, z: -40, speed: 5 }, { x: 0, z: -45 }],
    [{ x: 0, z: -6, speed: 3 }, { x: 5, z: -12, speed: 5 }, { x: 0, z: -22, speed: 4 }, { x: 0, z: -26, speed: 3 }, { x: 0, z: -40, speed: 5 }, { x: 0, z: -45 }]
  ],
  w2: [
    { x: 0, z: -6, speed: 2 }, { x: 0, z: -22, speed: 2 }, { x: 0, z: -20, speed: 2 }, { x: 0, z: -33, speed: 2 }, { x: 12, z: -48 }, { x: 12, z: -52 }
  ],
  w3: [
    { x: 0, z: -8 }, { x: 0, z: -17, speed: 2.5 }, { x: -4.5, z: -17, speed: 1.5 }, { x: 0, z: -17, speed: 1.5 }, { x: 0, z: -30, speed: 2.5 },
    { x: 0, z: -32, speed: 2 }, { x: -12, z: -44 }, { x: -13, z: -41, speed: 2 }, { x: -17, z: -41, speed: 5, wait: ['balkenWeg', [-15, -41.5]] }, { x: -20.5, z: -41, speed: 4 }, { x: -24, z: -44 }
  ],
  u1: [
    { x: 0, z: -8 }, { x: 1.76, z: -14.24 }, { x: 6, z: -16 }, { x: 22, z: -16, speed: 3 }, { x: 25.54, z: -17.46 }, { x: 27, z: -21 },
    { x: 26, z: -25.75 }, { x: 21.5, z: -25.75, speed: 2, r: 0.5 }, { x: 26, z: -25.75, speed: 2 }, { x: 27, z: -30 }
  ],
  u2: [
    { x: 0, z: -8 }, { x: 0, z: -10, speed: 1.5 }, { x: 0, z: -15, wait: ['hoehe', 6] }, { x: -5, z: -18, speed: 2, r: 0.5 }, { x: 0, z: -18, speed: 2 },
    { x: 0, z: -24 }, { x: 0, z: -26, speed: 1.5 }, { x: 0, z: -31, wait: ['hoehe', 11] }, { x: 0, z: -35 }, { follow: true, bisY: 1.6, speed: 4 },
    { x: 10, z: -31 }, { x: 10, z: -27 }
  ],
  u3: [
    { x: 0, z: -6 }, { x: 0, z: -17, speed: 4 }, { x: 3, z: -24, speed: 4, r: 0.6, wait: ['balkenWeg', [2, -20.5]] }, { x: 0, z: -30, speed: 4 }, { x: 0, z: -44 }, { x: 0, z: -46, speed: 2 }, { x: 0, z: -62 },
    { x: -3, z: -62.25, speed: 2 }, { x: -5.5, z: -62.25, speed: 2, r: 0.5 }, { x: 0, z: -62.25, speed: 3 }, { x: 0, z: -66 }
  ],
  v1: [
    { x: 0, z: -8, speed: 3 }, { x: 0, z: -12, speed: 1.5, r: 0.5 }, { x: -6.3, z: -12, speed: 1.5, r: 0.5 }, { x: 0, z: -12, speed: 1.5, r: 0.5 },
    { x: 0, z: -15.5, speed: 2 }, { x: 1.17, z: -18.83, speed: 2 }, { x: 4.5, z: -20, speed: 2 }, { x: 11, z: -20, speed: 3 },
    { x: 12, z: -20, speed: 1.5, wait: 'platAtFrom' }, { x: 13.5, z: -20, speed: 1.5, r: 0.5 }, { x: 18.5, z: -20, speed: 1.5, wait: 'platAtTo', r: 0.5 },
    { x: 21.5, z: -20, speed: 2 }, { x: 26, z: -20, speed: 2 }, { x: 33.5, z: -20, speed: 2 }, { x: 37, z: -20, speed: 2 },
    { x: 39.83, z: -21.17, speed: 2 }, { x: 41, z: -24.5, speed: 2 }, { x: 41, z: -31 }
  ],
  v2: [
    { x: 0, z: -8, speed: 4 }, { x: 0, z: -16, speed: 4 }, { x: 0, z: -27, speed: 3 }, { x: 0, z: -29, speed: 1.5, r: 0.5 }, { x: 7, z: -29, speed: 1.5, r: 0.5 }, { x: 0, z: -29, speed: 1.5, r: 0.5 },
    { x: 0, z: -33, speed: 2 }, { x: 0, z: -35, speed: 1.5, r: 0.5 }, { x: 0, z: -43, speed: 5, r: 0.8, wait: ['balkenWeg', [0, -39]] },
    { x: 0, z: -47, speed: 2.5 }, { x: 0, z: -58, speed: 2.5, r: 0.8 }, { x: 0, z: -64, speed: 2 }, { x: 0, z: -69, speed: 2 },
    { x: -1.46, z: -73.54, speed: 3 }, { x: -6, z: -75, speed: 3 }, { x: -12, z: -75 }
  ],
  v3: [
    { x: 0, z: -7, speed: 3 }, { x: 0, z: -13, speed: 2 }, { x: 0, z: -30, speed: 2 }, { x: 0, z: -37, speed: 2 },
    { x: 0.5, z: -40, speed: 1.5, r: 0.5 }, { x: 6.5, z: -40, speed: 1.5, r: 0.5 }, { x: 0.5, z: -40, speed: 1.5, r: 0.5 },
    { x: 0.9, z: -42, speed: 1.5, r: 0.5 }, { x: 0, z: -44.5, speed: 1.5, r: 0.5 }, { x: -0.9, z: -47, speed: 1.5, r: 0.5 }, { x: 0, z: -49.5, speed: 2 },
    { follow: true, bisY: 0.7, speed: 3 }, { x: 0, z: -54, speed: 4 }, { x: 0, z: -66, speed: 5 }, { x: 0, z: -70, speed: 4 },
    { x: 0, z: -73, speed: 8 }, { x: 5, z: -77, free: true, r: 2.5 }, { x: 5, z: -81 }
  ]
};

// Routen der schweren Level und der Badezimmer-Welt liegen je Welt in tests/routes/
Object.assign(ROUTES, uebung, spielzimmer, garten, kueche, badezimmer, weltraum, unterwasser, vulkan);
