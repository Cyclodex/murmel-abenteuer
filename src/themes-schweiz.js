// Thema der Welt Schweiz. Jedes Level ist ein eigener Ort und wählt mit variante sein Aussehen:
//   kaeserei = Käsekeller (Steinplatten, Holz), uhrwerk = im Uhrgehäuse (Messing, Stahl), schoggi = Schoggifabrik (Fliesen, Schoggi).
// view.js legt die Variante über das Thema: { ...schweiz, ...schweiz.varianten[level.variante] }.
// Looks für look: 'kaese', 'rinde', 'holz', 'holz-dunkel', 'kupfer', 'messing', 'messing-dunkel', 'stahl', 'zifferblatt',
// 'schoggi', 'schoggi-dunkel', 'schoggi-weiss', 'folie'; Balken: farbe 'holz', 'messing', 'stahl', 'schoggi'.
import { canvasTex, woodTex, rnd, scatter } from './themes.js';
import { buildProp } from './props.js';

const FARBE = { rinde: 0xB57A24, kupfer: 0xC9753A, messing: 0x94742A, 'messing-dunkel': 0x6B5318, stahl: 0x8E97A4, zifferblatt: 0xFFF8E7, 'schoggi-dunkel': 0x3E2212, 'schoggi-weiss': 0xF3E5C8, folie: 0xE8C55A };
const GLANZ = { rinde: 12, kupfer: 120, messing: 70, 'messing-dunkel': 80, stahl: 120, zifferblatt: 90, 'schoggi-dunkel': 70, 'schoggi-weiss': 70, folie: 160 };

// Emmentaler: gelber Teig mit dunkleren, runden Stellen
const kaeseTex = T => canvasTex(T, 256, 256, (x, w, h) => {
  x.fillStyle = '#E3B22E'; x.fillRect(0, 0, w, h);
  const r = rnd(41);
  for (let i = 0; i < 26; i++) { const s = 5 + r() * 14; x.fillStyle = i % 3 ? '#CF9C22' : '#EEC448'; x.beginPath(); x.arc(r() * w, r() * h, s, 0, 7); x.fill(); }
});
// Steinplatten im Keller
const plattenTex = (T, hell, dunkel, fuge) => canvasTex(T, 256, 256, (x, w, h) => {
  x.fillStyle = fuge; x.fillRect(0, 0, w, h);
  const r = rnd(43);
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
    x.fillStyle = (i + j) % 2 ? hell : dunkel; x.fillRect(i * 128 + 3, j * 128 + 3, 122, 122);
    x.fillStyle = 'rgba(0,0,0,0.06)'; for (let k = 0; k < 14; k++) x.fillRect(i * 128 + 6 + r() * 110, j * 128 + 6 + r() * 110, 3 + r() * 8, 2 + r() * 4);
  }
});
// Stahlplatte: gebürstet, Messingnieten in den Ecken
const plattenStahlTex = T => canvasTex(T, 128, 128, (x, w, h) => {
  x.fillStyle = '#5F6875'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#7E8794'; x.fillRect(3, 3, w - 6, h - 6);
  const r = rnd(47);
  for (let i = 0; i < 40; i++) { x.strokeStyle = i % 2 ? 'rgba(255,255,255,0.14)' : 'rgba(40,50,70,0.12)'; x.beginPath(); const y = r() * h; x.moveTo(4, y); x.lineTo(w - 4, y + (r() - 0.5) * 3); x.stroke(); }
  x.fillStyle = '#B8922A'; for (const [a, b] of [[11, 11], [w - 11, 11], [11, h - 11], [w - 11, h - 11]]) { x.beginPath(); x.arc(a, b, 4.5, 0, 7); x.fill(); }
});
// Schoggitafel: Stücke mit Rille dazwischen
const schoggiTex = T => canvasTex(T, 128, 128, (x, w, h) => {
  x.fillStyle = '#4E2A14'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
    x.fillStyle = '#6B3A1E'; x.fillRect(i * 64 + 4, j * 64 + 4, 56, 56);
    x.fillStyle = '#7C4826'; x.fillRect(i * 64 + 9, j * 64 + 9, 46, 46);
  }
});
// Fliesen (Fabrikboden), n x n je Kachel
const fliesenTex = (T, a, b, fuge, n = 2) => canvasTex(T, 128, 128, (x, w, h) => {
  const s = w / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { x.fillStyle = (i + j) % 2 ? a : b; x.fillRect(i * s, j * s, s, s); }
  x.strokeStyle = fuge; x.lineWidth = 2; for (let i = 0; i <= n; i++) { x.beginPath(); x.moveTo(i * s, 0); x.lineTo(i * s, h); x.moveTo(0, i * s); x.lineTo(w, i * s); x.stroke(); }
});

const phong = (T, color, shininess, extra) => new T.MeshPhongMaterial({ color, shininess, specular: 0x555555, ...extra });

export const schweiz = {
  // Grundwerte = Käserei (gelten auch ohne variante)
  sky: 0xF3E3C3, fog: [50, 125], hemi: [0xffffff, 0x8a6a3a, 0.8],
  walls: ['holz', 'holz-dunkel'],
  floor: t => t.lambert(0xffffff, { map: plattenTex(t.THREE, '#D9CDB8', '#C9BBA2', '#8C7F6A') }),
  ramp: t => t.lambert(0xffffff, { map: woodTex(t.THREE, '#D8B07A', '#8A5A2A') }),
  pillars: ['holz-dunkel'],
  bank: 0x8D6E4B,
  props: [['laib'], ['laib', 0xB8762A], ['kaeseregal'], ['milchkanne'], ['kessi'], ['kaese'], ['milch'], ['laib']],
  look(t, look) {
    const T = t.THREE, name = look.startsWith('klotz-') ? look.slice(6) : look; // Balken: 'klotz-' + farbe
    if (name === 'kaese') return t.lambert(0xffffff, { map: kaeseTex(T) });
    if (name === 'holz') return t.lambert(0xffffff, { map: woodTex(T, '#C89B6A', '#7A5230') });
    if (name === 'holz-dunkel') return t.lambert(0xffffff, { map: woodTex(T, '#8D6B47', '#4A3018') });
    if (name === 'schoggi') return phong(T, 0xffffff, 70, { map: schoggiTex(T) });
    if (FARBE[name] !== undefined) return phong(T, FARBE[name], GLANZ[name], name === 'folie' || name === 'stahl' ? { specular: 0xffffff } : {});
    return null;
  },
  // Kellerboden aus dunklen Steinplatten
  ground(t, y) {
    const tex = plattenTex(t.THREE, '#7A6652', '#6B5946', '#4A3D30'); tex.repeat.set(40, 40); t.plane(tex, y);
    scatter(t, y, this.props, 13);
  },

  varianten: {
    kaeserei: {},

    // Im Uhrgehäuse: dunkles Holz, warmes Licht, am Boden drehen sich grosse Zahnräder
    uhrwerk: {
      sky: 0x3B2A1A, fog: [60, 150], hemi: [0xFFE6B8, 0x4A3520, 0.8], sun: 0.75,
      walls: ['messing', 'messing-dunkel'],
      floor: t => t.lambert(0xffffff, { map: plattenStahlTex(t.THREE) }),
      ramp: t => t.lambert(0x6E7783),
      pillars: ['messing-dunkel'],
      bank: 0x6B5318,
      props: [['schraube'], ['schluessel'], ['glocke'], ['schraube'], ['schluessel', 0xB8C0CC]],
      ground(t, y) {
        const T = t.THREE, tex = woodTex(T, '#5A3E26', '#2E1D10'); tex.repeat.set(30, 30); t.plane(tex, y);
        scatter(t, y, this.props, 17, 18);
        const r = rnd(29), raeder = [];
        for (let i = 0; i < 8; i++) {
          const g = buildProp(T, 'zahnrad', { farbe: [0x6B5318, 0x59616C, 0x6E4226][i % 3] }), a = r() * Math.PI * 2, d = 18 + r() * 50;
          g.scale.set(1.5 + r() * 1.8, 1, 1).setZ(g.scale.x); g.position.set(Math.cos(a) * d, y + 0.02, Math.sin(a) * d - 25);
          t.scene.add(g); raeder.push({ g, w: (i % 2 ? -1 : 1) * (0.15 + r() * 0.25) });
        }
        return { tick(dt) { for (const o of raeder) o.g.rotation.y += o.w * dt; } };
      }
    },

    // Schoggifabrik: helle Fliesen, Stahl, Wände aus Schoggi
    schoggi: {
      sky: 0xFFE9D6, fog: [55, 130], hemi: [0xffffff, 0x9a7a5a, 0.85],
      walls: ['schoggi', 'schoggi-dunkel', 'schoggi-weiss'],
      floor: t => t.lambert(0xffffff, { map: fliesenTex(t.THREE, '#FBF6EC', '#F1E6D2', '#B9A88C') }),
      ramp: t => phong(t.THREE, 0x8E97A4, 110),
      pillars: ['stahl'],
      bank: 0x8E97A4,
      props: [['tafel'], ['praline'], ['praline', 0x8B5A2B], ['schoggihase'], ['praline', 0xF3E5C8], ['tafel', 0x1E88E5], ['praline', 0xF48FB1], ['milchkanne']],
      ground(t, y) {
        const tex = fliesenTex(t.THREE, '#8B5A3C', '#F3E5C8', '#5A3A22', 2); tex.repeat.set(50, 50); t.plane(tex, y);
        scatter(t, y, this.props, 19);
      }
    }
  }
};
