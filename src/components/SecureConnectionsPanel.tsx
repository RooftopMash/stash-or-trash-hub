import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const providers = [
  { id: "instagram", name: "Instagram", detail: "Identity and social proof" },
  { id: "tiktok", name: "TikTok", detail: "Creator and media verification" },
  { id: "x", name: "X", detail: "Public account verification" },
  { id: "google", name: "Google", detail: "Account continuity" },
  { id: "government_id", name: "Government ID", detail: "Optional high-assurance review" },
] as const;

export function SecureConnectionsPanel({ userId }: { userId: string }) {
  const { data: connections = [] } = useQuery({
    queryKey: ["provider-connections", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_connections" as never)
        .select("provider,status,last_verified_at")
        .eq("user_id", userId);
      if (error) throw error;
      return (data ?? []) as Array<{ provider: string; status: string; last_verified_at: string | null }>;
    },
    enabled: Boolean(userId),
  });

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-stash/10 p-2 text-stash"><ShieldCheck className="h-5 w-5" /></div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-stash">Secure connection layer</p>
          <h2 className="mt-1 font-display text-xl font-extrabold">Verification providers, ready when you are</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Connect trusted signals without exposing provider credentials. Revocation, scopes, and verification timestamps stay auditable.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {providers.map((provider) => {
          const connection = connections.find((item) => item.provider === provider.id);
          const connected = connection?.status === "connected";
          return (
            <div key={provider.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
              <div><p className="text-sm font-bold">{provider.name}</p><p className="text-xs text-muted-foreground">{provider.detail}</p></div>
              <Badge variant={connected ? "default" : "secondary"} className="gap-1 whitespace-nowrap">
                {connected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                {connected ? "Connected" : "Provider-ready"}
              </Badge>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">No access tokens are stored in the browser. Live OAuth adapters can be enabled provider by provider.</p>
    </section>
  );
}
