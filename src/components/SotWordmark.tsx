import { cn } from "@/lib/utils";

/**
 * The SOrT wordmark makes the product promise visible: people sort what to
 * stash and what to trash. The capital S, O and T preserve the brand signal.
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
      <span className={cn(cap, "text-stash")}>S</span>
      <span className={cn(cap, "text-foreground")}>O</span>
      <span className={cn(cap, "text-trash")}>rT</span>
    </span>
  );
}
