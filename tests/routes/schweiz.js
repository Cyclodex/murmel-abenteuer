// Autopilot-Routen der Welt schweiz (id -> Wegpunkte, siehe tests/autopilot.js), eine Datei pro Level.
import kaeserei from './schweiz/kaeserei.js';
import uhrwerk from './schweiz/uhrwerk.js';
import schoggi from './schweiz/schoggi.js';

export default { ...kaeserei, ...uhrwerk, ...schoggi };
