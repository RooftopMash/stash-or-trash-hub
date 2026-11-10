import { useState, useEffect, useRef } from "react";
import { ShieldCheck, AlertTriangle, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { screenContentSafety, type ContentScreeningResult } from "@/lib/ai-services";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PrePublicationShieldProps {
  title?: string;
  description?: string;
  content?: string;
  onScreenResult?: (result: ContentScreeningResult) => void;
  onSafetyEvaluated?: (result: ContentScreeningResult) => void;
  className?: string;
}

export function PrePublicationShield({
  title = "",
  description = "",
  content,
  onScreenResult,
  onSafetyEvaluated,
  className,
}: PrePublicationShieldProps) {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<ContentScreeningResult | null>(null);

  const callbackRef = useRef(onScreenResult || onSafetyEvaluated);
  useEffect(() => {
    callbackRef.current = onScreenResult || onSafetyEvaluated;
  }, [onScreenResult, onSafetyEvaluated]);

  const rawText = (content !== undefined ? content : `${title} ${description}`).trim();

  useEffect(() => {
    if (!rawText || rawText.length < 10) {
      setResult(null);
      return;
    }

    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await screenContentSafety(rawText);
        setResult(res);
        callbackRef.current?.(res);
      } catch {
        // Silent fallback
      } finally {
        setChecking(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [rawText]);

  if (!result && !checking) {
    return (
      <div className={cn("flex items-center gap-1.5 text-[11px] text-muted-foreground", className)}>
        <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/80" />
        <span>SOT Legal Shield: Pre-publication defamation and privacy screening enabled</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5 text-xs", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {checking ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          ) : result?.isApproved ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          )}

          <span className="font-bold text-[11px] uppercase tracking-wider">
            {checking
              ? "Screening Content..."
              : result?.isApproved
              ? "SOT Shield: Compliant & Verified"
              : "SOT Shield: Review Suggested"}
          </span>
        </div>

        {result && (
          <Badge
            variant={result.isApproved ? "outline" : "destructive"}
            className={cn(
              "text-[10px] font-black h-5",
              result.isApproved
                ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                : "border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-500/10"
            )}
          >
            {result.safetyScore}% Safety Score
          </Badge>
        )}
      </div>

      {result && !result.isApproved && result.constructiveTip && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11px] text-amber-800 dark:text-amber-200">
          <p className="font-semibold">{result.reason}</p>
          <p className="mt-1 opacity-90">{result.constructiveTip}</p>
        </div>
      )}
    </div>
  );
}
