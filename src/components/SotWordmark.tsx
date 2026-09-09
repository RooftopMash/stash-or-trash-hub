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
    <span className={cn("font-display font-extrabold tracking-tight", className)}>
      <span className={cn(cap, "text-stash")}>S</span>tash{" "}
      <span className={cn(cap, "text-foreground")}>O</span>r{" "}
      <span className={cn(cap, "text-trash")}>T</span>rash
    </span>
  );
}
