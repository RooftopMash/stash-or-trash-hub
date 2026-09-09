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
  const cap =
    size === "lg" ? "text-[1.15em]" : size === "sm" ? "text-[1.08em]" : "text-[1.1em]";

  return (
    <span suppressHydrationWarning className={cn("font-display font-extrabold tracking-tight", className)}>
      <span className={cn(cap, "text-stash")}>S</span><span>tash</span><span className={cn("ml-1", cap, "text-foreground")}>O</span><span>r</span><span className={cn("ml-1", cap, "text-trash")}>T</span><span>rash</span>
    </span>
  );
}
