import { Link } from "@tanstack/react-router";
import { ArrowRight, Coins, Recycle } from "lucide-react";
import { SotWordmark } from "@/components/SotWordmark";

const cascade = [
  { letter: "S", className: "text-[#d6a928]" },
  { letter: "O", className: "text-slate-950" },
  { letter: "r", className: "text-[#e34b4b]" },
  { letter: "T", className: "text-[#2563eb]" },
];

export function SotHomeHero() {
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
            <Link to="/brands" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
              Explore brands <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/awards" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
              See the live awards <Recycle className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="order-1 flex min-h-[280px] items-center justify-center lg:order-2 lg:min-h-[390px]">
          <div className="relative flex w-full max-w-2xl items-center justify-between gap-4 sm:gap-10">
            <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f8dd72] via-[#d6a928] to-[#966b08] shadow-[12px_18px_0_rgba(51,65,85,0.12),inset_-12px_-12px_20px_rgba(92,64,3,0.25),inset_10px_10px_18px_rgba(255,248,190,0.6)] sm:h-56 sm:w-56">
              <div className="absolute inset-4 rounded-full border-2 border-[#fff1a8]/70" />
              <SotWordmark size="lg" className="relative scale-125" />
            </div>
            <div className="absolute left-1/2 top-1/2 hidden h-px w-1/4 -translate-x-1/2 bg-slate-300 sm:block" />
            <div className="relative flex h-44 w-32 shrink-0 flex-col items-center justify-center rounded-b-[2rem] rounded-t-lg border-4 border-slate-500 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 shadow-[10px_14px_0_rgba(51,65,85,0.14)] before:absolute before:-top-5 before:h-8 before:w-36 before:rounded-full before:border-4 before:border-slate-500 before:bg-slate-300 after:absolute after:bottom-8 after:left-5 after:h-2 after:w-20 after:rotate-12 after:rounded-full after:bg-slate-500/50 sm:h-60 sm:w-44 sm:before:w-48">
              <div className="absolute left-3 top-14 h-10 w-4 -rotate-12 rounded-full bg-slate-500/40" />
              <div className="absolute right-4 top-24 h-14 w-3 rotate-45 rounded-full bg-slate-600/40" />
              <div className="absolute bottom-14 left-8 h-3 w-16 -rotate-6 rounded-full bg-slate-700/40" />
              <span className="relative mt-8 text-center text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Make it better</span>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="relative flex justify-center gap-4 overflow-hidden pb-5 text-5xl font-black leading-none sm:gap-8 sm:text-7xl">
        {cascade.map(({ letter, className }, index) => <span key={`${letter}-${index}`} className={`${className} animate-[float_5s_ease-in-out_infinite]`} style={{ animationDelay: `${index * 180}ms` }}>{letter}</span>)}
      </div>
    </section>
  );
}
