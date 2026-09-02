import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { getPublicProfile, getProfileStats, getFollowerCount } from "@/lib/social";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ExternalLink, ThumbsUp, ThumbsDown, FileText, UserPlus, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: () => getPublicProfile(user!.id),
    enabled: !!user,
  });
  const { data: stats } = useQuery({
    queryKey: ["my-stats", user?.id],
    queryFn: () => getProfileStats(user!.id),
    enabled: !!user,
  });
  const { data: followers } = useQuery({
    queryKey: ["my-followers", user?.id],
    queryFn: () => getFollowerCount({ userId: user!.id }),
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-display text-3xl font-extrabold">{t("profile.title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("profile.subtitle")}</p>

        {isLoading ? (
          <Skeleton className="mt-6 h-48 w-full rounded-2xl" />
        ) : (
          <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-secondary font-display text-2xl font-bold">
                {(profile?.display_name ?? "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold">{profile?.display_name ?? "Anonymous"}</h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-stash" />
                {t("social.trustScore")}: <strong>{profile?.trust_score ?? 0}</strong>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{profile?.bio || t("profile.noBio")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <EditProfileDialog
                  userId={user.id}
                  displayName={profile?.display_name ?? ""}
                  bio={profile?.bio ?? null}
                  avatarUrl={profile?.avatar_url ?? null}
                  onSaved={() => refetch()}
                />
                <Button asChild size="sm" variant="ghost" className="gap-1.5">
                  <Link to="/users/$id" params={{ id: user.id }}>
                    <ExternalLink className="h-3.5 w-3.5" /> {t("profile.viewPublic")}
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        <h2 className="mb-3 mt-8 font-display text-lg font-bold">{t("profile.activity")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Stat icon={Users} value={followers ?? 0} label={t("social.followers", { count: 0 }).split(" ")[0]} />
          <Stat icon={UserPlus} value={stats?.following ?? 0} label={t("profile.following")} />
          <Stat icon={FileText} value={stats?.posts ?? 0} label={t("dashboard.posts")} />
          <Stat icon={ThumbsUp} value={stats?.stash ?? 0} label={t("dashboard.stash")} />
          <Stat icon={ThumbsDown} value={stats?.trash ?? 0} label={t("dashboard.trash")} />
        </div>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: any; value: number | string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-muted-foreground" />
      <div className="mt-1 font-display text-xl font-extrabold">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
