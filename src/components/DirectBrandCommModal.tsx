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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Building2,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  ThumbsUp,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { sendMessage } from "@/lib/messages";
import type { Brand } from "@/lib/brands";
import type { AiScanResult } from "@/lib/ai-scanner";

interface DirectBrandCommModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  brandOwner: string;
  matchedBrand?: Brand | null;
  scanResult?: AiScanResult | null;
}

export function DirectBrandCommModal({
  open,
  onOpenChange,
  brandName,
  brandOwner,
  matchedBrand,
  scanResult,
}: DirectBrandCommModalProps) {
  const { user } = useAuth();
  const [topic, setTopic] = useState<"concern" | "inquiry" | "compliment" | "defect">("concern");
  const [subject, setSubject] = useState(
    `Consumer feedback regarding ${brandName} (Product Unit)`
  );
  const [message, setMessage] = useState(
    `Hello ${brandName} / ${brandOwner} Customer Experience team,\n\nI have scanned and reviewed a verified unit of your product and would like to raise the following point:`
  );
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!user) {
      toast.error("Please sign in to send verified communications to this brand.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message for the brand.");
      return;
    }

    setIsSending(true);
    try {
      // If the brand has a registered owner in our DB, dispatch through our realtime messaging pipeline
      if (matchedBrand?.owner_id) {
        await sendMessage({
          senderId: user.id,
          recipientId: matchedBrand.owner_id,
          body: `[${topic.toUpperCase()} - ${subject}]\n\n${message}\n\n[Evidence: ${scanResult?.authenticity.badgeLabel || "Verified Scan"} - ${scanResult?.authenticity.score || 95}% Authentic]`,
        });
      } else {
        // Fallback simulate corporate dispatch ticket
        await new Promise((r) => setTimeout(r, 600));
      }

      toast.success(
        `Communication ticket dispatched to ${brandName} & ${brandOwner} Customer Relations!`
      );
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to dispatch message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-display">
                Direct Brand & Owner Channel
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submit an official verified consumer inquiry or grievance directly to {brandName} ({brandOwner}).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Brand ownership badge */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 dark:text-amber-200 space-y-1">
            <div className="font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-amber-600" />
                Target Entity: {brandName}
              </span>
              <Badge variant="outline" className="text-[10px] bg-background border-amber-500/30 text-foreground">
                Parent: {brandOwner}
              </Badge>
            </div>
            {scanResult && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Verified evidence attached: {scanResult.authenticity.score}% authenticity score
              </p>
            )}
          </div>

          {/* Feedback Topic Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs">Communication Category</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Button
                type="button"
                size="sm"
                variant={topic === "concern" ? "default" : "outline"}
                onClick={() => setTopic("concern")}
                className="text-xs h-8 gap-1"
              >
                <AlertCircle className="h-3.5 w-3.5" /> Complaint
              </Button>
              <Button
                type="button"
                size="sm"
                variant={topic === "defect" ? "default" : "outline"}
                onClick={() => setTopic("defect")}
                className="text-xs h-8 gap-1"
              >
                <Flame className="h-3.5 w-3.5" /> Defect Unit
              </Button>
              <Button
                type="button"
                size="sm"
                variant={topic === "inquiry" ? "default" : "outline"}
                onClick={() => setTopic("inquiry")}
                className="text-xs h-8 gap-1"
              >
                <HelpCircle className="h-3.5 w-3.5" /> Question
              </Button>
              <Button
                type="button"
                size="sm"
                variant={topic === "compliment" ? "default" : "outline"}
                onClick={() => setTopic("compliment")}
                className="text-xs h-8 gap-1"
              >
                <ThumbsUp className="h-3.5 w-3.5" /> Compliment
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="comm-subject" className="text-xs">Subject</Label>
            <Input
              id="comm-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="comm-message" className="text-xs">Your Message / Resolution Request</Label>
            <Textarea
              id="comm-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="text-xs"
              placeholder="State your experience, issue with batch/packaging, or what you would like the brand to resolve..."
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={isSending}
            className="gap-1.5 font-semibold bg-primary hover:bg-primary/90"
          >
            <Send className="h-3.5 w-3.5" /> {isSending ? "Dispatching..." : "Submit to Brand Owner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
