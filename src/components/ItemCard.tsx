import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "@tanstack/react-router";
import type { FeedItem, Verdict } from "@/lib/stash";
import { castVote, removeVote, deleteItem } from "@/lib/stash";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Building2, ArrowUp, ArrowDown } from "lucide-react";
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
import { BrandResponses } from "@/components/BrandResponses";
import { VerdictSuccess, triggerVerdictSuccess } from "@/components/VerdictSuccess";
import { playStashSound, playTrashSound } from "@/lib/verdict-sounds";

export function ItemCard({
  item,
  onChange,
  defaultCommentsOpen = false,
  brandTrustScore,
  sentimentTrend,
}: {
  item: FeedItem;
  onChange: () => void;
  defaultCommentsOpen?: boolean;
  brandTrustScore?: number | null;
  sentimentTrend?: "up" | "down";
}) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(defaultCommentsOpen);
  const [stashCelebration, setStashCelebration] = useState(false);

  const total = item.stashCount + item.trashCount;
  const stashPct = total === 0 ? 50 : Math.round((item.stashCount / total) * 100);
  const resolvedTrust =
    typeof brandTrustScore === "number"
      ? brandTrustScore
      : typeof item.brandTrustScore === "number"
        ? item.brandTrustScore
        : total > 0
          ? stashPct
          : null;
  const resolvedTrend: "up" | "down" =
    sentimentTrend ??
    (item.stashCount !== item.trashCount
      ? item.stashCount > item.trashCount
        ? "up"
        : "down"
      : (resolvedTrust ?? 50) >= 60
        ? "up"
        : "down");

  const vote = async (verdict: Verdict) => {
    if (verdict === "stash" && item.myVerdict !== "stash") {
      setStashCelebration(true);
      triggerVerdictSuccess({
        label: "STASHED!",
        sublabel: item.brandName
          ? `${item.brandName} · Keep what serves you`
          : "Keep what serves you · Gold standard verdict recorded",
      });
    }
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
    <article className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <VerdictSuccess
        active={stashCelebration}
        onComplete={() => setStashCelebration(false)}
        inline
        label="STASHED!"
        sublabel="Keep what serves you · Gold standard"
      />
      {item.signedImageUrl ? (
        <Link to="/items/$id" params={{ id: item.id }}>
          <img
            src={item.signedImageUrl}
            alt={item.title}
            className="aspect-video w-full object-cover"
            loading="lazy"
          />
        </Link>
      ) : item.brandLogoUrl ? (
        <Link
          to="/items/$id"
          params={{ id: item.id }}
          className="flex aspect-video w-full items-center justify-center bg-secondary/40 p-8"
        >
          <img
            src={item.brandLogoUrl}
            alt={item.brandName ?? ""}
            className="max-h-full max-w-[60%] object-contain"
            loading="lazy"
          />
        </Link>
      ) : null}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            {(item.brandName || item.category) && (
              <div className="mb-1 flex flex-wrap items-center gap-2">
                {item.brandName && item.brandSlug && (
                  <Link
                    to="/brands/$slug"
                    params={{ slug: item.brandSlug }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>{item.brandName}</span>
                    {resolvedTrust !== null && (
                      <span
                        title={
                          resolvedTrend === "up"
                            ? `${resolvedTrust}% trust score · Sentiment trending positively`
                            : `${resolvedTrust}% trust score · Sentiment trending negatively`
                        }
                        aria-label={
                          resolvedTrend === "up"
                            ? `Trust score ${resolvedTrust} percent, trending positively`
                            : `Trust score ${resolvedTrust} percent, trending negatively`
                        }
                        className={cn(
                          "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none no-underline",
                          resolvedTrend === "up"
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-rose-500/15 text-rose-500",
                        )}
                      >
                        <span>{resolvedTrust}%</span>
                        {resolvedTrend === "up" ? (
                          <ArrowUp className="h-2.5 w-2.5 stroke-[2.75]" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="h-2.5 w-2.5 stroke-[2.75]" aria-hidden="true" />
                        )}
                      </span>
                    )}
                  </Link>
                )}
                {item.category && (
                  <Badge variant="secondary" className="text-[10px]">
                    {item.category}
                  </Badge>
                )}
                {item.audit?.brandInfo?.brandOwner && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-300">
                    <Building2 className="h-3 w-3" />
                    <span>Owner: {item.audit.brandInfo.brandOwner}</span>
                  </span>
                )}
                {item.audit && <AuditBadge audit={item.audit} />}
              </div>
            )}
            <h3 className="font-display text-xl font-bold leading-tight">
              <Link to="/items/$id" params={{ id: item.id }} className="hover:underline">
                <PostText text={item.title} disableLinks />
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
            onClick={() => {
              playStashSound();
              void vote("stash");
            }}
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
            onClick={() => {
              playTrashSound();
              void vote("trash");
            }}
            className={cn(
              "gap-2",
              item.myVerdict === "trash" && "verdict-picked",
              item.myVerdict === "stash" && "verdict-dimmed",
            )}
          >
            <img src={binIcon} alt="" aria-hidden className="verdict-icon" /> {t("vote.trash")}
          </Button>
        </div>

        <BrandResponses itemId={item.id} brandId={item.brand_id} />

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
