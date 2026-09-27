import { createFileRoute, Link } from "@tanstack/react-router";
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
import { fetchFeed } from "@/lib/stash";
import { fetchBrands } from "@/lib/brands";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Building2, Phone, PhoneCall, Search, Users, Video } from "lucide-react";
import { toast } from "sonner";
import { useRoles } from "@/hooks/useRoles";

export const Route = createFileRoute("/_authenticated/messages")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { to?: string; name?: string; room?: string; call?: "voice" | "video" } => ({
    to: typeof search.to === "string" ? search.to : undefined,
    name: typeof search.name === "string" ? search.name : undefined,
    room: typeof search.room === "string" ? search.room : undefined,
    call:
      search.call === "voice" || search.call === "video"
        ? (search.call as "voice" | "video")
        : undefined,
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isBrand } = useRoles();
  const { to, name: searchPartnerName, room, call } = Route.useSearch();
  const [active, setActive] = useState<string | null>(to ?? "sot-community-desk");
  const [body, setBody] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [directoryFilter, setDirectoryFilter] = useState<"all" | "users" | "brands">("all");
  const [callDialerOpen, setCallDialerOpen] = useState(false);
  const [dialerMode, setDialerMode] = useState<"voice_call" | "video_call">("voice_call");

  useEffect(() => {
    if (to) setActive(to);
  }, [to]);

  const { data: inbox, refetch: refetchInbox } = useQuery({
    queryKey: ["inbox", user?.id],
    queryFn: () => fetchInbox(user!.id),
    enabled: !!user,
  });

  const { data: feedItems } = useQuery({
    queryKey: ["messages-platform-users"],
    queryFn: () => fetchFeed(null),
  });

  const { data: brandsList } = useQuery({
    queryKey: ["messages-platform-brands"],
    queryFn: fetchBrands,
  });

  const directoryUsers = useMemo(() => {
    const map = new Map<string, { id: string; name: string; context: string; kind: "user" }>();
    for (const item of feedItems ?? []) {
      if (item.user_id && item.user_id !== user?.id && !map.has(item.user_id)) {
        map.set(item.user_id, {
          id: item.user_id,
          name: item.authorName || `User ${item.user_id.slice(0, 6)}`,
          context: item.brandName ? `Client post on ${item.brandName}` : item.title.slice(0, 36),
          kind: "user",
        });
      }
    }
    return [...map.values()];
  }, [feedItems, user?.id]);

  const directoryBrands = useMemo(() => {
    return (brandsList ?? []).slice(0, 20).map((b) => ({
      id: b.owner_id || `brand-${b.slug}`,
      name: b.name,
      context: `${b.category || "Verified Brand"} · Direct Brand Line`,
      kind: "brand" as const,
    }));
  }, [brandsList]);

  const filteredContacts = useMemo(() => {
    const q = contactSearch.trim().toLowerCase();
    const combined =
      directoryFilter === "users"
        ? directoryUsers
        : directoryFilter === "brands"
          ? directoryBrands
          : [...directoryUsers, ...directoryBrands];
    return combined
      .filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.context.toLowerCase().includes(q),
      )
      .slice(0, 14);
  }, [directoryUsers, directoryBrands, directoryFilter, contactSearch]);

  const { data: activeName } = useQuery({
    queryKey: ["partner-name", active, searchPartnerName],
    queryFn: async () => {
      if (active === "sot-community-desk") return "SOT Consumer & Brand Calling Desk";
      if (searchPartnerName && active === to) return searchPartnerName;
      const fromUserDir = directoryUsers.find((u) => u.id === active);
      if (fromUserDir) return fromUserDir.name;
      const fromBrandDir = directoryBrands.find((b) => b.id === active);
      if (fromBrandDir) return fromBrandDir.name;
      return partnerName(active!);
    },
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
      <main className="mx-auto grid max-w-5xl gap-4 px-4 py-8 sm:grid-cols-[310px_1fr]">
        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stash/20 bg-stash/5 px-4 py-3 text-sm">
          <div>
            <p className="font-semibold">
              {isBrand
                ? "Brand-to-User Messaging & Direct Calling Service (No Phone Number Needed)"
                : "SOT Messaging & Direct Voice / Video Calling Service"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              All User-to-User, Brand-to-User, and User-to-Brand Voice &amp; Video calls happen right here in Messaging (powered by Google WebRTC &amp; Agora RTC). Want to broadcast a public video cam situation? Head to{" "}
              <Link to="/feed" className="font-bold text-foreground underline">
                Feed
              </Link>{" "}
              or{" "}
              <Link to="/brands" className="font-bold text-foreground underline">
                Brands
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setDialerMode("voice_call");
                setCallDialerOpen(true);
              }}
              className="gap-1.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 font-bold dark:text-emerald-400"
            >
              <PhoneCall className="h-3.5 w-3.5" /> Voice Call Dialer
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setDialerMode("video_call");
                setCallDialerOpen(true);
              }}
              className="gap-1.5 bg-slate-950 text-[#d6a928] hover:bg-slate-900 font-bold"
            >
              <Video className="h-3.5 w-3.5" /> Video Call Dialer
            </Button>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between px-2 py-1">
            <h1 className="font-display text-lg font-bold">{t("messages.title")} &amp; Calls</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              <Phone className="h-2.5 w-2.5" /> Calling Ready
            </span>
          </div>

          {/* Always-available Live Calling Desk channel so users can test/make calls immediately */}
          <button
            type="button"
            onClick={() => setActive("sot-community-desk")}
            className={cn(
              "flex w-full flex-col rounded-lg border border-stash/30 bg-stash/5 px-3 py-2.5 text-left transition-colors hover:bg-stash/10",
              active === "sot-community-desk" && "bg-stash/15 ring-1 ring-stash/40",
            )}
          >
            <span className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                SOT Calling &amp; Resolution Desk
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <Phone className="h-3 w-3" /> <Video className="h-3 w-3" /> Online
              </span>
            </span>
            <span className="mt-0.5 truncate text-[11px] text-muted-foreground">
              Direct Voice &amp; Video Call Room
            </span>
          </button>

          {/* Existing Inbox Conversations */}
          {conversations.length > 0 && (
            <div className="space-y-1">
              <p className="px-2 pt-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Recent Threads
              </p>
              {conversations.map((c) => (
                <button
                  key={c.partnerId}
                  onClick={() => setActive(c.partnerId)}
                  className={cn(
                    "flex w-full flex-col rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent",
                    active === c.partnerId && "bg-accent",
                  )}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-medium text-sm">{c.partnerName}</span>
                    {c.unread > 0 && (
                      <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                        {c.unread}
                      </span>
                    )}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">{c.lastMessage}</span>
                </button>
              ))}
            </div>
          )}

          {/* Direct Brand-to-User, User-to-User & User-to-Brand Calling Directory */}
          <div className="mt-1 border-t border-border pt-3 px-1 flex-1 flex flex-col">
            <p className="px-1.5 pb-1.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              <Users className="h-3 w-3 text-[#d6a928]" />
              {isBrand
                ? "Find & Call Users on SOT (No Phone Needed)"
                : "Call Users or Brands on SOT"}
            </p>

            {/* Search bar to find any user or brand to call */}
            <div className="relative mb-2 px-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Search user or brand to call..."
                className="h-8 w-full rounded-lg border border-border bg-background pr-2 pl-7 text-xs outline-none focus:border-foreground"
              />
            </div>

            {/* Filter pills: All / Users / Brands */}
            <div className="mb-2 flex items-center gap-1 px-1">
              <button
                type="button"
                onClick={() => setDirectoryFilter("all")}
                className={cn(
                  "rounded-md px-2 py-1 text-[10px] font-bold transition",
                  directoryFilter === "all"
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setDirectoryFilter("users")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold transition",
                  directoryFilter === "users"
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                <Users className="h-2.5 w-2.5" /> Users ({directoryUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setDirectoryFilter("brands")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold transition",
                  directoryFilter === "brands"
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                <Building2 className="h-2.5 w-2.5" /> Brands ({directoryBrands.length})
              </button>
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto pr-0.5">
              {filteredContacts.map((c) => (
                <div
                  key={`${c.kind}-${c.id}`}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-secondary/70",
                    active === c.id && "bg-secondary ring-1 ring-[#d6a928]/40",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setActive(c.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="truncate font-bold text-foreground">{c.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{c.context}</p>
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActive(c.id);
                        setDialerMode("voice_call");
                        setCallDialerOpen(true);
                      }}
                      title={`Voice Call ${c.name}`}
                      className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 px-1.5 py-1 text-[10px] font-bold text-emerald-600 hover:bg-emerald-500/20"
                    >
                      <Phone className="h-2.5 w-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActive(c.id);
                        setDialerMode("video_call");
                        setCallDialerOpen(true);
                      }}
                      title={`Video Call ${c.name}`}
                      className="inline-flex items-center gap-0.5 rounded-md bg-primary/10 px-1.5 py-1 text-[10px] font-bold text-primary hover:bg-primary/20"
                    >
                      <Video className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex min-h-[60vh] flex-col rounded-2xl border border-border bg-card overflow-hidden">
          {!active ? (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Select a user or brand to message or start a voice/video call.
            </div>
          ) : (
            <>
              <div className="border-b border-border px-4 py-3 font-semibold flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span>{activeName ?? t("messages.to")}</span>
                  <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {isBrand ? "Brand-to-User Direct Line" : "SOT Direct Messaging & Calling"}
                  </span>
                </div>
                <span className="text-xs font-normal text-muted-foreground">
                  Voice &amp; Video Calling Enabled
                </span>
              </div>

              <LiveCollaborationPanel
                partnerName={activeName ?? "Community Member"}
                isBrandWorkspace={isBrand}
                partnerId={active}
                initialCallMode={call ?? null}
                customRoom={room}
                onOpenFullDialer={(mode) => {
                  setDialerMode(mode);
                  setCallDialerOpen(true);
                }}
              />

              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {active === "sot-community-desk" && (!thread || thread.length === 0) && (
                  <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 text-xs leading-relaxed text-muted-foreground">
                    <p className="font-bold text-foreground">
                      Welcome to SOT Messaging &amp; Direct Voice/Video Calling
                    </p>
                    <p className="mt-1">
                      Select any <strong>User / Client</strong> or <strong>Brand</strong> in the
                      left directory and click <strong>Voice Call</strong> or{" "}
                      <strong>Video Call</strong> above to ring them directly on SOT (powered by
                      Google WebRTC <code>stun.l.google.com</code> &amp; Agora RTC) — even if you do
                      not have their phone number.
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
        open={callDialerOpen}
        onOpenChange={setCallDialerOpen}
        brandName={activeName ?? "Direct SOT Call"}
        brandOwner={isBrand ? "Brand-to-User Direct Call" : "User-to-User Direct Call"}
        productName={`Messaging Call with ${activeName ?? "SOT Member"}`}
        recipientId={active ?? undefined}
        recipientName={activeName ?? undefined}
        defaultMode={dialerMode}
        customRoomChannel={room}
        callDirection={isBrand ? "brand_to_user" : "user_to_user"}
      />
    </div>
  );
}

