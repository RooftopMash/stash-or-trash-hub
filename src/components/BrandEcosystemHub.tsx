import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Handshake,
  Lightbulb,
  MapPin,
  Plus,
  Rocket,
  ScanBarcode,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import type { Brand } from "@/lib/brands";
import {
  fetchEcosystemItems,
  hasRsvpedEcosystemItem,
  hasUpvotedEcosystemItem,
  publishEcosystemItem,
  submitCollabOrEventResponse,
  toggleUpvoteEcosystemItem,
  type EcosystemItemType,
  type FirestoreEcosystemItem,
} from "@/lib/brand-ecosystem";
import { cn } from "@/lib/utils";

export type EcosystemHubTab = "releases" | "innovations" | "events_collabs" | "authenticity";

interface BrandEcosystemHubProps {
  brand?: Brand;
  brandsList?: Brand[];
  initialTab?: EcosystemHubTab;
  showTabs?: boolean;
  compact?: boolean;
}

export function BrandEcosystemHub({
  brand,
  brandsList = [],
  initialTab = "releases",
  showTabs = true,
  compact = false,
}: BrandEcosystemHubProps) {
  const { user } = useAuth();
  const { persona } = useRoles();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<EcosystemHubTab>(initialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [, setTick] = useState(0);

  // Publish modal state (Release / Innovation Presentation / C2B Innovation Submission / Event / Collab)
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishType, setPublishType] = useState<EcosystemItemType>("release");
  const [selectedBrandSlug, setSelectedBrandSlug] = useState(brand?.slug || brandsList[0]?.slug || "nandos");
  const [titleInput, setTitleInput] = useState("");
  const [summaryInput, setSummaryInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Product & Experience");
  const [statusInput, setStatusInput] = useState("Live / Open");
  const [dateInput, setDateInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [compensationInput, setCompensationInput] = useState("");
  const [externalUrlInput, setExternalUrlInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Collab application modal state
  const [applyTarget, setApplyTarget] = useState<FirestoreEcosystemItem | null>(null);
  const [pitchInput, setPitchInput] = useState("");
  const [portfolioInput, setPortfolioInput] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const onSync = () => setTick((n) => n + 1);
    window.addEventListener("sot-ecosystem-updated", onSync);
    return () => window.removeEventListener("sot-ecosystem-updated", onSync);
  }, []);

  const { data: items = [], refetch } = useQuery({
    queryKey: ["brand-ecosystem", brand?.slug ?? "global"],
    queryFn: () => fetchEcosystemItems(brand ? { brandSlug: brand.slug } : undefined),
  });

  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      if (activeTab === "releases" && item.itemType !== "release") return false;
      if (
        activeTab === "innovations" &&
        item.itemType !== "innovation_presentation" &&
        item.itemType !== "innovation_submission"
      ) {
        return false;
      }
      if (activeTab === "events_collabs" && item.itemType !== "event" && item.itemType !== "collab") {
        return false;
      }
      if (!q) return true;
      return `${item.title} ${item.summary} ${item.brandName} ${item.category} ${item.authorName}`
        .toLowerCase()
        .includes(q);
    });
  }, [items, activeTab, searchTerm]);

  const counts = useMemo(
    () => ({
      releases: items.filter((i) => i.itemType === "release").length,
      innovations: items.filter(
        (i) => i.itemType === "innovation_presentation" || i.itemType === "innovation_submission",
      ).length,
      eventsCollabs: items.filter((i) => i.itemType === "event" || i.itemType === "collab").length,
    }),
    [items],
  );

  const openPublishModal = (type: EcosystemItemType) => {
    if (!user) {
      toast.info("Sign in to publish releases, submit C2B innovations, or host brand collaborations.");
      navigate({ to: "/auth" });
      return;
    }
    setPublishType(type);
    setSelectedBrandSlug(brand?.slug || brandsList[0]?.slug || "nandos");
    setTitleInput("");
    setSummaryInput("");
    setStatusInput(
      type === "release"
        ? "Available Now"
        : type === "innovation_submission"
          ? "Open C2B Proposal"
          : type === "event"
            ? "Registration Open"
            : type === "collab"
              ? "Accepting Proposals"
              : "Live Presentation",
    );
    setDateInput("");
    setLocationInput("");
    setCompensationInput("");
    setExternalUrlInput("");
    setPublishOpen(true);
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!titleInput.trim() || !summaryInput.trim()) {
      toast.error("Please provide both a title and clear details.");
      return;
    }
    setSubmitting(true);
    try {
      const targetBrand =
        brand ?? brandsList.find((b) => b.slug === selectedBrandSlug) ?? null;

      await publishEcosystemItem({
        brandId: targetBrand?.id || `brand-${selectedBrandSlug}`,
        brandSlug: targetBrand?.slug || selectedBrandSlug,
        brandName: targetBrand?.name || selectedBrandSlug.replace(/-/g, " "),
        itemType: publishType,
        title: titleInput,
        summary: summaryInput,
        category: categoryInput,
        status: statusInput,
        eventDate: dateInput,
        location: locationInput,
        compensation: compensationInput,
        externalUrl: externalUrlInput,
        authorUid: user.id,
        authorName: user.displayName || user.email?.split("@")[0] || "SOT Member",
      });
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ["brand-ecosystem"] });
      setPublishOpen(false);
      toast.success("Published to the SOT Brand Ecosystem!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (item: FirestoreEcosystemItem) => {
    const added = await toggleUpvoteEcosystemItem(item);
    await refetch();
    toast.success(added ? `Endorsed "${item.title}"` : "Endorsement removed");
  };

  const handleRsvp = async (item: FirestoreEcosystemItem) => {
    if (!user) {
      toast.info("Sign in to RSVP so the brand can send event access updates.");
      navigate({ to: "/auth" });
      return;
    }
    if (hasRsvpedEcosystemItem(item.id)) {
      toast.info(`You're already registered for "${item.title}".`);
      return;
    }
    try {
      await submitCollabOrEventResponse({
        item,
        applicantUid: user.id,
        applicantName: user.displayName || user.email?.split("@")[0] || "SOT Member",
        applicantEmail: user.email || undefined,
        kind: "rsvp",
      });
      await refetch();
      toast.success(`RSVP confirmed for ${item.brandName} — ${item.title}!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not record RSVP.");
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !applyTarget) return;
    if (!pitchInput.trim()) {
      toast.error("Please enter a short collaboration proposal.");
      return;
    }
    setApplying(true);
    try {
      await submitCollabOrEventResponse({
        item: applyTarget,
        applicantUid: user.id,
        applicantName: user.displayName || user.email?.split("@")[0] || "SOT Collaborator",
        applicantEmail: user.email || undefined,
        kind: "collab_application",
        pitch: pitchInput,
        portfolioUrl: portfolioInput,
      });
      setApplyTarget(null);
      setPitchInput("");
      setPortfolioInput("");
      toast.success(`Collaboration proposal sent to ${applyTarget.brandName}!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit application.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Controls */}
      {showTabs && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
          <div className="flex flex-wrap gap-1.5 rounded-xl bg-secondary/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("releases")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer",
                activeTab === "releases"
                  ? "bg-slate-950 text-[#f5d061] shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Rocket className="h-3.5 w-3.5" />
              New Releases ({counts.releases})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("innovations")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer",
                activeTab === "innovations"
                  ? "bg-slate-950 text-[#f5d061] shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              Innovations &amp; Pitches ({counts.innovations})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("events_collabs")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer",
                activeTab === "events_collabs"
                  ? "bg-slate-950 text-[#f5d061] shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Handshake className="h-3.5 w-3.5" />
              Events &amp; B2C/C2B Collabs ({counts.eventsCollabs})
            </button>
            {!brand && (
              <button
                type="button"
                onClick={() => setActiveTab("authenticity")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer",
                  activeTab === "authenticity"
                    ? "bg-slate-950 text-[#f5d061] shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Authenticity &amp; Origin
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeTab === "releases" && (
              <Button
                size="sm"
                onClick={() => openPublishModal("release")}
                className="gap-1.5 bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935] whitespace-nowrap shrink-0"
              >
                <Plus className="h-3.5 w-3.5" /> Publish New Release
              </Button>
            )}
            {activeTab === "innovations" && (
              <>
                <Button
                  size="sm"
                  onClick={() =>
                    openPublishModal(
                      persona === "brand_owner" ? "innovation_presentation" : "innovation_submission",
                    )
                  }
                  className="gap-1.5 bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935] whitespace-nowrap shrink-0"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {persona === "brand_owner" ? "Present Brand Innovation" : "Submit C2B Innovation Pitch"}
                </Button>
                {persona === "consumer" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openPublishModal("innovation_presentation")}
                    className="gap-1.5 whitespace-nowrap shrink-0 text-xs font-bold"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Brand Showcase Deck
                  </Button>
                )}
              </>
            )}
            {activeTab === "events_collabs" && (
              <>
                <Button
                  size="sm"
                  onClick={() => openPublishModal("event")}
                  className="gap-1.5 bg-slate-950 text-[#f5d061] hover:bg-slate-900 font-bold whitespace-nowrap shrink-0"
                >
                  <Calendar className="h-3.5 w-3.5" /> Post Brand Event
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPublishModal("collab")}
                  className="gap-1.5 font-bold whitespace-nowrap shrink-0"
                >
                  <Handshake className="h-3.5 w-3.5 text-primary" /> Open Collab Brief
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Search bar when global */}
      {!compact && activeTab !== "authenticity" && (
        <div className="flex items-center gap-2">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${activeTab === "releases" ? "new releases & product drops" : activeTab === "innovations" ? "innovation decks & C2B pitches" : "brand events & collaborations"}...`}
            className="h-10 bg-background text-sm"
          />
        </div>
      )}

      {/* AUTHENTICITY & ORIGINALITY PANEL (for /discover) */}
      {activeTab === "authenticity" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <ScanBarcode className="h-4 w-4" /> Instant Product &amp; Packaging Verification
            </div>
            <h3 className="font-display text-lg font-black">
              Confirm Product Originality Before Buying
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scan GS1 barcodes, QR tags, packaging seals, and serialized batch codes against verified brand records. Report counterfeit supply leaks directly to brand protection teams.
            </p>
            <Button
              size="sm"
              onClick={() => navigate({ to: "/scan" })}
              className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-500 font-bold"
            >
              <ScanBarcode className="h-4 w-4" /> Open Authenticity Scanner →
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#b88914]">
              <BadgeCheck className="h-4 w-4 text-[#d6a928]" /> Corporate Domain Ownership Registry
            </div>
            <h3 className="font-display text-lg font-black">
              Verify &amp; Claim Auto-Sourced Brand Profiles
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every brand sourced from global knowledge graphs displays its official website domain. Corporate owners verify via matching company email domain to unlock direct B2C governance.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate({ to: "/brands" })}
              className="gap-1.5 border-[#d6a928]/60 font-bold"
            >
              <ShieldCheck className="h-4 w-4 text-[#d6a928]" /> Browse &amp; Claim Brands →
            </Button>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/20 px-5 py-10 text-center space-y-3">
          <p className="font-display text-base font-bold text-foreground">
            {brand
              ? `No ${activeTab === "releases" ? "releases" : activeTab === "innovations" ? "innovation presentations or submissions" : "events or collaboration briefs"} posted yet for ${brand.name}`
              : "No matching items yet"}
          </p>
          <p className="mx-auto max-w-md text-xs text-muted-foreground">
            {activeTab === "releases"
              ? "Be the first to showcase a new product drop, edition, or service rollout."
              : activeTab === "innovations"
                ? "Brands can present new innovations, and everyday consumers/creators can pitch C2B improvements."
                : "Post an interactive B2C customer townhall, pop-up event, or creator/supplier collaboration brief."}
          </p>
          <Button
            size="sm"
            onClick={() =>
              openPublishModal(
                activeTab === "releases"
                  ? "release"
                  : activeTab === "innovations"
                    ? "innovation_submission"
                    : "collab",
              )
            }
            className="gap-1.5 bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935]"
          >
            <Plus className="h-4 w-4" /> Create First Entry
          </Button>
        </div>
      ) : (
        <div className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
          {filteredItems.map((item) => {
            const upvoted = hasUpvotedEcosystemItem(item.id);
            const rsvped = hasRsvpedEcosystemItem(item.id);
            const isC2BPitch = item.itemType === "innovation_submission";
            const isEvent = item.itemType === "event";
            const isCollab = item.itemType === "collab";

            return (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider",
                          item.itemType === "release"
                            ? "bg-amber-500/15 text-amber-800 dark:text-amber-300"
                            : isC2BPitch
                              ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
                              : item.itemType === "innovation_presentation"
                                ? "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300"
                                : isEvent
                                  ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                                  : "bg-blue-500/15 text-blue-700 dark:text-blue-300",
                        )}
                      >
                        {item.itemType === "release"
                          ? "New Release"
                          : isC2BPitch
                            ? "C2B Innovation Pitch"
                            : item.itemType === "innovation_presentation"
                              ? "Innovation Presentation"
                              : isEvent
                                ? "B2C Event"
                                : "B2C / C2B Collab"}
                      </span>
                      <span className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-bold text-foreground">
                        {item.status}
                      </span>
                    </div>

                    {!brand && (
                      <Link
                        to="/brands/$slug"
                        params={{ slug: item.brandSlug }}
                        translate="no"
                        className="notranslate text-xs font-extrabold text-primary hover:underline inline-flex items-center gap-0.5"
                      >
                        {item.brandName}
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>

                  <h3 className="font-display text-base font-extrabold leading-snug text-foreground">
                    {item.title}
                  </h3>

                  <p className="text-xs leading-relaxed text-muted-foreground">{item.summary}</p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground/80">{item.authorName}</span>
                    {item.eventDate && (
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Calendar className="h-3 w-3 text-primary" />
                        {item.eventDate}
                      </span>
                    )}
                    {item.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" />
                        {item.location}
                      </span>
                    )}
                  </div>

                  {item.compensation && (
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                      Opportunity / Reward: {item.compensation}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                  <button
                    type="button"
                    onClick={() => void handleUpvote(item)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold tabular-nums transition cursor-pointer",
                      upvoted
                        ? "border-[#d6a928] bg-[#d6a928]/15 text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <ThumbsUp className="h-3.5 w-3.5 text-[#d6a928]" />
                    <span>{item.upvotes}</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    {isEvent && (
                      <Button
                        size="sm"
                        onClick={() => void handleRsvp(item)}
                        className={cn(
                          "h-8 gap-1.5 text-xs font-bold",
                          rsvped
                            ? "bg-emerald-600 text-white hover:bg-emerald-500"
                            : "bg-slate-950 text-[#f5d061] hover:bg-slate-900",
                        )}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {rsvped ? `RSVP'd (${item.rsvpCount})` : `RSVP (${item.rsvpCount})`}
                      </Button>
                    )}

                    {isCollab && (
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!user) {
                            toast.info("Sign in to submit a collaboration proposal.");
                            navigate({ to: "/auth" });
                            return;
                          }
                          setApplyTarget(item);
                        }}
                        className="h-8 gap-1.5 bg-[#d6a928] text-xs font-black text-slate-950 hover:bg-[#e5b935]"
                      >
                        <Users className="h-3.5 w-3.5" />
                        Apply / Collaborate
                      </Button>
                    )}

                    {item.externalUrl && (
                      <Button size="sm" variant="outline" className="h-8 gap-1 text-xs font-bold" asChild>
                        <a href={item.externalUrl} target="_blank" rel="noopener noreferrer">
                          Official Link <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* PUBLISH RELEASE / INNOVATION / EVENT / COLLAB MODAL */}
      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl border border-border bg-card p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-black">
              {publishType === "release"
                ? "Publish Brand New Release / Product Drop"
                : publishType === "innovation_presentation"
                  ? "Publish Brand Innovation Presentation"
                  : publishType === "innovation_submission"
                    ? "Submit C2B / B2C Innovation Pitch to Brand"
                    : publishType === "event"
                      ? "Host B2C Brand Event or Customer Townhall"
                      : "Post Collaboration Opportunity"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Connect brands and consumers transparently beyond Stash/Trash votes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePublishSubmit} className="space-y-3">
            {!brand && brandsList.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-bold">Target Brand</label>
                <select
                  value={selectedBrandSlug}
                  onChange={(e) => setSelectedBrandSlug(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs font-semibold"
                >
                  {brandsList.slice(0, 60).map((b) => (
                    <option key={b.id} value={b.slug}>
                      {b.name} ({b.country || "Global"})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold">Title</label>
              <Input
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder={
                  publishType === "release"
                    ? "e.g. 2027 Heritage Edition Launch"
                    : publishType === "innovation_submission"
                      ? "e.g. Refillable Pack Reward Program"
                      : "Enter headline..."
                }
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold">Details / Presentation Summary</label>
              <Textarea
                value={summaryInput}
                onChange={(e) => setSummaryInput(e.target.value)}
                placeholder="Describe key features, originality proof, schedule, or impact..."
                className="min-h-24 text-xs"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold">Category</label>
                <Input
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold">Date / Timeline</label>
                <Input
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  placeholder="e.g. Dec 15, 2026"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold">Location / Channel</label>
                <Input
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Nationwide / Johannesburg / Live"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold">
                  {publishType === "collab" ? "Reward / Compensation" : "Official Reference URL (Optional)"}
                </label>
                {publishType === "collab" ? (
                  <Input
                    value={compensationInput}
                    onChange={(e) => setCompensationInput(e.target.value)}
                    placeholder="e.g. R5,000 + Product Seed"
                    className="h-9 text-xs"
                  />
                ) : (
                  <Input
                    value={externalUrlInput}
                    onChange={(e) => setExternalUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="h-9 text-xs"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setPublishOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935]"
              >
                {submitting ? "Publishing..." : "Publish Now"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* COLLABORATION PROPOSAL MODAL */}
      <Dialog open={!!applyTarget} onOpenChange={(o) => !o && setApplyTarget(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl border border-border bg-card p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-black">
              Collaborate with{" "}
              <span translate="no" className="notranslate">
                {applyTarget?.brandName}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {applyTarget?.title}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplySubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold">Your B2C / C2B Collaboration Proposal</label>
              <Textarea
                value={pitchInput}
                onChange={(e) => setPitchInput(e.target.value)}
                placeholder="Share your idea, creator reach, supply capabilities, or co-creation pitch..."
                className="min-h-24 text-xs"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold">Portfolio / Deck / Social Link (Optional)</label>
              <Input
                value={portfolioInput}
                onChange={(e) => setPortfolioInput(e.target.value)}
                placeholder="https://..."
                className="h-9 text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setApplyTarget(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={applying}
                className="bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935]"
              >
                {applying ? "Sending..." : "Submit Proposal"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
