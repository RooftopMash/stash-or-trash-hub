import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { fetchBrands } from "@/lib/brands";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCheck, Plus, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/brands/")({
  head: () => ({
    meta: [
      { title: "Brands — Stash or Trash" },
      {
        name: "description",
        content: "Browse brands on the Brand Barometer and see the community's live trust score.",
      },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ["brands"], queryFn: fetchBrands });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{t("brand.title")}</h1>
            <p className="mt-2 max-w-lg text-muted-foreground">{t("brand.subtitle")}</p>
          </div>
          <Button
            onClick={() => navigate({ to: user ? "/brands/new" : "/auth" })}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" /> {t("brand.create")}
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {data.map((b) => (
              <Link
                key={b.id}
                to="/brands/$slug"
                params={{ slug: b.slug }}
                className="group flex gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary text-lg font-bold">
                  {b.signedLogoUrl ? (
                    <img
                      src={b.signedLogoUrl}
                      alt={b.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    b.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="truncate font-display text-lg font-bold">{b.name}</h2>
                    {b.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                  {b.category && (
                    <Badge variant="secondary" className="mt-1 text-[10px]">
                      {b.category}
                    </Badge>
                  )}
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <TrendingUp className="h-4 w-4 text-stash" />
                    <span className="font-semibold">{b.trust_score}</span>
                    <span className="text-muted-foreground">
                      / 100 {t("brand.trustScore").toLowerCase()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            {t("brand.noBrands")}
          </div>
        )}
      </main>
    </div>
  );
}
