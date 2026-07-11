import { useEffect, useState } from "react";
import { Flame, Zap, TrendingUp } from "lucide-react";
import { readEngagement, ENGAGEMENT_EVENT, type Engagement } from "@/lib/engagement";

export function EngagementBar() {
  const [e, setE] = useState<Engagement | null>(null);

  useEffect(() => {
    const sync = () => setE(readEngagement());
    sync();
    window.addEventListener(ENGAGEMENT_EVENT, sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener(ENGAGEMENT_EVENT, sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  if (!e) return null;

  const nextMilestone = e.totalVerdicts < 10 ? 10 : e.totalVerdicts < 50 ? 50 : 100;
  const pct = Math.min(100, Math.round((e.totalVerdicts / nextMilestone) * 100));

  return (
    <div className="mb-6 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-1.5 font-semibold">
          <Flame className={e.streak > 0 ? "h-4 w-4 text-trash" : "h-4 w-4 text-muted-foreground"} />
          <span>{e.streak}-day streak</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Zap className="h-4 w-4 text-stash" />
          <span>{e.todayVerdicts} today</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span>{e.totalVerdicts} total</span>
        </div>
      </div>
      <div className="mt-3">
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-stash transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {nextMilestone - e.totalVerdicts > 0
            ? `${nextMilestone - e.totalVerdicts} more verdicts to your next badge`
            : "You're a top critic — brands are listening. 👑"}
        </p>
      </div>
    </div>
  );
}
