import { Bot, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const plans = [
  { name: "Starter", tone: "secondary", features: ["Pre-publication text checks", "Basic brand guidance"] },
  { name: "Growth", tone: "default", features: ["Photo and video review queue", "CX response drafts", "Sentiment summaries"] },
  { name: "Enterprise", tone: "outline", features: ["Advanced media risk review", "Real-time diagnostics", "Audit exports and priority review"] },
] as const;

export function BrandAICopilot() {
  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-trash/10 p-2 text-trash"><Bot className="h-5 w-5" /></div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-trash">AI trust workspace</p>
            <h2 className="mt-1 font-display text-xl font-extrabold">Content gate + brand copilot</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Review AI-edited media, prank products, and risky claims before publication. Then help brands draft useful replies without replacing human accountability.</p>
          </div>
        </div>
        <Badge variant="outline" className="w-fit gap-1"><LockKeyhole className="h-3.5 w-3.5" /> Human review remains in control</Badge>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-2"><h3 className="font-display font-bold">{plan.name}</h3><Badge variant={plan.tone}>{plan.name === "Enterprise" ? "Custom" : "Included"}</Badge></div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {plan.features.map((feature) => <li key={feature} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-stash" />{feature}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground"><Sparkles className="h-4 w-4 text-stash" /> Every review produces an explainable status, findings, and audit trail—not an unreviewable black box.</div>
    </section>
  );
}
