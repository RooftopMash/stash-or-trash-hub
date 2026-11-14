import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Award, Coins, Eye, Sun, Moon, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import krugerrandA from "@/assets/images/krugerrand_coin_a_1794568702608.jpg";
import krugerrandB from "@/assets/images/krugerrand_coin_b_1794568702506.jpg";
import krugerrandC from "@/assets/images/krugerrand_award_c_1794568702902.jpg";
import vintageCanA from "@/assets/images/vintage_trash_can_a_1794562087490.jpg";
import vintageCanB from "@/assets/images/vintage_trash_can_b_1794562088525.jpg";

export const Route = createFileRoute("/asset-candidates")({
  ssr: false,
  component: AssetCandidatesPage,
});

const COIN_CANDIDATES = [
  {
    id: "option-a",
    badge: "Option A · Bullion Strike",
    title: "Authentic 22k Krugerrand Bullion (Straight-On)",
    description:
      "Flat macro strike with realistic copper-gold patina, beaded rim, prancing springbok over veld terrain, arched SORT lettering, and $ beneath.",
    src: krugerrandA,
    bestFor: "Best match for raw, authentic vintage realism alongside your galvanized bin.",
  },
  {
    id: "option-b",
    badge: "Option B · Angled Proof",
    title: "Heavy Reeded Edge Proof Medallion",
    description:
      "Slightly tilted auction angle highlighting the thick serrated edge, mirror-polished copper-gold fields, and frosted cameo springbok relief (currently stamps 2023 above $).",
    src: krugerrandB,
    bestFor: "Best if you want 3D coin thickness & dramatic specular rim highlights.",
  },
  {
    id: "option-c",
    badge: "Option C · Prestige Award",
    title: "Prestige Mint Strike & Future Award Coin",
    description:
      "Centered studio proof with subtle left milled edge depth, protea bloom detail beneath the springbok, grounded contact shadow, SORT on top, and $ below.",
    src: krugerrandC,
    bestFor: "Ideal dual-purpose candidate for both Stash voting and SOrT Krugerrand Awards.",
  },
] as const;

const TRASH_CANDIDATES = [
  {
    id: "attached-can",
    badge: "Your Reference Attachment",
    title: "Galvanized Bin with Weathered Rusted Lid",
    description: "Your uploaded vintage corrugated steel drum with authentic aged rust rim.",
    src: "/assets/aistudio/Trash_can_174245b8.webp",
  },
  {
    id: "vintage-can-a",
    badge: "Trash Option A",
    title: "Domed Galvanized Steel Garbage Can",
    description: "Classic tall corrugated metal bin with fitted domed lid and side handles.",
    src: vintageCanA,
  },
  {
    id: "vintage-can-b",
    badge: "Trash Option B",
    title: "Horizontal-Ribbed Heavy Metal Bin",
    description: "Retro heavy-duty industrial bin with brushed zinc finish.",
    src: vintageCanB,
  },
] as const;

function AssetCandidatesPage() {
  const [darkBg, setDarkBg] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState<string>("option-c");

  const activeCoin =
    COIN_CANDIDATES.find((c) => c.id === selectedCoinId) ?? COIN_CANDIDATES[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-950 px-2.5 py-1 text-xs font-bold text-[#f5d061]">
                <Eye className="h-3.5 w-3.5 text-[#d6a928]" />
                Candidate Preview Only · Live App Icons Unchanged
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-black tracking-tight">
              Krugerrand Coin &amp; Vintage Trash Can Candidates
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Compare all three 22k Krugerrand-style coin candidates alongside your attached vintage trash can before choosing which pair to apply.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDarkBg((v) => !v)}
              className="gap-1.5 font-bold"
            >
              {darkBg ? <Sun className="h-4 w-4 text-[#d6a928]" /> : <Moon className="h-4 w-4" />}
              {darkBg ? "Light Stage" : "Dark Stage"}
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5 font-bold">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>
        </div>

        {/* 3 Krugerrand Gold Coin Options */}
        <section className="mt-8">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-[#d6a928]" />
            <h2 className="font-display text-xl font-black">
              1. Krugerrand Gold Coin Candidates (3 Options)
            </h2>
          </div>

          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {COIN_CANDIDATES.map((coin) => {
              const isSelected = selectedCoinId === coin.id;
              return (
                <div
                  key={coin.id}
                  onClick={() => setSelectedCoinId(coin.id)}
                  className={cn(
                    "cursor-pointer rounded-3xl border-2 p-5 transition-all",
                    isSelected
                      ? "border-[#d6a928] bg-[#d6a928]/5 shadow-md"
                      : "border-border bg-card hover:border-[#d6a928]/50",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-slate-950 px-2.5 py-1 text-xs font-extrabold text-[#f5d061]">
                      {coin.badge}
                    </span>
                    {isSelected && (
                      <span className="text-xs font-extrabold text-[#b88914]">
                        Selected for Pair Preview
                      </span>
                    )}
                  </div>

                  <div
                    className={cn(
                      "mt-4 flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-border/60 p-4 transition-colors",
                      darkBg ? "bg-slate-950" : "bg-white",
                    )}
                  >
                    <img
                      src={coin.src}
                      alt={coin.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full rounded-xl object-contain"
                    />
                  </div>

                  <h3 className="mt-4 font-display text-lg font-black">{coin.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {coin.description}
                  </p>
                  <p className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-[11px] font-semibold text-foreground">
                    {coin.bestFor}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Size & Side-by-Side Pairing Simulation */}
        <section className="mt-10 rounded-3xl border-2 border-[#d6a928]/40 bg-card p-6">
          <h2 className="font-display text-xl font-black flex items-center gap-2">
            <Award className="h-5 w-5 text-[#d6a928]" />
            2. Side-by-Side Stash vs Trash &amp; Award Medallion Size Preview ({activeCoin.badge})
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Click any coin card above to preview it paired with your attached vintage galvanized trash can at real UI sizes.
          </p>

          <div
            className={cn(
              "mt-5 grid gap-6 rounded-2xl border border-border p-6 sm:grid-cols-3",
              darkBg ? "bg-slate-950 text-white" : "bg-white text-slate-950",
            )}
          >
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/40 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                Stash Button Icon (56px)
              </span>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={activeCoin.src}
                  alt={activeCoin.title}
                  referrerPolicy="no-referrer"
                  className="h-14 w-14 rounded-full object-cover shadow-sm"
                />
                <span className="font-display text-xl font-black text-[#d6a928]">STASH</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/40 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                Trash Button Icon (56px)
              </span>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="/assets/aistudio/Trash_can_174245b8.webp"
                  alt="Attached Vintage Trash Can"
                  referrerPolicy="no-referrer"
                  className="h-14 w-14 rounded-xl object-contain"
                />
                <span className="font-display text-xl font-black text-rose-500">TRASH</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#d6a928]/40 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#d6a928]">
                Future Krugerrand Award Trophy (96px)
              </span>
              <div className="mt-3 flex flex-col items-center gap-2">
                <img
                  src={activeCoin.src}
                  alt="Future Krugerrand Award"
                  referrerPolicy="no-referrer"
                  className="h-24 w-24 rounded-full object-cover shadow-md ring-2 ring-[#d6a928]"
                />
                <span className="text-xs font-extrabold">Annual SOrT Krugerrand Honour</span>
              </div>
            </div>
          </div>
        </section>

        {/* Vintage Trash Can Comparison */}
        <section className="mt-10">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-rose-500" />
            <h2 className="font-display text-xl font-black">
              3. Vintage Trash Can Reference &amp; Earlier Candidates
            </h2>
          </div>

          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {TRASH_CANDIDATES.map((can) => (
              <div
                key={can.id}
                className="rounded-3xl border border-border bg-card p-5"
              >
                <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-bold">
                  {can.badge}
                </span>
                <div
                  className={cn(
                    "mt-4 flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-border/60 p-4",
                    darkBg ? "bg-slate-950" : "bg-white",
                  )}
                >
                  <img
                    src={can.src}
                    alt={can.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full rounded-xl object-contain"
                  />
                </div>
                <h3 className="mt-4 font-display text-base font-black">{can.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{can.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
