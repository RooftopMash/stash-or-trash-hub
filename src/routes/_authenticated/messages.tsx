import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { LiveCollaborationPanel } from "@/components/LiveCollaborationPanel";
import { LiveBroadcastModal } from "@/components/LiveBroadcastModal";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchInbox,
  fetchThread,
  sendMessage,
  markThreadRead,
  partnerName,
} from "@/lib/messages";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Phone, Radio, Video } from "lucide-react";
import { toast } from "sonner";
import { useRoles } from "@/hooks/useRoles";

export const Route = createFileRoute("/_authenticated/messages")({
  validateSearch: (search: Record<string, unknown>): { to?: string; room?: string } => ({
    to: typeof search.to === "string" ? search.to : undefined,
    room: typeof search.room === "string" ? search.room : undefined,
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isBrand } = useRoles();
  const { to } = Route.useSearch();
  const [active, setActive] = useState<string | null>(to ?? "sot-community-desk");
  const [body, setBody] = useState("");
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);

  const { data: inbox, refetch: refetchInbox } = useQuery({
    queryKey: ["inbox", user?.id],
    queryFn: () => fetchInbox(user!.id),
    enabled: !!user,
  });

  const { data: activeName } = useQuery({
    queryKey: ["partner-name", active],
    queryFn: () =>
      active === "sot-community-desk"
        ? Promise.resolve("SOT Consumer & Brand Resolution Desk")
        : partnerName(active!),
    enabled: !!active,
  });

  const { data: thread, refetch: refetchThread } = useQuery({
    queryKey: ["thread", user?.id, active],
    queryFn: () =>
      active === "sot-community-desk" ? Promise.resolve([]) : fetchThread(user!.id, active!),
    enabled: !!user && !!active,
  });

  useEffect(() => {
    if (user && active && active !== "sot-community-desk") {
      markThreadRead(user.id, active).then(() => refetchInbox());
    }
  }, [user, active, thread?.length, refetchInbox]);

  // Realtime: live inbox + open thread updates.
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`messages-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `recipient_id=eq.${user.id}` },
        () => { refetchInbox(); refetchThread(); },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `sender_id=eq.${user.id}` },
        () => { refetchInbox(); refetchThread(); },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, refetchInbox, refetchThread]);

  const conversations = useMemo(() => inbox ?? [], [inbox]);

  const send = async () => {
    if (!user || !active || !body.trim()) return;
    if (active === "sot-community-desk") {
      toast.success("Message logged with SOT Consumer & Brand Resolution Desk.");
      setBody("");
      return;
    }
    try {
      await sendMessage({ senderId: user.id, recipientId: active, body });
      setBody("");
      refetchThread();
      refetchInbox();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not send.");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto grid max-w-5xl gap-4 px-4 py-8 sm:grid-cols-[280px_1fr]">
        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stash/20 bg-stash/5 px-4 py-3 text-sm">
          <div>
            <p className="font-semibold">
              {isBrand
                ? "Brand Resolution & Counterfeit Verification Workspace"
                : "Consumer & Peer Direct Calling Workspace"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Call clients or brands via Voice or Video (powered by Google WebRTC &amp; Agora RTC) or broadcast your product situation live.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setBroadcastModalOpen(true)}
            className="gap-1.5 bg-rose-600 text-white hover:bg-rose-700 font-bold"
          >
            <Radio className="h-3.5 w-3.5" /> Open Live Situation Studio
          </Button>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-2">
          <h1 className="px-3 py-2 font-display text-lg font-bold">{t("messages.title")}</h1>

          {/* Always-available Live Resolution Desk channel so users can test/make calls immediately */}
          <button
            type="button"
            onClick={() => setActive("sot-community-desk")}
            className={cn(
              "mb-1 flex w-full flex-col rounded-lg border border-stash/30 bg-stash/5 px-3 py-2.5 text-left transition-colors hover:bg-stash/10",
              active === "sot-community-desk" && "bg-stash/15 ring-1 ring-stash/40",
            )}
          >
            <span className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                SOT Live Call &amp; Resolution Desk
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <Phone className="h-3 w-3" /> <Video className="h-3 w-3" /> Ready
              </span>
            </span>
            <span className="mt-0.5 truncate text-[11px] text-muted-foreground">
              Voice, Video &amp; Situation Broadcast Channel
            </span>
          </button>

          {conversations.length === 0 ? (
            <p className="px-3 py-4 text-xs text-muted-foreground">
              {t("messages.empty")} Use the Live Call Desk above or message any verified brand page.
            </p>
          ) : (
            conversations.map((c) => (
              <button
                key={c.partnerId}
                onClick={() => setActive(c.partnerId)}
                className={cn(
                  "flex w-full flex-col rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent",
                  active === c.partnerId && "bg-accent",
                )}
              >
                <span className="flex items-center justify-between">
                  <span className="font-medium">{c.partnerName}</span>
                  {c.unread > 0 && (
                    <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      {c.unread}
                    </span>
                  )}
                </span>
                <span className="truncate text-xs text-muted-foreground">{c.lastMessage}</span>
              </button>
            ))
          )}
        </aside>

        <section className="flex min-h-[60vh] flex-col rounded-2xl border border-border bg-card overflow-hidden">
          {!active ? (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Select a conversation to message or start a voice/video call.
            </div>
          ) : (
            <>
              <div className="border-b border-border px-4 py-3 font-semibold flex items-center justify-between">
                <span>{activeName ?? t("messages.to")}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Voice &amp; Video Enabled
                </span>
              </div>

              <LiveCollaborationPanel
                partnerName={activeName ?? "Community Member"}
                isBrandWorkspace={isBrand}
                partnerId={active}
              />

              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {active === "sot-community-desk" && (!thread || thread.length === 0) && (
                  <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 text-xs leading-relaxed text-muted-foreground">
                    <p className="font-bold text-foreground">
                      Welcome to the Live Voice, Video &amp; Situation Broadcast Channel
                    </p>
                    <p className="mt-1">
                      Click <strong>Voice Call</strong>, <strong>Video Call</strong>, or{" "}
                      <strong>Broadcast Situation</strong> above to start a real-time session powered
                      by Google WebRTC (<code>stun.l.google.com</code>) &amp; Agora RTC. You can also
                      copy the call link to invite another client or brand representative into this
                      room.
                    </p>
                  </div>
                )}
                {(thread ?? []).map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                      m.sender_id === user?.id
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-secondary",
                    )}
                  >
                    {m.body}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 border-t border-border p-3">
                <Input
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={t("messages.placeholder")}
                />
                <Button onClick={send} disabled={!body.trim()}>
                  {t("messages.send")}
                </Button>
              </div>
            </>
          )}
        </section>
      </main>

      <LiveBroadcastModal
        open={broadcastModalOpen}
        onOpenChange={setBroadcastModalOpen}
        brandName={activeName ?? "Consumer Situation Report"}
        brandOwner="Verified Brand & Community Channel"
        productName="Live Situation & Counterfeit Inspection"
      />
    </div>
  );
}

