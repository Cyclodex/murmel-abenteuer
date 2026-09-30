// Klänge und Musik, alles live mit WebAudio erzeugt (keine Audiodateien).
//   unlock()                 -> AudioContext starten (muss aus einem Tipp/Klick heraus passieren)
//   sfx(name, stärke?)       -> Effekt abspielen (Namen siehe SFX unten)
//   roll(tempo, amBoden, oberfläche) -> Rollgeräusch jedes Bild nachführen
//   music(lied|null)         -> Musik wechseln/stoppen (Lieder siehe SONGS)
//   setMode('alle'|'ohneMusik'|'aus')
// Für Tests kann ein eigener Kontext übergeben werden (z. B. OfflineAudioContext).

const midi = n => 440 * Math.pow(2, (n - 69) / 12);

export const SOUND_MODES = [
  { id: 'alle', emoji: '🔊', name: 'Ton an' },
  { id: 'ohneMusik', emoji: '🔉', name: 'Ohne Musik' },
  { id: 'aus', emoji: '🔇', name: 'Ton aus' }
];

// ---------- Lieder: Achtelnoten (MIDI-Nummern, null = Pause), Bass in Vierteln ----------
export const SONGS = {
  karte: {
    bpm: 84, lead: 'box',
    melody: [72, null, 76, null, 79, null, 76, null, 77, null, 74, null, 72, null, null, null,
      72, null, 76, null, 79, null, 84, null, 81, null, 79, null, 76, null, null, null],
    bass: [48, null, 55, null, 53, null, 55, null, 48, null, 55, null, 53, null, 48, null]
  },
  standard: {
    bpm: 112, lead: 'pluck', drums: true,
    melody: [67, 69, 72, null, 72, 74, 76, null, 76, 74, 72, 69, 67, null, 69, null,
      67, 69, 72, null, 76, 79, 81, null, 79, 76, 74, 76, 72, null, null, null],
    bass: [48, 55, 52, 55, 53, 57, 55, 59, 48, 55, 52, 55, 53, 55, 48, null]
  },
  garten: { // fröhlich, gezupft
    bpm: 108, lead: 'pluck', drums: true,
    melody: [67, null, 71, 74, 76, null, 74, 71, 72, null, 76, 79, 77, 76, 74, null,
      67, null, 71, 74, 79, 78, 76, 74, 72, 71, 69, 71, 67, null, null, null],
    bass: [43, 50, 47, 50, 48, 55, 50, 55, 43, 50, 47, 50, 48, 50, 43, null]
  },
  kueche: { // flott, hüpfend
    bpm: 124, lead: 'pluck', drums: true,
    melody: [72, 72, 76, null, 79, null, 76, 72, 74, 74, 77, null, 81, null, 77, 74,
      72, 76, 79, 84, 83, 79, 76, 74, 72, null, 67, null, 72, null, null, null],
    bass: [48, 55, 48, 55, 50, 57, 50, 57, 48, 55, 52, 55, 53, 55, 48, null]
  },
  weltraum: { // schwebend, langsam, ohne Schlagzeug
    bpm: 76, lead: 'box',
    melody: [76, null, 83, null, 81, null, 76, null, 74, null, 79, null, 78, null, null, null,
      76, null, 83, null, 86, null, 84, 83, 81, null, 79, null, 76, null, null, null],
    bass: [40, null, 47, null, 45, null, 43, null, 40, null, 47, null, 45, null, 40, null]
  },
  unterwasser: { // ruhig, wiegend
    bpm: 84, lead: 'box',
    melody: [69, null, 72, 76, null, 74, 72, null, 71, null, 74, 77, null, 76, 74, null,
      69, null, 72, 76, 81, null, 79, 76, 74, null, 72, 71, 69, null, null, null],
    bass: [45, null, 52, null, 50, null, 52, null, 45, null, 52, null, 48, null, 45, null]
  },
  badezimmer: { // plätschernd, verspielt
    bpm: 96, lead: 'box',
    melody: [72, 76, 79, null, 77, 74, 71, null, 72, 76, 79, 84, 83, null, 79, null,
      81, 79, 77, 76, 74, null, 76, 77, 79, null, 72, null, 72, null, null, null],
    bass: [48, null, 55, null, 50, null, 55, null, 48, null, 55, null, 53, 55, 48, null]
  },
  vulkan: { // spannend, Moll, treibend
    bpm: 118, lead: 'pluck', drums: true,
    melody: [69, null, 72, 69, 76, null, 74, 72, 71, null, 74, 71, 77, 76, 74, null,
      69, null, 72, 76, 81, null, 80, 77, 76, 74, 72, 71, 69, null, null, null],
    bass: [45, 45, 52, 45, 43, 43, 50, 43, 41, 41, 48, 41, 40, 47, 45, null]
  },
  spielzimmer: {
    bpm: 100, lead: 'box', drums: true,
    melody: [72, null, 76, 79, 81, 79, 76, null, 74, null, 77, 81, 79, 77, 74, null,
      72, null, 76, 79, 84, 83, 81, 79, 77, 76, 74, 76, 72, null, null, null],
    bass: [48, 55, 52, 55, 50, 57, 53, 57, 48, 55, 52, 55, 53, 55, 48, null]
  }
};

// Rollgeräusch je Oberfläche: Filterfrequenz (Grund + pro m/s), Lautstärke
const ROLL = {
  normal: { f0: 220, fv: 70, q: 0.9, vol: 0.17, rumble: 1 },
  eis: { f0: 1800, fv: 160, q: 2.5, vol: 0.14, rumble: 0.2 },
  schlamm: { f0: 110, fv: 25, q: 0.7, vol: 0.15, rumble: 1.4 },
  pfuetze: { f0: 900, fv: 90, q: 0.6, vol: 0.16, rumble: 0.4 },
  sand: { f0: 1400, fv: 50, q: 0.5, vol: 0.12, rumble: 0.6 },
  seife: { f0: 2200, fv: 120, q: 3, vol: 0.12, rumble: 0.2 },
  handtuch: { f0: 160, fv: 20, q: 0.6, vol: 0.08, rumble: 0.5 },
  flussbett: { f0: 900, fv: 90, q: 0.6, vol: 0.16, rumble: 0.4 },
  keramik: { f0: 1300, fv: 140, q: 1.6, vol: 0.15, rumble: 0.3 },
  kunststoff: { f0: 650, fv: 110, q: 1.2, vol: 0.17, rumble: 0.5 },
  trichter: { f0: 650, fv: 110, q: 1.2, vol: 0.17, rumble: 0.5 }
};

export function createAudio(opts = {}) {
  let ctx = opts.ctx || null, master, sfxBus, musicBus, noise, rollNodes = null;
  let mode = 'alle', song = null, songName = null, timer = null, nextTime = 0, step = 0;
  const hidden = () => typeof document !== 'undefined' && document.hidden;

  function setup() {
    master = ctx.createGain(); master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -12; comp.ratio.value = 4;
    master.connect(comp).connect(ctx.destination);
    sfxBus = ctx.createGain(); sfxBus.connect(master);
    musicBus = ctx.createGain(); musicBus.gain.value = 0.28; musicBus.connect(master);
    const len = ctx.sampleRate * 2;
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noise.getChannelData(0);
    let b = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b = (b + 0.04 * w) / 1.04; d[i] = w * 0.5 + b * 3; } // rosa-ähnlich
    applyMode();
  }
  if (ctx) setup();

  function unlock() {
    try {
      if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; ctx = new AC(); setup(); }
      if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
    } catch (e) { ctx = null; }
  }

  function applyMode() {
    if (!ctx) return;
    const t = ctx.currentTime;
    for (const [bus, v] of [[sfxBus, mode === 'aus' ? 0 : 1], [musicBus, mode === 'alle' ? 0.28 : 0]]) {
      bus.gain.cancelScheduledValues(t); bus.gain.setValueAtTime(v, t);
    }
  }

  // ---------- Bausteine ----------
  function env(g, t, vol, a, d) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function tone(f, t, dur, vol, type = 'sine', slideTo = null, bus = sfxBus, attack = 0.005) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    env(g, t, vol, attack, dur); o.connect(g).connect(bus); o.start(t); o.stop(t + dur + attack + 0.05);
  }
  function hiss(t, dur, vol, ftype, f, fTo = null, q = 1, bus = sfxBus) {
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise; s.loop = true; fl.type = ftype; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
    if (fTo) fl.frequency.exponentialRampToValueAtTime(fTo, t + dur);
    env(g, t, vol, 0.005, dur); s.connect(fl).connect(g).connect(bus);
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }
  // Glöckchen / Spieluhr: Grundton + hoher Oberton, schnell abklingend
  function bell(f, t, vol, dur = 0.5, bus = sfxBus) { tone(f, t, dur, vol, 'sine', null, bus); tone(f * 4.01, t, dur * 0.25, vol * 0.25, 'sine', null, bus); }

  // ---------- Effekte ----------
  const SFX = {
    tap: t => tone(660, t, 0.06, 0.3, 'triangle', 880),
    start: t => [60, 64, 67, 72].forEach((n, i) => bell(midi(n + 12), t + i * 0.08, 0.18, 0.35)),
    star: t => { [88, 93, 100].forEach((n, i) => bell(midi(n), t + i * 0.06, 0.2, 0.4)); hiss(t, 0.25, 0.05, 'highpass', 6000); },
    bonus: t => { [84, 88, 91, 96, 100, 103].forEach((n, i) => bell(midi(n), t + i * 0.05, 0.18, 0.5)); hiss(t, 0.5, 0.06, 'highpass', 7000); },
    jump: t => { tone(160, t, 0.28, 0.7, 'sine', 560); tone(320, t, 0.2, 0.16, 'triangle', 1100); },
    fall: t => tone(900, t, 0.5, 0.2, 'triangle', 140),
    wieder: t => { tone(500, t, 0.08, 0.5, 'sine', 1200); tone(midi(79), t + 0.06, 0.12, 0.25, 'sine', midi(86)); }, // nach dem Runterfallen am Checkpoint eingeploppt
    cp: t => { bell(midi(79), t, 0.22, 0.5); bell(midi(86), t + 0.12, 0.22, 0.6); },
    // Jubel der Checkpoint-Figuren (src/checkpoint-figuren.js), 'cp-' + Figur
    'cp-zwerg': t => { // Hur-raa!
      tone(midi(67), t, 0.14, 0.2, 'square', midi(71)); tone(midi(72), t + 0.18, 0.35, 0.2, 'square', midi(79));
      [84, 88, 91].forEach((n, i) => bell(midi(n), t + 0.55 + i * 0.07, 0.15, 0.4));
    },
    'cp-springteufel': t => { // Deckel klackt, Boing, Spieluhr
      hiss(t, 0.05, 0.5, 'bandpass', 1500, null, 1.5); tone(midi(60), t, 0.08, 0.3, 'square', midi(55));
      tone(120, t + 0.06, 0.12, 0.6, 'sine', 700);
      for (let i = 0; i < 5; i++) tone(700 - i * 60, t + 0.18 + i * 0.07, 0.07, 0.3 - i * 0.04, 'sine', 460 - i * 40);
      [72, 76, 79, 84].forEach((n, i) => bell(midi(n + 12), t + 0.6 + i * 0.08, 0.15, 0.35));
    },
    'cp-toaster': t => { // Hebel, Plopp, Pling
      hiss(t, 0.04, 0.5, 'highpass', 2500); tone(900, t, 0.05, 0.2, 'square', 600);
      tone(400, t + 0.08, 0.1, 0.5, 'sine', 1300);
      bell(midi(96), t + 0.35, 0.25, 0.8); bell(midi(103), t + 0.47, 0.15, 0.6);
    },
    'cp-ente': t => { // Quak, Quak, Quietsch
      for (const d of [0, 0.22]) { tone(720, t + d, 0.15, 0.22, 'sawtooth', 420); hiss(t + d, 0.12, 0.25, 'bandpass', 1300, 900, 3); }
      tone(1700, t + 0.5, 0.25, 0.25, 'sine', 2600); tone(2600, t + 0.75, 0.12, 0.15, 'sine', 1900);
    },
    'cp-astronaut': t => { // Funk-Piep-Piep, schwebender Akkord
      tone(1320, t, 0.07, 0.18, 'square'); tone(1760, t + 0.12, 0.07, 0.18, 'square');
      hiss(t + 0.22, 0.12, 0.12, 'bandpass', 2000, null, 2);
      [64, 71, 76, 83].forEach(n => tone(midi(n), t + 0.35, 0.9, 0.06, 'sine', null, sfxBus, 0.15));
      bell(midi(95), t + 0.5, 0.12, 0.8);
    },
    'cp-oktopus': t => { // Blubber-Blasen nach oben, Glockenspiel
      for (let i = 0; i < 6; i++) tone(260 + i * 90, t + i * 0.07, 0.07, 0.3, 'sine', 700 + i * 150);
      [79, 83, 86, 91].forEach((n, i) => bell(midi(n), t + 0.5 + i * 0.07, 0.14, 0.45));
    },
    'cp-geysir': t => { // Grollen, Dampf zischt hoch, Pling
      tone(70, t, 0.5, 0.5, 'sine', 40); hiss(t, 0.3, 0.3, 'lowpass', 300, 150, 0.7);
      hiss(t + 0.1, 0.7, 0.45, 'bandpass', 400, 3500, 1.2);
      bell(midi(91), t + 0.8, 0.2, 0.6); bell(midi(98), t + 0.9, 0.15, 0.5);
    },
    turbo: t => { hiss(t, 0.4, 1.0, 'bandpass', 400, 3500, 1.5); tone(180, t, 0.35, 0.3, 'sawtooth', 700); },
    click: t => { hiss(t, 0.03, 0.7, 'highpass', 2500); tone(1200, t, 0.04, 0.2, 'square', 900); tone(midi(72), t + 0.08, 0.2, 0.18, 'triangle'); },
    bridge: t => { tone(90, t, 1.3, 0.12, 'sawtooth', 200); hiss(t, 1.3, 0.08, 'lowpass', 300, 900); bell(midi(84), t + 1.4, 0.2, 0.6); },
    hit: (t, s = 1) => { const v = Math.min(1, 0.25 + s); hiss(t, 0.05, 0.7 * v, 'bandpass', 1600 + 800 * Math.random(), null, 1.2); tone(140, t, 0.08, 0.7 * v, 'sine', 55); },
    win: t => {
      [60, 64, 67, 72, 67, 72].forEach((n, i) => tone(midi(n + 12), t + i * 0.12, 0.18, 0.2, 'triangle'));
      [60, 64, 67, 72].forEach(n => tone(midi(n + 12), t + 0.75, 0.9, 0.09, 'triangle', null, sfxBus, 0.02));
      [96, 100, 103, 108].forEach((n, i) => bell(midi(n), t + 0.8 + i * 0.07, 0.12, 0.6));
    },
    unlock: t => { for (let i = 0; i < 10; i++) bell(midi(79 + i * 2), t + i * 0.05, 0.12, 0.5); hiss(t, 0.8, 0.05, 'highpass', 5000); },
    // neue Bauteile
    roehre: t => { tone(300, t, 0.5, 0.35, 'sine', 900); hiss(t, 0.6, 0.35, 'bandpass', 600, 2400, 2); },
    plopp: t => { tone(500, t, 0.08, 0.5, 'sine', 1200); tone(midi(84), t + 0.08, 0.15, 0.2, 'triangle'); },
    wind: t => hiss(t, 0.7, 0.4, 'bandpass', 500, 1500, 0.8),
    magnet: t => { tone(220, t, 0.4, 0.2, 'sawtooth', 440); tone(880, t + 0.05, 0.3, 0.1, 'sine', 1760); },
    laden: t => { for (let i = 0; i < 4; i++) tone(midi(60 + i * 4), t + i * 0.18, 0.1, 0.25, 'square'); },
    boom: t => { hiss(t, 0.5, 1.0, 'lowpass', 900, 150, 0.7); tone(90, t, 0.4, 0.9, 'sine', 35); bell(midi(96), t + 0.1, 0.1, 0.4); },
    // Dreck: ganz dreckig (Matsch-Platsch) und wieder blitzblank (Glitzer)
    platsch: t => { hiss(t, 0.35, 0.8, 'lowpass', 700, 120, 0.8); tone(200, t, 0.25, 0.5, 'sine', 60); },
    sauber: t => { [84, 91, 96, 103].forEach((n, i) => bell(midi(n), t + i * 0.07, 0.15, 0.45)); hiss(t, 0.4, 0.08, 'highpass', 8000); },
    // Fallen: Klappe geht auf, Hammer quetscht (Platsch + Boing), Felsen rumpelt los
    // echte Dinge: Herdplatte zischt, Sprenger spritzt, Abfluss gurgelt
    zisch: t => hiss(t, 0.35, 0.5, 'highpass', 3000, 6000, 0.7),
    spritz: t => { hiss(t, 0.3, 0.45, 'bandpass', 2500, 1200, 1.2); tone(900, t, 0.1, 0.1, 'sine', 1400); },
    gurgel: t => { for (let i = 0; i < 5; i++) tone(180 + i * 40, t + i * 0.07, 0.08, 0.3, 'sine', 400 + i * 60); hiss(t, 0.4, 0.3, 'lowpass', 600, 200, 1); },
    // Toilettenspülung: Rauschen, das abklingt, dazu Blubbern nach unten
    spuel: t => { hiss(t, 1.6, 0.6, 'bandpass', 1400, 300, 0.8); for (let i = 0; i < 6; i++) tone(420 - i * 45, t + 0.3 + i * 0.16, 0.12, 0.25, 'sine', 160 - i * 12); },
    klapp: t => { hiss(t, 0.08, 0.6, 'bandpass', 900, null, 1.5); tone(300, t, 0.18, 0.4, 'square', 120); },
    quetsch: t => { hiss(t, 0.2, 1.0, 'lowpass', 1200, 200, 0.8); tone(120, t, 0.15, 0.8, 'sine', 50); tone(midi(67), t + 0.25, 0.4, 0.25, 'triangle', midi(79)); },
    rumpel: t => { hiss(t, 0.6, 0.5, 'lowpass', 300, 120, 0.7); tone(60, t, 0.5, 0.4, 'sine', 40); },
    tock: (t, i = 0) => { tone(midi(72 + Math.min(i, 12) * 2), t, 0.07, 0.5, 'triangle'); hiss(t, 0.02, 0.3, 'highpass', 3000); },
    // Jubel beim Freischalten: Trommelwirbel, Fanfare, Glitzer
    jubel: t => {
      for (let i = 0; i < 8; i++) hiss(t + i * 0.04, 0.05, 0.25, 'bandpass', 1800, null, 1);
      [67, 72, 76, 79].forEach((n, i) => tone(midi(n), t + 0.35 + i * 0.1, 0.16, 0.18, 'square'));
      [72, 76, 79, 84].forEach(n => tone(midi(n), t + 0.8, 0.8, 0.07, 'triangle', null, sfxBus, 0.02));
      for (let i = 0; i < 8; i++) bell(midi(96 + (i % 4) * 3), t + 0.85 + i * 0.06, 0.1, 0.4);
      tone(90, t + 0.8, 0.3, 0.5, 'sine', 45);
    }
  };

  function sfx(name, strength) {
    if (!ctx || mode === 'aus' || !SFX[name]) return;
    try { SFX[name](ctx.currentTime + 0.01, strength); } catch (e) { /* ignorieren */ }
  }

  // ---------- Rollgeräusch ----------
  function makeRoll() {
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise; s.loop = true; fl.type = 'bandpass'; g.gain.value = 0;
    s.connect(fl).connect(g).connect(sfxBus); s.start();
    const o = ctx.createOscillator(), og = ctx.createGain(); // tiefes Grummeln
    o.type = 'sine'; o.frequency.value = 45; og.gain.value = 0;
    o.connect(og).connect(sfxBus); o.start();
    rollNodes = { fl, g, o, og };
  }
  function roll(speed, grounded, surface = 'normal') {
    if (!ctx) return;
    if (!rollNodes) makeRoll();
    const r = ROLL[surface] || ROLL.normal, t = ctx.currentTime, k = Math.min(1, speed / 9);
    const on = grounded && speed > 0.15 ? 1 : 0;
    rollNodes.fl.frequency.setTargetAtTime(r.f0 + r.fv * speed, t, 0.05);
    rollNodes.fl.Q.setTargetAtTime(r.q, t, 0.05);
    rollNodes.g.gain.setTargetAtTime(on * r.vol * Math.pow(k, 0.8), t, 0.04);
    rollNodes.o.frequency.setTargetAtTime(40 + speed * 7, t, 0.05);
    rollNodes.og.gain.setTargetAtTime(on * 0.07 * r.rumble * k, t, 0.05);
  }

  // ---------- Musik ----------
  function note(n, t, dur, vol, kind) {
    const f = midi(n);
    if (kind === 'box') bell(f, t, vol, dur * 2.2, musicBus);
    else if (kind === 'pluck') { tone(f, t, dur * 1.4, vol, 'triangle', null, musicBus); tone(f * 2, t, dur * 0.4, vol * 0.2, 'sine', null, musicBus); }
    else tone(f, t, dur, vol, 'triangle', null, musicBus, 0.02); // Bass
  }
  function schedule() {
    if (!ctx || !song) return;
    const eighth = 60 / song.bpm / 2;
    while (nextTime < ctx.currentTime + 0.35) {
      const i = step % song.melody.length;
      const m = song.melody[i];
      if (m != null) note(m, nextTime, eighth, 0.22, song.lead);
      if (i % 2 === 0) { const b = song.bass[(i / 2) % song.bass.length]; if (b != null) note(b, nextTime, eighth * 1.8, 0.3, 'bass'); }
      if (song.drums) {
        if (i % 4 === 0) tone(110, nextTime, 0.12, 0.35, 'sine', 45, musicBus);          // Bumm
        if (i % 2 === 1) hiss(nextTime, 0.03, 0.08, 'highpass', 7000, null, 1, musicBus); // Tss
      }
      nextTime += eighth; step++;
    }
  }
  function music(name) {
    if (!ctx) return;
    if (name === songName) return;
    songName = name; song = name ? SONGS[name] || SONGS.standard : null;
    if (timer) { clearInterval(timer); timer = null; }
    if (!ctx || !song) return;
    step = 0; nextTime = ctx.currentTime + 0.1;
    schedule(); timer = setInterval(schedule, 90);
  }

  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    try { if (hidden()) ctx.suspend(); else { ctx.resume(); nextTime = ctx.currentTime + 0.1; } } catch (e) { /* egal */ }
  });

  return {
    unlock, sfx, roll, music,
    setMode(m) { mode = m; applyMode(); },
    get mode() { return mode; },
    get ctx() { return ctx; },
    _schedule: schedule
  };
}

export const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* keine Vibration */ } };
