// Umzug in die App (iPhone/iPad): Unter iOS hat eine App auf dem Home-Bildschirm einen eigenen Speicher, getrennt von Safari.
// Beim Hinzufügen kopiert Safari nur die Cookies (seit iOS 17.2), nicht localStorage. Darum legt das Spiel in Safari den
// Spielstand (progress.js, ohne Geister) gepackt in ein Cookie (pack, bei jedem Besuch der Karte), und die App übernimmt ihn
// beim ersten Start, bevor progress.js liest (unpack in main.js).
// Das Cookie geht bei jeder Anfrage an den Server mit: höchstens MAX Zeichen, sonst ohne Fahrten und Bestzeiten der anderen
// Spieler, dann aller Spieler, sonst gar nicht. Safari löscht Cookies aus JavaScript nach 7 Tagen, darum immer wieder neu.
import { SAVE_KEY } from './progress.js';
import { isIos, isApp } from './install.js';

const NAME = 'murmel-umzug', MAX = 3800, AGE = 7 * 24 * 3600;
const path = () => location.pathname.replace(/[^/]*$/, ''); // nur dieses Spiel, nicht andere Seiten auf github.io
const read = () => document.cookie.split('; ').find(c => c.startsWith(NAME + '='))?.slice(NAME.length + 1);
const write = (v, age) => {
  document.cookie = `${NAME}=${v}; Max-Age=${age}; Path=${path()}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
};

const through = async (bytes, stream) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
const toB64 = u8 => btoa(String.fromCharCode(...u8)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64 = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
const lean = p => ({ ...p, runs: {}, times: {} });

// In Safari auf iPhone/iPad: Spielstand ins Cookie legen
export async function pack() {
  if (!isIos() || isApp() || typeof CompressionStream !== 'function') return;
  try {
    const raw = localStorage.getItem(SAVE_KEY); if (!raw) return;
    const d = JSON.parse(raw), players = Array.isArray(d.players) ? d.players : [];
    const tries = [d, { ...d, players: players.map(p => (p.id === d.current ? p : lean(p))) }, { ...d, players: players.map(lean) }];
    for (const t of tries) {
      const v = toB64(await through(new TextEncoder().encode(JSON.stringify(t)), new CompressionStream('deflate-raw')));
      if (v.length <= MAX) { write(v, AGE); return; }
    }
  } catch (e) { /* kein Speicher oder Cookies gesperrt: dann eben ohne Umzug */ }
}

// In der App: hat sie noch keinen Spielstand, den aus dem Cookie übernehmen; das Cookie danach löschen.
// Gibt nur dann ein Promise zurück (sonst null), damit der Start sonst nicht warten muss.
export function unpack() {
  let v, empty;
  try { v = isApp() && read(); empty = v && !localStorage.getItem(SAVE_KEY); } catch (e) { return null; }
  if (!v) return null;
  return (async () => {
    try {
      if (empty) {
        const json = new TextDecoder().decode(await through(fromB64(v), new DecompressionStream('deflate-raw')));
        const d = JSON.parse(json);
        if (d && Array.isArray(d.players)) localStorage.setItem(SAVE_KEY, json);
      }
    } catch (e) { /* kaputt oder kein Speicher: ohne Umzug weiter */ }
    write('', 0);
  })();
}
