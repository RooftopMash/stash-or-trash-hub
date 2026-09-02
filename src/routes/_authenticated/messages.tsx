import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
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
import { CallModal } from "@/components/CallModal";
import { Phone, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/messages")({
  validateSearch: (search: Record<string, unknown>): { to?: string } => ({
    to: typeof search.to === "string" ? search.to : undefined,
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { to } = Route.useSearch();
  const [active, setActive] = useState<string | null>(to ?? null);
  const [body, setBody] = useState("");
  const [activeCall, setActiveCall] = useState<"audio" | "video" | null>(null);

  const { data: inbox, refetch: refetchInbox } = useQuery({
    queryKey: ["inbox", user?.id],
    queryFn: () => fetchInbox(user!.id),
    enabled: !!user,
  });

  const { data: activeName } = useQuery({
    queryKey: ["partner-name", active],
    queryFn: () => partnerName(active!),
    enabled: !!active,
  });

  const { data: thread, refetch: refetchThread } = useQuery({
    queryKey: ["thread", user?.id, active],
    queryFn: () => fetchThread(user!.id, active!),
    enabled: !!user && !!active,
  });

  useEffect(() => {
    if (user && active) markThreadRead(user.id, active).then(() => refetchInbox());
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
      <main className="mx-auto grid max-w-4xl gap-4 px-4 py-8 sm:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-border bg-card p-2">
          <h1 className="px-3 py-2 font-display text-lg font-bold">{t("messages.title")}</h1>
          {conversations.length === 0 ? (
            <p className="px-3 py-4 text-sm text-muted-foreground">{t("messages.empty")}</p>
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

        <section className="flex min-h-[60vh] flex-col rounded-2xl border border-border bg-card">
          {!active ? (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Select a conversation.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-border px-4 py-3 font-semibold">
                <span>{activeName ?? t("messages.to")}</span>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setActiveCall("audio")}
                    className="h-8 gap-1 text-xs text-primary"
                  >
                    <Phone className="h-4 w-4" /> Call
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setActiveCall("video")}
                    className="h-8 gap-1 text-xs text-primary"
                  >
                    <Video className="h-4 w-4" /> Video
                  </Button>
                </div>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-4">
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

      {/* Live WebRTC In-App Call Overlay */}
      {user && active && activeCall && (
        <CallModal
          open={!!activeCall}
          onClose={() => setActiveCall(null)}
          partnerName={activeName ?? "User"}
          callType={activeCall}
          currentUserId={user.id}
          partnerId={active}
        />
      )}
    </div>
  );
}
