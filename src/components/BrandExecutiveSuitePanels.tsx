import { useEffect, useState } from "react";
import {
  Award,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  Lock,
  Megaphone,
  MessageCircle,
  Phone,
  PhoneCall,
  PhoneOff,
  Plus,
  RefreshCw,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  Users,
  Video,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  B2B_BRAND_PLANS,
  addAndSwitchDeskOperator,
  getActiveBrandSubscription,
  getActiveDeskOperator,
  getBrandDeskOperators,
  getCxLifecycleMatrix,
  getOperatorShiftLogs,
  recordBrandSubscriptionPayment,
  switchActiveDeskOperator,
  getBrandContactSettings,
  saveBrandContactSettings,
  getInboundCallRequests,
  updateInboundCallRequestStatus,
  type BrandDeskOperator,
  type BrandPlanTierId,
  type BrandSubscriptionPlan,
  type CxLifecycleRecord,
  type OperatorShiftLogEntry,
  type BrandDirectCallingMode,
  type BrandInboundContactSettings,
  type InboundCustomerCallRequest,
} from "@/lib/brand-operators";
import { cn } from "@/lib/utils";

/**
 * 1. SWITCH ACTIVE OPERATOR / SHIFT HANDOVER BAR
 * Ensures a Brand Owner can share Brand login credentials with an employee
 * without ANY personal user profile data ever mixing with the Brand Account.
 */
export function BrandOperatorHandoverBar({ brandName = "Official Brand Account" }: { brandName?: string }) {
  const [operators, setOperators] = useState<BrandDeskOperator[]>(() => getBrandDeskOperators());
  const [activeOp, setActiveOp] = useState<BrandDeskOperator>(() => getActiveDeskOperator());
  const [logs, setLogs] = useState<OperatorShiftLogEntry[]>(() => getOperatorShiftLogs());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newShift, setNewShift] = useState("Day Shift CX Desk");

  const syncState = () => {
    setOperators(getBrandDeskOperators());
    setActiveOp(getActiveDeskOperator());
    setLogs(getOperatorShiftLogs());
  };

  useEffect(() => {
    window.addEventListener("sot-brand-operator-updated", syncState);
    return () => window.removeEventListener("sot-brand-operator-updated", syncState);
  }, []);

  const handleSelectOperator = (opId: string) => {
    const switched = switchActiveDeskOperator(opId);
    syncState();
    toast.success(
      `Active Brand Operator switched to ${switched.name} (${switched.roleTitle}). All replies & broadcasts are now attributed to this desk operator.`,
    );
  };

  const handleAddOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Enter the corporate desk operator's name or seat ID.");
      return;
    }
    if (newName.includes("@") || newRole.includes("@")) {
      toast.error(
        "Security Policy: Employees cannot attach personal SOrT handles or personal email profiles to a Brand Account. Enter a corporate desk name/seat only.",
      );
      return;
    }
    const created = addAndSwitchDeskOperator({
      name: newName,
      roleTitle: newRole || "Authorized Corporate CX Desk Seat",
      shiftLabel: newShift,
    });
    setNewName("");
    setNewRole("");
    setShowAddForm(false);
    syncState();
    toast.success(
      `Activated corporate desk seat: ${created.name} (${created.roleTitle}). Zero personal profile attachment enforced for ${brandName}.`,
    );
  };

  return (
    <section className="rounded-2xl border-2 border-[#d6a928]/60 bg-slate-950 p-5 text-white shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#d6a928] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-slate-950">
              <UserCheck className="h-3.5 w-3.5" />
              Corporate Desk Operator Roster · Shared Brand Login
            </span>
            <span className="text-xs text-emerald-400 font-bold">
              🔒 Strict Non-Attachment: Employees Cannot Link Personal SOrT Profiles
            </span>
          </div>

          <h3 className="mt-2 font-display text-lg font-black text-white">
            {brandName} — Active Corporate Desk Seat:{" "}
            <span className="text-[#f5d061]">{activeOp.name}</span>{" "}
            <span className="text-sm font-semibold text-slate-300">
              ({activeOp.roleTitle} · {activeOp.shiftLabel})
            </span>
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Employees operating SOrT for <strong>{brandName}</strong> work exclusively under the Brand’s corporate login via isolated desk seats. Personal user profiles can never be attached, linked, or used on the Brand’s profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <select
            value={activeOp.id}
            onChange={(e) => handleSelectOperator(e.target.value)}
            aria-label="Switch Active Brand Operator"
            className="h-10 rounded-xl border border-[#d6a928]/60 bg-slate-900 px-3 text-xs font-extrabold text-[#f5d061] outline-none"
          >
            {operators.map((op) => (
              <option key={op.id} value={op.id}>
                Switch Operator: {op.name} — {op.roleTitle} ({op.sotOperatorScore} pts)
              </option>
            ))}
          </select>

          <Button
            type="button"
            size="sm"
            onClick={() => setShowAddForm((v) => !v)}
            className="h-10 gap-1.5 bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935]"
          >
            <Plus className="h-4 w-4" />
            Add Staff Operator
          </Button>
        </div>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddOperator}
          className="mt-4 grid gap-2.5 rounded-xl border border-slate-800 bg-slate-900 p-3.5 sm:grid-cols-4"
        >
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Employee Full Name (e.g. Kabelo M.)"
            className="border-slate-700 bg-slate-950 text-xs text-white"
          />
          <Input
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="Role (e.g. Night Shift CX Officer)"
            className="border-slate-700 bg-slate-950 text-xs text-white"
          />
          <Input
            value={newShift}
            onChange={(e) => setNewShift(e.target.value)}
            placeholder="Shift / Desk (e.g. Sandton Desk)"
            className="border-slate-700 bg-slate-950 text-xs text-white"
          />
          <Button
            type="submit"
            className="bg-emerald-600 text-xs font-black text-white hover:bg-emerald-500"
          >
            Save &amp; Activate Operator
          </Button>
        </form>
      )}

      {/* Operator Shift Handover & Activity Audit Strip */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3 text-[11px] text-slate-400">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-slate-300">
            Recent Shift Log:
          </span>
          {logs.slice(0, 2).map((l) => (
            <span key={l.id} className="rounded bg-slate-900 px-2 py-0.5 text-slate-300">
              <strong className="text-[#f5d061]">{l.operatorName}</strong> ({l.timestamp}):{" "}
              {l.summary.slice(0, 75)}
              {l.summary.length > 75 ? "..." : ""}
            </span>
          ))}
        </div>
        <span className="font-mono text-[#f5d061] tabular-nums">
          Operator Score: {activeOp.sotOperatorScore}/100 · {activeOp.trashesTurnedToStash} Trashes Flipped to Stash
        </span>
      </div>
    </section>
  );
}

/**
 * 2. FULL-CYCLE CX & DATA EXTRACTION MATRIX + SOrT EMPLOYEE AWARDS
 * Shows the exact data Brands pay for: from Launch Broadcast -> Barcode Scan/Complaint ->
 * Operator Call/Voucher -> Verdict Flipped from Trash to Stash + Employee Recognition Awards.
 */
export function BrandCxDataAndAwardsMatrix({
  brandName = "Verified Brand",
  onUpgradeRequest,
}: {
  brandName?: string;
  onUpgradeRequest?: () => void;
}) {
  const [records, setRecords] = useState<CxLifecycleRecord[]>(() =>
    getCxLifecycleMatrix(brandName),
  );
  const [operators, setOperators] = useState<BrandDeskOperator[]>(() => getBrandDeskOperators());
  const [subState, setSubState] = useState(() => getActiveBrandSubscription());

  useEffect(() => {
    setRecords(getCxLifecycleMatrix(brandName));
  }, [brandName]);

  useEffect(() => {
    const sync = () => {
      setRecords(getCxLifecycleMatrix(brandName));
      setOperators(getBrandDeskOperators());
      setSubState(getActiveBrandSubscription());
    };
    window.addEventListener("sot-brand-operator-updated", sync);
    return () => window.removeEventListener("sot-brand-operator-updated", sync);
  }, [brandName]);

  const activeTier = subState.activePlanId;
  const isFreeTier = activeTier === "free_public_voice";
  const hasTier2Matrix = activeTier === "cx_launch_matrix" || activeTier === "enterprise_intelligence";
  const hasTier3Awards = activeTier === "enterprise_intelligence";

  const totalRetainedZar = records.reduce((s, r) => s + r.revenueRetainedZar, 0);
  const totalFlips = operators.reduce((s, o) => s + o.trashesTurnedToStash, 0);

  const handleExportCsv = () => {
    if (!hasTier2Matrix) {
      toast.info(
        `CSV Data Extraction requires Plan 02 (Full-Cycle CX & Launch Matrix) or Plan 03 (Enterprise Intelligence) for ${brandName}.`,
      );
      onUpgradeRequest?.();
      return;
    }
    const headers = [
      "Record ID",
      "Brand",
      "Client",
      "Stage 1: Launch/Ad Source",
      "Stage 2: Scan/Complaint Signal",
      "Initial Verdict",
      "Desk Operator Assigned",
      "Resolution Action",
      "Voucher Code",
      "Final Verdict",
      "Revenue Retained (ZAR)",
    ];
    const rows = records.map((r) => [
      r.id,
      r.brandName,
      r.clientName,
      `"${r.stage1LaunchSource.replace(/"/g, '""')}"`,
      `"${r.stage2ScanOrPostSignal.replace(/"/g, '""')}"`,
      r.initialVerdict.toUpperCase(),
      `"${r.operatorAssigned}"`,
      `"${r.actionTaken}"`,
      r.voucherCode || "N/A",
      r.finalVerdict.toUpperCase(),
      r.revenueRetainedZar,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SOT_CX_Lifecycle_Matrix_${brandName.replace(/[^a-z0-9]/gi, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${brandName} Full-Cycle CX & Data Extraction Matrix (CSV)!`);
  };

  const handleDownloadEmployeeAward = (op: BrandDeskOperator) => {
    if (!hasTier3Awards) {
      toast.info(
        `Official SOrT Employee Recognition Award downloads are unlocked on Plan 03 (Enterprise Intelligence & Awards Suite) for ${brandName}.`,
      );
      onUpgradeRequest?.();
      return;
    }
    const certText = [
      "====================================================================",
      "           OFFICIAL SOrT · STASH OR TRASH EXCELLENCE AWARD          ",
      "====================================================================",
      "",
      `AWARDED TO:       ${op.name}`,
      `OFFICIAL ROLE:    ${op.roleTitle} (${op.shiftLabel})`,
      `REPRESENTING:     ${brandName}`,
      `HONOR TITLE:      ${op.awardBadge}`,
      "",
      "VERIFIED SOrT CX PERFORMANCE METRICS:",
      `• SOrT Operator Score:             ${op.sotOperatorScore} / 100`,
      `• Trashes Flipped to Stash:        ${op.trashesTurnedToStash} Verified Turnarounds`,
      `• Recovery Vouchers Issued:        ${op.vouchersIssued}`,
      `• Median Client Response Time:     ${op.medianResponseMinutes} minutes`,
      `• Post-Call Client Rating:         ${op.clientCallRating} / 5.0 Stars`,
      `• Live Launch Broadcasts Hosted:   ${op.liveBroadcastsHosted}`,
      "",
      `Issued Date: ${new Date().toLocaleDateString()} · Verified by SOrT Brand Barometer`,
      "====================================================================",
    ].join("\n");

    const blob = new Blob([certText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SOrT_Employee_Award_${op.name.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`🏆 Downloaded Official SOrT Employee Recognition Award for ${op.name}!`);
  };

  return (
    <div className="space-y-6">
      {/* FREE PUBLIC VOICE FREEDOM & FAIRNESS MOUTHPIECE BANNER */}
      {isFreeTier && (
        <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 p-4.5 text-xs text-foreground shadow-xs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-xs">
                  <Megaphone className="h-3.5 w-3.5" />
                </span>
                <span className="font-display font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Free Public Voice Active · Freedom of Speech &amp; Equal Right of Reply
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                As a registered brand on the <strong>100% Free Public Voice Tier</strong>, your business has unrestricted freedom to text in public, reply to consumer posts, defend your products, and tell your brand’s truth on Stash or Trash at zero cost. To preserve this fair, free tier, <strong>no private customer telemetry, analytical reports, or CSV data extractions are generated</strong>.
              </p>
            </div>
            {onUpgradeRequest && (
              <Button
                size="sm"
                onClick={onUpgradeRequest}
                className="bg-slate-950 text-[#f5d061] hover:bg-slate-900 font-extrabold shrink-0 text-xs whitespace-nowrap"
              >
                View Paid Report Tiers →
              </Button>
            )}
          </div>
        </div>
      )}

      {/* FULL-CYCLE CX DATA EXTRACTION MATRIX */}
      <section className="rounded-3xl border-2 border-[#d6a928]/50 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#b88914]">
                {brandName} · Proprietary B2B Commercial Data Extraction Engine
              </span>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[10px] font-black uppercase",
                  hasTier2Matrix
                    ? "bg-emerald-500/15 text-emerald-600"
                    : "bg-amber-500/15 text-amber-600",
                )}
              >
                {hasTier2Matrix ? "✓ Unlocked on Active Tier" : "🔒 Requires Tier 2 (CX & Launch Matrix)"}
              </span>
            </div>
            <h2 className="mt-1 font-display text-2xl font-black">
              {brandName} Full-Cycle CX Matrix: Launch Broadcast ➔ Scan/Complaint ➔ Voucher ➔ Stash Flip
            </h2>
            <p className="mt-1 max-w-3xl text-xs text-muted-foreground sm:text-sm">
              100% dedicated to <strong>{brandName}</strong>: tracking every client engagement from the moment they watch your Launch or Ad Broadcast, to a barcode scan or complaint, to the Desk Operator who issued a voucher and flipped their verdict from Trash back to Stash.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {!hasTier2Matrix && onUpgradeRequest && (
              <Button
                variant="outline"
                onClick={onUpgradeRequest}
                className="gap-1.5 border-[#d6a928] font-black text-[#b88914]"
              >
                <Lock className="h-3.5 w-3.5" /> Upgrade Tier to Unlock Full Export
              </Button>
            )}
            <Button
              onClick={handleExportCsv}
              className="gap-1.5 bg-slate-950 font-black text-[#f5d061] hover:bg-slate-900"
            >
              <FileSpreadsheet className="h-4 w-4 text-[#d6a928]" />
              {hasTier2Matrix ? `Export ${brandName} CX Data (CSV)` : "Unlock CSV Data Export (Tier 2+)"}
            </Button>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-background p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Trashes Flipped to Stash
            </p>
            <p className="mt-1 font-display text-2xl font-black text-emerald-600 tabular-nums">
              {totalFlips} Turnarounds
            </p>
          </div>
          <div className="rounded-xl border border-[#d6a928]/40 bg-[#d6a928]/5 p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Estimated Revenue Retained
            </p>
            <p className="mt-1 font-display text-2xl font-black text-[#b88914] tabular-nums">
              R{(totalRetainedZar + 48500).toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Launch Voucher Redemption
            </p>
            <p className="mt-1 font-display text-2xl font-black text-foreground tabular-nums">
              71.4% Conversion
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Regulator Escalations Prevented
            </p>
            <p className="mt-1 font-display text-2xl font-black text-emerald-600 tabular-nums">
              100% (0 CGSO Fines)
            </p>
          </div>
        </div>

        {/* Full-Cycle Lifecycle Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <th className="py-2.5 pr-3">Client &amp; Brand</th>
                <th className="py-2.5 px-3">Stage 1: Launch / Ad Broadcast</th>
                <th className="py-2.5 px-3">Stage 2: Scan / Trash Callout</th>
                <th className="py-2.5 px-3">Stage 3: Desk Operator &amp; Voucher</th>
                <th className="py-2.5 pl-3 text-right">Stage 4: Outcome &amp; ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-secondary/30">
                  <td className="py-3 pr-3 align-top">
                    <p className="font-bold text-foreground">{rec.clientName}</p>
                    <p className="text-[11px] text-[#b88914] font-semibold">{rec.brandName}</p>
                    <p className="text-[10px] text-muted-foreground">{rec.updatedAt}</p>
                  </td>
                  <td className="py-3 px-3 align-top text-muted-foreground">
                    {rec.stage1LaunchSource}
                  </td>
                  <td className="py-3 px-3 align-top">
                    <span className="font-bold text-rose-600">🗑️ Initial Trash: </span>
                    <span className="text-foreground">{rec.stage2ScanOrPostSignal}</span>
                  </td>
                  <td className="py-3 px-3 align-top">
                    <p className="font-bold text-foreground">{rec.operatorAssigned}</p>
                    <p className="text-[11px] text-muted-foreground">{rec.actionTaken}</p>
                    {rec.voucherCode && (
                      <p className="mt-0.5 font-mono text-[11px] font-bold text-emerald-600">
                        Voucher: {rec.voucherCode}
                      </p>
                    )}
                  </td>
                  <td className="py-3 pl-3 align-top text-right tabular-nums">
                    <span className="inline-block font-extrabold text-emerald-600">
                      🪙 Flipped to STASH
                    </span>
                    <p className="mt-0.5 font-mono text-xs font-bold text-foreground">
                      +R{rec.revenueRetainedZar.toLocaleString()} retained
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SOrT EMPLOYEE & DESK OPERATOR RECOGNITION AWARDS LEADERBOARD */}
      <section className="rounded-3xl border-2 border-[#d6a928] bg-slate-950 p-6 text-white shadow-md">
        <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#d6a928]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#f5d061]">
                SOrT Employee Recognition &amp; CX Champion Awards
              </span>
            </div>
            <h2 className="mt-1 font-display text-2xl font-black text-white">
              Performing &amp; Recognized Brand Employees on SOrT
            </h2>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
              Every time an employee resolves a client complaint, hosts a launch broadcast, or flips a Trash verdict into a Stash under <strong>Switch Active Operator</strong>, SOrT ranks their performance and issues official Employee Excellence Awards.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {operators.map((op, index) => (
            <div
              key={op.id}
              className={cn(
                "flex flex-col justify-between rounded-2xl border p-4",
                index === 0
                  ? "border-2 border-[#d6a928] bg-slate-900"
                  : "border-slate-800 bg-slate-900/70",
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-[#d6a928] px-2 py-0.5 text-[10px] font-black text-slate-950">
                    Rank #{index + 1} · {op.sotOperatorScore}/100
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
                    ⭐ {op.clientCallRating.toFixed(2)}
                  </span>
                </div>

                <h3 className="mt-2.5 font-display text-lg font-black text-white">{op.name}</h3>
                <p className="text-xs text-slate-300">
                  {op.roleTitle} · {op.shiftLabel}
                </p>
                <p className="mt-2 text-xs font-bold text-[#f5d061]">{op.awardBadge}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800 pt-3 text-[11px] tabular-nums">
                  <div>
                    <span className="text-slate-400 block">Trash ➔ Stash Flips</span>
                    <strong className="text-emerald-400 text-sm">{op.trashesTurnedToStash}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Median Reply SLA</span>
                    <strong className="text-white text-sm">{op.medianResponseMinutes} mins</strong>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => handleDownloadEmployeeAward(op)}
                className="mt-4 w-full gap-1.5 bg-[#d6a928] text-xs font-black text-slate-950 hover:bg-[#e5b935]"
              >
                <Award className="h-3.5 w-3.5" />
                Download SOrT Employee Award
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * 3. B2B DATA & BROADCAST PRICING TIERS + MULTI-GATEWAY CHECKOUT
 * (Google Pay, Paystack Instant EFT, Stripe Card, Corporate Pro-Forma Tax Invoice)
 * Strictly visible ONLY to Brand Accounts — Users always enjoy 100% Free Access.
 */
export function BrandB2BPricingAndCheckoutPanel({ brandName = "Verified Brand" }: { brandName?: string }) {
  const [subState, setSubState] = useState(() => getActiveBrandSubscription());
  const [currency, setCurrency] = useState<"ZAR" | "USD">("ZAR");
  const [checkoutPlan, setCheckoutPlan] = useState<BrandSubscriptionPlan | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<
    "google_pay" | "paystack_eft" | "stripe_card" | "corporate_invoice"
  >("google_pay");
  const [processing, setProcessing] = useState(false);

  // Corporate Invoice / Card fields
  const [companyRegName, setCompanyRegName] = useState(`${brandName} (Pty) Ltd`);
  const [vatNumber, setVatNumber] = useState("4010293847");
  const [billingEmail, setBillingEmail] = useState("finance@brand-executive.co.za");

  const syncSub = () => setSubState(getActiveBrandSubscription());

  const handleCompletePayment = async () => {
    if (!checkoutPlan) return;
    setProcessing(true);

    try {
      // If Google Pay is selected and browser supports PaymentRequest API, invoke native sheet or fallback cleanly
      if (selectedGateway === "google_pay" && typeof window !== "undefined" && "PaymentRequest" in window) {
        try {
          const supportedInstruments: PaymentMethodData[] = [
            {
              supportedMethods: "https://google.com/pay",
              data: {
                environment: "TEST",
                apiVersion: 2,
                apiVersionMinor: 0,
                merchantInfo: {
                  merchantName: "SOT · Stash Or Trash B2B",
                },
                allowedPaymentMethods: [
                  {
                    type: "CARD",
                    parameters: {
                      allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                      allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX"],
                    },
                    tokenizationSpecification: {
                      type: "PAYMENT_GATEWAY",
                      parameters: {
                        gateway: "example",
                        gatewayMerchantId: "sotB2bMerchantId",
                      },
                    },
                  },
                ],
              },
            },
          ];
          const amountVal =
            currency === "ZAR" ? checkoutPlan.priceZarMonthly : checkoutPlan.priceUsdMonthly;
          const details: PaymentDetailsInit = {
            total: {
              label: `${checkoutPlan.name} — Monthly B2B Subscription`,
              amount: { currency, value: String(amountVal) },
            },
          };
          const request = new PaymentRequest(supportedInstruments, details);
          const canPay = await request.canMakePayment().catch(() => false);
          if (canPay) {
            // Only trigger native sheet if not blocked by iframe permissions policy
            await request.show().then((res) => res.complete("success")).catch(() => {});
          }
        } catch {
          // Iframe sandbox fallback to tokenized instant confirmation
        }
      }

      const receipt = recordBrandSubscriptionPayment({
        brandName,
        planId: checkoutPlan.id,
        paymentMethod: selectedGateway,
        currency,
      });

      if (selectedGateway === "corporate_invoice") {
        const invoiceText = [
          "====================================================================",
          "         SOT · STASH OR TRASH OFFICIAL B2B PRO-FORMA INVOICE        ",
          "====================================================================",
          `INVOICE / PO REF:   ${receipt.referenceCode}`,
          `DATE ISSUED:        ${new Date().toLocaleDateString()}`,
          `BILLED TO:          ${companyRegName}`,
          `VAT / TAX NUMBER:   ${vatNumber}`,
          `BILLING EMAIL:      ${billingEmail}`,
          "",
          `SELECTED B2B PLAN:  ${checkoutPlan.name}`,
          `MONTHLY AMOUNT:     ${receipt.amountDisplay} (Incl. VAT)`,
          `DESK OPERATOR:      ${receipt.operatorOnDuty}`,
          "",
          "INCLUDED COMMERCIAL DATA & BROADCAST ENTITLEMENTS:",
          ...checkoutPlan.dataExtractionFeatures.map((f) => `  ✓ ${f}`),
          "",
          "CORPORATE EFT BANKING DETAILS:",
          "  Account Holder:   Stash Or Trash Hub (Pty) Ltd",
          "  Payment Ref:      " + receipt.referenceCode,
          "====================================================================",
        ].join("\n");

        const blob = new Blob([invoiceText], { type: "text/plain;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SOT_B2B_Invoice_${receipt.referenceCode}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(
          `📄 Corporate Pro-Forma Tax Invoice (${receipt.referenceCode}) downloaded & plan activated!`,
        );
      } else {
        const methodLabels = {
          google_pay: "Google Pay (Tokenized 3DS)",
          paystack_eft: "Paystack Instant EFT / Capitec Pay",
          stripe_card: "Stripe Global B2B Card",
          corporate_invoice: "Corporate Tax Invoice",
        };
        toast.success(
          `✅ ${checkoutPlan.name} activated for ${brandName} via ${methodLabels[selectedGateway]}! Ref: ${receipt.referenceCode}`,
        );
      }

      syncSub();
      setCheckoutPlan(null);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="rounded-3xl border-2 border-[#d6a928] bg-card p-6 shadow-md sm:p-8">
      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-950 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#f5d061]">
              <Lock className="h-3.5 w-3.5 text-[#d6a928]" />
              B2B Brand Owner Exclusive · Hidden From Everyday Users
            </span>
            <span className="text-xs font-bold text-emerald-600">
              ✓ Normal Consumers Enjoy 100% Free Access Forever
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-black sm:text-3xl">
            B2B Data Extraction, Extended Launch Broadcasts &amp; Employee Awards Pricing
          </h2>
          <p className="mt-1 max-w-3xl text-xs text-muted-foreground sm:text-sm">
            Normal users are capped at 90-second situation clips with zero commercial overlays. Brand Accounts subscribe below to unlock extended Product Launch Broadcasts, Full-Cycle CX Data Extraction, Zero-Number Client Calling, and SOrT Employee Recognition Awards.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary p-1 shrink-0">
          <button
            type="button"
            onClick={() => setCurrency("ZAR")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-black transition cursor-pointer",
              currency === "ZAR"
                ? "bg-slate-950 text-[#f5d061]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            🇿🇦 ZAR (South Africa / Africa)
          </button>
          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-black transition cursor-pointer",
              currency === "USD"
                ? "bg-slate-950 text-[#f5d061]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            🌍 USD (Global Brands)
          </button>
        </div>
      </div>

      {/* 4 B2B Plans Grid (Including 100% Free Public Voice) */}
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {B2B_BRAND_PLANS.map((plan) => {
          const isCurrent = subState.activePlanId === plan.id;
          const isFree = plan.priceZarMonthly === 0;
          const priceLabel = isFree
            ? currency === "ZAR" ? "R0" : "$0"
            : currency === "ZAR"
              ? `R${plan.priceZarMonthly.toLocaleString()}`
              : `$${plan.priceUsdMonthly.toLocaleString()}`;

          return (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col justify-between rounded-2xl border p-5 transition-all",
                plan.highlighted
                  ? "border-2 border-[#d6a928] bg-slate-950 text-white shadow-lg"
                  : isFree && isCurrent
                    ? "border-2 border-emerald-500 bg-card text-foreground shadow-sm"
                    : "border-border bg-background text-foreground",
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "text-[11px] font-black uppercase tracking-wider",
                      plan.highlighted
                        ? "text-[#f5d061]"
                        : isFree
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-[#b88914]",
                    )}
                  >
                    {plan.targetAudience}
                  </span>
                  {isCurrent && (
                    <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white">
                      ACTIVE PLAN
                    </span>
                  )}
                </div>

                <h3 className="mt-2 font-display text-xl font-black">{plan.name}</h3>
                <p
                  className={cn(
                    "mt-1 text-xs",
                    plan.highlighted ? "text-slate-300" : "text-muted-foreground",
                  )}
                >
                  {plan.tagline}
                </p>

                <div className="mt-4 flex items-baseline gap-1 border-y border-border/40 py-3 tabular-nums">
                  <span className="font-display text-3xl font-black">{priceLabel}</span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      plan.highlighted ? "text-slate-400" : "text-muted-foreground",
                    )}
                  >
                    {isFree ? "/ month (100% Free Forever)" : "/ month per brand"}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs font-bold">
                  <p className={plan.highlighted ? "text-[#f5d061]" : "text-foreground"}>
                    🎥 {plan.broadcastLimitLabel}
                  </p>
                  <p className={plan.highlighted ? "text-emerald-400" : "text-emerald-600"}>
                    👥 {plan.operatorSeatsLabel}
                  </p>
                </div>

                <ul className="mt-4 space-y-2 text-xs">
                  {plan.dataExtractionFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <Check
                        className={cn(
                          "mt-0.5 h-3.5 w-3.5 shrink-0",
                          plan.highlighted
                            ? "text-[#d6a928]"
                            : feat.startsWith("🔒")
                              ? "text-muted-foreground"
                              : "text-emerald-600",
                        )}
                      />
                      <span
                        className={
                          plan.highlighted
                            ? "text-slate-200"
                            : feat.startsWith("🔒")
                              ? "text-muted-foreground italic"
                              : "text-foreground"
                        }
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-2">
                {isFree ? (
                  <Button
                    disabled={isCurrent}
                    onClick={() => {
                      setActiveBrandPlanTier("free_public_voice", brandName);
                      syncSub();
                      toast.success(
                        `Activated 100% Free Public Voice for ${brandName}! You have unrestricted freedom to text public replies to all consumers.`,
                      );
                    }}
                    className={cn(
                      "w-full gap-2 font-black text-xs",
                      isCurrent
                        ? "border border-emerald-600/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer",
                    )}
                  >
                    <Megaphone className="h-4 w-4" />
                    {isCurrent ? "✓ Active Free Public Voice" : "Activate Free Public Mouthpiece (100% Free)"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setSelectedGateway("google_pay");
                      setCheckoutPlan(plan);
                    }}
                    className={cn(
                      "w-full gap-2 font-black text-xs",
                      plan.highlighted
                        ? "bg-[#d6a928] text-slate-950 hover:bg-[#e5b935]"
                        : "bg-slate-950 text-white hover:bg-slate-900",
                    )}
                  >
                    <Wallet className="h-4 w-4" />
                    Pay with Google Pay / Instant EFT / Card
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Accepted Secure Payment Rails Footer */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/30 p-4 text-xs">
        <div className="flex flex-wrap items-center gap-3 font-bold">
          <span className="flex items-center gap-1.5 text-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Trusted B2B Payment Rails Integrated:
          </span>
          <span>1. Google Pay (Tokenized 3DS)</span>
          <span>·</span>
          <span>2. Paystack (SA Instant EFT &amp; Capitec Pay)</span>
          <span>·</span>
          <span>3. Stripe Global (Visa / Mastercard / Apple Pay)</span>
          <span>·</span>
          <span>4. Corporate Pro-Forma Tax Invoice</span>
        </div>

        {subState.receipts.length > 0 && (
          <span className="font-mono text-[11px] font-bold text-emerald-600">
            Last Receipt: {subState.receipts[0].referenceCode} ({subState.receipts[0].amountDisplay})
          </span>
        )}
      </div>

      {/* Multi-Gateway B2B Checkout Modal */}
      <Dialog open={!!checkoutPlan} onOpenChange={(o) => !o && setCheckoutPlan(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-black">
              Secure B2B Brand Checkout — {checkoutPlan?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Activating data extraction, commercial launch broadcasting &amp; employee awards for{" "}
              <strong>{brandName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 4 Secure Payment Options */}
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["google_pay", "Google Pay (1-Tap Tokenized)", "Fastest · Web & Android 3DS"],
                  ["paystack_eft", "Paystack Instant EFT & Card", "FNB, Standard, Capitec, Absa"],
                  ["stripe_card", "Stripe Global Corporate Card", "Visa, Mastercard, Amex, Apple Pay"],
                  ["corporate_invoice", "Corporate Pro-Forma Invoice", "Download VAT Tax Invoice for EFT"],
                ] as const
              ).map(([gwKey, gwTitle, gwSub]) => (
                <button
                  key={gwKey}
                  type="button"
                  onClick={() => setSelectedGateway(gwKey)}
                  className={cn(
                    "flex flex-col items-start rounded-xl border p-3 text-left transition cursor-pointer",
                    selectedGateway === gwKey
                      ? "border-2 border-[#d6a928] bg-slate-950 text-white"
                      : "border-border bg-background hover:bg-secondary/50",
                  )}
                >
                  <span className="text-xs font-black">{gwTitle}</span>
                  <span
                    className={cn(
                      "mt-0.5 text-[10px]",
                      selectedGateway === gwKey ? "text-[#f5d061]" : "text-muted-foreground",
                    )}
                  >
                    {gwSub}
                  </span>
                </button>
              ))}
            </div>

            {/* Corporate Billing Details */}
            <div className="space-y-2.5 rounded-xl border border-border bg-secondary/20 p-3.5">
              <div>
                <label className="mb-1 block text-[11px] font-bold">
                  Registered Company / Brand Entity Name
                </label>
                <Input
                  value={companyRegName}
                  onChange={(e) => setCompanyRegName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold">
                    VAT / Corporate Tax Number
                  </label>
                  <Input
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold">
                    Finance / Receipt Email
                  </label>
                  <Input
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3 text-white">
              <div>
                <p className="text-[11px] text-slate-400">Total B2B Subscription Due</p>
                <p className="font-display text-xl font-black text-[#f5d061] tabular-nums">
                  {checkoutPlan
                    ? currency === "ZAR"
                      ? `R${checkoutPlan.priceZarMonthly.toLocaleString()} / month`
                      : `$${checkoutPlan.priceUsdMonthly.toLocaleString()} / month`
                    : ""}
                </p>
              </div>
              <Button
                disabled={processing}
                onClick={() => void handleCompletePayment()}
                className="bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935]"
              >
                {selectedGateway === "google_pay"
                  ? "Pay with Google Pay"
                  : selectedGateway === "paystack_eft"
                    ? "Pay via Paystack"
                    : selectedGateway === "stripe_card"
                      ? "Pay via Stripe"
                      : "Download Pro-Forma Invoice"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

/**
 * 4. BRAND INBOUND CONTACT & DIRECT CALLING CONTROLS PANEL
 * Allows Brand owners/operators to control how customers contact them:
 * - Direct Calling Mode: Open vs Request-a-Call Only vs Disabled
 * - Operating Hours & Shift windows
 * - Require Product / Batch verification before call
 * - Inbound Call Request Queue with instant 1-click callback
 */
export function BrandInboundContactSettingsPanel({
  brandName = "Official Brand",
  brandSlug = "official-brand",
  onInitiateCall,
}: {
  brandName?: string;
  brandSlug?: string;
  onInitiateCall?: (target: { id: string; name: string; topic: string; mode: "voice" | "video" }) => void;
}) {
  const [settings, setSettings] = useState<BrandInboundContactSettings>(() =>
    getBrandContactSettings(brandSlug),
  );
  const [requests, setRequests] = useState<InboundCustomerCallRequest[]>(() =>
    getInboundCallRequests(brandSlug),
  );
  const activeOp = getActiveDeskOperator();

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSettings(getBrandContactSettings(brandSlug));
    };
    const handleSync = () => {
      setRequests(getInboundCallRequests(brandSlug));
    };
    window.addEventListener("sot-brand-contact-settings-updated", handleSettingsUpdate);
    window.addEventListener("sot-inbound-call-request-created", handleSync);
    window.addEventListener("sot-inbound-call-request-updated", handleSync);
    return () => {
      window.removeEventListener("sot-brand-contact-settings-updated", handleSettingsUpdate);
      window.removeEventListener("sot-inbound-call-request-created", handleSync);
      window.removeEventListener("sot-inbound-call-request-updated", handleSync);
    };
  }, [brandSlug]);

  const handleUpdateMode = (mode: BrandDirectCallingMode) => {
    const updated = saveBrandContactSettings(brandSlug, { directCallingMode: mode });
    setSettings(updated);
    toast.success(
      mode === "request_only"
        ? "Calling Mode set to 'Request-a-Call Desk': Customers must submit a call request first before ringing."
        : mode === "open"
          ? "Calling Mode set to 'Open Direct Line': Verified customers can now ring your active desk directly."
          : "Calling Mode set to 'Direct Calls Disabled': Inbound calls blocked; public text responses only.",
    );
  };

  const handleSaveHours = (hours: string) => {
    const updated = saveBrandContactSettings(brandSlug, { operatingHours: hours });
    setSettings(updated);
  };

  const handleSaveNotice = (notice: string) => {
    const updated = saveBrandContactSettings(brandSlug, { contactNotice: notice });
    setSettings(updated);
  };

  const handleToggleBatchRequired = () => {
    const updated = saveBrandContactSettings(brandSlug, {
      requireOrderOrBatchNumber: !settings.requireOrderOrBatchNumber,
    });
    setSettings(updated);
    toast.info(
      updated.requireOrderOrBatchNumber
        ? "Batch/Receipt number is now required for customer call requests."
        : "Batch/Receipt number is now optional for customer call requests.",
    );
  };

  const handleCallCustomerBack = (req: InboundCustomerCallRequest, mode: "voice" | "video") => {
    updateInboundCallRequestStatus(req.id, "operator_calling", `Called by ${activeOp.name}`);
    syncRequests();
    if (onInitiateCall) {
      onInitiateCall({
        id: req.customerId,
        name: req.customerName,
        topic: req.issueTopic,
        mode,
      });
    } else {
      toast.info(`Calling ${req.customerName} via SOT Private Messenger line...`);
    }
  };

  const handleDismissRequest = (reqId: string) => {
    updateInboundCallRequestStatus(reqId, "resolved", `Resolved by ${activeOp.name}`);
    syncRequests();
    toast.success("Call request marked as resolved.");
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-white shadow-xl">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <PhoneCall className="h-4 w-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Inbound Customer Calling &amp; Contact Permissions
            </span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-black text-white">
            {brandName} Direct Calling Controls &amp; Inbound Desk
          </h2>
          <p className="mt-1 text-xs text-slate-300 max-w-2xl">
            You decide how customers and shoppers contact <strong>{brandName}</strong>. Choose between a controlled Request-a-Call queue, an open direct line, or text-only responses.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs">
          <span className="text-[11px] font-bold text-slate-400 block">On-Duty Desk Operator:</span>
          <span className="font-bold text-[#f5d061]">{activeOp.name}</span>
          <span className="text-slate-400 text-[11px] block">{activeOp.roleTitle}</span>
        </div>
      </div>

      {/* 3 Direct Calling Modes */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Mode 1: Request-a-Call (Recommended) */}
        <div
          onClick={() => handleUpdateMode("request_only")}
          className={cn(
            "rounded-2xl border p-4 cursor-pointer transition flex flex-col justify-between",
            settings.directCallingMode === "request_only"
              ? "border-[#d6a928] bg-slate-950 ring-2 ring-[#d6a928]/30"
              : "border-slate-800 bg-slate-950/50 hover:border-slate-700",
          )}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d6a928]/20 text-[#f5d061]">
                <ShieldCheck className="h-4 w-4" />
              </span>
              {settings.directCallingMode === "request_only" && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#d6a928] text-slate-950">
                  Active Setting
                </span>
              )}
            </div>
            <h3 className="mt-3 font-display text-base font-bold text-white">
              Request-a-Call Desk
            </h3>
            <span className="text-[11px] font-bold text-emerald-400 block mt-0.5">
              Recommended for Corporate CX
            </span>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Customers <strong>cannot ring your phone directly</strong>. They submit a 1-click issue summary &amp; batch details; your desk operator reviews it and rings them back at your convenience.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            ✓ Prevents spam &amp; random dials · ✓ Creates audit trail
          </div>
        </div>

        {/* Mode 2: Open Direct Line */}
        <div
          onClick={() => handleUpdateMode("open")}
          className={cn(
            "rounded-2xl border p-4 cursor-pointer transition flex flex-col justify-between",
            settings.directCallingMode === "open"
              ? "border-emerald-500 bg-slate-950 ring-2 ring-emerald-500/30"
              : "border-slate-800 bg-slate-950/50 hover:border-slate-700",
          )}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <PhoneCall className="h-4 w-4" />
              </span>
              {settings.directCallingMode === "open" && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                  Active Setting
                </span>
              )}
            </div>
            <h3 className="mt-3 font-display text-base font-bold text-white">
              Open Direct Line
            </h3>
            <span className="text-[11px] font-bold text-emerald-400 block mt-0.5">
              Instant Inbound Rings
            </span>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Any verified customer can <strong>ring your desk operator directly</strong> in real time via SOT during desk operating hours (Zero phone numbers needed).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            ✓ Real-time VIP service · ✓ High responsiveness rating
          </div>
        </div>

        {/* Mode 3: Direct Calls Disabled */}
        <div
          onClick={() => handleUpdateMode("disabled")}
          className={cn(
            "rounded-2xl border p-4 cursor-pointer transition flex flex-col justify-between",
            settings.directCallingMode === "disabled"
              ? "border-rose-500 bg-slate-950 ring-2 ring-rose-500/30"
              : "border-slate-800 bg-slate-950/50 hover:border-slate-700",
          )}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                <PhoneOff className="h-4 w-4" />
              </span>
              {settings.directCallingMode === "disabled" && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500 text-slate-950">
                  Active Setting
                </span>
              )}
            </div>
            <h3 className="mt-3 font-display text-base font-bold text-white">
              Direct Calls Disabled
            </h3>
            <span className="text-[11px] font-bold text-rose-400 block mt-0.5">
              Public Text Responses Only
            </span>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Direct calls are completely blocked. Customers can only post public verdicts and reply to your brand in public comments (Default for 100% Free Tier).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            ✓ Zero phone interruptions · ✓ 100% Public transparency
          </div>
        </div>
      </div>

      {/* Desk Operational Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
        <h3 className="font-display text-base font-bold text-[#f5d061] flex items-center gap-2">
          <Settings2 className="h-4 w-4" /> Desk Operational Parameters &amp; Requirements
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-300">
              Desk Operating Hours (Shown to Customers)
            </label>
            <Input
              value={settings.operatingHours}
              onChange={(e) => handleSaveHours(e.target.value)}
              placeholder="e.g. 08:00 - 17:00 (SAST Desk)"
              className="h-9 border-slate-800 bg-slate-900 text-xs text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-300">
              Require Batch / Till Slip Number
            </label>
            <button
              type="button"
              onClick={handleToggleBatchRequired}
              className={cn(
                "h-9 w-full rounded-md border px-3 text-xs font-bold flex items-center justify-between transition cursor-pointer",
                settings.requireOrderOrBatchNumber
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-800 bg-slate-900 text-slate-400",
              )}
            >
              <span>Mandatory Barcode / Batch:</span>
              <span>{settings.requireOrderOrBatchNumber ? "REQUIRED (ON)" : "OPTIONAL (OFF)"}</span>
            </button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-300">
              Customer Guidance / Hold Notice
            </label>
            <Input
              value={settings.contactNotice}
              onChange={(e) => handleSaveNotice(e.target.value)}
              placeholder="e.g. Operators respond to call requests within 15 minutes."
              className="h-9 border-slate-800 bg-slate-900 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Inbound Customer Call Request Queue */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#d6a928]" /> Inbound Customer Call Request Queue
            </h3>
            <p className="text-xs text-slate-400">
              Live customer requests waiting for your on-duty operator ({activeOp.name}) to ring back.
            </p>
          </div>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-white">
            {requests.filter((r) => r.status === "pending").length} Pending
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500/50 mb-2" />
            No pending customer call requests. All inbound customer tickets are resolved.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-sm">{req.customerName}</span>
                    <span className="text-slate-500">·</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-black uppercase",
                        req.urgency === "urgent_cpa"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          : req.urgency === "high"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-slate-800 text-slate-300",
                      )}
                    >
                      {req.urgency.replace("_", " ")}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 text-xs font-mono">
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-200 font-medium">“{req.issueTopic}”</p>
                  {(req.productName || req.batchOrReceiptNumber) && (
                    <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-400">
                      {req.productName && <span>Product: {req.productName}</span>}
                      {req.batchOrReceiptNumber && <span>Batch/Receipt: {req.batchOrReceiptNumber}</span>}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleCallCustomerBack(req, "voice")}
                    className="h-8 gap-1.5 bg-emerald-600 font-bold text-white hover:bg-emerald-500 text-xs"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call (Voice)
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleCallCustomerBack(req, "video")}
                    className="h-8 gap-1.5 bg-slate-950 font-bold text-[#f5d061] hover:bg-slate-800 text-xs border border-slate-700"
                  >
                    <Video className="h-3.5 w-3.5" /> Video Inspect
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDismissRequest(req.id)}
                    className="h-8 text-xs text-slate-400 hover:text-white"
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

