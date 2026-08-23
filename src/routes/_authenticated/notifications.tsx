import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  getNotifications,
  markNotificationsRead,
  getUnreadNotificationCount,
  type AppNotification,
} from "@/lib/social";
import { Bell, Heart, MessageCircle, UserPlus, Repeat2, AtSign } from "lucide-react";
import { cn } from "@/lib/utils";

type Filter = "all" | "likes" | "follows" | "comments";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => (user ? getNotifications(user.id) : []),
    enabled: !!user,
    refetchInterval: 15000,
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["unread-notifications", user?.id],
    queryFn: () => (user ? getUnreadNotificationCount(user.id) : 0),
    enabled: !!user,
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (user && notifications && notifications.length > 0) {
      void markNotificationsRead(user.id);
    }
  }, [user, notifications]);

  const filtered = (notifications ?? []).filter((n) => {
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

  const icon = (type: string) => {
    switch (type) {
      case "follow":
        return <UserPlus className="h-4 w-4 text-primary" />;
      case "like_post":
      case "like_comment":
        return <Heart className="h-4 w-4 text-trash" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-stash" />;
      case "mention":
        return <AtSign className="h-4 w-4 text-primary" />;
      case "repost":
        return <Repeat2 className="h-4 w-4 text-stash" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const label = (n: AppNotification) => {
    const name = n.actorName;
    switch (n.type) {
      case "follow":
        return t("social.notifFollow", { name });
      case "like_post":
        return t("social.notifLikePost", { name });
      case "like_comment":
        return t("social.notifLikeComment", { name });
      case "comment":
        return t("social.notifComment", { name });
      case "mention":
        return t("social.notifMention", { name });
      case "repost":
        return t("social.notifRepost", { name });
      default:
        return t("social.notifOther", { name });
    }
  };

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t("social.notifAll") },
    { key: "likes", label: t("social.notifLikes") },
    { key: "follows", label: t("social.notifFollows") },
    { key: "comments", label: t("social.notifComments") },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="flex items-center gap-2 font-display text-3xl font-extrabold">
            <Bell className="h-7 w-7" /> {t("social.notifications")}
            {unreadCount ? (
              <Badge variant="destructive" className="ml-1">
                {unreadCount}
              </Badge>
            ) : null}
          </h1>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((n) => {
              const content = (
                <>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                    {icon(n.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{label(n)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(n.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!n.read_at && <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </>
              );
              const className = cn(
                "flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary",
                !n.read_at && "border-primary/50 bg-primary/5",
              );

              if (n.item_id) {
                return (
                  <Link key={n.id} to="/items/$id" params={{ id: n.item_id }} className={className}>
                    {content}
                  </Link>
                );
              }
              if (n.actor_id) {
                return (
                  <Link
                    key={n.id}
                    to="/users/$id"
                    params={{ id: n.actor_id }}
                    className={className}
                  >
                    {content}
                  </Link>
                );
              }
              return (
                <div key={n.id} className={className}>
                  {content}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            {t("social.notifEmpty")}
          </div>
        )}
      </main>
    </div>
  );
}
