import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Phone,
  Video,
  MessageCircle,
  Users,
  UserPlus,
  UserCheck,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { ProfileWall } from "@/components/ProfileWall";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserItems } from "@/lib/stash";
import {
  getPublicProfile,
  getFollowerCount,
  isFollowingUser,
  followUser,
  unfollowUser,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriendConnection,
  blockFriendConnection,
} from "@/lib/social";
import {
  BOND_OPTIONS,
  getRelationshipSummary,
  setPeerBondTag,
  type BondCategory,
} from "@/lib/communication-privacy";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/users/$id")({
  head: () => ({
    meta: [
      { title: "Profile — SOT · Stash Or Trash" },
      {
        name: "description",
        content:
          "See this member's verdicts, trust score and posts on SOT — the Brand Barometer built on real people's feedback.",
      },
      { property: "og:title", content: "Profile — SOT · Stash Or Trash" },
      {
        property: "og:description",
        content: "See this member's verdicts, trust score and posts on SOT.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  errorComponent: ProfileError,
  notFoundComponent: ProfileMissing,
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const { id } = Route.useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["public-profile", id],
    queryFn: () => getPublicProfile(id),
  });

  const { data: followers, refetch: refetchFollowers } = useQuery({
    queryKey: ["followers", id],
    queryFn: () => getFollowerCount({ userId: id }),
  });

  const { data: following, refetch: refetchFollowing } = useQuery({
    queryKey: ["is-following", user?.id, id],
    queryFn: () => (user ? isFollowingUser(user.id, id) : false),
    enabled: !!user,
  });

  const { data: relationship, refetch: refetchRelationship } = useQuery({
    queryKey: ["relationship-summary", user?.id, id],
    queryFn: () => getRelationshipSummary(user?.id, id),
    enabled: !!user && user.id !== id,
  });

  const { data: items, isLoading: itemsLoading, refetch } = useQuery({
    queryKey: ["user-items", id, user?.id ?? "anon"],
    queryFn: () => fetchUserItems(id, user?.id ?? null),
  });

  const toggleFollow = async () => {
    if (!user) {
      toast.info(t("social.signInToFollow"));
      return;
    }
    setBusy(true);
    try {
      if (following) await unfollowUser(user.id, id);
      else await followUser(user.id, id);
      await Promise.all([refetchFollowers(), refetchFollowing(), refetchRelationship()]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("social.loadFailed"));
    } finally {
      setBusy(false);
    }
  };

  const handleBondChange = (bond: BondCategory) => {
    if (!user) {
      toast.info(t("social.signInToFollow"));
      return;
    }
    setPeerBondTag(user.id, id, bond);
    void refetchRelationship();
    toast.success(`Bond updated for ${profile?.display_name ?? "member"}.`);
  };

  const handleFriendAction = async () => {
    if (!user) {
      toast.info(t("social.signInToFollow"));
      return;
    }
    setBusy(true);
    try {
      const state = relationship?.friendshipState ?? "none";
      if (state === "none") {
        await sendFriendRequest(user.id, id, relationship?.bondTag ?? "stranger");
        toast.success(`Friend request sent to ${profile?.display_name ?? "member"}!`);
      } else if (state === "pending_incoming") {
        await acceptFriendRequest(user.id, id);
        toast.success(`You and ${profile?.display_name ?? "member"} are now Friends!`);
      } else if (state === "pending_outgoing" || state === "accepted" || state === "blocked") {
        await removeFriendConnection(user.id, id);
        toast.info(
          state === "blocked"
            ? `Unblocked ${profile?.display_name ?? "member"}.`
            : state === "pending_outgoing"
              ? "Friend request cancelled."
              : `Removed ${profile?.display_name ?? "member"} from Friends.`,
        );
      }
      await refetchRelationship();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update friend connection.");
    } finally {
      setBusy(false);
    }
  };

  const handleBlockFriend = async () => {
    if (!user) {
      toast.info(t("social.signInToFollow"));
      return;
    }
    setBusy(true);
    try {
      await blockFriendConnection(user.id, id);
      await refetchRelationship();
      toast.info(`Blocked connection with ${profile?.display_name ?? "member"}.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not block connection.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header onPosted={() => refetch()} />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("social.backToFeed")}
        </Link>

        {isLoading ? (
          <Skeleton className="h-32 w-full rounded-2xl" />
        ) : profile ? (
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-xl font-bold">
                  {profile.display_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-extrabold">{profile.display_name}</h1>
                  {user && user.id !== id && relationship && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold",
                        relationship.badgeColor,
                      )}
                    >
                      {relationship.statusLabel}
                    </span>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-stash" />
                  {t("social.trustScore")}: <strong>{profile.trust_score}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("social.followers", { count: followers ?? 0 })}
                </p>
                {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}

                {/* Relationship & Shared Circle Selector (Stranger vs Colleague, Same Faith, Union, Neighbour, Gold Circle) */}
                {user && user.id !== id && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-border/80 bg-secondary/20 px-3 py-2 text-xs">
                    <span className="flex items-center gap-1 font-bold text-foreground">
                      <Users className="h-3.5 w-3.5 text-[#d6a928]" /> Bond Circle:
                    </span>
                    <select
                      value={relationship?.bondTag ?? "stranger"}
                      onChange={(e) => handleBondChange(e.target.value as BondCategory)}
                      className="h-7 rounded-md border border-border bg-background px-2 text-xs font-semibold outline-none"
                    >
                      {BOND_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.shortBadge} — {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              {user?.id !== id && (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate({
                        to: "/messages",
                        search: { to: id, name: profile.display_name, call: "voice" },
                      })
                    }
                    className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-500 font-bold"
                  >
                    <Phone className="h-3.5 w-3.5" /> Voice Call in Messages
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate({
                        to: "/messages",
                        search: { to: id, name: profile.display_name, call: "video" },
                      })
                    }
                    className="gap-1.5 bg-slate-950 text-[#d6a928] hover:bg-slate-900 font-bold"
                  >
                    <Video className="h-3.5 w-3.5" /> Video Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate({ to: "/messages", search: { to: id, name: profile.display_name } })
                    }
                    className="gap-1.5"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Message
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      relationship?.friendshipState === "accepted"
                        ? "outline"
                        : relationship?.friendshipState === "pending_incoming"
                          ? "default"
                          : "secondary"
                    }
                    disabled={busy}
                    onClick={handleFriendAction}
                    className="gap-1.5 font-bold"
                  >
                    {relationship?.friendshipState === "accepted" ? (
                      <>
                        <UserCheck className="h-3.5 w-3.5 text-emerald-600" /> 🤝 Friends (Remove)
                      </>
                    ) : relationship?.friendshipState === "pending_incoming" ? (
                      <>
                        <UserCheck className="h-3.5 w-3.5" /> Accept Friend Request
                      </>
                    ) : relationship?.friendshipState === "pending_outgoing" ? (
                      <>
                        <UserPlus className="h-3.5 w-3.5" /> Request Sent (Cancel)
                      </>
                    ) : relationship?.friendshipState === "blocked" ? (
                      <>
                        <Ban className="h-3.5 w-3.5 text-rose-600" /> Blocked (Unblock)
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3.5 w-3.5" /> Add Friend
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant={following ? "outline" : "default"}
                    disabled={busy}
                    onClick={toggleFollow}
                  >
                    {following
                      ? relationship?.isMutualFollow
                        ? "✓ Mutual Follow (Unfollow)"
                        : t("social.unfollow")
                      : relationship?.theyFollowMe
                        ? "Follow Back"
                        : t("social.follow")}
                  </Button>
                  {relationship?.friendshipState !== "blocked" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={handleBlockFriend}
                      title="Block connection in friends table"
                      className="text-muted-foreground hover:text-rose-600"
                    >
                      <Ban className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </section>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            {t("social.profileNotFound")}
          </div>
        )}

        {profile && <ProfileWall profileId={id} isOwner={user?.id === id} />}

        {profile && (
          <>
            <h2 className="mb-3 mt-8 font-display text-lg font-bold">
              {t("social.postsBy", { name: profile.display_name })}
            </h2>
            {itemsLoading ? (
              <Skeleton className="h-56 w-full rounded-2xl" />
            ) : items && items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} onChange={() => refetch()} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                {t("social.noPosts")}
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function ProfileMissing() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        {t("social.profileNotFound")}
      </main>
    </div>
  );
}

function ProfileError() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        {t("social.loadFailed")}
      </main>
    </div>
  );
}
