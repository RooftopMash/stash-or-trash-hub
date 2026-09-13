let audioContext: AudioContext | null = null;
let coinDropAudio: HTMLAudioElement | null = null;

function playRecordedCoinDrop() {
  if (typeof window === "undefined") return;
  coinDropAudio ??= new Audio("/audio/coin-drop.wav");
  coinDropAudio.currentTime = 0;
  void coinDropAudio.play().catch(() => undefined);
}

function getAudioContext() {
  if (typeof window === "undefined") return null;
  audioContext ??= new AudioContext();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

function playMetalClick(context: AudioContext, time: number, frequency: number, volume: number, duration: number) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, time);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.72, time + duration);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(volume, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(time);
  oscillator.stop(time + duration + 0.01);
}

function playNoise(context: AudioContext, time: number, volume: number, duration: number, filterFrequency: number) {
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.value = filterFrequency;
  filter.Q.value = 1.8;
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  source.connect(filter).connect(gain).connect(context.destination);
  source.start(time);
}

export function playStashSound() {
  playRecordedCoinDrop();
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  playNoise(context, now, 0.09, 0.055, 2100);
  playMetalClick(context, now + 0.012, 620, 0.13, 0.18);
  playMetalClick(context, now + 0.025, 360, 0.06, 0.22);
}

export function playTrashSound() {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  playNoise(context, now, 0.16, 0.12, 720);
  playMetalClick(context, now + 0.008, 155, 0.28, 0.22);
  playMetalClick(context, now + 0.035, 285, 0.14, 0.36);
  playNoise(context, now + 0.055, 0.08, 0.2, 1800);
}
