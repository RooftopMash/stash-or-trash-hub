import jsQR from "jsqr";
import { BrowserMultiFormatReader } from "@zxing/library";

const ZXING_FORMAT_NAMES: Record<number, string> = {
  0: "aztec",
  1: "codabar",
  2: "code_39",
  3: "code_93",
  4: "code_128",
  5: "data_matrix",
  6: "ean_8",
  7: "ean_13",
  8: "itf",
  10: "pdf_417",
  11: "qr_code",
  14: "upc_a",
  15: "upc_e",
};

// Cache ZXing reader configured with retail 1D + 2D formats
let cachedZxingReader: BrowserMultiFormatReader | null = null;
function getZxingReader(): BrowserMultiFormatReader | null {
  if (typeof window === "undefined") return null;
  if (!cachedZxingReader) {
    try {
      cachedZxingReader = new BrowserMultiFormatReader();
    } catch {
      // Fallback if reader fails to initialize
    }
  }
  return cachedZxingReader;
}

export interface BrandIdentification {
  identified: boolean;
  brandName: string;
  brandOwner: string; // Corporate parent company / brand owner
  parentCompanyContext: string;
  productName: string;
  category: string;
  marketTier: "Budget" | "Mass Market" | "Premium" | "Luxury" | string;
  countryOfOrigin: string;
  confidence: number;
  qrOrBarcodeDecoded?: string;
  summary: string;
}

export interface MediaForensics {
  physicalLighting: string;
  textureAndNoise: string;
  textIntegrity: string;
  aiGenerationMarkers: string;
}

export interface MediaAuthenticityReport {
  score: number; // 0 - 100
  isLegitimate: boolean;
  verdictStatus: "verified_authentic" | "likely_authentic" | "suspicious_tampering" | "ai_generated" | "inconclusive";
  badgeLabel: string;
  confidence: "high" | "medium" | "low";
  forensics: MediaForensics;
  reasons: string[];
  flags: string[];
}

export interface CounterfeitAssessment {
  verdict: "legit" | "likely_legit" | "suspected_counterfeit" | "high_risk_fake" | "inconclusive";
  authenticityScore: number; // 0 - 100 (high = authentic)
  counterfeitRiskScore: number; // 0 - 100 (high = replica/fake risk)
  confidence: "high" | "medium" | "low";
  badgeLabel: string;
  logoInspection: string;
  barcodeAndTagsInspection: string;
  materialAndCraftsmanship: string;
  clientVerificationGuide: string[];
  brandProtectionTracking: {
    brandOwnerConfirmed: boolean;
    authorizedChannels: string;
    advice: string;
  };
  keyDifferencesToLookFor: string[];
}

export interface AiScanResult {
  brandInfo: BrandIdentification;
  authenticity: MediaAuthenticityReport;
  counterfeitAssessment?: CounterfeitAssessment;
}

/**
 * Optimizes an image File into a reasonably sized JPEG Base64 string for fast AI inference.
 */
export async function fileToOptimizedBase64(
  file: File,
  maxDim = 1280
): Promise<{ dataUrl: string; base64: string; mimeType: string; qrData: string | null; barcodeData: string | null }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          reject(new Error("Failed to get 2D canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
        const base64 = dataUrl.split(",")[1];

        // Attempt ZXing Barcode + QR decode
        let qrData: string | null = null;
        let barcodeData: string | null = null;

        try {
          const zx = getZxingReader();
          if (zx) {
            const zxRes = zx.decodeFromCanvas(canvas);
            if (zxRes && zxRes.getText()) {
              const text = zxRes.getText();
              const fmt = zxRes.getBarcodeFormat();
              const fmtName = typeof fmt === "number" && ZXING_FORMAT_NAMES[fmt] ? ZXING_FORMAT_NAMES[fmt] : "";
              if (fmtName.includes("qr")) {
                qrData = text;
              } else {
                barcodeData = text;
              }
            }
          }
        } catch {
          // ignore zxing failure
        }

        if (!qrData && !barcodeData) {
          try {
            const imageData = ctx.getImageData(0, 0, w, h);
            const qr = jsQR(imageData.data, w, h, { inversionAttempts: "attemptBoth" });
            if (qr?.data) qrData = qr.data;
          } catch {
            // ignore
          }
        }

        resolve({ dataUrl, base64, mimeType: "image/jpeg", qrData, barcodeData });
      };
      img.onerror = () => reject(new Error("Unable to decode image file"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts a representative frame from an uploaded video file (e.g. mp4, mov, webm).
 */
export async function extractFrameFromVideo(
  videoFile: File
): Promise<{ dataUrl: string; base64: string; mimeType: string; qrData: string | null; barcodeData: string | null }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(videoFile);
    video.src = url;

    const cleanup = () => URL.revokeObjectURL(url);

    video.onloadedmetadata = () => {
      // Seek to 1s or 25% of duration
      video.currentTime = Math.min(1.0, video.duration > 0 ? video.duration / 4 : 0.5);
    };

    video.onseeked = () => {
      try {
        const maxDim = 1280;
        let w = video.videoWidth || 640;
        let h = video.videoHeight || 480;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("Could not create canvas context");
        ctx.drawImage(video, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
        const base64 = dataUrl.split(",")[1];

        let qrData: string | null = null;
        let barcodeData: string | null = null;

        try {
          const zx = getZxingReader();
          if (zx) {
            const zxRes = zx.decodeFromCanvas(canvas);
            if (zxRes && zxRes.getText()) {
              const text = zxRes.getText();
              const fmt = zxRes.getBarcodeFormat();
              const fmtName = typeof fmt === "number" && ZXING_FORMAT_NAMES[fmt] ? ZXING_FORMAT_NAMES[fmt] : "";
              if (fmtName.includes("qr")) {
                qrData = text;
              } else {
                barcodeData = text;
              }
            }
          }
        } catch {
          // ignore
        }

        if (!qrData && !barcodeData) {
          try {
            const imgData = ctx.getImageData(0, 0, w, h);
            const qr = jsQR(imgData.data, w, h, { inversionAttempts: "attemptBoth" });
            if (qr?.data) qrData = qr.data;
          } catch {
            // ignore
          }
        }

        cleanup();
        resolve({ dataUrl, base64, mimeType: "image/jpeg", qrData, barcodeData });
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Unable to process video frame"));
    };
  });
}

// Reusable offline canvas for video frame extraction
let processingCanvas: HTMLCanvasElement | null = null;
let croppedCanvas: HTMLCanvasElement | null = null;

/**
 * Scans a canvas element for QR codes in real-time (e.g. from camera feed).
 */
export function scanQrFromCanvas(canvas: HTMLCanvasElement): string | null {
  try {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imgData.data, canvas.width, canvas.height, {
      inversionAttempts: "attemptBoth",
    });
    return code?.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Scans a canvas or image source for Barcodes (UPC-A, EAN-13, Code-128, etc.) and QR codes.
 * Uses native BarcodeDetector when available, with deep fallback to ZXing multi-format reader and jsQR.
 */
export async function detectBarcodeOrQr(
  source: HTMLVideoElement | HTMLCanvasElement | ImageBitmap
): Promise<{ format: string; rawValue: string } | null> {
  // 1. Try native BarcodeDetector if available
  if (typeof window !== "undefined" && "BarcodeDetector" in window) {
    try {
      // @ts-expect-error BarcodeDetector browser experimental API
      const detector = new window.BarcodeDetector({
        formats: [
          "qr_code",
          "ean_13",
          "ean_8",
          "upc_a",
          "upc_e",
          "code_128",
          "code_39",
          "code_93",
          "itf",
          "data_matrix",
        ],
      });
      const barcodes = await detector.detect(source);
      if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
        return {
          format: barcodes[0].format || "barcode",
          rawValue: barcodes[0].rawValue,
        };
      }
    } catch {
      // Fallback to ZXing below
    }
  }

  // 2. Fallback to ZXing MultiFormat Reader (handles 1D barcodes like Coca Cola UPC-A/EAN-13 everywhere)
  try {
    const reader = getZxingReader();
    if (reader) {
      let targetCanvas: HTMLCanvasElement | null = null;

      if (source instanceof HTMLCanvasElement) {
        targetCanvas = source;
      } else if (source instanceof HTMLVideoElement && source.videoWidth > 0 && source.videoHeight > 0) {
        if (!processingCanvas) {
          processingCanvas = document.createElement("canvas");
        }
        processingCanvas.width = source.videoWidth;
        processingCanvas.height = source.videoHeight;
        const pCtx = processingCanvas.getContext("2d", { willReadFrequently: true });
        if (pCtx) {
          pCtx.drawImage(source, 0, 0, source.videoWidth, source.videoHeight);
          targetCanvas = processingCanvas;
        }
      }

      if (targetCanvas) {
        // Attempt full frame scan
        try {
          const zxResult = reader.decodeFromCanvas(targetCanvas);
          if (zxResult && zxResult.getText()) {
            const raw = zxResult.getText();
            const formatNum = zxResult.getBarcodeFormat();
            const formatStr = (typeof formatNum === "number" && ZXING_FORMAT_NAMES[formatNum])
              ? ZXING_FORMAT_NAMES[formatNum]
              : "barcode";
            return {
              format: formatStr,
              rawValue: raw,
            };
          }
        } catch {
          // If full frame failed, try center crop reticle (ideal for curved bottles / closeups)
          const cw = targetCanvas.width;
          const ch = targetCanvas.height;
          const cropW = Math.round(cw * 0.7);
          const cropH = Math.round(ch * 0.45);
          const cropX = Math.round((cw - cropW) / 2);
          const cropY = Math.round((ch - cropH) / 2);

          if (!croppedCanvas) {
            croppedCanvas = document.createElement("canvas");
          }
          croppedCanvas.width = cropW;
          croppedCanvas.height = cropH;
          const cCtx = croppedCanvas.getContext("2d", { willReadFrequently: true });
          if (cCtx) {
            cCtx.drawImage(targetCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
            try {
              const cropResult = reader.decodeFromCanvas(croppedCanvas);
              if (cropResult && cropResult.getText()) {
                const raw = cropResult.getText();
                const formatNum = cropResult.getBarcodeFormat();
                const formatStr = (typeof formatNum === "number" && ZXING_FORMAT_NAMES[formatNum])
                  ? ZXING_FORMAT_NAMES[formatNum]
                  : "barcode";
                return {
                  format: formatStr,
                  rawValue: raw,
                };
              }
            } catch {
              // Not detected in crop, try 90-degree rotation (common on vertical bottle barcodes)
              try {
                const rotCanvas = document.createElement("canvas");
                rotCanvas.width = cropH;
                rotCanvas.height = cropW;
                const rCtx = rotCanvas.getContext("2d", { willReadFrequently: true });
                if (rCtx) {
                  rCtx.translate(cropH / 2, cropW / 2);
                  rCtx.rotate((90 * Math.PI) / 180);
                  rCtx.drawImage(croppedCanvas, -cropW / 2, -cropH / 2);
                  const rotResult = reader.decodeFromCanvas(rotCanvas);
                  if (rotResult && rotResult.getText()) {
                    const raw = rotResult.getText();
                    const formatNum = rotResult.getBarcodeFormat();
                    const formatStr = (typeof formatNum === "number" && ZXING_FORMAT_NAMES[formatNum])
                      ? ZXING_FORMAT_NAMES[formatNum]
                      : "barcode";
                    return {
                      format: formatStr,
                      rawValue: raw,
                    };
                  }
                }
              } catch {
                // Rotation attempt failed
              }
            }
          }
        }
      }
    }
  } catch {
    // ZXing fallback error ignored
  }

  // 3. Fallback to jsQR if source is a canvas or captured video
  if (source instanceof HTMLCanvasElement) {
    const qr = scanQrFromCanvas(source);
    if (qr) {
      return { format: "qr_code", rawValue: qr };
    }
  } else if (processingCanvas) {
    const qr = scanQrFromCanvas(processingCanvas);
    if (qr) {
      return { format: "qr_code", rawValue: qr };
    }
  }

  return null;
}

/**
 * Resolves GS1 prefix country/region for 1D UPC/EAN barcodes.
 */
export function getGs1CountryPrefix(barcode: string): string | null {
  const digits = barcode.replace(/\D/g, "");
  if (digits.length < 3) return null;
  const prefix3 = parseInt(digits.slice(0, 3), 10);
  const prefix2 = parseInt(digits.slice(0, 2), 10);

  if (prefix3 >= 0 && prefix3 <= 19) return "United States & Canada (UPC-A)";
  if (prefix3 >= 30 && prefix3 <= 39) return "United States (Drugs / Healthcare)";
  if (prefix3 >= 40 && prefix3 <= 49) return "Restricted Internal Distribution";
  if (prefix3 >= 50 && prefix3 <= 59) return "Coupons & Loyalty";
  if (prefix3 >= 100 && prefix3 <= 139) return "United States";
  if (prefix3 >= 300 && prefix3 <= 379) return "France & Monaco";
  if (prefix3 >= 380 && prefix3 <= 380) return "Bulgaria";
  if (prefix3 >= 383 && prefix3 <= 383) return "Slovenia";
  if (prefix3 >= 385 && prefix3 <= 385) return "Croatia";
  if (prefix3 >= 400 && prefix3 <= 440) return "Germany";
  if (prefix3 >= 450 && prefix3 <= 459) return "Japan (JAN)";
  if (prefix3 >= 460 && prefix3 <= 469) return "Russia";
  if (prefix3 >= 471 && prefix3 <= 471) return "Taiwan";
  if (prefix3 >= 480 && prefix3 <= 480) return "Philippines";
  if (prefix3 >= 489 && prefix3 <= 489) return "Hong Kong";
  if (prefix3 >= 490 && prefix3 <= 499) return "Japan (JAN)";
  if (prefix3 >= 500 && prefix3 <= 509) return "United Kingdom";
  if (prefix3 >= 520 && prefix3 <= 521) return "Greece";
  if (prefix3 >= 531 && prefix3 <= 531) return "North Macedonia";
  if (prefix3 >= 535 && prefix3 <= 535) return "Malta";
  if (prefix3 >= 539 && prefix3 <= 539) return "Ireland";
  if (prefix3 >= 540 && prefix3 <= 549) return "Belgium & Luxembourg";
  if (prefix3 >= 560 && prefix3 <= 560) return "Portugal";
  if (prefix3 >= 569 && prefix3 <= 569) return "Iceland";
  if (prefix3 >= 570 && prefix3 <= 579) return "Denmark, Faroe & Greenland";
  if (prefix3 >= 590 && prefix3 <= 590) return "Poland";
  if (prefix3 >= 594 && prefix3 <= 594) return "Romania";
  if (prefix3 >= 599 && prefix3 <= 599) return "Hungary";
  if (prefix3 >= 600 && prefix3 <= 601) return "South Africa";
  if (prefix3 >= 611 && prefix3 <= 611) return "Morocco";
  if (prefix3 >= 619 && prefix3 <= 619) return "Tunisia";
  if (prefix3 >= 622 && prefix3 <= 622) return "Egypt";
  if (prefix3 >= 640 && prefix3 <= 649) return "Finland";
  if (prefix3 >= 690 && prefix3 <= 699) return "China";
  if (prefix3 >= 700 && prefix3 <= 709) return "Norway";
  if (prefix3 >= 730 && prefix3 <= 739) return "Sweden";
  if (prefix3 >= 750 && prefix3 <= 750) return "Mexico";
  if (prefix3 >= 760 && prefix3 <= 769) return "Switzerland & Liechtenstein";
  if (prefix3 >= 770 && prefix3 <= 771) return "Colombia";
  if (prefix3 >= 773 && prefix3 <= 773) return "Uruguay";
  if (prefix3 >= 775 && prefix3 <= 775) return "Peru";
  if (prefix3 >= 779 && prefix3 <= 779) return "Argentina";
  if (prefix3 >= 780 && prefix3 <= 780) return "Chile";
  if (prefix3 >= 789 && prefix3 <= 790) return "Brazil";
  if (prefix3 >= 800 && prefix3 <= 839) return "Italy, San Marino & Vatican";
  if (prefix3 >= 840 && prefix3 <= 849) return "Spain";
  if (prefix3 >= 860 && prefix3 <= 860) return "Serbia";
  if (prefix3 >= 868 && prefix3 <= 869) return "Turkey";
  if (prefix3 >= 870 && prefix3 <= 879) return "Netherlands";
  if (prefix3 >= 880 && prefix3 <= 880) return "South Korea";
  if (prefix3 >= 885 && prefix3 <= 885) return "Thailand";
  if (prefix3 >= 888 && prefix3 <= 888) return "Singapore";
  if (prefix3 >= 890 && prefix3 <= 890) return "India";
  if (prefix3 >= 893 && prefix3 <= 893) return "Vietnam";
  if (prefix3 >= 899 && prefix3 <= 899) return "Indonesia";
  if (prefix3 >= 900 && prefix3 <= 919) return "Austria";
  if (prefix3 >= 930 && prefix3 <= 939) return "Australia";
  if (prefix3 >= 940 && prefix3 <= 949) return "New Zealand";
  if (prefix3 >= 955 && prefix3 <= 955) return "Malaysia";

  return null;
}

/**
 * Synthesizes a futuristic confirmation chime using Web Audio API.
 */
export function playScanChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12); // A6

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // Audio context may be restricted before interaction
  }
}

/**
 * Calls our server-side Gemini AI Scan endpoint.
 */
export async function runAiScan(params: {
  image?: string; // base64
  mimeType?: string;
  qrData?: string;
  barcode?: string;
  inspectionMode?: "barcode" | "logo" | "full_product" | "general";
  mediaType?: "image" | "video_frame";
}): Promise<AiScanResult> {
  const res = await fetch("/api/ai-scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: "AI Scan failed" }));
    throw new Error(errData.error || errData.details || `AI Scan failed with status ${res.status}`);
  }

  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.error || "No data received from AI Scan");
  }

  return json.data as AiScanResult;
}
