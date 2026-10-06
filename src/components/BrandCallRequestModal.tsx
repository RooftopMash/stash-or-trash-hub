import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  PhoneCall,
  Video,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Send,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  getBrandContactSettings,
  getActiveDeskOperator,
  submitInboundCallRequest,
  type BrandInboundContactSettings,
} from "@/lib/brand-operators";
import { sendMessage } from "@/lib/messages";

interface BrandCallRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  brandSlug: string;
  prefilledProduct?: string;
  onRequestSubmitted?: () => void;
}

export function BrandCallRequestModal({
  open,
  onOpenChange,
  brandName,
  brandSlug,
  prefilledProduct = "",
  onRequestSubmitted,
}: BrandCallRequestModalProps) {
  const { user } = useAuth();
  const contactSettings = getBrandContactSettings(brandSlug);
  const activeOp = getActiveDeskOperator();

  const [issueTopic, setIssueTopic] = useState("");
  const [productName, setProductName] = useState(prefilledProduct);
  const [batchOrReceipt, setBatchOrReceipt] = useState("");
  const [requestedCallMode, setRequestedCallMode] = useState<"voice" | "video">("voice");
  const [urgency, setUrgency] = useState<"low" | "medium" | "high" | "urgent_cpa">("medium");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTopic.trim()) {
      toast.error("Please provide a short summary of the issue or product verdict.");
      return;
    }
    if (contactSettings.requireOrderOrBatchNumber && !batchOrReceipt.trim()) {
      toast.error("This brand requires a batch or receipt number before submitting a call request.");
      return;
    }

    setBusy(true);
    const customerDisplayName =
      user?.user_metadata?.full_name ||
      user?.email?.split("@")[0] ||
      `Customer ${user?.id ? user.id.slice(0, 6) : "Guest"}`;

    try {
      submitInboundCallRequest({
        brandSlug,
        brandName,
        customerId: user?.id || "guest-caller",
        customerName: customerDisplayName,
        issueTopic: issueTopic.trim(),
        productName: productName.trim() || undefined,
        batchOrReceiptNumber: batchOrReceipt.trim() || undefined,
        urgency,
        requestedCallMode,
      });

      // Send automated message in thread to brand owner
      if (user?.id) {
        try {
          await sendMessage({
            senderId: user.id,
            recipientId: `brand-${brandSlug}`,
            body: `📩 [SOT CALL REQUEST] ${customerDisplayName} requested a ${requestedCallMode === "video" ? "Video" : "Voice"} Call regarding: "${issueTopic.trim()}". (Urgency: ${urgency.toUpperCase()}). Please ring the customer back on SOT.`,
          });
        } catch {
          // non-blocking
        }
      }

      setSubmitted(true);
      toast.success(`Call request dispatched to ${brandName}'s desk operator!`);
      onRequestSubmitted?.();
    } catch {
      toast.error("Failed to submit call request. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setIssueTopic("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-slate-800 bg-slate-950 text-white p-6 rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d6a928]/20 text-[#f5d061]">
              <Building2 className="h-4 w-4" />
            </span>
            <div>
              <DialogTitle className="font-display text-lg font-black text-white">
                Request a Call from {brandName}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Messenger-Style Direct Resolution · Zero Phone Numbers Needed
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-display text-xl font-bold text-white">Call Request Logged!</h4>
              <p className="mt-1 text-xs text-slate-300 max-w-sm mx-auto">
                On-duty operator <strong>{activeOp.name}</strong> has received your request. You will receive an incoming private ring directly on SOT when they connect.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-left text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Clock className="h-3.5 w-3.5 text-[#d6a928]" /> Desk Hours: {contactSettings.operatingHours}
              </p>
              <p className="text-[11px]">Keep your SOT app open or notifications enabled to answer.</p>
            </div>
            <Button onClick={handleClose} className="w-full bg-[#d6a928] text-slate-950 font-bold hover:bg-[#e5b935]">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Operator on Duty & Brand Policy Notice */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-[#f5d061]">
                  <UserCheck className="h-3.5 w-3.5 text-[#d6a928]" /> On-Duty Operator:
                </span>
                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-400 font-bold">
                  Active Shift
                </Badge>
              </div>
              <p className="mt-1 font-semibold text-white">
                {activeOp.name} <span className="text-slate-400 font-normal">({activeOp.roleTitle})</span>
              </p>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                {contactSettings.contactNotice}
              </p>
            </div>

            {/* Issue Description */}
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-300">
                What would you like the brand to call you about? *
              </label>
              <Textarea
                value={issueTopic}
                onChange={(e) => setIssueTopic(e.target.value)}
                placeholder="e.g. Purchased product had damaged seal; need exchange or batch verification"
                rows={3}
                required
                className="border-slate-800 bg-slate-900 text-xs text-white"
              />
            </div>

            {/* Product & Batch Inputs */}
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-300">
                  Product Name (Optional)
                </label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. 500g Peri-Peri Sauce"
                  className="h-8 border-slate-800 bg-slate-900 text-xs text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-300">
                  Batch / Barcode / Receipt {contactSettings.requireOrderOrBatchNumber ? "*" : "(Optional)"}
                </label>
                <Input
                  value={batchOrReceipt}
                  onChange={(e) => setBatchOrReceipt(e.target.value)}
                  placeholder="e.g. #LOT-945 or Till Slip"
                  required={contactSettings.requireOrderOrBatchNumber}
                  className="h-8 border-slate-800 bg-slate-900 text-xs text-white"
                />
              </div>
            </div>

            {/* Preferred Call Mode & Urgency */}
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-300">
                  Preferred Call Mode
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRequestedCallMode("voice")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-1.5 text-xs font-bold transition",
                      requestedCallMode === "voice"
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                        : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white",
                    )}
                  >
                    <PhoneCall className="h-3 w-3" /> Voice
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestedCallMode("video")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-1.5 text-xs font-bold transition",
                      requestedCallMode === "video"
                        ? "border-[#d6a928] bg-[#d6a928]/20 text-[#f5d061]"
                        : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white",
                    )}
                  >
                    <Video className="h-3 w-3" /> Video Inspect
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-300">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="h-8 w-full rounded-xl border border-slate-800 bg-slate-900 px-2 text-xs font-semibold text-white outline-none"
                >
                  <option value="low">Low (General Inquiry)</option>
                  <option value="medium">Medium (Standard Issue)</option>
                  <option value="high">High (Product Defect / Return)</option>
                  <option value="urgent_cpa">🚨 Critical (CPA Pre-Escalation)</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={busy}
                className="w-full bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935] gap-1.5"
              >
                <Send className="h-4 w-4" /> Send Call Request to {brandName}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
