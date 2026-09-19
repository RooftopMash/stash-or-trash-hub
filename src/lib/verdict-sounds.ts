let coinDropAudio: HTMLAudioElement | null = null;
let trashLidAudio: HTMLAudioElement | null = null;

function playAudio(path: string, current: "coin" | "trash") {
  if (typeof window === "undefined") return;
  const audio =
    current === "coin" ? (coinDropAudio ??= new Audio(path)) : (trashLidAudio ??= new Audio(path));
  audio.currentTime = 0;
  void audio.play().catch(() => undefined);
}

export function playStashSound() {
  playAudio("/audio/coin-drop.mp3", "coin");
}

export function playTrashSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      playAudio("/audio/trash-lid-close.mp3", "trash");
      return;
    }
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // 1. Randy's eager mouth opening whoosh (hungry anticipation)
    const hingeOsc = ctx.createOscillator();
    const hingeGain = ctx.createGain();
    hingeOsc.type = "sawtooth";
    hingeOsc.frequency.setValueAtTime(320, now);
    hingeOsc.frequency.exponentialRampToValueAtTime(700, now + 0.14);
    hingeGain.gain.setValueAtTime(0.05, now);
    hingeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    hingeOsc.connect(hingeGain);
    hingeGain.connect(ctx.destination);
    hingeOsc.start(now);
    hingeOsc.stop(now + 0.16);

    // 2. CHOMP 1: Hungry bite snap (at ~0.34s)
    const chomp1 = ctx.createOscillator();
    const chomp1Gain = ctx.createGain();
    chomp1.type = "square";
    chomp1.frequency.setValueAtTime(400, now + 0.32);
    chomp1.frequency.exponentialRampToValueAtTime(80, now + 0.42);
    chomp1Gain.gain.setValueAtTime(0.25, now + 0.32);
    chomp1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);
    chomp1.connect(chomp1Gain);
    chomp1Gain.connect(ctx.destination);
    chomp1.start(now + 0.32);
    chomp1.stop(now + 0.44);

    // 3. CHOMP 2: Secondary snappy bite (at ~0.56s)
    const chomp2 = ctx.createOscillator();
    const chomp2Gain = ctx.createGain();
    chomp2.type = "triangle";
    chomp2.frequency.setValueAtTime(540, now + 0.54);
    chomp2.frequency.exponentialRampToValueAtTime(110, now + 0.65);
    chomp2Gain.gain.setValueAtTime(0.22, now + 0.54);
    chomp2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.68);
    chomp2.connect(chomp2Gain);
    chomp2Gain.connect(ctx.destination);
    chomp2.start(now + 0.54);
    chomp2.stop(now + 0.68);

    // 4. CHOMP 3: Big Gulp Slam & metallic clatter (at ~0.80s)
    const chomp3 = ctx.createOscillator();
    const chomp3Gain = ctx.createGain();
    chomp3.type = "square";
    chomp3.frequency.setValueAtTime(580, now + 0.78);
    chomp3.frequency.exponentialRampToValueAtTime(65, now + 0.94);
    chomp3Gain.gain.setValueAtTime(0.3, now + 0.78);
    chomp3Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.96);
    chomp3.connect(chomp3Gain);
    chomp3Gain.connect(ctx.destination);
    chomp3.start(now + 0.78);
    chomp3.stop(now + 0.96);

    // Metallic canister reverberation
    const canRing = ctx.createOscillator();
    const canRingGain = ctx.createGain();
    canRing.type = "sine";
    canRing.frequency.setValueAtTime(1200, now + 0.78);
    canRing.frequency.exponentialRampToValueAtTime(320, now + 1.12);
    canRingGain.gain.setValueAtTime(0.14, now + 0.78);
    canRingGain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);
    canRing.connect(canRingGain);
    canRingGain.connect(ctx.destination);
    canRing.start(now + 0.78);
    canRing.stop(now + 1.15);
  } catch {
    playAudio("/audio/trash-lid-close.mp3", "trash");
  }
}

export function playCoinSpinSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      playStashSound();
      return;
    }
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // 1. Township Zwepe Finger Snap: crisp metallic strike ping
    const flickOsc = ctx.createOscillator();
    const flickGain = ctx.createGain();
    flickOsc.type = "sine";
    flickOsc.frequency.setValueAtTime(3600, now);
    flickOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.1);
    flickGain.gain.setValueAtTime(0.3, now);
    flickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
    flickOsc.connect(flickGain);
    flickGain.connect(ctx.destination);
    flickOsc.start(now);
    flickOsc.stop(now + 0.13);

    // 2. High-speed upright rim spin hum on flat surface (Video 2: 0s - 1.2s)
    const spinHum = ctx.createOscillator();
    const spinHumGain = ctx.createGain();
    spinHum.type = "triangle";
    spinHum.frequency.setValueAtTime(780, now + 0.08);
    spinHum.frequency.linearRampToValueAtTime(540, now + 1.3);
    spinHumGain.gain.setValueAtTime(0.001, now);
    spinHumGain.gain.linearRampToValueAtTime(0.09, now + 0.2);
    spinHumGain.gain.linearRampToValueAtTime(0.07, now + 1.2);
    spinHumGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    spinHum.connect(spinHumGain);
    spinHumGain.connect(ctx.destination);
    spinHum.start(now + 0.08);
    spinHum.stop(now + 1.5);

    // 3. Accelerating Euler disk precession chatter buzz (Video 2: 1.1s - 2.8s)
    const eulerOsc = ctx.createOscillator();
    const eulerGain = ctx.createGain();
    eulerOsc.type = "sawtooth";
    eulerOsc.frequency.setValueAtTime(24, now + 1.0);
    eulerOsc.frequency.exponentialRampToValueAtTime(320, now + 2.65);
    eulerGain.gain.setValueAtTime(0.001, now);
    eulerGain.gain.setValueAtTime(0.02, now + 1.0);
    eulerGain.gain.linearRampToValueAtTime(0.19, now + 2.5);
    eulerGain.gain.exponentialRampToValueAtTime(0.001, now + 2.75);
    eulerOsc.connect(eulerGain);
    eulerGain.connect(ctx.destination);
    eulerOsc.start(now + 1.0);
    eulerOsc.stop(now + 2.75);

    // 4. Final solid flat slap: coin rattles and lands completely flat against the table (Video 2: 2.7s)
    const flatSlap = ctx.createOscillator();
    const slapGain = ctx.createGain();
    flatSlap.type = "square";
    flatSlap.frequency.setValueAtTime(580, now + 2.7);
    flatSlap.frequency.exponentialRampToValueAtTime(90, now + 2.88);
    slapGain.gain.setValueAtTime(0.26, now + 2.7);
    slapGain.gain.exponentialRampToValueAtTime(0.001, now + 2.92);
    flatSlap.connect(slapGain);
    slapGain.connect(ctx.destination);
    flatSlap.start(now + 2.7);
    flatSlap.stop(now + 2.92);
  } catch {
    playStashSound();
  }
}


