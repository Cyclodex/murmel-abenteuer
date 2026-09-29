// Treppe: alle Murmeln fallen gleichzeitig eine Treppe hinunter (Vergleich + Hintergrund der Menüs).
// Jede Murmel hat ihre eigene Physik-Welt mit derselben Treppe, so stören sie sich nicht.
import { createGame } from './game.js';
import { createView, createBallMesh } from './view.js';

export const STEPS = 7, TREAD = 2, RISE = 0.9, LANE = 1.15;
const ROUND = 10;  // Sekunden, dann starten alle wieder oben
const PUSH = 0.3;  // leichte Neigung nach vorne (Anteil der Kipp-Eingabe), damit sie in Schwung kommen

// Treppe nach vorne (+z) hinunter, unten ein Auslauf mit Wand, die Murmeln prallen dort zurück
// (Wand 3 m hoch: der Pingpong springt im Auslauf bis 3.6 m, über 1.5 m kam er hinaus)
export function treppenLevel(n) {
  const w = n * LANE + 1.2, top = STEPS * RISE, parts = [];
  for (let k = 0; k < STEPS; k++) {
    const y = top - k * RISE, z0 = -STEPS * TREAD + k * TREAD;
    parts.push({ type: 'weg', from: [0, y, z0], to: [0, y, z0 + TREAD], width: w, walls: 1, thick: y + 1, caps: k === 0 ? 'start' : undefined });
  }
  parts.push({ type: 'weg', from: [0, 0, 0], to: [0, 0, 10], width: w, walls: 3, thick: 1, caps: 'end' });
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

// Mit Grafik: Szene der ersten Welt + je eine Kugel pro Murmel, feste Kamera von vorne oben
export function createTreppenView(THREE, CANNON, renderer, skins) {
  const t = createTreppe(CANNON, skins);
  const view = createView(THREE, renderer, t.games[0]);
  view.setSkin(skins[0]);
  const meshes = [view.ballMesh];
  skins.slice(1).forEach(s => { const b = createBallMesh(THREE); b.setSkin(s); view.scene.add(b.mesh); meshes.push(b.mesh); });
  Object.assign(view.sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, far: 80 });
  view.sun.shadow.camera.updateProjectionMatrix();
  const look = new THREE.Vector3(0, STEPS * RISE * 0.45, -STEPS * TREAD * 0.4);
  view.fixedCam = cam => {
    // so weit weg, dass die ganze Breite ins Bild passt (Hochformat braucht mehr Abstand)
    const half = (skins.length * LANE) / 2 + 1.5, vfov = cam.fov * Math.PI / 180;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * cam.aspect);
    const d = Math.max(18, half / Math.tan(hfov / 2) + 4);
    cam.position.set(look.x, look.y + d * 0.4, look.z + d * 0.92); // flacher Blick: Stufen gut sichtbar
    cam.lookAt(look);
    return look;
  };
  return {
    treppe: t, view,
    frame(dt) {
      t.step(dt);
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
