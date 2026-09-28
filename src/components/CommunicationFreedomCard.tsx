import { useEffect, useState } from "react";
import {
  ShieldCheck,
  PhoneCall,
  MessageSquareLock,
  Briefcase,
  Sparkles,
  Users,
  Check,
  Lock,
  BellOff,
  Store,
  ScanBarcode,
  Video,
  Scale,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getUserCommunicationSettings,
  saveUserCommunicationSettings,
  type CallPrivacyLevel,
  type MessagePrivacyLevel,
  type UserCommunicationSettings,
} from "@/lib/communication-privacy";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CommunicationFreedomCard({
  userId,
  compact = false,
  isBrand = false,
}: {
  userId: string;
  compact?: boolean;
  isBrand?: boolean;
}) {
  const [settings, setSettings] = useState<UserCommunicationSettings>(() =>
    getUserCommunicationSettings(userId),
  );
  const [activeView, setActiveView] = useState<"privacy" | "circles" | "advantages">("privacy");

  useEffect(() => {
    setSettings(getUserCommunicationSettings(userId));
  }, [userId]);

  const updateField = <K extends keyof Omit<UserCommunicationSettings, "userId" | "updatedAt">>(
    key: K,
    value: UserCommunicationSettings[K],
  ) => {
    const next = saveUserCommunicationSettings(userId, { [key]: value });
    setSettings(next);
    toast.success("Communication & Calling privacy updated.");
  };

  const saveCircles = () => {
    const next = saveUserCommunicationSettings(userId, {
      workplace: settings.workplace?.trim() || "",
      faithCommunity: settings.faithCommunity?.trim() || "",
      unionOrSector: settings.unionOrSector?.trim() || "",
    });
    setSettings(next);
    toast.success(
      "Your Colleague, Faith & Union circles saved — shared peers will automatically display their Bond Badge!",
    );
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <MessageSquareLock className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg font-bold">
                My Communication &amp; Calling Freedom
              </h2>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider",
                  settings.masterMessagingEnabled
                    ? "bg-emerald-500/15 text-emerald-600"
                    : "bg-rose-500/15 text-rose-600",
                )}
              >
                {settings.masterMessagingEnabled ? "Calls & Texts Allowed" : "Do Not Disturb (Off)"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Choose who can text or Voice/Video call you on SOT (Strangers vs. Mutual Follows,
              Colleagues, Same Faith &amp; Verified Brands) — your personal phone number is never
              exposed.
            </p>
          </div>
        </div>

        {/* Master Allow / Disallow Usage Switch */}
        <Button
          type="button"
          size="sm"
          variant={settings.masterMessagingEnabled ? "outline" : "destructive"}
          onClick={() => updateField("masterMessagingEnabled", !settings.masterMessagingEnabled)}
          className="gap-1.5 font-bold text-xs"
        >
          {settings.masterMessagingEnabled ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Usage Enabled
            </>
          ) : (
            <>
              <BellOff className="h-3.5 w-3.5" /> Usage Disallowed (DND)
            </>
          )}
        </Button>
      </div>

      {/* Sub-navigation tabs */}
      <div className="mt-4 flex flex-wrap gap-1.5 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveView("privacy")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition",
            activeView === "privacy"
              ? "bg-foreground text-background"
              : "bg-secondary text-muted-foreground hover:text-foreground",
          )}
        >
          <Lock className="h-3.5 w-3.5" /> Who Can Text / Call Me
        </button>
        <button
          type="button"
          onClick={() => setActiveView("circles")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition",
            activeView === "circles"
              ? "bg-foreground text-background"
              : "bg-secondary text-muted-foreground hover:text-foreground",
          )}
        >
          <Users className="h-3.5 w-3.5 text-[#d6a928]" /> Colleague &amp; Faith Circles
        </button>
        {!compact && (
          <button
            type="button"
            onClick={() => setActiveView("advantages")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition",
              activeView === "advantages"
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            <Sparkles className="h-3.5 w-3.5 text-stash" />{" "}
            {isBrand ? "Brand Owner Advantages" : "User & Brand Advantages"}
          </button>
        )}
      </div>

      {activeView === "privacy" && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* 1. Who can message me */}
          <div className="rounded-xl border border-border bg-secondary/20 p-3.5">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-foreground">
              1. Who Can Text / Message Me?
            </label>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Filter out unwanted messages from Strangers while keeping trusted lines open.
            </p>
            <select
              value={settings.whoCanMessageMe}
              onChange={(e) =>
                updateField("whoCanMessageMe", e.target.value as MessagePrivacyLevel)
              }
              disabled={!settings.masterMessagingEnabled}
              className="mt-2.5 h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs font-semibold outline-none"
            >
              <option value="everyone">Everyone (Including Strangers)</option>
              <option value="mutuals_and_brands">
                Mutual Follows + People I Follow + Verified Brands (Recommended)
              </option>
              <option value="tagged_brands_only">
                Only Brands I Tagged in a Post + My Mutual Circle
              </option>
              <option value="no_one">No One / Messages Off</option>
            </select>
          </div>

          {/* 2. Who can Voice / Video call me */}
          <div className="rounded-xl border border-border bg-secondary/20 p-3.5">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-foreground">
              2. Who Can Voice / Video Call Me?
            </label>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Control who can ring your screen or require a 1-click Call Request first.
            </p>
            <select
              value={settings.whoCanCallMe}
              onChange={(e) => updateField("whoCanCallMe", e.target.value as CallPrivacyLevel)}
              disabled={!settings.masterMessagingEnabled}
              className="mt-2.5 h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs font-semibold outline-none"
            >
              <option value="friends_and_brands">
                Mutual Follows, Colleagues/Faith Circle &amp; Verified Brands Only
              </option>
              <option value="ask_first">
                Ask Permission Before Ringing (1-Click Call Request Handshake)
              </option>
              <option value="everyone">Everyone (Including Strangers)</option>
              <option value="off">Do Not Disturb / Calls Off</option>
            </select>
          </div>

          {/* 3. Brand Outreach Without Phone Number Toggle */}
          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d6a928]/40 bg-[#d6a928]/5 p-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <PhoneCall className="h-3.5 w-3.5 text-[#d6a928]" />
                Zero-Phone-Number Brand Resolution Toggle
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Allow Verified Brand Owners to call me on SOT regarding my product posts when they
                do not have my phone number (your private cell number is never shared).
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant={settings.allowBrandOutreachWithoutPhone ? "default" : "outline"}
              onClick={() =>
                updateField(
                  "allowBrandOutreachWithoutPhone",
                  !settings.allowBrandOutreachWithoutPhone,
                )
              }
              className="shrink-0 text-xs font-bold"
            >
              {settings.allowBrandOutreachWithoutPhone ? "Allowed (On)" : "Blocked (Off)"}
            </Button>
          </div>
        </div>
      )}

      {activeView === "circles" && (
        <div className="mt-4 space-y-3">
          <p className="text-xs text-muted-foreground">
            Set your optional real-world circles below. When another SOT user shares the same{" "}
            <strong>Workplace (Colleague)</strong>, <strong>Faith / Fellowship</strong>, or{" "}
            <strong>Trade Union / Sector</strong>, SOT automatically labels your shared bond instead
            of showing them as a <strong>👤 Stranger</strong>.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-bold text-foreground">
                💼 Workplace / Company (Colleagues)
              </label>
              <Input
                value={settings.workplace ?? ""}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, workplace: e.target.value }))
                }
                placeholder="e.g. Eskom, Shoprite, Standard Bank"
                className="h-9 text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold text-foreground">
                🕊️ Faith / Fellowship Community
              </label>
              <Input
                value={settings.faithCommunity ?? ""}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, faithCommunity: e.target.value }))
                }
                placeholder="e.g. Christian, ZCC, Muslim, Anglican"
                className="h-9 text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold text-foreground">
                ✊ Trade Union / Industry Sector
              </label>
              <Input
                value={settings.unionOrSector ?? ""}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, unionOrSector: e.target.value }))
                }
                placeholder="e.g. COSATU, NUMSA, Retail, Mining"
                className="h-9 text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={saveCircles} className="gap-1.5 text-xs font-bold">
              <Briefcase className="h-3.5 w-3.5" /> Save My Bond Circles
            </Button>
          </div>
        </div>
      )}

      {activeView === "advantages" && !compact && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-2">
            <p className="font-display text-sm font-extrabold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> What Users (Consumers) Gain on SOT
            </p>
            <ul className="space-y-1.5 text-muted-foreground leading-relaxed">
              <li>
                • <strong>Power of the Verdict:</strong> Your Stash/Trash vote moves a brand's live
                Trust Score &amp; People's Grade (AAA to F).
              </li>
              <li>
                • <strong>AI Counterfeit Scanner:</strong> Verify barcodes &amp; packaging before
                consuming fake food, medicine, or goods.
              </li>
              <li>
                • <strong>Zero-Phone-Number Calling:</strong> Voice/Video call brands or peers
                without ever giving out your cell number.
              </li>
              <li>
                • <strong>Live Situation Broadcast &amp; CPA Rights:</strong> Broadcast issues live
                on Feed/Brands &amp; download official CPA/CGSO case dockets.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-[#d6a928]/40 bg-[#d6a928]/5 p-3.5 space-y-2">
            <p className="font-display text-sm font-extrabold text-foreground flex items-center gap-1.5">
              <Store className="h-4 w-4 text-[#d6a928]" /> What Brand Owners Gain on SOT
            </p>
            <ul className="space-y-1.5 text-muted-foreground leading-relaxed">
              <li>
                • <strong>Counterfeit &amp; Revenue Recovery:</strong> Spot which retailers leak
                bogus stock and issue genuine replacement vouchers to win back buyers.
              </li>
              <li>
                • <strong>Reach Clients Without Phone Numbers:</strong> Call or video-inspect issues
                with customers directly inside SOT Messaging.
              </li>
              <li>
                • <strong>14–20 Day Brand-First Resolution Window:</strong> Resolve complaints
                before they escalate to the CGSO Ombudsman or NCC.
              </li>
              <li>
                • <strong>Real-Time CX Matrix &amp; Institutional Trust:</strong> Track Service,
                Quality, Value &amp; Delivery scores across Tiers 1–5.
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
