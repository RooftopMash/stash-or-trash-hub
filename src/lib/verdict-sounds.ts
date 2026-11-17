let trashLidAudio: HTMLAudioElement | null = null;

const SOUND_PREF_KEY = "sot_verdict_sound_enabled_v1";

export function isVerdictSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(SOUND_PREF_KEY);
    return raw === null ? true : raw !== "false";
  } catch {
    return true;
  }
}

export function setVerdictSoundEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SOUND_PREF_KEY, String(enabled));
  } catch {
    // ignore
  }
}

export function playStashSound() {
  // Synthetic coin audio killed; keep silent until a true continuous coin-spin recording is added.
}

export function playCoinSpinSound() {
  // Synthetic coin-spin audio killed per user request.
}

export function playTrashSound() {
  if (typeof window === "undefined" || !isVerdictSoundEnabled()) return;
  try {
    const audio = (trashLidAudio ??= new Audio("/audio/real-metal-bin-close.mp3"));
    audio.volume = 0.55;
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  } catch {
    // ignore playback rejection
  }
}
