import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Building2,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import coinIcon from "@/assets/icon-coin.png";
import binIcon from "@/assets/icon-bin.png";
import { playStashSound, playTrashSound } from "@/lib/verdict-sounds";
import { useAuth } from "@/hooks/useAuth";
import { createItem } from "@/lib/stash";
import { toast } from "sonner";
import type { AiScanResult } from "@/lib/ai-scanner";
import type { Brand } from "@/lib/brands";

interface QuickRateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  brandOwner: string;
  productName: string;
  category: string;
  matchedBrand?: Brand | null;
  scanResult?: AiScanResult | null;
  file?: File | null;
  onRated?: () => void;
}

export function QuickRateModal({
  open,
  onOpenChange,
  brandName,
  brandOwner,
  productName,
  category,
  matchedBrand,
  scanResult,
  file,
  onRated,
}: QuickRateModalProps) {
  const { user } = useAuth();
  const [verdict, setVerdict] = useState<"stash" | "trash" | null>("stash");
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Criteria mini ratings
  const [qualityScore, setQualityScore] = useState(5);
  const [valueScore, setValueScore] = useState(4);
  const [ethicsScore, setEthicsScore] = useState(4);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to submit your verified rating.");
      return;
    }
    if (!verdict) {
      toast.error("Select whether you would Stash or Trash this product.");
      return;
    }

    setSubmitting(true);
    try {
      const title = `${verdict === "stash" ? "★ Stash:" : "✕ Trash:"} ${brandName} ${productName || ""}`.trim();
      const detailedReview = [
        comment.trim() || `Verified customer rating: ${stars}/5 Stars.`,
        `[CX Matrix: Quality ${qualityScore}/5 | Value ${valueScore}/5 | Corporate Ethics ${ethicsScore}/5]`,
        `Corporate Brand Owner: ${brandOwner}`,
        scanResult?.brandInfo.parentCompanyContext,
        scanResult ? `[Forensic Authenticity: ${scanResult.authenticity.score}% - ${scanResult.authenticity.badgeLabel}]` : null,
      ]
        .filter(Boolean)
        .join("\n");

      await createItem({
        userId: user.id,
        title,
        description: detailedReview,
        brandId: matchedBrand?.id || null,
        category: category || "Consumer Products",
        verdict,
        file: file || null,
        aiScanResult: scanResult || null,
      });

      toast.success(
        `Rating submitted! You ${verdict === "stash" ? "Stashed" : "Trashed"} ${brandName} (Owner: ${brandOwner})`
      );
      onOpenChange(false);
      onRated?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-display">
                Rate & Review Scanned Product
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submit an instant community rating attached to the corporate owner.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Target Identity info */}
          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-foreground">
              <span>{brandName} {productName && `— ${productName}`}</span>
              <Badge variant="secondary" className="text-[10px]">
                {category || "General"}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <Building2 className="h-3.5 w-3.5" />
              <span>Parent Company: <strong>{brandOwner}</strong></span>
            </div>
            {scanResult && (
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 pt-0.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Legitimacy Verified: {scanResult.authenticity.score}% score</span>
              </div>
            )}
          </div>

          {/* Stash vs Trash Quick Choice */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Your Overall Stash or Trash Verdict</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="stash"
                size="lg"
                onClick={() => {
                  playStashSound();
                  setVerdict("stash");
                }}
                className={`gap-2 font-bold ${verdict === "stash" ? "ring-2 ring-emerald-500 scale-[1.02]" : "opacity-60"}`}
              >
                <img src={coinIcon} alt="" className="h-5 w-5" /> Stash (Keep & Buy)
              </Button>
              <Button
                type="button"
                variant="trash"
                size="lg"
                onClick={() => {
                  playTrashSound();
                  setVerdict("trash");
                }}
                className={`gap-2 font-bold ${verdict === "trash" ? "ring-2 ring-rose-500 scale-[1.02]" : "opacity-60"}`}
              >
                <img src={binIcon} alt="" className="h-5 w-5" /> Trash (Boycott / Avoid)
              </Button>
            </div>
          </div>

          {/* 5-Star Rating Selector */}
          <div className="space-y-1.5 text-center py-1">
            <Label className="text-xs text-muted-foreground">Star Score</Label>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStars(s)}
                  className="p-1 text-amber-500 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`h-7 w-7 ${
                      s <= stars ? "fill-amber-400 text-amber-500" : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Mini Matrix Criteria */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-background border border-border/60">
              <p className="text-[10px] text-muted-foreground font-medium">Quality</p>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <span
                    key={val}
                    onClick={() => setQualityScore(val)}
                    className={`cursor-pointer px-1 text-[10px] font-bold rounded ${
                      qualityScore >= val ? "text-amber-500" : "text-muted-foreground/30"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2 rounded bg-background border border-border/60">
              <p className="text-[10px] text-muted-foreground font-medium">Price/Value</p>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <span
                    key={val}
                    onClick={() => setValueScore(val)}
                    className={`cursor-pointer px-1 text-[10px] font-bold rounded ${
                      valueScore >= val ? "text-amber-500" : "text-muted-foreground/30"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2 rounded bg-background border border-border/60">
              <p className="text-[10px] text-muted-foreground font-medium">Corp Ethics</p>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <span
                    key={val}
                    onClick={() => setEthicsScore(val)}
                    className={`cursor-pointer px-1 text-[10px] font-bold rounded ${
                      ethicsScore >= val ? "text-amber-500" : "text-muted-foreground/30"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <Label htmlFor="rate-comment" className="text-xs">Your Quick Review (Optional)</Label>
            <Textarea
              id="rate-comment"
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Why did you give this rating? Share with fellow shoppers..."
              className="text-xs"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-1.5 font-bold"
          >
            <CheckCircle2 className="h-4 w-4" /> {submitting ? "Submitting..." : "Post Verified Rating"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
