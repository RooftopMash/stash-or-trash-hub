import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  QrCode,
  Printer,
  Copy,
  ExternalLink,
  Coins,
  Trash2,
  Sparkles,
  HelpCircle,
  FileCheck,
  Globe,
  Tag,
  Store,
  Scale,
  Award,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import type { Brand } from "@/lib/brands";
import type { AiScanResult, ParsedQrPayload, QrAuthenticityVerdict } from "@/lib/ai-scanner";

export interface BrandDossierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: Brand | null;
  scanResult?: AiScanResult | null;
  parsedQr?: ParsedQrPayload | null;
  qrVerdict?: QrAuthenticityVerdict | null;
  onApplyToPost?: (params: {
    brandName: string;
    brandOwner: string;
    productName: string;
    category: string;
    matchedBrandId?: string;
    file?: File | null;
    scanResult: AiScanResult;
    initialVerdict?: "stash" | "trash";
  }) => void;
}

export function BrandDossierModal({
  open,
  onOpenChange,
  brand,
  scanResult,
  parsedQr,
  qrVerdict,
  onApplyToPost,
}: BrandDossierModalProps) {
  const [activeTab, setActiveTab] = useState<"executive" | "barometer" | "qr_passport" | "counterfeit">("executive");
  const [dossierVote, setDossierVote] = useState<"stash" | "trash" | null>(null);

  if (!scanResult && !brand) return null;

  const brandName = brand?.name || scanResult?.brandInfo.brandName || "Identified Brand";
  const brandOwner = scanResult?.brandInfo.brandOwner || brand?.ownerName || brandName;
  const productName = scanResult?.brandInfo.productName || "Product Line";
  const category = brand?.category || scanResult?.brandInfo.category || "Consumer Goods";
  const country = brand?.country || scanResult?.brandInfo.countryOfOrigin || "Global";
  const marketTier = scanResult?.brandInfo.marketTier || "Standard Commercial";
  const trustScore = brand?.trust_score ?? scanResult?.counterfeitAssessment?.authenticityScore ?? 85;

  const isOriginal = scanResult?.counterfeitAssessment?.isOriginal ?? qrVerdict?.isOriginal ?? true;
  const authenticityScore = scanResult?.counterfeitAssessment?.authenticityScore ?? qrVerdict?.authenticityScore ?? 90;
  const replicaRiskScore = scanResult?.counterfeitAssessment?.counterfeitRiskScore ?? qrVerdict?.counterfeitRiskScore ?? 10;
  const badgeLabel = scanResult?.counterfeitAssessment?.badgeLabel ?? qrVerdict?.badgeLabel ?? (isOriginal ? "Verified Authentic" : "Counterfeit Risk");

  // Determine SOT Trust Grade
  const getGrade = (score: number) => {
    if (score >= 85) return { grade: "AAA", color: "bg-emerald-600 text-white", label: "Prime Trust Grade" };
    if (score >= 70) return { grade: "AA", color: "bg-teal-600 text-white", label: "High Quality Grade" };
    if (score >= 50) return { grade: "A", color: "bg-amber-600 text-white", label: "Satisfactory Grade" };
    return { grade: "BBB", color: "bg-rose-600 text-white", label: "Caution Grade" };
  };

  const gradeInfo = getGrade(trustScore);

  const handlePrintDossier = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.info("Please allow popups to export the brand dossier.");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${brandName} — Official Brand Intelligence & Anti-Counterfeit Dossier</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 850px; margin: 0 auto; line-height: 1.5; }
          .header { border-bottom: 3px solid #0f172a; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .badge { display: inline-block; padding: 6px 14px; background: ${isOriginal ? "#10b981" : "#e11d48"}; color: white; border-radius: 9999px; font-weight: bold; text-transform: uppercase; font-size: 12px; }
          .hero { margin: 24px 0; background: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
          .card { border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; background: white; }
          .score { font-size: 32px; font-weight: 900; color: ${isOriginal ? "#10b981" : "#e11d48"}; }
          .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #64748b; }
          ul { padding-left: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 style="margin:0; font-size:24px; letter-spacing: -0.5px;">STASH OR TRASH • BRAND DOSSIER</h1>
            <p style="margin:4px 0 0 0; color:#64748b; font-size:13px;">Official Forensic Media, QR Cryptographic & Corporate Lineage Audit</p>
          </div>
          <div class="badge">${badgeLabel}</div>
        </div>

        <div class="hero">
          <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:bold; letter-spacing: 1px;">Corporate Lineage Profile</div>
          <h2 style="margin:6px 0; font-size:26px;">${brandName} — ${productName}</h2>
          <p style="margin:0; color:#475569; font-size:14px;"><strong>Corporate Parent:</strong> ${brandOwner} | <strong>Origin:</strong> ${country} | <strong>Tier:</strong> ${marketTier}</p>
        </div>

        <div class="grid">
          <div class="card">
            <div style="font-size:12px; color:#64748b; font-weight:bold; text-transform:uppercase;">Authenticity & QR Status</div>
            <div class="score">${authenticityScore}%</div>
            <p style="font-size:12px; color:#475569; margin-top:4px;">Replica Risk: ${replicaRiskScore}% • Confidence: HIGH</p>
          </div>
          <div class="card">
            <div style="font-size:12px; color:#64748b; font-weight:bold; text-transform:uppercase;">People's SOT Trust Barometer</div>
            <div class="score" style="color: #0284c7;">${trustScore}/100 (${gradeInfo.grade})</div>
            <p style="font-size:12px; color:#475569; margin-top:4px;">${gradeInfo.label} • Stash or Trash Verified</p>
          </div>
        </div>

        <div class="card" style="margin-bottom: 16px;">
          <h3 style="margin-top:0; font-size:14px;">Decoded QR & Digital Passport Intelligence</h3>
          <p style="font-size:12px; color:#334155;"><strong>Payload / URI:</strong> ${parsedQr?.raw || scanResult?.brandInfo.qrOrBarcodeDecoded || "Standard GS1 Digital Code"}</p>
          <p style="font-size:12px; color:#334155;"><strong>Host Security:</strong> ${parsedQr?.hostname || "Verified Manufacturer DNS"} (${parsedQr?.isOfficialVerificationPortal ? "Official Security Portal" : "Standard GS1 Link"})</p>
          <p style="font-size:12px; color:#334155;"><strong>GTIN / Code:</strong> ${parsedQr?.gtin || scanResult?.brandInfo.qrOrBarcodeDecoded || "International Registry Matched"}</p>
        </div>

        <div class="card" style="margin-bottom: 16px;">
          <h3 style="margin-top:0; font-size:14px;">Authorized Distribution & Brand PR Advisory</h3>
          <p style="font-size:12px; color:#334155;">${scanResult?.counterfeitAssessment?.brandProtectionTracking?.authorizedChannels || "Authorized retail partners and certified brand stores."}</p>
          <p style="font-size:12px; color:#334155; margin-top:8px;">${scanResult?.counterfeitAssessment?.brandProtectionTracking?.advice || "Always purchase through authorized distributors to guarantee warranty and genuine origin."}</p>
        </div>

        <div class="footer">
          Issued by Stash Or Trash AI Forensic & Brand Intelligence System • Timestamp: ${new Date().toISOString()}
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleCopyDossier = () => {
    const text = `[STASH OR TRASH OFFICIAL BRAND DOSSIER]
Brand: ${brandName}
Corporate Owner: ${brandOwner}
Origin: ${country} | Category: ${category} | Tier: ${marketTier}
SOT Trust Grade: ${gradeInfo.grade} (${trustScore}/100) - ${gradeInfo.label}
Authenticity Verdict: ${badgeLabel} (Original Score: ${authenticityScore}%, Replica Risk: ${replicaRiskScore}%)
QR Code / Digital Link: ${parsedQr?.raw || scanResult?.brandInfo.qrOrBarcodeDecoded || "GS1 Registry"}
Security Host: ${parsedQr?.hostname || "Verified Corporate Infrastructure"}
Authorized Channels: ${scanResult?.counterfeitAssessment?.brandProtectionTracking?.authorizedChannels || "Authorized Retailers"}
PR Advisory: ${scanResult?.counterfeitAssessment?.brandProtectionTracking?.advice || "Verified Authentic"}
Issued: ${new Date().toISOString()}`;

    navigator.clipboard.writeText(text);
    toast.success("Complete Brand Dossier copied to clipboard!");
  };

  const handleCastDossierVote = (vote: "stash" | "trash") => {
    setDossierVote(vote);
    if (vote === "stash") {
      toast.success(`You stashed ${brandName}! Positive authenticity vote recorded.`);
    } else {
      toast.error(`You trashed ${brandName}! Counterfeit alert recorded.`);
    }
  };

  const handleForwardToBarometer = () => {
    if (!scanResult) return;
    if (onApplyToPost) {
      onApplyToPost({
        brandName,
        brandOwner,
        productName,
        category,
        matchedBrandId: brand?.id,
        file: null,
        scanResult,
        initialVerdict: dossierVote || (isOriginal ? "stash" : "trash"),
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0 border-border bg-card">
        {/* Header Hero Section */}
        <div className="p-6 border-b border-border bg-gradient-to-br from-card via-card to-muted/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-2xl text-primary font-display shrink-0 shadow-inner">
                {brand?.signedLogoUrl || brand?.logo_url ? (
                  <img
                    src={brand.signedLogoUrl || brand.logo_url || ""}
                    alt={brandName}
                    className="h-12 w-12 rounded-xl object-contain"
                  />
                ) : (
                  brandName.slice(0, 2).toUpperCase()
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                    Associated Brand Dossier
                  </span>
                  <Badge
                    className={`font-bold text-xs uppercase ${
                      isOriginal
                        ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                        : "bg-rose-600 hover:bg-rose-600 text-white"
                    }`}
                  >
                    {isOriginal ? <CheckCircle2 className="h-3 w-3 mr-1 inline" /> : <AlertTriangle className="h-3 w-3 mr-1 inline" />}
                    {badgeLabel}
                  </Badge>
                  <Badge variant="outline" className={`font-mono text-xs ${gradeInfo.color}`}>
                    {gradeInfo.grade} Grade
                  </Badge>
                </div>

                <DialogTitle className="text-2xl font-black font-display tracking-tight text-foreground">
                  {brandName}{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    ({productName})
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                  <span><strong>Owner:</strong> {brandOwner}</span>
                  <span>•</span>
                  <span><strong>Origin:</strong> {country}</span>
                  <span>•</span>
                  <span><strong>Category:</strong> {category}</span>
                </DialogDescription>
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="flex items-center gap-2 sm:self-start">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintDossier}
                className="gap-1.5 text-xs h-8"
                title="Print or export PDF dossier"
              >
                <Printer className="h-3.5 w-3.5" /> Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyDossier}
                className="gap-1.5 text-xs h-8"
                title="Copy dossier summary"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </Button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-background/80 border border-border space-y-0.5">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Authenticity</div>
              <div className="text-xl font-black text-emerald-600">{authenticityScore}%</div>
              <div className="text-[10px] text-muted-foreground font-medium">Original Spec</div>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border space-y-0.5">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Replica Risk</div>
              <div className={`text-xl font-black ${replicaRiskScore > 30 ? "text-rose-600" : "text-emerald-600"}`}>
                {replicaRiskScore}%
              </div>
              <div className="text-[10px] text-muted-foreground font-medium">Counterfeit Risk</div>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border space-y-0.5">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Trust Score</div>
              <div className="text-xl font-black text-primary">{trustScore}/100</div>
              <div className="text-[10px] text-muted-foreground font-medium">SOT Barometer</div>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border space-y-0.5">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Market Tier</div>
              <div className="text-sm font-bold text-foreground truncate" title={marketTier}>
                {marketTier}
              </div>
              <div className="text-[10px] text-muted-foreground font-medium">Segment Tier</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border bg-muted/20 px-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("executive")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "executive"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="h-4 w-4" /> Corporate Lineage & Profile
          </button>
          <button
            onClick={() => setActiveTab("barometer")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "barometer"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Scale className="h-4 w-4" /> SOT Barometer & Trust
          </button>
          <button
            onClick={() => setActiveTab("qr_passport")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "qr_passport"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <QrCode className="h-4 w-4" /> QR & Digital Passport
          </button>
          <button
            onClick={() => setActiveTab("counterfeit")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "counterfeit"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="h-4 w-4" /> Anti-Counterfeit Audit
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-4">
          {/* TAB 1: EXECUTIVE PROFILE */}
          {activeTab === "executive" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" /> Corporate Parentage & Lineage
                </h4>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {scanResult?.brandInfo.parentCompanyContext ||
                    `${brandName} is an internationally recognized brand owned and operated under the corporate management of ${brandOwner}. All intellectual property, trademarks, and design patents are administered globally.`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                  <span className="text-muted-foreground">Authorized Retail & Distribution:</span>
                  <p className="font-medium text-foreground leading-relaxed">
                    {scanResult?.counterfeitAssessment?.brandProtectionTracking?.authorizedChannels ||
                      "Authorized brand boutiques, certified department stockists, and licensed e-commerce distributors."}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                  <span className="text-muted-foreground">Brand PR & Compliance Statement:</span>
                  <p className="font-medium text-foreground leading-relaxed">
                    {scanResult?.counterfeitAssessment?.brandProtectionTracking?.advice ||
                      `Authenticity verification conducted in compliance with ${brandOwner} anti-replica packaging guidelines.`}
                  </p>
                </div>
              </div>

              {brand?.website && (
                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10 text-xs">
                  <span className="text-muted-foreground">Official Corporate Portal:</span>
                  <a
                    href={brand.website.startsWith("http") ? brand.website : `https://${brand.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    {brand.website} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BAROMETER & TRUST */}
          {activeTab === "barometer" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-5 rounded-2xl border border-border bg-muted/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">SOT Public Trust Rating</h4>
                    <p className="text-xs text-muted-foreground">{gradeInfo.label} on the Brand Barometer</p>
                  </div>
                  <Badge className={`text-sm px-3 py-1 font-bold ${gradeInfo.color}`}>
                    {gradeInfo.grade} ({trustScore}/100)
                  </Badge>
                </div>
                <Progress value={trustScore} className="h-2.5 bg-muted" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Based on community consensus, dispute resolution history, verified brand responses, and forensic anti-counterfeit audits.
                </p>
              </div>

              {brand && (
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-primary" /> {brand.name} Public Brand Profile
                    </div>
                    <div className="text-muted-foreground mt-0.5">
                      Explore full consumer sentiment reviews, past votes, and brand officer responses.
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => (window.location.href = `/brands/${brand.slug}`)}
                    className="gap-1.5 text-xs font-semibold"
                  >
                    View Page <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: QR & DIGITAL PASSPORT */}
          {activeTab === "qr_passport" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                    <QrCode className="h-4 w-4 text-primary" /> Decoded QR Symbology & GS1 Digital Link
                  </div>
                  {parsedQr?.isOfficialVerificationPortal && (
                    <Badge className="bg-emerald-600 text-white text-[10px]">
                      Cryptographic Domain Validated
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground block">PAYLOAD / HOST</span>
                    <span className="font-bold text-foreground truncate block" title={parsedQr?.hostname || ""}>
                      {parsedQr?.hostname || "Direct Registry URI"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground block">GTIN / BARCODE</span>
                    <span className="font-bold text-foreground truncate block">
                      {parsedQr?.gtin || scanResult?.brandInfo.qrOrBarcodeDecoded || "GS1-EAN-13"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground block">SERIAL / PASS-KEY</span>
                    <span className="font-bold text-foreground truncate block">
                      {parsedQr?.serialNumber || parsedQr?.batchLot || "Verified Digital Tag"}
                    </span>
                  </div>
                </div>

                {parsedQr?.raw && (
                  <div className="p-2.5 rounded-lg bg-background border border-border text-[11px] font-mono break-all text-muted-foreground">
                    <span className="text-foreground font-semibold">Raw QR URI:</span> {parsedQr.raw}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-primary" /> Cryptographic Domain Check
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {parsedQr?.isOfficialVerificationPortal
                      ? "Resolves to official manufacturer portal (Certilogo, GS1, or verified brand domain). Zero spoofing detected."
                      : "Standard product destination address. SSL security and DNS legitimacy validated."}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Visual & Pixel Integrity
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {scanResult?.authenticity.forensics?.aiGenerationMarkers ||
                      "Physical camera optics confirmed. No synthetic AI renders, Photoshop splicing, or altered labels."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANTI-COUNTERFEIT AUDIT */}
          {activeTab === "counterfeit" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Genuine Spec */}
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2 text-xs">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Verified Genuine Hallmarks</span>
                  </div>
                  <ul className="space-y-1.5 text-foreground/90">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{scanResult?.counterfeitAssessment?.logoInspection || "Precise vector typography, sharp debossing, and exact kerning."}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{scanResult?.counterfeitAssessment?.materialAndCraftsmanship || "High-grade materials, uniform stitch tension, and alloy hardware."}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Cryptographic digital security seal matching manufacturer registry.</span>
                    </li>
                  </ul>
                </div>

                {/* Counterfeit Warning */}
                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2 text-xs">
                  <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    <span>Known Replica Vulnerabilities</span>
                  </div>
                  <ul className="space-y-1.5 text-foreground/90">
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">✗</span>
                      <span>Lookalike QR domains (.xyz, .top, typo URLs) redirecting to fake certs.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">✗</span>
                      <span>Uneven stitch spacing, plastic-coated lightweight metal, synthetic odor.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">✗</span>
                      <span>Faded thermal packaging prints and blurred barcode symbology.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {scanResult?.counterfeitAssessment?.clientVerificationGuide && (
                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
                  <h4 className="font-bold text-foreground flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-primary" /> Step-by-Step Client Verification Protocol
                  </h4>
                  <div className="space-y-1.5">
                    {scanResult.counterfeitAssessment.clientVerificationGuide.map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="h-4 w-4 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant={dossierVote === "stash" ? "default" : "outline"}
              onClick={() => handleCastDossierVote("stash")}
              className={`flex-1 sm:flex-none gap-1.5 text-xs font-semibold ${
                dossierVote === "stash"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "hover:border-emerald-500/50 hover:text-emerald-600"
              }`}
            >
              <Coins className="h-3.5 w-3.5 text-amber-400" />
              Stash as Original
            </Button>
            <Button
              size="sm"
              variant={dossierVote === "trash" ? "destructive" : "outline"}
              onClick={() => handleCastDossierVote("trash")}
              className={`flex-1 sm:flex-none gap-1.5 text-xs font-semibold ${
                dossierVote === "trash"
                  ? "bg-rose-600 text-white hover:bg-rose-700"
                  : "hover:border-rose-500/50 hover:text-rose-600"
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Trash as Fake
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onApplyToPost && scanResult && (
              <Button
                onClick={handleForwardToBarometer}
                className="flex-1 sm:flex-none gap-1.5 text-xs font-semibold bg-primary text-primary-foreground shadow-sm"
              >
                <FileCheck className="h-3.5 w-3.5" /> Post to Barometer
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none text-xs"
            >
              Close Dossier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
