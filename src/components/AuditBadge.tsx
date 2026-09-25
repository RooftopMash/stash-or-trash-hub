import { ShieldCheck, ShieldAlert, AlertTriangle, Sparkles, Copy, HelpCircle } from "lucide-react";
import type { MediaAuditReport } from "@/lib/media-forensics";

export function AuditBadge({ audit }: { audit: MediaAuditReport }) {
  if (audit.aiVerification) {
    const ai = audit.aiVerification;
    const isAuthentic = ai.isLegitimate && ai.score >= 70;
    const isAiGenerated = ai.verdictStatus === "ai_generated";

    let cls = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    let Icon = ShieldCheck;
    if (isAiGenerated) {
      cls = "bg-rose-500/10 text-rose-600 border-rose-500/20";
      Icon = ShieldAlert;
    } else if (!isAuthentic) {
      cls = "bg-amber-500/10 text-amber-600 border-amber-500/20";
      Icon = AlertTriangle;
    }

    const titleText = [
      ai.badgeLabel,
      `Authenticity: ${ai.score}%`,
      ai.reasons?.slice(0, 2).join(". "),
      ai.flags?.join(". "),
    ]
      .filter(Boolean)
      .join(" | ");

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cls}`}
        title={titleText}
      >
        <Icon className="h-3 w-3" />
        <span className="font-bold">{ai.score}%</span> {ai.badgeLabel || (isAuthentic ? "AI-Verified" : "Caution")}
      </span>
    );
  }

  // Fallback to client-side heuristics
  let label = "Media check passed";
  let cls = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  let Icon = ShieldCheck;

  switch (audit.tier) {
    case "flagged":
      label = "Flagged by checks";
      cls = "bg-red-500/10 text-red-500 border-red-500/20";
      Icon = ShieldAlert;
      break;
    case "reused":
      label = "Possible reused media";
      cls = "bg-amber-500/10 text-amber-500 border-amber-500/20";
      Icon = Copy;
      break;
    case "clean":
      label = "Media check passed";
      cls = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      Icon = ShieldCheck;
      break;
    default:
      label = "Media check inconclusive";
      cls = "bg-muted text-muted-foreground border-border";
      Icon = HelpCircle;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cls}`}
      title={audit.flags.join(". ") || audit.provenance.notes.join(". ")}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
