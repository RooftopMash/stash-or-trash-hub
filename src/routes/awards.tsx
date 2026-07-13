import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { fetchBrands } from "@/lib/brands";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Crown, Heart, Sparkles, TrendingUp, Trophy } from "lucide-react";

export const Route = createFileRoute("/awards")({
  head: () => ({
    meta: [
      { title: "The SOT Awards | Stash Or Trash — The Brand Barometer" },
      {
        name: "description",
        content:
          "The annual SOT Awards crown the world's most trusted brands — decided entirely by real verdicts from real people. See the live leaderboard.",
      },
      { property: "og:title", content: "The SOT Awards — The People's Verdict, Made Official" },
      {
        property: "og:description",
        content:
          "The most trusted brands, crowned by the crowd. Explore the live leaderboard powering this year's SOT Awards.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AwardsPage,
});

function AwardsPage() {
  const { t } = useTranslation();
  const { data: brands, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  const top = (brands ?? []).slice(0, 10);
  const medals = ["🥇", "🥈", "🥉"];

  const categories = [
    { icon: Crown, title: t("awards.cat1"), desc: t("awards.cat1d") },
    { icon: Heart, title: t("awards.cat2"), desc: t("awards.cat2d") },
    { icon: TrendingUp, title: t("awards.cat3"), desc: t("awards.cat3d") },
    { icon: Sparkles, title: t("awards.cat4"), desc: t("awards.cat4d") },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero */}
        <section className="rounded-3xl border border-border bg-gradient-to-b from-secondary/60 to-card p-8 text-center">
          <Trophy className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">{t("awards.title")}</h1>
          <p className="mt-2 font-display text-lg font-semibold text-primary">{t("awards.tagline")}</p>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("awards.intro")}</p>
        </section>

        {/* Leaderboard */}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">{t("awards.leaderboard")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("awards.leaderboardNote")}</p>

          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            {isLoading ? (
              <div className="space-y-px">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-none" />
                ))}
              </div>
            ) : top.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">{t("brand.noBrands")}</p>
            ) : (
              top.map((b, i) => (
                <Link
                  key={b.id}
                  to="/brands/$slug"
                  params={{ slug: b.slug }}
                  className="flex items-center gap-4 border-b border-border bg-card px-4 py-3 transition-colors last:border-0 hover:bg-secondary/50"
                >
                  <span className="w-8 text-center font-display text-lg font-extrabold text-muted-foreground">
                    {medals[i] ?? i + 1}
                  </span>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary text-sm font-bold">
                    {b.signedLogoUrl ? (
                      <img src={b.signedLogoUrl} alt={b.name} className="h-full w-full object-cover" />
                    ) : (
                      b.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="flex-1 truncate font-semibold">{b.name}</span>
                  <span className="flex items-center gap-1.5 font-display font-extrabold text-stash">
                    <TrendingUp className="h-4 w-4" />
                    {b.trust_score}
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">{t("awards.categoryTitle")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {categories.map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-card p-5">
                <c.icon className="h-7 w-7 text-primary" />
                <h3 className="mt-3 font-display text-lg font-bold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10 rounded-3xl border border-border bg-card p-8 text-center">
          <Award className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-3 font-display text-2xl font-bold">{t("awards.cta")}</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">{t("awards.ctaNote")}</p>
          <Link
            to="/brands"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("nav.brands")}
          </Link>
        </section>
      </main>
    </div>
  );
}
