import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { ProductAuthenticityCameraScanner } from "@/components/ProductAuthenticityCameraScanner";
import { SubmitDialog } from "@/components/SubmitDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Scan,
  ShieldCheck,
  Building2,
  Sparkles,
  QrCode,
  Camera,
  CheckCircle2,
  FileCheck,
  Search,
  ExternalLink,
  Tag,
  AlertTriangle,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import type { AiScanResult } from "@/lib/ai-scanner";

export const Route = createFileRoute("/scan")({
  component: ScanPage,
});

function ScanPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [prefilledPost, setPrefilledPost] = useState<{
    brandName: string;
    brandOwner: string;
    productName: string;
    category: string;
    matchedBrandId?: string;
    file?: File | null;
    scanResult: AiScanResult;
  } | null>(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const handleApplyToPost = (params: {
    brandName: string;
    brandOwner: string;
    productName: string;
    category: string;
    matchedBrandId?: string;
    file?: File | null;
    scanResult: AiScanResult;
  }) => {
    setPrefilledPost(params);
    setSubmitDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" /> {t("scanner.badge", { defaultValue: "AI Product & Authenticity Barometer" })}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight">
            {t("scanner.title", { defaultValue: "Scan Product Barcodes & Logos to Verify Authenticity" })}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            {t("scanner.subtitle", { defaultValue: "Point your camera at any product packaging, barcode, luxury logo, or care tag. Instantly trace corporate brand owner and verify whether the product is genuine or a fake replica." })}
          </p>
        </div>

        {/* Embedded Interactive Camera Scanner Component */}
        <ProductAuthenticityCameraScanner
          standalone
          onApplyToPost={handleApplyToPost}
        />

        {/* Fashion & Industry Legitimacy Section */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
              <ShoppingBag className="h-4 w-4" /> {t("scanner.fashionTitle", { defaultValue: "Fashion & Retail Anti-Counterfeit Verification" })}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display">
              {t("scanner.fashionHeading", { defaultValue: "Helping Fashion & Brands Track Sales and Confirm Authenticity" })}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t("scanner.fashionDescription", { defaultValue: "Counterfeiting costs the global economy over $500 billion annually. Stash Or Trash helps consumers and brands verify authentic ownership in seconds." })}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <QrCode className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm">{t("scanner.gs1Title", { defaultValue: "GS1 GTIN & Barcode Checksum" })}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("scanner.gs1Desc", { defaultValue: "Validates manufacturing origin against global GS1 checksums and retail registries." })}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Tag className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm">{t("scanner.opticalTitle", { defaultValue: "Optical Brand Mark & Typography" })}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("scanner.opticalDesc", { defaultValue: "Neural inspection of kerning, serifs, print registration, and embossed packaging hallmarks." })}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm">{t("scanner.tamperTitle", { defaultValue: "Tamper & Media Forensics" })}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("scanner.tamperDesc", { defaultValue: "Detects synthetic AI media generation, Photoshop manipulation, spliced labels, and altered video clips." })}
              </p>
            </div>
          </div>

          {/* PR & Brand Owner Verification Portal */}
          <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> {t("scanner.prPortalTitle", { defaultValue: "Brand PR & Client Verification Dossier" })}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("scanner.prPortalDesc", { defaultValue: "Brand PR Officers and clients can verify authentic batches, audit media integrity, and issue official brand certificates." })}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground pt-1">
              <div className="space-y-1">
                <span className="font-semibold text-foreground">1. Corporate Brand Lineage & Registry:</span>
                <p>Confirms corporate parent company, official headquarters, and authorized retail distribution channels.</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-foreground">2. Non-Tampering Video & Image Audit:</span>
                <p>Verifies physical lighting vectors, sensor grain, text consistency, and flags synthetic AI manipulation.</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-foreground">3. Step-by-Step Client Verification:</span>
                <p>Provides clients with exact physical inspection cues (laser-etched codes, stitching density, bottle seals).</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-foreground">4. Downloadable PR Audit Dossier:</span>
                <p>Generates an official tamper-free certificate to share with PR teams, retail partners, and customer service.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-xl border border-border bg-card/60 space-y-2">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Instant Brand Owner Mapping</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Find out who actually owns the product you're buying (e.g. Mondelēz owns Oreo; Unilever owns Ben & Jerry's; Kering owns Gucci). No manual corporate searches required.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card/60 space-y-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">AI Legitimacy & Deepfake Shield</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Forensic inspection detects AI-generated renders, synthetic diffusion artifacts, and Photoshop manipulation to ensure all review evidence is 100% genuine.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card/60 space-y-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Brand Directory Integration</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Directly cross-reference identified brands with Stash Or Trash community ratings, customer verdicts, and brand response records.
            </p>
          </div>
        </div>

        {/* Pre-filled Submit Dialog */}
        {prefilledPost && (
          <SubmitDialog
            open={submitDialogOpen}
            onOpenChange={setSubmitDialogOpen}
            defaultBrandId={prefilledPost.matchedBrandId}
            initialValues={{
              title: `${prefilledPost.brandName} ${prefilledPost.productName || ""}`.trim(),
              description: `Brand: ${prefilledPost.brandName} | Corporate Owner: ${prefilledPost.brandOwner}\n${prefilledPost.scanResult.brandInfo.parentCompanyContext}\n[Authenticity Verdict: ${prefilledPost.scanResult.counterfeitAssessment?.verdict?.toUpperCase() || prefilledPost.scanResult.authenticity.verdictStatus} (Score: ${prefilledPost.scanResult.counterfeitAssessment?.authenticityScore ?? prefilledPost.scanResult.authenticity.score}%)]`,
              category: prefilledPost.category,
              file: prefilledPost.file || null,
              aiScanResult: prefilledPost.scanResult,
            }}
          />
        )}
      </main>
    </div>
  );
}
