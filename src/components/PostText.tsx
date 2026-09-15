import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Renders post text with #hashtags linked to their tag page and @mentions
 * highlighted.
 */
export function PostText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(#[A-Za-z0-9_]{2,40}|@[A-Za-z0-9_.]{2,40})/g);
  const nodes: ReactNode[] = parts.map((part, i) => {
    if (part.startsWith("#") && part.length > 1) {
      const tag = part.slice(1).toLowerCase();
      return (
        <Link
          key={i}
          to="/hashtags/$tag"
          params={{ tag }}
          className="font-semibold text-primary hover:underline"
        >
          {part}
        </Link>
      );
    }
    if (part.startsWith("@") && part.length > 1) {
      return (
        <span key={i} className="font-semibold text-primary">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });

  return <span className={className}>{nodes}</span>;
}
