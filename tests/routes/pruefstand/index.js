// Routen des Prüfstands (src/levels/pruefstand/), eine Datei pro Gruppe
import bahn from './bahn.js';
import beweglich from './beweglich.js';
import kraefte from './kraefte.js';
import welt from './welt.js';

export default { ...bahn, ...beweglich, ...kraefte, ...welt };
