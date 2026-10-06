import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import {
  fetchBrandStats,
  requestVerification,
  fetchPendingVerifications,
  reviewVerification,
  type Brand,
} from "@/lib/brands";
import { fetchBrandKpis } from "@/lib/brand-platform";
import {
  publishBrandsFromWikidata,
  importBrandsFromWikidata,
  fetchBrandCandidates,
  approveBrandCandidate,
  rejectBrandCandidate,
  buildBrandInvitation,
  SUPPORTED_IMPORT_COUNTRIES,
} from "@/lib/wikidata-import";
import { WORLD_COUNTRY_CODES, countryLabel, countryName } from "@/lib/geo";
import { fetchFeed } from "@/lib/stash";
import { sendMessage } from "@/lib/messages";
import { approveCallerForSession } from "@/lib/communication-privacy";
import { BrandTeamDialog } from "@/components/BrandTeamDialog";
import { BrandAnalytics } from "@/components/BrandAnalytics";
import { BrandLogo } from "@/components/BrandLogo";
import { DirectBrandCommModal } from "@/components/DirectBrandCommModal";
import { LiveBroadcastModal } from "@/components/LiveBroadcastModal";
import { LiveStageSection } from "@/components/LiveStageSection";
import { LiveIncidents } from "@/components/LiveIncidents";
import { AdminAppealsQueue } from "@/components/AdminAppealsQueue";
import {
  getFollowerCount,
  getMyFriendsWithProfiles,
  getProfileStats,
} from "@/lib/social";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BadgeCheck,
  Building2,
  Check,
  Coins,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Gift,
  Globe,
  LayoutDashboard,
  Loader2,
  Lock,
  MessageSquare,
  Pencil,
  Phone,
  Radio,
  Rocket,
  ScanBarcode,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  UserCheck,
  Users,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SecureConnectionsPanel } from "@/components/SecureConnectionsPanel";
import { BrandAICopilot } from "@/components/BrandAICopilot";
import { ContentSafetyGate } from "@/components/ContentSafetyGate";
import { BrandIntelligencePanel } from "@/components/BrandIntelligencePanel";
import {
  BrandOperatorHandoverBar,
  BrandCxDataAndAwardsMatrix,
  BrandB2BPricingAndCheckoutPanel,
  BrandInboundContactSettingsPanel,
} from "@/components/BrandExecutiveSuitePanels";
import {
  MessengerPrivateCallModal,
  type MessengerCallSession,
} from "@/components/MessengerPrivateCallModal";
import {
  B2B_BRAND_PLANS,
  addCxLifecycleResolution,
  getActiveBrandSubscription,
  getActiveDeskOperator,
  getBrandSpecificTelemetry,
  getRegisteredBrandIdentity,
  isTierEntitled,
  recordOperatorResolutionMetric,
  setActiveBrandPlanTier,
  setRegisteredBrandIdentity,
  type BrandPlanTierId,
  type RegisteredBrandIdentity,
} from "@/lib/brand-operators";
import {
  BRAND_BROADCAST_CATEGORIES,
  getClaimedLaunchPerks,
  type BrandBroadcastCategory,
} from "@/lib/live-broadcasts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

type DashboardTab =
  | "command"
  | "launch_studio"
  | "client_desk"
  | "cx_awards"
  | "b2b_pricing"
  | "admin_sourcing";

function DashboardPage() {
  const { user } = useAuth();
  const { isAdmin, isDeveloper, persona, setPersona } = useRoles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<DashboardTab>("command");
  const [registeredBrand, setRegisteredBrand] = useState<RegisteredBrandIdentity>(() =>
    getRegisteredBrandIdentity(),
  );
  const [subState, setSubState] = useState(() => getActiveBrandSubscription());

  // Inline editor for updating the Brand Owner's single registered brand identity
  const [editingBrand, setEditingBrand] = useState(false);
  const [brandNameDraft, setBrandNameDraft] = useState(registeredBrand.name);
  const [brandCategoryDraft, setBrandCategoryDraft] = useState(registeredBrand.category);
  const [brandCountryDraft, setBrandCountryDraft] = useState(registeredBrand.country);
  const [brandWebsiteDraft, setBrandWebsiteDraft] = useState(registeredBrand.website);

  // Brand Launch Studio Quick-Launcher state
  const [studioModalOpen, setStudioModalOpen] = useState(false);
  const [studioCategory, setStudioCategory] = useState<BrandBroadcastCategory>("product_launch");
  const [callClientTarget, setCallClientTarget] = useState<{
    id: string;
    name: string;
    topic: string;
    mode: "voice_call" | "video_call" | "broadcast";
  } | null>(null);

  // Private 1-on-1 Messenger Call state
  const [messengerCallOpen, setMessengerCallOpen] = useState(false);
  const [messengerCallSession, setMessengerCallSession] = useState<MessengerCallSession | null>(null);

  // Global Wikidata / Country Brand Sourcing states (Admin only)
  const [importCountry, setImportCountry] = useState("ZA");
  const [importLimit, setImportLimit] = useState(40);
  const [importKeyword, setImportKeyword] = useState("");
  const [sourcingBusy, setSourcingBusy] = useState(false);

  useEffect(() => {
    const syncBrandAndTier = () => {
      const latest = getRegisteredBrandIdentity();
      setRegisteredBrand(latest);
      setBrandNameDraft(latest.name);
      setBrandCategoryDraft(latest.category);
      setBrandCountryDraft(latest.country);
      setBrandWebsiteDraft(latest.website);
      setSubState(getActiveBrandSubscription());
    };
    window.addEventListener("sot-registered-brand-updated", syncBrandAndTier);
    window.addEventListener("sot-brand-operator-updated", syncBrandAndTier);
    return () => {
      window.removeEventListener("sot-registered-brand-updated", syncBrandAndTier);
      window.removeEventListener("sot-brand-operator-updated", syncBrandAndTier);
    };
  }, []);

  const hasAdminView =
    isAdmin || user?.email?.toLowerCase() === "borulelo@gmail.com";

  // Build the single Brand object representing ONLY this Brand Owner's registered brand
  const activeBrand: Brand = useMemo(
    () => ({
      id: registeredBrand.id,
      name: registeredBrand.name,
      slug: registeredBrand.slug,
      category: registeredBrand.category,
      country: registeredBrand.country,
      website: registeredBrand.website,
      description: `${registeredBrand.name} — Official Verified Brand Account on Stash Or Trash.`,
      logo_url: null,
      signedLogoUrl: null,
      verified: registeredBrand.verified,
      trust_score: registeredBrand.trust_score,
      owner_id: user?.id ?? "brand-owner",
      ownerName: `${registeredBrand.name} Executive Desk`,
    }),
    [registeredBrand, user?.id],
  );

  const activePlan = useMemo(
    () => B2B_BRAND_PLANS.find((p) => p.id === subState.activePlanId) ?? B2B_BRAND_PLANS[1],
    [subState.activePlanId],
  );

  const hasTier2 = isTierEntitled(subState.activePlanId, "cx_launch_matrix");
  const hasTier3 = isTierEntitled(subState.activePlanId, "enterprise_intelligence");

  // Consumer mode queries (only used when persona === "consumer")
  const { data: consumerStats } = useQuery({
    queryKey: ["dashboard-consumer-stats", user?.id ?? "guest"],
    queryFn: () => (user?.id ? getProfileStats(user.id) : null),
    enabled: persona === "consumer" && !!user?.id,
  });

  const { data: consumerFriends = [] } = useQuery({
    queryKey: ["dashboard-consumer-friends", user?.id ?? "guest"],
    queryFn: () => (user?.id ? getMyFriendsWithProfiles(user.id) : []),
    enabled: persona === "consumer" && !!user?.id,
  });

  const claimedPerks = useMemo(() => getClaimedLaunchPerks(), []);

  const { data: recentFeed = [] } = useQuery({
    queryKey: ["dashboard-client-feed"],
    queryFn: () => fetchFeed(null),
  });

  const { data: candidates = [], refetch: refetchCandidates } = useQuery({
    queryKey: ["brand-candidates"],
    queryFn: fetchBrandCandidates,
    enabled: hasAdminView && activeTab === "admin_sourcing",
  });

  const { data: pendingVerifications = [], refetch: refetchVerifications } = useQuery({
    queryKey: ["pending-verifications"],
    queryFn: fetchPendingVerifications,
    enabled: hasAdminView && activeTab === "admin_sourcing",
  });

  const handleSaveBrandIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandNameDraft.trim()) {
      toast.error("Please enter your registered brand name.");
      return;
    }
    const updated = setRegisteredBrandIdentity({
      name: brandNameDraft.trim(),
      category: brandCategoryDraft.trim() || "Consumer Brand",
      country: brandCountryDraft.trim().toUpperCase().slice(0, 2) || "ZA",
      website: brandWebsiteDraft.trim(),
      verified: true,
    });
    setRegisteredBrand(updated);
    setEditingBrand(false);
    toast.success(
      `Registered Brand updated to ${updated.name}. All dashboard data is now exclusively scoped to ${updated.name}.`,
    );
  };

  const handleSwitchTier = (tierId: BrandPlanTierId) => {
    setActiveBrandPlanTier(tierId, activeBrand.name);
    setSubState(getActiveBrandSubscription());
    const chosen = B2B_BRAND_PLANS.find((p) => p.id === tierId);
    toast.success(
      `Active Payment Tier for ${activeBrand.name} set to ${chosen?.name ?? tierId}.`,
    );
  };

  const handlePublishCountryBrands = async () => {
    setSourcingBusy(true);
    try {
      const res = await publishBrandsFromWikidata({
        countryCode: importCountry,
        limit: importLimit,
        ownerId: user?.id ?? "admin-dashboard-importer",
        searchQuery: importKeyword.trim() || undefined,
      });
      toast.success(
        `Sourced & published ${res.published} brands for ${countryName(importCountry) || importCountry} (${res.skipped} already active).`,
      );
      await Promise.all([
        refetchCandidates(),
        queryClient.invalidateQueries({ queryKey: ["brands"] }),
      ]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not source brands.");
    } finally {
      setSourcingBusy(false);
    }
  };

  const handleQueueCountryBrands = async () => {
    setSourcingBusy(true);
    try {
      const res = await importBrandsFromWikidata({
        countryCode: importCountry,
        limit: importLimit,
        searchQuery: importKeyword.trim() || undefined,
      });
      toast.success(
        `Queued ${res.inserted} candidate brands for ${countryName(importCountry) || importCountry}.`,
      );
      await refetchCandidates();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Queue import failed.");
    } finally {
      setSourcingBusy(false);
    }
  };

  const handleIssueRecoveryVoucher = async (clientName: string, clientId: string, bName: string) => {
    const prefix = bName.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5) || "BRAND";
    const voucherCode = `SOT_RECOVER_${prefix}_${Math.floor(100 + Math.random() * 899)}`;
    const activeOp = getActiveDeskOperator();
    recordOperatorResolutionMetric(
      "voucher_issued",
      `Issued Recovery Voucher ${voucherCode} to ${clientName} for ${bName} — flipped Trash to Stash.`,
    );
    recordOperatorResolutionMetric(
      "trash_to_stash",
      `Flipped ${clientName}'s Trash callout into a Verified Stash for ${bName}.`,
    );
    addCxLifecycleResolution({
      brandName: bName,
      clientName,
      stage1LaunchSource: `Engaged with ${bName} on SOT Feed / Launch Stage`,
      stage2ScanOrPostSignal: `Customer feedback resolved within 14–20 day CPA window`,
      initialVerdict: "trash",
      operatorAssigned: `${activeOp.name} (${activeOp.roleTitle})`,
      actionTaken: `Issued Recovery Voucher & Direct Outreach`,
      voucherCode,
      finalVerdict: "stash",
      revenueRetainedZar: 1650,
    });
    if (user?.id && clientId && clientId !== user.id) {
      try {
        await sendMessage({
          senderId: user.id,
          recipientId: clientId,
          body: `🎁 OFFICIAL REVENUE RECOVERY VOUCHER from ${bName} (Desk Operator: ${activeOp.name}): Thank you for your feedback on SOT. Please use code ${voucherCode} for a complimentary replacement / VIP recovery discount on your next order.`,
        });
      } catch {
        // ignore
      }
    }
    toast.success(
      `🎁 Issued Recovery Voucher (${voucherCode}) to ${clientName}! Credited to operator ${activeOp.name} on the ${bName} CX Matrix.`,
    );
  };

  const handleRequestToCallClient = async (clientName: string, clientId: string, bName: string) => {
    const senderId = user?.id || "brand-executive";
    const activeOp = getActiveDeskOperator();
    approveCallerForSession(clientId, senderId);
    recordOperatorResolutionMetric(
      "client_call",
      `Initiated Zero-Phone-Number Request-to-Call with ${clientName} on behalf of ${bName}.`,
    );
    if (user?.id && clientId && clientId !== user.id) {
      try {
        await sendMessage({
          senderId: user.id,
          recipientId: clientId,
          body: `🤝 CALL PERMISSION REQUEST from ${bName} (On-Duty Operator: ${activeOp.name} · ${activeOp.roleTitle}): "May we ring you directly on SOT Voice/Video (no phone number needed) to resolve your post and issue a recovery voucher?" Click Approve Call in this chat to connect.`,
        });
      } catch {
        // ignore
      }
    }
    toast.success(
      `🤝 Sent 1-click "Request-to-Call" handshake to ${clientName} on behalf of ${bName}!`,
    );
  };

  // Client feedback items strictly scoped to this Brand Owner's registered brand
  const brandScopedClientPosts = useMemo(() => {
    const bLower = activeBrand.name.toLowerCase();
    const matching = recentFeed.filter(
      (item: any) =>
        item.brandName && item.brandName.toLowerCase().includes(bLower),
    );
    if (matching.length > 0) return matching.slice(0, 8);
    const prefix = activeBrand.name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5) || "BRAND";
    return [
      {
        id: "brand-client-1",
        user_id: "client-thabo",
        authorName: "Thabo M. (Verified Voter)",
        brandName: activeBrand.name,
        title: `${activeBrand.name} order at Sandton branch was missing an item — requesting replacement voucher`,
        stashCount: 2,
        trashCount: 6,
      },
      {
        id: "brand-client-2",
        user_id: "client-lerato",
        authorName: "Lerato K. (Gold Circle Member)",
        brandName: activeBrand.name,
        title: `Scanned ${activeBrand.name} batch barcode #${prefix}-882 — outer packaging seal looked loose`,
        stashCount: 4,
        trashCount: 5,
      },
      {
        id: "brand-client-3",
        user_id: "client-kabelo",
        authorName: "Kabelo S. (Level 4 Watchdog)",
        brandName: activeBrand.name,
        title: `Watched ${activeBrand.name} Live Launch reveal — product quality exceeded expectations!`,
        stashCount: 19,
        trashCount: 1,
      },
    ];
  }, [activeBrand.name, recentFeed]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* =====================================================================
            DEVELOPER-ONLY INSPECTION BAR (HIDDEN FROM ALL REGULAR USERS & BRANDS)
           ===================================================================== */}
        {isDeveloper && (
          <section className="mb-6 rounded-2xl border border-dashed border-[#d6a928] bg-card p-3 shadow-xs">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs">
                <span className="font-black uppercase tracking-wider text-[#b88914]">
                  🛠️ Developer-Only Inspection Toggle (Hidden from Users &amp; Brands):
                </span>{" "}
                <span className="text-muted-foreground">
                  Regular Personal Users and Brand Owners only ever see their own isolated account type and never see this toggle.
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-secondary p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setPersona("consumer")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap",
                    persona === "consumer"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Coins className="h-3.5 w-3.5" />
                  DEV Preview: Personal User
                </button>
                <button
                  type="button"
                  onClick={() => setPersona("brand_owner")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap",
                    persona === "brand_owner"
                      ? "bg-slate-950 text-[#f5d061] shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Building2 className="h-3.5 w-3.5 text-[#d6a928]" />
                  DEV Preview: Brand ({activeBrand.name})
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            MODE A: PERSONAL CONSUMER HUB (100% ISOLATED CONSUMER VIEW)
           ===================================================================== */}
        {persona === "consumer" ? (
          <div className="space-y-6">
            <section className="rounded-3xl border-2 border-emerald-600/40 bg-gradient-to-b from-emerald-950 to-slate-950 p-6 text-white shadow-lg sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-300">
                    <Coins className="h-3.5 w-3.5" />
                    Personal Consumer Member Hub · 100% Free Forever
                  </span>
                  <h1 className="mt-3 font-display text-3xl font-black text-white sm:text-4xl">
                    {user?.displayName || user?.email?.split("@")[0] || "Personal Member"} — Personal Dashboard
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm text-emerald-100/80">
                    This is your personal consumer workspace. Track your Stash/Trash verdicts, Mutual Friends, and claimed Launch Vouchers — completely separate from any Corporate Brand Account.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Button
                    onClick={() => navigate({ to: "/profile" })}
                    className="gap-1.5 bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935]"
                  >
                    <Users className="h-4 w-4" /> Open Full Personal Profile &amp; Friends
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate({ to: "/scan" })}
                    className="gap-1.5 border-emerald-500/40 bg-emerald-900/40 text-white hover:bg-emerald-900/60"
                  >
                    <ScanBarcode className="h-4 w-4 text-[#d6a928]" /> Scan Product Barcode
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    My Personal Votes
                  </p>
                  <p className="mt-1 font-display text-2xl font-black text-white tabular-nums">
                    {(consumerStats?.stashVotes ?? 12) + (consumerStats?.trashVotes ?? 4)} Verdicts
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Mutual Friends
                  </p>
                  <p className="mt-1 font-display text-2xl font-black text-[#f5d061] tabular-nums">
                    {consumerFriends.filter((f) => f.status === "accepted").length} Connected
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Pending Friend Requests
                  </p>
                  <p className="mt-1 font-display text-2xl font-black text-white tabular-nums">
                    {consumerFriends.filter((f) => f.status === "pending").length} Pending
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Claimed Launch Vouchers
                  </p>
                  <p className="mt-1 font-display text-2xl font-black text-emerald-400 tabular-nums">
                    {claimedPerks.length} Active Perks
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Consumer Actions */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  <Gift className="h-5 w-5 text-[#d6a928]" />
                  My Claimed Vouchers ({claimedPerks.length})
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Discount codes &amp; recovery vouchers claimed during Live Brand Launches.
                </p>
                <div className="mt-3 space-y-2">
                  {claimedPerks.slice(0, 2).map((perk) => (
                    <div
                      key={perk.id}
                      className="rounded-xl border border-[#d6a928]/40 bg-[#d6a928]/5 p-2.5 text-xs"
                    >
                      <p className="font-bold text-foreground">{perk.brandName} · {perk.discountLabel}</p>
                      <p className="font-mono font-extrabold text-emerald-600">Code: {perk.promoCode}</p>
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate({ to: "/profile" })}
                  className="mt-3 w-full text-xs font-bold"
                >
                  Open Full Voucher Wallet →
                </Button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-emerald-600" />
                  Mutual Friends &amp; Bond Circles
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Manage pending, accepted, and blocked connections in your personal <code>friends</code> table.
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate({ to: "/profile" })}
                  className="mt-4 w-full bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  Manage Friends &amp; Privacy →
                </Button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  <ScanBarcode className="h-5 w-5 text-[#d6a928]" />
                  Barcode &amp; Authenticity Scanner
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Scan product barcodes or packaging before you buy to verify authenticity and cast your Stash or Trash verdict.
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate({ to: "/scan" })}
                  className="mt-4 w-full bg-[#d6a928] text-xs font-black text-slate-950 hover:bg-[#e5b935]"
                >
                  Open Barcode Scanner →
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* =====================================================================
              MODE B: OFFICIAL REGISTERED BRAND OWNER DASHBOARD
              (100% Dedicated to activeBrand — Zero Other Brands Shown!)
             ===================================================================== */
          <>
            {/* Top Executive Header — Exclusively for the Registered Brand + Active Payment Tier */}
            <div className="rounded-3xl border-2 border-[#d6a928] bg-slate-950 p-6 text-white shadow-lg sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#d6a928]/50 bg-[#d6a928]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#f5d061]">
                      <Building2 className="h-3.5 w-3.5 text-[#d6a928]" />
                      Official Registered Brand Suite · Single-Brand Dedicated View
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-black text-emerald-300">
                      <CreditCard className="h-3.5 w-3.5" />
                      Active Tier: {activePlan.name} (R{activePlan.priceZarMonthly.toLocaleString()}/mo)
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
                      {activeBrand.name} — Brand Command Center
                    </h1>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingBrand((v) => !v)}
                      className="h-8 gap-1.5 border-slate-700 bg-slate-900 text-xs font-bold text-[#f5d061] hover:bg-slate-800"
                    >
                      <Pencil className="h-3 w-3" /> Change / Edit My Registered Brand
                    </Button>
                  </div>

                  <p className="mt-1.5 max-w-2xl text-sm text-slate-300">
                    All analytics, barcode scans, branch telemetry, client calls, and CX turnarounds on this dashboard belong <strong>100% exclusively to {activeBrand.name}</strong> — governed by your active <strong>{activePlan.name}</strong> subscription tier.
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Button
                    onClick={() => {
                      setStudioCategory("product_launch");
                      setStudioModalOpen(true);
                    }}
                    className="gap-1.5 border-2 border-[#d6a928] bg-[#d6a928] font-black text-slate-950 hover:bg-[#e3b634]"
                  >
                    <Rocket className="h-4 w-4" /> Launch / Relaunch {activeBrand.name} Live
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("b2b_pricing")}
                    className="gap-1.5 border-[#d6a928]/60 bg-slate-900 font-bold text-[#f5d061] hover:bg-slate-800"
                  >
                    <CreditCard className="h-4 w-4 text-[#d6a928]" /> Manage Tier / Billing
                  </Button>
                </div>
              </div>

              {/* Inline Registered Brand Identity Editor (so Brand Owner can bind any brand name) */}
              {editingBrand && (
                <form
                  onSubmit={handleSaveBrandIdentity}
                  className="mt-5 grid gap-3 rounded-2xl border border-[#d6a928]/50 bg-slate-900 p-4 sm:grid-cols-4"
                >
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[#f5d061]">
                      Registered Brand Name
                    </label>
                    <Input
                      value={brandNameDraft}
                      onChange={(e) => setBrandNameDraft(e.target.value)}
                      placeholder="e.g. Nando's South Africa"
                      className="h-9 border-slate-700 bg-slate-950 text-xs font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-300">
                      Industry Category
                    </label>
                    <Input
                      value={brandCategoryDraft}
                      onChange={(e) => setBrandCategoryDraft(e.target.value)}
                      placeholder="e.g. Food & Fast Food"
                      className="h-9 border-slate-700 bg-slate-950 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-300">
                      Country Code (ISO)
                    </label>
                    <Input
                      value={brandCountryDraft}
                      onChange={(e) => setBrandCountryDraft(e.target.value.toUpperCase().slice(0, 2))}
                      placeholder="ZA"
                      maxLength={2}
                      className="h-9 border-slate-700 bg-slate-950 text-xs text-white"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button
                      type="submit"
                      className="h-9 flex-1 bg-[#d6a928] text-xs font-black text-slate-950 hover:bg-[#e5b935]"
                    >
                      Save My Brand
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setEditingBrand(false)}
                      className="h-9 text-xs text-slate-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Active Payment Tier & Entitlements Bar */}
              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#f5d061]">
                    💳 Active Payment Level &amp; Data Entitlements for {activeBrand.name}
                  </span>
                  <p className="mt-0.5 text-xs text-slate-300">
                    {activePlan.broadcastLimitLabel} · {activePlan.operatorSeatsLabel}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {B2B_BRAND_PLANS.map((plan) => {
                    const isCurrent = subState.activePlanId === plan.id;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => handleSwitchTier(plan.id)}
                        className={cn(
                          "rounded-xl border px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap",
                          isCurrent
                            ? "border-[#d6a928] bg-[#d6a928] text-slate-950 shadow-xs"
                            : "border-slate-700 bg-slate-950 text-slate-300 hover:border-[#d6a928]/50 hover:text-white",
                        )}
                      >
                        {isCurrent ? "✓ " : ""}
                        {plan.name.split(" (")[0]} (R{plan.priceZarMonthly.toLocaleString()}/mo)
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Switch Active Operator / Shift Handover Bar for Shared Brand Logins */}
            <div className="mt-4">
              <BrandOperatorHandoverBar brandName={activeBrand.name} />
            </div>

            {/* EXECUTIVE WORKSPACE NAVIGATION BAR */}
            <div className="mt-5 flex flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-xs">
              {(
                [
                  ["command", `📊 ${activeBrand.name} Intelligence & Barometer`],
                  ["launch_studio", `🚀 ${activeBrand.name} Launch & Broadcast Studio`],
                  [
                    "client_desk",
                    `📞 ${activeBrand.name} Client Calling Desk ${hasTier2 ? "" : "🔒 Tier 2"}`,
                  ],
                  [
                    "cx_awards",
                    `🏆 ${activeBrand.name} CX Matrix & Staff Awards ${hasTier2 ? "" : "🔒 Tier 2+"}`,
                  ],
                  ["b2b_pricing", "💳 Payment Tiers & Checkout (Google Pay / EFT)"],
                  ...(hasAdminView ? ([["admin_sourcing", "🌍 Platform Admin Sourcing"]] as const) : []),
                ] as const
              ).map(([tabKey, tabLabel]) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setActiveTab(tabKey as DashboardTab)}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-xs font-extrabold transition cursor-pointer whitespace-nowrap",
                    activeTab === tabKey
                      ? "bg-slate-950 text-[#f5d061] shadow-xs"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {tabLabel}
                </button>
              ))}
            </div>

            {/* =====================================================================
                TAB 1: DEDICATED SINGLE-BRAND INTELLIGENCE & BAROMETER
               ===================================================================== */}
            {activeTab === "command" && (
              <div className="mt-6 space-y-6">
                <BrandRow
                  key={activeBrand.id}
                  brand={activeBrand}
                  activePlanId={subState.activePlanId}
                  onVerify={() => {
                    const next = setRegisteredBrandIdentity({
                      name: activeBrand.name,
                      verified: true,
                    });
                    setRegisteredBrand(next);
                  }}
                  onOpenLaunchStudio={(cat) => {
                    setStudioCategory(cat);
                    setStudioModalOpen(true);
                  }}
                  onUpgradeTier={() => setActiveTab("b2b_pricing")}
                />

                {/* Live Consumer Incidents & Crisis Feed for this Brand */}
                <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <LiveIncidents />
                </section>

                {/* Tier 3 Exclusive: AI CX Copilot & Pre-Publication Safety Modules */}
                {hasTier3 ? (
                  <>
                    <SecureConnectionsPanel userId={user?.id ?? "preview-operator"} />
                    <BrandAICopilot />
                    <ContentSafetyGate />
                  </>
                ) : (
                  <section className="rounded-3xl border-2 border-dashed border-[#d6a928]/60 bg-slate-950 p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#d6a928]/20 px-2.5 py-1 text-xs font-black uppercase text-[#f5d061]">
                          <Lock className="h-3.5 w-3.5 text-[#d6a928]" />
                          Tier 3 Entitlement · Enterprise Intelligence &amp; Awards Suite
                        </span>
                        <h3 className="mt-2 font-display text-xl font-black">
                          Unlock AI CX Copilot, 14–20 Day CPA Pre-Escalation Shield &amp; Official Staff Awards for {activeBrand.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-300">
                          Your account is currently on <strong>{activePlan.name}</strong>. Upgrade to Plan 03 (Enterprise Intelligence · R14,900/mo) to unlock automated AI crisis drafting and downloadable SOrT Employee Recognition certificates.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <Button
                          onClick={() => handleSwitchTier("enterprise_intelligence")}
                          className="bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935]"
                        >
                          Activate Tier 3 Now →
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab("b2b_pricing")}
                          className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                        >
                          Compare Payment Tiers
                        </Button>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* =====================================================================
                TAB 2: BRAND LAUNCH, RELAUNCH & ENGAGEMENT BROADCAST STUDIO
               ===================================================================== */}
            {activeTab === "launch_studio" && (
              <div className="mt-6 space-y-6">
                <section className="rounded-3xl border-2 border-[#d6a928] bg-card p-6 shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-[#b88914]">
                          {activeBrand.name} · Commercial Broadcast Engine
                        </span>
                        <span className="rounded-md bg-slate-950 px-2.5 py-0.5 text-[11px] font-black text-[#f5d061]">
                          Active Tier Limit: {activePlan.broadcastLimitLabel}
                        </span>
                      </div>
                      <h2 className="mt-1 font-display text-2xl font-black">
                        Launch or Relaunch {activeBrand.name} Products Live to Clients &amp; Prospects
                      </h2>
                      <p className="mt-1 max-w-3xl text-xs text-muted-foreground sm:text-sm">
                        Select any broadcast template below for <strong>{activeBrand.name}</strong>. When you go live, SOT automatically alerts your followers, places your stream on the Home Feed, collects real-time Stash/Trash market research votes, and lets viewers claim your Launch Voucher in 1 click.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setStudioCategory("product_launch");
                        setStudioModalOpen(true);
                      }}
                      className="gap-2 bg-slate-950 text-[#f5d061] font-black hover:bg-slate-900 shrink-0"
                    >
                      <Rocket className="h-4 w-4 text-[#d6a928]" />
                      Open Full Live Studio for {activeBrand.name}
                    </Button>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {BRAND_BROADCAST_CATEGORIES.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex flex-col justify-between rounded-2xl border border-border bg-background p-4"
                      >
                        <div>
                          <span className="inline-block rounded-md bg-slate-950 px-2.5 py-1 text-[11px] font-black text-[#f5d061]">
                            {cat.shortBadge}
                          </span>
                          <h3 className="mt-2.5 font-display text-sm font-black">{cat.label}</h3>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                            {cat.description}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setStudioCategory(cat.id);
                            setStudioModalOpen(true);
                          }}
                          className="mt-4 w-full gap-1.5 bg-[#d6a928] text-xs font-black text-slate-950 hover:bg-[#e5b935]"
                        >
                          <Radio className="h-3.5 w-3.5" /> Start {cat.shortBadge.split(" ")[1]}
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>

                <LiveStageSection defaultFilter="brand_owner" />
              </div>
            )}

            {/* =====================================================================
                TAB 3: ZERO-NUMBER CLIENT CALLING & REVENUE RECOVERY DESK
               ===================================================================== */}
            {activeTab === "client_desk" && (
              <div className="mt-6 space-y-6">
                {!hasTier2 && (
                  <div className="flex flex-col gap-3 rounded-2xl border-2 border-[#d6a928] bg-slate-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#f5d061]">
                        <Lock className="h-3.5 w-3.5 text-[#d6a928]" />
                        Tier 2 Feature · Full-Cycle CX &amp; Launch Matrix (R4,950/mo)
                      </span>
                      <p className="mt-1 text-xs text-slate-300">
                        Zero-Phone-Number Direct Client Calling &amp; 1-Click Recovery Voucher dispatch is unlocked on Tier 2 and Tier 3.
                      </p>
                    </div>
                    <Button
                      onClick={() => handleSwitchTier("cx_launch_matrix")}
                      className="bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935] shrink-0"
                    >
                      Unlock Tier 2 Calling Desk →
                    </Button>
                  </div>
                )}

                {/* BRAND INBOUND CALLING & CONTACT CONTROLS PANEL */}
                <BrandInboundContactSettingsPanel
                  brandName={activeBrand.name}
                  brandSlug={activeBrand.slug}
                  onInitiateCall={(target) => {
                    setMessengerCallSession({
                      roomChannel: `sot-private-${activeBrand.slug}-${target.id}-${Date.now()}`,
                      partnerId: target.id,
                      partnerName: target.name,
                      isBrandCall: true,
                      brandName: activeBrand.name,
                      mode: target.mode,
                      callDirection: "brand_to_user",
                    });
                    setMessengerCallOpen(true);
                  }}
                />

                <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                        {activeBrand.name} · Zero-Phone-Number Client Outreach &amp; CPA Resolution
                      </span>
                      <h2 className="mt-1 font-display text-2xl font-black">
                        {activeBrand.name} Direct Client Calling, Request-to-Call &amp; Recovery Desk
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        Every customer listed below posted about or scanned a <strong>{activeBrand.name}</strong> product. Reach them directly on SOT via private Messenger-style 1-on-1 call without needing their phone number, or issue a 1-click replacement voucher to flip their Trash verdict into a Stash.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {brandScopedClientPosts.map((item: any, idx: number) => {
                      const clientName = item.authorName || `Verified ${activeBrand.name} Customer #${idx + 1}`;
                      const clientId = item.user_id || `client-${idx + 1}`;
                      const isTrashHeavy = (item.trashCount || 0) > (item.stashCount || 0);

                      return (
                        <div
                          key={item.id || idx}
                          className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-background p-4 lg:flex-row lg:items-center"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-bold text-foreground">{clientName}</span>
                              <span>·</span>
                              <span className="font-semibold text-[#b88914]">{activeBrand.name}</span>
                              <span>·</span>
                              <span
                                className={cn(
                                  "font-bold",
                                  isTrashHeavy ? "text-rose-600" : "text-emerald-600",
                                )}
                              >
                                {isTrashHeavy
                                  ? `🗑️ Trash Callout (${item.trashCount || 1} Trash)`
                                  : `🪙 Stash Verdict (${item.stashCount || 1} Stash)`}
                              </span>
                              <span>·</span>
                              <span className="text-muted-foreground">
                                Privacy: Verified {activeBrand.name} Outreach Allowed
                              </span>
                            </div>
                            <p className="mt-1 font-display text-sm font-bold text-foreground">
                              “{item.title}”
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <Button
                              size="sm"
                              disabled={!hasTier2}
                              onClick={() => {
                                setMessengerCallSession({
                                  roomChannel: `sot-private-${activeBrand.slug}-${clientId}-${Date.now()}`,
                                  partnerId: clientId,
                                  partnerName: clientName,
                                  isBrandCall: true,
                                  brandName: activeBrand.name,
                                  mode: "voice",
                                  callDirection: "brand_to_user",
                                });
                                setMessengerCallOpen(true);
                              }}
                              className="h-8 gap-1.5 bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                            >
                              <Phone className="h-3.5 w-3.5" /> Call Customer (Voice)
                            </Button>
                            <Button
                              size="sm"
                              disabled={!hasTier2}
                              onClick={() => {
                                setMessengerCallSession({
                                  roomChannel: `sot-private-${activeBrand.slug}-${clientId}-${Date.now()}`,
                                  partnerId: clientId,
                                  partnerName: clientName,
                                  isBrandCall: true,
                                  brandName: activeBrand.name,
                                  mode: "video",
                                  callDirection: "brand_to_user",
                                });
                                setMessengerCallOpen(true);
                              }}
                              className="h-8 gap-1.5 bg-slate-950 text-xs font-bold text-[#f5d061] hover:bg-slate-900"
                            >
                              <Video className="h-3.5 w-3.5" /> Video Inspect
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!hasTier2}
                              onClick={() =>
                                void handleRequestToCallClient(clientName, clientId, activeBrand.name)
                              }
                              className="h-8 gap-1.5 text-xs font-bold"
                            >
                              <UserCheck className="h-3.5 w-3.5 text-[#d6a928]" /> Request-to-Call
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!hasTier2}
                              onClick={() =>
                                void handleIssueRecoveryVoucher(clientName, clientId, activeBrand.name)
                              }
                              className="h-8 gap-1.5 border-[#d6a928]/60 text-xs font-bold text-[#b88914] hover:bg-[#d6a928]/10"
                            >
                              <Gift className="h-3.5 w-3.5" /> Issue Recovery Voucher
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}

            {/* =====================================================================
                TAB 4: FULL-CYCLE CX DATA EXTRACTION MATRIX & SOrT EMPLOYEE AWARDS
               ===================================================================== */}
            {activeTab === "cx_awards" && (
              <div className="mt-6">
                <BrandCxDataAndAwardsMatrix
                  brandName={activeBrand.name}
                  onUpgradeRequest={() => setActiveTab("b2b_pricing")}
                />
              </div>
            )}

            {/* =====================================================================
                TAB 5: B2B DATA & BROADCAST PRICING + MULTI-GATEWAY CHECKOUT
               ===================================================================== */}
            {activeTab === "b2b_pricing" && (
              <div className="mt-6">
                <BrandB2BPricingAndCheckoutPanel brandName={activeBrand.name} />
              </div>
            )}

            {/* =====================================================================
                TAB 6: ADMIN-ONLY GLOBAL BRAND SOURCING MASTER SUITE
               ===================================================================== */}
            {activeTab === "admin_sourcing" && hasAdminView && (
              <section className="mt-6 space-y-6 rounded-3xl border-2 border-[#d6a928]/50 bg-card p-6 shadow-md sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-950 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#d6a928]">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Platform Admin Only · Global Directory Sourcing</span>
                    </div>
                    <h2 className="mt-2 font-display text-2xl font-black">
                      Global Country Brand Sourcing (Wikidata + Country Atlas)
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Admin tool to populate the public <code>/brands</code> directory. Individual Brand Owners never see other brands on their dashboard.
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="gap-1.5">
                    <Link to="/brands">
                      <Globe className="h-4 w-4 text-[#d6a928]" /> Browse Public Directory
                    </Link>
                  </Button>
                </div>

                <div className="grid gap-3 rounded-2xl border border-border bg-background/60 p-4 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="flex flex-col text-xs font-semibold">
                    <span className="mb-1 text-muted-foreground">Select Country (240+ Supported)</span>
                    <select
                      value={importCountry}
                      onChange={(e) => setImportCountry(e.target.value)}
                      className="h-10 rounded-lg border border-border bg-background px-2.5 text-sm font-medium"
                    >
                      <optgroup label="Featured Markets">
                        {SUPPORTED_IMPORT_COUNTRIES.map(([c, l]) => (
                          <option key={c} value={c}>
                            {l}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="All World Countries">
                        {WORLD_COUNTRY_CODES.filter(
                          (code) => !SUPPORTED_IMPORT_COUNTRIES.some(([sc]) => sc === code),
                        ).map((code) => (
                          <option key={code} value={code}>
                            {countryLabel(code)} ({code})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </label>

                  <label className="flex flex-col text-xs font-semibold sm:col-span-2">
                    <span className="mb-1 text-muted-foreground">
                      Optional Industry / Brand Search Filter
                    </span>
                    <Input
                      value={importKeyword}
                      onChange={(e) => setImportKeyword(e.target.value)}
                      placeholder="e.g. bank, telecom, airline, retail..."
                    />
                  </label>

                  <label className="flex flex-col text-xs font-semibold">
                    <span className="mb-1 text-muted-foreground">Max Brands</span>
                    <Input
                      type="number"
                      min={1}
                      max={200}
                      value={importLimit}
                      onChange={(e) => setImportLimit(Number(e.target.value))}
                    />
                  </label>

                  <div className="flex flex-wrap items-center gap-2.5 sm:col-span-2 lg:col-span-4 pt-1">
                    <Button
                      onClick={() => void handlePublishCountryBrands()}
                      disabled={sourcingBusy}
                      className="gap-1.5 bg-[#d6a928] font-extrabold text-slate-950 hover:bg-[#e5b935]"
                    >
                      {sourcingBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span>
                        {sourcingBusy
                          ? "Sourcing Brands..."
                          : `Source & Publish ${countryName(importCountry) || importCountry} Brands Now`}
                      </span>
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => void handleQueueCountryBrands()}
                      disabled={sourcingBusy}
                      className="gap-1.5 font-bold"
                    >
                      <Globe className="h-4 w-4" />
                      Fetch into Moderation Queue
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <h3 className="font-display text-sm font-extrabold uppercase tracking-wider">
                      Wikidata Import Queue ({candidates.length})
                    </h3>
                    <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                      {candidates.length === 0 ? (
                        <p className="py-4 text-xs text-muted-foreground">
                          No queued candidates waiting.
                        </p>
                      ) : (
                        candidates.slice(0, 20).map((cand) => (
                          <div
                            key={cand.id}
                            className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-2.5 text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-bold">{cand.name}</p>
                              <p className="truncate text-[11px] text-muted-foreground">
                                {countryLabel(cand.country)} · {cand.category ?? "Consumer Brand"}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <Button
                                size="sm"
                                className="h-7 px-2 text-xs bg-[#d6a928] text-slate-950 font-bold hover:bg-[#e5b935]"
                                onClick={async () => {
                                  try {
                                    await approveBrandCandidate(cand.id, user?.id ?? "admin");
                                    toast.success(`Approved ${cand.name}`);
                                    await refetchCandidates();
                                  } catch {
                                    toast.error("Could not approve candidate");
                                  }
                                }}
                              >
                                <Check className="h-3.5 w-3.5" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                onClick={async () => {
                                  await rejectBrandCandidate(cand.id, user?.id ?? "admin");
                                  await refetchCandidates();
                                }}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <h3 className="font-display text-sm font-extrabold uppercase tracking-wider">
                      Pending Brand Verifications ({pendingVerifications.length})
                    </h3>
                    <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                      {pendingVerifications.length === 0 ? (
                        <p className="py-4 text-xs text-muted-foreground">
                          No pending verification requests in queue.
                        </p>
                      ) : (
                        pendingVerifications.map((req) => (
                          <div
                            key={req.id}
                            className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-xs"
                          >
                            <div>
                              <p className="font-bold">{req.brandName}</p>
                              <p className="text-muted-foreground">{req.message}</p>
                            </div>
                            <div className="flex gap-1.5">
                              <Button
                                size="sm"
                                className="h-7 bg-emerald-600 text-white hover:bg-emerald-500"
                                onClick={async () => {
                                  await reviewVerification({
                                    requestId: req.id,
                                    brandId: req.brand_id,
                                    reviewerId: user?.id ?? "admin",
                                    approve: true,
                                  });
                                  toast.success(`Verified ${req.brandName}`);
                                  await refetchVerifications();
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7"
                                onClick={async () => {
                                  await reviewVerification({
                                    requestId: req.id,
                                    brandId: req.brand_id,
                                    reviewerId: user?.id ?? "admin",
                                    approve: false,
                                  });
                                  await refetchVerifications();
                                }}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background/50 p-4">
                  <h3 className="mb-3 font-display text-sm font-extrabold uppercase tracking-wider">
                    Human Content Appeals Queue
                  </h3>
                  <AdminAppealsQueue />
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <LiveBroadcastModal
        open={studioModalOpen}
        onOpenChange={(o) => {
          setStudioModalOpen(o);
          if (!o) setCallClientTarget(null);
        }}
        brandName={activeBrand.name}
        brandSlug={activeBrand.slug}
        brandOwner={activeBrand.ownerName || `${activeBrand.name} Official Executive Desk`}
        productName={
          callClientTarget
            ? `Resolution Call: ${callClientTarget.topic}`
            : `LIVE LAUNCH: ${activeBrand.name} Product & Innovation Reveal`
        }
        recipientId={callClientTarget?.id}
        recipientName={callClientTarget?.name}
        defaultMode={callClientTarget ? callClientTarget.mode : "broadcast"}
        callDirection="brand_to_user"
        initialPersona="brand_owner"
        initialBrandCategory={studioCategory}
      />

      {/* Messenger-Style Private 1-on-1 Call Modal */}
      <MessengerPrivateCallModal
        open={messengerCallOpen}
        onOpenChange={setMessengerCallOpen}
        session={messengerCallSession}
        onCallEnded={() => setMessengerCallSession(null)}
      />
    </div>
  );
}

function BrandRow({
  brand,
  activePlanId,
  onVerify,
  onOpenLaunchStudio,
  onUpgradeTier,
}: {
  brand: Brand;
  activePlanId: BrandPlanTierId;
  onVerify: () => void;
  onOpenLaunchStudio: (cat: BrandBroadcastCategory) => void;
  onUpgradeTier: () => void;
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [localVerified, setLocalVerified] = useState(brand.verified);
  const [commOpen, setCommOpen] = useState(false);

  const hasTier2 = isTierEntitled(activePlanId, "cx_launch_matrix");
  const hasTier3 = isTierEntitled(activePlanId, "enterprise_intelligence");

  const { data: stats } = useQuery({
    queryKey: ["brand-stats", brand.id],
    queryFn: () => fetchBrandStats(brand.id),
  });

  const { data: followers } = useQuery({
    queryKey: ["brand-followers", brand.id],
    queryFn: () => getFollowerCount({ brandId: brand.id }),
  });

  const { data: kpis } = useQuery({
    queryKey: ["brand-kpis", brand.id],
    queryFn: () => fetchBrandKpis(brand.id, 30),
  });

  const brandTelemetry = useMemo(
    () => getBrandSpecificTelemetry(brand.name),
    [brand.name],
  );

  const askVerify = async () => {
    try {
      await requestVerification({
        brandId: brand.id,
        userId: user?.id ?? "brand-operator",
        message: "Requested from Brand Dashboard",
      });
      setLocalVerified(true);
      toast.success(t("brand.verificationPending", { defaultValue: "Verification requested!" }));
      onVerify();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  };

  const stashCount = stats?.stash ?? kpis?.stash ?? 613;
  const trashCount = stats?.trash ?? kpis?.trash ?? 65;
  const total = stashCount + trashCount;
  const trustScore = Number(brand.trust_score) > 0 ? Number(brand.trust_score) : 86;
  const stashPct = total > 0 ? Math.round((100 * stashCount) / total) : trustScore;
  const isVerified = localVerified || brand.verified;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border-2 border-[#d6a928]/40 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6">
          {/* Top Brand Identity & Action Bar */}
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <BrandLogo
                name={brand.name}
                url={brand.signedLogoUrl}
                className="h-16 w-16 rounded-2xl text-xl shadow-xs"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-2xl font-black text-foreground">{brand.name}</h2>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#d6a928]/50 bg-slate-950 px-2.5 py-0.5 text-xs font-bold text-[#d6a928]">
                      <BadgeCheck className="h-3.5 w-3.5" /> {t("dashboard.verified")}
                    </span>
                  ) : (
                    <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      {t("dashboard.unverified")}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {brand.category && <span className="font-medium">{brand.category}</span>}
                  {brand.country && (
                    <>
                      <span>·</span>
                      <span className="font-semibold">{brand.country}</span>
                    </>
                  )}
                  {brand.website && (
                    <>
                      <span>·</span>
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                      >
                        Website <ExternalLink className="h-3 w-3" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={() => onOpenLaunchStudio("product_launch")}
                className="gap-1.5 bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935]"
              >
                <Rocket className="h-3.5 w-3.5" /> Launch / Relaunch Live
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenLaunchStudio("townhall_qa")}
                className="gap-1.5 border-rose-500/40 font-bold text-rose-500 hover:bg-rose-500/10"
              >
                <Radio className="h-3.5 w-3.5" /> Live Townhall
              </Button>
              <BrandTeamDialog brandId={brand.id} brandName={brand.name} />
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCommOpen(true)}
                className="gap-1.5 border-[#d6a928]/50 font-bold"
              >
                <Send className="h-3.5 w-3.5 text-[#d6a928]" /> Direct Comm
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  const inv = buildBrandInvitation({
                    name: brand.name,
                    slug: brand.slug,
                    website: brand.website,
                  });
                  await navigator.clipboard?.writeText(inv);
                  toast.success(`Copied official team invitation for ${brand.name}`);
                }}
                className="gap-1.5 font-semibold"
              >
                <Copy className="h-3.5 w-3.5 text-[#d6a928]" /> Copy Invite
              </Button>
              <Button asChild size="sm" variant="outline" className="font-bold">
                <Link to="/brands/$slug" params={{ slug: brand.slug }}>
                  {t("dashboard.view")}
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="gap-1.5 font-semibold">
                <Link to="/messages">
                  <MessageSquare className="h-4 w-4" /> {t("nav.messages")}
                </Link>
              </Button>
              {!isVerified && (
                <Button
                  size="sm"
                  onClick={askVerify}
                  className="bg-[#d6a928] font-bold text-slate-950 hover:bg-[#e3b634]"
                >
                  {t("dashboard.requestVerification")}
                </Button>
              )}
            </div>

            <DirectBrandCommModal
              open={commOpen}
              onOpenChange={setCommOpen}
              brandName={brand.name}
              brandOwner={brand.ownerName || `${brand.name} Executive Team`}
              matchedBrand={brand}
            />
          </div>

          {/* Core Brand Metrics (Unlocked on Tier 1+) */}
          <div>
            <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-5">
              <Stat label={t("dashboard.trustScore")} value={`${trustScore}%`} accent />
              <Stat label={t("dashboard.posts")} value={`${stats?.posts ?? kpis?.posts ?? 678}`} />
              <Stat label={t("dashboard.stash")} value={`${stashCount}`} />
              <Stat label={t("dashboard.trash")} value={`${trashCount}`} />
              <Stat label={t("dashboard.followers")} value={`${followers ?? 1420}`} />
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
                <span className="text-[#b88914] tabular-nums">
                  {stashPct}% {t("dashboard.stash", { defaultValue: "Stash" })}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {100 - stashPct}% {t("dashboard.trash", { defaultValue: "Trash" })}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-[#d6a928] transition-all duration-500"
                  style={{ width: `${stashPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Phase A KPIs — 30-day CX signal for this brand */}
          {kpis && <BrandIntelligencePanel kpis={kpis} />}

          {/* 30-Day Breakdown Grid */}
          <div className="rounded-2xl border border-border bg-secondary/20 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              {brand.name} · {t("brandTeam.kpis")}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center sm:grid-cols-6">
              <Stat label={t("brandTeam.volume")} value={`${kpis?.posts ?? 678}`} />
              <Stat label={t("brandTeam.stashPct")} value={`${kpis?.stash_pct ?? stashPct}%`} accent />
              <Stat label={t("brandTeam.positive")} value={`${kpis?.positive ?? 540}`} />
              <Stat label={t("brandTeam.neutral")} value={`${kpis?.neutral ?? 73}`} />
              <Stat label={t("brandTeam.negative")} value={`${kpis?.negative ?? 65}`} />
              <Stat label={t("brandTeam.unanswered")} value={`${kpis?.unanswered ?? 2}`} />
            </div>
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              {t("brandTeam.responseTime")}: {formatReply(kpis?.median_response_minutes ?? 14, t)}
            </p>
          </div>

          {/* Phase B Recharts Trend & Top Voices Analytics for this Brand */}
          <BrandAnalytics brandId={brand.id} brandName={brand.name} />
        </div>
      </div>

      {/* TIER 2+ EXCLUSIVE: REGIONAL BRANCH & STORE PERFORMANCE FOR THIS BRAND */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-[#d6a928]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#b88914]">
                {brand.name} · Branch, Store &amp; Regional Performance Matrix
              </span>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[10px] font-black uppercase",
                  hasTier2
                    ? "bg-emerald-500/15 text-emerald-600"
                    : "bg-amber-500/15 text-amber-600",
                )}
              >
                {hasTier2 ? "✓ Tier 2+ Unlocked" : "🔒 Tier 2 Required"}
              </span>
            </div>
            <h3 className="mt-1 font-display text-xl font-black">
              Where {brand.name} Customers Are Voting Stash vs Trash
            </h3>
          </div>
          {!hasTier2 && (
            <Button
              size="sm"
              onClick={onUpgradeTier}
              className="bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935]"
            >
              Upgrade to Tier 2 (R4,950/mo)
            </Button>
          )}
        </div>

        {hasTier2 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 pr-3">{brand.name} Branch / Hub</th>
                  <th className="py-2.5 px-3">Region</th>
                  <th className="py-2.5 px-3 text-right">Stash Votes</th>
                  <th className="py-2.5 px-3 text-right">Trash Callouts</th>
                  <th className="py-2.5 px-3 text-right">Branch Trust</th>
                  <th className="py-2.5 pl-3">Live Customer Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {brandTelemetry.branches.map((br) => (
                  <tr key={br.branchName} className="hover:bg-secondary/30">
                    <td className="py-3 pr-3 font-bold text-foreground">{br.branchName}</td>
                    <td className="py-3 px-3 text-muted-foreground">{br.region}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 tabular-nums">
                      {br.stashCount}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 tabular-nums">
                      {br.trashCount}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-[#b88914] tabular-nums">
                      {br.trustPct}%
                    </td>
                    <td className="py-3 pl-3 text-muted-foreground">{br.topSignal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">
            Upgrade from Pulse Starter to <strong>Plan 02: Full-Cycle CX &amp; Launch Matrix</strong> to inspect branch-by-branch Stash/Trash velocity for {brand.name}.
          </p>
        )}
      </section>

      {/* TIER 3 EXCLUSIVE: COUNTERFEIT & GREY-MARKET BARCODE SCAN RADAR FOR THIS BRAND */}
      <section className="rounded-3xl border-2 border-[#d6a928]/50 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#d6a928]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#b88914]">
                {brand.name} · Counterfeit &amp; Grey-Market Barcode Scan Radar
              </span>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[10px] font-black uppercase",
                  hasTier3
                    ? "bg-emerald-500/15 text-emerald-600"
                    : "bg-amber-500/15 text-amber-600",
                )}
              >
                {hasTier3 ? "✓ Tier 3 Enterprise Active" : "🔒 Tier 3 Enterprise Required"}
              </span>
            </div>
            <h3 className="mt-1 font-display text-xl font-black">
              Live Batch Barcode Authenticity &amp; Leak Detection for {brand.name}
            </h3>
          </div>
          {!hasTier3 && (
            <Button
              size="sm"
              onClick={onUpgradeTier}
              className="bg-slate-950 font-black text-[#f5d061] hover:bg-slate-900"
            >
              Unlock Tier 3 Counterfeit Radar (R14,900/mo)
            </Button>
          )}
        </div>

        {hasTier3 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {brandTelemetry.counterfeitRadar.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-background p-4 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-black text-foreground">{alert.batchCode}</span>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-black",
                        alert.scanStatus === "Verified Authentic Batch"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-rose-500/15 text-rose-600",
                      )}
                    >
                      {alert.scanStatus}
                    </span>
                  </div>
                  <p className="mt-2 font-bold text-foreground">{alert.location}</p>
                  <p className="mt-1 text-muted-foreground">{alert.actionRecommended}</p>
                </div>
                <p className="mt-3 border-t border-border pt-2 font-mono text-[11px] font-bold text-[#b88914] tabular-nums">
                  {alert.scansCount} Consumer Scans Logged on /scan
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">
            Upgrade to <strong>Plan 03: Enterprise Intelligence &amp; Awards Suite</strong> to unlock batch-level barcode counterfeit detection and grey-market store alerts for {brand.name}.
          </p>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        accent
          ? "border-[#d6a928]/50 bg-[#d6a928]/10"
          : "border-border/60 bg-background",
      )}
    >
      <div
        className={cn(
          "font-display text-xl font-black tabular-nums",
          accent ? "text-[#b88914]" : "text-foreground",
        )}
      >
        {accent && <TrendingUp className="mr-1 inline h-4 w-4 text-[#d6a928]" />}
        {value}
      </div>
      <div className="mt-0.5 text-[11px] font-semibold text-muted-foreground">{label}</div>
    </div>
  );
}

function formatReply(minutes: number, t: (k: string, o?: any) => string): string {
  if (!minutes) return t("brandTeam.noResponseYet");
  if (minutes < 90) return t("brandTeam.minutes", { count: minutes });
  return t("brandTeam.hours", { count: Math.round(minutes / 60) });
}
