// Spielstand im Browser speichern (localStorage). Ohne Speicher läuft alles weiter, nur ohne Merken.
const KEY = 'murmel-abenteuer-v1';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const d = raw ? JSON.parse(raw) : null;
    if (d && typeof d === 'object') return { done: d.done || {}, best: d.best || {}, skin: d.skin || 'standard', control: d.control || null };
  } catch (e) { /* kein Speicher */ }
  return { done: {}, best: {}, skin: 'standard', control: null };
}

export function createProgress() {
  const data = read();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* kein Speicher */ } };
  return {
    data,
    isDone: id => !!data.done[id],
    best: id => data.best[id] || 0,
    totalStars: () => Object.values(data.best).reduce((a, b) => a + b, 0),
    // Level geschafft: merkt die beste Sternzahl
    finish(id, stars) { data.done[id] = true; data.best[id] = Math.max(data.best[id] || 0, stars); save(); },
    setSkin(id) { data.skin = id; save(); },
    setControl(c) { data.control = c; save(); },
    clear() { data.done = {}; data.best = {}; data.skin = 'standard'; save(); }
  };
}
