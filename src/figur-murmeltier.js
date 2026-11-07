// Checkpoint-Figur der Welt Schweiz: Murmeltier. Döst im Bau (nur der Kopf schaut heraus), schnellt beim Erreichen hoch,
// pfeift und schwenkt die Fahne. Wird in checkpoint-figuren.js in FIGUREN eingetragen (gleiche Schnittstelle:
// (T, F) -> {g, kopf: Ort der Zzz, sockel: Farbe, pose(zustand, t, dt)}; steht auf y = 0, Gesicht nach -z).
import { mat, mesh, group, cyl } from './props.js';

const JUBEL = 1.8; // s, wie in checkpoint-figuren.js

export function murmeltier(T, F) {
  const fell = mat(T, 0xA1784A, { shininess: 8 }), hell = mat(T, 0xD9B98A, { shininess: 8 }), schwarz = mat(T, 0x111111);
  const augen = [-1, 1].map(k => {
    const a = group(T, mesh(T, new T.SphereGeometry(0.07, 10, 8), mat(T, 0xFFFFFF)), mesh(T, new T.SphereGeometry(0.04, 8, 6), schwarz, 0, 0, -0.05));
    a.position.set(k * 0.14, 0.08, -0.27); return a;
  });
  const kopf = group(T, mesh(T, new T.SphereGeometry(0.33, 16, 12), fell), mesh(T, new T.SphereGeometry(0.17, 12, 10), hell, 0, -0.07, -0.24),
    mesh(T, new T.SphereGeometry(0.05, 8, 6), schwarz, 0, -0.02, -0.4), mesh(T, new T.BoxGeometry(0.11, 0.1, 0.03), mat(T, 0xFFFFFF), 0, -0.19, -0.33), ...augen);
  for (const k of [-1, 1]) kopf.add(mesh(T, new T.SphereGeometry(0.09, 8, 6), fell, k * 0.24, 0.24, 0.03));
  kopf.position.y = 1.35;
  const arme = [-1, 1].map(k => {
    const a = group(T, mesh(T, cyl(T, 0.08, 0.07, 0.4, 8), fell, 0, -0.2, 0), mesh(T, new T.SphereGeometry(0.09, 8, 6), hell, 0, -0.42, 0));
    a.position.set(k * 0.4, 0.95, -0.05); a.rotation.z = k * 0.3; return a;
  });
  const arm = arme[1], fahne = F.make(1.3); fahne.position.y = -0.3; fahne.rotation.z = Math.PI; arm.add(fahne);
  const tier = group(T, mesh(T, new T.SphereGeometry(0.42, 16, 12).scale(1, 1.5, 0.9), fell, 0, 0.65, 0),
    mesh(T, new T.SphereGeometry(0.3, 14, 10).scale(1, 1.4, 0.6), hell, 0, 0.62, -0.2), kopf, ...arme);
  // Bau: Erdhügel mit Loch
  const bau = group(T, mesh(T, cyl(T, 0.75, 0.95, 0.35, 16), mat(T, 0x8D6E4B, { flatShading: true }), 0, 0.175, 0), mesh(T, cyl(T, 0.5, 0.5, 0.02, 16), mat(T, 0x3E2A18), 0, 0.36, 0));
  return {
    g: group(T, bau, tier), kopf: [0, 0.9, 0], sockel: 0x7CB342,
    pose(z, t) {
      augen.forEach(a => { a.scale.y = z === 'schlaf' ? 0.12 : 1; });
      if (z === 'schlaf') { // zusammengekauert im Bau, atmet
        tier.scale.y = 0.55 + 0.02 * Math.sin(t * 2); tier.position.y = -0.3; kopf.rotation.set(0.25, 0, 0); arm.rotation.z = 2.5;
      } else if (z === 'jubel') { // schnellt hoch, hüpft, schwenkt die Fahne
        const k = Math.min(1, t / 0.15);
        tier.scale.y = 0.55 + 0.45 * k; tier.position.y = -0.3 * (1 - k) + Math.abs(Math.sin(t * Math.PI / 0.45)) * 0.35 * Math.max(0, 1 - t / JUBEL);
        kopf.rotation.set(-0.25, 0, 0.12 * Math.sin(t * 12)); arm.rotation.z = 2.8 + 0.5 * Math.sin(t * 14);
      } else { // steht aufrecht, schaut sich um, winkt
        tier.scale.y = 1; tier.position.y = 0.03 * Math.abs(Math.sin(t * 3));
        kopf.rotation.set(0, 0.5 * Math.sin(t * 1.5), 0); arm.rotation.z = 2.7 + 0.35 * Math.sin(t * 4);
      }
    }
  };
}
