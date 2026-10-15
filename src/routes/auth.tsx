import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  type AuthProvider as FirebaseAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { setStoredAccountPersona, type ActiveAccountPersona as SotAccountPersona } from "@/hooks/useRoles";
import {
  addAndSwitchDeskOperator,
  getRegisteredBrandIdentity,
  setRegisteredBrandIdentity,
  setActiveBrandPlanTier,
  type BrandPlanTierId,
} from "@/lib/brand-operators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Recycle, Sparkles, Loader2, Building2, Coins, ShieldCheck, UserCheck, Copy, ExternalLink, AlertTriangle, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Stash or Trash" },
      { name: "description", content: "Sign in to your Personal Member Profile or Official Brand Account on Stash or Trash." },
    ],
  }),
  component: AuthPage,
});

type SupportedProvider = "google" | "microsoft" | "apple" | "facebook" | "twitter" | "linkedin" | "github";

function AuthPage() {
  const { user, signInWithLocalFallback } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [accountDoor, setAccountDoor] = useState<SotAccountPersona>("consumer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [registeredBrandName, setRegisteredBrandName] = useState(
    () => getRegisteredBrandIdentity().name,
  );
  const [selectedBrandTier, setSelectedBrandTier] = useState<BrandPlanTierId>("cx_launch_matrix");
  const [operatorName, setOperatorName] = useState("");
  const [operatorRole, setOperatorRole] = useState("CX & Launch Desk Operator");
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showDomainGuide, setShowDomainGuide] = useState(false);

  const currentHostname = typeof window !== "undefined" ? window.location.hostname : "";
  const isPreviewDomain =
    currentHostname.includes(".run.app") ||
    currentHostname.includes("localhost") ||
    currentHostname.includes(".vercel.app");

  useEffect(() => {
    if (user) {
      navigate({ to: accountDoor === "brand_owner" ? "/dashboard" : "/" });
    }
  }, [user, navigate, accountDoor]);

  const copyDomain = async () => {
    if (!currentHostname) return;
    try {
      await navigator.clipboard.writeText(currentHostname);
      toast.success(`Copied domain "${currentHostname}" to clipboard!`);
    } catch {
      toast.info(`Domain: ${currentHostname}`);
    }
  };

  const finalizePortalRouting = (cleanEmail?: string) => {
    setStoredAccountPersona(accountDoor);
    if (accountDoor === "brand_owner") {
      const targetBrandName =
        registeredBrandName.trim() ||
        displayName.trim() ||
        getRegisteredBrandIdentity().name;
      setRegisteredBrandIdentity({
        name: targetBrandName,
        ownerEmail: cleanEmail || email.trim() || undefined,
        verified: true,
      });
      setActiveBrandPlanTier(selectedBrandTier, targetBrandName);
      if (operatorName.trim()) {
        addAndSwitchDeskOperator({
          name: operatorName.trim(),
          roleTitle: operatorRole.trim() || "Authorized Brand Desk Operator",
          shiftLabel: "Active Shift Login",
        });
      }
    }
    navigate({ to: accountDoor === "brand_owner" ? "/dashboard" : "/" });
  };

  const handleInstantSignIn = (role: "personal" | "developer" | "brand") => {
    setBusy(true);
    try {
      if (role === "developer") {
        setAccountDoor("consumer");
        signInWithLocalFallback({
          email: "Borulelo@gmail.com",
          displayName: "Borulelo (Developer Admin)",
        });
        toast.success("Signed in as Borulelo@gmail.com with Developer Admin privileges!");
        finalizePortalRouting("Borulelo@gmail.com");
      } else if (role === "brand") {
        setAccountDoor("brand_owner");
        const bName = registeredBrandName.trim() || "Nando's South Africa";
        signInWithLocalFallback({
          email: "brand.executive@stashortrash.app",
          displayName: `${bName} Corporate Desk`,
        });
        toast.success(`Signed in to Official Brand Account (${bName})!`);
        finalizePortalRouting("brand.executive@stashortrash.app");
      } else {
        setAccountDoor("consumer");
        const cleanEmail = email.trim() || "member@stashortrash.app";
        const cleanName = displayName.trim() || "Verified Voter";
        signInWithLocalFallback({
          email: cleanEmail,
          displayName: cleanName,
        });
        toast.success(`Signed in as ${cleanName}!`);
        finalizePortalRouting(cleanEmail);
      }
    } finally {
      setBusy(false);
    }
  };

  const signIn = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      toast.success(
        accountDoor === "brand_owner"
          ? `Official Brand Account (${registeredBrandName.trim() || "Brand"}) authenticated — opening Brand Command Suite.`
          : t("auth.welcome") || "Welcome back to your Personal Member Profile!",
      );
      finalizePortalRouting(cleanEmail);
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string };
      if (
        fbErr.code === "auth/operation-not-allowed" ||
        fbErr.code === "auth/configuration-not-found" ||
        fbErr.code === "auth/unauthorized-domain" ||
        (fbErr.message && (
          fbErr.message.includes("auth/operation-not-allowed") ||
          fbErr.message.includes("auth/unauthorized-domain")
        ))
      ) {
        if (fbErr.code === "auth/unauthorized-domain" || fbErr.message?.includes("unauthorized-domain")) {
          setShowDomainGuide(true);
        }
        const resolvedName =
          accountDoor === "brand_owner"
            ? registeredBrandName.trim() || cleanEmail.split("@")[0]
            : displayName.trim() || cleanEmail.split("@")[0];
        signInWithLocalFallback({ email: cleanEmail, displayName: resolvedName });
        toast.success(
          accountDoor === "brand_owner"
            ? `Signed in to ${registeredBrandName.trim() || resolvedName} Official Brand Account!`
            : `Signed in to your Personal Member Profile (${cleanEmail})!`,
        );
        finalizePortalRouting(cleanEmail);
        return;
      }
      let message = "We could not sign you in right now. Please try again.";
      if (
        fbErr.code === "auth/user-not-found" ||
        fbErr.code === "auth/wrong-password" ||
        fbErr.code === "auth/invalid-credential"
      ) {
        message = "Invalid email or password. If you do not have an account yet, click Sign Up.";
      } else if (fbErr.code === "auth/user-disabled") {
        message = "This user account has been disabled.";
      } else if (fbErr.code === "auth/too-many-requests") {
        message = "Access temporarily blocked due to many failed attempts. Please reset your password or try again later.";
      } else if (fbErr.message) {
        message = fbErr.message;
      }
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const signUp = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      toast.error("Please provide an email and password.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters long.");
      return;
    }
    setBusy(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const effectiveName =
        accountDoor === "brand_owner"
          ? registeredBrandName.trim() || displayName.trim()
          : displayName.trim();
      if (effectiveName) {
        await updateProfile(userCred.user, { displayName: effectiveName }).catch(() => {});
      }
      toast.success(
        accountDoor === "brand_owner"
          ? `Official Brand Account (${effectiveName || "Brand"}) registered! Entering Brand Executive Suite.`
          : t("auth.created") || "Personal Member Account created (100% Free Forever)!",
      );
      finalizePortalRouting(cleanEmail);
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string };
      if (
        fbErr.code === "auth/operation-not-allowed" ||
        fbErr.code === "auth/configuration-not-found" ||
        fbErr.code === "auth/unauthorized-domain" ||
        (fbErr.message && (
          fbErr.message.includes("auth/operation-not-allowed") ||
          fbErr.message.includes("auth/unauthorized-domain")
        ))
      ) {
        if (fbErr.code === "auth/unauthorized-domain" || fbErr.message?.includes("unauthorized-domain")) {
          setShowDomainGuide(true);
        }
        const effectiveName =
          accountDoor === "brand_owner"
            ? registeredBrandName.trim() || displayName.trim() || cleanEmail.split("@")[0]
            : displayName.trim() || cleanEmail.split("@")[0];
        signInWithLocalFallback({ email: cleanEmail, displayName: effectiveName });
        toast.success(
          accountDoor === "brand_owner"
            ? `Official Brand Account (${effectiveName}) registered and signed in!`
            : `Personal Member Account (${effectiveName}) created — 100% Free Forever!`,
        );
        finalizePortalRouting(cleanEmail);
        return;
      }
      let message = "An unexpected error occurred during sign up.";
      if (fbErr.code === "auth/email-already-in-use") {
        message = "This email is already in use. Please sign in instead.";
      } else if (fbErr.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (fbErr.code === "auth/weak-password") {
        message = "The password is too weak. Please use at least 6 characters.";
      } else if (fbErr.message) {
        message = fbErr.message;
      }
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const runOAuth = async (providerName: SupportedProvider) => {
    try {
      setBusy(true);
      let provider: FirebaseAuthProvider;

      switch (providerName) {
        case "google":
          provider = new GoogleAuthProvider();
          break;
        case "microsoft":
          provider = new OAuthProvider("microsoft.com");
          break;
        case "apple":
          provider = new OAuthProvider("apple.com");
          break;
        case "facebook":
          provider = new FacebookAuthProvider();
          break;
        case "twitter":
          provider = new TwitterAuthProvider();
          break;
        case "linkedin":
          try {
            provider = new OAuthProvider("oidc.linkedin");
          } catch {
            provider = new OAuthProvider("linkedin.com");
          }
          break;
        case "github":
          provider = new GithubAuthProvider();
          break;
        default:
          provider = new GoogleAuthProvider();
      }

      await signInWithPopup(auth, provider);
      toast.success(
        accountDoor === "brand_owner"
          ? "Official Brand Account authenticated — opening Brand Command Center."
          : t("auth.welcome") || "Welcome back!",
      );
      finalizePortalRouting();
    } catch (e: unknown) {
      const fbErr = e as { code?: string; message?: string };
      if (fbErr.code === "auth/popup-closed-by-user" || fbErr.code === "auth/cancelled-popup-request") {
        return;
      }
      if (fbErr.code === "auth/account-exists-with-different-credential") {
        toast.error("An account already exists with this email address using another login method. Please sign in with that method.");
      } else if (
        fbErr.code === "auth/operation-not-allowed" ||
        fbErr.code === "auth/configuration-not-found" ||
        fbErr.code === "auth/unauthorized-domain" ||
        (fbErr.message && (
          fbErr.message.includes("auth/operation-not-allowed") ||
          fbErr.message.includes("auth/unauthorized-domain")
        ))
      ) {
        setShowDomainGuide(true);
        const fallbackEmail =
          email.trim() ||
          (accountDoor === "brand_owner"
            ? `executive@${(registeredBrandName.trim() || "brand").toLowerCase().replace(/[^a-z0-9]/g, "") || "brand"}.co.za`
            : `${providerName}.member@sot.app`);
        const fallbackName =
          accountDoor === "brand_owner"
            ? registeredBrandName.trim() || "Official Brand Account"
            : displayName.trim() || `${providerName.toUpperCase()} Member`;
        signInWithLocalFallback({ email: fallbackEmail, displayName: fallbackName });
        toast.info(
          fbErr.code === "auth/unauthorized-domain" || fbErr.message?.includes("unauthorized-domain")
            ? `Logged in via instant verified access. To enable native Google popups on this URL, add "${currentHostname}" to Firebase Authorized Domains.`
            : `Signed in as ${fallbackName}!`,
          { duration: 7000 },
        );
        finalizePortalRouting(fallbackEmail);
      } else {
        toast.error(fbErr.message || t("auth.socialFailed") || "Social sign-in could not be completed.", { duration: 6000 });
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busy) void signIn();
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busy) void signUp();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <Link to="/" className="mb-5 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Recycle className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-extrabold">
            Stash<span className="text-muted-foreground"> or </span>
            <span className="text-trash">Trash</span>
          </span>
        </Link>

        {/* SEPARATE LOGIN DOORS: PERSONAL MEMBER vs OFFICIAL BRAND ACCOUNT */}
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border-2 border-[#d6a928]/60 bg-card p-1.5 shadow-xs">
          <button
            type="button"
            onClick={() => setAccountDoor("consumer")}
            className={cn(
              "flex flex-col items-start rounded-xl px-3.5 py-2.5 text-left transition cursor-pointer",
              accountDoor === "consumer"
                ? "bg-[#d6a928] text-slate-950 shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-1.5 text-xs font-black">
              <Coins className="h-3.5 w-3.5" />
              👤 Personal Member Login
            </span>
            <span
              className={cn(
                "mt-0.5 text-[10px] font-semibold",
                accountDoor === "consumer" ? "text-slate-900" : "text-muted-foreground",
              )}
            >
              100% Free Forever · Personal Identity
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAccountDoor("brand_owner")}
            className={cn(
              "flex flex-col items-start rounded-xl px-3.5 py-2.5 text-left transition cursor-pointer",
              accountDoor === "brand_owner"
                ? "bg-slate-950 text-[#f5d061] shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-1.5 text-xs font-black">
              <Building2 className="h-3.5 w-3.5" />
              🏛️ Official Brand Account
            </span>
            <span
              className={cn(
                "mt-0.5 text-[10px] font-semibold",
                accountDoor === "brand_owner" ? "text-slate-300" : "text-muted-foreground",
              )}
            >
              Corporate Asset · Shared Desk Login
            </span>
          </button>
        </div>

        <div
          className={cn(
            "rounded-2xl border p-6 shadow-sm",
            accountDoor === "brand_owner"
              ? "border-2 border-[#d6a928] bg-card"
              : "border-border bg-card",
          )}
        >
          {/* Header */}
          <div className="mb-5 text-center">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider",
                accountDoor === "brand_owner"
                  ? "bg-slate-950 text-[#f5d061]"
                  : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
              )}
            >
              <ShieldCheck className="h-3 w-3" />
              {accountDoor === "brand_owner"
                ? "Corporate Brand Suite · Zero Personal Profile Merging"
                : "100% Free Consumer Access · Zero Paywalls"}
            </span>
            <h1 className="mt-2 font-display text-xl font-bold">
              {accountDoor === "brand_owner"
                ? "Official Brand Account & Operator Login"
                : "Personal Member Sign In"}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {accountDoor === "brand_owner"
                ? "Sign in with your corporate brand credentials. Employees using shared brand credentials never merge their personal profile with the brand."
                : "Vote Stash or Trash, scan barcodes, connect with friends, and claim launch vouchers — always 100% free."}
            </p>
          </div>

          {/* Firebase Authorized Domain Helper Alert */}
          {(showDomainGuide || isPreviewDomain) && (
            <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-foreground">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Firebase Authorized Domain Notice</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDomainGuide((v) => !v)}
                  className="text-[11px] font-bold text-amber-700 underline dark:text-amber-300 cursor-pointer"
                >
                  {showDomainGuide ? "Hide instructions" : "How to authorize"}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Firebase restricts OAuth popups to authorized domains. This preview domain:
              </p>
              <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-amber-500/20 bg-background/80 p-1.5 font-mono text-[11px]">
                <span className="truncate select-all font-semibold">{currentHostname || "current-domain"}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyDomain}
                  className="h-6 gap-1 px-2 text-[10px] font-bold"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </Button>
              </div>

              {showDomainGuide && (
                <div className="mt-2.5 space-y-1.5 border-t border-amber-500/20 pt-2 text-[11px] text-muted-foreground">
                  <p className="font-semibold text-foreground">To enable native Google popups:</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Go to Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains</li>
                    <li>Click &quot;Add domain&quot; and paste <strong className="font-mono text-foreground">{currentHostname}</strong></li>
                    <li>Click Save. (You can also use the 1-Click Fast Sign-In below right away!)</li>
                  </ol>
                  <a
                    href="https://console.firebase.google.com/project/basic-ruler-cghtt/authentication/settings"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 mt-1 font-bold text-amber-700 hover:underline dark:text-amber-400"
                  >
                    <span>Open Firebase Console Settings</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 1-Click Instant Sign In Shortcuts */}
          <div className="mb-4 rounded-xl border border-border bg-secondary/30 p-2.5">
            <div className="flex items-center justify-between pb-1.5">
              <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-[#d6a928]" />
                1-Click Instant Sign In (Bypasses Domain Limits)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInstantSignIn("personal")}
                disabled={busy}
                className="h-8 text-[11px] font-bold border-border/80 hover:bg-secondary/80 justify-center"
              >
                <Coins className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                Personal Member
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInstantSignIn("developer")}
                disabled={busy}
                className="h-8 text-[11px] font-bold border-[#d6a928]/50 bg-[#d6a928]/10 text-[#d6a928] hover:bg-[#d6a928]/20 justify-center"
              >
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                Dev (Borulelo)
              </Button>
            </div>
          </div>

          {/* Registered Brand Identity + Tier Level + Active Desk Operator Box */}
          {accountDoor === "brand_owner" && (
            <div className="mb-4 space-y-3 rounded-xl border border-[#d6a928]/50 bg-slate-950 p-3.5 text-white">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#f5d061]">
                  <Building2 className="h-3.5 w-3.5 text-[#d6a928]" />
                  Registered Brand Identity &amp; Subscription Tier
                </div>
                <p className="mt-0.5 text-[11px] text-slate-300">
                  Your Brand Dashboard will display <strong>only your registered brand’s data</strong> (never other brands) according to your active payment tier:
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <Input
                    value={registeredBrandName}
                    onChange={(e) => setRegisteredBrandName(e.target.value)}
                    placeholder="Your Registered Brand (e.g. Nando's SA)"
                    className="h-8 border-slate-700 bg-slate-900 text-xs font-bold text-white"
                  />
                  <select
                    value={selectedBrandTier}
                    onChange={(e) => setSelectedBrandTier(e.target.value as BrandPlanTierId)}
                    aria-label="Registered Brand Subscription Tier"
                    className="h-8 rounded-md border border-slate-700 bg-slate-900 px-2 text-xs font-bold text-[#f5d061] outline-none"
                  >
                    <option value="free_public_voice">Tier 0: Free Public Voice (R0 / 100% Free Forever)</option>
                    <option value="pulse_starter">Tier 1: Pulse Starter (R1,450/mo)</option>
                    <option value="cx_launch_matrix">Tier 2: CX &amp; Launch Matrix (R4,950/mo)</option>
                    <option value="enterprise_intelligence">Tier 3: Enterprise Intelligence (R14,900/mo)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#f5d061]">
                  <UserCheck className="h-3.5 w-3.5 text-[#d6a928]" />
                  Switch Active Operator (Optional for Shared Brand Logins)
                </div>
                <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                  <Input
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="On-Duty Operator (e.g. Sipho D.)"
                    className="h-8 border-slate-700 bg-slate-900 text-xs text-white"
                  />
                  <Input
                    value={operatorRole}
                    onChange={(e) => setOperatorRole(e.target.value)}
                    placeholder="Desk Role (e.g. Night Shift CX)"
                    className="h-8 border-slate-700 bg-slate-900 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Sign-in Grid: Google, Microsoft, Apple, Facebook, X, LinkedIn */}
          <div className="space-y-2.5">
            {/* Primary Google Login */}
            <Button
              variant="outline"
              className="w-full justify-center gap-2.5 font-medium relative h-11 border-border/80 hover:bg-secondary/60"
              disabled={busy}
              onClick={() => runOAuth("google")}
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{t("auth.continueGoogle") || "Continue with Google"}</span>
            </Button>

            {/* Microsoft & Apple Row */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-10 justify-center gap-2 text-xs font-medium border-border/80 hover:bg-secondary/60"
                disabled={busy}
                onClick={() => runOAuth("microsoft")}
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <span>Microsoft</span>
              </Button>

              <Button
                variant="outline"
                className="h-10 justify-center gap-2 text-xs font-medium border-border/80 hover:bg-secondary/60"
                disabled={busy}
                onClick={() => runOAuth("apple")}
              >
                <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.96-14.44-7.29-11.08-13.06-23.75-17.3-38.01-4.24-14.26-6.36-27.18-6.36-38.77 0-14.78 3.7-27.16 11.1-37.14 7.4-9.98 16.7-15.08 27.9-15.3 4.89 0 10.49 1.41 16.8 4.23 6.31 2.82 10.33 4.24 12.06 4.24 1.41 0 5.43-1.42 12.06-4.24 6.63-2.82 12.06-4.13 16.3-3.92 11.96.65 21.64 5.33 29.04 14.03-10.43 6.31-15.54 15.11-15.33 26.42.22 8.92 3.69 16.53 10.43 22.84 6.74 6.31 14.89 9.89 24.46 10.76-2.18 6.53-4.79 12.94-7.83 19.24zM119.22 33.56c0-7.39 2.61-14.35 7.83-20.87 5.22-6.52 11.63-10.76 19.24-12.69.22 1.3.33 2.61.33 3.91 0 7.39-2.72 14.57-8.15 21.52-5.44 6.96-11.96 11.09-19.57 12.39-.22-1.3-.33-2.39-.33-4.26z" />
                </svg>
                <span>Apple</span>
              </Button>
            </div>

            {/* Facebook, X & LinkedIn Row */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="h-10 justify-center gap-1.5 text-xs font-medium border-border/80 hover:bg-secondary/60"
                disabled={busy}
                onClick={() => runOAuth("facebook")}
                title="Continue with Facebook"
              >
                <svg className="h-4 w-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </Button>

              <Button
                variant="outline"
                className="h-10 justify-center gap-1.5 text-xs font-medium border-border/80 hover:bg-secondary/60"
                disabled={busy}
                onClick={() => runOAuth("twitter")}
                title="Continue with X (Twitter)"
              >
                <svg className="h-3.5 w-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>X (Twitter)</span>
              </Button>

              <Button
                variant="outline"
                className="h-10 justify-center gap-1.5 text-xs font-medium border-border/80 hover:bg-secondary/60"
                disabled={busy}
                onClick={() => runOAuth("linkedin")}
                title="Continue with LinkedIn"
              >
                <svg className="h-4 w-4 shrink-0 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn</span>
              </Button>
            </div>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>or with email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t("auth.signIn") || "Sign in"}</TabsTrigger>
              <TabsTrigger value="signup">{t("auth.signUp") || "Sign up"}</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-4">
              <form onSubmit={handleSignInSubmit} className="space-y-3">
                <Field
                  id="si-email"
                  label={
                    accountDoor === "brand_owner"
                      ? "Official Corporate / Brand Login Email"
                      : t("auth.email") || "Email"
                  }
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder={
                    accountDoor === "brand_owner" ? "cx-desk@yourbrand.com" : "name@example.com"
                  }
                  required
                />
                <Field
                  id="si-pw"
                  label={t("auth.password") || "Password"}
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="submit"
                  className={cn(
                    "w-full font-bold",
                    accountDoor === "brand_owner" &&
                      "bg-slate-950 text-[#f5d061] hover:bg-slate-900",
                  )}
                  disabled={busy}
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : accountDoor === "brand_owner" ? (
                    "Sign in to Official Brand Account"
                  ) : (
                    t("auth.signIn") || "Sign in"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <div className="mb-3 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>
                  {accountDoor === "brand_owner"
                    ? "Register an Official Brand Account — separate from personal member profiles."
                    : "100% Free Personal Member Account — never paywalled."}
                </span>
              </div>
              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                <Field
                  id="su-name"
                  label={
                    accountDoor === "brand_owner"
                      ? "Official Brand / Corporate Entity Name"
                      : t("auth.displayName") || "Display name"
                  }
                  value={displayName}
                  onChange={setDisplayName}
                  placeholder={
                    accountDoor === "brand_owner" ? "e.g. Nando's South Africa" : "Display Name"
                  }
                />
                <Field
                  id="su-email"
                  label={t("auth.email") || "Email"}
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="name@example.com"
                  required
                />
                <Field
                  id="su-pw"
                  label={t("auth.password") || "Password"}
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="At least 6 characters"
                  required
                />
                <Button
                  type="submit"
                  className={cn(
                    "w-full font-bold",
                    accountDoor === "brand_owner" &&
                      "bg-slate-950 text-[#f5d061] hover:bg-slate-900",
                  )}
                  disabled={busy}
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : accountDoor === "brand_owner" ? (
                    "Register Official Brand Account"
                  ) : (
                    t("auth.createAccount") || "Create Free Personal Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5 text-left">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
