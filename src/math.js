// Kleine Vektor-/Quaternion-Helfer ohne three.js (damit die Physik auch headless läuft).
export const DEG = Math.PI / 180;

// Drehung: zuerst yaw um die Y-Achse, danach pitch um die lokale X-Achse.
// Lokale Achsen eines Teils: x = rechts, y = oben, -z = vorwärts.
export function quatYawPitch(yaw, pitch) {
  const cy = Math.cos(yaw / 2), sy = Math.sin(yaw / 2), cp = Math.cos(pitch / 2), sp = Math.sin(pitch / 2);
  return [cy * sp, sy * cp, -sy * sp, cy * cp];
}

export function rotate(q, v) {
  const [x, y, z, w] = q;
  const tx = 2 * (y * v[2] - z * v[1]), ty = 2 * (z * v[0] - x * v[2]), tz = 2 * (x * v[1] - y * v[0]);
  return [v[0] + w * tx + (y * tz - z * ty), v[1] + w * ty + (z * tx - x * tz), v[2] + w * tz + (x * ty - y * tx)];
}

export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// Vorwärts- und Rechts-Richtung für einen yaw (Bogenmass)
export const fwdOf = yaw => [-Math.sin(yaw), 0, -Math.cos(yaw)];
export const rightOf = yaw => [Math.cos(yaw), 0, -Math.sin(yaw)];

// Kleinster Winkelunterschied b - a im Bereich -PI..PI
export const angleDiff = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));

// Weiches Anfahren/Abbremsen 0..1
export const ease = u => (1 - Math.cos(Math.PI * Math.min(1, Math.max(0, u)))) / 2;

// Richtungswinkel (yaw) für eine horizontale Bewegung dx/dz, so dass lokales -z dorthin zeigt.
export const yawOf = (dx, dz) => Math.atan2(-dx, -dz);

// Punkt p in lokale Koordinaten eines Rechtecks (Mitte c, Drehung yaw) umrechnen.
export function toLocal(p, c, yaw) {
  const dx = p[0] - c[0], dz = p[2] - c[2], cs = Math.cos(yaw), sn = Math.sin(yaw);
  return [dx * cs - dz * sn, p[1] - c[1], dx * sn + dz * cs];
}
