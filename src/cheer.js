// Jubel-Animation beim Freischalten: Karte „Neu freigeschaltet“ mit allen neuen Sachen als Sticker (wie im Album)
// und Text daneben, Konfetti regnet, Jubel-Klang.
// cheer.show([{ emoji: '⚽', text: 'Fussball', kind: 'Neue Murmel' }, { emoji: '🏆', text: 'Alle Level schaffen', kind: 'Neuer Sticker' }, …]);
// kind = kleine Zeile über dem Text. Antippen oder nach ein paar Sekunden schliesst.
const COLORS = ['#FF5A8A', '#FFC928', '#3BB273', '#2F6FEB', '#C77DFF', '#FF7A00'];
const PIECES = 40;

export function createCheer(el, audio) {
  const items = el.querySelector('.items'), rain = el.querySelector('.rain');
  let timer = 0;
  // Konfetti einmal anlegen, bei jedem Jubel nur neu starten
  for (let i = 0; i < PIECES; i++) {
    const c = document.createElement('i');
    c.style.left = (i * 97 % 100) + '%';
    c.style.background = COLORS[i % COLORS.length];
    c.style.animationDelay = (i * 37 % 60) / 100 + 's';
    c.style.animationDuration = 1.6 + (i * 53 % 100) / 100 + 's';
    rain.appendChild(c);
  }
  function close() { clearTimeout(timer); el.classList.add('hidden'); }
  el.addEventListener('click', close);

  return {
    show(list) {
      if (!list.length) return;
      items.textContent = '';
      list.forEach(({ emoji, text, kind }, i) => {
        const it = document.createElement('div'); it.className = 'it'; it.style.animationDelay = i * 0.15 + 's';
        const st = document.createElement('span'); st.className = 'sticker got';
        const e = document.createElement('span'); e.textContent = emoji; st.appendChild(e);
        const tx = document.createElement('span'); tx.className = 'tx'; tx.textContent = text;
        if (kind) { const k = document.createElement('small'); k.textContent = kind; tx.prepend(k); }
        it.append(st, tx); items.appendChild(it);
      });
      el.classList.remove('hidden');
      rain.classList.remove('go'); void rain.offsetWidth; rain.classList.add('go'); // Animation neu starten
      audio.sfx('jubel');
      clearTimeout(timer); timer = setTimeout(close, Math.min(10000, 3000 + list.length * 1000)); // Zeit zum Lesen
    },
    close,
    get open() { return !el.classList.contains('hidden'); }
  };
}
