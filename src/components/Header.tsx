import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";
import { Button } from "@/components/ui/button";
import { SubmitDialog } from "@/components/SubmitDialog";
import { ProductScannerModal } from "@/components/ProductScannerModal";
import { LiveBroadcastModal, type IncomingSotCallPayload } from "@/components/LiveBroadcastModal";
import { LanguageSwitcher, TopLanguageStrip } from "@/components/LanguageSwitcher";
import { Bell, Building2, Coins, LayoutDashboard, MessageCircle, Shield, Scan, Video, PhoneIncoming, PhoneOff } from "lucide-react";
import { SotWordmark } from "@/components/SotWordmark";
import { getRegisteredBrandIdentity } from "@/lib/brand-operators";
import { supabase } from "@/integrations/supabase/client";
import type { AiScanResult } from "@/lib/ai-scanner";
import { cn } from "@/lib/utils";

export function Header({ onPosted }: { onPosted?: () => void }) {
  const { user, loading, signOut } = useAuth();
  const { isAdmin, isDeveloper, isBrand, persona, setPersona } = useRoles();
  const [registeredBrandName, setRegisteredBrandName] = useState(
    () => getRegisteredBrandIdentity().name,
  );
  const { t } = useTranslation();
  const navigate = useNavigate();
  const unread = useUnreadCount(user?.id);
  const unreadNotifs = useUnreadNotifications(user?.id);

  useEffect(() => {
    const syncBrand = () => setRegisteredBrandName(getRegisteredBrandIdentity().name);
    window.addEventListener("sot-registered-brand-updated", syncBrand);
    window.addEventListener("sot-brand-operator-updated", syncBrand);
    return () => {
      window.removeEventListener("sot-registered-brand-updated", syncBrand);
      window.removeEventListener("sot-brand-operator-updated", syncBrand);
    };
  }, []);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [liveStudioOpen, setLiveStudioOpen] = useState(false);
  const [incomingCall, setIncomingCall] = useState<IncomingSotCallPayload | null>(null);
  const [activeCallRoom, setActiveCallRoom] = useState<string | undefined>(undefined);
  const [activeCallMode, setActiveCallMode] = useState<"broadcast" | "video_call" | "voice_call">("video_call");
  const [activeCallPartner, setActiveCallPartner] = useState<string | undefined>(undefined);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  // Listen for real-time Brand-to-User and User-to-User incoming calls on SOT
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleIncoming = (payload: IncomingSotCallPayload) => {
      if (!payload || !payload.roomChannel) return;
      // Show ring banner if targeted to this user, or if testing in another tab
      if (!user?.id || payload.recipientId === user.id || payload.callerId !== user.id) {
        setIncomingCall(payload);
      }
    };

    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      bc = new BroadcastChannel("sot-call-ring");
      bc.onmessage = (ev) => handleIncoming(ev.data as IncomingSotCallPayload);
    }

    const chan = supabase
      .channel("sot-call-ring")
      .on("broadcast", { event: "incoming-call" }, ({ payload }) => {
        if (payload) handleIncoming(payload as IncomingSotCallPayload);
      })
      .subscribe();

    return () => {
      bc?.close();
      void supabase.removeChannel(chan);
    };
  }, [user?.id]);
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
      className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-xl"
    >
      {/* Top Language Switcher Strip for supported locales in src/lib/locale-app.ts */}
      <TopLanguageStrip />

      {/* Compact Single-Line Navbar — everything fits cleanly on one line with zero wrapping */}
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between gap-2 px-3 sm:px-5 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2.5 lg:gap-4">
          <Link to="/" className="group flex shrink-0 items-center gap-2 whitespace-nowrap">
            <span
              aria-label="SOrT — Stash Or Trash logo"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-extrabold tracking-[-0.12em] text-background shadow-sm transition-transform group-hover:scale-105"
            >
              <span className="text-stash">S</span>
              <span>O</span>
              <span className="text-trash">r</span>
              <span>T</span>
            </span>
            <SotWordmark className="hidden xl:inline-flex text-base whitespace-nowrap" />
          </Link>

          <nav className="flex min-w-0 items-center gap-0.5 overflow-x-auto text-xs font-semibold no-scrollbar sm:gap-1">
            <Link
              to="/"
              className="shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground [&.active]:bg-secondary [&.active]:text-foreground"
            >
              {t("nav.home", { defaultValue: "Home" })}
            </Link>
            <Link
              to="/feed"
              className="shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground [&.active]:bg-secondary [&.active]:text-foreground"
            >
              {t("nav.feed", { defaultValue: "Feed" })}
            </Link>
            {persona !== "brand_owner" && (
              <Link
                to="/scan"
                className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground [&.active]:bg-secondary [&.active]:text-foreground"
              >
                <Scan className="h-3 w-3 shrink-0 text-[#d6a928]" />
                <span>{t("nav.scan", { defaultValue: "Scan" })}</span>
              </Link>
            )}
            <Link
              to="/brands"
              className="shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground [&.active]:bg-secondary [&.active]:text-foreground"
            >
              {t("nav.brands", { defaultValue: "Brands" })}
            </Link>
            <Link
              to="/awards"
              className="shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground [&.active]:bg-secondary [&.active]:text-foreground"
            >
              {t("nav.awards", { defaultValue: "Awards" })}
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground [&.active]:bg-secondary [&.active]:text-foreground"
              >
                <LayoutDashboard className="h-3 w-3 shrink-0 text-[#d6a928]" />
                <span>
                  {persona === "brand_owner"
                    ? "Brand Suite"
                    : t("nav.dashboard", { defaultValue: "My Hub" })}
                </span>
              </Link>
            )}
            {user && (
              <Link
                to="/profile"
                className="shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground [&.active]:bg-secondary [&.active]:text-foreground"
              >
                {persona === "brand_owner"
                  ? "Brand Desk"
                  : t("nav.profile", { defaultValue: "Profile" })}
              </Link>
            )}
            {user && isAdmin && (
              <Link
                to="/admin"
                className="shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground [&.active]:bg-secondary [&.active]:text-foreground"
              >
                {t("nav.admin", { defaultValue: "Admin" })}
              </Link>
            )}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          {/* DEVELOPER-ONLY PREVIEW SWITCHER: Hidden from all Personal Users & Brand Owners */}
          {isDeveloper && (
            <button
              type="button"
              onClick={() => {
                const next = persona === "brand_owner" ? "consumer" : "brand_owner";
                setPersona(next);
              }}
              title="Developer-Only View Switcher (Hidden from regular Personal Users and Brand Owners)"
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-black transition cursor-pointer whitespace-nowrap",
                persona === "brand_owner"
                  ? "border-[#d6a928] bg-slate-950 text-[#f5d061]"
                  : "border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
              )}
            >
              {persona === "brand_owner" ? (
                <>
                  <Building2 className="h-3 w-3 text-[#d6a928]" />
                  <span className="max-w-[110px] truncate">DEV: {registeredBrandName}</span>
                </>
              ) : (
                <>
                  <Coins className="h-3 w-3 text-[#d6a928]" />
                  <span>DEV: Personal</span>
                </>
              )}
            </button>
          )}

          {/* Authenticity & Safety Shield Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (isAdmin) {
                navigate({ to: "/admin" });
              } else if (isBrand) {
                navigate({ to: "/dashboard" });
              } else {
                navigate({ to: "/scan" });
              }
            }}
            aria-label={t("nav.shield", { defaultValue: "Authenticity & Safety Shield" })}
            title={
              isAdmin
                ? "Admin & Brand Verification Portal"
                : isBrand
                  ? "Brand Dashboard & Safety Shield"
                  : "Brand Authenticity & Safety Shield"
            }
            className="relative h-8 w-8 shrink-0 text-foreground transition-colors hover:text-primary"
          >
            <Shield className="h-4 w-4 text-[#d6a928]" />
          </Button>

          {loading ? null : user ? (
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 shrink-0"
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
                className="relative h-8 w-8 shrink-0"
                onClick={() => navigate({ to: "/messages" })}
                aria-label={t("nav.messages", { defaultValue: "Messages & Calling" })}
                title={t("nav.messages", { defaultValue: "Messages & Voice/Video Calls" })}
              >
                <MessageCircle className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-trash px-1 text-[10px] font-bold text-white">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </Button>
              {persona !== "brand_owner" && <SubmitDialog onPosted={onPosted} />}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 whitespace-nowrap px-2 text-xs font-semibold"
                onClick={() => signOut()}
              >
                {t("nav.signOut", { defaultValue: "Sign out" })}
              </Button>
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 whitespace-nowrap px-2.5 text-xs font-semibold"
                onClick={() => navigate({ to: "/auth" })}
              >
                {t("nav.signIn", { defaultValue: "Sign in" })}
              </Button>
              <Button
                size="sm"
                className="h-8 shrink-0 whitespace-nowrap bg-slate-950 px-2.5 text-xs font-bold text-[#d6a928] hover:bg-slate-900"
                onClick={() => navigate({ to: "/auth", search: { tab: "signup" } })}
              >
                {t("nav.signUp", { defaultValue: "Sign up" })}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Real-Time Incoming Brand-to-User / User-to-User Call Alert Banner */}
      {incomingCall && (
        <div className="bg-emerald-950 text-white border-b border-emerald-500/40 px-4 py-2.5 shadow-lg">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-slate-950 animate-bounce">
                <PhoneIncoming className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display font-extrabold">
                  Incoming {incomingCall.mode === "voice_call" ? "Voice Call" : "Video Call"} from{" "}
                  <span className="text-[#f5d061]">{incomingCall.callerName}</span>
                </p>
                <p className="text-[11px] text-emerald-200">
                  {incomingCall.callDirection === "brand_to_user"
                    ? `Brand Owner reaching out on SOT regarding ${incomingCall.brandName} (${incomingCall.topic})`
                    : `Direct SOT User-to-User Call · Room: ${incomingCall.roomChannel}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setActiveCallRoom(incomingCall.roomChannel);
                  setActiveCallMode(incomingCall.mode);
                  setActiveCallPartner(incomingCall.callerName);
                  setIncomingCall(null);
                  setLiveStudioOpen(true);
                }}
                className="h-8 gap-1.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold text-xs"
              >
                <PhoneIncoming className="h-3.5 w-3.5" /> Answer Call on SOT
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIncomingCall(null)}
                className="h-8 gap-1 border-white/30 bg-transparent text-white hover:bg-white/10 text-xs"
              >
                <PhoneOff className="h-3.5 w-3.5" /> Decline
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Global Product Scanner Modal */}
      <ProductScannerModal
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onApplyToPost={handleApplyFromScanner}
      />

      {/* Global Voice / Video Call & Live Situation Broadcast Modal */}
      <LiveBroadcastModal
        open={liveStudioOpen}
        onOpenChange={setLiveStudioOpen}
        brandName={activeCallPartner || "Direct User / Brand Call"}
        defaultMode={activeCallMode}
        customRoomChannel={activeCallRoom}
        callDirection={isBrand ? "brand_to_user" : "user_to_user"}
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
