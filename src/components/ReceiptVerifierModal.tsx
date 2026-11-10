import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  Upload,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { authenticateReceipt, type ReceiptVerificationData } from "@/lib/ai-services";

export function ReceiptVerifierModal({
  open,
  onOpenChange,
  targetBrand,
  onVerified,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetBrand?: string;
  onVerified: (data: ReceiptVerificationData) => void;
}) {
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<ReceiptVerificationData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file of your receipt or invoice.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setPreview(b64);
      void runAnalysis(b64);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async (base64Image: string) => {
    setAnalyzing(true);
    setVerificationResult(null);
    try {
      const data = await authenticateReceipt(base64Image, targetBrand);
      setVerificationResult(data);
      if (data.status === "VERIFIED_PURCHASE" || data.status === "LIKELY_VALID") {
        toast.success(`Verified: ${data.storeName || targetBrand || "Receipt"} proof accepted!`);
      } else {
        toast.warning(data.notes || "Receipt could not be fully verified.");
      }
    } catch {
      toast.error("Could not complete receipt verification. Please ensure the receipt is legible.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (verificationResult) {
      onVerified(verificationResult);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-border bg-card p-6 shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Receipt className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-wider">
              AI Proof Authenticator
            </span>
          </div>
          <DialogTitle className="mt-1 text-xl font-black">
            Upload Purchase Proof
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Attach a photo of your receipt, till slip, order confirmation, or warranty card to earn the certified <strong className="text-foreground">"Verified Purchase"</strong> badge on your verdict.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-secondary/30 p-8 text-center cursor-pointer hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-all"
            >
              <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400 mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold">Upload or Take Photo of Receipt</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Supports JPG, PNG, WEBP (Till slips, store invoices, e-commerce order receipts)
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary" className="gap-1.5 text-xs pointer-events-none">
                  <Camera className="h-3.5 w-3.5" /> Snap Photo
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs pointer-events-none">
                  <Upload className="h-3.5 w-3.5" /> Select File
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black/5">
                <img src={preview} alt="Receipt preview" className="h-full w-full object-contain" />
                {analyzing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white backdrop-blur-xs">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mb-2" />
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      AI OCR Forensic Analysis...
                    </p>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Extracting merchant, date, and line item proof
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-semibold text-primary hover:underline"
                >
                  Change picture
                </button>
              </div>
            </div>
          )}

          {verificationResult && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{verificationResult.status === "VERIFIED_PURCHASE" ? "Verified Purchase Match" : "Proof Scanned"}</span>
                </div>
                <span className="text-[10px] font-black uppercase rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-700 dark:text-emerald-300">
                  {verificationResult.authenticityScore}% Trust
                </span>
              </div>

              <div className="text-xs space-y-1 pt-1 text-slate-700 dark:text-slate-300">
                <p><strong>Merchant:</strong> {verificationResult.storeName || targetBrand || "Retail Store"}</p>
                {verificationResult.totalAmount && <p><strong>Total:</strong> {verificationResult.totalAmount}</p>}
                {verificationResult.purchaseDate && <p><strong>Date:</strong> {verificationResult.purchaseDate}</p>}
              </div>

              <p className="text-[11px] text-muted-foreground pt-1 border-t border-emerald-500/20">
                {verificationResult.notes}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!verificationResult || analyzing}
              onClick={handleApply}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" /> Attach Verified Proof
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
