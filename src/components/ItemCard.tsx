import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "@tanstack/react-router";
import type { FeedItem, Verdict } from "@/lib/stash";
import { castVote, removeVote, deleteItem } from "@/lib/stash";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import coinIcon from "@/assets/icon-coin.png";
import binIcon from "@/assets/icon-bin.png";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { recordVote, emitEngagementChange } from "@/lib/engagement";
import { ItemCardActions } from "@/components/ItemCardActions";
import { CommentThread } from "@/components/CommentThread";
import { PostText } from "@/components/PostText";
import { AuditBadge } from "@/components/AuditBadge";

export function ItemCard({
  item,
  onChange,
  defaultCommentsOpen = false,
}: {
  item: FeedItem;
  onChange: () => void;
  defaultCommentsOpen?: boolean;
}) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(defaultCommentsOpen);

  const total = item.stashCount + item.trashCount;
  const stashPct = total === 0 ? 50 : Math.round((item.stashCount / total) * 100);

  const vote = async (verdict: Verdict) => {
    if (!user) {
      toast.info(t("vote.signInPrompt"));
      navigate({ to: "/auth" });
      return;
    }
    setBusy(true);
    try {
      if (item.myVerdict === verdict) {
        await removeVote(item.id, user.id);
      } else {
        await castVote(item.id, user.id, verdict);
        const { reward, milestone } = recordVote();
        emitEngagementChange();
        toast.success(milestone ?? reward);
      }
      onChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("vote.voteFailed"));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteItem(item.id);
      toast.success(t("vote.deleted"));
      onChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("vote.deleteFailed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      {item.signedImageUrl && (
        <Link to="/items/$id" params={{ id: item.id }}>
          <img
            src={item.signedImageUrl}
            alt={item.title}
            className="aspect-video w-full object-cover"
            loading="lazy"
          />
        </Link>
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
                {item.audit && <AuditBadge audit={item.audit} />}
              </div>
            )}
            <h3 className="font-display text-xl font-bold leading-tight">
              <Link to="/items/$id" params={{ id: item.id }} className="hover:underline">
                <PostText text={item.title} />
              </Link>
            </h3>
            <Link
              to="/users/$id"
              params={{ id: item.user_id }}
              className="mt-0.5 block text-xs text-muted-foreground hover:underline"
            >
              {t("vote.by", { name: item.authorName })}
            </Link>
          </div>
          {user?.id === item.user_id && (
            <button
              onClick={handleDelete}
              disabled={busy}
              className="text-muted-foreground transition-colors hover:text-trash"
              aria-label={t("vote.deletePost")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {item.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            <PostText text={item.description} />
          </p>
        )}

        {/* verdict meter */}
        <div className="mt-4">
          <div className="flex h-2.5 overflow-hidden rounded-full bg-secondary">
            <div className="bg-stash" style={{ width: `${stashPct}%` }} />
            <div className="bg-trash" style={{ width: `${100 - stashPct}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-xs font-medium">
            <span className="text-stash">{t("vote.stashCount", { count: item.stashCount })}</span>
            <span className="text-muted-foreground">
              {total === 0 ? t("vote.noVotes") : t("vote.stashPct", { pct: stashPct })}
            </span>
            <span className="text-trash">{t("vote.trashCount", { count: item.trashCount })}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            variant="stash"
            size="lg"
            disabled={busy}
            onClick={() => vote("stash")}
            className={cn(
              "gap-2",
              item.myVerdict === "stash" && "verdict-picked",
              item.myVerdict === "trash" && "verdict-dimmed",
            )}
          >
            <img src={coinIcon} alt="" aria-hidden className="verdict-icon" /> {t("vote.stash")}
          </Button>
          <Button
            variant="trash"
            size="lg"
            disabled={busy}
            onClick={() => vote("trash")}
            className={cn(
              "gap-2",
              item.myVerdict === "trash" && "verdict-picked",
              item.myVerdict === "stash" && "verdict-dimmed",
            )}
          >
            <img src={binIcon} alt="" aria-hidden className="verdict-icon" /> {t("vote.trash")}
          </Button>
        </div>


        <div className="mt-3">
          <ItemCardActions
            itemId={item.id}
            currentUserId={user?.id}
            authorId={item.user_id}
            onCommentClick={() => setCommentsOpen((v) => !v)}
          />
        </div>

        {commentsOpen && (
          <div className="mt-4 border-t border-border pt-4">
            {!user && (
              <p className="mb-3 text-sm text-muted-foreground">{t("social.signInToComment")}</p>
            )}
            <CommentThread itemId={item.id} currentUserId={user?.id} />
          </div>
        )}
      </div>
    </article>
  );
}
