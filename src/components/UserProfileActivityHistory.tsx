import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Coins,
  Trash2,
  Building2,
  ShieldCheck,
  Clock,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Briefcase,
  Mail,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchUserVoteHistory, removeVote, type UserVoteHistoryItem } from "@/lib/stash";
import { fetchUserBrandClaims, requestVerification, type PendingVerification } from "@/lib/brands";
import { getRegisteredBrandIdentity } from "@/lib/brand-operators";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserProfileActivityHistoryProps {
  userId: string;
  userName?: string;
}

export function UserProfileActivityHistory({ userId, userName = "Member" }: UserProfileActivityHistoryProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"votes" | "claims">("votes");
  const [voteFilter, setVoteFilter] = useState<"all" | "stash" | "trash">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // New Brand Claim Dialog state
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [claimBrandName, setClaimBrandName] = useState("");
  const [claimWorkEmail, setClaimWorkEmail] = useState("");
  const [claimJobTitle, setClaimJobTitle] = useState("");
  const [claimMessage, setClaimMessage] = useState("");
  const [claimSubmitting, setClaimSubmitting] = useState(false);

  // 1. Query Vote History
  const {
    data: votes = [],
    isLoading: votesLoading,
    refetch: refetchVotes,
  } = useQuery({
    queryKey: ["user-vote-history", userId],
    queryFn: () => fetchUserVoteHistory(userId),
    enabled: !!userId,
  });

  // 2. Query Brand Claims
  const {
    data: claims = [],
    isLoading: claimsLoading,
    refetch: refetchClaims,
  } = useQuery({
    queryKey: ["user-brand-claims", userId],
    queryFn: () => fetchUserBrandClaims(userId),
    enabled: !!userId,
  });

  // Remove vote mutation
  const removeVoteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await removeVote(itemId, userId);
    },
    onSuccess: () => {
      toast.success("Vote removed successfully.");
      queryClient.invalidateQueries({ queryKey: ["user-vote-history", userId] });
      queryClient.invalidateQueries({ queryKey: ["my-stats", userId] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to remove vote.");
    },
  });

  // Submit Brand Claim handler
  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimBrandName.trim()) {
      toast.error("Please enter a brand name.");
      return;
    }
    if (!claimWorkEmail.trim() || !claimWorkEmail.includes("@")) {
      toast.error("Please provide your official company/work email.");
      return;
    }

    setClaimSubmitting(true);
    try {
      const fullMessage = [
        claimMessage.trim() || `Official brand representative claim by ${userName}.`,
        claimJobTitle ? `Role: ${claimJobTitle.trim()}` : "",
        `Work Email: ${claimWorkEmail.trim()}`,
      ]
        .filter(Boolean)
        .join(" | ");

      const brandSlug = claimBrandName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await requestVerification({
        brandId: brandSlug,
        userId,
        message: fullMessage,
      });

      toast.success(`Brand claim submitted for ${claimBrandName}! SOT verification team will review your credentials.`);
      setClaimDialogOpen(false);
      setClaimBrandName("");
      setClaimWorkEmail("");
      setClaimJobTitle("");
      setClaimMessage("");
      refetchClaims();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit brand claim.");
    } finally {
      setClaimSubmitting(false);
    }
  };

  // Filter votes
  const filteredVotes = votes.filter((v) => {
    if (voteFilter !== "all" && v.verdict !== voteFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = v.title.toLowerCase().includes(q);
      const matchBrand = v.brand.toLowerCase().includes(q);
      const matchCategory = v.category.toLowerCase().includes(q);
      return matchTitle || matchBrand || matchCategory;
    }
    return true;
  });

  const stashCount = votes.filter((v) => v.verdict === "stash").length;
  const trashCount = votes.filter((v) => v.verdict === "trash").length;

  const currentBrandIdentity = getRegisteredBrandIdentity();

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-7 dark:border-slate-800 dark:bg-slate-900">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-900 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-[#d6a928]" />
            <span>Member Activity & Credentials</span>
          </div>
          <h2 className="mt-1.5 font-display text-xl font-black text-slate-950 sm:text-2xl dark:text-white">
            Votes History & Brand Claims
          </h2>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
            Your recorded Stash & Trash verdicts and official corporate brand representative claims.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("votes")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer",
              activeTab === "votes"
                ? "bg-white text-slate-950 shadow-xs dark:bg-slate-950 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
            )}
          >
            <Coins className="h-3.5 w-3.5 text-[#d6a928]" />
            <span>Verdict History</span>
            <span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-black text-slate-800 dark:bg-slate-700 dark:text-slate-200">
              {votes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("claims")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer",
              activeTab === "claims"
                ? "bg-white text-slate-950 shadow-xs dark:bg-slate-950 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
            )}
          >
            <Building2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Brand Claims</span>
            <span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-black text-slate-800 dark:bg-slate-700 dark:text-slate-200">
              {claims.length}
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: STASH & TRASH VOTE HISTORY
         ========================================================================= */}
      {activeTab === "votes" && (
        <div className="mt-5 space-y-4">
          {/* Sub-Filters and Search Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant={voteFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setVoteFilter("all")}
                className={cn(
                  "h-8 text-xs font-bold",
                  voteFilter === "all" ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "",
                )}
              >
                All Verdicts ({votes.length})
              </Button>
              <Button
                variant={voteFilter === "stash" ? "default" : "outline"}
                size="sm"
                onClick={() => setVoteFilter("stash")}
                className={cn(
                  "h-8 gap-1 text-xs font-bold",
                  voteFilter === "stash"
                    ? "border-amber-400 bg-[#d6a928] text-slate-950 hover:bg-[#e4b832]"
                    : "border-amber-200 text-amber-900 hover:bg-amber-50 dark:border-amber-900/40 dark:text-amber-400 dark:hover:bg-amber-950/20",
                )}
              >
                <Coins className="h-3.5 w-3.5" />
                <span>Stashed ({stashCount})</span>
              </Button>
              <Button
                variant={voteFilter === "trash" ? "default" : "outline"}
                size="sm"
                onClick={() => setVoteFilter("trash")}
                className={cn(
                  "h-8 gap-1 text-xs font-bold",
                  voteFilter === "trash"
                    ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
                    : "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/20",
                )}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Trashed ({trashCount})</span>
              </Button>
            </div>

            {/* Search within votes */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand or post..."
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>

          {/* Votes Loading State */}
          {votesLoading ? (
            <div className="py-12 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#d6a928]" />
              <p className="mt-2 text-xs text-slate-500">Loading your vote history...</p>
            </div>
          ) : filteredVotes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/40">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-[#d6a928] dark:bg-amber-950/40">
                <Coins className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-display text-base font-bold text-slate-900 dark:text-white">
                {votes.length === 0
                  ? "No votes cast yet"
                  : `No ${voteFilter !== "all" ? voteFilter : ""} votes match "${searchQuery}"`}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {votes.length === 0
                  ? "Explore the Live Feed or scan any product barcode to cast your first Stash or Trash verdict!"
                  : "Try clearing your search query or switching filters above."}
              </p>
              {votes.length === 0 && (
                <div className="mt-4 flex justify-center gap-2">
                  <Button asChild size="sm" className="bg-[#d6a928] font-bold text-slate-950 hover:bg-[#e4b832]">
                    <Link to="/feed">
                      Go to Live Feed <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/scan">Scan Barcode</Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredVotes.map((v) => {
                const isStash = v.verdict === "stash";
                return (
                  <div
                    key={v.itemId}
                    className={cn(
                      "flex flex-col justify-between rounded-2xl border p-4 transition-all hover:shadow-xs",
                      isStash
                        ? "border-amber-300/80 bg-gradient-to-br from-amber-50/40 via-white to-white dark:border-amber-800/40 dark:from-amber-950/10 dark:via-slate-900 dark:to-slate-900"
                        : "border-red-200/80 bg-gradient-to-br from-red-50/40 via-white to-white dark:border-red-900/40 dark:from-red-950/10 dark:via-slate-900 dark:to-slate-900",
                    )}
                  >
                    <div>
                      {/* Verdict Badge & Category */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black uppercase tracking-wider",
                            isStash
                              ? "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300"
                              : "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-300",
                          )}
                        >
                          {isStash ? (
                            <>
                              <Coins className="h-3 w-3 text-[#d6a928]" /> Stashed
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-3 w-3 text-red-600" /> Trashed
                            </>
                          )}
                        </span>

                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {new Date(v.votedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Brand & Item Title */}
                      <div className="mt-3">
                        <span className="text-xs font-extrabold uppercase tracking-wide text-[#d6a928]">
                          {v.brand}
                        </span>
                        <h4 className="font-display text-base font-bold text-slate-950 line-clamp-1 dark:text-white">
                          {v.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-600 line-clamp-2 dark:text-slate-300">
                          {v.description}
                        </p>
                      </div>

                      {/* Community Ratio Bar */}
                      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-bold text-amber-800 dark:text-amber-400">
                          <ThumbsUp className="h-3 w-3" /> {v.upvotesCount}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-red-700 dark:text-red-400">
                          <ThumbsDown className="h-3 w-3" /> {v.downvotesCount}
                        </span>
                        <span className="text-[11px] text-slate-400">· {v.category}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                      <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Link to="/items/$id" params={{ id: v.itemId }}>
                          View Verdict Details <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeVoteMutation.mutate(v.itemId)}
                        disabled={removeVoteMutation.isPending}
                        className="h-7 px-2 text-xs text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                        title="Clear this vote"
                      >
                        Remove Vote
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: BRAND REPRESENTATIVE CLAIMS & CUSTODY
         ========================================================================= */}
      {activeTab === "claims" && (
        <div className="mt-5 space-y-4">
          {/* Top Banner & Submit New Claim Action */}
          <div className="flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-blue-900/40 dark:bg-blue-950/20">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  Corporate Brand Custody & Verification
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Are you a brand manager, PR spokesperson, or CX executive? Claim your brand to access official telemetry, respond to customer verdicts, and broadcast live.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setClaimDialogOpen(true)}
              className="shrink-0 gap-1.5 bg-blue-600 font-bold text-white hover:bg-blue-700 dark:bg-blue-600"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Claim a Brand</span>
            </Button>
          </div>

          {/* Active Claimed Brand Quick View */}
          {currentBrandIdentity && currentBrandIdentity.name && (
            <div className="rounded-2xl border-2 border-[#d6a928]/60 bg-gradient-to-r from-amber-50/50 via-white to-amber-50/30 p-4 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 font-display text-lg font-black text-[#d6a928]">
                    {currentBrandIdentity.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-base font-black text-slate-950 dark:text-white">
                        {currentBrandIdentity.name}
                      </h4>
                      <Badge className="gap-1 bg-emerald-600 text-[10px] text-white">
                        <CheckCircle2 className="h-3 w-3" /> Active Brand Custody
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Category: <strong>{currentBrandIdentity.category || "Consumer Goods"}</strong> · Trust Score:{" "}
                      <strong>{currentBrandIdentity.trust_score ?? 85} / 100</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild size="sm" className="bg-slate-950 font-bold text-[#d6a928] hover:bg-slate-900">
                    <Link to="/_authenticated/dashboard">
                      Open Brand Suite Dashboard <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Claims List */}
          {claimsLoading ? (
            <div className="py-10 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />
              <p className="mt-2 text-xs text-slate-500">Checking your brand verification claims...</p>
            </div>
          ) : claims.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/40">
              <Building2 className="mx-auto h-8 w-8 text-slate-400" />
              <h4 className="mt-2 font-display text-base font-bold text-slate-900 dark:text-white">
                No Brand Claims on File
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                You haven&apos;t submitted any brand representative verification requests yet.
              </p>
              <Button
                size="sm"
                onClick={() => setClaimDialogOpen(true)}
                className="mt-4 gap-1.5 bg-blue-600 font-bold text-white hover:bg-blue-700"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Submit First Brand Claim
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {claims.map((claim) => {
                const isApproved = claim.status === "approved" || claim.status === "verified";
                const isPending = claim.status === "pending";

                return (
                  <div
                    key={claim.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display font-black",
                          isApproved
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : isPending
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                              : "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
                        )}
                      >
                        {claim.brandName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-display text-base font-bold text-slate-950 dark:text-white">
                            {claim.brandName}
                          </h4>
                          {isApproved ? (
                            <Badge className="gap-1 bg-emerald-600 text-[10px] text-white">
                              <CheckCircle2 className="h-3 w-3" /> Verified Representative
                            </Badge>
                          ) : isPending ? (
                            <Badge variant="outline" className="gap-1 border-amber-400 bg-amber-50 text-[10px] text-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                              <Clock className="h-3 w-3 text-amber-600" /> Pending Review
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1 text-[10px]">
                              <AlertCircle className="h-3 w-3" /> Declined / Appeal
                            </Badge>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                          {claim.message || "Official brand representative claim submitted for administrative review."}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Submitted on {new Date(claim.created_at).toLocaleDateString()} · ID: {claim.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button asChild size="sm" variant="outline" className="text-xs">
                        <Link to="/brands/$slug" params={{ slug: claim.brandSlug || claim.brand_id }}>
                          View Brand Page <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                      {isApproved && (
                        <Button asChild size="sm" className="bg-slate-950 font-bold text-[#d6a928] hover:bg-slate-900">
                          <Link to="/_authenticated/dashboard">
                            Brand Suite
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          NEW BRAND CLAIM DIALOG MODAL
         ========================================================================= */}
      <Dialog open={claimDialogOpen} onOpenChange={setClaimDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Claim Brand Representative Credentials
            </DialogTitle>
            <DialogDescription className="text-xs">
              Submit your corporate credentials to claim official custody of your company&apos;s brand page on SOT.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleClaimSubmit} className="space-y-3.5 pt-2">
            <div>
              <Label className="text-xs font-bold">Brand or Company Name *</Label>
              <Input
                value={claimBrandName}
                onChange={(e) => setClaimBrandName(e.target.value)}
                placeholder="e.g. Woolworths, Takealot, Discovery"
                required
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold">Official Corporate / Work Email *</Label>
              <Input
                type="email"
                value={claimWorkEmail}
                onChange={(e) => setClaimWorkEmail(e.target.value)}
                placeholder="e.g. name@company.co.za or name@brand.com"
                required
                className="mt-1 text-xs"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Must match the official domain of the brand you are claiming.
              </p>
            </div>

            <div>
              <Label className="text-xs font-bold">Your Job Title / Corporate Role</Label>
              <Input
                value={claimJobTitle}
                onChange={(e) => setClaimJobTitle(e.target.value)}
                placeholder="e.g. Head of Customer Experience, Brand PR Lead"
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold">Verification Note / Official Web Profile</Label>
              <Textarea
                value={claimMessage}
                onChange={(e) => setClaimMessage(e.target.value)}
                placeholder="Include a link to your official company bio, LinkedIn profile, or contact details for expedited approval."
                className="mt-1 text-xs"
                rows={3}
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setClaimDialogOpen(false)}
                disabled={claimSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={claimSubmitting}
                className="gap-1.5 bg-blue-600 font-bold text-white hover:bg-blue-700"
              >
                {claimSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" /> Submit Claim
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
