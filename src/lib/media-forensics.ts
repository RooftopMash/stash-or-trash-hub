export type AuditTier = "clean" | "reused" | "flagged" | "inconclusive";
export type MediaAuditReport = {
  tier: AuditTier;
  sha256: string | null;
  phash: string | null;
  width: number | null;
  height: number | null;
  bytes: number;
  mime: string;
  provenance: { camera_metadata: boolean; c2pa: boolean; notes: string[] };
  flags: string[];
  detectors: { name: string; activated: boolean }[];
};

const MAX_DIM = 512;
function guessMime(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "avif") return "image/avif";
  return "image/jpeg";
}
async function sha256Hex(buf: ArrayBuffer): Promise<string | null> {
  try {
    if (!globalThis.crypto?.subtle) return null;
    const d = await globalThis.crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch { return null; }
}
function scanMetadata(buf: ArrayBuffer): { cameraMetadata: boolean; c2pa: boolean } {
  const bytes = new Uint8Array(buf);
  const head = bytes.slice(0, Math.min(bytes.length, 65536));
  const tail = bytes.slice(Math.max(0, bytes.length - 8192));
  const dec = new TextDecoder("latin1");
  const full = dec.decode(head) + dec.decode(tail);
  return { cameraMetadata: /Exif|eXIf|xmp|JFIF/i.test(full), c2pa: /c2pa|jumbf/i.test(full) };
}
type Pixels = { data: Uint8ClampedArray; width: number; height: number };
async function decodePixels(file: File): Promise<Pixels | null> {
  try {
    if (typeof document === "undefined") return null;
    let w = 0, h = 0;
    let drawn: CanvasImageSource;
    if (typeof createImageBitmap === "function") {
      const bmp = await createImageBitmap(file);
      w = bmp.width; h = bmp.height; drawn = bmp;
    } else {
      const url = URL.createObjectURL(file);
      const im = await new Promise<HTMLImageElement>((res, rej) => {
        const el = new Image();
        el.onload = () => res(el);
        el.onerror = () => rej(new Error("decode failed"));
        el.src = url;
      });
      w = im.naturalWidth; h = im.naturalHeight; drawn = im;
    }
    const scale = Math.min(1, MAX_DIM / Math.max(w, h));
    const cw = Math.max(1, Math.round(w * scale));
    const ch = Math.max(1, Math.round(h * scale));
    const canvas = document.createElement("canvas");
    canvas.width = cw; canvas.height = ch;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(drawn, 0, 0, cw, ch);
    const id = ctx.getImageData(0, 0, cw, ch);
    return { data: id.data, width: cw, height: ch };
  } catch { return null; }
}
function pooledGray(data: Uint8ClampedArray, w: number, h: number, pw = 9, ph = 8): Uint8Array {
  const out = new Uint8Array(pw * ph);
  const bx = w / pw, by = h / ph;
  for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
    const x0 = Math.floor(x * bx), x1 = Math.ceil((x + 1) * bx);
    const y0 = Math.floor(y * by), y1 = Math.ceil((y + 1) * by);
    let sum = 0, count = 0;
    for (let yy = y0; yy < y1 && yy < h; yy++) for (let xx = x0; xx < x1 && xx < w; xx++) {
      const i = (yy * w + xx) * 4;
      sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      count++;
    }
    out[y * pw + x] = count ? Math.round(sum / count) : 0;
  }
  return out;
}
function dHashHex(gray: Uint8Array, w = 9, h = 8): string {
  let bits = "";
  for (let y = 0; y < h; y++) for (let x = 0; x < w - 1; x++) bits += gray[y * w + x] > gray[y * w + x + 1] ? "1" : "0";
  let hex = "";
  for (let i = 0; i < bits.length; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  return hex;
}
export function hamming(a: string, b: string): number {
  if (a.length !== b.length) return 64;
  let d = 0;
  for (let i = 0; i < a.length; i++) { let x = parseInt(a[i], 16) ^ parseInt(b[i], 16); while (x) { d += x & 1; x >>= 1; } }
  return d;
}
export async function analyzeImage(file: File): Promise<MediaAuditReport> {
  const bytes = file.size;
  const mime = file.type || guessMime(file.name);
  const buf = await file.arrayBuffer();
  const sha = await sha256Hex(buf);
  const meta = scanMetadata(buf);
  const notes: string[] = [];
  if (meta.c2pa) notes.push("C2PA/JUMBF content-credentials marker present");
  if (!meta.cameraMetadata) notes.push("No embedded camera/EXIF metadata found");
  const flags: string[] = [];
  const px = await decodePixels(file);
  let phash: string | null = null, width: number | null = null, height: number | null = null;
  let tier: AuditTier = "clean";
  if (px) {
    width = px.width; height = px.height;
    phash = dHashHex(pooledGray(px.data, px.width, px.height, 9, 8), 9, 8);
  } else {
    tier = "inconclusive";
    flags.push("Could not decode pixels for perceptual hashing");
  }
  return {
    tier, sha256: sha, phash, width, height, bytes, mime,
    provenance: { camera_metadata: meta.cameraMetadata, c2pa: meta.c2pa, notes },
    flags,
    detectors: [
      { name: "sightengine", activated: false },
      { name: "hive", activated: false },
      { name: "aiornot", activated: false },
    ],
  };
}
