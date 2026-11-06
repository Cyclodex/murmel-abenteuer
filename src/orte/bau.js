// Echte Orte: baut einen Raum (Wände, Boden, Decke, Fenster, Tür, Möbel) als Kulisse um ein Level, nur Grafik.
// Der Ort steht in cm (src/orte/<ort>.js), das Level sagt mit bereich, wo sein Nullpunkt im Raum liegt:
//   bereich = { at: [x, y, z] in cm (Raumpunkt, der im Level bei 0, 0, 0 liegt), yaw: Grad, strecke: [Möbel-ids] }
//   Level-Achsen bei yaw 0: x = Osten, y = oben, -z = Norden; yaw dreht den Raum um den Nullpunkt (90: Osten = -z).
//   strecke = Möbel, deren Oberfläche das Level selbst als Teile baut (bei 'tisch' zeichnet der Ort dann nur die Beine).
// Wände und Decke zeigen nur nach innen (three.js zeichnet nur die Vorderseite): Von aussen, z. B. beim Überflug oder
// wenn die Kamera hinter einer Wand steht, sieht man wie in ein Puppenhaus hinein.
export const CM = 1 / 1.6; // 1 Einheit = 1.6 cm

export function bauOrt(T, scene, ort, bereich = {}) {
  const a = bereich.at || [0, 0, 0], strecke = new Set(bereich.strecke || []);
  const root = new T.Group();
  root.rotation.y = (bereich.yaw || 0) * Math.PI / 180;
  scene.add(root);
  const P = (x, y, z) => new T.Vector3((x - a[0]) * CM, (y - a[1]) * CM, -(z - a[2]) * CM);
  const mats = {};
  const mat = (c, extra) => mats[c] || (mats[c] = new T.MeshLambertMaterial({ color: c, ...extra }));
  // Quader von x0..x1, y0..y1, z0..z1 (cm)
  const box = (x0, x1, y0, y1, z0, z1, c) => {
    const m = new T.Mesh(new T.BoxGeometry((x1 - x0) * CM, (y1 - y0) * CM, (z1 - z0) * CM), mat(c));
    m.position.copy(P((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)); root.add(m); return m;
  };
  // Rechteck (Vorderseite zeigt in Richtung n = 'x+', 'x-', 'y+', 'y-', 'z+', 'z-' im Raum)
  const ROT = { 'z+': [0, Math.PI, 0], 'z-': [0, 0, 0], 'x+': [0, Math.PI / 2, 0], 'x-': [0, -Math.PI / 2, 0], 'y+': [-Math.PI / 2, 0, 0], 'y-': [Math.PI / 2, 0, 0] };
  const flaeche = (cx, cy, cz, w, h, n, c, extra) => {
    const m = new T.Mesh(new T.PlaneGeometry(w * CM, h * CM), extra ? new T.MeshLambertMaterial({ color: c, ...extra }) : mat(c));
    m.position.copy(P(cx, cy, cz)); m.rotation.set(...ROT[n]); root.add(m); return m;
  };
  const [W, H, D] = ort.cm, F = ort.farben || {};
  const WAND = F.wand ?? 0xEDE6DA, BODEN = F.boden ?? 0xB89A7A, DECKE = F.decke ?? 0xF7F5F0, LEISTE = F.leiste ?? 0xF4F1EA;
  flaeche(W / 2, 0, D / 2, W, D, 'y+', BODEN);
  flaeche(W / 2, H, D / 2, W, D, 'y-', DECKE);
  // Wand mit Öffnung [von, bis] x [unten, oben] (entlang der Wand gemessen von Westen bzw. Süden)
  const wand = (seite, loch) => {
    const L = seite === 'S' || seite === 'N' ? W : D;
    const stueck = (u0, u1, y0, y1) => {
      if (u1 - u0 < 0.1 || y1 - y0 < 0.1) return;
      const u = (u0 + u1) / 2, y = (y0 + y1) / 2, w = u1 - u0, h = y1 - y0;
      if (seite === 'S') flaeche(u, y, 0, w, h, 'z+', WAND);
      if (seite === 'N') flaeche(u, y, D, w, h, 'z-', WAND);
      if (seite === 'W') flaeche(0, y, u, w, h, 'x+', WAND);
      if (seite === 'O') flaeche(W, y, u, w, h, 'x-', WAND);
    };
    if (!loch) { stueck(0, L, 0, H); return; }
    stueck(0, loch.von, 0, H); stueck(loch.bis, L, 0, H);
    stueck(loch.von, loch.bis, 0, loch.unten); stueck(loch.von, loch.bis, loch.oben, H);
  };
  const fe = ort.fenster, tu = ort.tuer;
  for (const s of ['S', 'N', 'W', 'O']) wand(s, fe && fe.wand === s ? fe : null);
  // Fussleisten (6 cm hoch, 1.5 cm tief)
  box(0, W, 0, 6, 0, 1.5, LEISTE); box(0, W, 0, 6, D - 1.5, D, LEISTE);
  box(0, 1.5, 0, 6, 0, D, LEISTE); box(W - 1.5, W, 0, 6, 0, D, LEISTE);
  // Fenster (Südwand): Rahmen, Glas, draussen Garten und Himmel
  if (fe && fe.wand === 'S') {
    const R = 6, c = 0xFAFAFA;
    box(fe.von, fe.bis, fe.unten, fe.unten + R, -8, 0, c); box(fe.von, fe.bis, fe.oben - R, fe.oben, -8, 0, c);
    box(fe.von, fe.von + R, fe.unten, fe.oben, -8, 0, c); box(fe.bis - R, fe.bis, fe.unten, fe.oben, -8, 0, c);
    box((fe.von + fe.bis) / 2 - 3, (fe.von + fe.bis) / 2 + 3, fe.unten, fe.oben, -8, 0, c);
    flaeche((fe.von + fe.bis) / 2, (fe.unten + fe.oben) / 2, -4, fe.bis - fe.von, fe.oben - fe.unten, 'z+', 0xCFEFFF, { transparent: true, opacity: 0.18, depthWrite: false });
    const g = ort.aussen ?? -275;
    flaeche(W / 2, g, -1500, 6000, 3000, 'y+', 0x7CB342); // Garten
    box(-300, 500, g, g + 600, -1800, -1000, 0xE8D9C0); // Nachbarhaus
  }
  // Tür (geschlossen, Nordwand)
  if (tu) {
    flaeche((tu.von + tu.bis) / 2, tu.hoehe / 2, tu.wand === 'N' ? D - 0.5 : 0.5, tu.bis - tu.von, tu.hoehe, tu.wand === 'N' ? 'z-' : 'z+', 0xC8B08E);
    box(tu.bis - 12, tu.bis - 4, 100, 103, D - 6, D - 0.5, 0x9E9E9E); // Klinke
  }
  // Deckenlampe
  const lampe = new T.Mesh(new T.CylinderGeometry(20 * CM, 26 * CM, 14 * CM, 24), mat(0xFFF6DA, { emissive: 0x332a10 }));
  lampe.position.copy(P(W / 2, H - 25, D / 2)); root.add(lampe);
  box(W / 2 - 0.5, W / 2 + 0.5, H - 18, H, D / 2 - 0.5, D / 2 + 0.5, 0x888888);

  // Möbel (grauer Rohbau)
  for (const m of ort.moebel) {
    const [x0, z0, x1, z1] = m.box, [y0, y1] = m.y, c = m.farbe ?? 0xBDBDBD;
    const dunkler = new T.Color(c).multiplyScalar(0.8).getHex();
    if (m.art === 'tisch') {
      const b = 5, p = m.platte ?? 4;
      if (!strecke.has(m.id)) box(x0, x1, y1 - p, y1, z0, z1, c);
      for (const [x, z] of [[x0, z0], [x1 - b, z0], [x0, z1 - b], [x1 - b, z1 - b]]) box(x, x + b, y0, y1 - p, z, z + b, dunkler);
    } else if (m.art === 'stuhl') {
      const b = 4, s = y1;
      box(x0, x1, s - 4, s, z0, z1, c);
      for (const [x, z] of [[x0, z0], [x1 - b, z0], [x0, z1 - b], [x1 - b, z1 - b]]) box(x, x + b, y0, s - 4, z, z + b, dunkler);
      box(x0, x1, s, m.lehne ?? 90, z1 - 3, z1, c); // Lehne auf der Nordseite (der Stuhl steht vor dem Tisch)
    } else if (m.art === 'bett') {
      box(x0, x1, y0, y1 - 20, z0, z1, dunkler);           // Gestell
      box(x0 + 2, x1 - 2, y1 - 20, y1, z0 + 2, z1 - 2, c); // Matratze
      box(x0, x1, y0, y1 + 40, z1 - 4, z1, dunkler);       // Kopfteil
      box(x0 + 15, x1 - 15, y1, y1 + 12, z1 - 45, z1 - 6, 0xF2F2F2); // Kissen
    } else if (m.art === 'regal') {
      const t = 2;
      // Seitenwände (Regal steht an der Ostwand, offen nach Westen)
      box(x0, x1, y0, y1, z0, z0 + t, c); box(x0, x1, y0, y1, z1 - t, z1, c); box(x1 - 1, x1, y0, y1, z0, z1, dunkler);
      for (const b of m.boeden || []) box(x0, x1 - 1, Math.max(y0, b - t), Math.max(y0 + t, b), z0 + t, z1 - t, c);
    } else if (!strecke.has(m.id)) box(x0, x1, y0, y1, z0, z1, c);
  }
  // Reichweite für die Kamera: grösster Abstand zwischen zwei Ecken des Raums
  return { far: Math.hypot(W, H, D) * CM * 1.3, root };
}
