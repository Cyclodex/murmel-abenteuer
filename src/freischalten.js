// Funktionen, die noch nicht für alle sind, nur für den, der den Schlüssel hat: Echte Orte (Kategorie auf der Karte).
// Freischalten: Spiel mit ?orte=<Schlüssel> öffnen, abschalten mit ?orte=aus. Gespeichert in localStorage `murmel-orte`
// (pro Browser; die App vom Home-Bildschirm hat unter iOS einen eigenen Speicher). Danach lädt die Seite ohne den Schlüssel
// in der Adresse neu, weil src/levels/index.js die Welten beim Laden festlegt.
// Im Code steht nur der SHA-256 des Schlüssels. Echter Schutz ist das nicht (alles läuft im Browser), es hält die
// unfertige Kategorie aber vor allen anderen verborgen.
const ORTE_HASH = '6e558d404cd939e94ae937dbf191a92575906aea84672c9bbb7db9d41ada9fed';

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// true = Adresse hatte ?orte, die Seite lädt neu (nichts weiter tun)
export async function freischalten() {
  const q = new URLSearchParams(location.search);
  if (!q.has('orte')) return false;
  const v = q.get('orte');
  try {
    if (v === 'aus') localStorage.removeItem('murmel-orte');
    else if (crypto.subtle && await sha256(v) === ORTE_HASH) localStorage.setItem('murmel-orte', 'an');
  } catch (e) { /* kein Speicher: bleibt aus */ }
  q.delete('orte');
  const s = q.toString();
  location.replace(location.pathname + (s ? '?' + s : '') + location.hash);
  return true;
}
