import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";
import { Button } from "@/components/ui/button";
import { SubmitDialog } from "@/components/SubmitDialog";
import { ProductScannerModal } from "@/components/ProductScannerModal";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Bell, MessageCircle, Shield, Scan } from "lucide-react";
import { SotWordmark } from "@/components/SotWordmark";
import type { AiScanResult } from "@/lib/ai-scanner";

export function Header({ onPosted }: { onPosted?: () => void }) {
  const { user, loading, signOut } = useAuth();
  const { isAdmin, isBrand } = useRoles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const unread = useUnreadCount(user?.id);
  const unreadNotifs = useUnreadNotifications(user?.id);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [prefilledPost, setPrefilledPost] = useState<{
    brandName: string;
    brandOwner: string;
    productName: string;
    category: string;
    matchedBrandId?: string;
    file?: File | null;
    scanResult: AiScanResult;
  } | null>(null);

  const handleApplyFromScanner = (params: {
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
    <header
      suppressHydrationWarning
      className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="group flex items-center gap-2">
            <span
              aria-label="SOrT — Stash Or Trash logo"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-sm font-extrabold tracking-[-0.12em] text-background shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3"
            >
              <span className="text-stash">S</span>
              <span>O</span>
              <span className="text-trash">r</span>
              <span>T</span>
            </span>
            <span className="hidden sm:inline">
              <SotWordmark className="text-xl" />
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              {t("nav.home", { defaultValue: "Home" })}
            </Link>
            <Link
              to="/feed"
              className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              {t("nav.feed", { defaultValue: "Feed" })}
            </Link>
            <Link
              to="/scan"
              className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground flex items-center gap-1"
            >
              <Scan className="h-3.5 w-3.5 text-primary" /> {t("nav.scan", { defaultValue: "Scan" })}
            </Link>
            <Link
              to="/brands"
              className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              {t("nav.brands", { defaultValue: "Brands" })}
            </Link>
            <Link
              to="/awards"
              className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              {t("nav.awards", { defaultValue: "Awards" })}
            </Link>
            {user && (isBrand || isAdmin) && (
              <Link
                to="/dashboard"
                className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              >
                {t("nav.dashboard", { defaultValue: "Dashboard" })}
              </Link>
            )}
            {user && (
              <Link
                to="/profile"
                className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              >
                {t("nav.profile", { defaultValue: "Profile" })}
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setScannerOpen(true)}
            className="gap-1.5 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/5 flex items-center px-2.5 sm:px-3"
            title="Scan Product Barcodes or Logos for Authenticity"
          >
            <Scan className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("nav.scan", { defaultValue: "Scan" })}</span>
          </Button>

          {/* Authenticity & Safety Shield Icon — permanently positioned next to Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (isAdmin || user?.email?.toLowerCase() === "borulelo@gmail.com") {
                navigate({ to: "/admin" });
              } else if (isBrand) {
                navigate({ to: "/dashboard" });
              } else {
                navigate({ to: "/scan" });
              }
            }}
            aria-label={t("nav.shield", { defaultValue: "Authenticity & Safety Shield" })}
            title={
              isAdmin || user?.email?.toLowerCase() === "borulelo@gmail.com"
                ? "Admin & Brand Verification Portal"
                : isBrand
                ? "Brand Dashboard & Safety Shield"
                : "Brand Authenticity & Safety Shield"
            }
            className="relative text-foreground hover:text-primary transition-colors"
          >
            <Shield className="h-4 w-4 text-stash" />
          </Button>

          {loading ? null : user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate({ to: "/notifications" })}
                aria-label={t("social.notifications", { defaultValue: "Notifications" })}
                title={t("social.notifications", { defaultValue: "Notifications" })}
              >
                <Bell className="h-4 w-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-trash px-1 text-[10px] font-bold text-trash-foreground">
                    {unreadNotifs > 99 ? "99+" : unreadNotifs}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate({ to: "/messages" })}
                aria-label={t("nav.messages", { defaultValue: "Messages" })}
                title={t("nav.messages", { defaultValue: "Messages" })}
              >
                <MessageCircle className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-trash px-1 text-[10px] font-bold text-white">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </Button>
              <SubmitDialog onPosted={onPosted} />
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                {t("nav.signOut", { defaultValue: "Sign out" })}
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate({ to: "/auth" })}
                aria-label={t("social.notifications", { defaultValue: "Notifications" })}
                title={t("social.notifications", { defaultValue: "Notifications" })}
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/auth" })}>
                {t("nav.signIn", { defaultValue: "Sign in" })}
              </Button>
              <Button size="sm" onClick={() => navigate({ to: "/auth", search: { tab: "signup" } })}>
                {t("nav.signUp", { defaultValue: "Sign up" })}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Global Product Scanner Modal */}
      <ProductScannerModal
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onApplyToPost={handleApplyFromScanner}
      />

      {/* Submit Dialog opened with prefilled scanner data */}
      {prefilledPost && (
        <SubmitDialog
          open={submitDialogOpen}
          onOpenChange={setSubmitDialogOpen}
          defaultBrandId={prefilledPost.matchedBrandId}
          initialValues={{
            title: `${prefilledPost.brandName} ${prefilledPost.productName || ""}`.trim(),
            description: `Brand: ${prefilledPost.brandName} | Corporate Owner: ${prefilledPost.brandOwner}\n${prefilledPost.scanResult.brandInfo.parentCompanyContext}\n[Forensic Authenticity Score: ${prefilledPost.scanResult.authenticity.score}% - ${prefilledPost.scanResult.authenticity.badgeLabel}]`,
            category: prefilledPost.category,
            file: prefilledPost.file || null,
            aiScanResult: prefilledPost.scanResult,
          }}
          onPosted={onPosted}
        />
      )}
    </header>
  );
}
