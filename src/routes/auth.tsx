import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Recycle } from "lucide-react";

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

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const signIn = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(t("auth.welcome"));
    navigate({ to: "/" });
  };

  const signUp = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: displayName || email.split("@")[0] },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(t("auth.created"));
    navigate({ to: "/" });
  };

  type LovableProvider = "google" | "apple" | "microsoft";
  type SupabaseProvider = "linkedin" | "twitter";

  const runOAuth = async (provider: LovableProvider | SupabaseProvider) => {
    try {
      if (provider === "linkedin" || provider === "twitter") {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: window.location.origin },
        });
        if (error) throw new Error(error.message);
        return;
      }
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw new Error(result.error.message ?? t("auth.socialFailed"));
      if (result.redirected) return;
      navigate({ to: "/" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("auth.socialFailed"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Recycle className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-extrabold">
            Stash<span className="text-muted-foreground"> or </span>
            <span className="text-trash">Trash</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={() => runOAuth("google")}>
              {t("auth.continueGoogle")}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => runOAuth("apple")}>
              {t("auth.continueApple")}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => runOAuth("microsoft")}>
              {t("auth.continueMicrosoft")}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => runOAuth("linkedin")}>
              {t("auth.continueLinkedIn")}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => runOAuth("twitter")}>
              {t("auth.continueX")}
            </Button>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> {t("auth.or")} <div className="h-px flex-1 bg-border" />
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t("auth.signIn")}</TabsTrigger>
              <TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-4 space-y-3">
              <Field id="si-email" label={t("auth.email")} type="email" value={email} onChange={setEmail} />
              <Field id="si-pw" label={t("auth.password")} type="password" value={password} onChange={setPassword} />
              <Button className="w-full" onClick={signIn} disabled={busy}>
                {busy ? "…" : t("auth.signIn")}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="mt-4 space-y-3">
              <Field id="su-name" label={t("auth.displayName")} value={displayName} onChange={setDisplayName} />
              <Field id="su-email" label={t("auth.email")} type="email" value={email} onChange={setEmail} />
              <Field id="su-pw" label={t("auth.password")} type="password" value={password} onChange={setPassword} />
              <Button className="w-full" onClick={signUp} disabled={busy}>
                {busy ? "…" : t("auth.createAccount")}
              </Button>
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
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1.5 text-left">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
