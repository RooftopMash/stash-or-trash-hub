import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Send, Heart, MessageCircle as MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  createComment,
  getComments,
  likeComment,
  unlikeComment,
  deleteComment,
} from "@/lib/social";

export type CommentThreadProps = {
  itemId: string;
  currentUserId?: string;
};

export function CommentThread({ itemId, currentUserId }: CommentThreadProps) {
  const { t } = useTranslation();
  const [body, setBody] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const { data: comments, isLoading, refetch } = useQuery({
    queryKey: ["comments", itemId, currentUserId],
    queryFn: () => getComments(itemId, currentUserId),
  });

  const handlePostComment = async () => {
    if (!currentUserId || !body.trim()) return;
    setIsPosting(true);
    try {
      await createComment(itemId, currentUserId, body);
      setBody("");
      toast.success("Comment posted!");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error posting comment");
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikeComment = async (commentId: string, isLiked: boolean) => {
    if (!currentUserId) return;
    try {
      if (isLiked) {
        await unlikeComment(commentId, currentUserId);
      } else {
        await likeComment(commentId, currentUserId);
      }
      refetch();
    } catch (e) {
      toast.error("Error updating like");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.success("Comment deleted");
      refetch();
    } catch (e) {
      toast.error("Error deleting comment");
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      {currentUserId && (
        <div className="flex gap-2">
          <Input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment..."
            className="text-sm"
          />
          <Button
            onClick={handlePostComment}
            disabled={!body.trim() || isPosting}
            size="sm"
            className="gap-1"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg bg-secondary/50 p-3">
              {/* Comment Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
                {currentUserId === comment.user_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-xs"
                  >
                    Delete
                  </Button>
                )}
              </div>

              {/* Comment Body */}
              <p className="mt-2 text-sm">{comment.body}</p>

              {/* Comment Actions */}
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikeComment(comment.id, comment.userLiked)}
                  className={cn(
                    "h-auto px-1 py-0.5 gap-0.5",
                    comment.userLiked && "text-red-500"
                  )}
                >
                  <Heart
                    className={cn("h-3 w-3", comment.userLiked && "fill-current")}
                  />
                  <span>{comment.likeCount}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No comments yet. Be the first!
        </div>
      )}
    </div>
  );
}
