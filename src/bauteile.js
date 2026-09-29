// Alle Bauteil-Typen an einem Ort: Grundteile (elements.js) + weitere (elements-extra.js) + Fallen (elements-fallen.js)
// + echte Dinge der Welten (elements-welt.js).
import { TYPES } from './elements.js';
import { EXTRA } from './elements-extra.js';
import { FALLEN } from './elements-fallen.js';
import { WELT } from './elements-welt.js';

Object.assign(TYPES, EXTRA, FALLEN, WELT);
export { TYPES };
