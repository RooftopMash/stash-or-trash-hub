import { BarChart3, CheckCircle2, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type FactorSignals = {
  evidence: number;
  response: number;
  experience: number;
  trust: number;
};

export function calculatePeopleTrustFactor(signals: FactorSignals) {
  const values = Object.values(signals);
  const score = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  return { score, signals };
}

export function PeopleTrustFactor({ signals, compact = false }: { signals: FactorSignals; compact?: boolean }) {
  const { score } = calculatePeopleTrustFactor(signals);
  const status = score >= 75 ? "Strong" : score >= 55 ? "Developing" : "Insufficient data";
  const scoreColor = score >= 75 ? "text-emerald-600" : score >= 55 ? "text-amber-600" : "text-muted-foreground";

  return (
    <section className={cn("rounded-2xl border border-stash/20 bg-stash/5", compact ? "p-4" : "p-5")} aria-labelledby="people-trust-factor-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-stash"><ShieldCheck className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-[0.16em]">People Trust Factor</span></div>
          <h3 id="people-trust-factor-title" className="mt-2 font-display text-xl font-bold">A transparent people-to-brand signal</h3>
        </div>
        <div className="text-right"><p className={cn("text-3xl font-extrabold", scoreColor)}>{score}</p><p className="text-xs font-semibold text-muted-foreground">{status}</p></div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">An internal SOT framework combining evidence quality, brand response, lived experience, and trust signals. It is not an external certification or endorsement.</p>
      {!compact && <div className="mt-4 grid gap-2 sm:grid-cols-4">{Object.entries(signals).map(([label, value]) => <div key={label} className="rounded-xl border border-border bg-background p-3"><div className="flex items-center justify-between gap-2"><span className="text-xs capitalize text-muted-foreground">{label}</span><span className="text-sm font-bold">{value}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-stash" style={{ width: `${value}%` }} /></div></div>)}</div>}
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Info className="h-3.5 w-3.5" />Scores require sufficient, comparable data and should be read with the supporting evidence.</div>
    </section>
  );
}

export function PeopleTrustFactorLink() {
  return <span className="inline-flex items-center gap-1 text-xs font-semibold text-stash"><BarChart3 className="h-3.5 w-3.5" />People Trust framework</span>;
}
