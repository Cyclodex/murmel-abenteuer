// Welten und Level in Spielreihenfolge. Neues Level: Datei anlegen und hier eintragen.
// Das erste Level jeder Welt ist offen, die weiteren werden durch Schaffen des vorherigen freigeschaltet.
// hard = schwere Versionen (Level mit schwer: '<id des normalen Levels>'), offen sobald das normale Level geschafft ist.
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
import v1 from './vulkan1.js';
import v2 from './vulkan2.js';
import v3 from './vulkan3.js';
import * as bad from './badezimmer.js';
import uebungS from './schwer/uebung.js';
import spielzimmerS from './schwer/spielzimmer.js';
import gartenS from './schwer/garten.js';
import kuecheS from './schwer/kueche.js';
import weltraumS from './schwer/weltraum.js';
import unterwasserS from './schwer/unterwasser.js';
import vulkanS from './schwer/vulkan.js';

export const WORLDS = [
  { id: 'uebung', name: 'Übung', emoji: '🌳', levels: [ausflug], hard: uebungS },
  { id: 'spielzimmer', name: 'Spielzimmer', emoji: '🧸', levels: [sz1, sz2, sz3, sz4], hard: spielzimmerS },
  { id: 'garten', name: 'Garten', emoji: '🌻', levels: [g1, g2, g3], hard: gartenS },
  { id: 'kueche', name: 'Küche', emoji: '🍳', levels: [k1, k2, k3], hard: kuecheS },
  ...(bad.levels.length ? [{ id: 'badezimmer', name: 'Badezimmer', emoji: '🛁', levels: bad.levels, hard: bad.hard }] : []),
  { id: 'weltraum', name: 'Weltraum', emoji: '🚀', levels: [w1, w2, w3], hard: weltraumS },
  { id: 'unterwasser', name: 'Unterwasser', emoji: '🌊', levels: [u1, u2, u3], hard: unterwasserS },
  // Profi-Welt: erst ab need Sternen offen
  { id: 'vulkan', name: 'Vulkan', emoji: '🌋', need: 50, levels: [v1, v2, v3], hard: vulkanS }
];

export const LEVELS = WORLDS.flatMap(w => [...w.levels, ...(w.hard || [])]);
