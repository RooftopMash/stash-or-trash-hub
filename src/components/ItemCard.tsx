import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "@tanstack/react-router";
import type { FeedItem, Verdict } from "@/lib/stash";
import { castVote, removeVote, deleteItem } from "@/lib/stash";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { recordVote, emitEngagementChange } from "@/lib/engagement";

export function ItemCard({ item, onChange }: { item: FeedItem; onChange: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  // Optimistic UI state
  const [optimisticVerdict, setOptimisticVerdict] = useState<Verdict | null>(null);
  const [optimisticStashCount, setOptimisticStashCount] = useState<number>(0);
  const [optimisticTrashCount, setOptimisticTrashCount] = useState<number>(0);

  // Sync state when parent item changes (if not locally/actively updating)
  const isSyncing = useRef(false);
  const pendingVoteRef = useRef<Verdict | null | undefined>(undefined);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isSyncing.current) {
      setOptimisticVerdict(item.myVerdict);
      setOptimisticStashCount(item.stashCount);
      setOptimisticTrashCount(item.trashCount);
    }
  }, [item.myVerdict, item.stashCount, item.trashCount]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const total = optimisticStashCount + optimisticTrashCount;
  const stashPct = total === 0 ? 50 : Math.round((optimisticStashCount / total) * 100);

  const submitVote = async (targetVerdict: Verdict | null) => {
    if (!user) return;
    setBusy(true);
    try {
      if (targetVerdict === null) {
        await removeVote(item.id, user.id);
      } else {
        await castVote(item.id, user.id, targetVerdict);
        const { reward, milestone } = recordVote();
        emitEngagementChange();
        toast.success(milestone ?? reward);
      }
      onChange();
    } catch (e) {
      // Revert optimistic state on error
      setOptimisticVerdict(item.myVerdict);
      setOptimisticStashCount(item.stashCount);
      setOptimisticTrashCount(item.trashCount);
      toast.error(e instanceof Error ? e.message : "Vote failed.");
    } finally {
      isSyncing.current = false;
      setBusy(false);
    }
  };

  const vote = (verdict: Verdict) => {
    if (!user) {
      toast.info("Sign in to cast your verdict.");
      navigate({ to: "/auth" });
      return;
    }

    isSyncing.current = true;

    // Calculate next local optimistic state based on current optimistic state
    let nextVerdict: Verdict | null = null;
    let nextStash = optimisticStashCount;
    let nextTrash = optimisticTrashCount;

    if (optimisticVerdict === verdict) {
      // Retracting vote
      nextVerdict = null;
      if (verdict === "stash") {
        nextStash = Math.max(0, nextStash - 1);
      } else {
        nextTrash = Math.max(0, nextTrash - 1);
      }
    } else {
      // Changing vote or adding new vote
      if (optimisticVerdict === "stash") {
        nextStash = Math.max(0, nextStash - 1);
      } else if (optimisticVerdict === "trash") {
        nextTrash = Math.max(0, nextTrash - 1);
      }

      nextVerdict = verdict;
      if (verdict === "stash") {
        nextStash += 1;
      } else {
        nextTrash += 1;
      }
    }

    setOptimisticVerdict(nextVerdict);
    setOptimisticStashCount(nextStash);
    setOptimisticTrashCount(nextTrash);

    // Debounce submission to database
    pendingVoteRef.current = nextVerdict;
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const targetVote = pendingVoteRef.current;
      if (targetVote !== undefined) {
        submitVote(targetVote);
      }
    }, 450);
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteItem(item.id);
      toast.success("Deleted.");
      onChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      {item.signedImageUrl && (
        <img
          src={item.signedImageUrl}
          alt={item.title}
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            {(item.brandName || item.category) && (
              <div className="mb-1 flex flex-wrap items-center gap-2">
                {item.brandName && item.brandSlug && (
                  <Link
                    to="/brands/$slug"
                    params={{ slug: item.brandSlug }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {item.brandName}
                  </Link>
                )}
                {item.category && (
                  <Badge variant="secondary" className="text-[10px]">
                    {item.category}
                  </Badge>
                )}
              </div>
            )}
            <h3 className="font-display text-xl font-bold leading-tight">{item.title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">by {item.authorName}</p>
          </div>
          {user?.id === item.user_id && (
            <button
              onClick={handleDelete}
              disabled={busy}
              className="text-muted-foreground transition-colors hover:text-trash"
              aria-label="Delete post"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {item.description && (
          <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
        )}

        {/* verdict meter */}
        <div className="mt-4">
          <div className="flex h-2.5 overflow-hidden rounded-full bg-secondary">
            <div className="bg-stash" style={{ width: `${stashPct}%` }} />
            <div className="bg-trash" style={{ width: `${100 - stashPct}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-xs font-medium">
            <span className="text-stash">{optimisticStashCount} stash</span>
            <span className="text-muted-foreground">
              {total === 0 ? "No votes yet" : `${stashPct}% stash`}
            </span>
            <span className="text-trash">{optimisticTrashCount} trash</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => vote("stash")}
            className={cn(
              "gap-2 border-stash/40 hover:bg-stash/10 hover:text-stash",
              optimisticVerdict === "stash" &&
                "bg-stash text-stash-foreground hover:bg-stash hover:text-stash-foreground",
            )}
          >
            <ThumbsUp className="h-4 w-4" /> Stash
          </Button>
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => vote("trash")}
            className={cn(
              "gap-2 border-trash/40 hover:bg-trash/10 hover:text-trash",
              optimisticVerdict === "trash" &&
                "bg-trash text-trash-foreground hover:bg-trash hover:text-trash-foreground",
            )}
          >
            <Trash2 className="h-4 w-4" /> Trash
          </Button>
        </div>
      </div>
    </article>
  );
}
