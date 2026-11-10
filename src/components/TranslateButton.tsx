import { useState } from "react";
import { Languages, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translateReviewText, type TranslationResult } from "@/lib/ai-services";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function TranslateButton({
  text,
  targetLang = "en",
  onTranslated,
  className,
}: {
  text: string;
  targetLang?: string;
  onTranslated?: (translated: string) => void;
  className?: string;
}) {
  const [translating, setTranslating] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [showingTranslated, setShowingTranslated] = useState(false);

  const handleTranslate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (result) {
      setShowingTranslated(!showingTranslated);
      return;
    }

    setTranslating(true);
    try {
      const data = await translateReviewText(text, targetLang);
      setResult(data);
      setShowingTranslated(true);
      onTranslated?.(data.translatedText);
    } catch {
      toast.error("Could not complete translation. Please try again.");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className={cn("inline-flex flex-col gap-1.5", className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={translating}
        onClick={handleTranslate}
        className="h-6 gap-1 px-1.5 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors"
      >
        {translating ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            <span>Translating...</span>
          </>
        ) : showingTranslated ? (
          <>
            <RotateCcw className="h-3 w-3 text-primary" />
            <span>Show Original</span>
          </>
        ) : (
          <>
            <Languages className="h-3 w-3 text-primary" />
            <span>Translate</span>
          </>
        )}
      </Button>

      {showingTranslated && result && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-xs">
          <div className="flex items-center justify-between text-[10px] font-bold text-primary mb-1">
            <span>Translated from {result.detectedSourceLang}</span>
            <span className="uppercase">{result.targetLang}</span>
          </div>
          <p className="text-foreground leading-relaxed">{result.translatedText}</p>
        </div>
      )}
    </div>
  );
}
