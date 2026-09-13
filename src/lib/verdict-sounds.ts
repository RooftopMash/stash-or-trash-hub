let audioContext: AudioContext | null = null;

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
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  playMetalClick(context, now, 2850, 0.16, 0.035);
  playMetalClick(context, now + 0.075, 2150, 0.13, 0.045);
  playMetalClick(context, now + 0.16, 1720, 0.1, 0.06);
  playMetalClick(context, now + 0.255, 1180, 0.07, 0.08);
  playMetalClick(context, now + 0.36, 220, 0.06, 0.12);
}

export function playTrashSound() {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  playMetalClick(context, now, 180, 0.3, 0.12);
  playMetalClick(context, now + 0.045, 92, 0.24, 0.22);
  playMetalClick(context, now + 0.085, 640, 0.19, 0.32);
  playMetalClick(context, now + 0.16, 420, 0.13, 0.42);
}
