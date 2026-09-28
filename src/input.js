// Eingabe: Kippen (DeviceOrientation), schwebender Joystick (überall drücken + ziehen) und Pfeiltasten.
// read() liefert [x, z] relativ zum Bildschirm: x = rechts, z = nach unten/hinten (-1..1).
const JOY_RADIUS = 50; // Pixel bis zum vollen Ausschlag

export function createInput({ area, joy, knob, onToast, onCalButton }) {
  let mode = 'joy', joyX = 0, joyZ = 0, tiltX = 0, tiltZ = 0, inX = 0, inZ = 0;
  let cal = null, lastOri = null, gotOri = false;
  let pointerId = null, ox = 0, oy = 0;
  const keys = {};

  const setKnob = (x, z) => { knob.style.transform = `translate(${x * 40}px,${z * 40}px)`; };

  // Schwebender Joystick: dort, wo gedrückt wird, erscheint er
  function placeJoy(x, y) {
    joy.style.left = x - joy.offsetWidth / 2 + 'px';
    joy.style.top = y - joy.offsetHeight / 2 + 'px';
    joy.classList.add('active');
  }
  function homeJoy() { joy.style.left = ''; joy.style.top = ''; joy.classList.remove('active'); }

  area.addEventListener('pointerdown', e => {
    if (pointerId !== null) return;
    pointerId = e.pointerId; ox = e.clientX; oy = e.clientY;
    try { area.setPointerCapture(e.pointerId); } catch (err) { /* egal */ }
    if (mode === 'joy') placeJoy(ox, oy);
    joyX = 0; joyZ = 0; e.preventDefault();
  });
  area.addEventListener('pointermove', e => {
    if (e.pointerId !== pointerId) return;
    let x = (e.clientX - ox) / JOY_RADIUS, z = (e.clientY - oy) / JOY_RADIUS;
    const l = Math.hypot(x, z); if (l > 1) { x /= l; z /= l; }
    joyX = x; joyZ = z; e.preventDefault();
  });
  const end = e => {
    if (e.pointerId !== pointerId) return;
    pointerId = null; joyX = 0; joyZ = 0; homeJoy();
  };
  area.addEventListener('pointerup', end);
  area.addEventListener('pointercancel', end);
  window.addEventListener('keydown', e => { keys[e.key] = true; });
  window.addEventListener('keyup', e => { keys[e.key] = false; });

  function screenAngle() {
    const a = (screen.orientation && typeof screen.orientation.angle === 'number') ? screen.orientation.angle : (window.orientation || 0);
    return ((a % 360) + 360) % 360;
  }
  function oriToInput(b, gm) { // Rohwerte -> Bildschirm-Achsen
    switch (screenAngle()) {
      case 90: return [b, -gm];
      case 270: return [-b, gm];
      case 180: return [-gm, -b];
      default: return [gm, b];
    }
  }
  window.addEventListener('deviceorientation', e => {
    if (e.beta == null || e.gamma == null) return;
    gotOri = true; lastOri = [e.beta, e.gamma];
    if (!cal) cal = lastOri.slice();
    const [x, z] = oriToInput(e.beta - cal[0], e.gamma - cal[1]);
    const maxDeg = 18, dz = 2;
    const f = v => { const s = Math.sign(v), a = Math.max(0, Math.abs(v) - dz); return s * Math.min(1, a / maxDeg); };
    tiltX = f(x); tiltZ = f(z);
  });

  function calibrate(silent) { if (lastOri) cal = lastOri.slice(); if (!silent) onToast('🎯'); }
  window.addEventListener('orientationchange', () => setTimeout(() => { if (mode === 'tilt') calibrate(); }, 400));

  function setMode(m) { mode = m; joy.classList.toggle('hidden', m === 'tilt'); onCalButton(m === 'tilt'); }

  async function useTilt() {
    setMode('joy');
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const r = await DeviceOrientationEvent.requestPermission(); if (r !== 'granted') throw 0;
      }
      setMode('tilt'); cal = null;
      setTimeout(() => { if (!gotOri) { setMode('joy'); onToast('📱❌ → 🕹️'); } }, 1500);
    } catch (e) { onToast('📱❌ → 🕹️'); }
  }

  function read() {
    const kx = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0), kz = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
    const tx = mode === 'tilt' ? tiltX : (kx || joyX), tz = mode === 'tilt' ? tiltZ : (kz || joyZ);
    inX += (tx - inX) * 0.25; inZ += (tz - inZ) * 0.25;
    if (mode === 'tilt') setKnob(inX, inZ); else setKnob(joyX || kx, joyZ || kz);
    return [inX, inZ];
  }

  return {
    read, useTilt, calibrate,
    useJoy() { setMode('joy'); },
    get mode() { return mode; }
  };
}
