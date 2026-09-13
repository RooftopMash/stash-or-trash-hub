let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  audioContext ??= new AudioContext();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

export function playStashSound() {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, now);
  oscillator.frequency.exponentialRampToValueAtTime(1760, now + 0.08);
  oscillator.frequency.exponentialRampToValueAtTime(1040, now + 0.24);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.3);
}

export function playTrashSound() {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(180, now);
  oscillator.frequency.exponentialRampToValueAtTime(62, now + 0.18);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.3, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.26);
}
