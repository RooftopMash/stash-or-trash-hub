import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { createItem } from "@/lib/stash";
import { BrandSearch } from "@/components/BrandSearch";
import { ProductScannerModal } from "@/components/ProductScannerModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ImagePlus,
  Scan,
  Sparkles,
  Building2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";
import coinIcon from "@/assets/icon-coin.png";
import binIcon from "@/assets/icon-bin.png";
import { cn } from "@/lib/utils";
import { playStashSound, playTrashSound } from "@/lib/verdict-sounds";
import type { Verdict } from "@/lib/stash";
import type { AiScanResult } from "@/lib/ai-scanner";
import { toast } from "sonner";

const NO_BRAND = "__none__";
const FEEDBACK_TYPES = ["Concern", "Compliment", "Idea", "Question"] as const;

export interface SubmitDialogProps {
  onPosted?: () => void;
  defaultBrandId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialValues?: {
    title?: string;
    description?: string;
    category?: string;
    file?: File | null;
    aiScanResult?: AiScanResult | null;
  };
}

export function SubmitDialog({
  onPosted,
  defaultBrandId,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  initialValues,
}: SubmitDialogProps) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? (setControlledOpen ?? (() => {})) : setUncontrolledOpen;

  const [scannerOpen, setScannerOpen] = useState(false);
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [brandId, setBrandId] = useState<string>(defaultBrandId ?? NO_BRAND);
  const [file, setFile] = useState<File | null>(initialValues?.file ?? null);
  const [aiScanResult, setAiScanResult] = useState<AiScanResult | null>(
    initialValues?.aiScanResult ?? null
  );
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValues) {
      if (initialValues.title !== undefined) setTitle(initialValues.title);
      if (initialValues.description !== undefined) setDescription(initialValues.description);
      if (initialValues.category !== undefined) setCategory(initialValues.category);
      if (initialValues.file !== undefined) setFile(initialValues.file);
      if (initialValues.aiScanResult !== undefined) setAiScanResult(initialValues.aiScanResult);
    }
  }, [initialValues]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setBrandId(defaultBrandId ?? NO_BRAND);
    setFile(null);
    setAiScanResult(null);
    setVerdict(null);
  };

  const handleScannerApply = (data: {
    brandName: string;
    brandOwner: string;
    productName: string;
    category: string;
    matchedBrandId?: string;
    file?: File | null;
    scanResult: AiScanResult;
  }) => {
    if (data.matchedBrandId) {
      setBrandId(data.matchedBrandId);
    }
    setTitle(
      data.productName
        ? `${data.brandName} — ${data.productName}`
        : `${data.brandName} Experience`
    );
    setDescription(
      `Product: ${data.productName || data.brandName}\nCorporate Owner: ${data.brandOwner}\n${data.scanResult.brandInfo.parentCompanyContext}\n[Forensic Authenticity Score: ${data.scanResult.authenticity.score}% - ${data.scanResult.authenticity.badgeLabel}]`
    );
    if (data.category) {
      setCategory(data.category);
    }
    if (data.file) {
      setFile(data.file);
    }
    setAiScanResult(data.scanResult);
    toast.success(
      `Auto-filled: ${data.brandName} (Corporate Owner: ${data.brandOwner})`
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!title.trim()) {
      toast.error(t("submit.needTitle"));
      return;
    }
    if (!verdict) {
      toast.error(t("submit.needVerdict"));
      return;
    }
    setSubmitting(true);
    try {
      await createItem({
        userId: user.id,
        title,
        description,
        file,
        brandId: brandId === NO_BRAND ? null : brandId,
        category,
        verdict,
        aiScanResult,
      });
      toast.success(t("submit.posted"));
      reset();
      setOpen(false);
      onPosted?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("submit.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {!isControlled && (
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 font-semibold">
              <Plus className="h-4 w-4" /> {t("submit.trigger")}
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{t("submit.title")}</DialogTitle>
            <DialogDescription>{t("submit.intro")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* FAST AI SCANNER TRIGGER */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-xs text-primary">
                  <Scan className="h-3.5 w-3.5" /> Auto-Identify Brand & Owner
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Scan the product packaging, QR code, or barcode. AI detects the parent company and verifies authenticity.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => setScannerOpen(true)}
                className="gap-1.5 text-xs font-semibold shrink-0 shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" /> Scan Product / QR
              </Button>
            </div>

            {/* AI VERIFICATION & CORPORATE OWNER DOSSIER CHIP */}
            {aiScanResult && (
              <div className="rounded-xl border border-border bg-card p-3 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> AI Verified Brand & Evidence
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => setAiScanResult(null)}
                    title="Remove AI metadata"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-muted/40 border border-border/50">
                    <p className="font-semibold text-foreground flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-amber-600" /> Corporate Owner:
                    </p>
                    <p className="text-[11px] font-bold text-foreground mt-0.5">
                      {aiScanResult.brandInfo.brandOwner}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                      {aiScanResult.brandInfo.parentCompanyContext}
                    </p>
                  </div>

                  <div className="p-2 rounded bg-muted/40 border border-border/50">
                    <p className="font-semibold text-foreground flex items-center gap-1">
                      {aiScanResult.authenticity.isLegitimate ? (
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                      )}
                      Evidence Legitimacy:
                    </p>
                    <p className="text-[11px] font-bold text-foreground mt-0.5">
                      {aiScanResult.authenticity.score}% Authentic
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                      {aiScanResult.authenticity.badgeLabel}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">{t("submit.fieldTitle")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("submit.titlePh")}
                maxLength={120}
              />
            </div>

            {!defaultBrandId && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t("submit.brand")}</Label>
                  <span className="text-[10px] text-muted-foreground">
                    Auto-filled if scanned
                  </span>
                </div>
                <BrandSearch
                  onSelectBrand={(b) => setBrandId(b.id)}
                  selectedId={brandId === NO_BRAND ? undefined : brandId}
                  placeholder={t("submit.brandPh")}
                />
                {brandId !== NO_BRAND && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setBrandId(NO_BRAND)}
                  >
                    {t("submit.noBrand")}
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>{t("submit.verdict")}</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="stash"
                  size="lg"
                  onClick={() => {
                    playStashSound();
                    setVerdict("stash");
                  }}
                  className={cn(
                    "gap-2",
                    verdict === "stash" && "verdict-picked",
                    verdict === "trash" && "verdict-dimmed",
                  )}
                >
                  <img src={coinIcon} alt="" aria-hidden className="verdict-icon" /> {t("vote.stash")}
                </Button>
                <Button
                  type="button"
                  variant="trash"
                  size="lg"
                  onClick={() => {
                    playTrashSound();
                    setVerdict("trash");
                  }}
                  className={cn(
                    "gap-2",
                    verdict === "trash" && "verdict-picked",
                    verdict === "stash" && "verdict-dimmed",
                  )}
                >
                  <img src={binIcon} alt="" aria-hidden className="verdict-icon" /> {t("vote.trash")}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">What kind of feedback is this?</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {FEEDBACK_TYPES.map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={category === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Add a more specific topic, if useful"
                maxLength={40}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">{t("submit.description")}</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("submit.descriptionPh")}
                rows={3}
                maxLength={600}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file" className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4" /> {t("submit.photo")} / Video Evidence
                </span>
                <span className="text-[10px] text-muted-foreground">
                  AI scans pictures or video frames
                </span>
              </Label>
              <Input
                id="file"
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Attached: {file.name}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit} disabled={submitting} className="w-full">
              {submitting ? t("submit.posting") : t("submit.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Embedded Scanner Modal */}
      <ProductScannerModal
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onApplyToPost={handleScannerApply}
      />
    </>
  );
}
