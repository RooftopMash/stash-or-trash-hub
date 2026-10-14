import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Eye, Gavel, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type AppealStatus = "pending" | "under_review" | "upheld" | "reversed";
export const OPEN_APPEAL_STATUSES: AppealStatus[] = ["pending", "under_review"];

export function AdminAppealsQueue() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const { data: appeals, refetch } = useQuery({
    queryKey: ["admin-content-appeals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_appeals")
        .select("id, review_id, appellant_id, reason, status, created_at, reviewer_notes")
        .in("status", OPEN_APPEAL_STATUSES)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  async function setStatus(id: string, status: AppealStatus) {
    const final = status === "upheld" || status === "reversed";
    const { error } = await supabase
      .from("content_appeals")
      .update({
        status,
        reviewer_notes: notes[id]?.trim() || null,
        reviewed_by: user?.id ?? null,
        resolved_at: final ? new Date().toISOString() : null,
      })
      .eq("id", id);
    if (error) {
      toast.error("Could not update this appeal");
      return;
    }
    toast.success(
      status === "reversed" ? "Appeal reversed" : status === "upheld" ? "Appeal upheld" : "Marked under review",
    );
    refetch();
  }

  return (
    <div className="space-y-3">
      {!appeals?.length ? (
        <p className="text-sm text-muted-foreground">No open appeals.</p>
      ) : (
        appeals.map((appeal) => (
          <article key={appeal.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <Gavel className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  Review {appeal.review_id} · User {appeal.appellant_id} ·{" "}
                  {appeal.status === "under_review" ? "Under review" : "Pending"}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm">{appeal.reason}</p>
                <Textarea
                  className="mt-3"
                  placeholder="Optional reviewer note"
                  aria-label="Reviewer note"
                  value={notes[appeal.id] ?? appeal.reviewer_notes ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [appeal.id]: e.target.value }))}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {appeal.status === "pending" && (
                    <Button size="sm" variant="secondary" onClick={() => setStatus(appeal.id, "under_review")} className="gap-1">
                      <Eye className="h-4 w-4" /> Start review
                    </Button>
                  )}
                  <Button size="sm" onClick={() => setStatus(appeal.id, "reversed")} className="gap-1">
                    <Check className="h-4 w-4" /> Reverse decision
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setStatus(appeal.id, "upheld")} className="gap-1">
                    <X className="h-4 w-4" /> Uphold
                  </Button>
                </div>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
