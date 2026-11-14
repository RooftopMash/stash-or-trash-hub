import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Globe,
  KeyRound,
  Lock,
  MailCheck,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { setRegisteredBrandIdentity } from "@/lib/brand-operators";
import type { Brand } from "@/lib/brands";
import {
  confirmBrandDomainVerificationCode,
  evaluateBrandDomainMatch,
  extractRegistrableDomain,
  initiateBrandDomainClaim,
  type LocalBrandClaimRecord,
} from "@/lib/brand-domain-verification";
import { cn } from "@/lib/utils";

interface BrandOwnershipClaimModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand;
  onClaimCompleted?: () => void;
}

export function BrandOwnershipClaimModal({
  open,
  onOpenChange,
  brand,
  onClaimCompleted,
}: BrandOwnershipClaimModalProps) {
  const { user } = useAuth();
  const { setPersona } = useRoles();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [corpEmail, setCorpEmail] = useState(user?.email ?? "");
  const [roleTitle, setRoleTitle] = useState("Head of Brand & Customer Experience");
  const [message, setMessage] = useState("");
  const [websiteDraft, setWebsiteDraft] = useState(brand.website ?? "");
  const [busy, setBusy] = useState(false);

  const [pendingClaim, setPendingClaim] = useState<LocalBrandClaimRecord | null>(null);
  const [previewChallengeCode, setPreviewChallengeCode] = useState<string | null>(null);
  const [enteredCode, setEnteredCode] = useState("");
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setCorpEmail((prev) => prev || user?.email || "");
      setWebsiteDraft(brand.website ?? "");
      setPendingClaim(null);
      setPreviewChallengeCode(null);
      setEnteredCode("");
      setVerifiedSuccess(false);
    }
  }, [open, brand.id, brand.website, user?.email]);

  const effectiveWebsite = brand.website || websiteDraft.trim() || null;
  const detectedDomain = useMemo(
    () => extractRegistrableDomain(brand.website || websiteDraft),
    [brand.website, websiteDraft],
  );

  const evaluation = useMemo(
    () => evaluateBrandDomainMatch(brand.website || (brand.website ? "" : websiteDraft), corpEmail),
    [brand.website, websiteDraft, corpEmail],
  );

  const handleInitiateClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please sign in first to claim & verify corporate brand ownership.");
      onOpenChange(false);
      navigate({ to: "/auth", search: { redirect: `/brands/${brand.slug}` } });
      return;
    }

    setBusy(true);
    try {
      const res = await initiateBrandDomainClaim({
        brand,
        claimantUid: user.id,
        claimantEmail: corpEmail,
        roleTitle,
        message,
        websiteOverride: !brand.website ? websiteDraft.trim() || undefined : undefined,
      });

      if (res.instantVerified) {
        setVerifiedSuccess(true);
        setRegisteredBrandIdentity({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          category: brand.category || "Consumer Brand",
          country: brand.country || "ZA",
          website: effectiveWebsite || "",
          ownerEmail: res.claim.claimantEmail,
          verified: true,
          trust_score: brand.trust_score || 78,
        });
        await queryClient.invalidateQueries({ queryKey: ["brands"] });
        await queryClient.invalidateQueries({ queryKey: ["brand", brand.slug] });
        toast.success(`Ownership verified via @${res.evaluation.officialDomain}!`);
        onClaimCompleted?.();
      } else if (res.evaluation.canAutoVerifyDomain && res.challengeCode) {
        setPendingClaim(res.claim);
        setPreviewChallengeCode(res.challengeCode);
        toast.success(`Domain matched @${res.evaluation.officialDomain}. Enter verification code to complete ownership.`);
      } else {
        setPendingClaim(res.claim);
        toast.info("Submitted for manual admin ownership review because email domain did not match automatically.");
        await queryClient.invalidateQueries({ queryKey: ["pending-verifications"] });
        onClaimCompleted?.();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit ownership claim.");
    } finally {
      setBusy(false);
    }
  };

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !pendingClaim) return;
    setBusy(true);
    try {
      const verified = await confirmBrandDomainVerificationCode({
        claimId: pendingClaim.id,
        brand,
        enteredCode,
        claimantUid: user.id,
      });
      setVerifiedSuccess(true);
      setRegisteredBrandIdentity({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        category: brand.category || "Consumer Brand",
        country: brand.country || "ZA",
        website: verified.brandWebsite || brand.website || "",
        ownerEmail: verified.claimantEmail,
        verified: true,
        trust_score: brand.trust_score || 78,
      });
      await queryClient.invalidateQueries({ queryKey: ["brands"] });
      await queryClient.invalidateQueries({ queryKey: ["brand", brand.slug] });
      toast.success(`Official ownership of ${brand.name} verified & activated!`);
      onClaimCompleted?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Code verification failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl border border-border bg-card p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#b88914]">
            <ShieldCheck className="h-4 w-4 text-[#d6a928]" />
            <span>Auto-Sourced Brand Ownership &amp; Domain Email Verification</span>
          </div>
          <DialogTitle className="font-display text-xl font-black">
            Claim Official Ownership of{" "}
            <span translate="no" className="notranslate">
              {brand.name}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            Auto-sourced brand profiles can only be claimed instantly when your corporate email domain matches the brand&apos;s official website domain.
          </DialogDescription>
        </DialogHeader>

        {verifiedSuccess ? (
          <div className="space-y-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-sm">
            <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-display text-base font-black">
                  Domain Ownership Verified &amp; Claimed!
                </p>
                <p className="text-xs opacity-90">
                  <span translate="no" className="notranslate font-bold">{brand.name}</span> is now bound to{" "}
                  <span className="font-mono font-bold">{corpEmail}</span>.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You can now publish official New Releases, validate authentic batches, review C2B innovation pitches, and launch B2C events from your dedicated Brand Command Suite.
            </p>
            <div className="flex flex-wrap justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Stay on Brand Page
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setPersona("brand_owner");
                  onOpenChange(false);
                  navigate({ to: "/dashboard" });
                }}
                className="gap-1.5 bg-slate-950 font-bold text-[#f5d061] hover:bg-slate-900"
              >
                <Building2 className="h-4 w-4 text-[#d6a928]" />
                Open Brand Command Suite
              </Button>
            </div>
          </div>
        ) : pendingClaim && pendingClaim.status === "code_sent" ? (
          <form onSubmit={handleConfirmCode} className="space-y-4">
            <div className="rounded-xl border border-[#d6a928]/50 bg-[#d6a928]/10 p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-extrabold text-foreground">
                <MailCheck className="h-4 w-4 text-[#b88914]" />
                <span>Corporate Domain Match Confirmed: @{pendingClaim.officialDomain}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Enter the 6-digit domain verification code issued for{" "}
                <strong className="font-mono text-foreground">{pendingClaim.claimantEmail}</strong> to lock ownership to your account.
              </p>
              {previewChallengeCode && (
                <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs">
                  <span className="text-muted-foreground">Verification Challenge Token:</span>
                  <span className="font-black tracking-[0.2em] text-foreground select-all">
                    {previewChallengeCode}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-[#d6a928]" />
                Enter 6-Digit Verification Code
              </label>
              <Input
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                placeholder="e.g. 482910"
                maxLength={6}
                className="font-mono text-center text-lg tracking-[0.35em] font-bold"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPendingClaim(null)}
              >
                Change Email
              </Button>
              <Button
                type="submit"
                disabled={busy}
                className="gap-1.5 bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935]"
              >
                <BadgeCheck className="h-4 w-4" />
                {busy ? "Verifying..." : "Verify Domain & Claim Brand"}
              </Button>
            </div>
          </form>
        ) : pendingClaim && pendingClaim.status === "pending_review" ? (
          <div className="space-y-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
              <div className="space-y-1">
                <p className="font-display text-sm font-black text-foreground">
                  Manual Ownership Review Queued
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Because <strong className="font-mono">{pendingClaim.claimantEmail}</strong> does not automatically match{" "}
                  <strong className="font-mono">{pendingClaim.officialDomain || "an official domain on file"}</strong>, your claim has been routed to SOrT Brand Verification Administrators to safeguard authenticity.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInitiateClaim} className="space-y-4">
            {/* Official Domain Record */}
            <div className="rounded-xl border border-border bg-secondary/40 p-3.5 text-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-primary" />
                  Official Sourced Domain:
                </span>
                <span className="font-mono font-extrabold text-foreground">
                  {detectedDomain ?? "Not yet recorded"}
                </span>
              </div>
              {!brand.website && (
                <div className="pt-1">
                  <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                    Official Company Website URL (Required for Admin Review)
                  </label>
                  <Input
                    value={websiteDraft}
                    onChange={(e) => setWebsiteDraft(e.target.value)}
                    placeholder="https://www.yourbrand.com"
                    className="h-8 text-xs"
                  />
                </div>
              )}
            </div>

            {/* Corporate Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Official Corporate Email Address
              </label>
              <Input
                type="email"
                value={corpEmail}
                onChange={(e) => setCorpEmail(e.target.value)}
                placeholder={detectedDomain ? `cx-lead@${detectedDomain}` : "you@yourcompany.com"}
                required
              />
            </div>

            {/* Live Domain Match Status Feedback */}
            <div
              className={cn(
                "rounded-xl border p-3 text-xs flex items-start gap-2.5",
                evaluation.canAutoVerifyDomain
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                  : evaluation.status === "invalid_email"
                    ? "border-border bg-secondary/30 text-muted-foreground"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-200",
              )}
            >
              {evaluation.canAutoVerifyDomain ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <p className="font-bold">{evaluation.headline}</p>
                <p className="text-[11px] opacity-85 leading-relaxed">{evaluation.explanation}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Corporate Role / Title</label>
                <Input
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Head of Brand Protection"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Signed-In Account</label>
                <div className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2.5 text-xs text-muted-foreground truncate">
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{user?.email || "Sign in required"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Verification Context (Optional)
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Authorized brand director / agency proof or official registration details..."
                className="min-h-16 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={busy}
                className={cn(
                  "gap-1.5 font-black",
                  evaluation.canAutoVerifyDomain
                    ? "bg-[#d6a928] text-slate-950 hover:bg-[#e5b935]"
                    : "bg-slate-950 text-white hover:bg-slate-900",
                )}
              >
                <Sparkles className="h-4 w-4" />
                {!user
                  ? "Sign In to Verify Ownership"
                  : evaluation.canAutoVerifyDomain
                    ? "Send Domain Verification Code"
                    : "Submit for Manual Admin Review"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
