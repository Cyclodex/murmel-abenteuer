// Murmel-Designs. need = so viele Sterne braucht man insgesamt zum Freischalten ('alle' = alle Sterne).
// Jedes Design malt eine Kugel-Textur (Längen-/Breitengrad-Bild, 256 x 128).
export const SKINS = [
  { id: 'standard', emoji: '🔵', need: 0, paint: standard },
  { id: 'fussball', emoji: '⚽', need: 5, paint: pixels(fussball) },
  { id: 'melone', emoji: '🍉', need: 10, paint: pixels(melone) },
  { id: 'planet', emoji: '🪐', need: 15, paint: pixels(planet), ring: true },
  { id: 'regenbogen', emoji: '🌈', need: 20, paint: pixels(regenbogen) },
  { id: 'gold', emoji: '🏅', need: 'alle', paint: pixels(gold), shiny: true }
];

function standard(ctx, w, h) {
  ctx.fillStyle = '#2F6FEB'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, h * 26 / 64, w, h * 12 / 64);
}

// Hilfsfunktion: Farbe pro Punkt auf der Kugel (x, y, z = Richtung, lat/lon in Bogenmass)
function pixels(fn) {
  return (ctx, w, h) => {
    const img = ctx.createImageData(w, h), d = img.data;
    for (let j = 0; j < h; j++) {
      const lat = (0.5 - (j + 0.5) / h) * Math.PI, cl = Math.cos(lat);
      for (let i = 0; i < w; i++) {
        const lon = (i + 0.5) / w * Math.PI * 2;
        const c = fn(cl * Math.cos(lon), Math.sin(lat), cl * Math.sin(lon), lat, lon);
        const k = (j * w + i) * 4;
        d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  };
}

const PHI = (1 + Math.sqrt(5)) / 2;
const norm = v => { const l = Math.hypot(...v); return v.map(a => a / l); };
const PENTA = [], HEXA = [];
for (const a of [-1, 1]) for (const b of [-1, 1]) {
  PENTA.push(norm([0, a, b * PHI]), norm([a, b * PHI, 0]), norm([b * PHI, 0, a]));
  HEXA.push(norm([0, a / PHI, b * PHI]), norm([a / PHI, b * PHI, 0]), norm([b * PHI, 0, a / PHI]));
  for (const c of [-1, 1]) HEXA.push(norm([a, b, c]));
}
function fussball(x, y, z) {
  let d1 = -2, d2 = -2, penta = false;
  for (const [list, isP] of [[PENTA, true], [HEXA, false]]) for (const p of list) {
    const d = p[0] * x + p[1] * y + p[2] * z;
    if (d > d1) { d2 = d1; d1 = d; penta = isP; } else if (d > d2) d2 = d;
  }
  if (d1 - d2 < 0.012) return [90, 90, 90];
  return penta ? [30, 30, 30] : [250, 250, 250];
}
function melone(x, y, z, lat, lon) {
  const s = Math.sin(lon * 14 + Math.sin(lat * 9) * 0.7);
  return s > 0.35 ? [28, 100, 40] : [80, 170, 80];
}
function planet(x, y, z, lat, lon) {
  const cols = [[232, 192, 125], [201, 135, 74], [242, 221, 176], [181, 112, 58], [220, 170, 110]];
  const t = lat * 5 + Math.sin(lon * 3) * 0.15;
  const c = cols[((Math.floor(t) % cols.length) + cols.length) % cols.length];
  const spot = Math.hypot(lat + 0.35, (lon - 2) * 0.5) < 0.18;
  return spot ? [190, 80, 50] : c;
}
function regenbogen(x, y, z, lat) {
  const cols = [[228, 3, 3], [255, 140, 0], [255, 237, 0], [0, 128, 38], [0, 77, 255], [117, 7, 135], [228, 3, 3]];
  return cols[Math.min(6, Math.floor((lat / Math.PI + 0.5) * 7))];
}
function gold(x, y, z, lat, lon) {
  const s = 0.85 + 0.15 * Math.sin(lon * 6 + lat * 4);
  return [255 * s, 200 * s, 40 * s];
}
