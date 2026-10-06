import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ShieldAlert, Clock3, Sparkles, Building2, ChevronDown, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { updateItemDisputeStatus, type DisputeStatus, type FeedItem } from "@/lib/stash";

interface DisputeResolutionBadgeProps {
  item: FeedItem;
  onChange?: () => void;
}

const DEFAULT_RESOLUTION_NOTES: Record<DisputeStatus, string> = {
  rectified: "Replacement issued or verified resolution provided directly by the brand team.",
  under_review: "Brand CX team has acknowledged this dispute and is investigating the reported batch/item.",
  unresolved: "Community Trash verdict recorded. Pending brand dispute investigation.",
};

export function DisputeResolutionBadge({ item, onChange }: DisputeResolutionBadgeProps) {
  const { user } = useAuth();
  const { isBrand } = useRoles();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<DisputeStatus>(
    item.disputeStatus ?? "under_review",
  );
  const [customNotes, setCustomNotes] = useState(item.disputeResolutionNotes ?? "");
  const [updating, setUpdating] = useState(false);

  // We show the dispute banner if the item has trash votes > stash votes, or user voted trash, or disputeStatus was explicitly set
  const isTrashVerdict =
    item.myVerdict === "trash" || item.trashCount > item.stashCount || !!item.disputeStatus;

  if (!isTrashVerdict) {
    return null;
  }

  const currentStatus: DisputeStatus = item.disputeStatus ?? "unresolved";
  const isAuthor = user?.id === item.user_id;
  const canManageDispute = !!user && (isBrand || isAuthor);

  const handleSaveDispute = async () => {
    setUpdating(true);
    try {
      await updateItemDisputeStatus(
        item.id,
        selectedStatus,
        customNotes.trim() || DEFAULT_RESOLUTION_NOTES[selectedStatus],
      );
      toast.success(
        selectedStatus === "rectified"
          ? "Dispute successfully marked as Rectified by Brand!"
          : "Dispute status updated.",
      );
      setModalOpen(false);
      onChange?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update dispute status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-border/80 bg-card/60 p-3 shadow-sm backdrop-blur-sm transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {currentStatus === "rectified" ? (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Rectified by Brand</span>
            </div>
          ) : currentStatus === "under_review" ? (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Clock3 className="h-3.5 w-3.5" />
              <span>Under Brand Review</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-rose-300">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Unresolved Consumer Dispute</span>
            </div>
          )}

          {item.brandName && (
            <span className="text-[11px] text-muted-foreground">
              Target: <strong className="text-foreground">{item.brandName}</strong>
            </span>
          )}
        </div>

        {canManageDispute && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedStatus(item.disputeStatus ?? "under_review");
              setCustomNotes(item.disputeResolutionNotes ?? "");
              setModalOpen(true);
            }}
            className="h-7 gap-1 border-primary/30 bg-primary/10 px-2.5 text-[11px] font-semibold text-primary hover:bg-primary/20"
          >
            <span>Update Status</span>
            <ChevronDown className="h-3 w-3 opacity-70" />
          </Button>
        )}
      </div>

      {/* Resolution Notes display */}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground/90">
        {item.disputeResolutionNotes || DEFAULT_RESOLUTION_NOTES[currentStatus]}
      </p>

      {/* F-DOR (From Day One Revenue) Claim Banner if unresolved and has brand */}
      {currentStatus !== "rectified" && item.brandName && !canManageDispute && (
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[11px]">
          <div className="flex items-center gap-1.5 text-primary">
            <Building2 className="h-3 w-3" />
            <span>Are you with <strong>{item.brandName}</strong>?</span>
          </div>
          <Link
            to="/auth"
            search={{ intent: "brand", brand: item.brandSlug || item.brandName }}
            className="font-semibold text-primary underline underline-offset-2 hover:opacity-80"
          >
            Claim Brand Voice to Rectify & Respond →
          </Link>
        </div>
      )}

      {/* Dispute Management Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Brand Dispute & Accountability Matrix
            </DialogTitle>
            <DialogDescription>
              Update the dispute resolution status for <strong>{item.title}</strong>. This signal is
              visible publicly to consumers across the network.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Select Resolution Status
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStatus("rectified")}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                    selectedStatus === "rectified"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                      : "border-border hover:bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      Rectified by Brand
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Customer received a replacement, refund, or validated batch explanation.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStatus("under_review")}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                    selectedStatus === "under_review"
                      ? "border-amber-500 bg-amber-500/10 text-amber-300"
                      : "border-border hover:bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      Under Brand Review
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Brand CX desk is actively investigating the batch and communicating with the user.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStatus("unresolved")}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                    selectedStatus === "unresolved"
                      ? "border-rose-500 bg-rose-500/10 text-rose-300"
                      : "border-border hover:bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      Unresolved Complaint
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Dispute remains open awaiting brand outreach and remedy.
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Public Resolution Notes (Optional)
              </label>
              <Textarea
                placeholder="E.g., Verified replacement unit sent via courier; customer tested batch and confirmed satisfaction."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={3}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={updating}
              onClick={handleSaveDispute}
              className="gap-1.5"
            >
              {updating ? "Saving..." : "Apply Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
