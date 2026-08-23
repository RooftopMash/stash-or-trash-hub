import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  likePost,
  unlikePost,
  userLikedPost,
  getPostLikeCount,
  repostItem,
  unrepostItem,
  userReposted,
  getRepostCount,
} from "@/lib/social";

export type ItemCardActionProps = {
  itemId: string;
  currentUserId?: string;
  authorId: string;
  onCommentClick: () => void;
  onRefresh?: () => void;
};

export function ItemCardActions({
  itemId,
  currentUserId,
  authorId,
  onCommentClick,
  onRefresh,
}: ItemCardActionProps) {
  const { t } = useTranslation();
  const [isLiking, setIsLiking] = useState(false);
  const [isReposting, setIsReposting] = useState(false);

  const { data: likeCount, refetch: refetchLikes } = useQuery({
    queryKey: ["item-like-count", itemId],
    queryFn: () => getPostLikeCount(itemId),
  });

  const { data: repostCount, refetch: refetchReposts } = useQuery({
    queryKey: ["item-repost-count", itemId],
    queryFn: () => getRepostCount(itemId),
  });

  const { data: userLiked, refetch: refetchUserLiked } = useQuery({
    queryKey: ["user-liked-post", itemId, currentUserId],
    queryFn: () => (currentUserId ? userLikedPost(itemId, currentUserId) : false),
    enabled: !!currentUserId,
  });

  const { data: userRepostedPost, refetch: refetchUserReposted } = useQuery({
    queryKey: ["user-reposted-post", itemId, currentUserId],
    queryFn: () => (currentUserId ? userReposted(itemId, currentUserId) : false),
    enabled: !!currentUserId,
  });

  const handleLike = async () => {
    if (!currentUserId) {
      toast.info(t("social.signInToLike"));
      return;
    }
    setIsLiking(true);
    try {
      if (userLiked) {
        await unlikePost(itemId, currentUserId);
      } else {
        await likePost(itemId, currentUserId);
      }
      await refetchLikes();
      await refetchUserLiked();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("social.likeError"));
    } finally {
      setIsLiking(false);
    }
  };

  const handleRepost = async () => {
    if (!currentUserId) {
      toast.info(t("social.signInToRepost"));
      return;
    }
    setIsReposting(true);
    try {
      if (userRepostedPost) {
        await unrepostItem(itemId, currentUserId);
      } else {
        await repostItem(itemId, currentUserId);
      }
      await refetchReposts();
      await refetchUserReposted();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("social.likeError"));
    } finally {
      setIsReposting(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-muted-foreground border-t border-border pt-3">
      {/* Comment */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onCommentClick}
        className="flex-1 gap-1.5"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">{t("social.comment")}</span>
      </Button>

      {/* Like */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLiking}
        className={cn(
          "flex-1 gap-1.5",
          userLiked && "text-trash hover:text-trash"
        )}
      >
        <Heart className={cn("h-4 w-4", userLiked && "fill-current")} />
        <span className="hidden sm:inline">{likeCount ?? 0}</span>
      </Button>

      {/* Repost */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRepost}
        disabled={isReposting}
        className={cn(
          "flex-1 gap-1.5",
          userRepostedPost && "text-stash hover:text-stash"
        )}
      >
        <Repeat2 className={cn("h-4 w-4", userRepostedPost && "fill-current")} />
        <span className="hidden sm:inline">{repostCount ?? 0}</span>
      </Button>

      {/* Share */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          navigator.clipboard?.writeText(
            `${typeof window !== "undefined" ? window.location.origin : ""}/items/${itemId}`
          );
          toast.success(t("social.linkCopied"));
        }}
        className="flex-1 gap-1.5"
      >
        <Share className="h-4 w-4" />
        <span className="hidden sm:inline">{t("social.share")}</span>
      </Button>
    </div>
  );
}
