import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  getNotifications,
  markNotificationsRead,
  getUnreadNotificationCount,
} from "@/lib/social";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Repeat2,
  AtSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "likes" | "follows" | "comments">("all");

  const { data: notifications, isLoading, refetch } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => (user ? getNotifications(user.id) : []),
    enabled: !!user,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["unread-notifications", user?.id],
    queryFn: () => (user ? getUnreadNotificationCount(user.id) : 0),
    enabled: !!user,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (user && notifications && notifications.length > 0) {
      markNotificationsRead(user.id);
    }
  }, [user, notifications]);

  const filteredNotifications = notifications?.filter((n) => {
    switch (filter) {
      case "likes":
        return n.type.includes("like");
      case "follows":
        return n.type === "follow";
      case "comments":
        return n.type === "comment" || n.type === "mention";
      default:
        return true;
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "follow":
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case "like_post":
      case "like_comment":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case "mention":
        return <AtSign className="h-4 w-4 text-purple-500" />;
      case "repost":
        return <Repeat2 className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationText = (notif: any) => {
    switch (notif.type) {
      case "follow":
        return `${notif.actorName} started following you`;
      case "like_post":
        return `${notif.actorName} liked your post`;
      case "like_comment":
        return `${notif.actorName} liked your comment`;
      case "comment":
        return `${notif.actorName} commented on your post`;
      case "mention":
        return `${notif.actorName} mentioned you`;
      case "repost":
        return `${notif.actorName} reposted your post`;
      default:
        return `${notif.actorName} did something`;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl font-extrabold flex items-center gap-2">
            <Bell className="h-8 w-8" /> Notifications
            {unreadCount ? (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            ) : null}
          </h1>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {["all", "likes", "follows", "comments"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f as any)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredNotifications && filteredNotifications.length > 0 ? (
          <div className="space-y-2">
            {filteredNotifications.map((notif) => (
              <Link
                key={notif.id}
                to={
                  notif.item_id
                    ? `/items/${notif.item_id}`
                    : `/users/${notif.actor_id}`
                }
                className={cn(
                  "flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-secondary transition-colors",
                  !notif.read_at && "bg-primary/5 border-primary/50"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">
                    {getNotificationText(notif)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </p>
                </div>
                {!notif.read_at && (
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            No notifications yet
          </div>
        )}
      </main>
    </div>
  );
}
