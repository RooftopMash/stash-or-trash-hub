import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * The SOT brand wordmark. Its identity comes from the canonical brand section
 * of appTranslations and is deliberately invariant across UI locales.
 */
export function SotWordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const { brand } = useTranslation();
  const sizeClass = size === "lg" ? "text-lg" : size === "sm" ? "text-sm" : "text-base";

  return (
    <span
      translate="no"
      aria-label={brand.logoLabel}
      className={cn(
        "notranslate inline-flex items-baseline whitespace-nowrap font-display font-extrabold tracking-tight text-foreground",
        sizeClass,
        className,
      )}
    >
      <span translate="no" className="notranslate text-stash">{brand.stash.charAt(0)}</span>
      <span translate="no" className="notranslate">{brand.stash.slice(1)}&nbsp;</span>
      <span translate="no" className="notranslate text-foreground">{brand.conjunction.charAt(0)}</span>
      <span translate="no" className="notranslate">{brand.conjunction.slice(1)}&nbsp;</span>
      <span translate="no" className="notranslate text-trash">{brand.trash.charAt(0)}</span>
      <span translate="no" className="notranslate">{brand.trash.slice(1)}</span>
    </span>
  );
}
