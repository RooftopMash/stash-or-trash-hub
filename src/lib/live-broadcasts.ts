export type BroadcastPersona = "brand_owner" | "consumer";

export type BrandBroadcastCategory =
  | "product_launch"
  | "brand_relaunch"
  | "behind_scenes"
  | "townhall_qa"
  | "flash_drop";

export type ConsumerBroadcastCategory =
  | "counterfeit"
  | "defect"
  | "service"
  | "review";

export interface LiveLaunchPerk {
  title: string;
  promoCode: string;
  discountLabel: string;
  totalAvailable: number;
  claimedCount: number;
}

export interface LiveBroadcastSession {
  id: string;
  roomChannel: string;
  persona: BroadcastPersona;
  brandName: string;
  brandSlug?: string;
  brandOwner: string;
  hostName: string;
  hostRoleLabel: string;
  title: string;
  subtitle: string;
  brandCategory?: BrandBroadcastCategory;
  consumerCategory?: ConsumerBroadcastCategory;
  batchNumber?: string;
  storeLocation?: string;
  isLive: boolean;
  viewerCount: number;
  stashVotes: number;
  trashVotes: number;
  startedAt: string;
  launchPerk?: LiveLaunchPerk;
  followersNotified?: number;
}

export interface ClaimedPerkVoucher {
  id: string;
  broadcastId: string;
  brandName: string;
  title: string;
  promoCode: string;
  discountLabel: string;
  claimedAt: string;
}

const LIVE_SESSIONS_KEY = "sot_live_broadcast_sessions_v1";
const CLAIMED_PERKS_KEY = "sot_claimed_launch_perks_v1";
const VOTED_SESSIONS_KEY = "sot_voted_live_sessions_v1";

export const BRAND_BROADCAST_CATEGORIES: Array<{
  id: BrandBroadcastCategory;
  label: string;
  shortBadge: string;
  description: string;
  accentClass: string;
}> = [
  {
    id: "product_launch",
    label: "New Product Launch",
    shortBadge: "🚀 Product Launch",
    description: "Unveil a new product, menu item, feature, or service live to clients & prospects.",
    accentClass: "border-[#d6a928] bg-[#d6a928] text-slate-950",
  },
  {
    id: "brand_relaunch",
    label: "Brand / Product Relaunch",
    shortBadge: "🔄 Relaunch Special",
    description: "Show clients & prospects how you upgraded your product or service after community verdicts.",
    accentClass: "border-emerald-500 bg-emerald-600 text-white",
  },
  {
    id: "behind_scenes",
    label: "Behind-the-Scenes & Quality Tour",
    shortBadge: "🏭 Quality Tour",
    description: "Broadcast from your kitchen, factory, or store to prove authenticity and hygiene.",
    accentClass: "border-sky-500 bg-sky-600 text-white",
  },
  {
    id: "townhall_qa",
    label: "Live Executive Townhall & Q&A",
    shortBadge: "🎙️ Live Townhall",
    description: "Answer client and prospect questions live on camera and boost your Resolution Grade.",
    accentClass: "border-purple-500 bg-purple-600 text-white",
  },
  {
    id: "flash_drop",
    label: "Flash Perk & Loyalty Drop",
    shortBadge: "🎁 Flash Perk Drop",
    description: "Reward live viewers with limited-edition launch vouchers and instant digital perks.",
    accentClass: "border-rose-500 bg-rose-600 text-white",
  },
];

export const CONSUMER_BROADCAST_CATEGORIES: Array<{
  id: ConsumerBroadcastCategory;
  label: string;
  shortBadge: string;
}> = [
  {
    id: "counterfeit",
    label: "Suspected Fake / Counterfeit",
    shortBadge: "🛡️ Counterfeit Alert",
  },
  {
    id: "defect",
    label: "Defective / Expired Batch",
    shortBadge: "⚠️ Batch Defect",
  },
  {
    id: "service",
    label: "In-Store / Queue Situation",
    shortBadge: "🏪 Live Situation",
  },
  {
    id: "review",
    label: "Verified Product Review",
    shortBadge: "🪙 Live Review",
  },
];

const DEFAULT_LIVE_SESSIONS: LiveBroadcastSession[] = [
  {
    id: "live-nandos-launch",
    roomChannel: "sot-live-nandos-launch",
    persona: "brand_owner",
    brandName: "Nando's",
    brandSlug: "nandos",
    brandOwner: "Nando's South Africa Official",
    hostName: "Chef Thuli & CX Team",
    hostRoleLabel: "Verified Brand Owner · Product Innovation",
    title: "LIVE LAUNCH: Peri-Honey & Smoky Mozambican Flame Reveal",
    subtitle:
      "Tasting the new limited-edition bastion basting live from our central test kitchen. Cast your Stash or Trash verdict live & claim your 25% tasting voucher!",
    brandCategory: "product_launch",
    storeLocation: "Johannesburg Test Kitchen · National Rollout",
    isLive: true,
    viewerCount: 348,
    stashVotes: 289,
    trashVotes: 19,
    startedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    followersNotified: 4280,
    launchPerk: {
      title: "25% Off New Peri-Honey Launch Meal",
      promoCode: "NANDOS_SOT_LAUNCH25",
      discountLabel: "25% OFF LAUNCH VOUCHER",
      totalAvailable: 200,
      claimedCount: 142,
    },
  },
  {
    id: "live-takealot-relaunch",
    roomChannel: "sot-live-takealot-relaunch",
    persona: "brand_owner",
    brandName: "Takealot",
    brandSlug: "takealot",
    brandOwner: "Takealot Group Operations",
    hostName: "Sipho D. (VP Logistics & CX)",
    hostRoleLabel: "Verified Brand Executive · Operations",
    title: "RELAUNCH: 45-Minute Pickup & Instant Return Refund Desk",
    subtitle:
      "You trashed slow courier refunds last month — we rebuilt our pickup locker return flow. Watch a live 60-second refund demo and test us live!",
    brandCategory: "brand_relaunch",
    storeLocation: "Cape Town & Midrand Fulfillment Hubs",
    isLive: true,
    viewerCount: 215,
    stashVotes: 176,
    trashVotes: 24,
    startedAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    followersNotified: 6150,
    launchPerk: {
      title: "Free Next-Day Express Delivery Pass",
      promoCode: "SOT_RELAUNCH_SHIP",
      discountLabel: "FREE EXPRESS DELIVERY",
      totalAvailable: 500,
      claimedCount: 319,
    },
  },
  {
    id: "live-bathu-tour",
    roomChannel: "sot-live-bathu-tour",
    persona: "brand_owner",
    brandName: "Bathu",
    brandSlug: "bathu",
    brandOwner: "Bathu Swag Official",
    hostName: "Theo Baloyi & Design Lab",
    hostRoleLabel: "Verified Founder · Brand Showcase",
    title: "BEHIND THE SCENES: Spotting Genuine Mesh Edition vs Counterfeits",
    subtitle:
      "Walking through our Midrand assembly line showing the official holographic serial stitch so you never get tricked by grey-market fakes.",
    brandCategory: "behind_scenes",
    batchNumber: "BT-2026-AUTH",
    storeLocation: "Midrand Production Studio",
    isLive: true,
    viewerCount: 184,
    stashVotes: 168,
    trashVotes: 6,
    startedAt: new Date(Date.now() - 41 * 60 * 1000).toISOString(),
    followersNotified: 3190,
    launchPerk: {
      title: "R250 Off Authentic Mesh Sneaker Drop",
      promoCode: "BATHU_REAL_250",
      discountLabel: "R250 LAUNCH REWARD",
      totalAvailable: 150,
      claimedCount: 98,
    },
  },
  {
    id: "live-consumer-situation-1",
    roomChannel: "sot-live-consumer-spaza",
    persona: "consumer",
    brandName: "Community Alert · Batch Check",
    brandOwner: "Consumer Watchdog Stream",
    hostName: "Thabo M. (Level 4 Arbitrator)",
    hostRoleLabel: "Verified Consumer · Gold Circle",
    title: "LIVE SITUATION: Checking Barcode & Seal on Bulk Cooking Oil Special",
    subtitle:
      "Standing at the wholesale aisle comparing the QR batch number on SOT Scanner before buying for our stokvel.",
    consumerCategory: "counterfeit",
    batchNumber: "LOT-8841-ZA",
    storeLocation: "Soweto Wholesale Market",
    isLive: true,
    viewerCount: 92,
    stashVotes: 81,
    trashVotes: 11,
    startedAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
  },
];

function emitLiveBroadcastUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("sot-live-broadcasts-changed"));
  if (typeof BroadcastChannel !== "undefined") {
    try {
      const bc = new BroadcastChannel("sot-live-broadcasts-sync");
      bc.postMessage({ type: "sync", timestamp: Date.now() });
      bc.close();
    } catch {
      // ignore
    }
  }
}

export function getLiveBroadcastSessions(): LiveBroadcastSession[] {
  if (typeof window === "undefined") return DEFAULT_LIVE_SESSIONS;
  try {
    const raw = window.localStorage.getItem(LIVE_SESSIONS_KEY);
    if (!raw) {
      window.localStorage.setItem(LIVE_SESSIONS_KEY, JSON.stringify(DEFAULT_LIVE_SESSIONS));
      return DEFAULT_LIVE_SESSIONS;
    }
    const parsed = JSON.parse(raw) as LiveBroadcastSession[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_LIVE_SESSIONS;
    }
    return parsed;
  } catch {
    return DEFAULT_LIVE_SESSIONS;
  }
}

export function publishLiveBroadcastSession(
  session: Omit<LiveBroadcastSession, "id" | "startedAt" | "isLive"> & {
    id?: string;
  },
): LiveBroadcastSession {
  const existing = getLiveBroadcastSessions();
  const created: LiveBroadcastSession = {
    ...session,
    id: session.id || `live-${Date.now()}`,
    isLive: true,
    startedAt: new Date().toISOString(),
  };
  const filtered = existing.filter((s) => s.roomChannel !== created.roomChannel && s.id !== created.id);
  const updated = [created, ...filtered].slice(0, 16);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LIVE_SESSIONS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  emitLiveBroadcastUpdate();
  return created;
}

export function voteOnLiveBroadcast(
  broadcastId: string,
  verdict: "stash" | "trash",
): { session: LiveBroadcastSession | null; alreadyVoted: boolean } {
  const sessions = getLiveBroadcastSessions();
  const idx = sessions.findIndex((s) => s.id === broadcastId);
  if (idx === -1) return { session: null, alreadyVoted: false };

  let votedMap: Record<string, "stash" | "trash"> = {};
  if (typeof window !== "undefined") {
    try {
      votedMap = JSON.parse(window.localStorage.getItem(VOTED_SESSIONS_KEY) || "{}");
    } catch {
      votedMap = {};
    }
  }

  const prevVote = votedMap[broadcastId];
  const target = { ...sessions[idx] };

  if (prevVote === verdict) {
    return { session: target, alreadyVoted: true };
  }

  if (prevVote === "stash") target.stashVotes = Math.max(0, target.stashVotes - 1);
  if (prevVote === "trash") target.trashVotes = Math.max(0, target.trashVotes - 1);

  if (verdict === "stash") target.stashVotes += 1;
  else target.trashVotes += 1;

  sessions[idx] = target;
  votedMap[broadcastId] = verdict;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LIVE_SESSIONS_KEY, JSON.stringify(sessions));
      window.localStorage.setItem(VOTED_SESSIONS_KEY, JSON.stringify(votedMap));
    } catch {
      // ignore
    }
  }
  emitLiveBroadcastUpdate();
  return { session: target, alreadyVoted: false };
}

export function getUserLiveVote(broadcastId: string): "stash" | "trash" | null {
  if (typeof window === "undefined") return null;
  try {
    const votedMap = JSON.parse(window.localStorage.getItem(VOTED_SESSIONS_KEY) || "{}");
    return votedMap[broadcastId] ?? null;
  } catch {
    return null;
  }
}

export function claimLiveLaunchPerk(broadcastId: string): {
  voucher: ClaimedPerkVoucher | null;
  alreadyClaimed: boolean;
} {
  const sessions = getLiveBroadcastSessions();
  const idx = sessions.findIndex((s) => s.id === broadcastId);
  if (idx === -1 || !sessions[idx].launchPerk) {
    return { voucher: null, alreadyClaimed: false };
  }

  const existingClaims = getClaimedLaunchPerks();
  const existing = existingClaims.find((c) => c.broadcastId === broadcastId);
  if (existing) {
    return { voucher: existing, alreadyClaimed: true };
  }

  const target = { ...sessions[idx] };
  const perk = { ...target.launchPerk! };
  if (perk.claimedCount < perk.totalAvailable) {
    perk.claimedCount += 1;
  }
  target.launchPerk = perk;
  sessions[idx] = target;

  const voucher: ClaimedPerkVoucher = {
    id: `perk-${Date.now()}`,
    broadcastId,
    brandName: target.brandName,
    title: perk.title,
    promoCode: perk.promoCode,
    discountLabel: perk.discountLabel,
    claimedAt: new Date().toISOString(),
  };

  const nextClaims = [voucher, ...existingClaims];
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LIVE_SESSIONS_KEY, JSON.stringify(sessions));
      window.localStorage.setItem(CLAIMED_PERKS_KEY, JSON.stringify(nextClaims));
    } catch {
      // ignore
    }
  }
  emitLiveBroadcastUpdate();
  return { voucher, alreadyClaimed: false };
}

export function getClaimedLaunchPerks(): ClaimedPerkVoucher[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CLAIMED_PERKS_KEY);
    if (!raw) {
      const seed: ClaimedPerkVoucher[] = [
        {
          id: "perk-seed-1",
          broadcastId: "live-nandos-launch",
          brandName: "Nando's",
          title: "25% Off New Peri-Honey Launch Meal",
          promoCode: "NANDOS_SOT_LAUNCH25",
          discountLabel: "25% OFF LAUNCH VOUCHER",
          claimedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
        },
      ];
      window.localStorage.setItem(CLAIMED_PERKS_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
