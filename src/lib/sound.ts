// Sound manager using Web Audio API — no external audio files needed for SFX & BGM

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/**
 * Resume audio context (must be called after user gesture)
 */
export function resumeAudio(): void {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}

/**
 * Play a synthesized tone
 */
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.2,
): void {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

/**
 * Play a frequency sweep (used for jump, fall)
 */
function playSweep(
  startFreq: number,
  endFreq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.14,
): void {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export const SFX = {
  jump: () => {
    playSweep(300, 600, 0.15, 'square', 0.12);
  },

  collect: () => {
    playTone(880, 0.1, 'sine', 0.18);
    setTimeout(() => playTone(1100, 0.15, 'sine', 0.15), 80);
  },

  meet: () => {
    playTone(523, 0.25, 'sine', 0.22);
    setTimeout(() => playTone(659, 0.25, 'sine', 0.22), 200);
    setTimeout(() => playTone(784, 0.35, 'sine', 0.22), 400);
  },

  fall: () => {
    playSweep(400, 150, 0.3, 'triangle', 0.12);
  },

  firework: () => {
    playSweep(200, 800, 0.15, 'square', 0.1);
    setTimeout(() => {
      const ctx = getAudioContext();
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      source.connect(gain).connect(ctx.destination);
      source.start();
    }, 150);
  },

  allCollected: () => {
    playTone(523, 0.15, 'triangle', 0.2);
    setTimeout(() => playTone(659, 0.15, 'triangle', 0.2), 120);
    setTimeout(() => playTone(784, 0.15, 'triangle', 0.2), 240);
    setTimeout(() => playTone(1046, 0.35, 'triangle', 0.24), 360);
  },

  catPurr: () => {
    playTone(620, 0.12, 'sine', 0.15);
    setTimeout(() => playTone(740, 0.18, 'sine', 0.16), 100);
    setTimeout(() => playTone(880, 0.22, 'sine', 0.12), 220);
  },

  lampClick: () => {
    playTone(1200, 0.04, 'square', 0.12);
    setTimeout(() => playTone(800, 0.1, 'sine', 0.14), 30);
  },

  umbrellaOpen: () => {
    playSweep(250, 450, 0.18, 'sine', 0.13);
  },

  harpChime: () => {
    playTone(659, 0.2, 'sine', 0.12);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.12), 80);
    setTimeout(() => playTone(987, 0.3, 'sine', 0.12), 160);
  },

  flowerBloom: () => {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'triangle', 0.12), i * 65);
    });
  },

  umbrellaTap: () => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq = 450 + Math.random() * 120;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  },

  puddleStep: () => {
    playSweep(180, 80, 0.08, 'sine', 0.14);
    setTimeout(() => playSweep(600, 300, 0.05, 'triangle', 0.09), 25);
  },

  swingWhoosh: () => {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.13, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
  },

  catMeowShort: () => {
    playSweep(550, 720, 0.12, 'sine', 0.13);
    setTimeout(() => playSweep(720, 600, 0.15, 'sine', 0.11), 100);
  },

  paperRip: () => {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.exp(-i / (bufferSize * 0.3));
      data[i] = (Math.random() * 2 - 1) * envelope;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.24, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
    playSweep(800, 200, 0.25, 'triangle', 0.12);
  },

  paperPickup: () => {
    playTone(784, 0.12, 'sine', 0.15);
    setTimeout(() => playTone(988, 0.15, 'sine', 0.15), 60);
    setTimeout(() => playTone(1175, 0.2, 'triangle', 0.12), 120);
  },

  tapeStick: () => {
    playSweep(350, 580, 0.12, 'sine', 0.11);
    setTimeout(() => playTone(659, 0.15, 'triangle', 0.13), 80);
  },

  boatSplosh: () => {
    playSweep(220, 110, 0.15, 'sine', 0.14);
    setTimeout(() => playTone(880, 0.2, 'sine', 0.12), 70);
  },

  click: () => {
    playTone(600, 0.05, 'square', 0.09);
  },
};

/**
 * ============================================================================
 * ADAPTIVE BGM CONTROLLER (Web Audio API Synthesizer)
 * - Map 1 (Valley): 70 BPM Nostalgic Lo-Fi Ballad in Fmaj7 -> G6 -> Em7 -> Am7
 * - Map 2 (Cherry Blossom Hill): 66 BPM Cinematic Confession Theme
 *   Chord Progression: Cadd9 -> Em7/B -> Fmaj7 -> Fm6 (Bittersweet Confession)
 *                      -> Em7 -> Am9 -> Dm9 -> G7sus4/C
 * - Subtle ambient wind & gentle rain at original quiet levels
 * ============================================================================
 */
export interface BGMState {
  flowerCount: number;
  inRain: boolean;
  isCinematic: boolean;
  currentMap?: 'valley' | 'hill';
}

class BGMController {
  private isRunning = false;
  private isMuted = false;
  private currentStep = 0;
  private timerId: number | null = null;
  private currentMap: 'valley' | 'hill' = 'valley';

  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private pianoGain: GainNode | null = null;
  private celloGain: GainNode | null = null;
  private glockGain: GainNode | null = null;

  private windNoiseNode: AudioBufferSourceNode | null = null;
  private rainNoiseNode: AudioBufferSourceNode | null = null;

  // 68 BPM -> 1 beat = 0.882s -> 16th note = 0.220s
  private readonly stepDuration = 0.22;
  private nextStepTime = 0;

  // ==========================================
  // MAP 1 (Valley): 64-step nostalgic loop
  // Chords: Fmaj7 -> G6 -> Em7 -> Am7
  // ==========================================
  private readonly valleyPianoArp = [
    // Fmaj7 (steps 0..15)
    174.61, 220.0, 261.63, 329.63, 261.63, 220.0, 329.63, 261.63,
    174.61, 220.0, 261.63, 349.23, 329.63, 261.63, 220.0, 261.63,
    // G6 (steps 16..31)
    196.0, 246.94, 293.66, 329.63, 293.66, 246.94, 392.0, 329.63,
    196.0, 246.94, 293.66, 329.63, 392.0, 329.63, 293.66, 246.94,
    // Em7 (steps 32..47)
    164.81, 196.0, 246.94, 293.66, 246.94, 196.0, 329.63, 293.66,
    164.81, 196.0, 246.94, 329.63, 293.66, 246.94, 196.0, 246.94,
    // Am7 (steps 48..63)
    220.0, 261.63, 329.63, 392.0, 329.63, 261.63, 440.0, 392.0,
    220.0, 261.63, 329.63, 392.0, 329.63, 261.63, 220.0, 261.63,
  ];

  private readonly valleyBassNotes = [87.31, 98.0, 82.41, 110.0];

  private readonly valleyGlockMelody: { [step: number]: number } = {
    0: 659.25, 4: 523.25, 8: 659.25, 12: 783.99,
    16: 783.99, 20: 659.25, 24: 587.33, 28: 659.25,
    32: 659.25, 36: 587.33, 40: 493.88, 44: 587.33,
    48: 523.25, 52: 587.33, 56: 659.25, 60: 783.99,
  };

  // ==========================================
  // MAP 2 (Cherry Blossom Hill): 128-step Cinematic Confession Ballad
  // Chords: Cadd9 -> Em7/B -> Fmaj7 -> Fm6 (Bittersweet IV -> iv)
  //         -> Em7 -> Am9 -> Dm9 -> G7sus4 -> C
  // ==========================================
  // Lyrical piano arpeggios that breathe (0 = pause/ring out)
  private readonly hillPianoArp: number[] = [
    // Bar 1: Cadd9 (steps 0..15) - Warm & gentle
    130.81, 0, 196.0, 0, 293.66, 0, 329.63, 0,
    392.0, 0, 293.66, 0, 329.63, 0, 196.0, 0,
    // Bar 2: Em7/B (steps 16..31) - Quiet longing
    123.47, 0, 164.81, 0, 196.0, 0, 293.66, 0,
    329.63, 0, 293.66, 0, 246.94, 0, 196.0, 0,
    // Bar 3: Fmaj7 (steps 32..47) - Reaching out with affection
    174.61, 0, 261.63, 0, 329.63, 0, 440.0, 0,
    523.25, 0, 440.0, 0, 329.63, 0, 261.63, 0,
    // Bar 4: Fm6 (steps 48..63) - THE HEART-MELTING CONFESSION CHORD (G#4/Ab4 415.30Hz)
    174.61, 0, 261.63, 0, 293.66, 0, 415.30, 0,
    523.25, 0, 415.30, 0, 293.66, 0, 261.63, 0,
    // Bar 5: Em7 (steps 64..79) - Tender walking together
    164.81, 0, 246.94, 0, 293.66, 0, 392.0, 0,
    493.88, 0, 392.0, 0, 293.66, 0, 246.94, 0,
    // Bar 6: Am9 (steps 80..95) - Deep eternal devotion
    110.0, 0, 164.81, 0, 246.94, 0, 261.63, 0,
    329.63, 0, 246.94, 0, 261.63, 0, 164.81, 0,
    // Bar 7: Dm9 (steps 96..111) - Sincere confession
    146.83, 0, 220.0, 0, 261.63, 0, 329.63, 0,
    349.23, 0, 329.63, 0, 261.63, 0, 220.0, 0,
    // Bar 8: G7sus4 -> G7 -> C (steps 112..127) - Loving resolution
    98.0, 0, 146.83, 0, 174.61, 0, 261.63, 0,
    246.94, 0, 293.66, 0, 196.0, 0, 261.63, 0,
  ];

  // Deep resonant bass notes for 8 bars
  private readonly hillBassNotes = [
    65.41,  // Bar 1: C2
    61.74,  // Bar 2: B1
    87.31,  // Bar 3: F2
    87.31,  // Bar 4: F2 (Fm6)
    82.41,  // Bar 5: E2
    110.0,  // Bar 6: A2
    73.42,  // Bar 7: D2
    98.0,   // Bar 8: G2
  ];

  // Glockenspiel & Celeste Confession Melody (Romantic story arc)
  private readonly hillGlockMelody: { [step: number]: number } = {
    // Bar 1 (Cadd9): Gentle opening question
    0: 659.25,   // E5
    4: 783.99,   // G5
    8: 587.33,   // D5
    12: 523.25,  // C5

    // Bar 2 (Em7/B): Tender flutter
    16: 493.88,  // B4
    20: 587.33,  // D5
    24: 783.99,  // G5
    28: 739.99,  // F#5 (gentle passing tone)

    // Bar 3 (Fmaj7): Soaring passion
    32: 880.0,   // A5
    36: 783.99,  // G5
    40: 659.25,  // E5
    44: 523.25,  // C5

    // Bar 4 (Fm6): THE VULNERABLE CONFESSION MOMENT (Ab5 / 830.61Hz - poignant tearjerker)
    48: 830.61,  // Ab5 (emotional heart-flutter)
    52: 783.99,  // G5
    56: 698.46,  // F5
    60: 587.33,  // D5

    // Bar 5 (Em7): Fondness & relief
    64: 659.25,  // E5
    68: 783.99,  // G5
    72: 987.77,  // B5
    76: 783.99,  // G5

    // Bar 6 (Am9): THE SUMMIT REUNION PEAK UNDER CHERRY BLOSSOMS
    80: 1046.5,  // C6 (The highest, purest note of love!)
    84: 987.77,  // B5
    88: 880.0,   // A5
    92: 659.25,  // E5

    // Bar 7 (Dm9): "I promise to stay with you"
    96: 698.46,  // F5
    100: 880.0,  // A5
    104: 1046.5, // C6
    108: 659.25, // E5

    // Bar 8 (G7sus4 -> C): Sweet peace & happiness
    112: 587.33, // D5
    116: 698.46, // F5
    120: 493.88, // B4
    124: 523.25, // C5
  };

  private initNodes(): void {
    if (this.masterGain) return;
    const ctx = getAudioContext();

    // Master volume
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.82, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    // Layer 1: Ambient wind (restored back to subtle original quiet level)
    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.22, ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    // Layer 1.5: Rain sound (subtle, soft drizzle)
    this.rainGain = ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.0, ctx.currentTime);
    this.rainGain.connect(this.masterGain);

    // Layer 2: Piano arpeggio
    this.pianoGain = ctx.createGain();
    this.pianoGain.gain.setValueAtTime(0.0, ctx.currentTime);
    this.pianoGain.connect(this.masterGain);

    // Layer 3: Cello bass & warm strings
    this.celloGain = ctx.createGain();
    this.celloGain.gain.setValueAtTime(0.0, ctx.currentTime);
    this.celloGain.connect(this.masterGain);

    // Layer 4: Glockenspiel music box chimes
    this.glockGain = ctx.createGain();
    this.glockGain.gain.setValueAtTime(0.0, ctx.currentTime);
    this.glockGain.connect(this.masterGain);

    this.startAmbientNoise();
    this.startRainNoise();
  }

  /**
   * Synthesize atmospheric breeze/wind (restored back to original subtle level)
   */
  private startAmbientNoise(): void {
    try {
      const ctx = getAudioContext();
      if (!this.ambientGain) return;

      const bufferSize = ctx.sampleRate * 2.0;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.96 * b1 + white * 0.11;
        b2 = 0.86 * b2 + white * 0.25;
        output[i] = (b0 + b1 + b2) * 0.15; // Gentle original whisper
      }

      this.windNoiseNode = ctx.createBufferSource();
      this.windNoiseNode.buffer = noiseBuffer;
      this.windNoiseNode.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      this.windNoiseNode.connect(filter).connect(this.ambientGain);
      this.windNoiseNode.start();
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Synthesize subtle gentle rain drizzle (quiet level)
   */
  private startRainNoise(): void {
    try {
      const ctx = getAudioContext();
      if (!this.rainGain) return;

      const bufferSize = ctx.sampleRate * 2.5;
      const rainBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = rainBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        const droplet = Math.random() > 0.99 ? (Math.random() * 2 - 1) * 0.25 : 0;
        output[i] = (lastOut * 0.75 + droplet + white * 0.05) * 0.15; // Soft gentle drizzle
      }

      this.rainNoiseNode = ctx.createBufferSource();
      this.rainNoiseNode.buffer = rainBuffer;
      this.rainNoiseNode.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, ctx.currentTime);

      this.rainNoiseNode.connect(filter).connect(this.rainGain);
      this.rainNoiseNode.start();
    } catch {
      // Audio autoplay fallback
    }
  }

  public start(): void {
    if (this.isRunning) return;
    this.initNodes();
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    this.isRunning = true;
    this.nextStepTime = ctx.currentTime + 0.1;
    this.currentStep = 0;

    this.timerId = window.setInterval(() => this.schedule(), 25);
  }

  private schedule(): void {
    if (!this.isRunning) return;
    const ctx = getAudioContext();
    const maxSteps = this.currentMap === 'hill' ? 128 : 64;

    while (this.nextStepTime < ctx.currentTime + 0.15) {
      this.playStep(this.currentStep, this.nextStepTime);
      this.currentStep = (this.currentStep + 1) % maxSteps;
      this.nextStepTime += this.stepDuration;
    }
  }

  private playStep(step: number, time: number): void {
    const ctx = getAudioContext();
    const isHill = this.currentMap === 'hill';

    // 1. Piano Arpeggio note
    if (this.pianoGain && this.pianoGain.gain.value > 0.01) {
      const arpList = isHill ? this.hillPianoArp : this.valleyPianoArp;
      const freq = arpList[step % arpList.length];

      // If note > 0, play piano note (0 = rest/sustain)
      if (freq > 0) {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Warm felt piano filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(isHill ? 720 : 850, time);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        const decay = isHill ? 0.65 : 0.45;
        noteGain.gain.setValueAtTime(isHill ? 0.28 : 0.24, time);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + decay);

        osc.connect(filter).connect(noteGain).connect(this.pianoGain);
        osc.start(time);
        osc.stop(time + decay + 0.05);

        // Subtle warm overtone for Map 2 (felt piano resonance)
        if (isHill) {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(freq * 2, time);
          gain2.gain.setValueAtTime(0.08, time);
          gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
          osc2.connect(gain2).connect(this.pianoGain);
          osc2.start(time);
          osc2.stop(time + 0.45);
        }
      }
    }

    // 2. Cello / String Bass note on downbeats (every 16 steps)
    if (step % 16 === 0 && this.celloGain && this.celloGain.gain.value > 0.01) {
      const chordIndex = Math.floor(step / 16);
      const bassList = isHill ? this.hillBassNotes : this.valleyBassNotes;
      const freq = bassList[chordIndex % bassList.length];

      const osc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isHill ? 280 : 260, time);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      // Deep, rich sustain for romantic string presence
      const duration = isHill ? 3.5 : 3.2;
      bassGain.gain.setValueAtTime(isHill ? 0.36 : 0.32, time);
      bassGain.gain.linearRampToValueAtTime(0.22, time + 1.2);
      bassGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter).connect(bassGain).connect(this.celloGain);
      osc.start(time);
      osc.stop(time + duration + 0.1);

      // String fifth harmony on beat for rich cinema strings in Map 2
      if (isHill) {
        const oscFifth = ctx.createOscillator();
        const gainFifth = ctx.createGain();
        oscFifth.type = 'sine';
        oscFifth.frequency.setValueAtTime(freq * 1.5, time);
        gainFifth.gain.setValueAtTime(0.12, time);
        gainFifth.gain.exponentialRampToValueAtTime(0.001, time + 2.8);
        oscFifth.connect(gainFifth).connect(this.celloGain);
        oscFifth.start(time);
        oscFifth.stop(time + 3.0);
      }
    }

    // 3. Glockenspiel / Music Box bells (The singing romantic melody)
    const melodyMap = isHill ? this.hillGlockMelody : this.valleyGlockMelody;
    if (this.glockGain && this.glockGain.gain.value > 0.01 && melodyMap[step]) {
      const freq = melodyMap[step];
      const osc = ctx.createOscillator();
      const bellGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      // Long, shimmering bell ring for romantic atmosphere
      const ringTime = isHill ? 0.85 : 0.65;
      bellGain.gain.setValueAtTime(isHill ? 0.28 : 0.22, time);
      bellGain.gain.exponentialRampToValueAtTime(0.001, time + ringTime);

      osc.connect(bellGain).connect(this.glockGain);
      osc.start(time);
      osc.stop(time + ringTime + 0.05);

      // Delicate sparkling high harmonic for music box magic
      if (isHill) {
        const sparkle = ctx.createOscillator();
        const sparkleGain = ctx.createGain();
        sparkle.type = 'sine';
        sparkle.frequency.setValueAtTime(freq * 2, time);
        sparkleGain.gain.setValueAtTime(0.06, time);
        sparkleGain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        sparkle.connect(sparkleGain).connect(this.glockGain);
        sparkle.start(time);
        sparkle.stop(time + 0.35);
      }
    }
  }

  public updateLayers(state: BGMState): void {
    this.initNodes();
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const fade = 1.6;

    // Detect map change between Valley and Hill
    const targetMap = state.currentMap || 'valley';
    if (this.currentMap !== targetMap) {
      this.currentMap = targetMap;
      this.currentStep = 0;
    }

    const isHill = this.currentMap === 'hill';

    // 1. Ambient wind: restored back to original subtle quiet level
    if (this.ambientGain) {
      const target = state.isCinematic ? 0.1 : 0.22;
      this.ambientGain.gain.linearRampToValueAtTime(target, now + fade);
    }

    // 1.5. Realistic Rain: very gentle, soothing background drizzle as before
    if (this.rainGain) {
      const rainTarget = (!isHill && state.inRain) ? (state.isCinematic ? 0.08 : 0.15) : 0.0;
      this.rainGain.gain.linearRampToValueAtTime(rainTarget, now + fade);
    }

    // 2. Layer 2 Piano: Activated after Flower #1 on Valley, or fully active on Hill
    if (this.pianoGain) {
      const target = isHill
        ? (state.isCinematic ? 0.52 : 0.68)
        : state.flowerCount >= 1
          ? (state.isCinematic ? 0.45 : 0.6)
          : 0.0;
      this.pianoGain.gain.linearRampToValueAtTime(target, now + fade);
    }

    // 3. Layer 3 Cello/Strings: Activated in rain zone OR after 3 flowers, fully active on Hill
    if (this.celloGain) {
      const inDeepZone = state.inRain || state.flowerCount >= 3;
      const target = isHill
        ? (state.isCinematic ? 0.42 : 0.56)
        : inDeepZone
          ? (state.isCinematic ? 0.32 : 0.48)
          : 0.0;
      this.celloGain.gain.linearRampToValueAtTime(target, now + fade);
    }

    // 4. Layer 4 Glockenspiel Chimes: Activated when reaching 6-7 flowers, fully active romantic melody on Hill
    if (this.glockGain) {
      const target = isHill
        ? (state.isCinematic ? 0.38 : 0.50)
        : state.flowerCount >= 6
          ? (state.isCinematic ? 0.32 : 0.42)
          : 0.0;
      this.glockGain.gain.linearRampToValueAtTime(target, now + fade);
    }
  }

  public stop(): void {
    if (!this.isRunning) return;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isRunning = false;
  }

  public toggleMute(): boolean {
    this.initNodes();
    const ctx = getAudioContext();
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      const target = this.isMuted ? 0.0 : 0.82;
      this.masterGain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.2);
    }
    return this.isMuted;
  }
}

export const BGM = new BGMController();
