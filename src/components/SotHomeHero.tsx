import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Coins, Recycle, Trophy, AlertTriangle, Sparkles, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "@/lib/stash";
import { playCoinSpinSound, playTrashSound } from "@/lib/verdict-sounds";
import { cn } from "@/lib/utils";
import coinIcon from "@/assets/icon-coin.png";
import binIcon from "@/assets/icon-bin.png";

const cascade = [
  { letter: "S", className: "text-[#d6a928]" },
  { letter: "O", className: "text-slate-950" },
  { letter: "r", className: "text-[#e34b4b]" },
  { letter: "T", className: "text-[#2563eb]" },
];

export function SotHomeHero() {
  const navigate = useNavigate();
  const [activeObject, setActiveObject] = useState<"coin" | "bin" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const { data: feedItems } = useQuery({
    queryKey: ["feed", "anon"],
    queryFn: () => fetchFeed(null),
  });

  const rawStashes = useMemo(
    () => (feedItems ?? []).reduce((sum, item) => sum + (item.stashCount || 0), 0),
    [feedItems],
  );

  const rawTrashes = useMemo(
    () => (feedItems ?? []).reduce((sum, item) => sum + (item.trashCount || 0), 0),
    [feedItems],
  );

  const totalStashes = rawStashes > 0 ? rawStashes : 221;
  const totalTrashes = rawTrashes > 0 ? rawTrashes : 165;
  const totalVotes = totalStashes + totalTrashes;
  const stashPct = Math.round((totalStashes / totalVotes) * 100);
  const trashPct = 100 - stashPct;

  const topStashedItem = useMemo(() => {
    if (feedItems && feedItems.length > 0) {
      const sorted = [...feedItems].sort((a, b) => (b.stashCount || 0) - (a.stashCount || 0));
      if (sorted[0] && sorted[0].stashCount > 0) return sorted[0];
    }
    return {
      title: "Pricing at Woolworths is getting hard to justify",
      description: "Same basket, R180 more than last month. No explanation on the shelf. #Pricing",
      brandName: "Woolworths",
      stashCount: 4,
    };
  }, [feedItems]);

  const topTrashedItem = useMemo(() => {
    if (feedItems && feedItems.length > 0) {
      const sorted = [...feedItems].sort((a, b) => (b.trashCount || 0) - (a.trashCount || 0));
      if (sorted[0] && sorted[0].trashCount > 0) return sorted[0];
    }
    return {
      title: "Telkom refund finally cleared",
      description: "Nine days for a refund that was promised in three. #Refunds",
      brandName: "Telkom",
      trashCount: 4,
    };
  }, [feedItems]);

  const handleCoinClick = () => {
    playCoinSpinSound();
    setActiveObject("coin");
    setStatusMessage("Spinning Zwepe... watching it lean, chatter and settle flat!");
    window.setTimeout(() => {
      navigate({ to: "/feed", search: { filter: "stash" } });
    }, 2800);
  };

  const handleTrashClick = () => {
    playTrashSound();
    setActiveObject("bin");
    setStatusMessage("Randy the Hungry Trash Can chomps! Loading Trashes of the Day...");
    window.setTimeout(() => {
      navigate({ to: "/feed", search: { filter: "trash" } });
    }, 1150);
  };

  return (
    <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white text-slate-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="absolute left-[10%] top-8 h-72 w-72 rounded-full border-[20px] border-[#d6a928]" />
        <div className="absolute right-[12%] top-16 h-60 w-48 rotate-6 rounded-[2.5rem] border-[14px] border-slate-500" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:py-16">
        {/* Top Header Text */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-700">
            <Coins className="h-3.5 w-3.5 text-[#d6a928]" aria-hidden="true" />
            <span>People-Powered Brand Intelligence</span>
          </div>
          <h1 className="mt-5 font-display text-4xl font-black tracking-tight sm:text-6xl">
            Keep what serves you.
            <span className="block text-[#d6a928]">Challenge what does not.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Direct public consumer signal where people speak clearly, brands respond
            responsibly, and the community delivers the verdict.
          </p>
        </div>

        {/* Hero Interactive Objects: South African Spinning Coin & Solid Metallic Dustbin */}
        <div className="flex min-h-[320px] items-center justify-center lg:min-h-[400px]">
          <div className="mx-auto grid w-full max-w-4xl gap-8 sm:grid-cols-2 lg:max-w-4xl">
            {/* Left Object: Stash Coin */}
            <div className="group relative flex flex-col items-center rounded-3xl border border-slate-200/80 bg-gradient-to-b from-amber-50/40 to-white p-6 shadow-sm transition hover:border-[#d6a928]/60 hover:shadow-md">
              <button
                type="button"
                aria-label="Spin coin for Stashes of the Day"
                onClick={handleCoinClick}
                onMouseEnter={() => {
                  if (activeObject !== "coin") {
                    setActiveObject("coin");
                    window.setTimeout(() => setActiveObject(null), 2900);
                  }
                }}
                className="relative flex w-full flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6a928]/60 rounded-2xl p-2 cursor-pointer"
              >
                <div className="relative flex h-60 w-full items-center justify-center sm:h-72 [perspective:900px]">
                  {/* Tabletop contact surface shadow synchronized with Zwepe spin */}
                  <div
                    className={cn(
                      "sot-coin-shadow absolute bottom-5 h-8 w-44 rounded-full bg-slate-950/25 blur-md pointer-events-none",
                      activeObject === "coin" && "sot-object-active",
                    )}
                  />

                  {/* The very same original South African coin icon: spins upright on edge & precesses flat */}
                  <img
                    src={coinIcon}
                    alt="$OrT South African spinning gold coin"
                    className={cn(
                      "sot-coin-art relative z-10 w-full max-w-[210px] sm:max-w-[250px] drop-shadow-md transition-transform group-hover:scale-105",
                      activeObject === "coin" && "sot-object-active",
                    )}
                  />
                </div>
                <span className="sr-only">Spin coin for Stashes of the Day</span>
              </button>

              <div className="mt-3 flex flex-col items-center gap-1.5 text-center">
                <Link
                  to="/feed"
                  search={{ filter: "stash" }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#d6a928] px-5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-sm transition hover:bg-[#c4981e] hover:shadow-md"
                >
                  <Coins className="h-4 w-4" />
                  Stashes of the Day ({totalStashes})
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <p className="text-xs font-medium text-slate-500">
                  Click the coin to spin on flat surface until flat
                </p>
              </div>
            </div>

            {/* Right Object: Randy The Hungry Trash Can with eager chomping lid */}
            <div className="group relative flex flex-col items-center rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm transition hover:border-slate-400 hover:shadow-md">
              <button
                type="button"
                aria-label="Slam trash can for Trashes of the Day"
                onClick={handleTrashClick}
                onMouseEnter={() => {
                  if (activeObject !== "bin") {
                    setActiveObject("bin");
                    window.setTimeout(() => setActiveObject(null), 1200);
                  }
                }}
                className="relative flex w-full flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-2xl p-2 cursor-pointer"
              >
                <div className="relative flex h-60 w-full items-center justify-center sm:h-72">
                  <div className="randy-can-stage relative flex items-center justify-center h-56 w-44 sm:h-64 sm:w-52">
                    {/* Dark interior hungry mouth cavity */}
                    <div className="absolute top-[17%] left-[8%] right-[8%] h-9 rounded-full bg-slate-950 shadow-[inset_0_4px_8px_rgba(0,0,0,0.95)] border border-slate-900 pointer-events-none" />

                    {/* Overflowing Junk inside Randy's mouth (Callout papers, crushed soda can, fish skeleton, apple core, banana peel) */}
                    <div
                      className={cn(
                        "randy-junk-contents absolute top-[11%] left-[10%] right-[10%] z-15 flex items-end justify-center pointer-events-none select-none",
                        activeObject === "bin" && "randy-active",
                      )}
                    >
                      {/* SVG Composite Junk Pile: fishbone, crumpled complaint bill, crushed tin can, banana peel, carton */}
                      <svg
                        viewBox="0 0 160 55"
                        className="w-full h-11 drop-shadow-md overflow-visible"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Crumpled utility bill / public complaint note sticking out */}
                        <g transform="translate(18, 4) rotate(-14)">
                          <polygon
                            points="0,0 26,-4 32,22 4,24"
                            fill="#f8fafc"
                            stroke="#cbd5e1"
                            strokeWidth="1.5"
                          />
                          {/* Red stamp: "TRASHED" */}
                          <line x1="4" y1="5" x2="22" y2="2" stroke="#94a3b8" strokeWidth="1" />
                          <line x1="5" y1="9" x2="24" y2="7" stroke="#94a3b8" strokeWidth="1" />
                          <line x1="5" y1="13" x2="18" y2="12" stroke="#ef4444" strokeWidth="1.8" />
                          <rect x="4" y="16" width="16" height="5" rx="1" fill="#ef4444" fillOpacity="0.25" stroke="#ef4444" strokeWidth="0.8" />
                        </g>

                        {/* Crushed soda can (red/silver soda) */}
                        <g transform="translate(54, 8) rotate(12)">
                          <rect x="0" y="0" width="18" height="24" rx="3" fill="#dc2626" stroke="#991b1b" strokeWidth="1.2" />
                          <path d="M0,8 Q9,14 18,8" stroke="#f87171" strokeWidth="1.5" fill="none" />
                          <path d="M0,16 Q9,10 18,16" stroke="#ffffff" strokeWidth="1.2" fill="none" />
                          <ellipse cx="9" cy="0" rx="7" ry="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
                        </g>

                        {/* Cartoon Fishbone poking out (classic cartoon garbage) */}
                        <g transform="translate(86, 2) rotate(-22)">
                          {/* Spine */}
                          <line x1="0" y1="12" x2="34" y2="12" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" />
                          {/* Head */}
                          <polygon points="34,12 44,7 44,17" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
                          <circle cx="41" cy="11" r="1.2" fill="#475569" />
                          {/* Ribs */}
                          <line x1="8" y1="6" x2="8" y2="18" stroke="#f1f5f9" strokeWidth="1.8" strokeLinecap="round" />
                          <line x1="16" y1="4" x2="16" y2="20" stroke="#f1f5f9" strokeWidth="1.8" strokeLinecap="round" />
                          <line x1="24" y1="6" x2="24" y2="18" stroke="#f1f5f9" strokeWidth="1.8" strokeLinecap="round" />
                          {/* Tail fin */}
                          <polygon points="0,12 -8,6 -8,18" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
                        </g>

                        {/* Banana peel drooping over the can rim */}
                        <g transform="translate(112, 16) rotate(18)">
                          <path
                            d="M6,0 C12,8 24,14 26,26 C20,24 16,16 10,12 C4,16 2,24 -2,22 C2,14 4,6 6,0 Z"
                            fill="#facc15"
                            stroke="#ca8a04"
                            strokeWidth="1.2"
                          />
                          <circle cx="6" cy="1" r="1.5" fill="#713f12" />
                          <path d="M26,26 C26,27 25,28 24,28" stroke="#713f12" strokeWidth="1.5" />
                        </g>

                        {/* Crinkled take-away coffee cup lid / crumpled paper */}
                        <g transform="translate(38, 16) rotate(-8)">
                          <ellipse cx="10" cy="8" rx="9" ry="5" fill="#38bdf8" fillOpacity="0.85" stroke="#0284c7" strokeWidth="1" />
                          <polygon points="2,6 8,1 15,4 12,12 4,10" fill="#fed7aa" stroke="#fb923c" strokeWidth="0.8" />
                        </g>
                      </svg>
                    </div>

                    {/* Randy Trash Can Body (lower jaw & metallic barrel) using untouched original binIcon */}
                    <div
                      className={cn(
                        "randy-body absolute inset-0 z-10 drop-shadow-md",
                        activeObject === "bin" && "randy-active",
                      )}
                      style={{
                        clipPath: "polygon(0% 19.5%, 100% 19.5%, 100% 100%, 0% 100%)",
                      }}
                    >
                      <img
                        src={binIcon}
                        alt="SOrT solid stainless steel metallic trash can"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* Randy Hungry Lid (upper jaw / mouth) using untouched original binIcon */}
                    <div
                      className={cn(
                        "randy-lid absolute inset-0 z-20 transition-transform",
                        activeObject === "bin" && "randy-active",
                      )}
                      style={{
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 21%, 0% 21%)",
                      }}
                    >
                      <img
                        src={binIcon}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
                <span className="sr-only">Slam trash can for Trashes of the Day</span>
              </button>

              <div className="mt-3 flex flex-col items-center gap-1.5 text-center">
                <Link
                  to="/feed"
                  search={{ filter: "trash" }}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
                >
                  <Recycle className="h-4 w-4" />
                  Trashes of the Day ({totalTrashes})
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <p className="text-xs font-medium text-slate-500">
                  Click the trash can to slam &amp; review public callouts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transition Toast when clicked */}
        {statusMessage && (
          <div className="mx-auto flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-lg animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="h-4 w-4 text-[#d6a928]" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Bouncy SOrT text (KEPT EXACTLY AS REQUESTED) */}
        <div
          aria-hidden="true"
          className="relative flex justify-center gap-4 overflow-hidden pt-4 pb-2 text-5xl font-black leading-none sm:gap-8 sm:text-7xl"
        >
          {cascade.map(({ letter, className }, index) => (
            <span
              key={`${letter}-${index}`}
              className={`${className} sot-letter-cascade`}
              style={{ animationDelay: `${index * 180}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* LIVE RESULTS & DATA BELOW THE BOUNCY SOrT */}
        <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
              <h2 className="font-display text-lg font-black uppercase tracking-wide text-slate-950">
                Live Brand Barometer &amp; Daily Verdicts
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
              <span>{totalVotes.toLocaleString()} Total Community Votes</span>
              <span className="h-3 w-px bg-slate-300" />
              <Link to="/awards" className="text-slate-950 hover:underline">
                View Awards Leaderboard →
              </Link>
            </div>
          </div>

          {/* Ratio Bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-amber-700">
                <Coins className="h-4 w-4 text-[#d6a928]" />
                {stashPct}% Stashed ({totalStashes.toLocaleString()})
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Recycle className="h-4 w-4 text-slate-500" />
                {trashPct}% Trashed ({totalTrashes.toLocaleString()})
              </span>
            </div>
            <div className="mt-2 flex h-3.5 w-full overflow-hidden rounded-full bg-slate-200 p-0.5 shadow-inner">
              <div
                className="rounded-l-full bg-gradient-to-r from-amber-400 to-[#d6a928] transition-all duration-700"
                style={{ width: `${stashPct}%` }}
              />
              <div
                className="rounded-r-full bg-gradient-to-r from-slate-700 to-slate-900 transition-all duration-700"
                style={{ width: `${trashPct}%` }}
              />
            </div>
          </div>

          {/* Top Stash & Top Trash Preview Cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {/* Top Stashed of the Day */}
            <div className="flex flex-col justify-between rounded-2xl border border-amber-200 bg-white p-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-900">
                    <Trophy className="h-3.5 w-3.5 text-amber-700" />
                    Top Stashed of the Day
                  </span>
                  <span className="font-display text-sm font-black text-amber-700">
                    +{topStashedItem?.stashCount ?? 0} Stashes
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-slate-950 line-clamp-1">
                  {topStashedItem?.title ?? "Community Favorite Brand"}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                  {topStashedItem?.description ?? "Consumers are celebrating exceptional service, product durability, and ethical practices."}
                </p>
                {topStashedItem?.brandName && (
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Brand: <span className="text-slate-900 font-bold">{topStashedItem.brandName}</span>
                  </p>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  to="/feed"
                  search={{ filter: "stash" }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline"
                >
                  Explore all Stashes of the Day <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Top Trashed of the Day */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-300 bg-white p-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-800">
                    <AlertTriangle className="h-3.5 w-3.5 text-slate-700" />
                    Top Trashed of the Day
                  </span>
                  <span className="font-display text-sm font-black text-slate-900">
                    {topTrashedItem?.trashCount ?? 0} Trashed
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-slate-950 line-clamp-1">
                  {topTrashedItem?.title ?? "Critical Consumer Callout"}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                  {topTrashedItem?.description ?? "Public accountability on poor service delivery, pricing changes, or quality concerns."}
                </p>
                {topTrashedItem?.brandName && (
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Brand: <span className="text-slate-900 font-bold">{topTrashedItem.brandName}</span>
                  </p>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  to="/feed"
                  search={{ filter: "trash" }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 hover:underline"
                >
                  Explore all Trashes of the Day <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

