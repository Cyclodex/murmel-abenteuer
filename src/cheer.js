// Jubel-Animation beim Freischalten: grosse Emojis springen ins Bild, Konfetti regnet, Jubel-Klang.
// cheer(['⚽', '🌟']) zeigt alle neuen Sachen zusammen; Antippen oder nach ein paar Sekunden schliesst.
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
    show(emojis) {
      if (!emojis.length) return;
      items.textContent = '';
      emojis.forEach((e, i) => {
        const s = document.createElement('span'); s.textContent = e; s.style.animationDelay = i * 0.15 + 's';
        items.appendChild(s);
      });
      items.style.fontSize = emojis.length > 3 ? '64px' : emojis.length > 1 ? '84px' : '120px';
      el.classList.remove('hidden');
      rain.classList.remove('go'); void rain.offsetWidth; rain.classList.add('go'); // Animation neu starten
      audio.sfx('jubel');
      clearTimeout(timer); timer = setTimeout(close, 2600 + emojis.length * 150);
    },
    close,
    get open() { return !el.classList.contains('hidden'); }
  };
}
