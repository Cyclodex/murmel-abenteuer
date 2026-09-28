// Welten und Level in Spielreihenfolge. Neues Level: Datei anlegen und hier eintragen.
// Das erste Level jeder Welt ist offen, die weiteren werden durch Schaffen des vorherigen freigeschaltet.
import ausflug from './ausflug.js';
import sz1 from './spielzimmer1.js';
import sz2 from './spielzimmer2.js';
import sz3 from './spielzimmer3.js';
import sz4 from './spielzimmer4.js';

export const WORLDS = [
  { id: 'uebung', name: 'Übung', emoji: '🌳', levels: [ausflug] },
  { id: 'spielzimmer', name: 'Spielzimmer', emoji: '🧸', levels: [sz1, sz2, sz3, sz4] }
];

export const LEVELS = WORLDS.flatMap(w => w.levels);
