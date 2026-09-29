// Spuren hinter der Murmel. need = { stars: n } (Gesamtsterne) oder { stickers: n } (Sticker im Album).
// Grafik: ein InstancedMesh mit festem Partikel-Pool je Spur, pro Bild werden nur Matrizen/Farben aktualisiert.
//   shape  = Form eines Teilchens, colors = Farben (reihum), size = Grösse (m), life = Lebensdauer (s)
//   every  = neues Teilchen alle so viele Meter, spread = Zufallstempo (m/s), rise = Tempo nach oben, gravity
export const TRAILS = [
  { id: 'keine', emoji: '🚫', need: {} },
  { id: 'funken', emoji: '✨', need: { stars: 3 }, shape: 'funke', colors: [0xFFE14D, 0xFFFFFF, 0xFFA726], size: 0.26, life: 0.6, every: 0.25, spread: 2.5, rise: 1, gravity: 4 },
  { id: 'blasen', emoji: '🫧', need: { stickers: 3 }, shape: 'kugel', colors: [0xBDEBFF, 0xE3F6FF, 0xA0D8FF], size: 0.3, life: 1.6, every: 0.4, spread: 0.4, rise: 1.2, gravity: 0, opacity: 0.6 },
  { id: 'sterne', emoji: '⭐', need: { stars: 12 }, shape: 'stern', colors: [0xFFC928, 0xFFE680], size: 0.55, life: 1.0, every: 0.45, spread: 0.8, rise: 1.5, gravity: 1 },
  { id: 'regenbogen', emoji: '🌈', need: { stickers: 8 }, shape: 'kugel', colors: [0xE40303, 0xFF8C00, 0xFFED00, 0x008026, 0x004DFF, 0x750787], size: 0.34, life: 1.2, every: 0.15, spread: 0, rise: 0, gravity: 0 },
  { id: 'herzen', emoji: '💖', need: { stars: 22 }, shape: 'herz', colors: [0xFF5A8A, 0xFF8FB1, 0xE91E63], size: 0.5, life: 1.2, every: 0.5, spread: 0.5, rise: 1.3, gravity: 0 },
  { id: 'feuer', emoji: '🔥', need: { stickers: 16 }, shape: 'funke', colors: [0xFF3D00, 0xFF9100, 0xFFD600], size: 0.36, life: 0.7, every: 0.15, spread: 0.8, rise: 2.5, gravity: -1 }
];

const POOL = 90;

function geometry(THREE, shape) {
  if (shape === 'funke') return new THREE.OctahedronGeometry(0.5);
  if (shape === 'kugel') return new THREE.SphereGeometry(0.5, 10, 8);
  const s = new THREE.Shape();
  if (shape === 'stern') {
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 0.22 : 0.5, a = i * Math.PI / 5 + Math.PI / 2;
      i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    }
  } else { // Herz
    s.moveTo(0, -0.45);
    s.bezierCurveTo(-0.5, -0.1, -0.55, 0.35, -0.25, 0.4);
    s.bezierCurveTo(-0.1, 0.42, 0, 0.3, 0, 0.2);
    s.bezierCurveTo(0, 0.3, 0.1, 0.42, 0.25, 0.4);
    s.bezierCurveTo(0.55, 0.35, 0.5, -0.1, 0, -0.45);
  }
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: false });
  g.translate(0, 0, -0.06);
  return g;
}

// Partikel-Pool für die Spur. update(dt, ballPos, emit?) jedes Bild aufrufen (emit = false: keine neuen Teilchen).
export function createTrailFx(THREE, scene) {
  const parts = Array.from({ length: POOL }, () => ({ life: 0, max: 1, p: new THREE.Vector3(), v: new THREE.Vector3(), rot: 0, c: new THREE.Color() }));
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), col = new THREE.Color(1, 1, 1);
  const last = new THREE.Vector3();
  let trail = null, mesh = null, next = 0, dist = 0, colorIdx = 0, hasLast = false;

  function set(t) {
    if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); mesh = null; }
    trail = t && t.shape ? t : null;
    for (const p of parts) p.life = 0;
    hasLast = false;
    if (!trail) return;
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: !!trail.opacity, opacity: trail.opacity || 1, depthWrite: !trail.opacity });
    mesh = new THREE.InstancedMesh(geometry(THREE, trail.shape), mat, POOL);
    mesh.setColorAt(0, col); // legt instanceColor an (Grösse nach count, daher vor count = 0)
    mesh.frustumCulled = false; mesh.count = 0;
    scene.add(mesh);
  }

  function emit(pos) {
    const p = parts[next]; next = (next + 1) % POOL;
    const s = trail.spread;
    p.p.set(pos.x + (Math.random() - 0.5) * 0.3, pos.y - 0.2 + Math.random() * 0.3, pos.z + (Math.random() - 0.5) * 0.3);
    p.v.set((Math.random() - 0.5) * s, trail.rise + Math.random() * s * 0.5, (Math.random() - 0.5) * s);
    p.life = p.max = trail.life * (0.8 + Math.random() * 0.4);
    p.rot = Math.random() * 6;
    p.c.setHex(trail.colors[colorIdx++ % trail.colors.length]);
  }

  function update(dt, pos, emitOn = true) {
    if (!trail) return;
    // neue Teilchen nach zurückgelegter Strecke (steht die Murmel, kommt nichts nach); Sprünge (Neustart) ignorieren
    if (hasLast) {
      const d = last.distanceTo(pos);
      if (d < 3 && emitOn) dist += d;
      while (dist >= trail.every) { dist -= trail.every; emit(pos); }
    }
    last.copy(pos); hasLast = true;
    let n = 0;
    for (const p of parts) {
      if (p.life <= 0) continue;
      p.life -= dt;
      if (p.life <= 0) continue;
      p.v.y -= trail.gravity * dt; p.p.addScaledVector(p.v, dt); p.rot += dt * 3;
      const k = p.life / p.max, s = trail.size * (trail.opacity ? 1.4 - k * 0.6 : 0.3 + k * 0.7);
      q.setFromEuler(e.set(0, p.rot, 0));
      m4.compose(p.p, q, sc.setScalar(s));
      mesh.setMatrixAt(n, m4);
      mesh.setColorAt(n, p.c);
      n++;
    }
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }

  return { set, update, get count() { return mesh ? mesh.count : 0; } };
}
