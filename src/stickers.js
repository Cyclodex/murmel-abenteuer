// Sticker-Album: pro Welt ein Blatt, dazu ein Blatt "Extras". Wird aus den Welten/Leveln erzeugt,
// neue Level bekommen ihre Sticker also automatisch.
//   pro Level: geschafft (Level-Emoji), alle Sterne 🌟, Bonusstern 💎 (nur wenn das Level einen hat)
//   pro Welt:  alle Level geschafft 🏆
//   Extras:    erste Murmel 🎨, erste Spur 💫, alle Welt-Sticker 👑, ganz dreckig ins Ziel 🐷, wieder blitzblank gewaschen 🧼
// has(p, ctx) prüft, ob der Sticker verdient ist (p = Spielstand, ctx = { skinsOpen, trailsOpen, bonus, dreckig, sauber }).
const stars = lv => lv.parts.filter(p => p.type === 'stern');

export function buildAlbum(WORLDS) {
  const pages = WORLDS.map(w => {
    const list = [];
    for (const lv of w.levels) {
      const total = stars(lv).length;
      list.push({ id: 'lvl:' + lv.id, emoji: lv.emoji, has: p => p.isDone(lv.id) });
      list.push({ id: 'sterne:' + lv.id, emoji: '🌟', has: p => total > 0 && p.best(lv.id) >= total });
      // Bonusstern: beim Sammeln vergeben (ctx.bonus), bei allen Sternen ist er sicher dabei
      if (stars(lv).some(s => s.bonus)) list.push({ id: 'bonus:' + lv.id, emoji: '💎', has: (p, c) => c.bonus === lv.id || p.best(lv.id) >= total });
    }
    list.push({ id: 'welt:' + w.id, emoji: '🏆', has: p => w.levels.every(lv => p.isDone(lv.id)) });
    return { id: w.id, emoji: w.emoji, stickers: list };
  });
  const worldIds = pages.flatMap(pg => pg.stickers.map(s => s.id));
  pages.push({
    id: 'extras', emoji: '🎁', stickers: [
      { id: 'x:murmel', emoji: '🎨', has: (p, c) => c.skinsOpen > 1 },
      { id: 'x:spur', emoji: '💫', has: (p, c) => c.trailsOpen > 1 },
      { id: 'x:krone', emoji: '👑', has: p => worldIds.every(id => p.hasSticker(id)) },
      { id: 'x:dreck', emoji: '🐷', has: (p, c) => !!c.dreckig },
      { id: 'x:sauber', emoji: '🧼', has: (p, c) => !!c.sauber }
    ]
  });
  return { pages, all: pages.flatMap(pg => pg.stickers) };
}
