import { useState } from "react";
import { Sparkles, Loader2, Check, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateBrandAutoReply, type BrandReplyDraft } from "@/lib/ai-services";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function BrandAutoResponder({
  brandName,
  customerReview,
  verdict = "trash",
  onApplyDraft,
  className,
}: {
  brandName: string;
  customerReview: string;
  verdict?: "stash" | "trash";
  onApplyDraft: (draft: string) => void;
  className?: string;
}) {
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState<BrandReplyDraft | null>(null);

  const handleGenerate = async () => {
    if (!customerReview.trim()) {
      toast.info("No customer review text available to draft response for.");
      return;
    }

    setGenerating(true);
    try {
      const data = await generateBrandAutoReply(brandName, customerReview, verdict);
      setDraft(data);
      toast.success("Executive brand response generated!");
    } catch {
      toast.error("Could not generate brand response. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={generating || !customerReview.trim()}
        onClick={handleGenerate}
        className="gap-1.5 border-primary/30 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
      >
        {generating ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>AI Drafting Resolution...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Smart Executive Auto-Reply</span>
          </>
        )}
      </Button>

      {draft && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 text-xs space-y-2.5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-primary">
            <span className="flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider">
              <HeartHandshake className="h-3.5 w-3.5" /> De-escalation & Resolution Draft
            </span>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onApplyDraft(draft.fullDraft);
                toast.success("Draft inserted into reply box!");
              }}
              className="h-6 px-2 text-[11px] font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Check className="h-3 w-3" /> Insert into Reply
            </Button>
          </div>

          <div className="rounded-lg bg-card p-3 border border-border/80 text-foreground font-sans text-xs leading-relaxed">
            <p className="font-medium text-foreground">{draft.fullDraft}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground pt-1">
            <p><strong>Action:</strong> {draft.correctiveAction}</p>
            <p><strong>Escalation:</strong> {draft.escalationChannel}</p>
          </div>
        </div>
      )}
    </div>
  );
}
