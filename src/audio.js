// Einfache Töne (WebAudio) und Vibration. Fehler werden still ignoriert.
let ac = null;

export function beep(freqs, dur) {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const o = ac.createOscillator(), gn = ac.createGain();
      o.type = 'triangle'; o.frequency.value = f;
      const t = ac.currentTime + i * dur;
      gn.gain.setValueAtTime(0.2, t); gn.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(gn).connect(ac.destination); o.start(t); o.stop(t + dur);
    });
  } catch (e) { /* kein Ton */ }
}

export const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* keine Vibration */ } };

export const SOUNDS = {
  star: () => { beep([880, 1320], 0.09); buzz(30); },
  jump: () => { beep([300, 600], 0.12); buzz(40); },
  fall: () => { beep([300, 200], 0.15); buzz(80); },
  cp: () => beep([660], 0.08),
  turbo: () => { beep([400, 600, 900], 0.06); buzz(20); },
  click: () => { beep([500, 750], 0.08); buzz(40); },
  bridge: () => beep([392, 523, 659], 0.1),
  win: () => { beep([523, 659, 784, 1046], 0.14); buzz([60, 40, 60]); }
};
