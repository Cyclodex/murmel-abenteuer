// Sticker-Album: eine Zeile pro Welt, dazu eine Zeile "Extras". Wird aus den Welten/Leveln erzeugt,
// neue Level und Welten bekommen ihre Sticker also automatisch.
//   pro Welt: alle Level geschafft 🏆, alle Sterne 🌟, alle Bonussterne 💎 (Sterne und Bonussterne auch in den schweren Versionen),
//             alle schweren Versionen geschafft 💀
//   Extras:   erste Murmel 🔮, erste Spur 💫, alle Welt-Sticker 👑, ganz dreckig ins Ziel 🐷, wieder blitzblank gewaschen 🧼,
//             schneller als die eigene Geistermurmel 👻
// text = wofür es den Sticker gibt (im Album beim Antippen).
// has(p, ctx) prüft, ob der Sticker verdient ist (p = Spielstand, ctx = { skinsOpen, trailsOpen, dreckig, sauber, geist }).
const stars = lv => lv.parts.filter(p => p.type === 'stern');
const allStars = (p, lv) => p.isDone(lv.id) && p.best(lv.id) >= stars(lv).length;

export function buildAlbum(WORLDS) {
  const rows = WORLDS.map(w => {
    const all = [...w.levels, ...(w.hard || [])], withBonus = all.filter(lv => stars(lv).some(s => s.bonus));
    const list = [{ id: 'welt:' + w.id, emoji: '🏆', text: `${w.emoji} ${w.name}: alle Level schaffen`, has: p => w.levels.every(lv => p.isDone(lv.id)) }];
    const hard = w.hard && w.hard.length ? ', auch in den schweren 💀' : '';
    list.push({ id: 'sterne-alle:' + w.id, emoji: '🌟', text: `${w.emoji} ${w.name}: in jedem Level alle ⭐ sammeln${hard}`, has: p => all.every(lv => allStars(p, lv)) });
    // bei allen Sternen ist der Bonusstern sicher dabei
    if (withBonus.length) list.push({ id: 'bonus-alle:' + w.id, emoji: '💎', text: `${w.emoji} ${w.name}: in jedem Level den lila Bonusstern finden${hard}`, has: p => withBonus.every(lv => p.hasBonus(lv.id) || allStars(p, lv)) });
    if (hard) list.push({ id: 'profi:' + w.id, emoji: '💀', text: `${w.emoji} ${w.name}: alle schweren Level 💀 schaffen`, has: p => w.hard.every(lv => p.isDone(lv.id)) });
    return { id: w.id, emoji: w.emoji, stickers: list };
  });
  const worldIds = rows.flatMap(r => r.stickers.map(s => s.id));
  rows.push({
    id: 'extras', emoji: '🎁', stickers: [
      { id: 'x:murmel', emoji: '🔮', text: 'Eine neue Murmel freischalten', has: (p, c) => c.skinsOpen > 1 },
      { id: 'x:spur', emoji: '💫', text: 'Eine Spur freischalten', has: (p, c) => c.trailsOpen > 1 },
      { id: 'x:krone', emoji: '👑', text: 'Alle Sticker aller Welten sammeln', has: p => worldIds.every(id => p.hasSticker(id)) },
      { id: 'x:dreck', emoji: '🐷', text: 'Im Schlamm ganz dreckig werden und ins Ziel rollen', has: (p, c) => !!c.dreckig },
      { id: 'x:sauber', emoji: '🧼', text: 'Dreckig werden, wieder blitzblank werden und ins Ziel rollen', has: (p, c) => !!c.sauber },
      { id: 'x:geist', emoji: '👻', text: 'Die eigene Bestzeit schlagen: schneller als deine Geistermurmel', has: (p, c) => !!c.geist }
    ]
  });
  return { rows, all: rows.flatMap(r => r.stickers) };
}
