// Autopilot für Tests: fährt eine Liste von Wegpunkten ab und prüft so, ob ein Level schaffbar ist.
// Wegpunkt: {x, z, speed?, r?, free?, wait?}
//   speed = Wunschtempo (m/s), r = Radius "erreicht", free = nicht lenken (z. B. im Looping),
//   wait = Name einer Bedingung aus WAITS, vorher wird angehalten.
const WAITS = {
  // n-te Plattform steht am Start bzw. am Ziel
  platAtFrom: (g, n = 0) => { const e = g.els.filter(x => x.type === 'plattform')[n]; return dist3(e.body.position, e.from) < 0.05 && speed(e.body.velocity) < 0.01; },
  platAtTo: (g, n = 0) => { const e = g.els.filter(x => x.type === 'plattform')[n]; return dist3(e.body.position, e.to) < 0.05 && speed(e.body.velocity) < 0.01; },
  bridgeUp: g => g.els.filter(x => x.type === 'bruecke').every(e => e.k >= 1)
};
const dist3 = (p, a) => Math.hypot(p.x - a[0], p.y - a[1], p.z - a[2]);
const speed = v => Math.hypot(v.x, v.y, v.z);
const clamp = v => Math.max(-1, Math.min(1, v));

export function autopilot(g, wps, maxTime = 180) {
  const H = 1 / 60, log = [];
  let i = 0, falls = 0, t = 0;
  g.reset();
  while (t < maxTime && !g.st.won) {
    const w = wps[Math.min(i, wps.length - 1)], p = g.ball.position, v = g.ball.velocity;
    let ix = 0, iz = 0;
    const [wName, wArg] = w.wait ? [].concat(w.wait) : [];
    const waiting = wName && !WAITS[wName](g, wArg);
    // Beim Warten den vorherigen Wegpunkt halten
    const tgt = waiting ? wps[Math.max(0, i - 1)] : w;
    const dx = tgt.x - p.x, dz = tgt.z - p.z, d = Math.hypot(dx, dz) || 1e-6;
    const onKin = g.groundBody && g.groundBody.type === g.C.Body.KINEMATIC;
    if (waiting && onKin) { // mitfahren: relativ zur Plattform stillhalten
      const pv = g.groundBody.velocity;
      ix = clamp(-(v.x - pv.x) * 0.5); iz = clamp(-(v.z - pv.z) * 0.5);
    } else if (!tgt.free || waiting) {
      const sp = waiting ? Math.min(2, d * 2) : Math.min(w.speed ?? 4, d * 1.5 + 1);
      ix = clamp((dx / d * sp - v.x) * 1.2); iz = clamp((dz / d * sp - v.z) * 1.2);
      const l = Math.hypot(ix, iz); if (l > 1) { ix /= l; iz /= l; }
    }
    if (!waiting && d < (w.r ?? 1.2)) i++;
    const ev = g.step(ix, iz, H);
    t += H;
    for (const e of ev) {
      log.push(`${e}@${t.toFixed(1)}`);
      if (e === 'fall') {
        falls++;
        // beim nächstgelegenen Wegpunkt weitermachen
        let best = 0, bd = 1e9;
        wps.forEach((q, k) => { const dd = Math.hypot(q.x - g.ball.position.x, q.z - g.ball.position.z); if (dd < bd) { bd = dd; best = k; } });
        i = best;
      }
    }
  }
  return { won: g.st.won, stars: g.st.stars, starTotal: g.st.starTotal, falls, time: +t.toFixed(1), wp: i, log };
}

// Wegpunkte pro Level (id -> Liste)
export const ROUTES = {
  ausflug: [{ x: 0, z: -69, speed: 99 }],
  sz1: [
    { x: 0, z: -8 }, { x: -1, z: -14.25, speed: 2 }, { x: -5, z: -14.25, speed: 2 }, { x: 0, z: -14.25, speed: 2 }, { x: 0, z: -18 }, { x: 1.46, z: -23.54 }, { x: 5, z: -25 }, { x: 9, z: -25 },
    { x: 20, z: -25, speed: 9 }, { x: 28, z: -25, speed: 6 }, { x: 31.5, z: -26.5 }, { x: 33, z: -31 }, { x: 33, z: -36 }
  ],
  sz2: [
    { x: 0, z: -7.3 }, { x: 0, z: -10, speed: 2, wait: 'platAtFrom' }, { x: 0, z: -19, speed: 2, wait: 'platAtTo' },
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
  ]
};
