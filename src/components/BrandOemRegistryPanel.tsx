import { useEffect, useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Plus,
  Trash2,
  MapPin,
  PackageCheck,
  SearchCheck,
  Database,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  fetchBrandOemBatches,
  registerBrandOemBatch,
  removeBrandOemBatch,
  fetchAuthorizedDealers,
  addAuthorizedDealer,
  fetchCounterfeitScanEvents,
  verifyBatchAndLocationAgainstRegistry,
  type BrandOemBatch,
  type BrandAuthorizedDealer,
  type CounterfeitScanEvent,
  type IndustrySector,
  type BatchVerificationVerdict,
} from "@/lib/oem-registry";
import { formatRegionalCurrency, type GlobalRegionCode } from "@/lib/global-regions";

interface BrandOemRegistryPanelProps {
  brandSlug: string;
  brandName: string;
  ownerUid: string;
  regionCode: GlobalRegionCode;
  canWrite: boolean;
  gateReason?: string;
}

const SECTOR_OPTIONS: { value: IndustrySector; label: string }[] = [
  { value: "groceries_fmcg", label: "Groceries & Beverages (GS1)" },
  { value: "automotive_parts", label: "Automotive Parts & VINs" },
  { value: "athletic_footwear", label: "Sneakers & Apparel SKUs" },
  { value: "luxury_watches", label: "Luxury Watches & Jewelry" },
  { value: "electronics_appliances", label: "Electronics & Appliances" },
  { value: "pharmaceuticals", label: "Pharmaceuticals & Health" },
  { value: "general_retail", label: "General Retail & Hardware" },
];

export function BrandOemRegistryPanel({
  brandSlug,
  brandName,
  ownerUid,
  regionCode,
  canWrite,
  gateReason,
}: BrandOemRegistryPanelProps) {
  const [batches, setBatches] = useState<BrandOemBatch[]>([]);
  const [dealers, setDealers] = useState<BrandAuthorizedDealer[]>([]);
  const [events, setEvents] = useState<CounterfeitScanEvent[]>([]);
  const [dbSynced, setDbSynced] = useState<boolean>(false);

  // Batch form
  const [sector, setSector] = useState<IndustrySector>("general_retail");
  const [skuCode, setSkuCode] = useState("");
  const [batchPrefix, setBatchPrefix] = useState("");
  const [serialRegex, setSerialRegex] = useState("");
  const [portalDomain, setPortalDomain] = useState("");
  const [savingBatch, setSavingBatch] = useState(false);

  // Dealer form
  const [dealerName, setDealerName] = useState("");
  const [dealerCity, setDealerCity] = useState("");
  const [dealerCountry, setDealerCountry] = useState<string>(
    regionCode === "GLOBAL" ? "US" : regionCode,
  );
  const [dealerChannel, setDealerChannel] = useState("Official Flagship & Authorized Retail");
  const [savingDealer, setSavingDealer] = useState(false);

  // Live probe tool
  const [probeCode, setProbeCode] = useState("");
  const [probeCity, setProbeCity] = useState("");
  const [probeResult, setProbeResult] = useState<BatchVerificationVerdict | null>(null);
  const [probing, setProbing] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const [bRes, dRes, eRes] = await Promise.all([
        fetchBrandOemBatches(brandSlug),
        fetchAuthorizedDealers(brandSlug),
        fetchCounterfeitScanEvents(brandSlug),
      ]);
      if (!active) return;
      setBatches(bRes.batches);
      setDealers(dRes.dealers);
      setEvents(eRes.events);
      setDbSynced(bRes.syncedToPostgres && dRes.syncedToPostgres);
    }
    load();
    return () => {
      active = false;
    };
  }, [brandSlug]);

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      toast.error(gateReason || "Corporate domain verification required to publish OEM batches.");
      return;
    }
    if (!skuCode.trim() || !batchPrefix.trim()) {
      toast.error("Provide both an OEM SKU code and a valid batch prefix.");
      return;
    }
    setSavingBatch(true);
    try {
      const res = await registerBrandOemBatch({
        brand_slug: brandSlug,
        brand_name: brandName,
        industry_sector: sector,
        sku_code: skuCode.trim(),
        batch_prefix: batchPrefix.trim(),
        serial_regex: serialRegex.trim() || null,
        authentic_portal_domain: portalDomain.trim() || null,
        notes: `Registered by verified Brand Owner for ${brandName}`,
        status: "active",
        created_by_uid: ownerUid || "brand-owner",
      });
      setBatches((prev) => [res.record, ...prev]);
      setSkuCode("");
      setBatchPrefix("");
      setSerialRegex("");
      toast.success(
        res.syncedToPostgres
          ? "OEM batch prefix published to live Postgres verification network."
          : "OEM batch prefix saved locally (DB migration pending push).",
      );
    } finally {
      setSavingBatch(false);
    }
  };

  const handleDeleteBatch = async (id: string) => {
    if (!canWrite) {
      toast.error(gateReason || "Corporate verification required.");
      return;
    }
    await removeBrandOemBatch(id);
    setBatches((prev) => prev.filter((b) => b.id !== id));
    toast.success("OEM batch rule removed.");
  };

  const handleAddDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      toast.error(gateReason || "Corporate verification required to authorize retail dealers.");
      return;
    }
    if (!dealerName.trim() || !dealerCity.trim()) {
      toast.error("Dealer name and city are required.");
      return;
    }
    setSavingDealer(true);
    try {
      const res = await addAuthorizedDealer({
        brand_slug: brandSlug,
        dealer_name: dealerName.trim(),
        city: dealerCity.trim(),
        country_code: dealerCountry.trim().toUpperCase(),
        region: regionCode,
        authorized_channels: dealerChannel.trim() || "Official Retail",
        active: true,
      });
      setDealers((prev) => [res.record, ...prev]);
      setDealerName("");
      setDealerCity("");
      toast.success("Authorized dealer added to global whitelist.");
    } finally {
      setSavingDealer(false);
    }
  };

  const handleRunProbe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!probeCode.trim()) return;
    setProbing(true);
    try {
      const verdict = await verifyBatchAndLocationAgainstRegistry({
        brandSlug,
        brandName,
        code: probeCode,
        city: probeCity,
        countryCode: regionCode,
        reporterUid: ownerUid || "brand-audit",
      });
      setProbeResult(verdict);
      const { events: updatedEvents } = await fetchCounterfeitScanEvents(brandSlug);
      setEvents(updatedEvents);
    } finally {
      setProbing(false);
    }
  };

  const suspiciousCount = events.filter((e) => e.scan_outcome !== "matched_oem").length;

  return (
    <div className="space-y-6">
      {/* Header & Status Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-border rounded-xl p-4 bg-card">
        <div>
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Global OEM Batch & Authorized-Dealer Whitelist
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Publish valid SKU/serial prefixes and authorized retail cities for{" "}
            <span className="font-semibold text-foreground">{brandName}</span>. Consumer scans on{" "}
            <span className="font-mono">/scan</span> and brand profiles cross-check these rules in real time.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Registry Storage
            </p>
            <p className="text-xs font-mono font-semibold text-foreground flex items-center gap-1 justify-end">
              <Database className="w-3.5 h-3.5 text-primary" />
              {dbSynced ? "Postgres Multi-Tenant Live" : "Local Sync (DB Migration Pending)"}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-border rounded-xl p-4 bg-card">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            Active OEM Rules
          </p>
          <p className="text-2xl font-bold font-mono tabular-nums text-foreground mt-1">
            {batches.length}
          </p>
        </div>
        <div className="border border-border rounded-xl p-4 bg-card">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            Authorized Hubs
          </p>
          <p className="text-2xl font-bold font-mono tabular-nums text-foreground mt-1">
            {dealers.filter((d) => d.active).length}
          </p>
        </div>
        <div className="border border-border rounded-xl p-4 bg-card">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            Grey-Market Alerts
          </p>
          <p className="text-2xl font-bold font-mono tabular-nums text-amber-500 mt-1">
            {suspiciousCount}
          </p>
        </div>
        <div className="border border-border rounded-xl p-4 bg-card">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            Loss Intercepted
          </p>
          <p className="text-2xl font-bold font-mono tabular-nums text-emerald-500 mt-1">
            {formatRegionalCurrency(
              events.reduce((sum, e) => sum + Number(e.estimated_loss_recovered_usd || 0), 0),
              regionCode,
              true,
            )}
          </p>
        </div>
      </div>

      {/* Two-Column Forms: OEM Batch Rules + Authorized Dealers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publish OEM Batch Rule */}
        <form onSubmit={handleAddBatch} className="border border-border rounded-xl p-5 bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground">Register Valid SKU / Batch Prefix</h4>
            <span className="text-[11px] font-mono text-muted-foreground">OEM AUTH RULE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Industry Sector
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as IndustrySector)}
                disabled={!canWrite}
                className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
              >
                {SECTOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                SKU / Model Reference
              </label>
              <input
                type="text"
                value={skuCode}
                onChange={(e) => setSkuCode(e.target.value)}
                disabled={!canWrite}
                placeholder="e.g. CW2288-111 or 90915-YZZD2"
                className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-mono text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Batch / Prefix Match *
              </label>
              <input
                type="text"
                value={batchPrefix}
                onChange={(e) => setBatchPrefix(e.target.value)}
                disabled={!canWrite}
                placeholder="e.g. CW2288 or 126610"
                className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-mono text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Serial Regex (Optional)
              </label>
              <input
                type="text"
                value={serialRegex}
                onChange={(e) => setSerialRegex(e.target.value)}
                disabled={!canWrite}
                placeholder="e.g. ^[A-Z]{2}\d{4}-\d{3}$"
                className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-mono text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Official Auth Portal Domain (Optional)
            </label>
            <input
              type="text"
              value={portalDomain}
              onChange={(e) => setPortalDomain(e.target.value)}
              disabled={!canWrite}
              placeholder="e.g. nike.com or rolex.com"
              className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
            />
          </div>

          <Button type="submit" disabled={!canWrite || savingBatch} size="sm" className="w-full">
            <Plus className="w-4 h-4 mr-1.5" />
            {savingBatch ? "Publishing OEM Rule..." : "Publish OEM Prefix to Global Registry"}
          </Button>

          {/* Existing Batches Table */}
          <div className="pt-3 border-t border-border space-y-2 max-h-56 overflow-y-auto">
            {batches.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg border border-border/70 bg-background/60 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-mono font-semibold text-foreground truncate">
                    {b.batch_prefix} · <span className="text-muted-foreground">{b.sku_code}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {b.industry_sector.replace(/_/g, " ")} · Status: {b.status}
                  </p>
                </div>
                {canWrite && !b.id.startsWith("builtin-") && (
                  <button
                    type="button"
                    onClick={() => handleDeleteBatch(b.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete batch rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </form>

        {/* Authorized Retail Dealers */}
        <form onSubmit={handleAddDealer} className="border border-border rounded-xl p-5 bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground">Authorized Retail & Stockist Whitelist</h4>
            <span className="text-[11px] font-mono text-muted-foreground">GEO SHIELD</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Authorized Store / Dealer Name *
              </label>
              <input
                type="text"
                value={dealerName}
                onChange={(e) => setDealerName(e.target.value)}
                disabled={!canWrite}
                placeholder="e.g. Nike SoHo Flagship"
                className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                City / Hub *
              </label>
              <input
                type="text"
                value={dealerCity}
                onChange={(e) => setDealerCity(e.target.value)}
                disabled={!canWrite}
                placeholder="e.g. New York, London, Geneva"
                className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Country ISO Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={dealerCountry}
                onChange={(e) => setDealerCountry(e.target.value.toUpperCase())}
                disabled={!canWrite}
                placeholder="US, GB, CH, ZA, JP..."
                className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-mono text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Authorized Channels
              </label>
              <input
                type="text"
                value={dealerChannel}
                onChange={(e) => setDealerChannel(e.target.value)}
                disabled={!canWrite}
                placeholder="Flagship & Official Webstore"
                className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
              />
            </div>
          </div>

          <Button type="submit" disabled={!canWrite || savingDealer} variant="secondary" size="sm" className="w-full">
            <MapPin className="w-4 h-4 mr-1.5" />
            {savingDealer ? "Adding Dealer..." : "Whitelist Authorized Store Location"}
          </Button>

          <div className="pt-3 border-t border-border space-y-2 max-h-56 overflow-y-auto">
            {dealers.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg border border-border/70 bg-background/60 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{d.dealer_name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {d.city} ({d.country_code}) · {d.authorized_channels}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-500 shrink-0">ACTIVE</span>
              </div>
            ))}
          </div>
        </form>
      </div>

      {/* Live Counterfeit & Grey-Market Simulator / Probe + Event Feed */}
      <div className="border border-border rounded-xl p-5 bg-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <SearchCheck className="w-4 h-4 text-primary" />
              Test Live OEM Batch & Geo Grey-Market Leak Check
            </h4>
            <p className="text-xs text-muted-foreground">
              Simulate what buyers experience when verifying a serial/SKU inside or outside your authorized retail cities.
            </p>
          </div>
        </div>

        <form onSubmit={handleRunProbe} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={probeCode}
            onChange={(e) => setProbeCode(e.target.value)}
            placeholder="Batch / Serial / SKU (e.g. CW2288-111)"
            className="h-9 rounded-lg border border-input bg-background px-3 text-xs font-mono text-foreground"
          />
          <input
            type="text"
            value={probeCity}
            onChange={(e) => setProbeCity(e.target.value)}
            placeholder="Store City (optional, e.g. Lagos or London)"
            className="h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground"
          />
          <Button type="submit" size="sm" disabled={probing || !probeCode.trim()}>
            {probing ? "Checking Registry..." : "Verify Serial & Geo Whitelist"}
          </Button>
        </form>

        {probeResult && (
          <div
            className={`rounded-lg border p-3.5 text-xs space-y-1 ${
              probeResult.authentic
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-amber-500/40 bg-amber-500/5"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold flex items-center gap-1.5 text-foreground">
                {probeResult.authentic ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                {probeResult.headline}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                CONFIDENCE {probeResult.confidencePct}%
              </span>
            </div>
            <p className="text-muted-foreground">{probeResult.explanation}</p>
            <p className="font-medium text-foreground">Action: {probeResult.nextAction}</p>
          </div>
        )}

        {events.length > 0 && (
          <div className="pt-3 border-t border-border space-y-2">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
              Recent Intercept Telemetry
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {events.slice(0, 6).map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border/70 bg-background/50 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-mono font-semibold text-foreground truncate">
                      {evt.sku_or_batch}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {evt.city_or_store} ({evt.country_code})
                    </p>
                  </div>
                  <span
                    className={`font-mono text-[11px] font-semibold shrink-0 ${
                      evt.scan_outcome === "matched_oem" ? "text-emerald-500" : "text-amber-500"
                    }`}
                  >
                    {evt.scan_outcome === "matched_oem" ? "OEM OK" : "INTERCEPT"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
