import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared brand logo renderer. Logos are fitted (never cropped) on a neutral pad
 * so wide wordmarks and pale marks both stay readable, with automatic monogram fallback
 * if an external CDN image fails or is rate-limited.
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
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [url]);

  const showImg = Boolean(url && !imgFailed);

  return (
    <div
      translate="no"
      className={cn(
        "notranslate flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary p-1 font-bold",
        className,
      )}
    >
      {showImg ? (
        <img
          src={url!}
          alt={name}
          translate="no"
          loading="lazy"
          onError={() => setImgFailed(true)}
          className={cn("notranslate h-full w-full object-contain", imgClassName)}
        />
      ) : (
        <span translate="no" className="notranslate" aria-hidden>
          {name.charAt(0).toUpperCase() || "B"}
        </span>
      )}
    </div>
  );
}
