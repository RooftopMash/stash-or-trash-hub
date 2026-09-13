import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Coins, Recycle } from "lucide-react";
import { playStashSound, playTrashSound } from "@/lib/verdict-sounds";
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
    object === "coin" ? playStashSound() : playTrashSound();
    window.setTimeout(() => setActiveObject(null), 650);
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
          <div className="grid w-full max-w-5xl gap-8 sm:grid-cols-2 sm:gap-12">
            <button type="button" aria-label="Stash: drop the coin" onMouseEnter={() => triggerObject("coin")} onFocus={() => triggerObject("coin")} onClick={() => triggerObject("coin")} className="group flex flex-col items-center gap-4 rounded-[2rem] bg-white p-5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.1)] ring-1 ring-[#d6a928]/30 transition-shadow hover:shadow-[0_24px_70px_rgba(214,169,40,0.22)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d6a928]/40">
              <span className="sr-only">Stash</span>
              <img src="/images/sot-coin.png" alt="$OrT gold coin, 2026" className={`w-full max-w-sm transition-transform duration-500 motion-reduce:transition-none ${activeObject === "coin" ? "-translate-y-8 rotate-3" : ""}`} />
              <span className="text-sm font-black uppercase tracking-[0.2em] text-[#8d6508]">Stash</span>
            </button>
            <button type="button" aria-label="Trash: close the metal lid" onMouseEnter={() => triggerObject("bin")} onFocus={() => triggerObject("bin")} onClick={() => triggerObject("bin")} className="group flex flex-col items-center gap-4 rounded-[2rem] bg-white p-5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.1)] ring-1 ring-slate-300 transition-shadow hover:shadow-[0_24px_70px_rgba(15,23,42,0.18)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/40">
              <span className="sr-only">Trash</span>
              <img src="/images/sot-trash-can.png" alt="Battered silver trash can with recycle symbol" className={`w-full max-w-sm transition-transform duration-500 motion-reduce:transition-none ${activeObject === "bin" ? "translate-y-4 -rotate-2" : ""}`} />
              <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">Trash</span>
            </button>
          </div>
          <div className="mt-4 flex justify-center gap-3 text-sm font-black uppercase tracking-[0.18em]">
            <span className="rounded-full bg-[#d6a928]/15 px-4 py-2 text-[#8d6508]">Stash</span>
            <span className="rounded-full bg-slate-700/10 px-4 py-2 text-slate-700">Trash</span>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="relative flex justify-center gap-4 overflow-hidden pb-5 text-5xl font-black leading-none sm:gap-8 sm:text-7xl">
        {cascade.map(({ letter, className }, index) => <span key={`${letter}-${index}`} className={`${className} animate-[float_5s_ease-in-out_infinite]`} style={{ animationDelay: `${index * 180}ms` }}>{letter}</span>)}
      </div>
    </section>
  );
}
