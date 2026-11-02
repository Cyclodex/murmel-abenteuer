// App aufs Handy: Das Spiel als App auf den Home-Bildschirm legen, damit man es wiederfindet (Popup auf der Karte, main.js).
// - Android (Chrome): der Browser meldet mit beforeinstallprompt, dass er installieren kann; prompt() zeigt seinen Dialog.
//   Dafür braucht es manifest.json und den Service Worker sw.js.
// - iPhone/iPad: kein solches Ereignis, das Popup erklärt Teilen → „Zum Home-Bildschirm“ (ios = true).
// - schon als App geöffnet (display-mode standalone/fullscreen) oder installiert: can() = false.
// offer(): von selbst kommt das Popup nur auf Geräten mit Touch, höchstens MAX-mal und frühestens PAUSE nach dem letzten Mal
// (localStorage, ohne Speicher bei jedem Laden höchstens einmal). Im ⚙️ bleibt der Knopf, solange can() gilt.
const KEY = 'murmel-app';
const MAX = 3, PAUSE = 3 * 24 * 3600 * 1000;

// iPhone/iPad (iPadOS meldet sich als Mac, hat aber Touch)
export const isIos = (nav = navigator) => /iPhone|iPad|iPod/.test(nav.userAgent) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
// vom Home-Bildschirm als App geöffnet
export const isApp = (win = window) =>
  ['standalone', 'fullscreen'].some(m => win.matchMedia(`(display-mode: ${m})`).matches) || win.navigator.standalone === true;

export function createInstall({ win = window, onChange = () => {} } = {}) {
  const nav = win.navigator;
  const load = () => { try { return JSON.parse(win.localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  let memo = load(); // { n: so oft von selbst gezeigt, t: zuletzt (ms), ok: installiert }
  const save = d => { memo = { ...memo, ...d }; try { win.localStorage.setItem(KEY, JSON.stringify(memo)); } catch (e) { /* ohne Speicher */ } };
  const ios = isIos(nav);
  let deferred = null; // beforeinstallprompt, bis der Dialog gezeigt wurde

  win.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; onChange(); });
  win.addEventListener('appinstalled', () => { deferred = null; save({ ok: true }); onChange(); });
  // Unter Playwright (navigator.webdriver) nicht: Anfragen über einen Service Worker sieht page.route nicht
  if ('serviceWorker' in nav && !nav.webdriver) nav.serviceWorker.register('sw.js').catch(() => { /* ohne: nur nicht installierbar */ });

  const can = () => !isApp(win) && !memo.ok && (ios || !!deferred);
  return {
    ios,
    can,
    offer: () => can() && nav.maxTouchPoints > 0 && (memo.n || 0) < MAX && Date.now() - (memo.t || 0) > PAUSE,
    shown() { save({ n: (memo.n || 0) + 1, t: Date.now() }); },
    // Dialog des Browsers (Android); true, wenn installiert wird. Der Browser gibt den Dialog nur einmal pro Ereignis.
    async prompt() {
      const e = deferred; if (!e) return false;
      deferred = null;
      e.prompt();
      const ok = (await e.userChoice).outcome === 'accepted';
      if (ok) save({ ok: true });
      return ok;
    }
  };
}
