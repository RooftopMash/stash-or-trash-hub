import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BadgeCheck, MapPin, Globe2, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchLocalBrands } from "@/lib/brands";
import { detectCountry, countryName } from "@/lib/geo";

/** Horizontal quick-access rail of brands near the visitor, for one-tap judging. */
export function QuickBrands() {
  const { t, i18n } = useTranslation();
  const country = useMemo(() => detectCountry(), []);
  const { data, isLoading } = useQuery({
    queryKey: ["local-brands", country ?? "global"],
    queryFn: () => fetchLocalBrands(country),
  });

  if (isLoading) {
    return (
      <div className="mb-4 flex gap-2 overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-40 shrink-0 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data || data.brands.length === 0) return null;

  const label = data.localized
    ? t("brand.nearYou", { country: countryName(country, i18n.language) })
    : t("brand.globalTop");

  return (
    <section className="mb-5" aria-label={label}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {data.localized ? (
            <MapPin className="h-3.5 w-3.5 text-stash" />
          ) : (
            <Globe2 className="h-3.5 w-3.5 text-stash" />
          )}
          {label}
        </h2>
        <Link
          to="/brands"
          className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          {t("brand.seeAll")} <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {data.brands.map((b) => (
          <Link
            key={b.id}
            to="/brands/$slug"
            params={{ slug: b.slug }}
            className="flex w-44 shrink-0 items-center gap-2.5 rounded-xl border border-border bg-card p-2.5 transition-colors hover:border-stash/60"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary text-sm font-bold">
              {b.signedLogoUrl ? (
                <img src={b.signedLogoUrl} alt="" aria-hidden className="h-full w-full object-cover" />
              ) : (
                b.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="truncate text-sm font-semibold">{b.name}</span>
                {b.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-stash" />}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {b.trust_score}/100 {t("brand.trustScore").toLowerCase()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
