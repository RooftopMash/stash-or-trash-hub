import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Eye, Flag, RefreshCw, ShieldAlert, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export type UgcReportStatus = "pending" | "investigating" | "resolved" | "dismissed";

interface UgcReportRow {
  id: string;
  reporter_id: string;
  target_type: "wall_post" | "item" | "comment" | "brand";
  target_id: string;
  reason: string;
  details: string | null;
  status: UgcReportStatus;
  created_at: string;
  updated_at: string;
}

const OPEN_STATUSES: UgcReportStatus[] = ["pending", "investigating"];

export function AdminReportsQueue() {
  const [filter, setFilter] = useState<"open" | "closed" | "all">("open");
  const [moderatorNotes, setModeratorNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const {
    data: reports = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-ugc-reports", filter],
    queryFn: async () => {
      let q = supabase
        .from("ugc_reports")
        .select("id, reporter_id, target_type, target_id, reason, details, status, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (filter === "open") {
        q = q.in("status", OPEN_STATUSES);
      } else if (filter === "closed") {
        q = q.in("status", ["resolved", "dismissed"]);
      }

      const { data, error: fetchError } = await q;
      if (fetchError) throw fetchError;
      return (data ?? []) as UgcReportRow[];
    },
  });

  async function updateReport(report: UgcReportRow, nextStatus: UgcReportStatus, hideTarget = false) {
    setBusyId(report.id);
    try {
      const note = moderatorNotes[report.id]?.trim();
      const updatedDetails = note
        ? `${report.details ? `${report.details}\n` : ""}[Moderator Note]: ${note}`
        : report.details;

      const { error: updateErr } = await supabase
        .from("ugc_reports")
        .update({
          status: nextStatus,
          details: updatedDetails,
          updated_at: new Date().toISOString(),
        })
        .eq("id", report.id);

      if (updateErr) {
        toast.error(
          "Could not update report status. Confirm an admin RLS update policy exists on public.ugc_reports.",
        );
        return;
      }

      if (hideTarget && report.target_type === "item") {
        await supabase
          .from("items")
          .update({
            dispute_status: "under_review",
            dispute_resolution_notes: note || `Flagged by moderation (${report.reason})`,
          })
          .eq("id", report.target_id);
      }

      toast.success(
        nextStatus === "resolved"
          ? hideTarget
            ? "Report resolved & target flagged for review."
            : "Report marked resolved."
          : nextStatus === "dismissed"
            ? "Report dismissed."
            : "Report marked under investigation.",
      );
      await refetch();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: "open", label: "Open Reports" },
              { id: "closed", label: "Actioned / Dismissed" },
              { id: "all", label: "All Reports" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "rounded-md border px-3 py-1 text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer",
                filter === tab.id
                  ? "border-[#d6a928] bg-[#d6a928] text-slate-950"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => void refetch()}
          className="h-8 gap-1.5 text-xs whitespace-nowrap shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Queue
        </Button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-200">
          <div className="flex items-start gap-2">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <p className="font-bold">Unable to load global UGC reports queue</p>
              <p className="mt-1 opacity-90">
                {error instanceof Error ? error.message : "Permission denied or database unreachable."} Ensure an admin SELECT/UPDATE RLS policy is enabled for moderators on <code>public.ugc_reports</code>.
              </p>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground">Loading community safety reports…</p>
      ) : reports.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No {filter === "open" ? "open" : filter === "closed" ? "closed" : ""} UGC moderation reports in this view.
        </p>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <article key={report.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <Flag className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-bold uppercase text-foreground">{report.target_type}</span> · Target{" "}
                      <span className="font-mono">{report.target_id.slice(0, 14)}</span> · Reporter{" "}
                      <span className="font-mono">{report.reporter_id.slice(0, 8)}</span>
                    </p>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-black uppercase",
                        report.status === "resolved"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : report.status === "dismissed"
                            ? "bg-secondary text-muted-foreground"
                            : report.status === "investigating"
                              ? "bg-amber-500/15 text-amber-600"
                              : "bg-rose-500/15 text-rose-600",
                      )}
                    >
                      {report.status}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm font-bold text-foreground">{report.reason}</p>
                  {report.details && (
                    <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{report.details}</p>
                  )}

                  <Textarea
                    className="mt-3 text-xs"
                    placeholder="Optional moderator note (audit log)..."
                    aria-label="Moderator note"
                    value={moderatorNotes[report.id] ?? ""}
                    onChange={(e) =>
                      setModeratorNotes((prev) => ({ ...prev, [report.id]: e.target.value }))
                    }
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    {report.status === "pending" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={busyId === report.id}
                        onClick={() => void updateReport(report, "investigating")}
                        className="gap-1 text-xs whitespace-nowrap shrink-0"
                      >
                        <Eye className="h-3.5 w-3.5" /> Mark Investigating
                      </Button>
                    )}
                    {report.status !== "resolved" && (
                      <Button
                        size="sm"
                        disabled={busyId === report.id}
                        onClick={() => void updateReport(report, "resolved", true)}
                        className="gap-1 bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 whitespace-nowrap shrink-0"
                      >
                        <Check className="h-3.5 w-3.5" /> Resolve &amp; Hide Target
                      </Button>
                    )}
                    {report.status !== "dismissed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === report.id}
                        onClick={() => void updateReport(report, "dismissed")}
                        className="gap-1 text-xs whitespace-nowrap shrink-0"
                      >
                        <X className="h-3.5 w-3.5" /> Dismiss Report
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
