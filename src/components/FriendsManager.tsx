import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriendshipStatus,
  getFriendsList,
  getPendingFriendRequests,
} from "@/lib/social";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserPlus, UserX, Users, Check, X, Clock } from "lucide-react";
import { toast } from "sonner";

export function FriendActionButton({
  currentUserId,
  targetUserId,
}: {
  currentUserId: string;
  targetUserId: string;
}) {
  const queryClient = useQueryClient();

  const { data: friendship, isLoading } = useQuery({
    queryKey: ["friendship-status", currentUserId, targetUserId],
    queryFn: () => getFriendshipStatus(currentUserId, targetUserId),
  });

  const sendMutation = useMutation({
    mutationFn: () => sendFriendRequest(currentUserId, targetUserId),
    onSuccess: () => {
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["friendship-status", currentUserId, targetUserId] });
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Failed to send request.");
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => acceptFriendRequest(friendship!.requestId!),
    onSuccess: () => {
      toast.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["friendship-status", currentUserId, targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["friends-list", currentUserId] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => declineFriendRequest(friendship!.requestId!),
    onSuccess: () => {
      toast.success("Friendship removed.");
      queryClient.invalidateQueries({ queryKey: ["friendship-status", currentUserId, targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["friends-list", currentUserId] });
    },
  });

  if (isLoading || !friendship) return null;

  switch (friendship.status) {
    case "friends":
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => removeMutation.mutate()}
          className="gap-1.5 text-xs text-stash border-stash/40 hover:bg-stash/10"
        >
          <UserCheck className="h-3.5 w-3.5" /> Friends
        </Button>
      );
    case "pending_sent":
      return (
        <Button size="sm" variant="secondary" disabled className="gap-1.5 text-xs">
          <Clock className="h-3.5 w-3.5" /> Request Sent
        </Button>
      );
    case "pending_received":
      return (
        <div className="flex gap-1.5">
          <Button size="sm" onClick={() => acceptMutation.mutate()} className="gap-1 text-xs h-8">
            <Check className="h-3.5 w-3.5" /> Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => removeMutation.mutate()}
            className="gap-1 text-xs h-8 text-trash border-trash/40"
          >
            <X className="h-3.5 w-3.5" /> Decline
          </Button>
        </div>
      );
    default:
      return (
        <Button
          size="sm"
          onClick={() => sendMutation.mutate()}
          disabled={sendMutation.isPending}
          className="gap-1.5 text-xs"
        >
          <UserPlus className="h-3.5 w-3.5" /> Add Friend
        </Button>
      );
  }
}

export function FriendsSection({ userId, isOwner }: { userId: string; isOwner?: boolean }) {
  const queryClient = useQueryClient();

  const { data: friends } = useQuery({
    queryKey: ["friends-list", userId],
    queryFn: () => getFriendsList(userId),
  });

  const { data: pendingRequests } = useQuery({
    queryKey: ["pending-friend-requests", userId],
    queryFn: () => getPendingFriendRequests(userId),
    enabled: !!isOwner,
  });

  const acceptMutation = useMutation({
    mutationFn: (reqId: string) => acceptFriendRequest(reqId),
    onSuccess: () => {
      toast.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["friends-list", userId] });
      queryClient.invalidateQueries({ queryKey: ["pending-friend-requests", userId] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: (reqId: string) => declineFriendRequest(reqId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-friend-requests", userId] });
    },
  });

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> Friends & Connections
        </h2>
        <Badge variant="outline" className="text-xs">
          {(friends ?? []).length} Friends
        </Badge>
      </div>

      {/* Pending Requests for Owner */}
      {isOwner && pendingRequests && pendingRequests.length > 0 && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <span className="text-xs font-semibold flex items-center gap-1.5 text-primary">
            <UserPlus className="h-4 w-4" /> Pending Friend Requests ({pendingRequests.length})
          </span>

          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-2.5 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-bold">
                    {req.profileName?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <span className="font-semibold">{req.profileName}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    onClick={() => acceptMutation.mutate(req.id)}
                    className="h-7 text-[11px] gap-1"
                  >
                    <Check className="h-3 w-3" /> Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => declineMutation.mutate(req.id)}
                    className="h-7 text-[11px] text-trash"
                  >
                    <X className="h-3 w-3" /> Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends Grid */}
      {(friends ?? []).length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-6 border border-dashed border-border rounded-xl">
          No friends added yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(friends ?? []).map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary/30 p-3"
            >
              <Link
                to="/users/$id"
                params={{ id: friend.id }}
                className="flex items-center gap-3 min-w-0 hover:underline"
              >
                {friend.avatar_url ? (
                  <img
                    src={friend.avatar_url}
                    alt={friend.display_name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-bold text-sm">
                    {friend.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-xs truncate">{friend.display_name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Trust Score: {friend.trust_score}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
