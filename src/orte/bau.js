// Echte Orte: baut einen Raum (Wände, Boden, Decke, Fenster, Tür, Möbel, Kleinkram) als Kulisse um ein Level, nur Grafik.
// Der Ort steht in cm (src/orte/<ort>.js), das Level sagt mit bereich, wo sein Nullpunkt im Raum liegt:
//   bereich = { at: [x, y, z] in cm (Raumpunkt, der im Level bei 0, 0, 0 liegt), yaw: Grad, strecke: [Möbel-ids] }
//   Level-Achsen bei yaw 0: x = Osten, y = oben, -z = Norden; yaw dreht den Raum um den Nullpunkt (90: Osten = -z).
//   strecke = Möbel, deren Oberfläche das Level selbst als Teile baut: bei 'tisch' zeichnet der Ort dann Beine und
//   Schubladenkorpus (oberste Schublade offen), bei 'bett' Gestell und Kopfteil, bei 'nachttisch' nur Schubladenfront
//   und Knopf, sonst gar nichts.
// Wände und Decke zeigen nur nach innen (three.js zeichnet nur die Vorderseite): Von aussen, z. B. beim Überflug oder
// wenn die Kamera hinter einer Wand steht, sieht man wie in ein Puppenhaus hinein.
// Leistung (Handy): Alle Teile gleicher Farbe werden am Ende zu einem Mesh zusammengefasst (ein Draw Call pro Material).
export const CM = 1 / 1.6; // 1 Einheit = 1.6 cm

// kleiner Zufall mit Startwert (gleiches Zimmer bei jedem Laden)
function zufall(s) {
  return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

export function bauOrt(T, scene, ort, bereich = {}) {
  const a = bereich.at || [0, 0, 0], strecke = new Set(bereich.strecke || []);
  const root = new T.Group();
  root.rotation.y = (bereich.yaw || 0) * Math.PI / 180;
  scene.add(root);
  const PI = Math.PI;
  const P = (x, y, z) => new T.Vector3((x - a[0]) * CM, (y - a[1]) * CM, -(z - a[2]) * CM);

  // ---------- Sammeln pro Material, am Ende zusammenfassen ----------
  const gruppen = new Map();
  const put = (geo, c, extra) => {
    const k = c + (extra ? JSON.stringify(extra) : '');
    if (!gruppen.has(k)) gruppen.set(k, { c, extra, geos: [] });
    gruppen.get(k).geos.push(geo);
  };
  const M = new T.Matrix4(), Q = new T.Quaternion(), E = new T.Euler(), SK = new T.Vector3(CM, CM, CM);
  // Geometrie in cm an einen Raumpunkt setzen; rot = Euler im Spiel (um y: positiv dreht Osten nach Norden)
  const teil = (geo, x, y, z, rot, c, extra) => {
    E.set(...(rot || [0, 0, 0])); Q.setFromEuler(E);
    M.compose(P(x, y, z), Q, SK); geo.applyMatrix4(M); put(geo, c, extra);
  };
  // Quader von x0..x1, y0..y1, z0..z1 (cm)
  const box = (x0, x1, y0, y1, z0, z1, c, extra) => {
    if (x1 - x0 <= 0 || y1 - y0 <= 0 || z1 - z0 <= 0) return;
    teil(new T.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, null, c, extra);
  };
  // gedrehter Quader um seine Mitte (w entlang x, h entlang y, d entlang z vor dem Drehen)
  const dbox = (cx, cy, cz, w, h, d, rot, c) => teil(new T.BoxGeometry(w, h, d), cx, cy, cz, rot, c);
  // Quader ohne die Seiten in ohne (z. B. 'z+'): von dort sieht die Kamera hindurch (wie bei den Wänden)
  const schale = (x0, x1, y0, y1, z0, z1, c, ohne) => {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, mz = (z0 + z1) / 2, w = x1 - x0, h = y1 - y0, d = z1 - z0;
    for (const [n, p, a, b] of [['x+', [x1, my, mz], d, h], ['x-', [x0, my, mz], d, h], ['y+', [mx, y1, mz], w, d], ['y-', [mx, y0, mz], w, d], ['z+', [mx, my, z1], w, h], ['z-', [mx, my, z0], w, h]])
      if (!ohne.includes(n)) flaeche(...p, a, b, n, c);
  };
  // Rechteck (Vorderseite zeigt in Richtung n = 'x+', 'x-', 'y+', 'y-', 'z+', 'z-' im Raum)
  const ROT = { 'z+': [0, PI, 0], 'z-': [0, 0, 0], 'x+': [0, PI / 2, 0], 'x-': [0, -PI / 2, 0], 'y+': [-PI / 2, 0, 0], 'y-': [PI / 2, 0, 0] };
  const flaeche = (cx, cy, cz, w, h, n, c, extra) => teil(new T.PlaneGeometry(w, h), cx, cy, cz, ROT[n], c, extra);
  // Zylinder (Achse 'x', 'y' oder 'z'), Mitte bei x, y, z
  const zyl = (x, y, z, r0, r1, h, achse, c, seg = 12, extra) =>
    teil(new T.CylinderGeometry(r0, r1, h, seg), x, y, z, achse === 'x' ? [0, 0, PI / 2] : achse === 'z' ? [PI / 2, 0, 0] : null, c, extra);
  const kugel = (x, y, z, r, c, s = [1, 1, 1], seg = 10, extra) => {
    const g = new T.SphereGeometry(r, seg, Math.max(4, Math.round(seg * 0.6))); g.scale(...s); teil(g, x, y, z, null, c, extra);
  };
  // flacher Kreis auf dem Boden (Oberkante y)
  const scheibe = (x, y, z, r, c, h = 0.3, seg = 20) => zyl(x, y - h / 2, z, r, r, h, 'y', c, seg);

  const [W, H, D] = ort.cm, F = ort.farben || {};
  const WEX = { emissive: F.wandLicht ?? 0x262624 }; // Wände und Decke etwas heller als nur Himmelslicht
  const WAND = F.wand ?? 0xEDE6DA, DECKE = F.decke ?? 0xF7F5F0, LEISTE = F.leiste ?? 0xF4F1EA;
  const HOLZ = F.holz ?? 0xD6BC94, METALL = F.metall ?? 0xA9AEB4, WEISS = F.weiss ?? 0xF3F1EC, DUNKEL = 0x4A3B2C;
  const dunkler = (c, f = 0.8) => new T.Color(c).multiplyScalar(f).getHex();
  const schatten = (x0, x1, z0, z1, y = 0.4) => flaeche((x0 + x1) / 2, y, (z0 + z1) / 2, x1 - x0, z1 - z0, 'y+', 0x000000, { transparent: true, opacity: 0.13, depthWrite: false });
  // weiche Bodenschatten: zwei Lagen (aussen schwach, innen stärker)
  const bodenSchatten = (x0, x1, z0, z1, r = 4) => { schatten(x0 - r, x1 + r, z0 - r, z1 + r, 0.4); schatten(x0 + r / 2, x1 - r / 2, z0 + r / 2, z1 - r / 2, 0.45); };

  // ---------- Boden: Parkett in Dielen (Fugen = dunklerer Grund dazwischen) ----------
  flaeche(W / 2, 0, D / 2, W, D, 'y+', F.fuge ?? 0x9C7A56);
  {
    const r = zufall(7), dielen = F.boden ?? [0xC9A47C, 0xBF996F, 0xD2AE86], B = 14;
    for (let z = 0, reihe = 0; z < D; z += B, reihe++) {
      let x = -r() * 120;
      while (x < W) {
        const l = 90 + r() * 60, x0 = Math.max(0, x + 0.25), x1 = Math.min(W, x + l - 0.25), z1 = Math.min(D, z + B - 0.4);
        if (x1 > x0) flaeche((x0 + x1) / 2, 0.3, (z + z1) / 2, x1 - x0, z1 - z, 'y+', dielen[Math.floor(r() * dielen.length)]);
        x += l;
      }
    }
  }
  flaeche(W / 2, H, D / 2, W, D, 'y-', DECKE, WEX);

  // ---------- Wände mit Öffnungen ----------
  const wand = (seite, loch) => {
    const L = seite === 'S' || seite === 'N' ? W : D;
    const stueck = (u0, u1, y0, y1) => {
      if (u1 - u0 < 0.1 || y1 - y0 < 0.1) return;
      const u = (u0 + u1) / 2, y = (y0 + y1) / 2, w = u1 - u0, h = y1 - y0;
      if (seite === 'S') flaeche(u, y, 0, w, h, 'z+', WAND, WEX);
      if (seite === 'N') flaeche(u, y, D, w, h, 'z-', WAND, WEX);
      if (seite === 'W') flaeche(0, y, u, w, h, 'x+', WAND, WEX);
      if (seite === 'O') flaeche(W, y, u, w, h, 'x-', WAND, WEX);
    };
    if (!loch) { stueck(0, L, 0, H); return; }
    stueck(0, loch.von, 0, H); stueck(loch.bis, L, 0, H);
    stueck(loch.von, loch.bis, 0, loch.unten); stueck(loch.von, loch.bis, loch.oben, H);
  };
  const fe = ort.fenster, tu = ort.tuer;
  for (const s of ['S', 'N', 'W', 'O']) wand(s, fe && fe.wand === s ? fe : null);
  // Dinge an der Wand: u = entlang der Wand (S/N: x, W/O: z), t = Abstand von der Wand in den Raum
  const wandBox = (s, u0, u1, y0, y1, t0, t1, c) => {
    if (s === 'S') box(u0, u1, y0, y1, t0, t1, c);
    else if (s === 'N') box(u0, u1, y0, y1, D - t1, D - t0, c);
    else if (s === 'W') box(t0, t1, y0, y1, u0, u1, c);
    else box(W - t1, W - t0, y0, y1, u0, u1, c);
  };
  const wandPunkt = (s, u, y, t) => s === 'S' ? [u, y, t] : s === 'N' ? [u, y, D - t] : s === 'W' ? [t, y, u] : [W - t, y, u];
  const wandRund = (s, u, y, r, t0, t1, c, seg = 16) => zyl(...wandPunkt(s, u, y, (t0 + t1) / 2), r, r, t1 - t0, s === 'S' || s === 'N' ? 'z' : 'x', c, seg);
  // Strich in der Wandebene ab (u, y), Länge l, Breite b, Winkel w (0 = entlang u, PI/2 = nach oben)
  const wandStrich = (s, u, y, t0, t1, l, b, w, c) => {
    const [x, yy, z] = wandPunkt(s, u + Math.cos(w) * l / 2, y + Math.sin(w) * l / 2, (t0 + t1) / 2);
    const sgn = s === 'N' || s === 'O' ? -1 : 1; // auf N und O läuft u für den Betrachter nach links
    if (s === 'S' || s === 'N') dbox(x, yy, z, l, b, t1 - t0, [0, 0, w], c);
    else dbox(x, yy, z, t1 - t0, b, l, [w, 0, 0], c);
    return sgn;
  };

  // Fussleisten (6 cm hoch, 1.5 cm tief), an der Tür unterbrochen
  box(0, W, 0, 6, 0, 1.5, LEISTE);
  if (tu && tu.wand === 'N') { box(0, tu.von - 8, 0, 6, D - 1.5, D, LEISTE); box(tu.bis + 8, W, 0, 6, D - 1.5, D, LEISTE); }
  else box(0, W, 0, 6, D - 1.5, D, LEISTE);
  box(0, 1.5, 0, 6, 0, D, LEISTE); box(W - 1.5, W, 0, 6, 0, D, LEISTE);

  // Bordüre (Tapetenband) mit Mustern, an Fenster und Tür unterbrochen
  if (F.bordure) {
    const { y: by, h: bh, grund, muster } = F.bordure;
    for (const s of ['S', 'N', 'W', 'O']) {
      const L = s === 'S' || s === 'N' ? W : D, luecken = [];
      if (fe && fe.wand === s && by + bh > fe.unten && by < fe.oben) luecken.push([fe.von - 2, fe.bis + 2]);
      if (tu && tu.wand === s && by < tu.hoehe + 8) luecken.push([tu.von - 8, tu.bis + 8]);
      let u = 0;
      for (const [l0, l1] of [...luecken.sort((p, q) => p[0] - q[0]), [L, L]]) {
        if (l0 > u) {
          wandBox(s, u, l0, by, by + bh, 0, 0.4, grund);
          for (let m = u + 10, i = 0; m < l0 - 6; m += 22, i++) {
            const c = muster[i % muster.length];
            if (i % 2) wandBox(s, m - 3, m + 3, by + bh / 2 - 3, by + bh / 2 + 3, 0.4, 0.7, c);
            else wandRund(s, m, by + bh / 2, 3.2, 0.4, 0.7, c, 12);
          }
        }
        u = Math.max(u, l1);
      }
    }
  }

  // ---------- Fenster (Südwand): Laibung, Rahmen, zwei Flügel, Griff, Fensterbank aussen, Vorhänge ----------
  if (fe && fe.wand === 'S') {
    const R = 6, F2 = 5, c = F.rahmen ?? 0xFAFAFA, mx = (fe.von + fe.bis) / 2, TW = 24;
    // Laibung (Wandstärke)
    flaeche(fe.von, (fe.unten + fe.oben) / 2, -TW / 2, TW, fe.oben - fe.unten, 'x+', WAND, WEX);
    flaeche(fe.bis, (fe.unten + fe.oben) / 2, -TW / 2, TW, fe.oben - fe.unten, 'x-', WAND, WEX);
    flaeche(mx, fe.oben, -TW / 2, fe.bis - fe.von, TW, 'y-', WAND, WEX);
    flaeche(mx, fe.unten, -TW / 2, fe.bis - fe.von, TW, 'y+', LEISTE);
    box(fe.von - 4, fe.bis + 4, fe.unten - 4, fe.unten, -TW - 4, -TW + 2, 0x9EA3A8); // Fensterbank aussen (Alu)
    // Blendrahmen
    const z0 = -14, z1 = -8;
    box(fe.von, fe.bis, fe.unten, fe.unten + R, z0, z1, c); box(fe.von, fe.bis, fe.oben - R, fe.oben, z0, z1, c);
    box(fe.von, fe.von + R, fe.unten, fe.oben, z0, z1, c); box(fe.bis - R, fe.bis, fe.unten, fe.oben, z0, z1, c);
    // zwei Flügel mit eigenem Rahmen und Glas
    for (const [u0, u1] of [[fe.von + R, mx], [mx, fe.bis - R]]) {
      const v0 = fe.unten + R, v1 = fe.oben - R, fz0 = -9, fz1 = -3;
      box(u0, u1, v0, v0 + F2, fz0, fz1, c); box(u0, u1, v1 - F2, v1, fz0, fz1, c);
      box(u0, u0 + F2, v0, v1, fz0, fz1, c); box(u1 - F2, u1, v0, v1, fz0, fz1, c);
      box(u0 + F2, u1 - F2, v0 + F2, v0 + F2 + 1.5, fz1 - 1, fz1, 0xD8D8D8); // Glasleiste unten
      flaeche((u0 + u1) / 2, (v0 + v1) / 2, -6, u1 - u0 - 2 * F2, v1 - v0 - 2 * F2, 'z+', 0xCFEFFF, { transparent: true, opacity: 0.16, depthWrite: false });
    }
    // Griff am rechten Flügel (Rosette und Hebel nach unten)
    box(mx + 1.5, mx + 4, 148, 156, -3, -2, 0xF0F0F0); box(mx + 1.8, mx + 3.7, 138, 152, -2, -0.5, 0xF0F0F0);
    // Fensterbank innen: Platte mit Vorderkante
    // (die Fensterbank steht als Möbel 'fensterbank' in den Daten)
    // Vorhänge beidseitig (Stoffbahnen in Falten), Stange mit Endkugeln
    const vh = ort.vorhang;
    if (vh) {
      const r = zufall(3), sy = vh.stange ?? fe.oben + 14, sz = vh.z ?? 9;
      zyl((vh.links[0] + vh.rechts[1]) / 2, sy, sz, 1.1, 1.1, vh.rechts[1] - vh.links[0] + 16, 'x', METALL, 10);
      kugel(vh.links[0] - 9, sy, sz, 2.4, METALL, undefined, 8); kugel(vh.rechts[1] + 9, sy, sz, 2.4, METALL, undefined, 8);
      for (const x of [vh.links[0] - 2, vh.rechts[1] + 2]) box(x - 1, x + 1, sy - 1, sy + 1, 0, sz, METALL); // Halter
      for (const [x0, x1] of [vh.links, vh.rechts]) {
        const n = Math.round((x1 - x0) / 4), wi = (x1 - x0) / n, y0 = vh.unten ?? 3, y1 = sy - 2;
        for (let i = 0; i < n; i++) {
          const cx = x0 + wi * (i + 0.5);
          // nur Vorderseite (zum Zimmer): Die Weitsicht-Kamera steht teils hinter dem Vorhang und sieht hindurch
          // Falten: Bahnen abwechselnd vorn (hell) und hinten (dunkler), alle nach Norden
          flaeche(cx, (y0 + y1) / 2, sz + (i % 2 ? 2.6 : 0.6), wi + 0.5, y1 - y0 - r() * 1.5, 'z+', i % 2 ? vh.farbe : dunkler(vh.farbe, 0.86));
        }
        for (let i = 0; i < n; i += 2) zyl(x0 + wi * (i + 0.5), sy, sz, 1.7, 1.7, 0.6, 'x', METALL, 8); // Ringe
      }
    }

    // ---------- draussen: Garten, Zaun, Bäume, Nachbarhaus ----------
    // draussen scheint die Sonne: Eigenleuchten statt Schattenseite (die Sonne im Spiel folgt der Murmel)
    const g = ort.aussen ?? -275, hell = c => ({ emissive: dunkler(c, 0.45) });
    const ab = (x0, x1, y0, y1, z0, z1, c) => box(x0, x1, y0, y1, z0, z1, c, hell(c));
    flaeche(W / 2, g, -1500, 6000, 3000, 'y+', 0x8DBF5A, hell(0x8DBF5A)); // Rasen
    flaeche(170, g + 0.5, -1100, 60, 1000, 'y+', 0xCFC4B0, hell(0xCFC4B0)); // Gartenweg
    for (const [tx, tz, s] of [[620, -420, 1], [-260, -900, 0.8], [800, -1300, 0.9]]) { // Bäume
      zyl(tx, g + 180 * s, tz, 10 * s, 15 * s, 360 * s, 'y', 0x7A5A3C, 8, hell(0x7A5A3C));
      for (const [dx, dy, dz, rr, c] of [[0, 380, 0, 120, 0x6FA84A], [70, 470, -30, 85, 0x5E9640], [-60, 480, 20, 80, 0x79B254]])
        kugel(tx + dx * s, g + dy * s, tz + dz * s, rr * s, c, [1, 0.9, 1], 10, hell(c));
    }
    // Lattenzaun mit Büschen dahinter
    const zz = -650;
    ab(-700, 1100, g + 35, g + 43, zz - 1, zz + 1, 0xEAE4D4); ab(-700, 1100, g + 75, g + 83, zz - 1, zz + 1, 0xEAE4D4);
    for (let x = -700; x < 1100; x += 14) ab(x, x + 8, g, g + 100, zz + 1, zz + 3, 0xF2EEE2);
    for (let x = -600; x < 1000; x += 110) kugel(x, g + 20, zz - 40, 55, 0x5B8C3E, [1, 0.7, 0.8], 8, hell(0x5B8C3E));
    // Nachbarhaus: Wände, Satteldach, Giebel, Kamin, Fenster, Tür
    const hx0 = -300, hx1 = 600, hz0 = -2050, hz1 = -1600, hy = g + 560, mz = (hz0 + hz1) / 2, tiefe = (hz1 - hz0) / 2, first = 280;
    ab(hx0, hx1, g, hy, hz0, hz1, 0xF6ECDA);
    const dl = Math.hypot(tiefe + 40, first), dw = Math.atan2(first, tiefe + 40);
    teil(new T.BoxGeometry(hx1 - hx0 + 60, 10, dl), (hx0 + hx1) / 2, hy + first / 2, hz1 - (tiefe - 40) / 2 + 20, [dw, 0, 0], 0xB5533C, hell(0xB5533C));
    teil(new T.BoxGeometry(hx1 - hx0 + 60, 10, dl), (hx0 + hx1) / 2, hy + first / 2, hz0 + (tiefe - 40) / 2 - 20, [-dw, 0, 0], 0xB5533C, hell(0xB5533C));
    const giebel = new T.Shape([new T.Vector2(-tiefe, 0), new T.Vector2(tiefe, 0), new T.Vector2(0, first)]);
    for (const x of [hx0, hx1]) teil(new T.ShapeGeometry(giebel), x, hy, mz, [0, x === hx0 ? -PI / 2 : PI / 2, 0], 0xF6ECDA, hell(0xF6ECDA));
    ab(hx0 + 360, hx0 + 420, hy + first - 40, hy + first + 60, mz - 25, mz + 25, 0x9A6B55); // Kamin
    for (const [u, y0, h] of [[-220, 60, 180], [380, 60, 130], [-220, 340, 130], [20, 340, 130], [240, 340, 130], [440, 340, 130]]) {
      ab(u - 6, u + 106, g + y0 - 6, g + y0 + h + 6, hz1, hz1 + 3, 0xFFFFFF);
      ab(u, u + 100, g + y0, g + y0 + h, hz1 + 3, hz1 + 4, 0x8FB0C8);
      ab(u + 48, u + 52, g + y0, g + y0 + h, hz1 + 4, hz1 + 5, 0xFFFFFF);
    }
    ab(120, 220, g, g + 210, hz1, hz1 + 4, 0x8A5A3B); ab(110, 230, g + 210, g + 222, hz1, hz1 + 30, 0x9E9E9E); // Haustür, Vordach
  }

  // ---------- Tür mit Zarge, Füllungen, Klinke, Schlüsselloch ----------
  if (tu) {
    const s = tu.wand, c = F.tuer ?? WEISS, fc = dunkler(c, 0.96);
    wandBox(s, tu.von - 8, tu.von, 0, tu.hoehe + 8, 0, 2, c); wandBox(s, tu.bis, tu.bis + 8, 0, tu.hoehe + 8, 0, 2, c);
    wandBox(s, tu.von - 8, tu.bis + 8, tu.hoehe, tu.hoehe + 8, 0, 2, c);
    wandBox(s, tu.von + 0.5, tu.bis - 0.5, 0.8, tu.hoehe - 0.5, 0, 3.5, c);
    const br = tu.bis - tu.von;
    for (const [v0, v1] of [[18, 88], [112, 182]]) for (const [u0, u1] of [[12, br / 2 - 5], [br / 2 + 5, br - 12]])
      wandBox(s, tu.von + u0, tu.von + u1, v0, v1, 3.5, 4.3, fc);
    const ku = tu.bis - 8;
    wandRund(s, ku, 105, 2.6, 3.5, 4.5, METALL, 14); wandRund(s, ku, 105, 1, 4.5, 8.5, METALL, 8);
    wandBox(s, ku - 13, ku + 1, 104, 106.2, 7.5, 9.5, METALL); // Drücker
    wandBox(s, ku - 2, ku + 2, 86, 94, 3.5, 4.3, METALL); wandBox(s, ku - 0.5, ku + 0.5, 88, 91, 4.3, 4.5, 0x333333);
  }

  // ---------- Dinge an den Wänden ----------
  for (const d of ort.wand || []) {
    const s = d.wand, u = d.u, y = d.y;
    if (d.art === 'steckdose') { // 8 × 8 cm, n nebeneinander
      const n = d.n ?? 1;
      wandBox(s, u - 4, u - 4 + 8 * n, y - 4, y + 4, 0, 0.8, 0xFAFAF6);
      for (let i = 0; i < n; i++) {
        const m = u + 8 * i;
        wandRund(s, m, y, 2.9, 0.8, 1.1, 0xEDEDE8, 16);
        wandRund(s, m - 1, y, 0.35, 1.1, 1.2, 0x333333, 6); wandRund(s, m + 1, y, 0.35, 1.1, 1.2, 0x333333, 6);
      }
    } else if (d.art === 'schalter') {
      wandBox(s, u - 4, u + 4, y - 4, y + 4, 0, 0.8, 0xFAFAF6); wandBox(s, u - 2.6, u + 2.6, y - 2.6, y + 2.6, 0.8, 1.5, 0xF0F0EC);
    } else if (d.art === 'poster') { // Weltraum-Poster: Rahmen, Hintergrund, Planeten, Sterne, Rakete
      const [bw, bh] = d.gross, u0 = u - bw / 2, y0 = y - bh / 2, r = zufall(11);
      wandBox(s, u0, u0 + bw, y0, y0 + bh, 0, 1, 0xFFFFFF);
      wandBox(s, u0 + 2, u0 + bw - 2, y0 + 2, y0 + bh - 2, 1, 1.2, 0x2E4A7D);
      wandRund(s, u0 + bw * 0.3, y0 + bh * 0.68, bw * 0.16, 1.2, 1.5, 0xF2A65A, 24);
      wandStrich(s, u0 + bw * 0.3 - bw * 0.27, y0 + bh * 0.68 - bw * 0.06, 1.5, 1.7, bw * 0.55, 1.4, 0.22, 0xF6D58E); // Ring
      wandRund(s, u0 + bw * 0.74, y0 + bh * 0.4, bw * 0.09, 1.2, 1.5, 0x7FC4E8, 20);
      wandRund(s, u0 + bw * 0.2, y0 + bh * 0.2, bw * 0.06, 1.2, 1.5, 0xE57373, 16);
      for (let i = 0; i < 18; i++) { const su = u0 + 4 + r() * (bw - 8), sy = y0 + 4 + r() * (bh - 8); wandBox(s, su - 0.6, su + 0.6, sy - 0.6, sy + 0.6, 1.2, 1.4, 0xFFF6C8); }
      // Rakete: Rumpf, Spitze (als gedrehter Strich), Flamme
      wandBox(s, u0 + bw * 0.62, u0 + bw * 0.7, y0 + bh * 0.62, y0 + bh * 0.84, 1.2, 1.6, 0xF2F2F2);
      wandStrich(s, u0 + bw * 0.62, y0 + bh * 0.84, 1.2, 1.6, bw * 0.06, bw * 0.06, PI / 4, 0xE05050);
      wandBox(s, u0 + bw * 0.63, u0 + bw * 0.69, y0 + bh * 0.56, y0 + bh * 0.62, 1.2, 1.5, 0xF6B04A);
    } else if (d.art === 'uhr') { // Wanduhr: Rand, Zifferblatt, Striche, Zeiger
      const R = d.r ?? 15;
      wandRund(s, u, y, R, 0, 3, d.farbe ?? 0xE57373, 28); wandRund(s, u, y, R - 1.6, 3, 3.3, 0xFFFFFF, 28);
      for (let i = 0; i < 12; i++) { const w = i * PI / 6, l = i % 3 ? 1.4 : 2.6; wandStrich(s, u + Math.cos(w) * (R - 2.4 - l), y + Math.sin(w) * (R - 2.4 - l), 3.3, 3.6, l, i % 3 ? 0.5 : 0.9, w, 0x333333); }
      const sg = s === 'N' || s === 'O' ? -1 : 1; // Zeiger: 10 nach 3 (vom Betrachter aus)
      wandStrich(s, u, y, 3.6, 4, R * 0.55, 1.1, sg > 0 ? 0 : PI, 0x333333);
      wandStrich(s, u, y, 4, 4.4, R * 0.8, 0.7, sg > 0 ? PI / 3 : PI - PI / 3, 0x333333);
      wandRund(s, u, y, 0.9, 4.4, 4.8, 0xE05050, 8);
    } else if (d.art === 'zeichnung') { // Kinderzeichnung mit Klebeband: Haus, Sonne, Wiese
      const u0 = u - 10.5, y0 = y - 14.8;
      wandBox(s, u0, u0 + 21, y0, y0 + 29.7, 0, 0.2, 0xFDFDF8);
      wandBox(s, u0 + 3, u0 + 18, y0 + 3, y0 + 6, 0.2, 0.35, 0x7CB342);
      wandBox(s, u0 + 5, u0 + 13, y0 + 6, y0 + 14, 0.2, 0.35, 0xE57373);
      wandStrich(s, u0 + 4, y0 + 14, 0.2, 0.35, 7, 1.2, PI / 4, 0x8D6E63); wandStrich(s, u0 + 14, y0 + 14, 0.2, 0.35, 7, 1.2, 3 * PI / 4, 0x8D6E63);
      wandRund(s, u0 + 16, y0 + 23, 3, 0.2, 0.35, 0xFBC02D, 14);
      wandStrich(s, u0 + 6, y0 + 28.5, 0.35, 0.5, 9, 2, d.schief ?? 0.4, 0xF5F0D8); // Klebestreifen
    }
  }

  // ---------- Deckenlampe: Baldachin, Kabel, Stoffschirm, Glühbirne (aus) ----------
  {
    const lx = W / 2, lz = D / 2;
    zyl(lx, H - 1.5, lz, 6, 6, 3, 'y', WEISS, 16);
    zyl(lx, H - 25, lz, 0.4, 0.4, 44, 'y', 0x333333, 6);
    const prof = [new T.Vector2(9, 0), new T.Vector2(14, -6), new T.Vector2(22, -18), new T.Vector2(24, -22)];
    teil(new T.LatheGeometry(prof, 24), lx, H - 46, lz, null, F.schirm ?? 0xFFE8B8, { side: T.DoubleSide, emissive: 0x2A2010 });
    zyl(lx, H - 48, lz, 1.6, 1.6, 4, 'y', 0xC0C0C0, 8);
    kugel(lx, H - 54, lz, 4.5, 0xFFF8E6, [1, 1.2, 1], 10);
  }

  // ---------- Möbel ----------
  const r = zufall(23);
  const BUNT = F.buecher ?? [0xC0504D, 0x4F81BD, 0x6BA368, 0xF2C14E, 0x8E6BB8, 0xE8833A, 0x3E8E8A, 0xD98BA0, 0xEDE7DA];
  // Bücherreihe stehend, Rücken nach Westen bei x, entlang z von z0 bis z1, auf Höhe y
  const buecher = (x, y, z0, z1, hMax) => {
    let z = z0;
    while (z < z1 - 1.5) {
      const d = 1.6 + r() * 3.2, h = Math.min(hMax, 17 + r() * 12), t = 15 + r() * 8;
      if (z + d > z1) break;
      box(x, x + t, y, y + h, z, z + d - 0.15, BUNT[Math.floor(r() * BUNT.length)]);
      if (r() < 0.35) box(x - 0.1, x, y + h * 0.75, y + h * 0.82, z + 0.2, z + d - 0.35, 0xF2E6C0); // Band auf dem Rücken
      z += d;
    }
    return z;
  };
  const baustein = (x, y, z, yaw, c) => { // Duplo 2 × 4 (6.4 × 3.2 × 1.9 cm) mit Noppen
    dbox(x, y + 0.95, z, 6.4, 1.9, 3.2, [0, yaw, 0], c);
    const cs = Math.cos(yaw), sn = Math.sin(yaw);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {
      const du = (i - 1.5) * 1.6, dv = (j - 0.5) * 1.6; // im Spiel: um y gedreht, Norden = -z im Spiel
      zyl(x + du * cs - dv * sn, y + 2.1, z + du * sn + dv * cs, 0.48, 0.48, 0.5, 'y', c, 8);
    }
  };

  for (const m of ort.moebel) {
    const [x0, z0, x1, z1] = m.box, [y0, y1] = m.y, c = m.farbe ?? 0xBDBDBD, auf = strecke.has(m.id);
    const dk = dunkler(c);
    if (m.art === 'tisch') { // Schreibtisch: Platte, zwei Beine im Westen, Schubladenkorpus im Osten (Schubladen nach Norden)
      const p = m.platte ?? 4, kx0 = x1 - 45, ky1 = y1 - p;
      if (!auf) box(x0, x1, ky1, y1, z0, z1, c);
      bodenSchatten(x0, x1, z0, z1, 6);
      for (const z of [z0 + 2, z1 - 7]) box(x0 + 2, x0 + 7, y0, ky1, z, z + 5, dk);
      box(x0 + 7, kx0, 8, 12, z0 + 3, z0 + 6, dk); // Querstrebe hinten
      box(kx0, kx0 + 2, y0 + 4, ky1, z0 + 2, z1 - 2, c); box(x1 - 4, x1 - 2, y0 + 4, ky1, z0 + 2, z1 - 2, c);
      box(kx0 + 2, x1 - 4, y0 + 4, y0 + 6, z0 + 2, z1 - 2, c); box(kx0 + 2, x1 - 4, y0 + 6, ky1, z0 + 2, z0 + 4, c);
      box(kx0 + 1, x1 - 3, y0, y0 + 4, z0 + 4, z1 - 4, DUNKEL); // Sockel
      const fronten = [[y0 + 6, 30.5], [31.5, 55.5], [56.5, ky1 - 0.5]];
      fronten.forEach(([f0, f1], i) => {
        const offen = auf && i === 2; // die oberste Schublade zieht das Level heraus
        if (offen) { box(kx0 + 2, x1 - 4, f0, f1, z0 + 4, z1 - 3, 0x5A4632); return; }
        box(kx0 + 2.5, x1 - 4.5, f0, f1, z1 - 2, z1, c);
        box((kx0 + x1) / 2 - 7, (kx0 + x1) / 2 + 5, (f0 + f1) / 2 + 3, (f0 + f1) / 2 + 4.6, z1, z1 + 2.5, METALL);
      });
      if (!auf) { // Tischlampe, Bücher, Becher
        zyl(x0 + 20, y1 + 1, z0 + 15, 8, 9, 2, 'y', 0x5C6B7A, 16);
        dbox(x0 + 20, y1 + 20, z0 + 18, 2, 36, 2, [0.15, 0, 0], 0x5C6B7A);
        teil(new T.CylinderGeometry(4, 9, 11, 14, 1, true), x0 + 20, y1 + 36, z0 + 25, [0.5, 0, 0], 0x5C6B7A, { side: T.DoubleSide });
        box(x0 + 40, x0 + 61, y1, y1 + 2.5, z0 + 25, z0 + 53, BUNT[1]); box(x0 + 41, x0 + 60, y1 + 2.5, y1 + 5, z0 + 27, z0 + 52, BUNT[2]);
        zyl(x1 - 60, y1 + 5, z0 + 20, 4, 4, 10, 'y', 0x90A4AE, 14);
      }
    } else if (m.art === 'stuhl') { // Sitz, vier Metallbeine, Lehne mit zwei Holmen (Lehne im Norden)
      const s = y1;
      box(x0, x1, s - 4, s, z0, z1 - 2, c); box(x0 + 1, x1 - 1, s - 5.5, s - 4, z0 + 1, z1 - 3, METALL);
      for (const [x, z] of [[x0 + 2, z0 + 2], [x1 - 5, z0 + 2], [x0 + 2, z1 - 6], [x1 - 5, z1 - 6]]) zyl(x + 1.5, (y0 + s - 4) / 2, z + 1.5, 1.4, 1.4, s - 4 - y0, 'y', METALL, 8);
      for (const x of [x0 + 3, x1 - 6]) box(x, x + 3, s - 4, (m.lehne ?? 90) - 4, z1 - 4, z1 - 1, METALL);
      box(x0, x1, (m.lehne ?? 90) - 26, m.lehne ?? 90, z1 - 3, z1, c);
      bodenSchatten(x0, x1, z0, z1, 3);
    } else if (m.art === 'bett') {
      const g1 = y1 - 20; // Gestell bis zur Matratze
      for (const [x, z] of [[x0, z0], [x1 - 6, z0], [x0, z1 - 10], [x1 - 6, z1 - 10]]) box(x, x + 6, y0, 12, z, z + 6, dk);
      box(x0, x1, 12, g1, z0, z1 - 4, c); box(x0 + 1, x1 - 1, 10, 12, z0 + 1, z1 - 5, dk);
      bodenSchatten(x0, x1, z0, z1, 6);
      // Kopfteil: zwei Pfosten, Platte, Abdeckung; ohne Rückseite, damit die Kamera hinter dem Bett hindurchsieht
      schale(x0, x0 + 6, y0, y1 + 45, z1 - 4, z1, c, ['z+', 'x-']); schale(x1 - 6, x1, y0, y1 + 45, z1 - 4, z1, c, ['z+']);
      schale(x0 + 6, x1 - 6, g1 - 4, y1 + 40, z1 - 3.5, z1 - 0.5, c, ['z+', 'x-', 'x+', 'y-']);
      schale(x0, x1, y1 + 45, y1 + 48, z1 - 5, z1, dk, ['z+', 'x-']);
      if (!auf) { // Matratze, Kissen, Decke mit Umschlag
        box(x0 + 1, x1 - 1, g1, y1, z0 + 1, z1 - 4, 0xF4F1EA);
        box(x0 + 12, x1 - 12, y1, y1 + 12, z1 - 46, z1 - 8, F.kissen ?? 0xF7F3EA);
        box(x0 - 1.5, x1 + 1.5, g1 + 6, y1 + 3, z0 + 0.5, z1 - 60, F.bettdecke ?? 0x7FA7D6);
        zyl((x0 + x1) / 2, y1 + 1.5, z1 - 60, 3.5, 3.5, x1 - x0 + 3, 'x', 0xF4F1EA, 10);
        for (let z = z0 + 12, i = 0; z < z1 - 70; z += 18, i++) for (let x = x0 + 10 + (i % 2) * 9; x < x1 - 6; x += 18) scheibe(x, y1 + 3.3, z, 2.2, 0xF4F1EA, 0.3, 10); // Tupfen
      }
    } else if (m.art === 'nachttisch') { // Korpus mit Schublade und Knopf (Schublade nach Süden)
      if (!auf) {
        box(x0, x1, y1 - 2, y1, z0 - 0.5, z1, c); box(x0 + 1, x1 - 1, y0 + 6, y1 - 2, z0, z1, c); box(x0 + 3, x1 - 3, y0, y0 + 6, z0 + 3, z1 - 3, DUNKEL);
      }
      bodenSchatten(x0, x1, z0, z1, 3);
      box(x0 + 3, x1 - 3, y1 - 17, y1 - 4, z0 - 1.2, z0, dunkler(c, 0.95)); kugel((x0 + x1) / 2, y1 - 10.5, z0 - 2.4, 1.6, METALL, [1, 1, 1], 8);
      box(x0 + 3, x1 - 3, y0 + 8, y1 - 19, z0 - 0.6, z0, dunkler(c, 0.97));
    } else if (m.art === 'regal') { // Seitenwände, Rückwand, Böden, Inhalt (Regal an der Ostwand, offen nach Westen)
      if (auf) continue;
      const t = 2, bo = m.boeden || [];
      box(x0, x1, y0, y1, z0, z0 + t, c); box(x0, x1, y0, y1, z1 - t, z1, c); box(x1 - 1, x1, y0, y1, z0, z1, dk);
      for (const b of bo) box(x0, x1 - 1, Math.max(y0, b - t), Math.max(y0 + t, b), z0 + t, z1 - t, c);
      bodenSchatten(x0, x1, z0, z1, 3);
      const zi0 = z0 + t + 0.5, zi1 = z1 - t - 0.5, xs = x0 + 3;
      for (let i = 0; i < bo.length - 1; i++) {
        const yb = Math.max(y0 + t, bo[i]), hMax = bo[i + 1] - t - yb - 2, inh = (m.inhalt || [])[i] || 'buecher';
        if (inh === 'kisten') { // zwei Stoffkisten mit Griffloch
          [[zi0 + 1, zi0 + 44, 0x9FB4C7], [zi0 + 47, zi1 - 1, 0xE6CF8E]].forEach(([k0, k1, kc]) => {
            box(xs, x1 - 2, yb, yb + hMax - 2, k0, k1, kc); box(xs - 0.3, xs, yb + hMax - 10, yb + hMax - 6, (k0 + k1) / 2 - 5, (k0 + k1) / 2 + 5, dunkler(kc, 0.55));
          });
        } else if (inh === 'spardose') {
          const ze = buecher(xs, yb, zi0, zi0 + 50, hMax);
          box(xs + 2, xs + 6, yb, yb + 22, ze + 0.5, ze + 2, 0x8D6E63); // Bücherstütze
          const sx = xs + 12, sz = zi1 - 20, sy = yb + 9, ROSA = 0xF4A6B8;
          kugel(sx, sy, sz, 7, ROSA, [1, 0.9, 1.35], 12);
          zyl(sx - 7, sy + 0.5, sz - 7, 2.4, 2.4, 2, 'x', dunkler(ROSA, 0.92), 10); // Rüssel
          for (const dz of [-3, 3]) { box(sx - 4, sx - 3, sy + 5, sy + 8, sz - 6 + dz * 0.2 - 1.5, sz - 6 + dz * 0.2 + 1.5, ROSA); }
          for (const [dx, dz] of [[-3, -5], [3, -5], [-3, 5], [3, 5]]) zyl(sx + dx, yb + 1.5, sz + dz, 1.4, 1.4, 3, 'y', ROSA, 8);
          box(sx - 0.4, sx + 0.4, sy + 6, sy + 6.5, sz - 2, sz + 2, 0x333333); // Schlitz
          kugel(sx - 6, sy + 3, sz - 5, 0.6, 0x222222, [1, 1, 1], 6);
        } else if (inh === 'pokal') {
          buecher(xs, yb, zi0, zi0 + 55, hMax);
          const px = xs + 10, pz = zi1 - 18, GOLD = 0xE0B84C;
          box(px - 4, px + 4, yb, yb + 3, pz - 4, pz + 4, 0x5D4037); zyl(px, yb + 6, pz, 1, 1.5, 6, 'y', GOLD, 8);
          teil(new T.LatheGeometry([new T.Vector2(1, 0), new T.Vector2(4, 2), new T.Vector2(5.5, 7), new T.Vector2(6, 11)], 16), px, yb + 9, pz, null, GOLD, { side: T.DoubleSide });
          for (const dz of [-6.5, 6.5]) teil(new T.TorusGeometry(2.2, 0.5, 6, 10, PI), px, yb + 16, pz + dz, [0, PI / 2, dz > 0 ? -PI / 2 : PI / 2], GOLD);
        } else if (inh === 'teddy') {
          buecher(xs, yb, zi0, zi0 + 35, hMax);
          const tx = xs + 12, tz = zi1 - 22, BR = 0xA1774F, HELL = 0xD7B48C;
          kugel(tx, yb + 8, tz, 7.5, BR, [1, 1.05, 1], 12); kugel(tx - 1, yb + 19, tz, 5.8, BR, [1, 1, 1], 12);
          for (const dz of [-4.5, 4.5]) { kugel(tx, yb + 24, tz + dz, 2.2, BR, [0.6, 1, 1], 8); kugel(tx - 6, yb + 3, tz + dz * 1.1, 3, BR, [1.3, 0.8, 1], 8); kugel(tx - 1, yb + 10, tz + dz * 1.7, 2.6, BR, [1, 1.4, 1], 8); }
          kugel(tx - 5.5, yb + 18, tz, 2.4, HELL, [1, 0.8, 1], 8); kugel(tx - 7.6, yb + 18.6, tz, 0.8, 0x222222, [1, 1, 1], 6);
          for (const dz of [-2, 2]) kugel(tx - 5.2, yb + 21, tz + dz, 0.6, 0x222222, [1, 1, 1], 6);
          kugel(tx - 6.3, yb + 9, tz, 4, HELL, [0.4, 1, 1], 8);
        } else { // liegender Stapel neben einer vollen Reihe
          const ze = buecher(xs, yb, zi0, zi1 - 24, hMax);
          for (let k = 0, y = yb; k < 4; k++) { const h = 2 + r() * 2; box(xs + r() * 2, xs + 22 + r() * 3, y, y + h, ze + 2 + r() * 2, zi1 - 1 - r() * 2, BUNT[Math.floor(r() * BUNT.length)]); y += h; }
        }
      }
      // oben: Globus auf Fuss
      const gx = (x0 + x1) / 2, gz = z0 + 30, gy = y1;
      zyl(gx, gy + 1, gz, 5, 6, 2, 'y', 0x5D4037, 12); zyl(gx, gy + 6, gz, 0.6, 0.6, 10, 'y', 0xC0A060, 6);
      kugel(gx, gy + 20, gz, 11, 0x6FA8DC, [1, 1, 1], 14); kugel(gx - 4, gy + 23, gz - 3, 6, 0x8BC34A, [0.9, 1, 1.1], 8); kugel(gx - 3, gy + 15, gz + 5, 4.5, 0x8BC34A, [0.9, 1, 1], 8);
    } else if (m.art === 'schrank') { // Kleiderschrank: Korpus, Sockel, zwei Türen mit Stangengriffen, Kranz (Türen nach Westen)
      if (auf) continue;
      const zm = (z0 + z1) / 2;
      box(x0 + 2, x1, y0 + 8, y1, z0, z1, c); box(x0 + 4, x1, y0, y0 + 8, z0 + 2, z1 - 2, DUNKEL);
      box(x0 - 0.5, x1, y1 - 2, y1 + 1, z0 - 1, z1 + 1, dunkler(c, 0.95));
      for (const [d0, d1] of [[z0 + 1, zm - 0.4], [zm + 0.4, z1 - 1]]) box(x0, x0 + 2, y0 + 9, y1 - 3, d0, d1, dunkler(c, 0.98));
      for (const zg of [zm - 5, zm + 5]) {
        box(x0 - 3.5, x0 - 2, y0 + 95, y0 + 125, zg - 0.75, zg + 0.75, METALL);
        for (const yy of [y0 + 97, y0 + 123]) box(x0 - 2, x0, yy - 0.6, yy + 0.6, zg - 0.5, zg + 0.5, METALL);
      }
      bodenSchatten(x0, x1, z0, z1, 3);
    } else if (m.art === 'heizkoerper') { // Rippen, Rohre, Thermostatventil
      const n = Math.floor((x1 - x0) / 4.5), wr = (x1 - x0) / n;
      box(x0 + 1, x1 - 1, y0 + 3, y1 - 3, z0 + 3, z0 + 5, dunkler(c, 0.9));
      for (let i = 0; i < n; i++) box(x0 + i * wr + 0.4, x0 + (i + 1) * wr - 0.4, y0, y1, z0 + 2, z1, c);
      box(x0, x1, y1 - 1.5, y1, z0 + 2, z1, c); box(x0, x1, y0, y0 + 1.5, z0 + 2, z1, c);
      for (const x of [x0 + 3, x1 + 3]) zyl(x, y0 / 2, z0 + 6, 1, 1, y0, 'y', c, 8); // Rohre zum Boden
      zyl(x1 + 3, y1 - 6, z0 + 6, 1.4, 1.4, 4, 'y', c, 8); zyl(x1 + 1.5, y1 - 6, z0 + 6, 1.1, 1.1, 3, 'x', c, 8);
      zyl(x1 + 3, y1 - 0.5, z0 + 6, 2.6, 2.6, 7, 'y', 0xFFFFFF, 16); zyl(x1 + 3, y1 + 3.3, z0 + 6, 2.65, 2.65, 0.6, 'y', 0xB0B0B0, 16);
    } else if (m.art === 'fensterbank') {
      if (auf) continue;
      box(x0, x1, y0, y1, z0, z1 - 1, c); box(x0, x1, y0 - 2, y1, z1 - 1, z1, dunkler(c, 0.96));
    } else if (m.art === 'teppich') { // Spielteppich: Wiese, Rand, Strasse mit Mittelstreifen, Teich, Felder
      if (auf) continue;
      const T1 = y1, B = 12;
      box(x0, x1, y0, y1, z0, z1, c);
      const rd = (a0, a1, b0, b1, cc, hy = 0.15) => flaeche((a0 + a1) / 2, T1 + hy, (b0 + b1) / 2, a1 - a0, b1 - b0, 'y+', cc);
      rd(x0, x1, z0, z0 + 5, 0xF2E6C9); rd(x0, x1, z1 - 5, z1, 0xF2E6C9); rd(x0, x0 + 5, z0 + 5, z1 - 5, 0xF2E6C9); rd(x1 - 5, x1, z0 + 5, z1 - 5, 0xF2E6C9);
      const s0 = x0 + 18, s1 = x1 - 18, t0 = z0 + 16, t1 = z1 - 16;
      rd(s0, s1, t0, t0 + B, 0x8A8F96); rd(s0, s1, t1 - B, t1, 0x8A8F96); rd(s0, s0 + B, t0 + B, t1 - B, 0x8A8F96); rd(s1 - B, s1, t0 + B, t1 - B, 0x8A8F96);
      for (let x = s0 + 8; x < s1 - 12; x += 12) { rd(x, x + 6, t0 + B / 2 - 0.5, t0 + B / 2 + 0.5, 0xFFFFFF, 0.25); rd(x, x + 6, t1 - B / 2 - 0.5, t1 - B / 2 + 0.5, 0xFFFFFF, 0.25); }
      for (let z = t0 + B + 6; z < t1 - B - 8; z += 12) { rd(s0 + B / 2 - 0.5, s0 + B / 2 + 0.5, z, z + 6, 0xFFFFFF, 0.25); rd(s1 - B / 2 - 0.5, s1 - B / 2 + 0.5, z, z + 6, 0xFFFFFF, 0.25); }
      scheibe(s0 + 45, T1 + 0.3, (t0 + t1) / 2, 17, 0x7FB3D5, 0.3, 24);
      rd(s0 + 75, s0 + 115, t0 + B + 10, t0 + B + 40, 0xC5D88A); rd(s0 + 75, s0 + 115, t0 + B + 44, t1 - B - 10, 0xE6C97A);
      for (const [hx, hz, hc] of [[x1 - 12, z0 + 8, 0xE57373], [x0 + 8, z1 - 12, 0x64B5F6]]) scheibe(hx, T1 + 0.3, hz, 3, hc, 0.3, 12);
    } else if (m.art === 'kugelbahn') { // Holz-Kugelbahn: Grundplatte, zwei Säulen, Zickzack-Rinnen, Kugeln, Glocke
      if (auf) continue;
      const HZ = 0xE3C99A, RI = 0xD4A86E, zm = (z0 + z1) / 2, n = 5;
      box(x0, x1, y0, y0 + 2.5, z0, z1, HZ);
      box(x0 + 2, x0 + 7, y0, y1, zm - 2.5, zm + 2.5, HZ); box(x1 - 7, x1 - 2, y0, y1, zm - 2.5, zm + 2.5, HZ);
      const L = x1 - x0 - 10, cx = (x0 + x1) / 2, ang = 0.12, BAHN = [0xE57373, 0x64B5F6, 0x81C784, 0xF2C14E, 0xBA68C8];
      for (let i = 0; i < n; i++) {
        const yy = y1 - 6 - i * (y1 - y0 - 14) / (n - 1), w = (i % 2 ? 1 : -1) * ang;
        dbox(cx, yy, zm - 3.5, L, 1.2, 4.5, [0, 0, w], RI);
        dbox(cx, yy + 1.2, zm - 6, L, 2.4, 0.8, [0, 0, w], RI); dbox(cx, yy + 1.2, zm - 1, L, 2.4, 0.8, [0, 0, w], RI);
        const du = (i % 2 ? -1 : 1) * L * 0.25;
        kugel(cx + du, yy + du * Math.tan(w) + 2.1, zm - 3.5, 1.5, BAHN[i], [1, 1, 1], 10);
      }
      teil(new T.CylinderGeometry(1.5, 4.5, 5, 14, 1, true), x0 + 4.5, y0 + 6, zm - 7, null, 0xE0B84C, { side: T.DoubleSide }); // Glocke
    } else if (m.art === 'spielkiste') { // Spielkiste: Wände, Inhalt (Ball, Eisenbahn, Bausteine, Plüschhase)
      if (auf) continue;
      const t = 2;
      box(x0, x1, y0, y0 + 2, z0, z1, dk);
      box(x0, x1, y0, y1, z0, z0 + t, c); box(x0, x1, y0, y1, z1 - t, z1, c); box(x0, x0 + t, y0, y1, z0 + t, z1 - t, c); box(x1 - t, x1, y0, y1, z0 + t, z1 - t, c);
      box(x0 - 0.5, x1 + 0.5, y1 - 3, y1 - 1, z0 - 0.5, z0, dk); // Griffleiste
      box(x0, x1, y0 + 2, y1 - 8, z0 + t, z1 - t, dunkler(c, 0.55)); // Füllung (dunkel)
      kugel(x0 + 18, y1 - 2, z0 + 20, 11, 0x64B5F6, [1, 1, 1], 14);
      box(x1 - 26, x1 - 8, y1 - 8, y1 + 1, z0 + 6, z0 + 14, 0xE57373); box(x1 - 24, x1 - 14, y1 + 1, y1 + 6, z0 + 7, z0 + 13, 0xE57373);
      zyl(x1 - 23, y1 - 7, z0 + 5, 2, 2, 1, 'z', 0x333333, 10); zyl(x1 - 11, y1 - 7, z0 + 5, 2, 2, 1, 'z', 0x333333, 10);
      dbox(x0 + 40, y1 - 3, z1 - 10, 14, 5, 7, [0.3, 0.4, 0.2], 0x81C784);
      kugel(x1 - 12, y1 + 2, z1 - 12, 5, 0xEFE6DA, [1, 1.2, 1], 10); kugel(x1 - 12, y1 + 8, z1 - 12, 3.6, 0xEFE6DA, [1, 1, 1], 10);
      for (const dz of [-1.4, 1.4]) kugel(x1 - 12, y1 + 14, z1 - 12 + dz, 1.2, 0xEFE6DA, [1, 3, 0.7], 8);
      bodenSchatten(x0, x1, z0, z1, 3);
    } else if (!auf) box(x0, x1, y0, y1, z0, z1, c);
  }

  // ---------- Kleinkram am Boden ----------
  for (const k of ort.kleinkram || []) {
    const [x, z] = k.at || [0, 0], y = k.y ?? 0.3, w = k.yaw ?? 0;
    if (k.art === 'baustein') baustein(x, y, z, w, k.farbe);
    else if (k.art === 'socke') { // Schaft und Fuss
      const cs = Math.cos(w), sn = Math.sin(w);
      dbox(x, y + 0.6, z, 16, 1.2, 8, [0, w, 0], k.farbe);
      dbox(x + 9 * cs - 3 * sn, y + 0.6, z + 9 * sn + 3 * cs, 10, 1.2, 7.5, [0, w + 0.6, 0], k.farbe);
      dbox(x - 6.5 * cs, y + 0.65, z - 6.5 * sn, 3, 1.25, 8.3, [0, w, 0], 0xFFFFFF);
    } else if (k.art === 'zeichnung') { // Blatt A4 mit Strichen
      dbox(x, y + 0.1, z, 29.7, 0.2, 21, [0, w, 0], 0xFDFDF8);
      const cs = Math.cos(w), sn = Math.sin(w), pt = (du, dv) => [x + du * cs - dv * sn, z + du * sn + dv * cs];
      for (const [du, dv, l, b, cc] of [[-8, 4, 10, 1.2, 0xE57373], [6, -4, 8, 1.2, 0x64B5F6], [0, 7, 22, 1.5, 0x81C784], [-3, -6, 6, 6, 0xFBC02D]]) {
        const [px, pz] = pt(du, dv); dbox(px, y + 0.25, pz, l, 0.1, b, [0, w, 0], cc);
      }
    } else if (k.art === 'ball') kugel(x, y + k.r, z, k.r, k.farbe, [1, 1, 1], 16);
    else if (k.art === 'kabel') { // Ladekabel: Stecker in der Steckdose, Kabel über den Boden, Handy
      const pts = k.punkte.map(p => P(...p));
      box(k.punkte[0][0] - 1.5, k.punkte[0][0] + 1.5, k.punkte[0][1] - 2.5, k.punkte[0][1] + 2.5, 0, 3, 0xFAFAFA);
      const geo = new T.TubeGeometry(new T.CatmullRomCurve3(pts), 48, 0.3 * CM, 5, false);
      put(geo, 0xFAFAFA);
      const [hx, hy, hz] = k.punkte[k.punkte.length - 1];
      dbox(hx + 7, hy + 0.5, hz, 15, 0.9, 7.5, [0, w, 0], 0x2B2B2B); dbox(hx + 7, hy + 0.97, hz, 13.6, 0.05, 6.6, [0, w, 0], 0x3E5468);
    }
  }

  // ---------- zusammenfassen: ein Mesh pro Material ----------
  let meshes = 0, dreiecke = 0;
  for (const g of gruppen.values()) {
    let nv = 0, ni = 0;
    for (const geo of g.geos) { nv += geo.attributes.position.count; ni += geo.index ? geo.index.count : geo.attributes.position.count; }
    const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
    let v = 0, i = 0;
    for (const geo of g.geos) {
      const n = geo.attributes.position.count;
      pos.set(geo.attributes.position.array, v * 3); nor.set(geo.attributes.normal.array, v * 3);
      if (geo.index) for (const k of geo.index.array) idx[i++] = k + v; else for (let k = 0; k < n; k++) idx[i++] = k + v;
      v += n; geo.dispose();
    }
    const bg = new T.BufferGeometry();
    bg.setAttribute('position', new T.BufferAttribute(pos, 3)); bg.setAttribute('normal', new T.BufferAttribute(nor, 3));
    bg.setIndex(new T.BufferAttribute(idx, 1)); bg.computeBoundingSphere();
    const mesh = new T.Mesh(bg, new T.MeshLambertMaterial({ color: g.c, ...g.extra }));
    if (g.extra && g.extra.transparent) mesh.renderOrder = 1;
    root.add(mesh); meshes++; dreiecke += ni / 3;
  }
  root.userData = { meshes, dreiecke };
  // Reichweite für die Kamera: Raum und Garten bis zum Nachbarhaus
  // moebel: Möbel, die die Kamera ausblendet, wenn sie zwischen ihr und der Murmel stehen (view.js). Hier leer: Alles ist
  // pro Material zu einem Mesh zusammengefasst, ein Möbel lässt sich nicht einzeln ausblenden (darum hat das Kopfteil keine Rückseite).
  return { far: (Math.hypot(W, H, D) + (fe && fe.wand === 'S' ? 2300 : 0)) * CM, root, moebel: [] };
}
