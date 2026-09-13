import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Coins, Recycle } from "lucide-react";
import { playStashSound, playTrashSound } from "@/lib/verdict-sounds";
import { SotWordmark } from "@/components/SotWordmark";

const cascade = [
  { letter: "S", className: "text-[#d6a928]", position: "left-[3%] top-[8%] rotate-[-14deg]" },
  { letter: "O", className: "text-slate-950", position: "left-[19%] top-[40%] rotate-[12deg]" },
  { letter: "r", className: "text-[#e34b4b]", position: "left-[37%] top-[10%] rotate-[-8deg]" },
  { letter: "T", className: "text-[#2563eb]", position: "left-[54%] top-[48%] rotate-[15deg]" },
  { letter: "S", className: "text-[#e34b4b]", position: "left-[70%] top-[14%] rotate-[9deg]" },
  { letter: "O", className: "text-[#d6a928]", position: "left-[84%] top-[42%] rotate-[-12deg]" },
  { letter: "r", className: "text-[#2563eb]", position: "left-[11%] top-[72%] rotate-[8deg]" },
  { letter: "T", className: "text-slate-950", position: "left-[43%] top-[78%] rotate-[-10deg]" },
  { letter: "S", className: "text-[#2563eb]", position: "left-[76%] top-[73%] rotate-[14deg]" },
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
        <div className="relative z-10 order-1 flex min-h-[360px] items-center justify-center lg:min-h-[440px]">
          <div className="mx-auto grid w-full max-w-4xl gap-10 sm:grid-cols-2 sm:gap-12 lg:max-w-[52rem]">
            <button type="button" aria-label="Stash: drop the coin" onMouseEnter={() => triggerObject("coin")} onFocus={() => triggerObject("coin")} onClick={() => triggerObject("coin")} className="group flex min-w-0 items-center justify-center bg-transparent p-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d6a928]/40">
              <span className="sr-only">Stash</span>
              <span className="relative flex h-72 w-full items-end justify-center sm:h-80">
                <img src="/images/sot-coin.png" alt="$OrT gold coin, 2026" className={`w-full max-w-sm origin-center motion-reduce:transition-none ${activeObject === "coin" ? "sot-coin-fall" : ""}`} />
                <span aria-hidden="true" className="absolute bottom-1 h-2 w-44 rounded-[50%] bg-slate-950/15 blur-sm" />
              </span>
            </button>
            <button type="button" aria-label="Trash: close the metal lid" onMouseEnter={() => triggerObject("bin")} onFocus={() => triggerObject("bin")} onClick={() => triggerObject("bin")} className="group flex min-w-0 items-center justify-center bg-transparent p-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/40">
              <span className="sr-only">Trash</span>
              <span className="relative flex h-72 w-full items-end justify-center sm:h-80">
                <img src="/images/sot-trash-can.png" alt="Battered silver trash can with recycle symbol" className="absolute bottom-0 w-full max-w-sm [clip-path:inset(16%_0_0_0)]" />
                <img src="/images/sot-trash-can.png" alt="" aria-hidden="true" className={`absolute bottom-0 w-full max-w-sm [clip-path:inset(0_0_84%_0)] ${activeObject === "bin" ? "sot-bin-lid-close" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden text-[clamp(4.5rem,14vw,11rem)] font-black leading-none">
        {cascade.map(({ letter, className, position }, index) => <span key={`${letter}-${index}`} className={`absolute ${position} ${className} sot-letter-cascade`} style={{ animationDelay: `${index * 180}ms` }}>{letter}</span>)}
      </div>
    </section>
  );
}
