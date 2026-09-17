import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Coins, Recycle } from "lucide-react";
import { SotWordmark } from "@/components/SotWordmark";

const cascade = [
  { letter: "S", className: "text-[#d6a928]" },
  { letter: "O", className: "text-slate-950" },
  { letter: "r", className: "text-[#e34b4b]" },
  { letter: "T", className: "text-[#2563eb]" },
];

export function SotHomeHero() {
  const [activeObject, setActiveObject] = useState<"coin" | "bin" | null>(null);
  const triggerObject = (object: "coin" | "bin") => {
    setActiveObject(object);
    window.setTimeout(() => setActiveObject(null), object === "coin" ? 1200 : 900);
  };

  return (
    <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white text-slate-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute left-[12%] top-8 h-64 w-64 rounded-full border-[18px] border-[#d6a928]" />
        <div className="absolute right-[15%] top-20 h-52 w-40 rotate-6 rounded-[2rem] border-[12px] border-slate-500" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:py-20">
        <div className="order-2 mx-auto max-w-3xl text-center">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            <Coins className="h-4 w-4 text-[#d6a928]" aria-hidden="true" />
            <span>People-powered brand intelligence</span>
          </div>
          <h1 className="mt-5 font-display text-4xl font-black tracking-tight sm:text-6xl">
            Keep what serves you.
            <span className="block text-[#d6a928]">Challenge what does not.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
            A direct feedback-and-response platform where people speak clearly, brands respond responsibly, and better ideas have somewhere to go.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/feed" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
              Explore the feed <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/brands" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
              Browse brands
            </Link>
            <Link to="/awards" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
              See the live awards <Recycle className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="order-1 flex min-h-[280px] items-center justify-center lg:min-h-[390px]">
          <div className="mx-auto grid w-full max-w-4xl gap-6 sm:grid-cols-2 sm:gap-8 lg:max-w-[52rem]">
            <button type="button" aria-label="Stash: drop the coin" onMouseEnter={() => triggerObject("coin")} onFocus={() => triggerObject("coin")} onClick={() => triggerObject("coin")} className="group flex min-w-0 flex-col items-center justify-center bg-transparent text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6a928]/50">
              <span className="sr-only">Stash</span>
              <img src="/images/sot-coin.png" alt="$OrT gold coin, 2026" className={`sot-coin-art mix-blend-multiply w-full max-w-sm motion-reduce:transition-none ${activeObject === "coin" ? "sot-object-active" : ""}`} />
            </button>
            <button type="button" aria-label="Trash: close the metal lid" onMouseEnter={() => triggerObject("bin")} onFocus={() => triggerObject("bin")} onClick={() => triggerObject("bin")} className="group flex min-w-0 flex-col items-center justify-center bg-transparent text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50">
              <span className="sr-only">Trash</span>
              <span className="sot-bin-stage relative block w-full max-w-sm">
                <img src="/images/sot-trash-body.png" alt="Battered silver trash can with recycle symbol" className="sot-bin-body mix-blend-multiply relative z-10 w-full" />
                <img src="/images/sot-trash-lid.png" alt="" aria-hidden="true" className={`sot-bin-lid mix-blend-multiply absolute left-1/2 top-[4%] z-20 w-[78%] -translate-x-1/2 ${activeObject === "bin" ? "sot-object-active" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="relative flex justify-center gap-4 overflow-hidden pb-5 text-5xl font-black leading-none sm:gap-8 sm:text-7xl">
        {cascade.map(({ letter, className }, index) => <span key={`${letter}-${index}`} className={`${className} sot-letter-cascade`} style={{ animationDelay: `${index * 180}ms` }}>{letter}</span>)}
      </div>
    </section>
  );
}
