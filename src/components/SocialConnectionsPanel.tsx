import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Facebook, Linkedin, Youtube, ShieldCheck, Link2, Unlink2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSocialConnections, prepareSocialConnection, disconnectSocialConnection, type SocialProvider } from "@/lib/social-connections";

const providers: Array<{ id: SocialProvider; label: string; description: string; icon: typeof Facebook }> = [
  { id: "facebook", label: "Facebook", description: "Verify public activity and Pages you manage.", icon: Facebook },
  { id: "linkedin", label: "LinkedIn", description: "Verify professional identity and company activity.", icon: Linkedin },
  { id: "youtube", label: "YouTube", description: "Verify channels and public video activity.", icon: Youtube },
];

export function SocialConnectionsPanel({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["social-connections", userId],
    queryFn: () => getSocialConnections(userId),
  });
  const connect = useMutation({
    mutationFn: (provider: SocialProvider) => prepareSocialConnection(userId, provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-connections", userId] });
      toast.success("Connection request saved. OAuth setup is ready for provider credentials.");
    },
    onError: () => toast.error("We could not save this connection request."),
  });
  const disconnect = useMutation({
    mutationFn: (provider: SocialProvider) => disconnectSocialConnection(userId, provider),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["social-connections", userId] }),
    onError: () => toast.error("We could not disconnect this account."),
  });

  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stash/10 text-stash"><ShieldCheck className="h-5 w-5" /></div>
        <div>
          <h2 className="font-display text-lg font-bold">Verified social activity</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Connect accounts to prove that your Stashes and Trashes came from a real profile. We request read-only access and never publish on your behalf.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {providers.map(({ id, label, description, icon: Icon }) => {
          const connection = data.find((item) => item.provider === id);
          const connected = connection?.status === "connected";
          const pending = connection?.status === "pending";
          return (
            <div key={id} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary"><Icon className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{label}</p><p className="truncate text-xs text-muted-foreground">{description}</p></div>
              <Button size="sm" variant={connected ? "outline" : "default"} disabled={isLoading || connect.isPending || disconnect.isPending} onClick={() => (connected ? disconnect.mutate(id) : connect.mutate(id))} className="shrink-0 gap-1.5">
                {connected ? <><Unlink2 className="h-3.5 w-3.5" /> Disconnect</> : <><Link2 className="h-3.5 w-3.5" /> {pending ? "Pending" : "Connect"}</>}
              </Button>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Instagram, TikTok, X, and additional verification providers can plug into this same secure connection layer next.</p>
    </section>
  );
}
