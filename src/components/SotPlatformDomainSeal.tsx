import { useEffect, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import {
  SOT_DEFAULT_PRIMARY_DOMAIN,
  SOT_EXCLUSIVE_DOMAIN_LETTERS,
  formatBrandedSotDomain,
  getActiveSotDomainInfo,
} from "@/lib/sot-domain";
import { cn } from "@/lib/utils";

interface SotPlatformDomainSealProps {
  variant?: "banner" | "compact" | "pill";
  className?: string;
}

function ExclusiveSotLetters({
  dotSizeClass = "size-2",
  textClass = "text-sm",
}: {
  dotSizeClass?: string;
  textClass?: string;
}) {
  return (
    <span
      translate="no"
      aria-label="SOrT"
      className={cn(
        "notranslate inline-flex items-center gap-0.5 font-display font-black tracking-tight normal-case",
        textClass,
      )}
      style={{ textTransform: "none" }}
    >
      {SOT_EXCLUSIVE_DOMAIN_LETTERS.map((item) => (
        <span key={item.letter} className="inline-flex items-center">
          <span
            aria-hidden="true"
            className={cn("mr-0.5 inline-block rounded-full", dotSizeClass, item.dotClass)}
          />
          <span className={cn("normal-case", item.darkTextClass)} style={{ textTransform: "none" }}>
            {item.letter}
          </span>
        </span>
      ))}
    </span>
  );
}

function SecuredDomainLabel({
  domainInfo,
  dotSizeClass = "size-2",
  textClass = "text-sm",
}: {
  domainInfo: ReturnType<typeof getActiveSotDomainInfo>;
  dotSizeClass?: string;
  textClass?: string;
}) {
  if (domainInfo.isSotShortDomain) {
    return (
      <span
        translate="no"
        data-sot-branded-domain={domainInfo.displayDomain}
        aria-label={`Official verified domain ${domainInfo.displayDomain}`}
        className={cn(
          "notranslate inline-flex items-center font-display font-black tracking-tight normal-case select-all",
          textClass,
        )}
        style={{ textTransform: "none" }}
      >
        {domainInfo.prefix ? <span className="text-white">{domainInfo.prefix}</span> : null}
        <ExclusiveSotLetters dotSizeClass={dotSizeClass} textClass={textClass} />
        <span className="normal-case text-white" style={{ textTransform: "none" }}>
          {domainInfo.suffix}
        </span>
      </span>
    );
  }

  return (
    <span
      translate="no"
      data-sot-branded-domain={domainInfo.displayDomain}
      className="notranslate inline-flex items-center gap-2 font-mono text-[11px] font-bold text-white"
    >
      <ExclusiveSotLetters dotSizeClass={dotSizeClass} textClass={textClass} />
      <span className="text-slate-500" aria-hidden="true">
        ·
      </span>
      <span className="truncate">{domainInfo.displayDomain}</span>
    </span>
  );
}

/**
 * Exclusive verified domain seal belonging strictly to Stash Or Trash (SOrT).
 * Always displays the real secured platform domain alongside the 🔴S🟠O🟡r🟢T mark,
 * fusing SOrT casing & colors directly into any secured SOrT.* hostname.
 * Never rendered on external brand domains.
 */
export function SotPlatformDomainSeal({
  variant = "banner",
  className,
}: SotPlatformDomainSealProps) {
  const [domainInfo, setDomainInfo] = useState<ReturnType<typeof getActiveSotDomainInfo>>(() => ({
    ...formatBrandedSotDomain(SOT_DEFAULT_PRIMARY_DOMAIN),
    isOfficialHost: true,
  }));

  useEffect(() => {
    setDomainInfo(getActiveSotDomainInfo());
  }, []);

  if (variant === "pill") {
    return (
      <div
        data-sot-exclusive-domain-seal="true"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-white shadow-xs",
          className,
        )}
      >
        <Lock className="h-3 w-3 shrink-0 text-[#4ade80]" aria-hidden="true" />
        <SecuredDomainLabel domainInfo={domainInfo} dotSizeClass="size-1.5" textClass="text-xs" />
        <span className="hidden text-[10px] font-bold uppercase tracking-wider text-emerald-400 sm:inline">
          Official Site
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        data-sot-exclusive-domain-seal="true"
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-300/80 bg-slate-950 px-3 py-2 text-xs text-white shadow-xs",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-0.5">
            <Lock className="h-3 w-3 shrink-0 text-[#4ade80]" aria-hidden="true" />
            <SecuredDomainLabel domainInfo={domainInfo} dotSizeClass="size-1.5" textClass="text-xs" />
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Official SOrT Only
        </span>
      </div>
    );
  }

  return (
    <div
      data-sot-exclusive-domain-seal="true"
      className={cn(
        "mx-auto flex max-w-2xl flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-950 px-5 py-3.5 text-center text-white shadow-sm sm:flex-row sm:gap-4",
        className,
      )}
    >
      <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-1">
        <Lock className="h-3.5 w-3.5 shrink-0 text-[#4ade80]" aria-hidden="true" />
        <SecuredDomainLabel
          domainInfo={domainInfo}
          dotSizeClass="size-2"
          textClass="text-sm sm:text-base"
        />
      </div>

      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Exclusive Official Platform Domain
      </span>
    </div>
  );
}
