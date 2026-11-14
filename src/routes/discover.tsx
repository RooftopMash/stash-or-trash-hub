import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  Calendar,
  Handshake,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { SeoHelmet } from "@/components/SeoHelmet";
import { BrandEcosystemHub, type EcosystemHubTab } from "@/components/BrandEcosystemHub";
import { fetchBrands } from "@/lib/brands";
import { isBrandAutoSourced, extractRegistrableDomain } from "@/lib/brand-domain-verification";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/discover")({
  ssr: false,
  validateSearch: (
    search: Record<string, unknown>,
  ): { tab?: EcosystemHubTab } => ({
    tab:
      search.tab === "releases" ||
      search.tab === "innovations" ||
      search.tab === "events_collabs" ||
      search.tab === "authenticity"
        ? (search.tab as EcosystemHubTab)
        : undefined,
  }),
  component: DiscoverEcosystemPage,
});

function DiscoverEcosystemPage() {
  const search = Route.useSearch();
  const activeTab: EcosystemHubTab = search.tab ?? "releases";
  const navigate = Route.useNavigate();
  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  const unclaimedWithDomain = brands
    .filter((b) => isBrandAutoSourced(b) && extractRegistrableDomain(b.website))
    .slice(0, 4);

  const selectPillarTab = (tab: EcosystemHubTab) => {
    void navigate({ search: { tab } });
    document.getElementById("discover-ecosystem-hub")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-950">
      <SeoHelmet
        title="Ecosystem Hub: Releases, Authenticity, Innovations & Collabs — SOrT"
        description="Explore new brand releases, verify product originality, pitch C2B innovations, RSVP to brand events, and collaborate on Stash Or Trash."
        ogType="website"
      />
      <Header />

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:py-10">
        {/* Clean Single-Elevation Hero */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2.5 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6a928]/50 bg-slate-950 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#f5d061]">
                <Sparkles className="h-3.5 w-3.5 text-[#d6a928]" />
                Beyond Stash &amp; Trash · Full Brand Ecosystem
              </span>
              <h1 className="font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Releases, Originality, Innovations &amp; B2C Collaborations
              </h1>
              <p className="text-sm font-medium leading-relaxed text-slate-600">
                Discover verified product drops, confirm genuine brand origin, watch innovation presentations, submit your own C2B proposals, and connect directly with brands at live events.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button asChild size="sm" variant="outline" className="gap-1.5 font-bold whitespace-nowrap">
                <Link to="/scan">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Verify Product Scan
                </Link>
              </Button>
              <Button asChild size="sm" className="gap-1.5 bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935] whitespace-nowrap">
                <Link to="/brands">
                  <BadgeCheck className="h-4 w-4" /> Browse All Brands
                </Link>
              </Button>
            </div>
          </div>

          {/* 4 Interactive Pillar Quick-Jump Tiles */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button
              type="button"
              onClick={() => selectPillarTab("releases")}
              className={`cursor-pointer rounded-2xl border p-4 text-left transition-all ${
                activeTab === "releases"
                  ? "border-[#d6a928] bg-[#d6a928]/10 shadow-xs"
                  : "border-slate-200 bg-slate-50/70 hover:border-[#d6a928]/50"
              }`}
            >
              <Rocket className="h-4 w-4 text-[#b88914]" />
              <h2 className="mt-2 font-display text-sm font-black">New Releases</h2>
              <p className="mt-0.5 text-xs text-slate-600">
                Track upcoming drops, pre-orders, and official store launches.
              </p>
            </button>

            <button
              type="button"
              onClick={() => selectPillarTab("authenticity")}
              className={`cursor-pointer rounded-2xl border p-4 text-left transition-all ${
                activeTab === "authenticity"
                  ? "border-emerald-500 bg-emerald-50/80 shadow-xs"
                  : "border-slate-200 bg-slate-50/70 hover:border-emerald-400"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h2 className="mt-2 font-display text-sm font-black">Authenticity &amp; Origin</h2>
              <p className="mt-0.5 text-xs text-slate-600">
                Barcode verification &amp; corporate domain-matched brand ownership.
              </p>
            </button>

            <button
              type="button"
              onClick={() => selectPillarTab("innovations")}
              className={`cursor-pointer rounded-2xl border p-4 text-left transition-all ${
                activeTab === "innovations"
                  ? "border-indigo-500 bg-indigo-50/80 shadow-xs"
                  : "border-slate-200 bg-slate-50/70 hover:border-indigo-400"
              }`}
            >
              <Lightbulb className="h-4 w-4 text-indigo-600" />
              <h2 className="mt-2 font-display text-sm font-black">Innovations &amp; Pitches</h2>
              <p className="mt-0.5 text-xs text-slate-600">
                Brand R&amp;D showcases paired with community C2B proposals.
              </p>
            </button>

            <button
              type="button"
              onClick={() => selectPillarTab("events_collabs")}
              className={`cursor-pointer rounded-2xl border p-4 text-left transition-all ${
                activeTab === "events_collabs"
                  ? "border-blue-500 bg-blue-50/80 shadow-xs"
                  : "border-slate-200 bg-slate-50/70 hover:border-blue-400"
              }`}
            >
              <Handshake className="h-4 w-4 text-blue-600" />
              <h2 className="mt-2 font-display text-sm font-black">Events &amp; Collabs</h2>
              <p className="mt-0.5 text-xs text-slate-600">
                RSVP to brand townhalls and apply for B2C / C2B co-creation briefs.
              </p>
            </button>
          </div>
        </section>

        {/* Main Ecosystem Hub */}
        <section
          id="discover-ecosystem-hub"
          className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs"
        >
          <BrandEcosystemHub brandsList={brands} initialTab={activeTab} />
        </section>

        {/* Auto-Sourced Brand Ownership Verification Callout */}
        {unclaimedWithDomain.length > 0 && (
          <section className="rounded-3xl border border-[#d6a928]/50 bg-slate-950 p-6 text-white">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-[#f5d061]">
                  Auto-Sourced Brand Verification · Domain-Matched Access
                </p>
                <h2 className="mt-1 font-display text-xl font-black">
                  Represent an Auto-Sourced Brand? Claim With Your Official Email Domain
                </h2>
              </div>
              <Button asChild size="sm" className="bg-[#d6a928] text-slate-950 font-black hover:bg-[#e5b935] whitespace-nowrap shrink-0">
                <Link to="/brands">Open Brand Directory</Link>
              </Button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {unclaimedWithDomain.map((b) => {
                const dom = extractRegistrableDomain(b.website);
                return (
                  <Link
                    key={b.id}
                    to="/brands/$slug"
                    params={{ slug: b.slug }}
                    className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 hover:border-[#d6a928] transition-colors"
                  >
                    <p translate="no" className="notranslate font-display text-sm font-bold text-white truncate">
                      {b.name}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-[#f5d061] truncate">
                      @{dom}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <Calendar className="h-3 w-3" /> Claim &amp; Verify Ownership →
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
