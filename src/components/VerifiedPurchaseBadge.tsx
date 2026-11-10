import { useState } from "react";
import { BadgeCheck, FileText, CheckCircle2, ShieldCheck, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { ReceiptVerificationData } from "@/lib/ai-services";

export function VerifiedPurchaseBadge({
  receiptData,
  className,
}: {
  receiptData: ReceiptVerificationData | null | undefined;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!receiptData || receiptData.status !== "VERIFIED_PURCHASE") {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={`inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors shadow-xs ${className || ""}`}
        title="Verified Consumer Proof — Click to inspect POS receipt verification"
      >
        <BadgeCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/20" />
        <span>Verified Purchase</span>
        {receiptData.totalAmount && (
          <span className="text-[10px] opacity-80">· {receiptData.totalAmount}</span>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-6 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-widest">
                SOT Forensic Anti-Fake Audit
              </span>
            </div>
            <DialogTitle className="mt-1 text-xl font-black">
              Verified Purchase Proof
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              This verdict was verified by SOT AI Proof Authenticator against genuine retail proof.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3 rounded-xl border border-border bg-secondary/40 p-4 text-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs text-muted-foreground">Merchant / Retailer</span>
              <span className="font-bold text-foreground">
                {receiptData.storeName || "Authorized Merchant Point"}
              </span>
            </div>

            {receiptData.purchaseDate && (
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs text-muted-foreground">Transaction Date</span>
                <span className="font-medium text-foreground">{receiptData.purchaseDate}</span>
              </div>
            )}

            {receiptData.totalAmount && (
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs text-muted-foreground">Verified Total</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {receiptData.totalAmount}
                </span>
              </div>
            )}

            {receiptData.itemsDetected && receiptData.itemsDetected.length > 0 && (
              <div className="border-b border-border/60 pb-2">
                <span className="text-xs text-muted-foreground">Recognized Item(s):</span>
                <ul className="mt-1.5 space-y-1">
                  {receiptData.itemsDetected.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-xs font-medium">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">Authenticity Score</span>
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/30">
                {receiptData.authenticityScore}/100 Verified
              </Badge>
            </div>
          </div>

          <div className="mt-2 rounded-lg bg-muted/60 p-2.5 text-[11px] text-muted-foreground font-mono break-all flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <span>Audit Ref: {receiptData.verificationHash}</span>
          </div>

          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            SOT guarantees review integrity by eliminating competitor bot attacks and fabricated verdicts.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
