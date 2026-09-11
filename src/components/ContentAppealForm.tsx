import { useState } from "react";
import { Gavel } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function ContentAppealForm({ reviewId }: { reviewId: string }) {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submitAppeal() {
    if (!user || reason.trim().length < 10) {
      toast.error("Please explain the appeal in at least 10 characters");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("content_appeals").insert({
      review_id: reviewId,
      appellant_id: user.id,
      reason: reason.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit appeal");
      return;
    }
    setReason("");
    setOpen(false);
    toast.success("Appeal submitted for human review");
  }

  if (!user) return null;

  return (
    <div className="mt-3 border-t border-border pt-3">
      <Button type="button" size="sm" variant="ghost" onClick={() => setOpen((value) => !value)}>
        <Gavel className="h-3.5 w-3.5" /> Appeal decision
      </Button>
      {open && (
        <div className="mt-2 space-y-2">
          <Textarea value={reason} onChange={(event) => setReason(event.target.value)} minLength={10} maxLength={2000} placeholder="Explain why this decision should be reviewed by a human..." aria-label="Appeal reason" />
          <Button type="button" size="sm" onClick={submitAppeal} disabled={submitting || reason.trim().length < 10}>
            {submitting ? "Submitting..." : "Submit appeal"}
          </Button>
        </div>
      )}
    </div>
  );
}

export async function fetchMyAppeals(userId: string) {
  return supabase.from("content_appeals").select("id, review_id, status, reason, created_at, resolved_at").eq("appellant_id", userId).order("created_at", { ascending: false });
}
