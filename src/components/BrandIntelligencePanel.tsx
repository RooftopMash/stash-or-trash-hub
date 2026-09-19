import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Lightbulb,
  MessageSquareText,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { BrandKpis } from "@/lib/brand-platform";
import { cn } from "@/lib/utils";
import { PeopleTrustFactor } from "@/components/PeopleTrustFactor";

const signalCards = [
  {
    key: "positive",
    label: "Positive experiences",
    icon: CheckCircle2,
    tone: "text-emerald-600 bg-emerald-500/10",
  },
  {
    key: "negative",
    label: "Issues to resolve",
    icon: AlertCircle,
    tone: "text-rose-600 bg-rose-500/10",
  },
  {
    key: "neutral",
    label: "Ideas and questions",
    icon: Lightbulb,
    tone: "text-amber-700 bg-amber-500/10",
  },
] as const;

export function BrandIntelligencePanel({ kpis }: { kpis: BrandKpis }) {
  const answered = Math.max(0, kpis.posts - kpis.unanswered);
  const responseRate = kpis.posts ? Math.round((answered / kpis.posts) * 100) : 0;
  const totalSignals = kpis.positive + kpis.neutral + kpis.negative;

  return (
    <section
      className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-sm"
      aria-labelledby="intelligence-title"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-stash">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-[0.16em]">
              People intelligence · last 30 days
            </span>
          </div>
          <h3 id="intelligence-title" className="mt-2 font-display text-xl font-bold">
            Turn public experience into action
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            A transparent view of what people are saying, how quickly the team responds, and where
            trust can be strengthened. Missing data is shown as missing—not treated as a negative
            signal.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-secondary/50 px-4 py-3 text-right">
          <p className="text-2xl font-extrabold">{responseRate}%</p>
          <p className="text-xs text-muted-foreground">response coverage</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {signalCards.map(({ key, label, icon: Icon, tone }) => {
          const value = kpis[key];
          const share = totalSignals ? Math.round((value / totalSignals) * 100) : 0;
          return (
            <div key={key} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <span className={cn("rounded-lg p-2", tone)}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-2xl font-bold">{value}</span>
              </div>
              <p className="mt-3 text-sm font-semibold">{label}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-foreground/70"
                  style={{ width: `${share}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{share}% of classified signals</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric icon={MessageSquareText} label="Total conversations" value={kpis.posts} />
        <Metric
          icon={Clock3}
          label="Median response"
          value={
            kpis.median_response_minutes ? `${kpis.median_response_minutes} min` : "No data yet"
          }
        />
        <Metric
          icon={Users}
          label="Unanswered"
          value={kpis.unanswered}
          accent={kpis.unanswered > 0}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Evidence, methodology, and community context should accompany every public claim.
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-stash"
        >
          View reporting guide <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-5">
        <PeopleTrustFactor
          signals={{
            evidence: Math.min(100, 45 + kpis.posts * 2),
            response: responseRate,
            experience: totalSignals
              ? Math.round(((kpis.positive + kpis.neutral) / totalSignals) * 100)
              : 0,
            trust: responseRate,
          }}
        />
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: typeof MessageSquareText;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
      <Icon className={cn("h-4 w-4 text-muted-foreground", accent && "text-rose-600")} />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("font-bold", accent && "text-rose-600")}>{value}</p>
      </div>
    </div>
  );
}
