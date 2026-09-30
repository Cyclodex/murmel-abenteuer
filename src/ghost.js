// Wettlauf gegen die beste Fahrt (die mit den meisten Punkten, eigene oder fremde): die Fahrt wird aufgenommen und fährt
// beim nächsten Mal als durchsichtige Geistermurmel mit; beim Zuschauen fährt die Murmel sie nach.
//   createRecorder()        -> add(t, pos) jedes Bild, track(t, skin) = Aufnahme zum Speichern
//   ghostAt(track, t, out)  -> Position der Geistermurmel zur Zeit t (am Ende bleibt sie im Ziel)
//   formatTime(s)           -> "12.3" bzw. "1:02.3"
// Aufnahme: alle DT Sekunden eine Position in Zentimetern (ganze Zahlen, klein zum Speichern).
export const DT = 0.1;

export function createRecorder() {
  let p = [], k = 0, lt = -1, lx = 0, ly = 0, lz = 0;
  return {
    reset() { p = []; k = 0; lt = -1; },
    // Position zu genau k * DT: zwischen dem letzten und diesem Bild interpolieren
    add(t, pos) {
      if (lt < 0 || t < lt) { lt = t; lx = pos.x; ly = pos.y; lz = pos.z; }
      while (t >= k * DT - 1e-9) {
        const f = t > lt ? Math.max(0, (k * DT - lt) / (t - lt)) : 1;
        p.push(Math.round((lx + (pos.x - lx) * f) * 100), Math.round((ly + (pos.y - ly) * f) * 100), Math.round((lz + (pos.z - lz) * f) * 100));
        k++;
      }
      lt = t; lx = pos.x; ly = pos.y; lz = pos.z;
    },
    track: (t, skin) => ({ t: +t.toFixed(2), skin, p: p.slice() }),
    get length() { return p.length / 3; }
  };
}

export function ghostAt(track, t, out = [0, 0, 0]) {
  const n = track.p.length / 3;
  if (!n) return null;
  const f = Math.max(0, t / DT), i = Math.min(n - 1, Math.floor(f)), j = Math.min(n - 1, i + 1), k = Math.min(1, f - i);
  for (let c = 0; c < 3; c++) out[c] = (track.p[i * 3 + c] * (1 - k) + track.p[j * 3 + c] * k) / 100;
  return out;
}

export function formatTime(s) {
  const t = Math.floor(s * 10) / 10, m = Math.floor(t / 60), r = (t - m * 60).toFixed(1);
  return m ? `${m}:${r.padStart(4, '0')}` : r;
}
