import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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
} from "@/lib/wikidata-import";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";

type BrandImportCandidate = Database["public"]["Tables"]["brand_import_candidates"]["Row"];
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Download, Check, X, Globe, Copy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

const COUNTRIES = [
  ["ZA", "🇿🇦 South Africa"],
  ["US", "🇺🇸 United States"],
  ["GB", "🇬🇧 United Kingdom"],
  ["FR", "🇫🇷 France"],
  ["DE", "🇩🇪 Germany"],
  ["IT", "🇮🇹 Italy"],
  ["ES", "🇪🇸 Spain"],
  ["PT", "🇵🇹 Portugal"],
  ["NL", "🇳🇱 Netherlands"],
  ["BR", "🇧🇷 Brazil"],
  ["IN", "🇮🇳 India"],
  ["CN", "🇨🇳 China"],
  ["JP", "🇯🇵 Japan"],
  ["KR", "🇰🇷 South Korea"],
  ["MX", "🇲🇽 Mexico"],
  ["CA", "🇨🇦 Canada"],
  ["AU", "🇦🇺 Australia"],
  ["NG", "🇳🇬 Nigeria"],
  ["KE", "🇰🇪 Kenya"],
  ["EG", "🇪🇬 Egypt"],
  ["MA", "🇲🇦 Morocco"],
  ["GH", "🇬🇭 Ghana"],
  ["SN", "🇸🇳 Senegal"],
  ["ET", "🇪🇹 Ethiopia"],
] as const;

function AdminPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isAdmin, loading } = useRoles();

  const { data: verifications, refetch: refetchVer } = useQuery({
    queryKey: ["pending-verifications"],
    queryFn: fetchPendingVerifications,
    enabled: isAdmin,
  });

  const { data: candidates, refetch: refetchCand } = useQuery({
    queryKey: ["brand-candidates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_import_candidates")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as BrandImportCandidate[];
    },
    enabled: isAdmin,
  });

  const [country, setCountry] = useState("ZA");
  const [limit, setLimit] = useState(50);
  const [importing, setImporting] = useState(false);
  const [invitation, setInvitation] = useState("");

  const runImport = async () => {
    setImporting(true);
    try {
      const r = await importBrandsFromWikidata({ countryCode: country, limit });
      toast.success(`Imported ${r.inserted} new brands (${r.skipped} already queued).`);
      refetchCand();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setImporting(false);
    }
  };

  const review = async (requestId: string, brandId: string, approve: boolean) => {
    if (!user) return;
    try {
      await reviewVerification({ requestId, brandId, reviewerId: user.id, approve });
      toast.success(approve ? t("admin.approved") : t("admin.rejected"));
      refetchVer();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed.");
    }
  };

  const approveCandidate = async (id: string) => {
    if (!user) return;
    try {
      const brand = await approveBrandCandidate(id, user.id);
      const text = buildBrandInvitation(brand);
      setInvitation(text);
      await navigator.clipboard?.writeText(text);
      toast.success("Brand added and invitation copied.");
      refetchCand();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Approve failed.");
    }
  };

  const rejectCandidate = async (id: string) => {
    if (!user) return;
    try {
      await rejectBrandCandidate(id, user.id);
      toast.success("Rejected.");
      refetchCand();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reject failed.");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 font-display text-3xl font-extrabold">{t("admin.title")}</h1>
        {loading ? null : !isAdmin ? (
          <p className="text-muted-foreground">You don't have access to this page.</p>
        ) : (
          <Tabs defaultValue="importer">
            <TabsList>
              <TabsTrigger value="importer">Brand Importer</TabsTrigger>
              <TabsTrigger value="queue">
                Import Queue{candidates?.length ? ` (${candidates.length})` : ""}
              </TabsTrigger>
              <TabsTrigger value="verifications">
                Verifications{verifications?.length ? ` (${verifications.length})` : ""}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="importer" className="mt-6 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  <Globe className="h-5 w-5" /> Wikidata Brand Importer
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Free, CC0-licensed. Pulls companies (with logos where available) for the selected
                  country into the moderation queue.
                </p>
                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <label className="flex flex-col text-sm">
                    <span className="mb-1 text-muted-foreground">Country</span>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="h-10 rounded-md border border-border bg-background px-2"
                    >
                      {COUNTRIES.map(([c, l]) => (
                        <option key={c} value={c}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-sm">
                    <span className="mb-1 text-muted-foreground">Limit</span>
                    <Input
                      type="number"
                      min={1}
                      max={200}
                      className="w-24"
                      value={limit}
                      onChange={(e) => setLimit(Number(e.target.value))}
                    />
                  </label>
                  <Button onClick={runImport} disabled={importing} className="gap-1.5">
                    <Download className="h-4 w-4" />
                    {importing ? "Importing…" : "Fetch from Wikidata"}
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
              {!candidates?.length ? (
                <p className="text-muted-foreground">Queue is empty. Run the importer.</p>
              ) : (
                candidates.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
                  >
                    {c.logo_url ? (
                      <img
                        src={c.logo_url}
                        alt={c.name}
                        className="h-10 w-10 rounded object-contain bg-white"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center font-bold">
                        {c.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {c.country} · {c.category ?? "—"} · {c.website ?? "no site"}
                      </p>
                    </div>
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
                ))
              )}
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
