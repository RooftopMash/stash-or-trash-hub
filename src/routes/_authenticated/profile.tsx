import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import {
  getPublicProfile,
  getProfileStats,
  getFollowerCount,
  getMyFriendsWithProfiles,
  acceptFriendRequest,
  removeFriendConnection,
  blockFriendConnection,
} from "@/lib/social";
import { fetchBrands, fetchMyBrands, fetchBrandsByIds, type Brand } from "@/lib/brands";
import { fetchActiveManagedBrandIds } from "@/lib/brand-platform";
import {
  getClaimedLaunchPerks,
  type ClaimedPerkVoucher,
  type BrandBroadcastCategory,
} from "@/lib/live-broadcasts";
import { BrandLogo } from "@/components/BrandLogo";
import { LiveBroadcastModal } from "@/components/LiveBroadcastModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  FileText,
  UserPlus,
  UserCheck,
  Users,
  Check,
  X,
  Ban,
  Phone,
  Coins,
  Gift,
  Rocket,
  Building2,
  LayoutDashboard,
  Sparkles,
  Copy,
  BadgeCheck,
  Trophy,
  ScanBarcode,
  Radio,
} from "lucide-react";
import { SocialConnectionsPanel } from "@/components/SocialConnectionsPanel";
import { CommunicationFreedomCard } from "@/components/CommunicationFreedomCard";
import { ProfileWall } from "@/components/ProfileWall";
import { ReleaseSafetyControls } from "@/components/ReleaseSafetyControls";
import {
  BrandOperatorHandoverBar,
  BrandCxDataAndAwardsMatrix,
  BrandB2BPricingAndCheckoutPanel,
} from "@/components/BrandExecutiveSuitePanels";
import { useRoles } from "@/hooks/useRoles";
import { playCoinSpinSound } from "@/lib/verdict-sounds";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const { persona, setPersona } = useRoles();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [claimedPerks, setClaimedPerks] = useState<ClaimedPerkVoucher[]>(() =>
    getClaimedLaunchPerks(),
  );
  const [dailySpinDone, setDailySpinDone] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(140);

  // Brand Owner Live Launch Modal state
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const [launchBrand, setLaunchBrand] = useState<Brand | null>(null);
  const [launchCategory, setLaunchCategory] = useState<BrandBroadcastCategory>("product_launch");

  useEffect(() => {
    const syncPerks = () => setClaimedPerks(getClaimedLaunchPerks());
    window.addEventListener("sot-live-broadcasts-changed", syncPerks);
    return () => window.removeEventListener("sot-live-broadcasts-changed", syncPerks);
  }, []);

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: () => getPublicProfile(user!.id),
    enabled: !!user,
  });
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["my-stats", user?.id],
    queryFn: () => getProfileStats(user!.id),
    enabled: !!user,
  });
  const { data: followers } = useQuery({
    queryKey: ["my-followers", user?.id],
    queryFn: () => getFollowerCount({ userId: user!.id }),
    enabled: !!user,
  });
  const { data: friendRecords, refetch: refetchFriends } = useQuery({
    queryKey: ["my-friends-table", user?.id],
    queryFn: () => getMyFriendsWithProfiles(user!.id),
    enabled: !!user,
  });

  // Load managed brands for the Brand Owner Executive Profile view
  const { data: managedBrands = [] } = useQuery({
    queryKey: ["profile-managed-brands", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const collected: Brand[] = [];
      const seen = new Set<string>();
      const pushUnique = (items: Brand[]) => {
        for (const item of items) {
          const key = item.slug || item.id;
          if (!seen.has(key)) {
            seen.add(key);
            collected.push(item);
          }
        }
      };
      if (user?.id) {
        try {
          const ids = await fetchActiveManagedBrandIds(user.id);
          if (ids.length > 0) {
            const list = await fetchBrandsByIds(ids.slice(0, 12));
            pushUnique(list);
          }
        } catch {
          // ignore
        }
        try {
          const owned = await fetchMyBrands(user.id);
          pushUnique(owned);
        } catch {
          // ignore
        }
      }
      if (collected.length === 0) {
        try {
          const catalog = await fetchBrands();
          pushUnique(catalog.slice(0, 6));
        } catch {
          // ignore
        }
      }
      return collected;
    },
  });

  if (!user) return null;

  const acceptedFriends = (friendRecords ?? []).filter((f) => f.status === "accepted");
  const pendingRequests = (friendRecords ?? []).filter((f) => f.status === "pending");
  const blockedConnections = (friendRecords ?? []).filter((f) => f.status === "blocked");

  const handleAcceptRequest = async (peerId: string, peerName: string) => {
    try {
      await acceptFriendRequest(user.id, peerId);
      await Promise.all([refetchFriends(), refetchStats()]);
      toast.success(`You and ${peerName} are now mutual Friends!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to accept friend request.");
    }
  };

  const handleRemoveOrCancel = async (peerId: string, peerName: string) => {
    try {
      await removeFriendConnection(user.id, peerId);
      await Promise.all([refetchFriends(), refetchStats()]);
      toast.info(`Updated connection with ${peerName}.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove connection.");
    }
  };

  const handleBlockPeer = async (peerId: string, peerName: string) => {
    try {
      await blockFriendConnection(user.id, peerId);
      await Promise.all([refetchFriends(), refetchStats()]);
      toast.info(`Blocked ${peerName}.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to block connection.");
    }
  };

  const handleSpinDailyBonus = () => {
    playCoinSpinSound();
    if (!dailySpinDone) {
      setDailySpinDone(true);
      setBonusPoints((p) => p + 25);
      toast.success("🪙 Zwepe Gold Coin Spun! +25 SOT Consumer Trust Points unlocked!");
    } else {
      toast.info("🪙 Zwepe Coin spun! Come back tomorrow for your next +25 streak bonus.");
    }
  };

  const openBrandLaunch = (brand: Brand, category: BrandBroadcastCategory) => {
    setLaunchBrand(brand);
    setLaunchCategory(category);
    setLaunchModalOpen(true);
  };

  const totalVerdicts = (stats?.stash ?? 0) + (stats?.trash ?? 0);
  const voterRankTitle =
    totalVerdicts >= 20
      ? "Gold Arbitrator · Level 5 Watchdog"
      : totalVerdicts >= 5
        ? "Verified Arbitrator · Level 3 Voter"
        : "Rising Arbitrator · Level 2 Voter";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* TOP PERSONA SWITCHER: CONSUMER MEMBER PROFILE vs BRAND OWNER EXECUTIVE PROFILE */}
        <div className="mb-6 rounded-2xl border-2 border-[#d6a928]/60 bg-card p-3 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                 Dual-World Profile Experience Switcher
              </p>
              <p className="text-xs text-foreground font-semibold">
                Switch between your <strong>Fun Consumer Member Profile</strong> and your{" "}
                <strong>Professional Brand Owner Executive Profile</strong>:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-secondary p-1">
              <button
                type="button"
                onClick={() => setPersona("consumer")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-black transition cursor-pointer",
                  persona === "consumer"
                    ? "bg-[#d6a928] text-slate-950 shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Coins className="h-3.5 w-3.5" />
                🎉 Consumer Member Profile (Fun &amp; Social)
              </button>
              <button
                type="button"
                onClick={() => setPersona("brand_owner")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-black transition cursor-pointer",
                  persona === "brand_owner"
                    ? "bg-slate-950 text-[#f5d061] shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Building2 className="h-3.5 w-3.5" />
                🏛️ Brand Owner Profile (B2B Executive)
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================================
            WORLD 1: BRAND OWNER EXECUTIVE PROFILE (B2B CORPORATE SUITE)
           ===================================================================== */}
        {persona === "brand_owner" ? (
          <div className="space-y-6">
            {/* Switch Active Operator / Shift Handover Bar for Shared Brand Logins */}
            <BrandOperatorHandoverBar
              brandName={managedBrands[0]?.name || "Official Brand Account"}
            />

            {/* Executive Corporate Identity Dossier Header */}
            <section className="rounded-3xl border-2 border-[#d6a928] bg-slate-950 p-6 text-white shadow-lg sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.display_name}
                      className="h-24 w-24 shrink-0 rounded-2xl border-2 border-[#d6a928] object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-[#d6a928] bg-slate-900 font-display text-3xl font-black text-[#f5d061]">
                      {(profile?.display_name ?? user.email ?? "B").charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#d6a928] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-slate-950">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified Brand Owner &amp; Executive
                      </span>
                      <span className="text-xs font-mono text-slate-400 tabular-nums">
                        SLA Grade: AAA Prime (94% Resolution)
                      </span>
                    </div>

                    <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-white">
                      {profile?.display_name ?? user.email?.split("@")[0] ?? "Executive Custodian"}
                    </h1>
                    <p className="mt-1 text-sm text-slate-300">
                      {profile?.bio ||
                        "Official Brand Custodian, Product Launch Host & Executive Customer Experience Representative on Stash Or Trash."}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <span>
                        Managed Portfolio: <strong className="text-[#f5d061]">{managedBrands.length} Brands</strong>
                      </span>
                      <span>·</span>
                      <span>
                        CPA First-Right Window: <strong className="text-emerald-400">14–20 Business Days Protected</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Zero-Phone-Number Client Line: <strong className="text-emerald-400">Active</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Button
                    onClick={() => navigate({ to: "/dashboard" })}
                    className="gap-1.5 bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935]"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Open Brand Command Dashboard
                  </Button>
                  <EditProfileDialog
                    userId={user.id}
                    displayName={profile?.display_name ?? ""}
                    bio={profile?.bio ?? null}
                    avatarUrl={profile?.avatar_url ?? null}
                    onSaved={() => refetch()}
                  />
                </div>
              </div>

              {/* Executive KPI Strip */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-800 pt-5 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Managed Brands
                  </p>
                  <p className="mt-1 font-display text-2xl font-black text-white tabular-nums">
                    {managedBrands.length}
                  </p>
                </div>
                <div className="rounded-xl border border-[#d6a928]/40 bg-slate-900/90 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Portfolio Trust Avg
                  </p>
                  <p className="mt-1 font-display text-2xl font-black text-[#f5d061] tabular-nums">
                    {managedBrands.length > 0
                      ? Math.round(
                          managedBrands.reduce((s, b) => s + (Number(b.trust_score) || 76), 0) /
                            managedBrands.length,
                        )
                      : 82}
                    %
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Launch Broadcast Reach
                  </p>
                  <p className="mt-1 font-display text-2xl font-black text-emerald-400 tabular-nums">
                    13.6K+
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Recovery Vouchers Issued
                  </p>
                  <p className="mt-1 font-display text-2xl font-black text-white tabular-nums">
                    48 Active
                  </p>
                </div>
              </div>
            </section>

            {/* Managed Brands & 1-Click Live Launch / Relaunch Studio Matrix */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-xl font-black flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-[#d6a928]" />
                    Managed Brands &amp; Live Product Launch / Relaunch Studio
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Broadcast a New Product Launch, Relaunch, Behind-the-Scenes Quality Tour, or Townhall directly to your followers and prospects on the Home Feed.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate({ to: "/brands/new" })}
                  className="gap-1.5 bg-slate-950 text-[#f5d061] font-bold hover:bg-slate-900"
                >
                  + Register / Claim Brand
                </Button>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {managedBrands.slice(0, 6).map((b) => {
                  const trust = Number(b.trust_score) || 76;
                  return (
                    <div
                      key={b.id}
                      className="flex flex-col justify-between rounded-2xl border border-border bg-background p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <BrandLogo
                            name={b.name}
                            url={b.signedLogoUrl}
                            className="h-12 w-12 rounded-xl text-sm"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Link
                                to="/brands/$slug"
                                params={{ slug: b.slug }}
                                className="font-display text-base font-black hover:underline"
                              >
                                {b.name}
                              </Link>
                              {b.verified && (
                                <BadgeCheck className="h-4 w-4 text-[#d6a928]" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {b.category || "Enterprise Brand"} · {b.country || "ZA"}
                            </p>
                          </div>
                        </div>

                        <span className="font-mono text-xs font-extrabold text-emerald-600 tabular-nums">
                          {trust}% Trust
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
                        <Button
                          size="sm"
                          onClick={() => openBrandLaunch(b, "product_launch")}
                          className="h-7 gap-1 bg-[#d6a928] px-2.5 text-[11px] font-black text-slate-950 hover:bg-[#e5b935]"
                        >
                          <Rocket className="h-3 w-3" /> Launch Product Live
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openBrandLaunch(b, "brand_relaunch")}
                          className="h-7 gap-1 px-2.5 text-[11px] font-bold"
                        >
                          <Radio className="h-3 w-3 text-emerald-600" /> Relaunch
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openBrandLaunch(b, "behind_scenes")}
                          className="h-7 gap-1 px-2.5 text-[11px] font-bold"
                        >
                          🏭 Quality Tour
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate({ to: "/dashboard" })}
                          className="h-7 px-2 text-[11px] font-bold text-muted-foreground hover:text-foreground"
                        >
                          Analytics →
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Brand Owner Commercial Advantages & B2B Freedom */}
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-xs font-black uppercase tracking-wider text-[#b88914]">
                  01. Revenue Recovery &amp; Anti-Counterfeit
                </p>
                <h3 className="mt-1 font-display text-base font-bold">
                  Spot Grey-Market Leaks Instantly
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  When consumers scan suspected fake stock on <code>/scan</code>, you see which store/area is leaking counterfeits and issue 1-click genuine recovery vouchers.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-xs font-black uppercase tracking-wider text-emerald-600">
                  02. Zero-Phone-Number Client Calling
                </p>
                <h3 className="mt-1 font-display text-base font-bold">
                  Reach Unhappy Clients Privately
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Send a 1-click Request-to-Call or ring clients directly inside SOT Messaging to inspect products on video and turn a Trash into a Stash.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-xs font-black uppercase tracking-wider text-primary">
                  03. Early Crisis Resolution Window
                </p>
                <h3 className="mt-1 font-display text-base font-bold">
                  14–20 Business Days Before CGSO
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  SOT guides consumers to give your brand first right of resolution before escalating to the Ombudsman or NCC — protecting your reputation.
                </p>
              </div>
            </section>

            {/* Full-Cycle CX Data Extraction Matrix + SOrT Employee Recognition Awards */}
            <BrandCxDataAndAwardsMatrix
              brandName={managedBrands[0]?.name || "Official Brand Account"}
            />

            {/* Brand-Only B2B Data & Broadcast Pricing + Multi-Gateway Checkout (Google Pay / Paystack / Stripe / Invoice) */}
            <BrandB2BPricingAndCheckoutPanel
              brandName={managedBrands[0]?.name || "Official Brand Account"}
            />

            {/* Brand Owner Communication & Call Privacy Desk */}
            <CommunicationFreedomCard userId={user.id} isBrand />
          </div>
        ) : (
          /* =====================================================================
              WORLD 2: FUN CONSUMER MEMBER PROFILE (GAMIFIED, REWARDS & SOCIAL)
             ===================================================================== */
          <div className="space-y-6">
            {/* Strict Account Separation & 100% Free Forever Consumer Guarantee Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/90 px-4 py-2.5 text-xs text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Personal Consumer Profile (100% Free Forever):</strong> Your personal identity, mutual friends, and votes are strictly separated from any Corporate Brand Account.
                </span>
              </div>
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-black text-emerald-300">
                Zero Paywalls for Everyday Users
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-48 w-full rounded-2xl" />
            ) : (
              <section className="rounded-3xl border-2 border-[#d6a928]/60 bg-gradient-to-b from-[#fffbeb] via-amber-50/30 to-white p-6 text-slate-950 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.display_name}
                        className="h-20 w-20 shrink-0 rounded-2xl border-2 border-[#d6a928] object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-950 bg-[#d6a928] font-display text-2xl font-black text-slate-950">
                        {(profile?.display_name ?? "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-950 px-2.5 py-0.5 text-[11px] font-black text-[#f5d061]">
                          <Trophy className="h-3 w-3 text-[#d6a928]" />
                          {voterRankTitle}
                        </span>
                        <span className="text-xs font-bold text-amber-900 tabular-nums">
                          · {bonusPoints + (profile?.trust_score ?? 0)} SOT Play Points
                        </span>
                      </div>

                      <h1 className="mt-2 font-display text-2xl font-black text-slate-950 sm:text-3xl">
                        {profile?.display_name ?? "Anonymous Member"}
                      </h1>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        {t("social.trustScore")}: <strong>{profile?.trust_score ?? 75}</strong> ·{" "}
                        <span>{acceptedFriends.length} Mutual Friends</span> ·{" "}
                        <span>{followers ?? 0} Followers</span>
                      </p>
                      <p className="mt-1.5 text-sm text-slate-700">
                        {profile?.bio || t("profile.noBio")}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <EditProfileDialog
                          userId={user.id}
                          displayName={profile?.display_name ?? ""}
                          bio={profile?.bio ?? null}
                          avatarUrl={profile?.avatar_url ?? null}
                          onSaved={() => refetch()}
                        />
                        <Button asChild size="sm" variant="outline" className="gap-1.5 border-slate-300 bg-white text-slate-900">
                          <Link to="/users/$id" params={{ id: user.id }}>
                            <ExternalLink className="h-3.5 w-3.5" /> {t("profile.viewPublic")}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Daily Zwepe Gold Coin Spin Streak Card */}
                  <div className="flex flex-col items-center rounded-2xl border border-[#d6a928] bg-white p-4 text-center shadow-xs sm:w-64">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                      🪙 Daily Zwepe Spin Streak
                    </span>
                    <p className="mt-1 font-display text-lg font-black text-slate-950">
                      {dailySpinDone ? "Streak Active! (+25 pts)" : "Spin for +25 Trust Pts"}
                    </p>
                    <Button
                      size="sm"
                      onClick={handleSpinDailyBonus}
                      className="mt-2.5 w-full gap-1.5 bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935]"
                    >
                      <Coins className="h-4 w-4" />
                      {dailySpinDone ? "Spin Zwepe Coin Again" : "Spin Daily Zwepe Coin"}
                    </Button>
                    <Link
                      to="/scan"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:underline"
                    >
                      <ScanBarcode className="h-3 w-3 text-[#d6a928]" /> Scan Barcode for Vouchers →
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* CONSUMER REWARDS & CLAIMED LIVE LAUNCH PERKS WALLET */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-black flex items-center gap-2">
                    <Gift className="h-5 w-5 text-[#d6a928]" />
                    My Claimed Launch Perks &amp; Recovery Vouchers Wallet ({claimedPerks.length})
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Promo codes and genuine replacement vouchers you claimed during Live Brand Launches or Product Authenticity Scans.
                  </p>
                </div>
                <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs font-bold">
                  <Link to="/">
                    <Sparkles className="h-3.5 w-3.5 text-[#d6a928]" /> Watch Live Launches for More Perks
                  </Link>
                </Button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {claimedPerks.map((perk) => (
                  <div
                    key={perk.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#d6a928]/40 bg-[#d6a928]/5 p-3.5"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#b88914]">
                        {perk.brandName} · {perk.discountLabel}
                      </span>
                      <p className="truncate font-display text-sm font-bold text-foreground">
                        {perk.title}
                      </p>
                      <p className="mt-0.5 font-mono text-xs font-extrabold text-emerald-600">
                        Code: {perk.promoCode}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await navigator.clipboard?.writeText(perk.promoCode);
                        toast.success(`Copied promo code ${perk.promoCode}!`);
                      }}
                      className="shrink-0 gap-1 text-xs font-bold"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            {/* Communication Freedom Card (Consumer Mode) */}
            <CommunicationFreedomCard userId={user.id} isBrand={false} />

            {/* Mutual Friends & Connection Requests (friends table: pending, accepted, blocked) */}
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-bold flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                    Mutual Friends &amp; Bond Circles
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Manage your two-way Friends (Colleagues, Same Faith, Neighbours, Gold Circle), pending requests, and blocked connections.
                  </p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                  {acceptedFriends.length} Friends · {pendingRequests.length} Pending ·{" "}
                  {blockedConnections.length} Blocked
                </span>
              </div>

              {pendingRequests.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Pending Friend Requests ({pendingRequests.length})
                  </p>
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-3.5 py-2.5 text-xs"
                    >
                      <div>
                        <Link
                          to="/users/$id"
                          params={{ id: req.peerId }}
                          className="font-bold text-foreground hover:underline"
                        >
                          {req.peerName}
                        </Link>
                        <span className="ml-2 text-muted-foreground">
                          {req.direction === "incoming"
                            ? "wants to become mutual Friends with you"
                            : "Request sent · awaiting acceptance"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {req.direction === "incoming" && (
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(req.peerId, req.peerName)}
                            className="h-7 gap-1 bg-emerald-600 px-2.5 text-xs font-bold text-white hover:bg-emerald-500"
                          >
                            <Check className="h-3 w-3" /> Accept
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveOrCancel(req.peerId, req.peerName)}
                          className="h-7 gap-1 px-2.5 text-xs"
                        >
                          <X className="h-3 w-3" /> {req.direction === "incoming" ? "Decline" : "Cancel"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleBlockPeer(req.peerId, req.peerName)}
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-rose-600"
                          title="Block user"
                        >
                          <Ban className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {acceptedFriends.length > 0 ? (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Accepted Friends ({acceptedFriends.length})
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {acceptedFriends.map((fr) => (
                      <div
                        key={fr.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary/20 px-3 py-2 text-xs"
                      >
                        <div className="min-w-0">
                          <Link
                            to="/users/$id"
                            params={{ id: fr.peerId }}
                            className="truncate font-bold text-foreground hover:underline block"
                          >
                            {fr.peerName}
                          </Link>
                          <span className="text-[11px] text-muted-foreground">
                            🤝 Mutual Friend · {fr.bond_tag.replace("_", " ")}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate({
                                to: "/messages",
                                search: { to: fr.peerId, name: fr.peerName, call: "voice" },
                              })
                            }
                            className="h-7 gap-1 px-2 text-[11px] font-bold"
                          >
                            <Phone className="h-3 w-3 text-emerald-600" /> Call
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveOrCancel(fr.peerId, fr.peerName)}
                            className="h-7 px-2 text-[11px] text-muted-foreground"
                            title="Remove friend"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                pendingRequests.length === 0 && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    You have no mutual Friends yet. Visit any member profile or conversation in{" "}
                    <Link to="/messages" className="font-bold text-foreground underline">
                      Messages &amp; Calls
                    </Link>{" "}
                    and click <strong>Add Friend</strong> to connect.
                  </p>
                )
              )}

              {blockedConnections.length > 0 && (
                <div className="mt-4 space-y-1.5 border-t border-border pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                    Blocked Connections ({blockedConnections.length})
                  </p>
                  {blockedConnections.map((blk) => (
                    <div
                      key={blk.id}
                      className="flex items-center justify-between rounded-lg bg-rose-500/5 px-3 py-1.5 text-xs"
                    >
                      <span className="font-medium text-muted-foreground">{blk.peerName}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveOrCancel(blk.peerId, blk.peerName)}
                        className="h-6 px-2 text-[11px]"
                      >
                        Unblock
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <SocialConnectionsPanel userId={user.id} />

            <ProfileWall profileId={user.id} isOwner />
            <ReleaseSafetyControls userId={user.id} />

            <h2 className="mb-3 mt-8 font-display text-lg font-bold">{t("profile.activity")}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
              <Stat icon={UserCheck} value={stats?.friends ?? acceptedFriends.length} label="Friends" />
              <Stat icon={Users} value={followers ?? 0} label={t("social.followers", { count: 0 }).split(" ")[0]} />
              <Stat icon={UserPlus} value={stats?.following ?? 0} label={t("profile.following")} />
              <Stat icon={FileText} value={stats?.posts ?? 0} label={t("dashboard.posts")} />
              <Stat icon={ThumbsUp} value={stats?.stash ?? 0} label={t("dashboard.stash")} />
              <Stat icon={ThumbsDown} value={stats?.trash ?? 0} label={t("dashboard.trash")} />
            </div>
          </div>
        )}
      </main>

      <LiveBroadcastModal
        open={launchModalOpen}
        onOpenChange={setLaunchModalOpen}
        brandName={launchBrand?.name ?? "Verified Brand"}
        brandSlug={launchBrand?.slug}
        brandOwner={launchBrand?.ownerName || `${launchBrand?.name ?? "Brand"} Executive Team`}
        productName={`LIVE LAUNCH: ${launchBrand?.name ?? "Brand"} Product & Innovation Showcase`}
        defaultMode="broadcast"
        initialPersona="brand_owner"
        initialBrandCategory={launchCategory}
      />
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: any; value: number | string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-muted-foreground" />
      <div className="mt-1 font-display text-xl font-extrabold tabular-nums">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
