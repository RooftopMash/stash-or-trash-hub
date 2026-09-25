import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Camera,
  Scan,
  QrCode,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Building2,
  Sparkles,
  Upload,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Zap,
  ZapOff,
  Eye,
  Copy,
  Tag,
  HelpCircle,
  Maximize2,
  ExternalLink,
  MessageSquare,
  FileCheck,
  Download,
  Printer,
} from "lucide-react";
import {
  detectBarcodeOrQr,
  getGs1CountryPrefix,
  playScanChime,
  fileToOptimizedBase64,
  extractFrameFromVideo,
  runAiScan,
  type AiScanResult,
} from "@/lib/ai-scanner";
import { searchBrands, type Brand } from "@/lib/brands";
import { toast } from "sonner";

export type InspectionMode = "barcode" | "logo" | "full_product";

export interface ProductCameraScannerProps {
  onApplyToPost?: (params: {
    brandName: string;
    brandOwner: string;
    productName: string;
    category: string;
    matchedBrandId?: string;
    file?: File | null;
    scanResult: AiScanResult;
  }) => void;
  onClose?: () => void;
  standalone?: boolean;
}

export function ProductAuthenticityCameraScanner({
  onApplyToPost,
  onClose,
  standalone = false,
}: ProductCameraScannerProps) {
  const { t } = useTranslation();
  // Permission & Stream State
  const [permissionState, setPermissionState] = useState<
    "prompt" | "granted" | "denied" | "unsupported"
  >("prompt");
  const [streamActive, setStreamActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [activeMode, setActiveMode] = useState<InspectionMode>("barcode");

  // Analysis & Result State
  const [scanning, setScanning] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [detectedCode, setDetectedCode] = useState<{
    format: string;
    rawValue: string;
    country?: string | null;
  } | null>(null);
  const [scanResult, setScanResult] = useState<AiScanResult | null>(null);
  const [matchedBrand, setMatchedBrand] = useState<Brand | null>(null);

  // Tab view in results
  const [resultTab, setResultTab] = useState<"authenticity" | "guide" | "brand" | "forensics" | "pr_dossier">("authenticity");
  const [manualBarcode, setManualBarcode] = useState("");
  const [showManualBarcode, setShowManualBarcode] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLoopRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isDetectingRef = useRef(false);

  const handlePrintCertificate = () => {
    if (!scanResult) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.info("Please allow popups to print the certificate.");
      return;
    }
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Brand PR Authenticity & Forensic Audit Certificate</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .badge { display: inline-block; padding: 6px 14px; background: #10b981; color: white; border-radius: 9999px; font-weight: bold; text-transform: uppercase; font-size: 12px; }
          .hero { margin: 30px 0; background: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .card { border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; background: white; }
          .score { font-size: 36px; font-weight: 900; color: #10b981; }
          .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 style="margin:0; font-size:24px;">STASH OR TRASH</h1>
            <p style="margin:4px 0 0 0; color:#64748b; font-size:13px;">Official Forensic Media & Authenticity Audit Dossier</p>
          </div>
          <div class="badge">${scanResult.counterfeitAssessment?.badgeLabel || "Verified Authentic"}</div>
        </div>
        <div class="hero">
          <div style="font-size:12px; text-transform:uppercase; color:#64748b; font-weight:bold;">Product & Brand Profile</div>
          <h2 style="margin:6px 0; font-size:26px;">${scanResult.brandInfo.brandName} — ${scanResult.brandInfo.productName || "Verified Product"}</h2>
          <p style="margin:0; color:#475569; font-size:14px;"><strong>Corporate Owner:</strong> ${scanResult.brandInfo.brandOwner} (${scanResult.brandInfo.countryOfOrigin})</p>
        </div>
        <div class="grid">
          <div class="card">
            <div style="font-size:12px; color:#64748b;">Authenticity Score</div>
            <div class="score">${scanResult.counterfeitAssessment?.authenticityScore ?? scanResult.authenticity.score}%</div>
            <p style="font-size:12px; color:#475569; margin-top:6px;">Confidence: ${scanResult.counterfeitAssessment?.confidence?.toUpperCase() || "HIGH"}</p>
          </div>
          <div class="card">
            <div style="font-size:12px; color:#64748b;">Media Integrity (Tamper Check)</div>
            <div class="score" style="color: #0284c7;">${scanResult.authenticity.score}%</div>
            <p style="font-size:12px; color:#475569; margin-top:6px;">Status: ${scanResult.authenticity.verdictStatus.replace("_", " ")}</p>
          </div>
        </div>
        <div class="card" style="margin-bottom: 20px;">
          <h3 style="margin-top:0; font-size:14px;">Forensic Attribute Verification</h3>
          <ul style="font-size:12px; color:#334155; line-height: 1.6; padding-left: 20px;">
            <li><strong>Lighting & Shadows:</strong> ${scanResult.authenticity.forensics?.physicalLighting || "Consistent physical shadows"}</li>
            <li><strong>Texture & Noise:</strong> ${scanResult.authenticity.forensics?.textureAndNoise || "Natural camera sensor grain verified"}</li>
            <li><strong>Typography & Print:</strong> ${scanResult.authenticity.forensics?.textIntegrity || "Verified manufacturer typeface geometry"}</li>
            <li><strong>AI / Deepfake Check:</strong> ${scanResult.authenticity.forensics?.aiGenerationMarkers || "Zero synthetic AI generation markers detected"}</li>
          </ul>
        </div>
        <div class="footer">
          Issued by Stash Or Trash AI Forensic System • Verified for Brand PR Officers & Client Service • Timestamp: ${new Date().toISOString()}
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Check initial permission status if supported
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.permissions?.query) {
      navigator.permissions
        // @ts-expect-error camera permission query
        .query({ name: "camera" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "granted") {
            setPermissionState("granted");
          } else if (permissionStatus.state === "denied") {
            setPermissionState("denied");
          } else {
            setPermissionState("prompt");
          }

          permissionStatus.onchange = () => {
            if (permissionStatus.state === "granted") setPermissionState("granted");
            else if (permissionStatus.state === "denied") setPermissionState("denied");
            else setPermissionState("prompt");
          };
        })
        .catch(() => {
          // Fallback
        });
    }
  }, []);

  // Stop camera tracks and cancel scan loop
  const stopCamera = useCallback(() => {
    if (scanLoopRef.current) {
      cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    setStreamActive(false);
    setTorchOn(false);
  }, []);

  // Real-time detection loop for Barcodes & QR codes
  const runDetectionLoop = useCallback(() => {
    if (!videoRef.current || videoRef.current.readyState < 2) {
      scanLoopRef.current = requestAnimationFrame(runDetectionLoop);
      return;
    }

    if (isDetectingRef.current) {
      scanLoopRef.current = requestAnimationFrame(runDetectionLoop);
      return;
    }

    isDetectingRef.current = true;
    const video = videoRef.current;
    detectBarcodeOrQr(video)
      .then((detected) => {
        if (detected && detected.rawValue) {
          const country = getGs1CountryPrefix(detected.rawValue);
          setDetectedCode((prev) => {
            if (prev?.rawValue !== detected.rawValue) {
              playScanChime();
              if (typeof navigator !== "undefined" && navigator.vibrate) {
                navigator.vibrate([60, 40, 60]);
              }
              toast.info(
                `Captured ${detected.format.toUpperCase()}: ${detected.rawValue}${
                  country ? ` (${country})` : ""
                }`,
                { duration: 2500 }
              );
              return {
                format: detected.format,
                rawValue: detected.rawValue,
                country,
              };
            }
            return prev;
          });
        }
      })
      .catch(() => {
        // ignore detection frame errors
      })
      .finally(() => {
        isDetectingRef.current = false;
        scanLoopRef.current = requestAnimationFrame(runDetectionLoop);
      });
  }, []);

  // Start live camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionState("unsupported");
        toast.error("Camera API is not supported on this browser/device.");
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setPermissionState("granted");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
        setStreamActive(true);

        // Check torch capability
        const track = stream.getVideoTracks()[0];
        if (track && track.getCapabilities) {
          const caps = track.getCapabilities() as any;
          if (caps && "torch" in caps) {
            setHasTorch(true);
          }
        }

        scanLoopRef.current = requestAnimationFrame(runDetectionLoop);
      }
    } catch (err: any) {
      console.warn("Camera start failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionState("denied");
        toast.error("Camera permission denied. Please allow camera access in browser settings.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setPermissionState("unsupported");
        toast.error("No camera found on this device.");
      } else {
        toast.error(`Unable to open camera: ${err.message || "Unknown error"}`);
      }
    }
  }, [cameraFacing, stopCamera, runDetectionLoop]);

  // Toggle torch / flashlight
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    try {
      const nextState = !torchOn;
      // @ts-expect-error torch capability
      await track.applyConstraints({ advanced: [{ torch: nextState }] });
      setTorchOn(nextState);
    } catch (err) {
      toast.error("Flashlight could not be toggled on this camera.");
    }
  };

  // Flip camera between front & back
  const flipCamera = () => {
    setCameraFacing((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Trigger camera start once granted or on active view
  useEffect(() => {
    if (permissionState === "granted" && !capturedImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [permissionState, cameraFacing, startCamera, stopCamera, capturedImage]);

  // Execute AI scan on payload
  const processImageForAuthenticity = async (
    base64: string,
    mime: string,
    previewUrl: string,
    fileObj: File | null,
    barcodeData?: string,
    mode: InspectionMode = activeMode
  ) => {
    setScanning(true);
    setCapturedImage(previewUrl);
    setCapturedFile(fileObj);
    stopCamera();

    try {
      setAnalyzingStep("Executing forensic edge & logo geometry inspection...");
      await new Promise((r) => setTimeout(r, 200));

      setAnalyzingStep(
        mode === "barcode"
          ? "Validating GS1 barcode checksum & international registry..."
          : "Analyzing typography, stitching density & micro-embossing..."
      );

      const result = await runAiScan({
        image: base64,
        mimeType: mime,
        barcode: barcodeData || detectedCode?.rawValue || undefined,
        qrData: detectedCode?.format === "qr_code" ? detectedCode.rawValue : undefined,
        inspectionMode: mode,
        mediaType: "image",
      });

      setAnalyzingStep("Verifying corporate brand ownership & counterfeit risk...");
      setScanResult(result);

      // Check if this brand exists in Stash or Trash database
      if (result.brandInfo?.brandName) {
        try {
          const matches = await searchBrands(result.brandInfo.brandName);
          if (matches && matches.length > 0) {
            setMatchedBrand(matches[0]);
          }
        } catch {
          // ignore
        }
      }

      playScanChime();
      const verdict = result.counterfeitAssessment?.verdict;
      if (verdict === "legit" || verdict === "likely_legit") {
        toast.success(`Authenticity Confirmed: ${result.brandInfo.brandName} is Verified Legit!`);
      } else if (verdict === "suspected_counterfeit" || verdict === "high_risk_fake") {
        toast.error(`Counterfeit Warning: High replica risk detected for ${result.brandInfo.brandName}.`);
      } else {
        toast.info(`Identified: ${result.brandInfo.brandName} (${result.brandInfo.brandOwner})`);
      }
    } catch (err: any) {
      toast.error(err.message || "Authenticity scan failed");
    } finally {
      setScanning(false);
      setAnalyzingStep("");
    }
  };

  // Capture frame from active camera
  const captureFromCamera = async () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const base64 = dataUrl.split(",")[1];

    // Detect barcode on snapshot
    const barcodeSnapshot = await detectBarcodeOrQr(canvas);
    const barcodeVal = barcodeSnapshot?.rawValue || detectedCode?.rawValue;

    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `auth-scan-${Date.now()}.jpg`, { type: "image/jpeg" });

    await processImageForAuthenticity(base64, "image/jpeg", dataUrl, file, barcodeVal, activeMode);
  };

  // Upload photo/video fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    setScanning(true);
    setAnalyzingStep(isVideo ? "Extracting representative video frame..." : "Optimizing image resolution...");

    try {
      if (isVideo) {
        const { dataUrl, base64, mimeType, qrData, barcodeData } = await extractFrameFromVideo(file);
        await processImageForAuthenticity(base64, mimeType, dataUrl, file, barcodeData || qrData || undefined, activeMode);
      } else {
        const { dataUrl, base64, mimeType, qrData, barcodeData } = await fileToOptimizedBase64(file);
        await processImageForAuthenticity(base64, mimeType, dataUrl, file, barcodeData || qrData || undefined, activeMode);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to process media file");
      setScanning(false);
      setAnalyzingStep("");
    }
  };

  // Manual barcode lookup
  const handleManualBarcodeSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = manualBarcode.trim();
    if (!code) {
      toast.error("Please enter a barcode number");
      return;
    }
    const country = getGs1CountryPrefix(code);
    setDetectedCode({
      format: "barcode",
      rawValue: code,
      country,
    });
    playScanChime();
    await processImageForAuthenticity("", "image/jpeg", "", null, code, "barcode");
  };

  // Reset scan and return to live camera
  const handleReset = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    setScanResult(null);
    setMatchedBrand(null);
    setDetectedCode(null);
    startCamera();
  };

  // Apply to post
  const handleApplyPost = () => {
    if (!scanResult) return;
    if (onApplyToPost) {
      onApplyToPost({
        brandName: scanResult.brandInfo.brandName,
        brandOwner: scanResult.brandInfo.brandOwner,
        productName: scanResult.brandInfo.productName,
        category: scanResult.brandInfo.category,
        matchedBrandId: matchedBrand?.id,
        file: capturedFile,
        scanResult,
      });
    }
    if (onClose) onClose();
  };

  // Copy official authenticity certificate text
  const handleCopyReport = () => {
    if (!scanResult) return;
    const b = scanResult.brandInfo;
    const c = scanResult.counterfeitAssessment;
    const reportText = `[STASH OR TRASH AUTHENTICITY CERTIFICATE]
Product: ${b.productName || b.brandName}
Brand: ${b.brandName}
Corporate Owner: ${b.brandOwner} (${b.countryOfOrigin})
Authenticity Verdict: ${c?.verdict?.toUpperCase() || scanResult.authenticity.verdictStatus}
Legitimacy Score: ${c?.authenticityScore ?? scanResult.authenticity.score}%
Counterfeit Risk: ${c?.counterfeitRiskScore ?? 0}%
Logo Inspection: ${c?.logoInspection || "Verified typography"}
Barcode / Tags: ${b.qrOrBarcodeDecoded || detectedCode?.rawValue || "Standard compliant"}
Verified on Stash Or Trash Brand Barometer`;

    navigator.clipboard.writeText(reportText);
    toast.success("Authenticity audit certificate copied to clipboard!");
  };

  return (
    <div className={`flex flex-col w-full bg-card rounded-2xl border border-border shadow-2xl overflow-hidden ${standalone ? "max-w-4xl mx-auto" : ""}`}>
      {/* Top Bar Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
            <Scan className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-display leading-tight flex items-center gap-2">
              {t("scanner.title", { defaultValue: "Authenticity & Anti-Counterfeit Scanner" })}
              <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary bg-primary/5">
                AI Forensic v2.5
              </Badge>
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("scanner.subtitle", { defaultValue: "Scan product barcodes, luxury logos, and care tags to verify genuine vs. counterfeit" })}
            </p>
          </div>
        </div>

        {/* Mode Selector Pill Buttons (when on camera view) */}
        {!scanResult && (
          <div className="hidden sm:flex items-center gap-1 bg-background/80 p-1 rounded-xl border border-border text-xs">
            <button
              onClick={() => setActiveMode("barcode")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeMode === "barcode"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <QrCode className="h-3.5 w-3.5" /> {t("scanner.modeBarcode", { defaultValue: "Barcode & QR" })}
            </button>
            <button
              onClick={() => setActiveMode("logo")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeMode === "logo"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Tag className="h-3.5 w-3.5" /> {t("scanner.modeLogo", { defaultValue: "Logo & Tag" })}
            </button>
            <button
              onClick={() => setActiveMode("full_product")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeMode === "full_product"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> {t("scanner.modeFullProduct", { defaultValue: "Full Product" })}
            </button>
          </div>
        )}
      </div>

      {/* Main Viewport Content */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* If Still Live Camera or Preparing */}
        {!scanResult && (
          <div className="relative w-full aspect-video sm:aspect-[16/9] max-h-[460px] rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner group">
            {/* Permission Prompt Screen */}
            {permissionState === "prompt" && (
              <div className="text-center p-6 space-y-4 max-w-md z-10">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                  <Camera className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{t("scanner.cameraAccessRequired", { defaultValue: "Camera Access Required" })}</h3>
                  <p className="text-xs text-white/70">
                    {t("scanner.cameraAccessDesc", { defaultValue: "Allow camera access to inspect physical packaging, barcodes, luxury logos, and verify if the product is legit or fake." })}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <Button onClick={startCamera} className="gap-2 font-semibold">
                    <Camera className="h-4 w-4" /> {t("scanner.grantPermission", { defaultValue: "Grant Camera Permission" })}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2 text-white border-white/20 bg-white/5 hover:bg-white/10"
                  >
                    <Upload className="h-4 w-4" /> {t("scanner.uploadPhotoInstead", { defaultValue: "Upload Photo Instead" })}
                  </Button>
                </div>
              </div>
            )}

            {/* Permission Denied Screen */}
            {permissionState === "denied" && (
              <div className="text-center p-6 space-y-3 max-w-md z-10">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-destructive/20 text-destructive flex items-center justify-center border border-destructive/30">
                  <ShieldAlert className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{t("scanner.cameraBlocked", { defaultValue: "Camera Permission Was Blocked" })}</h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {t("scanner.cameraBlockedDesc", { defaultValue: "Your browser has restricted camera access for this page. Click the camera icon or padlock in your browser's address bar to change permissions to Allow." })}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <Button onClick={startCamera} variant="secondary" className="gap-2">
                    <RefreshCw className="h-4 w-4" /> {t("scanner.retryCamera", { defaultValue: "Retry Camera Access" })}
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                    <Upload className="h-4 w-4" /> {t("scanner.uploadFile", { defaultValue: "Choose File to Inspect" })}
                  </Button>
                </div>
              </div>
            )}

            {/* Device Unsupported Screen */}
            {permissionState === "unsupported" && (
              <div className="text-center p-6 space-y-3 max-w-md z-10">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <AlertTriangle className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{t("scanner.noWebcam", { defaultValue: "No Webcam Detected" })}</h3>
                  <p className="text-xs text-white/70">
                    {t("scanner.noWebcamDesc", { defaultValue: "No hardware camera was detected. You can upload a photo or video recording of the item." })}
                  </p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <Upload className="h-4 w-4" /> {t("scanner.uploadProductMedia", { defaultValue: "Upload Product Media" })}
                </Button>
              </div>
            )}

            {/* Live Video Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                streamActive && !scanning ? "opacity-100" : "opacity-30"
              }`}
            />

            {/* Reticle & Targeting HUD Overlay */}
            {streamActive && !scanning && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                {/* Mode: Barcode & QR Reticle */}
                {activeMode === "barcode" && (
                  <div className="relative w-72 sm:w-96 h-48 border-2 border-emerald-400/80 rounded-2xl shadow-[0_0_20px_rgba(52,211,153,0.3)] flex items-center justify-center overflow-hidden">
                    {/* Corner accents */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400" />

                    {/* Animated scanning laser line */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-[bounce_2s_infinite]" />

                    <div className="text-[11px] font-semibold font-mono tracking-wider text-emerald-300 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-emerald-500/30">
                      GS1 BARCODE / UPC / QR RETICLE
                    </div>
                  </div>
                )}

                {/* Mode: Logo & Tag Inspection */}
                {activeMode === "logo" && (
                  <div className="relative w-56 sm:w-64 h-56 sm:h-64 border-2 border-amber-400/80 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-center">
                    <div className="absolute -top-1 -left-1 w-7 h-7 border-t-4 border-l-4 border-amber-400" />
                    <div className="absolute -top-1 -right-1 w-7 h-7 border-t-4 border-r-4 border-amber-400" />
                    <div className="absolute -bottom-1 -left-1 w-7 h-7 border-b-4 border-l-4 border-amber-400" />
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 border-b-4 border-r-4 border-amber-400" />

                    {/* Crosshair lines */}
                    <div className="w-8 h-0.5 bg-amber-400/60" />
                    <div className="h-8 w-0.5 bg-amber-400/60 absolute" />

                    <div className="absolute bottom-3 text-[11px] font-semibold font-mono tracking-wider text-amber-300 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-amber-500/30">
                      LOGO / EMBROIDERY TARGET
                    </div>
                  </div>
                )}

                {/* Mode: Full Product & Craftsmanship */}
                {activeMode === "full_product" && (
                  <div className="relative w-4/5 sm:w-3/4 h-3/4 border-2 border-dashed border-primary/70 rounded-3xl flex items-center justify-center">
                    <div className="absolute top-4 text-[11px] font-semibold font-mono tracking-wider text-primary bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-primary/30">
                      FULL PRODUCT / SEAMS & MATERIALS
                    </div>
                  </div>
                )}

                {/* Subtitle helper badge */}
                <div className="absolute bottom-4 bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs text-white/90 font-medium shadow-lg flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  {activeMode === "barcode" && "Point at UPC-A, EAN-13, or QR code on retail box / tag"}
                  {activeMode === "logo" && "Center the brand logo, metal badge, or neck tag"}
                  {activeMode === "full_product" && "Fit the entire garment, sneaker, bottle or accessory"}
                </div>
              </div>
            )}

            {/* Detected Barcode Toast Strip */}
            {detectedCode && streamActive && !scanning && (
              <div className="absolute top-4 inset-x-4 flex items-center justify-between bg-emerald-950/90 border border-emerald-500/50 backdrop-blur-md px-4 py-2 rounded-xl text-white shadow-xl z-20 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono tracking-wide">
                      {detectedCode.format.toUpperCase()}: {detectedCode.rawValue}
                    </div>
                    {detectedCode.country && (
                      <div className="text-[10px] text-emerald-300">
                        GS1 Origin: {detectedCode.country}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={captureFromCamera}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-8 px-3"
                >
                  Verify Now <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}

            {/* Top Right Camera Controls (Torch, Flip) */}
            {streamActive && !scanning && (
              <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                {hasTorch && (
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={toggleTorch}
                    className={`h-9 w-9 rounded-xl backdrop-blur-md ${
                      torchOn ? "bg-amber-400 text-black hover:bg-amber-300" : "bg-black/60 text-white hover:bg-black/80"
                    }`}
                    title={torchOn ? "Turn flashlight off" : "Turn flashlight on"}
                  >
                    {torchOn ? <Zap className="h-4 w-4 fill-current" /> : <ZapOff className="h-4 w-4" />}
                  </Button>
                )}

                <Button
                  size="icon"
                  variant="secondary"
                  onClick={flipCamera}
                  className="h-9 w-9 rounded-xl bg-black/60 text-white hover:bg-black/80 backdrop-blur-md"
                  title="Switch Front/Rear Camera"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Analyzing Progress State */}
            {scanning && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Sparkles className="h-8 w-8 text-primary absolute animate-pulse" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="text-base font-bold text-white font-display">
                    Multimodal Forensic Inspection
                  </h4>
                  <p className="text-xs text-white/70 min-h-6">
                    {analyzingStep || "Examining pixels, typography & corporate lineage..."}
                  </p>
                </div>
                <Progress value={65} className="w-48 h-1.5 bg-white/10" />
              </div>
            )}
          </div>
        )}

        {/* Live Camera Bottom Action Controls */}
        {!scanResult && streamActive && !scanning && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 text-xs"
              >
                <Upload className="h-3.5 w-3.5" /> {t("scanner.uploadFile", { defaultValue: "Upload File" })}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowManualBarcode(!showManualBarcode)}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Tag className="h-3.5 w-3.5" /> {t("scanner.enterBarcode", { defaultValue: "Enter Barcode" })}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Big Shutter Button */}
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                onClick={captureFromCamera}
                className="gap-2.5 px-8 font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-xl h-12"
              >
                <Camera className="h-5 w-5" /> {t("scanner.inspectAuthenticity", { defaultValue: "Inspect Authenticity" })}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center sm:text-right">
              {activeMode === "barcode"
                ? `Mode: ${t("scanner.modeBarcode", { defaultValue: "Barcode Checksum" })}`
                : activeMode === "logo"
                ? `Mode: ${t("scanner.modeLogo", { defaultValue: "Luxury Logo Geometry" })}`
                : `Mode: ${t("scanner.modeFullProduct", { defaultValue: "Full Garment & Package Analysis" })}`}
            </div>
          </div>
        )}

        {/* Manual Barcode Input Bar */}
        {!scanResult && !scanning && (showManualBarcode || permissionState === "unsupported" || permissionState === "denied") && (
          <form
            onSubmit={handleManualBarcodeSubmit}
            className="p-3 bg-muted/40 rounded-xl border border-border flex flex-col gap-2 animate-in fade-in"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <div className="relative flex-1 w-full">
                <Tag className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter UPC-A, EAN-13, or serial (e.g. 6001087000140 for Coca-Cola 2L)..."
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!manualBarcode.trim()}
                  className="w-full sm:w-auto text-xs h-8 px-4 font-semibold"
                >
                  {t("scanner.verifyBarcode", { defaultValue: "Verify Barcode" })}
                </Button>
              </div>
            </div>

            {/* Quick barcode shortcuts including Coca-Cola 2L */}
            <div className="w-full flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground/80">Quick test:</span>
              <button
                type="button"
                onClick={() => {
                  setManualBarcode("6001087000140");
                  processImageForAuthenticity("", "image/jpeg", "", null, "6001087000140", "barcode");
                }}
                className="px-2 py-0.5 rounded bg-background hover:bg-muted border border-border text-foreground transition-colors font-mono text-[10px]"
              >
                Coca-Cola 2L (SA: 6001087000140)
              </button>
              <button
                type="button"
                onClick={() => {
                  setManualBarcode("5449000000996");
                  processImageForAuthenticity("", "image/jpeg", "", null, "5449000000996", "barcode");
                }}
                className="px-2 py-0.5 rounded bg-background hover:bg-muted border border-border text-foreground transition-colors font-mono text-[10px]"
              >
                Coca-Cola 2L (Global: 5449000000996)
              </button>
              <button
                type="button"
                onClick={() => {
                  setManualBarcode("049000050103");
                  processImageForAuthenticity("", "image/jpeg", "", null, "049000050103", "barcode");
                }}
                className="px-2 py-0.5 rounded bg-background hover:bg-muted border border-border text-foreground transition-colors font-mono text-[10px]"
              >
                Coca-Cola 2L (US: 049000050103)
              </button>
              <button
                type="button"
                onClick={() => {
                  setManualBarcode("6001087000034");
                  processImageForAuthenticity("", "image/jpeg", "", null, "6001087000034", "barcode");
                }}
                className="px-2 py-0.5 rounded bg-background hover:bg-muted border border-border text-foreground transition-colors font-mono text-[10px]"
              >
                Sprite 2L (SA: 6001087000034)
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* COMPREHENSIVE AUTHENTICITY & ANTI-COUNTERFEIT REPORT      */}
        {/* ========================================================= */}
        {scanResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Top Verdict Hero Card */}
            <div
              className={`p-6 rounded-2xl border ${
                scanResult.counterfeitAssessment?.verdict === "legit" ||
                scanResult.counterfeitAssessment?.verdict === "likely_legit"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                  : scanResult.counterfeitAssessment?.verdict === "suspected_counterfeit" ||
                    scanResult.counterfeitAssessment?.verdict === "high_risk_fake"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-md shrink-0 ${
                      scanResult.counterfeitAssessment?.verdict === "legit" ||
                      scanResult.counterfeitAssessment?.verdict === "likely_legit"
                        ? "bg-emerald-500 text-white"
                        : scanResult.counterfeitAssessment?.verdict === "suspected_counterfeit" ||
                          scanResult.counterfeitAssessment?.verdict === "high_risk_fake"
                        ? "bg-rose-500 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {scanResult.counterfeitAssessment?.verdict === "legit" ||
                    scanResult.counterfeitAssessment?.verdict === "likely_legit" ? (
                      <ShieldCheck className="h-8 w-8" />
                    ) : (
                      <ShieldAlert className="h-8 w-8" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        className={`font-bold uppercase tracking-wider text-xs px-2.5 py-0.5 ${
                          scanResult.counterfeitAssessment?.verdict === "legit" ||
                          scanResult.counterfeitAssessment?.verdict === "likely_legit"
                            ? "bg-emerald-600 text-white hover:bg-emerald-600"
                            : scanResult.counterfeitAssessment?.verdict === "suspected_counterfeit" ||
                              scanResult.counterfeitAssessment?.verdict === "high_risk_fake"
                            ? "bg-rose-600 text-white hover:bg-rose-600"
                            : "bg-amber-600 text-white hover:bg-amber-600"
                        }`}
                      >
                        {scanResult.counterfeitAssessment?.badgeLabel ||
                          scanResult.counterfeitAssessment?.verdict?.replace("_", " ") ||
                          scanResult.authenticity.badgeLabel}
                      </Badge>
                      <span className="text-xs opacity-75 font-mono">
                        Confidence: {scanResult.counterfeitAssessment?.confidence?.toUpperCase() || "HIGH"}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight">
                      {scanResult.brandInfo.brandName}{" "}
                      <span className="text-sm sm:text-base font-normal opacity-85">
                        {scanResult.brandInfo.productName || ""}
                      </span>
                    </h3>

                    <div className="flex items-center gap-2 text-xs opacity-90">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>
                        Corporate Parent: <strong>{scanResult.brandInfo.brandOwner}</strong> (
                        {scanResult.brandInfo.countryOfOrigin})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Meters */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-border/20 gap-1 min-w-[140px]">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase font-mono tracking-wider opacity-75">
                      Legitimacy Score
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-display">
                      {scanResult.counterfeitAssessment?.authenticityScore ?? scanResult.authenticity.score}%
                    </div>
                  </div>
                  {scanResult.counterfeitAssessment?.counterfeitRiskScore !== undefined && (
                    <div className="text-xs font-medium opacity-85">
                      Replica Risk: {scanResult.counterfeitAssessment.counterfeitRiskScore}%
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Tabs for Forensic Details */}
            <div className="flex border-b border-border overflow-x-auto">
              <button
                onClick={() => setResultTab("authenticity")}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  resultTab === "authenticity"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <ShieldCheck className="h-4 w-4" /> Anti-Counterfeit Audit
              </button>
              <button
                onClick={() => setResultTab("guide")}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  resultTab === "guide"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <HelpCircle className="h-4 w-4" /> Client Verification Guide
              </button>
              <button
                onClick={() => setResultTab("brand")}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  resultTab === "brand"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building2 className="h-4 w-4" /> Brand Lineage & Protection
              </button>
              <button
                onClick={() => setResultTab("forensics")}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  resultTab === "forensics"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="h-4 w-4" /> Media Forensics & Tamper Check
              </button>
              <button
                onClick={() => setResultTab("pr_dossier")}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  resultTab === "pr_dossier"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Printer className="h-4 w-4" /> Brand PR & Client Dossier
              </button>
            </div>

            {/* Tab 1: Anti-Counterfeit Audit */}
            {resultTab === "authenticity" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Logo Inspection */}
                  <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1.5">
                    <div className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                      <Tag className="h-3.5 w-3.5 text-primary" /> Logo & Typography Check
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {scanResult.counterfeitAssessment?.logoInspection ||
                        "Typography kerning, debossing depth, and font geometric alignment verified."}
                    </p>
                  </div>

                  {/* Barcode & Tag Check */}
                  <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1.5">
                    <div className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                      <QrCode className="h-3.5 w-3.5 text-primary" /> Barcode & GS1 Registry
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {scanResult.counterfeitAssessment?.barcodeAndTagsInspection ||
                        scanResult.brandInfo.qrOrBarcodeDecoded ||
                        "Standard GS1 GTIN/UPC formatting verified against international brand registries."}
                    </p>
                  </div>

                  {/* Craftsmanship & Seams */}
                  <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1.5">
                    <div className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Craftsmanship & Hardware
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {scanResult.counterfeitAssessment?.materialAndCraftsmanship ||
                        "Consistent stitch density, metallic hardware engravings, and material grain inspected."}
                    </p>
                  </div>
                </div>

                {/* Key Differences / Fake Traps */}
                {scanResult.counterfeitAssessment?.keyDifferencesToLookFor &&
                  scanResult.counterfeitAssessment.keyDifferencesToLookFor.length > 0 && (
                    <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Key Authentic vs. Replica
                        Indicators
                      </h4>
                      <ul className="space-y-1 text-xs text-foreground/90">
                        {scanResult.counterfeitAssessment.keyDifferencesToLookFor.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Captured Snapshot preview */}
                {capturedImage && (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/10 text-xs">
                    <img
                      src={capturedImage}
                      alt="Captured verification source"
                      className="h-14 w-14 rounded-lg object-cover border border-border"
                    />
                    <div className="space-y-0.5">
                      <div className="font-semibold">Analyzed Visual Evidence</div>
                      <div className="text-muted-foreground">
                        Forensic pixel integrity score: {scanResult.authenticity.score}% • Status:{" "}
                        {scanResult.authenticity.verdictStatus}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Client Verification Guide */}
            {resultTab === "guide" && (
              <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary" /> How Clients & Buyers Can Verify This
                    Product
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Actionable instructions tailored to {scanResult.brandInfo.brandName} to confirm genuine
                    ownership and protect against counterfeit market circulation.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {scanResult.counterfeitAssessment?.clientVerificationGuide?.map((guideStep, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-border/80 bg-muted/20 flex items-start gap-3 text-xs"
                    >
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </div>
                      <div className="leading-relaxed text-foreground pt-0.5">{guideStep}</div>
                    </div>
                  )) || (
                    <p className="text-xs text-muted-foreground">
                      Always check the serial number on the brand's official customer portal, verify receipt of
                      purchase from authorized stockists, and look for internal micro-embossed security tags.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Brand Lineage & Protection */}
            {resultTab === "brand" && (
              <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> Corporate Ownership & Distribution
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {scanResult.brandInfo.parentCompanyContext ||
                      `${scanResult.brandInfo.brandName} is operated and owned by ${scanResult.brandInfo.brandOwner}.`}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">Brand Category & Tier:</span>
                    <div className="font-semibold">
                      {scanResult.brandInfo.category} • {scanResult.brandInfo.marketTier}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">Authorized Channels:</span>
                    <div className="font-semibold">
                      {scanResult.counterfeitAssessment?.brandProtectionTracking?.authorizedChannels ||
                        "Official Brand Stores & Certified Retailers"}
                    </div>
                  </div>
                </div>

                {matchedBrand && (
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-foreground">
                        {matchedBrand.name} in Stash Or Trash
                      </div>
                      <div className="text-muted-foreground">
                        Overall Verdict: {matchedBrand.verdict} • Rating: {matchedBrand.averageScore}/10
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (window.location.href = `/brands/${matchedBrand.slug}`)}
                      className="gap-1 text-xs"
                    >
                      View Brand Page <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Media Forensics & Tamper Check */}
            {resultTab === "forensics" && (
              <div className="p-5 rounded-2xl border border-border bg-card space-y-4 animate-in fade-in">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> Visual Media Integrity & Deepfake Shield
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Pixel-level forensic audit of the uploaded media to verify genuine camera optics versus AI synthesis, digital splicing, or Photoshop alteration.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-primary" /> Lighting Vectors & Specular Consistency
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {scanResult.authenticity.forensics.physicalLighting ||
                        "Natural shadow falloff and specular highlights consistent with real physical camera capture."}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" /> Sensor Noise & Compression Artifacts
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {scanResult.authenticity.forensics.textureAndNoise ||
                        "Organic CMOS Bayer sensor noise detected; zero generative diffusion or neural upscaling marks."}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-primary" /> Micro-Typography & Edge Integrity
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {scanResult.authenticity.forensics.textIntegrity ||
                        "Printed text adheres to vector standards without hallucinated or distorted glyphs."}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> AI Generation (GAN/Diffusion) Check
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {scanResult.authenticity.forensics.aiGenerationMarkers ||
                        "No Midjourney, Stable Diffusion, DALL-E, or Sora generative signatures found."}
                    </p>
                  </div>
                </div>

                {scanResult.authenticity.reasons && scanResult.authenticity.reasons.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-border/80 bg-background space-y-1.5 text-xs">
                    <div className="font-bold text-foreground">Forensic Confirmation Factors:</div>
                    <ul className="space-y-1 text-muted-foreground">
                      {scanResult.authenticity.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Brand PR & Client Dossier */}
            {resultTab === "pr_dossier" && (
              <div className="p-5 rounded-2xl border border-border bg-card space-y-4 animate-in fade-in">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Printer className="h-4 w-4 text-primary" /> Official Brand PR & Client Verification Dossier
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Ready-to-share audit documentation for Brand Public Relations Officers, Client Verification teams, and Legal Brand Protection.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/20 pb-3">
                    <div>
                      <div className="text-sm font-black font-display text-foreground">
                        {scanResult.brandInfo.brandName} • Official Audit Dossier
                      </div>
                      <div className="text-muted-foreground">
                        Parent Company: {scanResult.brandInfo.brandOwner} ({scanResult.brandInfo.countryOfOrigin})
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={handlePrintCertificate}
                      className="gap-1.5 text-xs bg-primary text-primary-foreground font-semibold"
                    >
                      <Printer className="h-3.5 w-3.5" /> Print / Export Audit PDF
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-lg bg-background border border-border">
                      <div className="text-[10px] text-muted-foreground uppercase font-mono">Authenticity Verdict</div>
                      <div className="font-bold text-foreground text-sm">
                        {scanResult.counterfeitAssessment?.badgeLabel || "Verified Authentic"}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-background border border-border">
                      <div className="text-[10px] text-muted-foreground uppercase font-mono">Legitimacy Score</div>
                      <div className="font-bold text-emerald-600 text-sm">
                        {scanResult.counterfeitAssessment?.authenticityScore ?? scanResult.authenticity.score}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-background border border-border">
                      <div className="text-[10px] text-muted-foreground uppercase font-mono">Media Forensic Integrity</div>
                      <div className="font-bold text-primary text-sm">
                        {scanResult.authenticity.score}% Verified
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-muted-foreground pt-1">
                    <p>
                      <strong>Authorized Channels:</strong>{" "}
                      {scanResult.counterfeitAssessment?.brandProtectionTracking?.authorizedChannels ||
                        "Authorized retailers and certified distribution networks."}
                    </p>
                    <p>
                      <strong>Brand PR Advisory:</strong>{" "}
                      {scanResult.counterfeitAssessment?.brandProtectionTracking?.advice ||
                        `Client verification confirmed in favor of ${scanResult.brandInfo.brandOwner}.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border">
              <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto gap-2 text-xs">
                <RefreshCw className="h-3.5 w-3.5" /> {t("scanner.scanAnother", { defaultValue: "Scan Another Product" })}
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <Button
                  variant="outline"
                  onClick={handlePrintCertificate}
                  className="flex-1 sm:flex-none gap-2 text-xs font-medium"
                  title={t("scanner.printCertTitle", { defaultValue: "Print Brand PR & Client Verification Certificate" })}
                >
                  <Printer className="h-3.5 w-3.5 text-primary" /> {t("scanner.printCert", { defaultValue: "Print PR Audit Certificate" })}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyReport}
                  className="flex-1 sm:flex-none gap-2 text-xs"
                >
                  <Copy className="h-3.5 w-3.5" /> {t("scanner.copyCert", { defaultValue: "Copy Certificate" })}
                </Button>
                {onApplyToPost && (
                  <Button
                    onClick={handleApplyPost}
                    className="flex-1 sm:flex-none gap-2 text-xs font-semibold shadow-md"
                  >
                    <FileCheck className="h-3.5 w-3.5" /> {t("scanner.postToBarometer", { defaultValue: "Post to Brand Barometer" })}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
