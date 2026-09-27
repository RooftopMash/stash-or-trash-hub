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
  item: FeedItem;
}

function generateSotReference(itemId: string, createdAt: string): string {
  const year = new Date(createdAt || Date.now()).getFullYear();
  const clean = itemId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const suffix = (clean.slice(0, 6) || "849201").padEnd(6, "X");
  return `SOT-${year}-${suffix}`;
}

export function FormalEscalationModal({ item }: FormalEscalationModalProps) {
  const [open, setOpen] = useState(false);
  const [branchOrStore, setBranchOrStore] = useState("Pretoria / Head Office");
  const [lossIncurred, setLossIncurred] = useState(
    "Financial loss, defective product/service, and wasted time",
  );
  const [desiredResolution, setDesiredResolution] = useState(
    "Full refund, replacement, or written executive resolution within 7 business days",
  );
  const [copied, setCopied] = useState(false);

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
      `Subject: Formal Complaint Ref #${refNumber} — [${brandDisplay} / ${branchOrStore}] — Escalation to Management`,
      ``,
      `To: ${brandDisplay} Head Office / Customer Care & Executive Escalations`,
      `Public Verdict Record: ${postUrl}`,
      `Community Votes Recorded: ${item.trashCount} Trash vs ${item.stashCount} Stash`,
      ``,
      `1. WHAT HAPPENED (${incidentDate} · Branch/Location: ${branchOrStore}):`,
      `${item.title}${item.description ? ` — ${item.description}` : ""}`,
      ``,
      `2. LOSS / IMPACT INCURRED:`,
      `${lossIncurred}`,
      ``,
      `3. REQUIRED RESOLUTION (WITHIN 7 BUSINESS DAYS):`,
      `${desiredResolution}`,
      ``,
      `4. REGULATORY ESCALATION NOTICE:`,
      `Please acknowledge receipt of Formal Complaint Ref #${refNumber}. If this matter remains unresolved within 7 business days, I will formally escalate this dossier to the Consumer Goods and Services Ombud (CGSO - cgso.org.za) and the National Consumer Commission (NCC - thencc.gov.za) in terms of Section 69 of the Consumer Protection Act (CPA), where a formal response is legally mandated within 15 business days.`,
    ].join("\n");
  }, [
    refNumber,
    brandDisplay,
    branchOrStore,
    postUrl,
    item.trashCount,
    item.stashCount,
    incidentDate,
    item.title,
    item.description,
    lossIncurred,
    desiredResolution,
  ]);

  const socialCalloutText = useMemo(() => {
    const handle = brandDisplay.replace(/[^a-zA-Z0-9]/g, "");
    return `@${handle} Still awaiting executive resolution on Formal Complaint Ref #${refNumber} (${branchOrStore}). "${item.title}" — Public community verdict (${item.trashCount} Trashed): ${postUrl} #StashOrTrash #ConsumerRights #CGSO`;
  }, [brandDisplay, refNumber, branchOrStore, item.title, item.trashCount, postUrl]);

  const handleCopyNotice = async () => {
    try {
      await navigator.clipboard.writeText(formalNoticeText);
      setCopied(true);
      toast.success(`Formal Complaint Ref #${refNumber} copied to clipboard`);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy automatically — please select and copy the text.");
    }
  };

  const handleCopySocial = async () => {
    try {
      await navigator.clipboard.writeText(socialCalloutText);
      toast.success("Public X / Social callout with Ref # copied!");
    } catch {
      toast.error("Could not copy social callout.");
    }
  };

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(
      `Formal Complaint Ref #${refNumber} - [${brandDisplay} / ${branchOrStore}] - Escalation to Management`,
    );
    const body = encodeURIComponent(formalNoticeText);
    return `mailto:?subject=${subject}&body=${body}`;
  }, [refNumber, brandDisplay, branchOrStore, formalNoticeText]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/70 px-2.5 py-0.5 text-[10px] font-bold text-foreground transition hover:border-foreground/40 hover:bg-secondary"
          title="Generate Formal Complaint Ref # & CPA Section 69 / CGSO Escalation Notice"
        >
          <Scale className="h-3 w-3 text-stash" />
          <span>Escalate · Ref #{refNumber}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-extrabold text-amber-600 dark:text-amber-400">
              <Scale className="h-3.5 w-3.5" />
              CPA Section 69 & CGSO Escalation Engine
            </span>
            <span className="rounded-md border border-border bg-secondary px-2 py-0.5 font-mono text-xs font-bold">
              Ref #{refNumber}
            </span>
          </div>
          <DialogTitle className="mt-2 font-display text-xl font-extrabold">
            Formal Brand Owner & Regulator Escalation Dossier
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            Brands ignore vague complaints, but act fast on structured reference numbers, branch
            details, and formal notice of escalation to the{" "}
            <strong className="text-foreground">
              Consumer Goods & Services Ombud (CGSO)
            </strong>{" "}
            and <strong className="text-foreground">National Consumer Commission (NCC)</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 space-y-4">
          {/* Structured CPA inputs */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Branch / Store / Order #
              </label>
              <input
                type="text"
                value={branchOrStore}
                onChange={(e) => setBranchOrStore(e.target.value)}
                placeholder="e.g. Pretoria Menlyn Branch / Order #4021"
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs font-medium outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                What You Lost (Time, Money, Product)
              </label>
              <input
                type="text"
                value={lossIncurred}
                onChange={(e) => setLossIncurred(e.target.value)}
                placeholder="e.g. R1,450 paid for defective item + 2 weeks delay"
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs font-medium outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Required Resolution (7-Day Deadline)
            </label>
            <input
              type="text"
              value={desiredResolution}
              onChange={(e) => setDesiredResolution(e.target.value)}
              placeholder="e.g. Full refund or replacement within 7 business days"
              className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs font-medium outline-none focus:border-foreground"
            />
          </div>

          {/* Generated Formal Notice Preview */}
          <div className="rounded-xl border border-border bg-secondary/40 p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                <FileWarning className="h-3.5 w-3.5 text-stash" />
                Formal Head Office & Executive Notice
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                CPA Act Sec. 69 Compliant
              </span>
            </div>
            <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border/70 bg-background p-3 font-mono text-[11px] leading-relaxed text-foreground">
              {formalNoticeText}
            </pre>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={handleCopyNotice} className="gap-1.5 text-xs font-bold">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied Formal Dossier" : "Copy Formal Notice"}
              </Button>
              <a
                href={mailtoHref}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-bold text-foreground transition hover:bg-secondary"
              >
                <Mail className="h-3.5 w-3.5" />
                Email Head Office
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySocial}
                className="gap-1.5 text-xs font-bold"
              >
                <Share2 className="h-3.5 w-3.5" />
                Copy @Brand X / LinkedIn Tag
              </Button>
            </div>
          </div>

          {/* Official Regulators Who Force a Response */}
          <div className="rounded-xl border border-border bg-card p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-foreground">
              <ShieldAlert className="h-4 w-4 text-trash" />
              Official Regulators That Force Brands to Respond (15-Day Mandate)
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
                    <span>CGSO Ombud</span>
                    <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Retail, food & services. Free ombud — brands must respond within 15 days.
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
                    <span>NCC (Pretoria)</span>
                    <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    National Consumer Commission (Sunnyside, Pretoria · 012 428 7000) for CPA violations.
                  </p>
                </div>
                <span className="mt-2 font-mono text-[10px] font-semibold text-primary">
                  thencc.gov.za →
                </span>
              </a>

              <div className="flex flex-col justify-between rounded-lg border border-border p-2.5 text-xs">
                <div>
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>Head Office & CEO</span>
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Attach your SOrT Ref #{refNumber} when tagging executives on LinkedIn, X, or Google Reviews.
                  </p>
                </div>
                <span className="mt-2 font-mono text-[10px] font-semibold text-emerald-500">
                  Verified Public Trail
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
