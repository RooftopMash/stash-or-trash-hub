import { cn } from "@/lib/utils";

/**
 * Shared brand logo renderer. Logos are fitted (never cropped) on a neutral pad
 * so wide wordmarks and pale marks both stay readable.
 */
export function BrandLogo({
  name,
  url,
  className,
  imgClassName,
}: {
  name: string;
  url?: string | null;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary p-1 font-bold",
        className,
      )}
    >
      {url ? (
        <img
          src={url}
          alt={name}
          loading="lazy"
          className={cn("h-full w-full object-contain", imgClassName)}
        />
      ) : (
        <span aria-hidden>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}
