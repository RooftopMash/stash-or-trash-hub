import {
  isFollowingUser,
  followUser,
  getFriendshipBetween,
  updateFriendBondTag,
  type FriendRecord,
} from "@/lib/social";

export type MessagePrivacyLevel =
  | "everyone"
  | "mutuals_and_brands"
  | "tagged_brands_only"
  | "no_one";

export type CallPrivacyLevel =
  | "everyone"
  | "friends_and_brands"
  | "ask_first"
  | "off";

export type BondCategory =
  | "stranger"
  | "colleague"
  | "same_faith"
  | "union_peer"
  | "neighbour"
  | "family";

export type FriendshipState =
  | "none"
  | "pending_outgoing"
  | "pending_incoming"
  | "accepted"
  | "blocked";

export interface UserCommunicationSettings {
  userId: string;
  masterMessagingEnabled: boolean;
  whoCanMessageMe: MessagePrivacyLevel;
  whoCanCallMe: CallPrivacyLevel;
  allowBrandOutreachWithoutPhone: boolean;
  workplace?: string;
  faithCommunity?: string;
  unionOrSector?: string;
  updatedAt: string;
}

export interface PeerRelationshipSummary {
  iFollowThem: boolean;
  theyFollowMe: boolean;
  isMutualFollow: boolean;
  isFriend: boolean;
  friendshipState: FriendshipState;
  friendRecord: FriendRecord | null;
  bondTag: BondCategory;
  sharedWorkplace?: string;
  sharedFaith?: string;
  sharedUnion?: string;
  statusLabel: string;
  badgeColor: string;
}

export interface CallPermissionResult {
  canMessage: boolean;
  canDirectRing: boolean;
  requiresCallRequest: boolean;
  reason: string;
}

const STORAGE_PREFIX = "sot_comm_privacy_v1_";
const BOND_STORAGE_PREFIX = "sot_peer_bonds_v1_";
const CALL_APPROVAL_PREFIX = "sot_call_approvals_v1_";

export const DEFAULT_COMM_SETTINGS: Omit<UserCommunicationSettings, "userId" | "updatedAt"> = {
  masterMessagingEnabled: true,
  whoCanMessageMe: "mutuals_and_brands",
  whoCanCallMe: "friends_and_brands",
  allowBrandOutreachWithoutPhone: true,
  workplace: "",
  faithCommunity: "",
  unionOrSector: "",
};

export const BOND_OPTIONS: Array<{
  id: BondCategory;
  label: string;
  shortBadge: string;
  badgeClass: string;
  description: string;
}> = [
  {
    id: "stranger",
    label: "Stranger (No Bond Set)",
    shortBadge: "👤 Stranger",
    badgeClass: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
    description: "Unconnected user — restricted from direct calling unless you allow Strangers.",
  },
  {
    id: "colleague",
    label: "Colleague / Workmate",
    shortBadge: "💼 Colleague",
    badgeClass: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    description: "Works at the same company, office, or organization.",
  },
  {
    id: "same_faith",
    label: "Same Faith / Fellowship",
    shortBadge: "🕊️ Same Faith",
    badgeClass: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    description: "Shares your faith community or spiritual fellowship.",
  },
  {
    id: "union_peer",
    label: "Trade Union / Sector Peer",
    shortBadge: "✊ Union Peer",
    badgeClass: "border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300",
    description: "Fellow trade union member or industry sector colleague.",
  },
  {
    id: "neighbour",
    label: "Local / Kasi / Neighbour",
    shortBadge: "📍 Local Neighbour",
    badgeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    description: "Shops at the same local retailers and neighbourhood stores.",
  },
  {
    id: "family",
    label: "Gold Circle / Family",
    shortBadge: "🪙 Gold Circle",
    badgeClass: "border-[#d6a928]/50 bg-[#d6a928]/15 text-[#9a740a] dark:text-[#f5d061]",
    description: "Trusted inner circle — always allowed to text and call.",
  },
];

export function getBondMeta(bond: BondCategory) {
  return BOND_OPTIONS.find((b) => b.id === bond) ?? BOND_OPTIONS[0];
}

export function getUserCommunicationSettings(userId?: string | null): UserCommunicationSettings {
  const uid = userId || "anon";
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${uid}`);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UserCommunicationSettings>;
        return {
          ...DEFAULT_COMM_SETTINGS,
          ...parsed,
          userId: uid,
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    } catch {
      // ignore storage errors
    }
  }
  return {
    ...DEFAULT_COMM_SETTINGS,
    userId: uid,
    updatedAt: new Date().toISOString(),
  };
}

export function saveUserCommunicationSettings(
  userId: string,
  patch: Partial<Omit<UserCommunicationSettings, "userId">>,
): UserCommunicationSettings {
  const current = getUserCommunicationSettings(userId);
  const next: UserCommunicationSettings = {
    ...current,
    ...patch,
    userId,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("sot-comm-privacy-updated", { detail: next }));
    } catch {
      // ignore storage errors
    }
  }
  return next;
}

export function getPeerBondTag(myUserId?: string | null, peerId?: string | null): BondCategory {
  if (!myUserId || !peerId) return "stranger";
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(`${BOND_STORAGE_PREFIX}${myUserId}`);
      if (raw) {
        const map = JSON.parse(raw) as Record<string, BondCategory>;
        if (map[peerId]) return map[peerId];
      }
    } catch {
      // ignore
    }
  }
  return "stranger";
}

export function setPeerBondTag(
  myUserId: string,
  peerId: string,
  bond: BondCategory,
): BondCategory {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(`${BOND_STORAGE_PREFIX}${myUserId}`);
      const map: Record<string, BondCategory> = raw ? JSON.parse(raw) : {};
      map[peerId] = bond;
      window.localStorage.setItem(`${BOND_STORAGE_PREFIX}${myUserId}`, JSON.stringify(map));
    } catch {
      // ignore
    }
  }
  void updateFriendBondTag(myUserId, peerId, bond);
  return bond;
}

export async function getRelationshipSummary(
  myUserId: string | undefined | null,
  peerId: string | undefined | null,
): Promise<PeerRelationshipSummary> {
  if (!myUserId || !peerId || myUserId === peerId) {
    return {
      iFollowThem: false,
      theyFollowMe: false,
      isMutualFollow: false,
      isFriend: false,
      friendshipState: "none",
      friendRecord: null,
      bondTag: "stranger",
      statusLabel: "Stranger",
      badgeColor: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
    };
  }

  let iFollowThem = false;
  let theyFollowMe = false;
  let friendRecord: FriendRecord | null = null;
  try {
    const [f1, f2, fr] = await Promise.all([
      isFollowingUser(myUserId, peerId),
      isFollowingUser(peerId, myUserId),
      getFriendshipBetween(myUserId, peerId),
    ]);
    iFollowThem = f1;
    theyFollowMe = f2;
    friendRecord = fr;
  } catch {
    // fallback if offline or non-UUID
  }

  const isMutualFollow = iFollowThem && theyFollowMe;
  let friendshipState: FriendshipState = "none";
  if (friendRecord) {
    if (friendRecord.status === "accepted") {
      friendshipState = "accepted";
    } else if (friendRecord.status === "blocked") {
      friendshipState = "blocked";
    } else if (friendRecord.status === "pending") {
      friendshipState =
        friendRecord.requester_id === myUserId ? "pending_outgoing" : "pending_incoming";
    }
  }
  const isFriend = friendshipState === "accepted";

  let bondTag = getPeerBondTag(myUserId, peerId);
  if (
    bondTag === "stranger" &&
    friendRecord?.bond_tag &&
    friendRecord.bond_tag !== "stranger" &&
    BOND_OPTIONS.some((b) => b.id === friendRecord?.bond_tag)
  ) {
    bondTag = friendRecord.bond_tag as BondCategory;
  }

  // Auto-detect shared Colleague / Faith / Union if both users configured matching tags
  const mySettings = getUserCommunicationSettings(myUserId);
  const peerSettings = getUserCommunicationSettings(peerId);

  const sharedWorkplace =
    mySettings.workplace &&
    peerSettings.workplace &&
    mySettings.workplace.trim().toLowerCase() === peerSettings.workplace.trim().toLowerCase()
      ? mySettings.workplace.trim()
      : undefined;

  const sharedFaith =
    mySettings.faithCommunity &&
    peerSettings.faithCommunity &&
    mySettings.faithCommunity.trim().toLowerCase() ===
      peerSettings.faithCommunity.trim().toLowerCase()
      ? mySettings.faithCommunity.trim()
      : undefined;

  const sharedUnion =
    mySettings.unionOrSector &&
    peerSettings.unionOrSector &&
    mySettings.unionOrSector.trim().toLowerCase() ===
      peerSettings.unionOrSector.trim().toLowerCase()
      ? mySettings.unionOrSector.trim()
      : undefined;

  if (bondTag === "stranger") {
    if (sharedWorkplace) bondTag = "colleague";
    else if (sharedFaith) bondTag = "same_faith";
    else if (sharedUnion) bondTag = "union_peer";
  }

  let statusLabel = "👤 Stranger";
  let badgeColor = "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300";

  if (friendshipState === "blocked") {
    statusLabel = "🚫 Connection Blocked";
    badgeColor = "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300";
  } else if (isFriend) {
    const meta = bondTag !== "stranger" ? getBondMeta(bondTag) : null;
    statusLabel = meta ? `🤝 Friends · ${meta.shortBadge}` : "🤝 Mutual Friends";
    badgeColor = meta
      ? meta.badgeClass
      : "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  } else if (friendshipState === "pending_incoming") {
    statusLabel = "👋 Sent You a Friend Request";
    badgeColor = "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  } else if (friendshipState === "pending_outgoing") {
    statusLabel = "⏳ Friend Request Pending";
    badgeColor = "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300";
  } else if (bondTag !== "stranger") {
    const meta = getBondMeta(bondTag);
    statusLabel = isMutualFollow ? `🤝 Mutual · ${meta.shortBadge}` : meta.shortBadge;
    badgeColor = meta.badgeClass;
  } else if (isMutualFollow) {
    statusLabel = "🤝 Mutual Follow (Connected)";
    badgeColor = "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  } else if (iFollowThem) {
    statusLabel = "✓ Following";
    badgeColor = "border-primary/40 bg-primary/10 text-primary";
  } else if (theyFollowMe) {
    statusLabel = "👋 Follows You (Follow Back)";
    badgeColor = "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }

  return {
    iFollowThem,
    theyFollowMe,
    isMutualFollow,
    isFriend,
    friendshipState,
    friendRecord,
    bondTag,
    sharedWorkplace,
    sharedFaith,
    sharedUnion,
    statusLabel,
    badgeColor,
  };
}

export async function acceptMutualFollow(myUserId: string, peerId: string) {
  await followUser(myUserId, peerId);
}

export function isCallApprovedByRecipient(callerId: string, recipientId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(`${CALL_APPROVAL_PREFIX}${recipientId}`);
    if (!raw) return false;
    const list = JSON.parse(raw) as string[];
    return list.includes(callerId);
  } catch {
    return false;
  }
}

export function approveCallerForSession(recipientId: string, callerId: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(`${CALL_APPROVAL_PREFIX}${recipientId}`);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(callerId)) {
      list.push(callerId);
      window.localStorage.setItem(`${CALL_APPROVAL_PREFIX}${recipientId}`, JSON.stringify(list));
    }
  } catch {
    // ignore
  }
}

export function evaluateCallAndMessagePermission(params: {
  callerId?: string | null;
  recipientId?: string | null;
  callerIsBrand: boolean;
  relationship: PeerRelationshipSummary;
}): CallPermissionResult {
  const { callerId, recipientId, callerIsBrand, relationship } = params;
  if (!recipientId || recipientId === "sot-community-desk" || recipientId.startsWith("brand-")) {
    return {
      canMessage: true,
      canDirectRing: true,
      requiresCallRequest: false,
      reason: "Official SOT Resolution & Brand Channel is open for direct calls and messages.",
    };
  }

  if (relationship.friendshipState === "blocked") {
    return {
      canMessage: false,
      canDirectRing: false,
      requiresCallRequest: false,
      reason: "This connection is blocked. Unblock in your Friends settings to message or call.",
    };
  }

  const recipientSettings = getUserCommunicationSettings(recipientId);
  const mySettings = getUserCommunicationSettings(callerId);

  if (!mySettings.masterMessagingEnabled) {
    return {
      canMessage: false,
      canDirectRing: false,
      requiresCallRequest: false,
      reason: "You currently have Messaging & Calling turned OFF in your Privacy Controls.",
    };
  }

  if (!recipientSettings.masterMessagingEnabled) {
    return {
      canMessage: false,
      canDirectRing: false,
      requiresCallRequest: false,
      reason: "This user has set their Messaging & Calling status to Do Not Disturb / Off.",
    };
  }

  const isTrustedPeer =
    relationship.isFriend ||
    relationship.isMutualFollow ||
    relationship.iFollowThem ||
    relationship.theyFollowMe ||
    relationship.bondTag !== "stranger";

  const preApproved =
    callerId && recipientId ? isCallApprovedByRecipient(callerId, recipientId) : false;

  // 1. Evaluate Messaging
  let canMessage = true;
  if (recipientSettings.whoCanMessageMe === "no_one") {
    canMessage = false;
  } else if (recipientSettings.whoCanMessageMe === "tagged_brands_only") {
    canMessage =
      callerIsBrand ||
      relationship.isFriend ||
      relationship.isMutualFollow ||
      relationship.bondTag !== "stranger";
  } else if (recipientSettings.whoCanMessageMe === "mutuals_and_brands") {
    canMessage =
      isTrustedPeer || (callerIsBrand && recipientSettings.allowBrandOutreachWithoutPhone);
  }

  // 2. Evaluate Voice/Video Calling
  if (recipientSettings.whoCanCallMe === "off") {
    return {
      canMessage,
      canDirectRing: false,
      requiresCallRequest: false,
      reason: "Recipient has Voice & Video Calling turned off.",
    };
  }

  if (preApproved) {
    return {
      canMessage: true,
      canDirectRing: true,
      requiresCallRequest: false,
      reason: "Call request approved by recipient.",
    };
  }

  if (recipientSettings.whoCanCallMe === "ask_first") {
    return {
      canMessage: true,
      canDirectRing: false,
      requiresCallRequest: true,
      reason:
        "Recipient requires a 1-click Call Request handshake before ringing their device.",
    };
  }

  if (recipientSettings.whoCanCallMe === "friends_and_brands") {
    if (callerIsBrand && recipientSettings.allowBrandOutreachWithoutPhone) {
      return {
        canMessage: true,
        canDirectRing: true,
        requiresCallRequest: false,
        reason: "Verified Brand outreach allowed without phone number.",
      };
    }
    if (
      relationship.isFriend ||
      relationship.isMutualFollow ||
      relationship.bondTag !== "stranger"
    ) {
      return {
        canMessage: true,
        canDirectRing: true,
        requiresCallRequest: false,
        reason: `Direct calling enabled (${relationship.statusLabel}).`,
      };
    }
    return {
      canMessage: true,
      canDirectRing: false,
      requiresCallRequest: true,
      reason:
        "You are currently a Stranger to this user. Become Friends, follow each other, or send a Call Request first!",
    };
  }

  return {
    canMessage,
    canDirectRing: true,
    requiresCallRequest: false,
    reason: "Direct calling enabled.",
  };
}
