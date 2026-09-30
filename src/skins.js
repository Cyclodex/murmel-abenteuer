// Murmel-Designs. need = so viele Sterne braucht man insgesamt zum Freischalten ('alle' = alle Sterne).
// Jedes Design malt eine Kugel-Textur (Längen-/Breitengrad-Bild, 256 x 128).
// ball = Sprungkraft (Anteil der Aufprallgeschwindigkeit, der zurückkommt) an Wand und Boden,
// schwere = Faktor für die Schwerkraft (Mond hüpft leichter),
// dichte = g/cm³ wie beim echten Ball: unter 1 schwimmt die Murmel im Fluss, darüber sinkt sie auf den Grund
// (Glas 2.5, Planet = Saturn 0.69, Mond 3.34, Gold 19.3; Bälle aus Masse und Grösse nach Regel berechnet,
// Bowling = 16 lb, Melone ~0.94; Flummi 1.1 angenommen).
export const SKINS = [
  { id: 'standard', emoji: '🔵', need: 0, paint: standard, ball: { wand: 0.5, boden: 0.25, dichte: 2.5 } },
  { id: 'tennis', emoji: '🎾', need: 3, paint: pixels(tennis), ball: { wand: 0.75, boden: 0.7, dichte: 0.37 } },
  { id: 'fussball', emoji: '⚽', need: 5, paint: pixels(fussball), ball: { wand: 0.75, boden: 0.5, dichte: 0.08 } },
  { id: 'golf', emoji: '⛳', need: 7, paint: pixels(golf), bump: pixels(golfHoehe), ball: { wand: 0.8, boden: 0.3, rollen: 0.5, dichte: 1.13 } },
  { id: 'pingpong', emoji: '🏓', need: 9, paint: pixels(pingpong), ball: { wand: 0.85, boden: 0.85, schwere: 0.8, dichte: 0.08 } },
  { id: 'flummi', emoji: '🔴', need: 8, paint: pixels(flummi), ball: { wand: 0.97, boden: 0.93, dichte: 1.1 } },
  { id: 'melone', emoji: '🍉', need: 10, paint: pixels(melone), ball: { wand: 0.2, boden: 0.1, dichte: 0.94 } },
  { id: 'basketball', emoji: '🏀', need: 12, paint: pixels(basketball), ball: { wand: 0.8, boden: 0.8, dichte: 0.09 } },
  { id: 'billard', emoji: '🎱', need: 14, paint: billard, shiny: true, ball: { wand: 0.8, boden: 0.4, dichte: 1.74 } },
  { id: 'planet', emoji: '🪐', need: 15, paint: pixels(planet), ring: true, ball: { wand: 0.5, boden: 0.25, dichte: 0.69 } },
  { id: 'bowling', emoji: '🎳', need: 18, paint: pixels(bowling), shiny: true, ball: { wand: 0.1, boden: 0.05, dichte: 1.38 } },
  { id: 'regenbogen', emoji: '🌈', need: 20, paint: pixels(regenbogen), ball: { wand: 0.5, boden: 0.25, dichte: 2.5 } },
  { id: 'mond', emoji: '🌙', need: 24, paint: pixels(mond), ball: { wand: 0.6, boden: 0.6, schwere: 0.5, dichte: 3.34 } },
  { id: 'gold', emoji: '🏅', need: 'alle', paint: pixels(gold), shiny: true, ball: { wand: 0.35, boden: 0.15, dichte: 19.3 } }
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
function flummi(x, y, z, lat, lon) {
  // roter Gummiball mit gelbem Wirbelstreifen
  const s = Math.sin(lon * 2 + lat * 5);
  return s > 0.8 ? [255, 214, 0] : [230, 30, 60];
}
function tennis(x, y, z, lat, lon) {
  // gelbgrüner Filz mit weisser Naht (Sattelkurve)
  return Math.abs(lat - 0.6 * Math.sin(2 * lon)) < 0.06 ? [245, 245, 235] : [205, 230, 60];
}
// Punkte gleichmässig auf der Kugel (Fibonacci), für Golf-Dellen (echte Golfbälle haben ~300-400)
const DIMPLE_N = 320, DIMPLE_R = 0.085; // Radius der Delle in Bogenmass (Abstand der Punkte ~0.2)
const DIMPLES = Array.from({ length: DIMPLE_N }, (_, i) => {
  const y = 1 - 2 * (i + 0.5) / DIMPLE_N, r = Math.sqrt(1 - y * y), a = i * Math.PI * (3 - Math.sqrt(5));
  return [r * Math.cos(a), y, r * Math.sin(a)];
});
// 0 = Mitte der nächsten Delle, 1 = Rand oder ausserhalb
function dimple(x, y, z) {
  let d = -1;
  for (const p of DIMPLES) d = Math.max(d, p[0] * x + p[1] * y + p[2] * z);
  return Math.min(1, Math.acos(Math.min(1, d)) / DIMPLE_R);
}
function golf(x, y, z) {
  const c = 244 + 8 * dimple(x, y, z); // Delle innen leicht dunkler, die Form kommt aus der Bump-Map
  return [c, c, c - 4];
}
// Höhe für die Bump-Map: runde Mulde (Kugelschale), aussen weiss = oben
function golfHoehe(x, y, z) {
  const t = dimple(x, y, z), c = 255 * (t < 1 ? t * t : 1);
  return [c, c, c];
}
// orange mit feiner Naht am Äquator und rundem weissem Aufdruck mit dunklem Ring
const LOGO = norm([0.8, 0.55, 0.25]);
function pingpong(x, y, z) {
  const k = LOGO[0] * x + LOGO[1] * y + LOGO[2] * z;
  if (k > 0.955) return k > 0.97 ? [250, 245, 235] : k > 0.962 ? [60, 40, 30] : [250, 245, 235];
  return Math.abs(y) < 0.03 ? [230, 115, 30] : [255, 140, 40];
}
function basketball(x, y, z) {
  const line = Math.abs(y) < 0.025 || Math.abs(z) < 0.025 || Math.abs(Math.abs(x) - 0.72) < 0.025;
  return line ? [30, 20, 15] : [226, 106, 38];
}
function billard(ctx, w, h) {
  // schwarze Acht: weisser Kreis mit 8 (Textur 2:1, Kreis bleibt auf der Kugel rund)
  ctx.fillStyle = '#111'; ctx.fillRect(0, 0, w, h);
  for (const cx of [w * 0.25, w * 0.75]) {
    ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(cx, h / 2, h * 0.17, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111'; ctx.font = `bold ${h * 0.24}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('8', cx, h / 2 + h * 0.01);
  }
}
const HOLES = [[0.2, 0.9, 0.12], [-0.05, 0.93, 0.25], [0.02, 0.97, -0.2]].map(norm);
function bowling(x, y, z, lat, lon) {
  for (const p of HOLES) if (p[0] * x + p[1] * y + p[2] * z > 0.994) return [10, 10, 20];
  const s = Math.sin(lon * 3 + Math.sin(lat * 6 + lon) * 2); // marmoriert
  return s > 0.6 ? [150, 60, 200] : [60, 30, 130];
}
const CRATERS = [[0.6, 0.3, 0.74, 0.35], [-0.5, 0.6, 0.62, 0.25], [0.1, -0.7, 0.7, 0.3], [-0.8, -0.2, -0.56, 0.4], [0.3, 0.2, -0.93, 0.2], [-0.2, 0.9, -0.38, 0.22]]
  .map(([a, b, c, r]) => [...norm([a, b, c]), Math.cos(r)]);
function mond(x, y, z) {
  let c = 175 + 20 * Math.sin(x * 9 + y * 5) * Math.sin(z * 7);
  for (const [a, b, d, cr] of CRATERS) {
    const k = a * x + b * y + d * z;
    if (k > cr) c = k > cr + (1 - cr) * 0.25 ? 120 : 215; // Kraterboden dunkel, Rand hell
  }
  return [c, c, c + 10];
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
