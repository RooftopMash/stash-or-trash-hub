import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, LockKeyhole, Eye, Send } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { SubmitDialog } from "@/components/SubmitDialog";
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
} from "@/lib/social";

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
      await Promise.all([refetchFollowers(), refetchFollowing()]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("social.loadFailed"));
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
            <div className="flex items-start gap-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary font-display text-xl font-bold">
                  {profile.display_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h1 className="font-display text-2xl font-extrabold">{profile.display_name}</h1>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-stash" />
                  {t("social.trustScore")}: <strong>{profile.trust_score}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("social.followers", { count: followers ?? 0 })}
                </p>
                {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}
              </div>
              {user?.id !== id && (
                <Button
                  size="sm"
                  variant={following ? "outline" : "default"}
                  disabled={busy}
                  onClick={toggleFollow}
                >
                  {following ? t("social.unfollow") : t("social.follow")}
                </Button>
              )}
            </div>
          </section>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            {t("social.profileNotFound")}
          </div>
        )}

        {profile && (
          <>
            <section className="mt-5 rounded-2xl border border-stash/25 bg-stash/5 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-stash">Public wall</p>
                  <h2 className="mt-1 font-display text-xl font-extrabold">Experiences, ideas and inventions</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">A direct channel to brands. Every post is time-stamped, visible to the public, and available for CX and reputation analysis.</p>
                  <p className="mt-2 text-xs font-semibold text-foreground/70">Evidence-led, transparent, and independently reviewable — built to earn Moody&apos;s-level trust without gatekeepers.</p>
                </div>
                {user?.id === id && <SubmitDialog onPosted={() => refetch()} />}
              </div>
              <div className="mt-4 grid gap-3 border-t border-stash/15 pt-4 text-xs text-muted-foreground sm:grid-cols-3">
                <span className="flex items-center gap-2"><Eye className="h-4 w-4 text-stash" /> Public accountability</span>
                <span className="flex items-center gap-2"><Send className="h-4 w-4 text-trash" /> Direct to brands</span>
                <span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-foreground" /> Secure data trail</span>
              </div>
            </section>
          </>
        )}

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
