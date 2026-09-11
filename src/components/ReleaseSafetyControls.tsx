import { useState } from "react";
import { AlertTriangle, Ban, FileCheck2, Flag, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const TERMS_VERSION = "2026-09-11";
const PRIVACY_VERSION = "2026-09-11";

export function ReleaseSafetyControls({ userId }: { userId: string }) {
  const [accepted, setAccepted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  async function saveConsent() {
    if (!accepted) return;
    setSaving(true);
    const { error } = await supabase.from("user_consents").upsert({
      user_id: userId,
      terms_version: TERMS_VERSION,
      privacy_version: PRIVACY_VERSION,
      marketing_opt_in: false,
    });
    setSaving(false);
    if (error) toast.error("Consent could not be saved");
    else toast.success("Consent recorded securely");
  }

  async function requestDeletion() {
    if (!window.confirm("Request permanent account deletion? This cannot be undone.")) return;
    setDeleting(true);
    const { error } = await supabase.from("account_deletion_requests").upsert({ user_id: userId, status: "requested" });
    setDeleting(false);
    if (error) toast.error("Deletion request could not be submitted");
    else toast.success("Deletion request submitted for processing");
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-stash" />
        <div>
          <h2 className="font-display text-lg font-bold">Release safety & privacy</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your consent, reports, blocks, and deletion requests are stored with owner-only access controls.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <a href="/terms" className="rounded-xl border border-border p-3 text-sm hover:border-stash"><FileCheck2 className="mb-2 h-4 w-4 text-stash" /><strong>Terms</strong><span className="mt-1 block text-xs text-muted-foreground">Version {TERMS_VERSION}</span></a>
        <a href="/privacy" className="rounded-xl border border-border p-3 text-sm hover:border-stash"><ShieldCheck className="mb-2 h-4 w-4 text-stash" /><strong>Privacy</strong><span className="mt-1 block text-xs text-muted-foreground">Version {PRIVACY_VERSION}</span></a>
        <div className="rounded-xl border border-destructive/30 p-3 text-sm"><Trash2 className="mb-2 h-4 w-4 text-destructive" /><strong>Delete account</strong><Button variant="destructive" size="sm" className="mt-2 w-full" onClick={requestDeletion} disabled={deleting}>{deleting ? "Submitting…" : "Request deletion"}</Button></div>
      </div>
      <div className="mt-4 flex items-start gap-3 border-t border-border pt-4"><Checkbox id="release-consent" checked={accepted} onCheckedChange={(value) => setAccepted(value === true)} /><label htmlFor="release-consent" className="text-xs leading-5 text-muted-foreground">I have read and accept the current Terms and Privacy Policy. I understand that public submissions may be reviewed for safety, authenticity, and policy compliance.</label></div>
      <Button className="mt-3" size="sm" onClick={saveConsent} disabled={!accepted || saving}>{saving ? "Saving…" : "Record consent"}</Button>
      <div className="mt-4 grid gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:grid-cols-3"><span className="flex items-center gap-2"><Flag className="h-3.5 w-3.5" /> Report harmful content</span><span className="flex items-center gap-2"><Ban className="h-3.5 w-3.5" /> Block unwanted contact</span><span className="flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5" /> Human appeal review</span></div>
    </section>
  );
}

export async function reportUGC(reporterId: string, targetType: "wall_post" | "item" | "comment" | "brand", targetId: string, reason: string, details?: string) {
  return supabase.from("ugc_reports").insert({ reporter_id: reporterId, target_type: targetType, target_id: targetId, reason, details });
}

export async function blockUser(blockerId: string, blockedId: string) {
  return supabase.from("user_blocks").insert({ blocker_id: blockerId, blocked_id: blockedId });
}
