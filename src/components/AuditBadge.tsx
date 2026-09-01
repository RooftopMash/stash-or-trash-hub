import { ShieldCheck, ShieldAlert, Copy, HelpCircle } from "lucide-react";
import type { MediaAuditReport } from "@/lib/media-forensics";

function tierConfig(audit: MediaAuditReport) {
  switch (audit.tier) {
    case "flagged":
      return { label: "Flagged by checks", cls: "bg-red-500/10 text-red-500 border-red-500/20", Icon: ShieldAlert };
    case "reused":
      return { label: "Possible reused media", cls: "bg-amber-500/10 text-amber-500 border-amber-500/20", Icon: Copy };
    case "clean":
      return { label: "Media check passed", cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", Icon: ShieldCheck };
    default:
      return { label: "Media check inconclusive", cls: "bg-muted text-muted-foreground border-border", Icon: HelpCircle };
  }
}

export function AuditBadge({ audit }: { audit: MediaAuditReport }) {
  const { label, cls, Icon } = tierConfig(audit);
  return (
    <span
      className={"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold " + cls}
      title={audit.flags.join(". ") || audit.provenance.notes.join(". ")}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
