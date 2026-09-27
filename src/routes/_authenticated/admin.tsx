import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { fetchPendingVerifications, reviewVerification } from "@/lib/brands";
import {
  importBrandsFromWikidata,
  approveBrandCandidate,
  rejectBrandCandidate,
  buildBrandInvitation,
  publishBrandsFromWikidata,
  publishPendingCandidates,
  fetchBrandCandidates,
  SUPPORTED_IMPORT_COUNTRIES,
} from "@/lib/wikidata-import";
import { WORLD_COUNTRY_CODES, countryLabel, countryName } from "@/lib/geo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Download, Check, X, Globe, Copy, Search, Sparkles, LayoutDashboard } from "lucide-react";
import { AdminAppealsQueue } from "@/components/AdminAppealsQueue";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isAdmin, loading } = useRoles();
  const queryClient = useQueryClient();

  const hasAdminAccess =
    isAdmin || user?.email?.toLowerCase() === "borulelo@gmail.com";

  const { data: verifications, refetch: refetchVer } = useQuery({
    queryKey: ["pending-verifications"],
    queryFn: fetchPendingVerifications,
    enabled: hasAdminAccess,
  });

  const { data: candidates, refetch: refetchCand } = useQuery({
    queryKey: ["brand-candidates"],
    queryFn: fetchBrandCandidates,
    enabled: hasAdminAccess,
  });

  const [country, setCountry] = useState("ZA");
  const [limit, setLimit] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [importing, setImporting] = useState(false);
  const [invitation, setInvitation] = useState("");
  const [publishing, setPublishing] = useState(false);

  const runImport = async () => {
    setImporting(true);
    try {
      const r = await importBrandsFromWikidata({
        countryCode: country,
        limit,
        searchQuery: searchQuery.trim() || undefined,
      });
      toast.success(
        `Queued ${r.inserted} new brands for ${countryName(country) || country} (${r.skipped} already queued) via ${r.sourceSummary ?? "Wikidata"}.`,
      );
      await refetchCand();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setImporting(false);
    }
  };

  const runPublish = async () => {
    setPublishing(true);
    try {
      const r = await publishBrandsFromWikidata({
        countryCode: country,
        limit,
        ownerId: user?.id ?? "admin-importer",
        searchQuery: searchQuery.trim() || undefined,
      });
      toast.success(
        `Published ${r.published} brands for ${countryName(country) || country} (${r.skipped} already present) via ${r.sourceSummary ?? "Wikidata"}.`,
      );
      await Promise.all([
        refetchCand(),
        queryClient.invalidateQueries({ queryKey: ["brands"] }),
        queryClient.invalidateQueries({ queryKey: ["local-brands"] }),
      ]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Publish failed.");
    } finally {
      setPublishing(false);
    }
  };

  const publishAll = async () => {
    setPublishing(true);
    try {
      const r = await publishPendingCandidates(user?.id ?? "admin-importer");
      toast.success(`Published ${r.published} queued brands (${r.skipped} skipped).`);
      await Promise.all([
        refetchCand(),
        queryClient.invalidateQueries({ queryKey: ["brands"] }),
        queryClient.invalidateQueries({ queryKey: ["local-brands"] }),
      ]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Publish failed.");
    } finally {
      setPublishing(false);
    }
  };

  const review = async (requestId: string, brandId: string, approve: boolean) => {
    try {
      await reviewVerification({
        requestId,
        brandId,
        reviewerId: user?.id ?? "admin-reviewer",
        approve,
      });
      toast.success(approve ? t("admin.approved") : t("admin.rejected"));
      await Promise.all([
        refetchVer(),
        queryClient.invalidateQueries({ queryKey: ["brands"] }),
      ]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed.");
    }
  };

  const approveCandidate = async (id: string) => {
    try {
      const brand = await approveBrandCandidate(id, user?.id ?? "admin-reviewer");
      const text = buildBrandInvitation(brand);
      setInvitation(text);
      await navigator.clipboard?.writeText(text);
      toast.success(`${brand.name} approved & added to live directory. Invitation copied!`);
      await Promise.all([
        refetchCand(),
        queryClient.invalidateQueries({ queryKey: ["brands"] }),
      ]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Approve failed.");
    }
  };

  const rejectCandidate = async (id: string) => {
    try {
      await rejectBrandCandidate(id, user?.id ?? "admin-reviewer");
      toast.success("Candidate rejected.");
      await refetchCand();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reject failed.");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold">{t("admin.title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Global Wikidata Brand Sourcing, Verification Approvals, and Content Appeals
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1.5 border-[#d6a928]/50">
            <Link to="/dashboard">
              <LayoutDashboard className="h-4 w-4 text-[#d6a928]" />
              Open Full Admin & Brand Dashboard
            </Link>
          </Button>
        </div>

        {loading ? null : !hasAdminAccess ? (
          <p className="text-muted-foreground">You don't have access to this page.</p>
        ) : (
          <Tabs defaultValue="importer">
            <TabsList>
              <TabsTrigger value="importer">Global Brand Importer</TabsTrigger>
              <TabsTrigger value="queue">
                Import Queue{candidates?.length ? ` (${candidates.length})` : ""}
              </TabsTrigger>
              <TabsTrigger value="verifications">
                Verifications{verifications?.length ? ` (${verifications.length})` : ""}
              </TabsTrigger>
              <TabsTrigger value="appeals">Appeals</TabsTrigger>
            </TabsList>

            <TabsContent value="importer" className="mt-6 space-y-4">
              <div className="rounded-2xl border border-[#d6a928]/35 bg-card p-5">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#d6a928]">
                  <Sparkles className="h-4 w-4" />
                  <span>Multi-Engine Brand Sourcing · Wikidata SPARQL + Live Search API + Global Country Atlas</span>
                </div>
                <h2 className="mt-1 font-display text-xl font-bold flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#d6a928]" /> Global & Wikidata Brand Importer
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pull verified companies, logos, domains, and industry classifications for any country in the world into the moderation queue or publish directly to the live directory.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="flex flex-col text-sm">
                    <span className="mb-1 text-xs font-semibold text-muted-foreground">Country (240+ Supported)</span>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="h-10 rounded-md border border-border bg-background px-2.5 text-sm font-medium"
                    >
                      <optgroup label="Featured Countries">
                        {SUPPORTED_IMPORT_COUNTRIES.map(([c, l]) => (
                          <option key={c} value={c}>{l}</option>
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

                  <label className="flex flex-col text-sm sm:col-span-2">
                    <span className="mb-1 text-xs font-semibold text-muted-foreground">
                      Optional Brand / Industry Keyword Filter
                    </span>
                    <div className="relative flex items-center">
                      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. bank, telecom, airline, supermarket, or brand name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </label>

                  <label className="flex flex-col text-sm">
                    <span className="mb-1 text-xs font-semibold text-muted-foreground">Max Brands</span>
                    <Input
                      type="number"
                      min={1}
                      max={200}
                      value={limit}
                      onChange={(e) => setLimit(Number(e.target.value))}
                    />
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={runImport}
                    disabled={importing || publishing}
                    className="gap-1.5 bg-[#d6a928] font-bold text-slate-950 hover:bg-[#e5b935]"
                  >
                    <Download className="h-4 w-4" />
                    {importing ? "Fetching from Wikidata…" : `Fetch ${countryName(country) || country} to Queue`}
                  </Button>
                  <Button
                    onClick={runPublish}
                    disabled={publishing || importing}
                    variant="secondary"
                    className="gap-1.5 font-bold"
                  >
                    <Check className="h-4 w-4" />
                    {publishing ? "Publishing…" : `Fetch + Publish ${countryName(country) || country} Now`}
                  </Button>
                </div>

                {invitation && (
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">Latest brand-owner invitation</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => navigator.clipboard?.writeText(invitation)}
                      >
                        <Copy className="h-4 w-4" /> Copy
                      </Button>
                    </div>
                    <Textarea value={invitation} readOnly className="min-h-48 text-xs" />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="queue" className="mt-6 space-y-2">
              {candidates?.length ? (
                <div className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-2.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {candidates.length} candidate brands ready for review
                  </span>
                  <Button
                    size="sm"
                    onClick={publishAll}
                    disabled={publishing}
                    className="gap-1.5 bg-[#d6a928] font-bold text-slate-950 hover:bg-[#e5b935]"
                  >
                    <Check className="h-4 w-4" /> Publish all queued ({candidates.length})
                  </Button>
                </div>
              ) : null}

              {!candidates?.length ? (
                <p className="text-muted-foreground">Queue is empty. Run the Global Brand Importer.</p>
              ) : (
                candidates.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4"
                  >
                    {c.logo_url ? (
                      <img
                        src={c.logo_url}
                        alt={c.name}
                        className="h-10 w-10 rounded object-contain bg-white p-0.5"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center font-bold">
                        {c.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {countryLabel(c.country) || c.country} · {c.category ?? "Consumer Brand"} ·{" "}
                        {c.website ?? "no site"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" onClick={() => approveCandidate(c.id)} className="gap-1">
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const text = buildBrandInvitation({
                            name: c.name,
                            slug: c.slug,
                            website: c.website,
                          });
                          setInvitation(text);
                          navigator.clipboard?.writeText(text);
                          toast.success("Invitation copied.");
                        }}
                        className="gap-1"
                      >
                        <Copy className="h-4 w-4" />
                        Invite
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectCandidate(c.id)}
                        className="gap-1"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="appeals" className="mt-6">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="mb-4 font-display text-lg font-bold">Human content appeals</h2>
                <AdminAppealsQueue />
              </div>
            </TabsContent>

            <TabsContent value="verifications" className="mt-6 space-y-3">
              {(verifications ?? []).length === 0 ? (
                <p className="text-muted-foreground">{t("admin.empty")}</p>
              ) : (
                (verifications ?? []).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4"
                  >
                    <div>
                      <p className="font-display text-lg font-bold">{r.brandName}</p>
                      {r.message && <p className="text-sm text-muted-foreground">{r.message}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => review(r.id, r.brand_id, true)}>
                        {t("admin.approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => review(r.id, r.brand_id, false)}
                      >
                        {t("admin.reject")}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
