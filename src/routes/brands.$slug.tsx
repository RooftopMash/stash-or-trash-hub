import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Header } from "@/components/Header";
import { SubmitDialog } from "@/components/SubmitDialog";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandVerdict } from "@/components/BrandVerdict";
import { ItemCard } from "@/components/ItemCard";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchBrandBySlug,
  fetchMyVerificationRequest,
  requestVerification,
} from "@/lib/brands";
import { fetchFeed } from "@/lib/stash";
import {
  followBrand,
  unfollowBrand,
  isFollowingBrand,
  getFollowerCount,
} from "@/lib/social";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  BadgeCheck,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  QrCode,
  Gift,
  Award,
  Sparkles,
  Ticket,
  Camera,
  Coins,
  CheckCircle,
  Copy,
  ChevronRight,
  Info,
  BarChart3,
  ThumbsUp,
  TrendingDown
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/brands/$slug")({
  component: BrandPage,
});

// Helper to determine People's SOT Rating Grade
function getPeoplesSotGrade(score: number) {
  if (score >= 85) {
    return {
      grade: "AAA",
      color: "bg-emerald-500 text-white",
      border: "border-emerald-500/20",
      textColor: "text-emerald-500",
      description: "Prime Trust Grade. Excellent community sentiment, extremely low dissatisfaction.",
    };
  } else if (score >= 70) {
    return {
      grade: "AA",
      color: "bg-teal-500 text-white",
      border: "border-teal-500/20",
      textColor: "text-teal-500",
      description: "High Quality Grade. Strong customer loyalty and stable PR reputation.",
    };
  } else if (score >= 50) {
    return {
      grade: "A",
      color: "bg-amber-500 text-black",
      border: "border-amber-500/20",
      textColor: "text-amber-600",
      description: "Satisfactory Grade. Balanced customer reviews, average market response.",
    };
  } else if (score >= 35) {
    return {
      grade: "BBB",
      color: "bg-orange-500 text-white",
      border: "border-orange-500/20",
      textColor: "text-orange-500",
      description: "Vulnerable Grade. High customer service friction and visible negative sentiment.",
    };
  } else {
    return {
      grade: "D (Trash)",
      color: "bg-red-500 text-white",
      border: "border-red-500/20",
      textColor: "text-red-500",
      description: "Substantial Risk. Severe dissatisfaction, action urgently required to restore goodwill.",
    };
  }
}

// Simulated Digital Billboard Mock QR codes
const BILLBOARDS = [
  {
    id: "bb-1",
    title: "Metro Plaza Digital Billboard — 35% Off Loyalty Pass",
    brandSlug: "adidas",
    type: "Discount Reward",
    qrContent: "SOT_BB_ADIDAS_35_LOYALTY",
    couponCode: "STASH_35_METRO",
    perk: "Unlocks a 35% discount coupon on online e-commerce checkout + 50 SOT Social Points.",
    targetUrl: "https://adidas.com",
  },
  {
    id: "bb-2",
    title: "Times Square Interactive CX Board — Free Premium Gift Card",
    brandSlug: "starbucks",
    type: "Freebie Reward",
    qrContent: "SOT_BB_SBUX_GIFT_10",
    couponCode: "TRASH_RECOVERY_10",
    perk: "Unlocks a $10 recovery e-gift card for customers who rate Starbucks on SOT + 100 SOT Social Points.",
    targetUrl: "https://starbucks.com",
  },
  {
    id: "bb-3",
    title: "Smart Transit Digital Banner — Priority Support Ticket",
    brandSlug: "apple",
    type: "VIP Service",
    qrContent: "SOT_BB_APPLE_VIP_ACCESS",
    couponCode: "APPLE_SOT_VIP",
    perk: "Unlocks priority verified CX queue, enabling direct channel to brand PR managers.",
    targetUrl: "https://apple.com",
  },
];

function BrandPage() {
  const { slug } = Route.useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active Hub Tab: "feed" | "rewards" | "people"
  const [activeTab, setActiveTab] = useState<"feed" | "rewards" | "people">("feed");

  // QR Simulator States
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedBillboard, setScannedBillboard] = useState<any | null>(null);

  // Claimed Coupon States
  const [claimedCoupons, setClaimedCoupons] = useState<Record<string, boolean>>({});

  const { data: brand, isLoading } = useQuery({
    queryKey: ["brand", slug],
    queryFn: () => fetchBrandBySlug(slug),
  });

  const { data: feed, refetch } = useQuery({
    queryKey: ["brand-feed", brand?.id, user?.id ?? "anon"],
    queryFn: () => fetchFeed(user?.id ?? null, { brandId: brand!.id }),
    enabled: !!brand,
  });

  const isOwner = !!user && brand?.owner_id === user.id;

  const { data: brandFollowers, refetch: refetchBrandFollowers } = useQuery({
    queryKey: ["brand-followers", brand?.id],
    queryFn: () => getFollowerCount({ brandId: brand!.id }),
    enabled: !!brand,
  });

  const { data: isFollowing, refetch: refetchIsFollowing } = useQuery({
    queryKey: ["brand-following", user?.id, brand?.id],
    queryFn: () => (user?.id && brand ? isFollowingBrand(user.id, brand.id) : false),
    enabled: !!user && !!brand,
  });

  const toggleBrandFollow = async () => {
    if (!user || !brand) {
      toast.info(t("social.signInToFollow"));
      return;
    }
    try {
      if (isFollowing) await unfollowBrand(user.id, brand.id);
      else await followBrand(user.id, brand.id);
      await Promise.all([refetchBrandFollowers(), refetchIsFollowing()]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("social.loadFailed"));
    }
  };

  const { data: verReq, refetch: refetchVer } = useQuery({
    queryKey: ["brand-verify", brand?.id, user?.id],
    queryFn: () => fetchMyVerificationRequest(brand!.id),
    enabled: !!brand && !!user,
  });

  const askVerify = async (claim = false) => {
    if (!brand || !user) return;
    try {
      await requestVerification({
        brandId: brand.id,
        userId: user.id,
        message: claim ? `I represent ${brand.name} and would like to claim this SOT brand page.` : "",
      });
      toast.success(claim ? "Brand claim requested." : "Verification requested.");
      refetchVer();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not request verification.");
    }
  };

  const handleScanSimulation = (billboard: any) => {
    setScanning(true);
    setScannedBillboard(null);
    toast.loading("Simulating high-resolution digital billboard QR capture...");

    setTimeout(() => {
      setScanning(false);
      setScannedBillboard(billboard);
      toast.dismiss();
      toast.success("Successfully decoded digital billboard campaign!");
    }, 2000);
  };

  const claimCoupon = (couponCode: string) => {
    setClaimedCoupons((prev) => ({ ...prev, [couponCode]: true }));
    navigator.clipboard?.writeText(couponCode);
    toast.success(`Coupon ${couponCode} copied to clipboard and social rewards claimed!`);
  };

  // Mock CX/UX Matrix Rating for the People's standard of brands
  const mockCXMetrics = {
    customerService: brand ? Math.min(100, Math.max(10, brand.trust_score + 5)) : 75,
    productQuality: brand ? Math.min(100, Math.max(10, brand.trust_score - 2)) : 80,
    priceValue: brand ? Math.min(100, Math.max(10, brand.trust_score - 10)) : 65,
    deliverySpeed: brand ? Math.min(100, Math.max(10, brand.trust_score + 8)) : 85,
  };

  return (
    <div className="min-h-screen pb-16">
      <Header onPosted={() => refetch()} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-2xl" />
        ) : !brand ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            Brand not found. <Link to="/brands" className="text-primary hover:underline">Back to brands</Link>
          </div>
        ) : (
          <>
            {/* Brand Core Header Card */}
            <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row shadow-sm">
              <BrandLogo
                name={brand.name}
                url={brand.signedLogoUrl}
                className="h-20 w-20 rounded-2xl border border-border text-2xl"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-extrabold">{brand.name}</h1>
                  {brand.verified && <BadgeCheck className="h-5 w-5 text-primary" />}

                  {/* SOT People's Rating Badge */}
                  <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${getPeoplesSotGrade(brand.trust_score).color} ${getPeoplesSotGrade(brand.trust_score).border}`}>
                    <Award className="h-3 w-3" />
                    People's SOT: {getPeoplesSotGrade(brand.trust_score).grade}
                  </div>
                </div>
                {brand.category && <p className="text-sm text-muted-foreground mt-0.5">{brand.category}</p>}
                {brand.description && <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{brand.description}</p>}

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-stash" />
                    <span className="font-semibold">{brand.trust_score}</span>
                    <span className="text-muted-foreground">/ 100 {t("brand.trustScore").toLowerCase()}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    {t("social.followers", { count: brandFollowers ?? 0 })}
                  </span>
                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> {t("brand.website")}
                    </a>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {user && !isOwner && brand.verified && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => navigate({ to: "/messages", search: { to: brand.owner_id } })}
                    >
                      <MessageCircle className="h-4 w-4" /> {t("brand.message")}
                    </Button>
                  )}
                  {user && !isOwner && !brand.verified && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={verReq?.status === "pending"}
                      onClick={() => askVerify(true)}
                    >
                      {verReq?.status === "pending" ? "Claim pending" : "Claim this brand"}
                    </Button>
                  )}
                  {isOwner && !brand.verified && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={verReq?.status === "pending"}
                      onClick={() => askVerify(false)}
                    >
                      {verReq?.status === "pending"
                        ? t("brand.verificationPending")
                        : t("brand.requestVerification")}
                    </Button>
                  )}
                  {user && <SubmitDialog defaultBrandId={brand.id} onPosted={() => refetch()} />}
                  {user && !isOwner && (
                    <Button
                      size="sm"
                      variant={isFollowing ? "outline" : "default"}
                      onClick={toggleBrandFollow}
                    >
                      {isFollowing ? t("social.unfollow") : t("social.follow")}
                    </Button>
                  )}
                </div>
              </div>
            </section>

            {/* SUPER APP SPECIAL FEATURES INTERFACE (Interactive Social Hub Tabs) */}
            <section className="mt-6 rounded-2xl border border-border bg-card p-1 shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 bg-secondary/40 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("feed")}
                  className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === "feed" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Feed ({feed?.length ?? 0})
                </button>
                <button
                  onClick={() => setActiveTab("rewards")}
                  className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === "rewards" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Gift className="h-3.5 w-3.5 text-amber-500 animate-pulse" /> Super Rewards
                </button>
                <button
                  onClick={() => setActiveTab("people")}
                  className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === "people" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5 text-blue-500" /> SOT Standard Grade
                </button>
              </div>

              {/* TAB 1: SOCIAL FEED */}
              {activeTab === "feed" && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wider">Social Feed</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setQrModalOpen(true)}
                      className="gap-1 text-primary hover:text-primary/80 font-bold"
                    >
                      <QrCode className="h-3.5 w-3.5" /> Scan Billboard QR
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {(feed ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">No social ratings yet. Be the first to Stash or Trash!</p>
                    ) : (
                      (feed ?? []).map((item) => (
                        <ItemCard key={item.id} item={item} onChange={() => refetch()} />
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: SUPER REWARDS HUB */}
              {activeTab === "rewards" && (
                <div className="p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div>
                      <h3 className="font-display font-extrabold text-lg flex items-center gap-1.5">
                        <Gift className="h-5 w-5 text-amber-500" /> CX & Loyalty Reward Campaigns
                      </h3>
                      <p className="text-xs text-muted-foreground">Exclusive rewards directed to verified clients and active raters.</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setQrModalOpen(true)}
                      className="gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold"
                    >
                      <QrCode className="h-4 w-4" /> Scan Digital Billboard
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 mt-2">
                    {/* Campaign Card 1 */}
                    <div className="rounded-xl border border-border bg-secondary/20 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-500 uppercase tracking-wide">
                            Loyalty Campaign
                          </span>
                          <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-500">
                            <Coins className="h-3 w-3" /> 50 Pts
                          </span>
                        </div>
                        <h4 className="mt-2 font-display font-bold text-base text-foreground">Verified Stashers Discount</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          For active raters who voted "Stash" on {brand.name}. Shows that loyalty deserves real rewards.
                        </p>
                      </div>
                      <div className="mt-4 border-t border-border/50 pt-3 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold bg-secondary px-2 py-1 rounded select-all">
                          SOT_LOYAL_{brand.name.toUpperCase().slice(0, 4)}_20
                        </span>
                        <Button
                          size="sm"
                          onClick={() => claimCoupon(`SOT_LOYAL_${brand.name.toUpperCase().slice(0, 4)}_20`)}
                          className="gap-1"
                        >
                          {claimedCoupons[`SOT_LOYAL_${brand.name.toUpperCase().slice(0, 4)}_20`] ? (
                            <>
                              <CheckCircle className="h-3 w-3" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" /> Claim
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Campaign Card 2 */}
                    <div className="rounded-xl border border-border bg-secondary/20 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-extrabold text-violet-500 uppercase tracking-wide">
                            CX Recovery Program
                          </span>
                          <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-500">
                            <Coins className="h-3 w-3" /> 100 Pts
                          </span>
                        </div>
                        <h4 className="mt-2 font-display font-bold text-base text-foreground">Brand Recovery Voucher</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          A customer care signal to rebuild relationships. Available for clients who shared constructive feedback.
                        </p>
                      </div>
                      <div className="mt-4 border-t border-border/50 pt-3 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold bg-secondary px-2 py-1 rounded select-all">
                          SOT_CARE_${brand.name.toUpperCase().slice(0, 4)}_10
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => claimCoupon(`SOT_CARE_${brand.name.toUpperCase().slice(0, 4)}_10`)}
                          className="gap-1 border-primary text-primary hover:bg-primary/10"
                        >
                          {claimedCoupons[`SOT_CARE_${brand.name.toUpperCase().slice(0, 4)}_10`] ? (
                            <>
                              <CheckCircle className="h-3 w-3" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" /> Claim
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-violet-500/5 border border-violet-500/10 p-4 text-xs flex gap-2">
                    <Info className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-violet-600">The Power of Direct Feedback:</p>
                      <p className="text-muted-foreground mt-0.5">
                        By rating brands on Stash or Trash, you assist brands with actionable UX/CX data. In turn, brands direct digital rewards and gifts back to the community, establishing the ultimate credible feedback loop.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PEOPLE'S SOT GRADE INTELLIGENCE */}
              {activeTab === "people" && (
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-display font-extrabold text-lg flex items-center gap-1.5 text-foreground">
                      <BarChart3 className="h-5 w-5 text-blue-500" /> SOT Standard Grade Analysis
                    </h3>
                    <p className="text-xs text-muted-foreground">The People's Standard of consumer ratings, scaling credibility via decentralized rater feedback.</p>
                  </div>

                  {/* Rating Grade Callout */}
                  <div className="rounded-xl border border-border bg-secondary/10 p-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center font-display text-2xl font-black shadow-inner shrink-0 ${getPeoplesSotGrade(brand.trust_score).color}`}>
                      {getPeoplesSotGrade(brand.trust_score).grade}
                    </div>
                    <div className="text-center sm:text-left">
                      <h4 className="font-display font-bold text-base">Current Brand Sovereign Grade: {getPeoplesSotGrade(brand.trust_score).grade}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{getPeoplesSotGrade(brand.trust_score).description}</p>
                    </div>
                  </div>

                  {/* CX/UX Matrix Metrics */}
                  <div className="space-y-3">
                    <h4 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide">Consumer Experience Rating Matrix</h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="p-3 rounded-xl bg-secondary/30 border border-border/40">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Customer Service & Support</span>
                          <span className="text-emerald-500">{mockCXMetrics.customerService}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${mockCXMetrics.customerService}%` }} />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-secondary/30 border border-border/40">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Product Quality & Durability</span>
                          <span className="text-emerald-500">{mockCXMetrics.productQuality}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${mockCXMetrics.productQuality}%` }} />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-secondary/30 border border-border/40">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Pricing & Value For Money</span>
                          <span className="text-amber-500">{mockCXMetrics.priceValue}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${mockCXMetrics.priceValue}%` }} />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-secondary/30 border border-border/40">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Delivery, Supply & Speed</span>
                          <span className="text-emerald-500">{mockCXMetrics.deliverySpeed}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${mockCXMetrics.deliverySpeed}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/60 pt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5 text-stash" /> Real-time active voting</span>
                    <span>Total rating weight: {feed?.length ?? 0} social signals</span>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* INTERACTIVE DIGITAL BILLBOARD QR SCANNER DIALOG */}
      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="sm:max-w-md bg-card rounded-2xl border border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-xl flex items-center gap-2">
              <QrCode className="h-5 w-5 text-indigo-500" /> Digital Billboard QR Scanner
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Direct clients from physical billboards & print ads to brand online e-commerce platforms and redeemable Stash or Trash client rewards. Select a simulated billboard below to scan:
            </p>

            {/* Simulated Live Camera view box */}
            <div className="relative aspect-video rounded-xl bg-black border-2 border-indigo-500/20 flex flex-col items-center justify-center overflow-hidden">
              {scanning ? (
                <>
                  {/* Dynamic laser scan lines */}
                  <div className="absolute inset-x-0 h-0.5 bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-bounce top-0" />
                  <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />
                  <Camera className="h-8 w-8 text-indigo-400 animate-spin" />
                  <span className="mt-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Capturing Digital Billboard QR...</span>
                </>
              ) : scannedBillboard ? (
                <div className="p-4 text-center z-10 space-y-2">
                  <Sparkles className="h-10 w-10 text-amber-500 mx-auto animate-bounce" />
                  <h4 className="font-display font-extrabold text-sm text-white">Billboard Decoded Successfully!</h4>
                  <p className="text-xs text-zinc-400 max-w-xs">{scannedBillboard.title}</p>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="relative h-20 w-20 mx-auto border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center">
                    <QrCode className="h-10 w-10 text-zinc-600" />
                    {/* Corner decorators */}
                    <div className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-indigo-500" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-indigo-500" />
                    <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-indigo-500" />
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-indigo-500" />
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 mt-2">Ready. Align digital billboard QR within focus.</p>
                </div>
              )}
            </div>

            {/* Decoded Campaign Ticket */}
            {scannedBillboard && (
              <div className="rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 p-4 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 flex items-center gap-1">
                    <Ticket className="h-3.5 w-3.5" /> {scannedBillboard.type}
                  </span>
                  <span className="text-xs font-mono font-bold bg-zinc-800 px-1.5 py-0.5 rounded text-white select-all">
                    {scannedBillboard.couponCode}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-foreground">{scannedBillboard.title}</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">{scannedBillboard.perk}</p>

                <div className="pt-2 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 font-bold gap-1 bg-amber-500 hover:bg-amber-600 text-black"
                    onClick={() => claimCoupon(scannedBillboard.couponCode)}
                  >
                    <Copy className="h-3.5 w-3.5" /> Claim Reward
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 font-bold"
                    asChild
                  >
                    <a href={scannedBillboard.targetUrl} target="_blank" rel="noopener noreferrer">
                      Go to Store <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {/* List of Mock Billboards */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <label className="text-xs font-bold text-muted-foreground">Select a Billboard Advertisement to Mock-Scan:</label>
              {BILLBOARDS.map((bb) => (
                <button
                  key={bb.id}
                  disabled={scanning}
                  onClick={() => handleScanSimulation(bb)}
                  className="w-full flex items-center justify-between p-2 text-left rounded-xl border border-border hover:bg-secondary/40 transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-xs font-semibold truncate">{bb.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{bb.type} · {bb.perk}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>

            <div className="border-t border-border pt-3 flex justify-end">
              <Button size="sm" variant="ghost" onClick={() => setQrModalOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
