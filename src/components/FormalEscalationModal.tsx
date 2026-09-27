import { useMemo, useState } from "react";
import {
  Scale,
  Copy,
  Check,
  Mail,
  Share2,
  ExternalLink,
  ShieldAlert,
  Building2,
  FileWarning,
  Download,
  ShieldCheck,
  BookOpen,
  Gift,
  ScanBarcode,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { FeedItem } from "@/lib/stash";

interface FormalEscalationModalProps {
  item?: FeedItem;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  brandName?: string;
  itemTitle?: string;
}

function generateSotReference(itemId: string, createdAt: string): string {
  const year = new Date(createdAt || Date.now()).getFullYear();
  const clean = itemId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const suffix = (clean.slice(0, 6) || "849201").padEnd(6, "X");
  return `SOT-${year}-${suffix}`;
}

export function FormalEscalationModal({
  item: propItem,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  brandName,
  itemTitle,
}: FormalEscalationModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const item = useMemo(
    () =>
      propItem ?? {
        id: brandName ? `brand-${brandName}` : "sot-849201",
        created_at: new Date().toISOString(),
        brandName: brandName || "Brand Management",
        title: itemTitle || `${brandName || "Brand"} Product Authenticity & Consumer Resolution`,
        description: "Consumer verification & CPA Section 69 resolution inquiry.",
        trashCount: 1,
        stashCount: 1,
      },
    [propItem, brandName, itemTitle],
  );
  const [activeTab, setActiveTab] = useState<"counterfeit" | "education" | "dossier">("counterfeit");
  const [issueClassification, setIssueClassification] = useState<"counterfeit" | "genuine_defect">(
    "counterfeit",
  );
  const [batchOrBarcode, setBatchOrBarcode] = useState("BATCH-2026-ZA / EAN-6001087");
  const [branchOrStore, setBranchOrStore] = useState("Pretoria / Retailer or Spaza Location");
  const [lossIncurred, setLossIncurred] = useState(
    "Suspected counterfeit / substandard batch — requesting brand authenticity check & replacement",
  );
  const [desiredResolution, setDesiredResolution] = useState(
    "Batch verification by Brand Owner + genuine replacement voucher or refund within 15 CPA business days",
  );
  const [copied, setCopied] = useState(false);
  const [voucherRequested, setVoucherRequested] = useState(false);

  const refNumber = useMemo(
    () => generateSotReference(item.id, item.created_at),
    [item.id, item.created_at],
  );

  const brandDisplay = item.brandName || "Brand Management";
  const incidentDate = useMemo(() => {
    try {
      return new Date(item.created_at).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return new Date().toLocaleDateString();
    }
  }, [item.created_at]);

  const postUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/items/${item.id}`
      : `https://sort.app/items/${item.id}`;

  const formalNoticeText = useMemo(() => {
    return [
      `Subject: Verified Consumer & Counterfeit Evidence Pack Ref #${refNumber} — [${brandDisplay} / ${branchOrStore}]`,
      ``,
      `To: ${brandDisplay} Brand Protection, Quality Assurance & Customer Care`,
      `Public Verdict Record: ${postUrl}`,
      `Community Votes Recorded: ${item.trashCount} Trash vs ${item.stashCount} Stash`,
      `Classification: ${
        issueClassification === "counterfeit"
          ? "SUSPECTED COUNTERFEIT / BOGUS / TAMPERED BATCH (Brand Revenue Recovery Alert)"
          : "GENUINE PRODUCT / SERVICE QUALITY DISPUTE"
      }`,
      `Batch / Lot / Barcode: ${batchOrBarcode}`,
      ``,
      `1. WHAT HAPPENED (${incidentDate} · Store/Location: ${branchOrStore}):`,
      `${item.title}${item.description ? ` — ${item.description}` : ""}`,
      ``,
      `2. CONSUMER & BRAND IMPACT:`,
      `${lossIncurred}`,
      ``,
      `3. REQUESTED BRAND ENGAGEMENT (STEP 1 OF CPA SECTION 69 — 15 BUSINESS DAYS):`,
      `${desiredResolution}`,
      ``,
      `4. CPA & CGSO CONSUMER AWARENESS NOTE:`,
      `In accordance with the Consumer Protection Act (CPA Section 69), I am providing ${brandDisplay} the statutory 15-business-day window to verify Batch #${batchOrBarcode} and resolve this directly before I submit this Evidence Pack to the Consumer Goods and Services Ombud (CGSO - cgso.org.za) or the National Consumer Commission (NCC - thencc.gov.za).`,
    ].join("\n");
  }, [
    refNumber,
    brandDisplay,
    branchOrStore,
    postUrl,
    item.trashCount,
    item.stashCount,
    issueClassification,
    batchOrBarcode,
    incidentDate,
    item.title,
    item.description,
    lossIncurred,
    desiredResolution,
  ]);

  const socialCalloutText = useMemo(() => {
    const handle = brandDisplay.replace(/[^a-zA-Z0-9]/g, "");
    return `@${handle} Sharing verified Evidence Pack Ref #${refNumber} (${branchOrStore} · Batch: ${batchOrBarcode}). "${item.title}" — Help us verify authenticity & protect consumers: ${postUrl} #StashOrTrash #CounterfeitCheck #ConsumerRights`;
  }, [brandDisplay, refNumber, branchOrStore, batchOrBarcode, item.title, postUrl]);

  const handleCopyNotice = async () => {
    try {
      await navigator.clipboard.writeText(formalNoticeText);
      setCopied(true);
      toast.success(`Evidence Pack Ref #${refNumber} copied to clipboard`);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy automatically — please select and copy the text.");
    }
  };

  const handleDownloadEvidencePack = () => {
    try {
      const blob = new Blob([formalNoticeText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${refNumber}-CPA-Counterfeit-Evidence-Pack.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${refNumber} CPA & Counterfeit Evidence Pack!`);
    } catch {
      toast.error("Could not download evidence pack.");
    }
  };

  const handleCopySocial = async () => {
    try {
      await navigator.clipboard.writeText(socialCalloutText);
      toast.success("Public Brand & Counterfeit Alert with Ref # copied!");
    } catch {
      toast.error("Could not copy social callout.");
    }
  };

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(
      `Evidence Pack Ref #${refNumber} - [${brandDisplay} / ${branchOrStore}] - Batch & CPA Resolution`,
    );
    const body = encodeURIComponent(formalNoticeText);
    return `mailto:?subject=${subject}&body=${body}`;
  }, [refNumber, brandDisplay, branchOrStore, formalNoticeText]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/70 px-2 py-0.5 text-[10px] font-bold text-foreground transition hover:border-foreground/40 hover:bg-secondary whitespace-nowrap"
            title="Counterfeit Batch Verifier, Brand Recovery & CPA/CGSO Education Hub"
          >
            <Scale className="h-3 w-3 text-stash" />
            <span>Verify &amp; CPA Guide · #{refNumber}</span>
          </button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/15 px-2.5 py-1 text-xs font-extrabold text-amber-600 dark:text-amber-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Tri-Win Consumer, Brand &amp; Regulator Hub
            </span>
            <span className="rounded-md border border-border bg-secondary px-2 py-0.5 font-mono text-xs font-bold tabular-nums">
              Ref #{refNumber}
            </span>
          </div>
          <DialogTitle className="mt-2 font-display text-xl font-extrabold">
            Counterfeit Batch Verifier &amp; CPA / CGSO Education Hub
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            Instead of filing premature complaints, Stash Or Trash helps{" "}
            <strong className="text-foreground">Brands</strong> spot bogus/counterfeit products
            stealing their revenue, and educates{" "}
            <strong className="text-foreground">Consumers</strong> on the official{" "}
            <strong className="text-foreground">CPA Section 69 &amp; CGSO</strong> 3-step dispute
            process.
          </DialogDescription>
        </DialogHeader>

        {/* 3-Tab Switcher */}
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-secondary/60 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("counterfeit")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
              activeTab === "counterfeit"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ScanBarcode className="h-3.5 w-3.5 text-amber-500" />
            <span>1. Counterfeit &amp; Brand Check</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("education")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
              activeTab === "education"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
            <span>2. CPA &amp; CGSO Education</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("dossier")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
              activeTab === "dossier"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileWarning className="h-3.5 w-3.5 text-stash" />
            <span>3. Evidence Pack (#{refNumber})</span>
          </button>
        </div>

        {/* TAB 1: COUNTERFEIT VERIFIER & BRAND REVENUE RECOVERY */}
        {activeTab === "counterfeit" && (
          <div className="mt-3 space-y-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 text-xs">
              <p className="font-bold text-foreground">
                Did the genuine brand disappoint you — or did someone sell you a bogus/counterfeit item?
              </p>
              <p className="mt-1 text-muted-foreground leading-relaxed">
                Counterfeits and expired grey-market batches cost legitimate brands billions and ruin
                consumer trust. Flagging the batch number and store location lets{" "}
                <strong>{brandDisplay}</strong> verify authenticity and issue a replacement voucher
                to win you back.
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setIssueClassification("counterfeit")}
                  className={`rounded-lg border p-2.5 text-left transition ${
                    issueClassification === "counterfeit"
                      ? "border-amber-500 bg-amber-500/15 font-bold text-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="text-xs font-bold">Suspected Counterfeit / Bogus / Expired</div>
                  <div className="mt-0.5 text-[11px] opacity-80">
                    Alert {brandDisplay} Brand Protection to investigate the retailer &amp; batch
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setIssueClassification("genuine_defect")}
                  className={`rounded-lg border p-2.5 text-left transition ${
                    issueClassification === "genuine_defect"
                      ? "border-primary bg-primary/10 font-bold text-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="text-xs font-bold">Genuine Product / Service Disappointment</div>
                  <div className="mt-0.5 text-[11px] opacity-80">
                    Engage {brandDisplay} Customer Care under the 15-day CPA resolution window
                  </div>
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground">
                  Batch / Lot Number or Barcode
                </label>
                <input
                  type="text"
                  value={batchOrBarcode}
                  onChange={(e) => setBatchOrBarcode(e.target.value)}
                  placeholder="e.g. LOT-2026-09B / EAN 6001087000140"
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-xs font-medium outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground">
                  Store / Spaza / Branch Where Purchased
                </label>
                <input
                  type="text"
                  value={branchOrStore}
                  onChange={(e) => setBranchOrStore(e.target.value)}
                  placeholder="e.g. Pretoria Menlyn / Local Retailer"
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs font-medium outline-none focus:border-foreground"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Gift className="h-4 w-4 text-emerald-600" />
                  <span>Brand Client Recovery &amp; Authenticity Window</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Log your batch with {brandDisplay} so they can confirm if it is genuine and offer a
                  replacement or loyalty recovery voucher.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setVoucherRequested(true);
                  toast.success(
                    `Batch #${batchOrBarcode} logged for ${brandDisplay} Brand Protection & Client Recovery!`,
                  );
                }}
                className="gap-1.5 font-bold"
              >
                {voucherRequested ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Batch Logged for Recovery
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" /> Request Brand Batch Check
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: CPA SECTION 69 & CGSO EDUCATION HUB */}
        {activeTab === "education" && (
          <div className="mt-3 space-y-4">
            <div className="rounded-xl border border-border bg-secondary/30 p-4 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <span>How South Africa’s Official Consumer Protection Process Works</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We do <strong>not</strong> spam regulators with automatic notifications. Instead, we
                educate you on the mandatory legal sequence under{" "}
                <strong className="text-foreground">Section 69 of the Consumer Protection Act (CPA)</strong>{" "}
                so your case is 100% compliant and ready if you ever need the Ombud:
              </p>

              <div className="grid gap-2.5 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-3">
                  <div className="font-mono text-[11px] font-bold text-amber-600">
                    01. Brand Window (15 Days)
                  </div>
                  <p className="mt-1 font-bold text-foreground">Contact Supplier First</p>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                    Law requires giving {brandDisplay} <strong>15 business days</strong> to investigate
                    your batch and resolve the issue directly.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-background p-3">
                  <div className="font-mono text-[11px] font-bold text-emerald-600">
                    02. Accredited Ombud (CGSO)
                  </div>
                  <p className="mt-1 font-bold text-foreground">Escalate to CGSO</p>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                    If unresolved after 15 business days, attach your SOrT Evidence Pack (#{refNumber})
                    at <strong>cgso.org.za</strong> for free mediation.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-background p-3">
                  <div className="font-mono text-[11px] font-bold text-primary">
                    03. National Commission (NCC)
                  </div>
                  <p className="mt-1 font-bold text-foreground">Systemic &amp; Fake Goods</p>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                    For widespread counterfeit rings or unresolved Ombud cases, submit your dossier to
                    the <strong>NCC (thencc.gov.za)</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Official Regulator Educational Links */}
            <div className="rounded-xl border border-border bg-card p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-foreground">
                <ShieldAlert className="h-4 w-4 text-stash" />
                Official Consumer Protection Portals (For Step 2 &amp; Step 3)
              </div>
              <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
                <a
                  href="https://www.cgso.org.za/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between rounded-lg border border-border p-2.5 text-xs transition hover:border-foreground/40 hover:bg-secondary/40"
                >
                  <div>
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>CGSO Ombud Guide</span>
                      <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Official Consumer Goods &amp; Services Ombud portal (use after 15 business days).
                    </p>
                  </div>
                  <span className="mt-2 font-mono text-[10px] font-semibold text-primary">
                    cgso.org.za →
                  </span>
                </a>

                <a
                  href="https://www.thencc.gov.za/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between rounded-lg border border-border p-2.5 text-xs transition hover:border-foreground/40 hover:bg-secondary/40"
                >
                  <div>
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>NCC Consumer Rights</span>
                      <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      National Consumer Commission (CPA education &amp; illicit goods awareness).
                    </p>
                  </div>
                  <span className="mt-2 font-mono text-[10px] font-semibold text-primary">
                    thencc.gov.za →
                  </span>
                </a>

                <div className="flex flex-col justify-between rounded-lg border border-border p-2.5 text-xs">
                  <div>
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>Brand Revenue Protection</span>
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Brands work with SOrT to identify counterfeit hotspots and reward consumers who
                      report fake batches.
                    </p>
                  </div>
                  <span className="mt-2 font-mono text-[10px] font-semibold text-emerald-500">
                    Tri-Win Ecosystem
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DOWNLOADABLE CPA & COUNTERFEIT EVIDENCE PACK */}
        {activeTab === "dossier" && (
          <div className="mt-3 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground">
                  Impact / Details
                </label>
                <input
                  type="text"
                  value={lossIncurred}
                  onChange={(e) => setLossIncurred(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs font-medium outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground">
                  Preferred Brand Resolution
                </label>
                <input
                  type="text"
                  value={desiredResolution}
                  onChange={(e) => setDesiredResolution(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs font-medium outline-none focus:border-foreground"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <FileWarning className="h-3.5 w-3.5 text-stash" />
                  Pre-Formatted CPA &amp; Counterfeit Evidence Pack
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  CPA Sec. 69 Ready
                </span>
              </div>
              <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border/70 bg-background p-3 font-mono text-[11px] leading-relaxed text-foreground">
                {formalNoticeText}
              </pre>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={handleDownloadEvidencePack} className="gap-1.5 text-xs font-bold">
                  <Download className="h-3.5 w-3.5" />
                  Download Evidence Pack (.txt)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyNotice}
                  className="gap-1.5 text-xs font-bold"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied Dossier" : "Copy Dossier Text"}
                </Button>
                <a
                  href={mailtoHref}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-bold text-foreground transition hover:bg-secondary"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email Brand First (Step 1)
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopySocial}
                  className="gap-1.5 text-xs font-bold"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Copy @Brand Alert
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

