import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  firebaseAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  firebaseErrorMessage,
} from "@/integrations/firebase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Recycle, ChevronDown, ChevronUp, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Stash or Trash" },
      { name: "description", content: "Sign in to post and vote on the Stash or Trash feed." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showSocials, setShowSocials] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tab") === "signup") {
      setActiveTab("signup");
    }
  }, []);

  const signIn = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setBusy(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, cleanEmail, password);
      toast.success(t("auth.welcome"));
      navigate({ to: "/" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during sign in.";
      toast.error(msg);
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
      const credential = await createUserWithEmailAndPassword(firebaseAuth, cleanEmail, password);
      const name = displayName.trim() || cleanEmail.split("@")[0];
      await updateProfile(credential.user, { displayName: name });
      toast.success(t("auth.created"));
      navigate({ to: "/" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during sign up.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  type SupportedProvider = "google" | "facebook" | "apple" | "microsoft" | "linkedin" | "twitter";

  const runOAuth = async (provider: SupportedProvider) => {
    setBusy(true);
    try {
      const authProvider = provider === "google" ? new GoogleAuthProvider()
        : provider === "facebook" ? new FacebookAuthProvider()
          : provider === "twitter" ? new TwitterAuthProvider()
            : new OAuthProvider(provider === "apple" ? "apple.com" : provider === "microsoft" ? "microsoft.com" : "oidc.linkedin");
      await signInWithPopup(firebaseAuth, authProvider);
      toast.success(t("auth.welcome"));
      navigate({ to: "/" });
    } catch (error) {
      toast.error(firebaseErrorMessage(error), { duration: 6000 });
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
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Recycle className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-extrabold">
            Stash<span className="text-muted-foreground"> or </span>
            <span className="text-trash">Trash</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {/* Primary Google Login Button */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-center gap-2 font-medium relative h-11"
              disabled={busy}
              onClick={() => runOAuth("google")}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
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
              )}
              <span>{t("auth.continueGoogle")}</span>
            </Button>

            <button
              type="button"
              onClick={() => setShowSocials((v) => !v)}
              className="flex w-full items-center justify-center gap-1.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{showSocials ? "Fewer social options" : "More social login options"}</span>
              {showSocials ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showSocials && (
              <div className="space-y-2 pt-1">
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2 font-medium"
                  disabled={busy}
                  onClick={() => runOAuth("apple")}
                >
                  {t("auth.continueApple")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2 font-medium"
                  disabled={busy}
                  onClick={() => runOAuth("microsoft")}
                >
                  {t("auth.continueMicrosoft")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2 font-medium"
                  disabled={busy}
                  onClick={() => runOAuth("facebook")}
                >
                  <svg className="h-4 w-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  {t("auth.continueFacebook")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full font-medium"
                  disabled={busy}
                  onClick={() => runOAuth("linkedin")}
                >
                  {t("auth.continueLinkedIn")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full font-medium"
                  disabled={busy}
                  onClick={() => runOAuth("twitter")}
                >
                  {t("auth.continueX")}
                </Button>
              </div>
            )}
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>or with email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t("auth.signIn")}</TabsTrigger>
              <TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-4">
              <form onSubmit={handleSignInSubmit} className="space-y-3">
                <Field
                  id="si-email"
                  label={t("auth.email")}
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="name@example.com"
                  required
                />
                <Field
                  id="si-pw"
                  label={t("auth.password")}
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  required
                />
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Signing in…" : t("auth.signIn")}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <div className="mb-3 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Instant sign-up: email confirmation is enabled and automatic.</span>
              </div>
              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                <Field
                  id="su-name"
                  label={t("auth.displayName")}
                  value={displayName}
                  onChange={setDisplayName}
                  placeholder="Display Name"
                />
                <Field
                  id="su-email"
                  label={t("auth.email")}
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="name@example.com"
                  required
                />
                <Field
                  id="su-pw"
                  label={t("auth.password")}
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="At least 6 characters"
                  required
                />
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Creating account…" : t("auth.createAccount")}
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
