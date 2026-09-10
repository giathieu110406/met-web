// Sound manager using Web Audio API — no external audio files needed for SFX

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
  volume: number = 0.15,
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
  volume: number = 0.1,
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
    playSweep(300, 600, 0.15, 'square', 0.08);
  },

  collect: () => {
    playTone(880, 0.1, 'sine', 0.12);
    setTimeout(() => playTone(1100, 0.15, 'sine', 0.1), 80);
  },

  meet: () => {
    playTone(523, 0.25, 'sine', 0.15);
    setTimeout(() => playTone(659, 0.25, 'sine', 0.15), 200);
    setTimeout(() => playTone(784, 0.35, 'sine', 0.15), 400);
  },

  fall: () => {
    playSweep(400, 150, 0.3, 'triangle', 0.08);
  },

  firework: () => {
    playSweep(200, 800, 0.15, 'square', 0.06);
    setTimeout(() => {
      // Crackle effect
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
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      source.connect(gain).connect(ctx.destination);
      source.start();
    }, 150);
  },

  allCollected: () => {
    playTone(523, 0.15, 'triangle', 0.15);
    setTimeout(() => playTone(659, 0.15, 'triangle', 0.15), 120);
    setTimeout(() => playTone(784, 0.15, 'triangle', 0.15), 240);
    setTimeout(() => playTone(1046, 0.35, 'triangle', 0.18), 360);
  },

  catPurr: () => {
    playTone(620, 0.12, 'sine', 0.1);
    setTimeout(() => playTone(740, 0.18, 'sine', 0.12), 100);
    setTimeout(() => playTone(880, 0.22, 'sine', 0.08), 220);
  },

  lampClick: () => {
    playTone(1200, 0.04, 'square', 0.08);
    setTimeout(() => playTone(800, 0.1, 'sine', 0.1), 30);
  },

  umbrellaOpen: () => {
    playSweep(250, 450, 0.18, 'sine', 0.09);
  },

  harpChime: () => {
    playTone(659, 0.2, 'sine', 0.08);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.08), 80);
    setTimeout(() => playTone(987, 0.3, 'sine', 0.08), 160);
  },

  flowerBloom: () => {
    // Shimmering ascending chime when a flower blooms
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'triangle', 0.07), i * 65);
    });
  },

  umbrellaTap: () => {
    // Soft droplet tapping sound on umbrella cloth
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq = 450 + Math.random() * 120;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  },

  puddleStep: () => {
    // Soft watery splash when stepping in a puddle
    playSweep(180, 80, 0.08, 'sine', 0.1);
    setTimeout(() => playSweep(600, 300, 0.05, 'triangle', 0.06), 25);
  },

  swingWhoosh: () => {
    // Filtered air whoosh for the pendulum swing
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
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
  },

  catMeowShort: () => {
    playSweep(550, 720, 0.12, 'sine', 0.09);
    setTimeout(() => playSweep(720, 600, 0.15, 'sine', 0.07), 100);
  },

  paperRip: () => {
    // Sudden gust whoosh followed by high-frequency paper tear snap
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
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
    playSweep(800, 200, 0.25, 'triangle', 0.08);
  },

  paperPickup: () => {
    // Gentle paper rustle + sparkling chime
    playTone(784, 0.12, 'sine', 0.1);
    setTimeout(() => playTone(988, 0.15, 'sine', 0.1), 60);
    setTimeout(() => playTone(1175, 0.2, 'triangle', 0.08), 120);
  },

  tapeStick: () => {
    // Washi tape peeling and pressing adhesive sound
    playSweep(350, 580, 0.12, 'sine', 0.07);
    setTimeout(() => playTone(659, 0.15, 'triangle', 0.09), 80);
  },

  boatSplosh: () => {
    // Water ripple when retrieving the paper boat
    playSweep(220, 110, 0.15, 'sine', 0.1);
    setTimeout(() => playTone(880, 0.2, 'sine', 0.08), 70);
  },

  click: () => {
    playTone(600, 0.05, 'square', 0.06);
  },
};

/**
 * ============================================================================
 * ADAPTIVE BGM CONTROLLER (Web Audio API Synthesizer)
 * - 70 BPM Romantic Lo-Fi Ballad in C Major / A Minor
 * - 4 Adaptive Layers (Ambient Breeze, Lo-Fi Piano, Cello/Rain, Music Box Chimes)
 * ============================================================================
 */
interface BGMState {
  flowerCount: number;
  inRain: boolean;
  isCinematic: boolean;
}

class BGMController {
  private isRunning = false;
  private isMuted = false;
  private currentStep = 0;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private pianoGain: GainNode | null = null;
  private celloGain: GainNode | null = null;
  private glockGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;

  // 70 BPM -> 1 beat = 60/70 = 0.857s -> 16th note = 0.857/4 = 0.214s
  private readonly stepDuration = 0.214;
  private nextStepTime = 0;

  // Chords: Fmaj7 -> G6 -> Em7 -> Am7 (16 steps per chord = 64 steps total loop)
  private readonly pianoArp = [
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

  // Bass roots
  private readonly bassNotes = [87.31, 98.0, 82.41, 110.0];

  // Glockenspiel high melody bells (steps 0..63)
  private readonly glockMelody: { [step: number]: number } = {
    0: 659.25, 4: 523.25, 8: 659.25, 12: 783.99,
    16: 783.99, 20: 659.25, 24: 587.33, 28: 659.25,
    32: 659.25, 36: 587.33, 40: 493.88, 44: 587.33,
    48: 523.25, 52: 587.33, 56: 659.25, 60: 783.99,
  };

  private initNodes(): void {
    if (this.masterGain) return;
    const ctx = getAudioContext();

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    // Layer 1: Ambient wind
    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.25, ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    // Layer 2: Piano arpeggio
    this.pianoGain = ctx.createGain();
    this.pianoGain.gain.setValueAtTime(0.0, ctx.currentTime);
    this.pianoGain.connect(this.masterGain);

    // Layer 3: Cello bass & rain tone
    this.celloGain = ctx.createGain();
    this.celloGain.gain.setValueAtTime(0.0, ctx.currentTime);
    this.celloGain.connect(this.masterGain);

    // Layer 4: Glockenspiel music box chimes
    this.glockGain = ctx.createGain();
    this.glockGain.gain.setValueAtTime(0.0, ctx.currentTime);
    this.glockGain.connect(this.masterGain);

    this.startAmbientNoise();
  }

  private startAmbientNoise(): void {
    try {
      const ctx = getAudioContext();
      if (!this.ambientGain) return;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.96 * b1 + white * 0.11;
        b2 = 0.86 * b2 + white * 0.25;
        output[i] = (b0 + b1 + b2) * 0.15;
      }

      this.noiseNode = ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      this.noiseNode.connect(filter).connect(this.ambientGain);
      this.noiseNode.start();
    } catch {
      // Audio autoplay policy fallback
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

    this.timerId = window.setInterval(() => this.schedule(), 30);
  }

  private schedule(): void {
    if (!this.isRunning) return;
    const ctx = getAudioContext();

    while (this.nextStepTime < ctx.currentTime + 0.15) {
      this.playStep(this.currentStep, this.nextStepTime);
      this.currentStep = (this.currentStep + 1) % 64;
      this.nextStepTime += this.stepDuration;
    }
  }

  private playStep(step: number, time: number): void {
    const ctx = getAudioContext();

    // 1. Piano Arpeggio note
    if (this.pianoGain && this.pianoGain.gain.value > 0.01) {
      const freq = this.pianoArp[step];
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, time);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      noteGain.gain.setValueAtTime(0.18, time);
      noteGain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

      osc.connect(filter).connect(noteGain).connect(this.pianoGain);
      osc.start(time);
      osc.stop(time + 0.5);
    }

    // 2. Cello Bass note on downbeats (every 16 steps)
    if (step % 16 === 0 && this.celloGain && this.celloGain.gain.value > 0.01) {
      const chordIndex = Math.floor(step / 16);
      const freq = this.bassNotes[chordIndex];

      const osc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, time);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      bassGain.gain.setValueAtTime(0.28, time);
      bassGain.gain.linearRampToValueAtTime(0.18, time + 1.2);
      bassGain.gain.exponentialRampToValueAtTime(0.001, time + 3.2);

      osc.connect(filter).connect(bassGain).connect(this.celloGain);
      osc.start(time);
      osc.stop(time + 3.3);
    }

    // 3. Glockenspiel Music Box bells
    if (this.glockGain && this.glockGain.gain.value > 0.01 && this.glockMelody[step]) {
      const freq = this.glockMelody[step];
      const osc = ctx.createOscillator();
      const bellGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      bellGain.gain.setValueAtTime(0.16, time);
      bellGain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

      osc.connect(bellGain).connect(this.glockGain);
      osc.start(time);
      osc.stop(time + 0.65);
    }
  }

  public updateLayers(state: BGMState): void {
    this.initNodes();
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const fade = 1.8;

    // Ambient wind: always subtle
    if (this.ambientGain) {
      const target = state.isCinematic ? 0.1 : 0.22;
      this.ambientGain.gain.linearRampToValueAtTime(target, now + fade);
    }

    // Layer 2 Piano: Activated after Flower #1
    if (this.pianoGain) {
      const target = state.flowerCount >= 1 ? (state.isCinematic ? 0.35 : 0.45) : 0.0;
      this.pianoGain.gain.linearRampToValueAtTime(target, now + fade);
    }

    // Layer 3 Cello/Rain: Activated in rain zone OR after 3 flowers
    if (this.celloGain) {
      const inDeepZone = state.inRain || state.flowerCount >= 3;
      const target = inDeepZone ? (state.isCinematic ? 0.25 : 0.38) : 0.0;
      this.celloGain.gain.linearRampToValueAtTime(target, now + fade);
    }

    // Layer 4 Glockenspiel Chimes: Activated when reaching 6 or 7 flowers
    if (this.glockGain) {
      const target = state.flowerCount >= 6 ? (state.isCinematic ? 0.28 : 0.32) : 0.0;
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
      const target = this.isMuted ? 0.0 : 0.7;
      this.masterGain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.2);
    }
    return this.isMuted;
  }
}

export const BGM = new BGMController();

