// Eingabe: Kippen (DeviceOrientation), Joystick (Touch/Maus) und Pfeiltasten.
// read() liefert [x, z] relativ zum Bildschirm: x = rechts, z = nach unten/hinten (-1..1).
export function createInput({ joy, knob, onToast, onCalButton }) {
  let mode = 'joy', joyX = 0, joyZ = 0, tiltX = 0, tiltZ = 0, inX = 0, inZ = 0;
  let cal = null, lastOri = null, gotOri = false;
  const keys = {};

  const setKnob = (x, z) => { knob.style.transform = `translate(${x * 40}px,${z * 40}px)`; };
  function joyMove(e) {
    const r = joy.getBoundingClientRect(), t = e.touches ? e.touches[0] : e;
    let x = (t.clientX - (r.left + r.width / 2)) / 50, z = (t.clientY - (r.top + r.height / 2)) / 50;
    const l = Math.hypot(x, z); if (l > 1) { x /= l; z /= l; }
    joyX = x; joyZ = z; e.preventDefault();
  }
  const joyEnd = () => { joyX = 0; joyZ = 0; };
  joy.addEventListener('touchstart', joyMove, { passive: false });
  joy.addEventListener('touchmove', joyMove, { passive: false });
  joy.addEventListener('touchend', joyEnd); joy.addEventListener('touchcancel', joyEnd);
  let mouseDown = false;
  joy.addEventListener('mousedown', e => { mouseDown = true; joyMove(e); });
  window.addEventListener('mousemove', e => { if (mouseDown) joyMove(e); });
  window.addEventListener('mouseup', () => { if (mouseDown) { mouseDown = false; joyEnd(); } });
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

  function calibrate(silent) { if (lastOri) cal = lastOri.slice(); if (!silent) onToast('🎯 Ausgerichtet'); }
  window.addEventListener('orientationchange', () => setTimeout(() => { if (mode === 'tilt') calibrate(); }, 400));

  async function useTilt() {
    mode = 'joy';
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const r = await DeviceOrientationEvent.requestPermission(); if (r !== 'granted') throw 0;
      }
      mode = 'tilt'; cal = null; onCalButton(true);
      setTimeout(() => { if (!gotOri) { mode = 'joy'; onCalButton(false); onToast('Kippen geht hier nicht – Joystick benutzen'); } }, 1500);
    } catch (e) { onToast('Kippen nicht erlaubt – Joystick benutzen'); }
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
    useJoy() { mode = 'joy'; onCalButton(false); },
    get mode() { return mode; }
  };
}
