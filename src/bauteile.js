// Alle Bauteil-Typen an einem Ort: Grundteile (elements.js) + weitere (elements-extra.js) + Fallen (elements-fallen.js)
// + echte Dinge der Welten (elements-welt.js) + Badezimmer (elements-bad.js) + Kugelbahn (elements-bahn.js).
import { TYPES } from './elements.js';
import { EXTRA } from './elements-extra.js';
import { FALLEN } from './elements-fallen.js';
import { WELT } from './elements-welt.js';
import { BAD } from './elements-bad.js';
import { BAHN } from './elements-bahn.js';

Object.assign(TYPES, EXTRA, FALLEN, WELT, BAD, BAHN);
export { TYPES };
