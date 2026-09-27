import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, Phone, Video, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { ProfileWall } from "@/components/ProfileWall";
import { LiveBroadcastModal } from "@/components/LiveBroadcastModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
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
  const { isBrand } = useRoles();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callMode, setCallMode] = useState<"voice_call" | "video_call">("voice_call");

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
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setCallMode("voice_call");
                      setCallModalOpen(true);
                    }}
                    className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-500 font-bold"
                  >
                    <Phone className="h-3.5 w-3.5" /> Voice Call
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setCallMode("video_call");
                      setCallModalOpen(true);
                    }}
                    className="gap-1.5 bg-slate-950 text-[#d6a928] hover:bg-slate-900 font-bold"
                  >
                    <Video className="h-3.5 w-3.5" /> Video Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate({ to: "/messages", search: { to: id } })}
                    className="gap-1.5"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Message
                  </Button>
                  <Button
                    size="sm"
                    variant={following ? "outline" : "default"}
                    disabled={busy}
                    onClick={toggleFollow}
                  >
                    {following ? t("social.unfollow") : t("social.follow")}
                  </Button>
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

      <LiveBroadcastModal
        open={callModalOpen}
        onOpenChange={setCallModalOpen}
        brandName={profile?.display_name || "SOT User"}
        brandOwner={isBrand ? "Brand-to-User Direct Outreach" : "User-to-User Peer Call"}
        productName={`Direct SOT Call with ${profile?.display_name || "Member"}`}
        recipientId={id}
        recipientName={profile?.display_name || "SOT Member"}
        defaultMode={callMode}
        callDirection={isBrand ? "brand_to_user" : "user_to_user"}
      />
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
