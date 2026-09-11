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

  pageFlip: () => {
    const ctx = getAudioContext();
    const duration = 0.26;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Swell and soft taper envelope
      const progress = i / bufferSize;
      const envelope = Math.sin(progress * Math.PI) * Math.exp(-progress * 1.5);
      data[i] = (Math.random() * 2 - 1) * envelope;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + duration);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();

    // Subtle gentle whoosh of page air displacement
    playSweep(260, 140, 0.2, 'sine', 0.08);
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
  private compressor: DynamicsCompressorNode | null = null;
  private pianoFilter: BiquadFilterNode | null = null;
  private celloFilter: BiquadFilterNode | null = null;
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

  // ============================================================================
  // MAP 2 (Cherry Blossom Hill): 128-step Studio Ghibli Romantic Anime Ballad
  // Chords: Fmaj9 -> G6 -> Em9 -> Am9 -> Dm9 -> E7(b9) -> Am9/G -> F/G -> C(add9)
  // Continuous lyrical arpeggiation & expressive singing bells
  // ============================================================================
  private readonly hillPianoArp: number[] = [
    // Bar 1: Fmaj9 (steps 0..15) - Sweet blossoming longing
    174.61, 261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 261.63,
    174.61, 261.63, 329.63, 392.00, 440.00, 523.25, 440.00, 329.63,

    // Bar 2: G6 / G(add9) (steps 16..31) - Reaching out into the breeze
    196.00, 293.66, 392.00, 440.00, 493.88, 440.00, 392.00, 293.66,
    196.00, 293.66, 392.00, 493.88, 587.33, 493.88, 440.00, 293.66,

    // Bar 3: Em9 (steps 32..47) - Deep tenderness, walking side by side
    164.81, 246.94, 329.63, 392.00, 369.99, 392.00, 329.63, 246.94,
    164.81, 246.94, 329.63, 392.00, 493.88, 392.00, 329.63, 246.94,

    // Bar 4: Am9 (steps 48..63) - Petals swirling, radiant heart-flutter
    220.00, 329.63, 440.00, 493.88, 523.25, 493.88, 392.00, 329.63,
    220.00, 329.63, 392.00, 523.25, 659.25, 523.25, 493.88, 329.63,

    // Bar 5: Dm9 (steps 64..79) - Pure sincerity, holding hands softly
    146.83, 220.00, 293.66, 349.23, 440.00, 523.25, 440.00, 349.23,
    146.83, 220.00, 349.23, 523.25, 659.25, 587.33, 440.00, 349.23,

    // Bar 6: E7(b9) / G#dim (steps 80..95) - THE ICONIC GHIBLI CLIMAX (G#4 415.3Hz & F5 698.5Hz)
    164.81, 246.94, 329.63, 415.30, 493.88, 587.33, 698.46, 659.25,
    164.81, 246.94, 415.30, 587.33, 698.46, 659.25, 587.33, 493.88,

    // Bar 7: Am9 -> Am/G (steps 96..111) - Tears of sweet relief & eternal love
    220.00, 329.63, 440.00, 523.25, 659.25, 587.33, 523.25, 440.00,
    196.00, 293.66, 392.00, 493.88, 587.33, 523.25, 493.88, 392.00,

    // Bar 8: G7sus4 -> C(add9) (steps 112..127) - Peaceful forever promise under master sakura
    196.00, 293.66, 349.23, 440.00, 523.25, 440.00, 349.23, 293.66,
    130.81, 196.00, 329.63, 392.00, 587.33, 523.25, 392.00, 329.63,
  ];

  // Deep resonant singing cello bass notes for 8 bars
  private readonly hillBassNotes = [
    87.31,  // Bar 1: F2 (Fmaj9)
    98.00,  // Bar 2: G2 (G6)
    82.41,  // Bar 3: E2 (Em9)
    110.00, // Bar 4: A2 (Am9)
    73.42,  // Bar 5: D2 (Dm9)
    82.41,  // Bar 6: E2 (E7b9 - Passionate romantic climax)
    110.00, // Bar 7: A2 (Am9)
    65.41,  // Bar 8: C2 (Cadd9 - Deep peaceful resolution)
  ];

  // Glockenspiel, Celeste & Music Box Singing Melody (Heartfelt anime romance theme)
  private readonly hillGlockMelody: { [step: number]: number } = {
    // Bar 1 (Fmaj9): Awakening love, sweet beginning
    0: 523.25,   // C5
    4: 659.25,   // E5
    8: 783.99,   // G5
    10: 880.00,  // A5
    12: 1046.50, // C6

    // Bar 2 (G6): Soaring into the petal wind
    16: 987.77,  // B5
    20: 783.99,  // G5
    24: 880.00,  // A5
    28: 1174.66, // D6

    // Bar 3 (Em9): Tender glance, fond warmth
    32: 987.77,  // B5
    36: 783.99,  // G5
    40: 659.25,  // E5
    44: 739.99,  // F#5 (Em9 magic color)

    // Bar 4 (Am9): Radiance & joy
    48: 783.99,  // G5
    52: 880.00,  // A5
    56: 987.77,  // B5
    60: 1046.50, // C6

    // Bar 5 (Dm9): Sincerity & devotion
    64: 880.00,  // A5
    68: 1046.50, // C6
    72: 1318.51, // E6 (High crystalline sparkle!)
    76: 1174.66, // D6

    // Bar 6 (E7b9): THE HEART-MELTING CONFESSION (G#5 / 830.6Hz & F6 / 1396.9Hz)
    80: 987.77,  // B5
    84: 830.61,  // G#5 (Bittersweet heart flutter)
    88: 1174.66, // D6
    92: 1396.91, // F6 (Supreme romantic peak!)

    // Bar 7 (Am9): Sweet relief & emotional embrace
    96: 1318.51, // E6
    100: 1046.50,// C6
    104: 987.77, // B5
    108: 880.00, // A5

    // Bar 8 (F/G -> C): Eternal warmth & quiet peace
    112: 783.99, // G5
    116: 698.46, // F5
    120: 587.33, // D5
    124: 523.25, // C5
  };

  private initNodes(): void {
    if (this.masterGain) return;
    const ctx = getAudioContext();

    // Master Dynamics Limiter (prevents digital clipping / audio crackling 100%)
    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-3.0, ctx.currentTime);
    this.compressor.knee.setValueAtTime(6.0, ctx.currentTime);
    this.compressor.ratio.setValueAtTime(12.0, ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, ctx.currentTime);
    this.compressor.release.setValueAtTime(0.12, ctx.currentTime);
    this.compressor.connect(ctx.destination);

    // Master volume (headroom calibrated to prevent overload)
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.65, ctx.currentTime);
    this.masterGain.connect(this.compressor);

    // Layer 1: Ambient wind
    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.14, ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    // Layer 1.5: Rain sound
    this.rainGain = ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.0, ctx.currentTime);
    this.rainGain.connect(this.masterGain);

    // Layer 2: Piano arpeggio with shared permanent felt filter
    this.pianoGain = ctx.createGain();
    this.pianoGain.gain.setValueAtTime(0.0, ctx.currentTime);
    this.pianoGain.connect(this.masterGain);

    this.pianoFilter = ctx.createBiquadFilter();
    this.pianoFilter.type = 'lowpass';
    this.pianoFilter.frequency.setValueAtTime(900, ctx.currentTime);
    this.pianoFilter.connect(this.pianoGain);

    // Layer 3: Cello bass & warm strings with shared permanent filter
    this.celloGain = ctx.createGain();
    this.celloGain.gain.setValueAtTime(0.0, ctx.currentTime);
    this.celloGain.connect(this.masterGain);

    this.celloFilter = ctx.createBiquadFilter();
    this.celloFilter.type = 'lowpass';
    this.celloFilter.frequency.setValueAtTime(300, ctx.currentTime);
    this.celloFilter.connect(this.celloGain);

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

    this.timerId = window.setInterval(() => this.schedule(), 35);
  }

  private schedule(): void {
    if (!this.isRunning) return;
    const ctx = getAudioContext();
    const maxSteps = this.currentMap === 'hill' ? 128 : 64;

    while (this.nextStepTime < ctx.currentTime + 0.12) {
      this.playStep(this.currentStep, this.nextStepTime);
      this.currentStep = (this.currentStep + 1) % maxSteps;
      this.nextStepTime += this.stepDuration;
    }
  }

  private playStep(step: number, time: number): void {
    const ctx = getAudioContext();
    const isHill = this.currentMap === 'hill';

    // 1. Piano Arpeggio note (reuses permanent lowpass filter)
    if (this.pianoGain && this.pianoGain.gain.value > 0.01 && this.pianoFilter) {
      const arpList = isHill ? this.hillPianoArp : this.valleyPianoArp;
      const freq = arpList[step % arpList.length];

      if (freq > 0) {
        this.pianoFilter.frequency.setValueAtTime(isHill ? 900 : 820, time);

        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        const decay = isHill ? 0.65 : 0.45;
        noteGain.gain.setValueAtTime(isHill ? 0.20 : 0.18, time);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + decay);

        osc.connect(noteGain).connect(this.pianoFilter);
        osc.start(time);
        osc.stop(time + decay + 0.05);

        // Acoustic chorus unison for Map 2 (gentle +3.5 cents detune)
        if (isHill) {
          const oscChorus = ctx.createOscillator();
          const gainChorus = ctx.createGain();
          oscChorus.type = 'triangle';
          oscChorus.frequency.setValueAtTime(freq * 1.002, time);
          gainChorus.gain.setValueAtTime(0.08, time);
          gainChorus.gain.exponentialRampToValueAtTime(0.001, time + decay);
          oscChorus.connect(gainChorus).connect(this.pianoFilter);
          oscChorus.start(time);
          oscChorus.stop(time + decay + 0.05);
        }
      }
    }

    // 2. Cello / String Bass note on downbeats (every 16 steps, reuses permanent lowpass filter)
    if (step % 16 === 0 && this.celloGain && this.celloGain.gain.value > 0.01 && this.celloFilter) {
      const chordIndex = Math.floor(step / 16);
      const bassList = isHill ? this.hillBassNotes : this.valleyBassNotes;
      const freq = bassList[chordIndex % bassList.length];

      this.celloFilter.frequency.setValueAtTime(isHill ? 300 : 250, time);

      const osc = ctx.createOscillator();
      const bassGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      const duration = isHill ? 3.2 : 2.8;
      bassGain.gain.setValueAtTime(0.001, time);
      bassGain.gain.linearRampToValueAtTime(isHill ? 0.24 : 0.20, time + 0.25);
      bassGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(bassGain).connect(this.celloFilter);
      osc.start(time);
      osc.stop(time + duration + 0.05);

      // String harmony for cinematic emotional resonance on Map 2
      if (isHill) {
        const isBar6 = chordIndex === 5;
        const harmonyMultiplier = isBar6 ? 1.2599 : 1.5;
        const oscHarmony = ctx.createOscillator();
        const gainHarmony = ctx.createGain();

        oscHarmony.type = 'triangle';
        oscHarmony.frequency.setValueAtTime(freq * harmonyMultiplier, time);
        gainHarmony.gain.setValueAtTime(0.001, time);
        gainHarmony.gain.linearRampToValueAtTime(0.10, time + 0.35);
        gainHarmony.gain.exponentialRampToValueAtTime(0.001, time + 3.0);
        oscHarmony.connect(gainHarmony).connect(this.celloFilter);
        oscHarmony.start(time);
        oscHarmony.stop(time + 3.1);
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

      const ringTime = isHill ? 0.85 : 0.65;
      bellGain.gain.setValueAtTime(isHill ? 0.22 : 0.18, time);
      bellGain.gain.exponentialRampToValueAtTime(0.001, time + ringTime);

      osc.connect(bellGain).connect(this.glockGain);
      osc.start(time);
      osc.stop(time + ringTime + 0.05);
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

    // 1. Ambient wind
    if (this.ambientGain) {
      const target = state.isCinematic ? 0.08 : 0.14;
      this.ambientGain.gain.linearRampToValueAtTime(target, now + fade);
    }

    // 1.5. Realistic Rain: completely muted on Hill, gentle drizzle on Valley rain zone
    if (this.rainGain) {
      if (isHill) {
        this.rainGain.gain.cancelScheduledValues(now);
        this.rainGain.gain.setValueAtTime(0.0, now);
      } else {
        const rainTarget = state.inRain ? (state.isCinematic ? 0.08 : 0.14) : 0.0;
        this.rainGain.gain.linearRampToValueAtTime(rainTarget, now + fade);
      }
    }

    // 2. Layer 2 Piano: Activated after Flower #1 on Valley, or fully active on Hill
    if (this.pianoGain) {
      const target = isHill
        ? (state.isCinematic ? 0.38 : 0.48)
        : state.flowerCount >= 1
          ? (state.isCinematic ? 0.35 : 0.44)
          : 0.0;
      this.pianoGain.gain.linearRampToValueAtTime(target, now + fade);
    }

    // 3. Layer 3 Cello/Strings: Activated in rain zone OR after 3 flowers, fully active on Hill
    if (this.celloGain) {
      const inDeepZone = state.inRain || state.flowerCount >= 3;
      const target = isHill
        ? (state.isCinematic ? 0.30 : 0.40)
        : inDeepZone
          ? (state.isCinematic ? 0.26 : 0.34)
          : 0.0;
      this.celloGain.gain.linearRampToValueAtTime(target, now + fade);
    }

    // 4. Layer 4 Glockenspiel Chimes: Activated when reaching 6-7 flowers, fully active romantic melody on Hill
    if (this.glockGain) {
      const target = isHill
        ? (state.isCinematic ? 0.28 : 0.36)
        : state.flowerCount >= 6
          ? (state.isCinematic ? 0.24 : 0.32)
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
      const target = this.isMuted ? 0.0 : 0.65;
      this.masterGain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.2);
    }
    return this.isMuted;
  }
}

export const BGM = new BGMController();
