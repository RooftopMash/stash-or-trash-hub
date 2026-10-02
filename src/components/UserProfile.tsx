import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { getPublicProfile, updateMyProfile } from "@/lib/social";
import {
  getRegisteredBrandIdentity,
  setRegisteredBrandIdentity,
  getActiveDeskOperator,
  getBrandDeskOperators,
  switchActiveDeskOperator,
} from "@/lib/brand-operators";
import { isVerdictSoundEnabled, setVerdictSoundEnabled, playCoinSpinSound } from "@/lib/verdict-sounds";
import { APP_SUPPORTED_LOCALES } from "@/lib/locale-app";
import { switchAppLanguage } from "@/components/LanguageSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Building2,
  Check,
  Coins,
  Copy,
  Globe,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageCircle,
  Settings,
  Shield,
  ShieldCheck,
  User,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccountPreferences {
  callRingAlerts: boolean;
  dmRequestFilter: "everyone" | "connections";
  publicVoterLedger: boolean;
  defaultFeedFilter: "all" | "stash" | "trash";
}

const ACCOUNT_PREFS_KEY = "sot_account_preferences_v1";

const DEFAULT_PREFS: AccountPreferences = {
  callRingAlerts: true,
  dmRequestFilter: "everyone",
  publicVoterLedger: true,
  defaultFeedFilter: "all",
};

export function getAccountPreferences(): AccountPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(ACCOUNT_PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<AccountPreferences>) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveAccountPreferences(prefs: AccountPreferences) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACCOUNT_PREFS_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent("sot-account-prefs-updated", { detail: prefs }));
  } catch {
    // ignore storage errors
  }
}

/**
 * Self-contained SVG data-URI avatars (< 300 chars each, adhering strictly to
 * firebase-blueprint.json UserProfile.avatarUrl maxLength: 500 and Zero-Broken-Image policy).
 */
const PRESET_AVATARS: { id: string; label: string; url: string }[] = [
  {
    id: "gold-watchdog",
    label: "Gold Arbitrator",
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="%230f172a"/><circle cx="40" cy="30" r="14" fill="%23d6a928"/><path d="M16 70c4-14 14-22 24-22s20 8 24 22" fill="%23d6a928"/></svg>`,
  },
  {
    id: "emerald-stash",
    label: "Emerald Stash",
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="%23064e3b"/><circle cx="40" cy="30" r="14" fill="%2334d399"/><path d="M16 70c4-14 14-22 24-22s20 8 24 22" fill="%2334d399"/></svg>`,
  },
  {
    id: "royal-shield",
    label: "Cobalt Guardian",
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="%231e3a8a"/><circle cx="40" cy="30" r="14" fill="%2393c5fd"/><path d="M16 70c4-14 14-22 24-22s20 8 24 22" fill="%2393c5fd"/></svg>`,
  },
  {
    id: "crimson-critic",
    label: "Crimson Auditor",
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="%237f1d1d"/><circle cx="40" cy="30" r="14" fill="%23fca5a5"/><path d="M16 70c4-14 14-22 24-22s20 8 24 22" fill="%23fca5a5"/></svg>`,
  },
];

function getInitials(name: string): string {
  const clean = name.trim();
  if (!clean) return "ST";
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export function UserProfile({
  variant = "navbar",
  defaultSettingsOpen = false,
}: {
  variant?: "navbar" | "card";
  defaultSettingsOpen?: boolean;
}) {
  const { user, signOut } = useAuth();
  const { isAdmin, isDeveloper, persona, setPersona } = useRoles();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [settingsOpen, setSettingsOpen] = useState(defaultSettingsOpen);
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security">("profile");
  const [saving, setSaving] = useState(false);

  // Brand identity & operator state (strictly used when persona === "brand_owner")
  const [registeredBrand, setRegisteredBrandState] = useState(() => getRegisteredBrandIdentity());
  const [activeOperator, setActiveOperatorState] = useState(() => getActiveDeskOperator());
  const [operators, setOperatorsState] = useState(() => getBrandDeskOperators());

  // Form states for Personal Profile
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [avatarUrlInput, setAvatarUrlInput] = useState("");

  // Form states for Brand Profile (when persona === "brand_owner")
  const [brandNameInput, setBrandNameInput] = useState(registeredBrand.name);
  const [brandCategoryInput, setBrandCategoryInput] = useState(registeredBrand.category);
  const [brandWebsiteInput, setBrandWebsiteInput] = useState(registeredBrand.website);

  // Preferences state
  const [soundEnabled, setSoundEnabled] = useState(() => isVerdictSoundEnabled());
  const [prefs, setPrefs] = useState<AccountPreferences>(() => getAccountPreferences());

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: () => getPublicProfile(user!.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    const syncBrandAndOps = () => {
      const nextBrand = getRegisteredBrandIdentity();
      setRegisteredBrandState(nextBrand);
      setBrandNameInput(nextBrand.name);
      setBrandCategoryInput(nextBrand.category);
      setBrandWebsiteInput(nextBrand.website);
      setActiveOperatorState(getActiveDeskOperator());
      setOperatorsState(getBrandDeskOperators());
    };
    window.addEventListener("sot-registered-brand-updated", syncBrandAndOps);
    window.addEventListener("sot-brand-operator-updated", syncBrandAndOps);
    return () => {
      window.removeEventListener("sot-registered-brand-updated", syncBrandAndOps);
      window.removeEventListener("sot-brand-operator-updated", syncBrandAndOps);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const resolvedName =
      profile?.display_name ||
      user.displayName ||
      user.user_metadata?.display_name ||
      user.email?.split("@")[0] ||
      "Verified Voter";
    const resolvedUsername =
      profile?.username ||
      (user.email ? user.email.split("@")[0].replace(/[^a-zA-Z0-9_.-]/g, "") : "voter");
    const resolvedBio = profile?.bio ?? "";
    const resolvedAvatar =
      profile?.avatar_url || user.photoURL || user.user_metadata?.avatar_url || "";

    setDisplayNameInput(resolvedName);
    setUsernameInput(resolvedUsername);
    setBioInput(resolvedBio);
    setAvatarUrlInput(resolvedAvatar);
  }, [user, profile]);

  if (!user) return null;

  const isBrandMode = persona === "brand_owner";

  const resolvedDisplayName = isBrandMode
    ? registeredBrand.name
    : profile?.display_name ||
      user.displayName ||
      user.user_metadata?.display_name ||
      user.email?.split("@")[0] ||
      "Verified Voter";

  const resolvedHandle = isBrandMode
    ? `OP-SEAT · ${activeOperator.name}`
    : `@${profile?.username || user.email?.split("@")[0] || "member"}`;

  const resolvedAvatarUrl = isBrandMode
    ? ""
    : profile?.avatar_url || user.photoURL || user.user_metadata?.avatar_url || "";

  const handleSaveProfileSettings = async () => {
    setSaving(true);
    try {
      if (isBrandMode) {
        if (!brandNameInput.trim()) {
          toast.error("Brand name cannot be empty.");
          setSaving(false);
          return;
        }
        const updatedBrand = setRegisteredBrandIdentity({
          name: brandNameInput.trim().slice(0, 120),
          category: brandCategoryInput.trim().slice(0, 80) || "Consumer Brand",
          website: brandWebsiteInput.trim().slice(0, 250),
        });
        setRegisteredBrandState(updatedBrand);
        toast.success(`Updated Brand Account settings for ${updatedBrand.name}.`);
      } else {
        const cleanName = displayNameInput.trim().slice(0, 60) || "Verified Voter";
        const cleanUsername = usernameInput
          .trim()
          .replace(/^@+/, "")
          .replace(/[^a-zA-Z0-9_.-]/g, "")
          .slice(0, 50);
        const cleanBio = bioInput.trim().slice(0, 280);
        const cleanAvatar = avatarUrlInput.trim().slice(0, 500);

        await updateMyProfile({
          userId: user.id,
          display_name: cleanName,
          username: cleanUsername,
          bio: cleanBio,
          avatar_url: cleanAvatar,
        });
        await queryClient.invalidateQueries({ queryKey: ["my-profile", user.id] });
        toast.success(t("social.profileSaved", { defaultValue: "Profile and avatar saved." }));
      }
      setSettingsOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : t("social.profileSaveFailed", { defaultValue: "Could not save account settings." }),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSound = (checked: boolean) => {
    setSoundEnabled(checked);
    setVerdictSoundEnabled(checked);
    if (checked) {
      playCoinSpinSound();
      toast.success("Verdict & Zwepe Coin sound effects enabled.");
    } else {
      toast.info("Verdict sound effects muted.");
    }
  };

  const handleUpdatePrefs = (partial: Partial<AccountPreferences>) => {
    const next = { ...prefs, ...partial };
    setPrefs(next);
    saveAccountPreferences(next);
    toast.success("Account preferences updated.");
  };

  const handleCopyAccountId = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      toast.success("Account ID copied to clipboard.");
    } catch {
      toast.info(`Account ID: ${user.id}`);
    }
  };

  const activeLangCode = (i18n.language || "en").split("-")[0];

  return (
    <>
      {variant === "navbar" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open user profile and account settings"
              title={`${resolvedDisplayName} · Account & Settings`}
              className={cn(
                "group relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6a928] cursor-pointer",
                isBrandMode
                  ? "border border-[#d6a928]/70 bg-slate-950 text-[#f5d061] hover:border-[#d6a928]"
                  : "border border-border bg-secondary/50 text-foreground hover:bg-secondary",
              )}
            >
              <Avatar className="h-7 w-7 shrink-0">
                {resolvedAvatarUrl ? (
                  <AvatarImage
                    src={resolvedAvatarUrl}
                    alt={resolvedDisplayName}
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback
                  className={cn(
                    "text-[11px] font-extrabold tracking-tight",
                    isBrandMode
                      ? "bg-slate-900 text-[#d6a928]"
                      : "bg-slate-950 text-[#d6a928] dark:bg-[#d6a928] dark:text-slate-950",
                  )}
                >
                  {getInitials(resolvedDisplayName)}
                </AvatarFallback>
              </Avatar>

              {/* Status indicator dot (Gold for Brand / Developer, Emerald for Personal) */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background",
                  isDeveloper
                    ? "bg-[#d6a928]"
                    : isBrandMode
                      ? "bg-[#d6a928]"
                      : "bg-emerald-500",
                )}
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-72 p-2">
            {/* User Identity Header */}
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg p-2.5",
                isBrandMode
                  ? "bg-slate-950 text-white border border-[#d6a928]/30"
                  : "bg-secondary/50 text-foreground",
              )}
            >
              <Avatar className="h-10 w-10 shrink-0 border border-[#d6a928]/40">
                {resolvedAvatarUrl ? (
                  <AvatarImage
                    src={resolvedAvatarUrl}
                    alt={resolvedDisplayName}
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback
                  className={cn(
                    "text-xs font-extrabold",
                    isBrandMode
                      ? "bg-slate-900 text-[#d6a928]"
                      : "bg-slate-950 text-[#d6a928]",
                  )}
                >
                  {getInitials(resolvedDisplayName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold leading-tight">
                  {resolvedDisplayName}
                </p>
                <p
                  className={cn(
                    "truncate text-xs",
                    isBrandMode ? "text-[#f5d061]" : "text-muted-foreground",
                  )}
                >
                  {resolvedHandle}
                </p>
                {user.email && (
                  <p
                    className={cn(
                      "truncate text-[11px]",
                      isBrandMode ? "text-slate-400" : "text-muted-foreground/80",
                    )}
                  >
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            <DropdownMenuSeparator className="my-1.5" />

            {/* Primary Profile & Hub Navigation */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => navigate({ to: "/profile" })}
                className="cursor-pointer gap-2.5 py-2 text-xs font-semibold"
              >
                {isBrandMode ? (
                  <Building2 className="h-4 w-4 text-[#d6a928]" />
                ) : (
                  <User className="h-4 w-4 text-emerald-600" />
                )}
                <span>
                  {isBrandMode
                    ? "Brand Desk & Operator Roster"
                    : t("nav.profile", { defaultValue: "My Profile" })}
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate({ to: "/dashboard" })}
                className="cursor-pointer gap-2.5 py-2 text-xs font-semibold"
              >
                <LayoutDashboard className="h-4 w-4 text-[#d6a928]" />
                <span>
                  {isBrandMode
                    ? "Brand Command Suite"
                    : t("nav.dashboard", { defaultValue: "My Voter Hub" })}
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setActiveTab("profile");
                  setSettingsOpen(true);
                }}
                className="cursor-pointer gap-2.5 py-2 text-xs font-semibold"
              >
                <Settings className="h-4 w-4 text-foreground" />
                <span>Account Settings & Avatar</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setActiveTab("preferences");
                  setSettingsOpen(true);
                }}
                className="cursor-pointer gap-2.5 py-2 text-xs font-semibold"
              >
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span>Audio, Calls & Language</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1.5" />

            {/* Quick Comms & Admin */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => navigate({ to: "/messages" })}
                className="cursor-pointer gap-2.5 py-1.5 text-xs"
              >
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span>{t("nav.messages", { defaultValue: "Messages & SOT Calling" })}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate({ to: "/notifications" })}
                className="cursor-pointer gap-2.5 py-1.5 text-xs"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span>{t("social.notifications", { defaultValue: "Notifications" })}</span>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/admin" })}
                  className="cursor-pointer gap-2.5 py-1.5 text-xs font-semibold"
                >
                  <Shield className="h-4 w-4 text-[#d6a928]" />
                  <span>{t("nav.admin", { defaultValue: "Admin Verification Portal" })}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>

            {/* DEVELOPER-ONLY PREVIEW SWITCHER: Strictly hidden from all regular Personal & Brand users */}
            {isDeveloper && (
              <>
                <DropdownMenuSeparator className="my-1.5" />
                <DropdownMenuLabel className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Developer Preview Tool
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    const next = isBrandMode ? "consumer" : "brand_owner";
                    setPersona(next);
                    toast.info(
                      next === "brand_owner"
                        ? `Developer Preview: Viewing as Brand (${registeredBrand.name})`
                        : "Developer Preview: Viewing as Personal User",
                    );
                  }}
                  className="cursor-pointer gap-2.5 rounded-md bg-secondary/70 py-2 text-xs font-bold"
                >
                  {isBrandMode ? (
                    <>
                      <Coins className="h-4 w-4 text-emerald-600" />
                      <span>DEV: Switch to Personal View</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="h-4 w-4 text-[#d6a928]" />
                      <span className="truncate">DEV: Switch to {registeredBrand.name}</span>
                    </>
                  )}
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator className="my-1.5" />

            <DropdownMenuItem
              onClick={() => void signOut()}
              className="cursor-pointer gap-2.5 py-2 text-xs font-semibold text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("nav.signOut", { defaultValue: "Sign out" })}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        /* Card variant for Profile or Dashboard embedding */
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3.5">
            <Avatar className="h-12 w-12 border border-[#d6a928]/40">
              {resolvedAvatarUrl ? (
                <AvatarImage
                  src={resolvedAvatarUrl}
                  alt={resolvedDisplayName}
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-slate-950 text-sm font-extrabold text-[#d6a928]">
                {getInitials(resolvedDisplayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-bold text-foreground">{resolvedDisplayName}</h3>
              <p className="text-xs text-muted-foreground">
                {resolvedHandle}
                {user.email ? ` · ${user.email}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveTab("profile");
                setSettingsOpen(true);
              }}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Account Settings</span>
            </Button>
          </div>
        </div>
      )}

      {/* Account Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Settings className="h-4 w-4 text-[#d6a928]" />
              <span>
                {isBrandMode
                  ? `${registeredBrand.name} · Brand Account Settings`
                  : "Personal Account & Profile Settings"}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isBrandMode
                ? "Manage your registered brand identity, corporate operator desk seat, and communication preferences."
                : "Customize your SOrT avatar, public voter profile, audio feedback, and privacy settings."}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "profile" | "preferences" | "security")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="text-xs font-semibold">
                {isBrandMode ? "Brand & Desk" : "Profile & Avatar"}
              </TabsTrigger>
              <TabsTrigger value="preferences" className="text-xs font-semibold">
                Preferences
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs font-semibold">
                Privacy & Auth
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: PROFILE & AVATAR (OR BRAND & DESK FOR BRAND OWNERS) */}
            <TabsContent value="profile" className="mt-4 space-y-4">
              {isBrandMode ? (
                <div className="space-y-3.5">
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">
                      Strict Corporate Desk Isolation Active
                    </p>
                    <p className="mt-0.5">
                      Brand operators work strictly under corporate desk seats. Personal SOrT{" "}
                      <code className="font-mono">@</code> profiles cannot be attached to this brand
                      account.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="settings-brand-name" className="text-xs font-semibold">
                      Registered Brand Name
                    </Label>
                    <Input
                      id="settings-brand-name"
                      value={brandNameInput}
                      maxLength={120}
                      onChange={(e) => setBrandNameInput(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="settings-brand-category" className="text-xs font-semibold">
                        Industry Category
                      </Label>
                      <Input
                        id="settings-brand-category"
                        value={brandCategoryInput}
                        maxLength={80}
                        onChange={(e) => setBrandCategoryInput(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="settings-brand-website" className="text-xs font-semibold">
                        Official Website
                      </Label>
                      <Input
                        id="settings-brand-website"
                        value={brandWebsiteInput}
                        maxLength={250}
                        placeholder="https://..."
                        onChange={(e) => setBrandWebsiteInput(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Active Corporate Desk Seat (On Shift)
                    </Label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {operators.map((op) => {
                        const isCurrent = op.id === activeOperator.id;
                        return (
                          <button
                            key={op.id}
                            type="button"
                            onClick={() => {
                              const switched = switchActiveDeskOperator(op.id);
                              setActiveOperatorState(switched);
                              toast.success(`Active desk handed over to ${switched.name}`);
                            }}
                            className={cn(
                              "flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition cursor-pointer",
                              isCurrent
                                ? "border-[#d6a928] bg-slate-950 text-white"
                                : "border-border bg-secondary/30 hover:bg-secondary/60",
                            )}
                          >
                            <div>
                              <p className="font-bold">{op.name}</p>
                              <p
                                className={cn(
                                  "text-[11px]",
                                  isCurrent ? "text-slate-300" : "text-muted-foreground",
                                )}
                              >
                                {op.roleTitle} · {op.shiftLabel}
                              </p>
                            </div>
                            {isCurrent && <Check className="h-4 w-4 text-[#d6a928]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Avatar Preview + Preset Selector */}
                  <div className="flex flex-col gap-3 rounded-lg border border-border bg-secondary/30 p-3 sm:flex-row sm:items-center">
                    <Avatar className="h-14 w-14 shrink-0 border-2 border-[#d6a928]">
                      {avatarUrlInput ? (
                        <AvatarImage
                          src={avatarUrlInput}
                          alt={displayNameInput || "User avatar"}
                          referrerPolicy="no-referrer"
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="bg-slate-950 text-base font-extrabold text-[#d6a928]">
                        {getInitials(displayNameInput || resolvedDisplayName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <p className="text-xs font-semibold text-foreground">
                        Select SOrT Emblem Avatar or Paste Image URL
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {PRESET_AVATARS.map((preset) => {
                          const selected = avatarUrlInput === preset.url;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setAvatarUrlInput(preset.url)}
                              title={preset.label}
                              className={cn(
                                "relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition cursor-pointer",
                                selected
                                  ? "border-[#d6a928] scale-105"
                                  : "border-transparent opacity-80 hover:opacity-100",
                              )}
                            >
                              <img
                                src={preset.url}
                                alt={preset.label}
                                referrerPolicy="no-referrer"
                                className="h-full w-full rounded-full object-cover"
                              />
                            </button>
                          );
                        })}
                        {avatarUrlInput && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setAvatarUrlInput("")}
                            className="h-7 px-2 text-[11px]"
                          >
                            Use Initials
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="up-display-name" className="text-xs font-semibold">
                        {t("social.displayName", { defaultValue: "Display Name" })}
                      </Label>
                      <Input
                        id="up-display-name"
                        value={displayNameInput}
                        maxLength={60}
                        onChange={(e) => setDisplayNameInput(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="up-username" className="text-xs font-semibold">
                        Username Handle
                      </Label>
                      <Input
                        id="up-username"
                        value={usernameInput}
                        maxLength={50}
                        placeholder="username"
                        onChange={(e) => setUsernameInput(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="up-bio" className="text-xs font-semibold">
                      {t("social.bio", { defaultValue: "Bio / Voter Statement" })}
                    </Label>
                    <Textarea
                      id="up-bio"
                      rows={2}
                      value={bioInput}
                      maxLength={280}
                      placeholder={t("social.bioPh", {
                        defaultValue: "Tell the community what you stand for...",
                      })}
                      onChange={(e) => setBioInput(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="up-avatar-url" className="text-xs font-semibold">
                      {t("social.avatarUrl", { defaultValue: "Custom Avatar Image URL" })}
                    </Label>
                    <Input
                      id="up-avatar-url"
                      value={avatarUrlInput}
                      maxLength={500}
                      placeholder="https://..."
                      onChange={(e) => setAvatarUrlInput(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" onClick={() => setSettingsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => void handleSaveProfileSettings()}
                  disabled={saving}
                  className="bg-slate-950 text-[#d6a928] hover:bg-slate-900 font-bold"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </TabsContent>

            {/* TAB 2: PREFERENCES (AUDIO, CALL ALERTS, LANGUAGE) */}
            <TabsContent value="preferences" className="mt-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="space-y-0.5 pr-3">
                    <p className="text-xs font-bold text-foreground">
                      Verdict & Zwepe Coin Sound Effects
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Play audio effects when casting Stash/Trash verdicts or spinning coins.
                    </p>
                  </div>
                  <Switch checked={soundEnabled} onCheckedChange={handleToggleSound} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="space-y-0.5 pr-3">
                    <p className="text-xs font-bold text-foreground">
                      Incoming SOT Voice/Video Call Ring Banner
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Show real-time top alert banner for zero-phone-number SOT calls.
                    </p>
                  </div>
                  <Switch
                    checked={prefs.callRingAlerts}
                    onCheckedChange={(checked) => handleUpdatePrefs({ callRingAlerts: checked })}
                  />
                </div>

                <div className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Globe className="h-3.5 w-3.5 text-[#d6a928]" />
                    <span>Preferred Interface Language</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {APP_SUPPORTED_LOCALES.map((loc) => {
                      const active = activeLangCode === loc.code;
                      return (
                        <button
                          key={loc.code}
                          type="button"
                          onClick={() => {
                            void switchAppLanguage(i18n, loc.code);
                            toast.success(`Switched language to ${loc.label}`);
                          }}
                          className={cn(
                            "rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer",
                            active
                              ? "bg-slate-950 text-[#d6a928]"
                              : "border border-border bg-secondary/40 text-foreground hover:bg-secondary",
                          )}
                        >
                          {loc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: PRIVACY & SECURITY */}
            <TabsContent value="security" className="mt-4 space-y-4">
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-secondary/30 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-bold text-foreground">
                        Authenticated Session
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleCopyAccountId()}
                      className="h-7 gap-1 px-2 text-[11px]"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy ID</span>
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Signed in as <span className="font-semibold text-foreground">{user.email || user.id}</span>
                  </p>
                </div>

                {!isBrandMode && (
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="space-y-0.5 pr-3">
                      <p className="text-xs font-bold text-foreground">
                        Public Voter Ledger Visibility
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Display your Stash/Trash tally on your public community profile.
                      </p>
                    </div>
                    <Switch
                      checked={prefs.publicVoterLedger}
                      onCheckedChange={(checked) =>
                        handleUpdatePrefs({ publicVoterLedger: checked })
                      }
                    />
                  </div>
                )}

                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Sign Out of SOrT</p>
                      <p className="text-[11px] text-muted-foreground">
                        End your active session on this browser.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSettingsOpen(false);
                      void signOut();
                    }}
                    className="h-8 gap-1.5 text-xs font-semibold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign out</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
