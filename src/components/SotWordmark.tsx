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
      aria-label="Stash Or Trash"
      className={cn(
        "inline-flex items-baseline whitespace-nowrap font-display font-extrabold tracking-tight text-foreground",
        sizeClass,
        className,
      )}
    >
      <span className="text-stash">S</span>
      <span>tash&nbsp;</span>
      <span className="text-foreground">O</span>
      <span>r&nbsp;</span>
      <span className="text-trash">T</span>
      <span>rash</span>
    </span>
  );
}
