// Welten und Level in Spielreihenfolge. Neues Level: Datei anlegen und hier eintragen.
// Das erste Level jeder Welt ist offen, die weiteren werden durch Schaffen des vorherigen freigeschaltet.
import ausflug from './ausflug.js';
import sz1 from './spielzimmer1.js';
import sz2 from './spielzimmer2.js';
import sz3 from './spielzimmer3.js';
import sz4 from './spielzimmer4.js';
import g1 from './garten1.js';
import g2 from './garten2.js';
import g3 from './garten3.js';
import k1 from './kueche1.js';
import k2 from './kueche2.js';
import k3 from './kueche3.js';
import w1 from './weltraum1.js';
import w2 from './weltraum2.js';
import w3 from './weltraum3.js';
import u1 from './wasser1.js';
import u2 from './wasser2.js';
import u3 from './wasser3.js';

export const WORLDS = [
  { id: 'uebung', name: 'Übung', emoji: '🌳', levels: [ausflug] },
  { id: 'spielzimmer', name: 'Spielzimmer', emoji: '🧸', levels: [sz1, sz2, sz3, sz4] },
  { id: 'garten', name: 'Garten', emoji: '🌻', levels: [g1, g2, g3] },
  { id: 'kueche', name: 'Küche', emoji: '🍳', levels: [k1, k2, k3] },
  { id: 'weltraum', name: 'Weltraum', emoji: '🚀', levels: [w1, w2, w3] },
  { id: 'unterwasser', name: 'Unterwasser', emoji: '🌊', levels: [u1, u2, u3] }
];

export const LEVELS = WORLDS.flatMap(w => w.levels);
