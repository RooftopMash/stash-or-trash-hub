import { cn } from "@/lib/utils";

/**
 * The SOT brand wordmark. The capitals S · O · T are always emphasised so the
 * eye reads the acronym "SOT" out of "Stash Or Trash" — building instant brand
 * recall. Never render these letters in lowercase.
 */
export function SotWordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "lg" ? "text-lg" : size === "sm" ? "text-sm" : "text-base";

  return (
    <span
      translate="no"
      aria-label="Stash Or Trash"
      data-sot-brand="wordmark"
      className={cn(
        "notranslate inline-flex items-baseline whitespace-nowrap font-display font-extrabold tracking-tight text-foreground",
        sizeClass,
        className,
      )}
    >
      <span translate="no" className="notranslate text-stash">S</span>
      <span translate="no" className="notranslate">tash&nbsp;</span>
      <span translate="no" className="notranslate text-foreground">O</span>
      <span translate="no" className="notranslate">r&nbsp;</span>
      <span translate="no" className="notranslate text-trash">T</span>
      <span translate="no" className="notranslate">rash</span>
    </span>
  );
}
