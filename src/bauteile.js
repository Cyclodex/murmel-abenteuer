// Alle Bauteil-Typen an einem Ort: Grundteile (elements.js) + weitere (elements-extra.js).
import { TYPES } from './elements.js';
import { EXTRA } from './elements-extra.js';

Object.assign(TYPES, EXTRA);
export { TYPES };
