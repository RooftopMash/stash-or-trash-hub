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
          <div className="relative flex h-8 overflow-hidden rounded-lg bg-secondary">
            {/* Stash Side Progress with Coins Falling from a Bag Watermark */}
            <div
              className="relative bg-stash transition-all duration-500 flex items-center justify-start overflow-hidden"
              style={{ width: `${stashPct}%` }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay flex items-center pl-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 50"
                  className="h-full w-auto select-none"
                >
                  {/* Bag / Sack at top-left */}
                  <path
                    d="M10 5 C5 5, 2 12, 5 18 C7 22, 13 24, 20 22 C25 20, 25 15, 25 10 C25 5, 15 5, 10 5 Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 5 C12 7, 18 7, 20 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Raining / Falling gold coins */}
                  <circle cx="15" cy="28" r="3" fill="currentColor" />
                  <circle cx="28" cy="22" r="3" fill="currentColor" />
                  <circle cx="22" cy="36" r="3" fill="currentColor" />
                  <circle cx="38" cy="30" r="3" fill="currentColor" />
                  <circle cx="32" cy="42" r="3" fill="currentColor" />
                  <circle cx="48" cy="24" r="3" fill="currentColor" />
                  <circle cx="45" cy="40" r="3" fill="currentColor" />
                  <circle cx="58" cy="34" r="3" fill="currentColor" />
                  {/* Coin details (inner circles) */}
                  <circle
                    cx="15"
                    cy="28"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    fill="none"
                  />
                  <circle
                    cx="28"
                    cy="22"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    fill="none"
                  />
                  <circle
                    cx="22"
                    cy="36"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    fill="none"
                  />
                  <circle
                    cx="38"
                    cy="30"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="42"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="24"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {/* Trash Side Progress with Recycle Bin filled with dirt/crumpled items Watermark */}
            <div
              className="relative bg-trash transition-all duration-500 flex items-center justify-end overflow-hidden"
              style={{ width: `${100 - stashPct}%` }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay flex items-center justify-end pr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 50"
                  className="h-full w-auto select-none"
                >
                  {/* Trash Can outline */}
                  <path
                    d="M60 42 L64 15 L90 15 L94 42 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  {/* Handle & Lid */}
                  <path d="M62 15 L92 15" stroke="currentColor" strokeWidth="4" />
                  <path
                    d="M72 15 L72 12 C72 10, 82 10, 82 12 L82 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Trash can vertical ribs */}
                  <line x1="69" y1="18" x2="67" y2="39" stroke="currentColor" strokeWidth="2" />
                  <line x1="77" y1="18" x2="77" y2="39" stroke="currentColor" strokeWidth="2" />
                  <line x1="85" y1="18" x2="87" y2="39" stroke="currentColor" strokeWidth="2" />
                  {/* Dirt/crumpled waste filling & spilling over the bin */}
                  <path d="M58 14 Q63 4, 70 12 Q75 5, 82 14 Q88 6, 94 15 Z" fill="currentColor" />
                  {/* Crumpled waste elements raining down */}
                  <circle cx="50" cy="12" r="2.5" fill="currentColor" />
                  <circle cx="42" cy="20" r="2" fill="currentColor" />
                  <circle cx="53" cy="26" r="1.5" fill="currentColor" />
                  <path d="M45 32 L49 35 L43 38 Z" fill="currentColor" />
                </svg>
              </div>
            </div>
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
