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
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:py-20">
        <div className="order-2 max-w-xl lg:order-1">
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
        <div className="order-1 flex min-h-[280px] items-center justify-center lg:order-2 lg:min-h-[390px]">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
            <button type="button" aria-label="Stash: drop the coin" onMouseEnter={() => triggerObject("coin")} onFocus={() => triggerObject("coin")} onClick={() => triggerObject("coin")} className="group absolute inset-y-0 left-0 z-10 flex w-1/2 cursor-pointer items-end justify-start p-4 text-left">
              <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#9a720b] opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Stash</span>
            </button>
            <button type="button" aria-label="Trash: close the metal lid" onMouseEnter={() => triggerObject("bin")} onFocus={() => triggerObject("bin")} onClick={() => triggerObject("bin")} className="group absolute inset-y-0 right-0 z-10 flex w-1/2 cursor-pointer items-end justify-end p-4 text-right">
              <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-slate-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Trash</span>
            </button>
            <img
              src="/images/sot-home-objects.png"
              alt="A realistic gold coin beside a battered silver trash can"
              className={`h-auto w-full object-cover transition-transform duration-500 motion-reduce:transition-none ${activeObject === "coin" ? "-translate-y-3 rotate-1" : activeObject === "bin" ? "translate-y-2 -rotate-1" : ""}`}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/40 to-transparent" />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="relative flex justify-center gap-4 overflow-hidden pb-5 text-5xl font-black leading-none sm:gap-8 sm:text-7xl">
        {cascade.map(({ letter, className }, index) => <span key={`${letter}-${index}`} className={`${className} animate-[float_5s_ease-in-out_infinite]`} style={{ animationDelay: `${index * 180}ms` }}>{letter}</span>)}
      </div>
    </section>
  );
}
