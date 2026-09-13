let coinDropAudio: HTMLAudioElement | null = null;
let trashLidAudio: HTMLAudioElement | null = null;

function playAudio(path: string, current: "coin" | "trash") {
  if (typeof window === "undefined") return;
  const audio = current === "coin"
    ? (coinDropAudio ??= new Audio(path))
    : (trashLidAudio ??= new Audio(path));
  audio.currentTime = 0;
  void audio.play().catch(() => undefined);
}


export function playStashSound() {
  playAudio("/audio/coin-drop.mp3", "coin");
}

export function playTrashSound() {
  playAudio("/audio/trash-lid-close.mp3", "trash");
}
