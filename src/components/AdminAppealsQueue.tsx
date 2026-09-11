import { useQuery } from "@tanstack/react-query";
import { Check, Gavel, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export function AdminAppealsQueue() {
  const { data: appeals, refetch } = useQuery({
    queryKey: ["admin-content-appeals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_appeals" as any)
        .select("id, review_id, appellant_id, reason, status, created_at")
        .in("status", ["open", "reviewing"])
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Array<{ id: string; review_id: string; appellant_id: string; reason: string; status: string; created_at: string }>;
    },
  });

  async function resolve(id: string, status: "upheld" | "overturned") {
    const { error } = await supabase
      .from("content_appeals" as any)
      .update({ status, resolved_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast.error("Could not resolve this appeal");
      return;
    }
    toast.success(status === "overturned" ? "Appeal overturned" : "Appeal upheld");
    refetch();
  }

  return (
    <div className="space-y-3">
      {!appeals?.length ? (
        <p className="text-sm text-muted-foreground">No open appeals.</p>
      ) : appeals.map((appeal) => (
        <article key={appeal.id} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <Gavel className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Review {appeal.review_id} · User {appeal.appellant_id}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm">{appeal.reason}</p>
              <Textarea className="mt-3" placeholder="Optional reviewer note" aria-label="Reviewer note" />
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => resolve(appeal.id, "overturned")} className="gap-1"><Check className="h-4 w-4" /> Overturn</Button>
                <Button size="sm" variant="outline" onClick={() => resolve(appeal.id, "upheld")} className="gap-1"><X className="h-4 w-4" /> Uphold</Button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
