export interface BrandDeskOperator {
  id: string;
  name: string;
  roleTitle: string;
  shiftLabel: string;
  activeSince: string;
  trashesTurnedToStash: number;
  vouchersIssued: number;
  medianResponseMinutes: number;
  clientCallRating: number;
  liveBroadcastsHosted: number;
  sotOperatorScore: number;
  awardBadge: string;
}

export interface OperatorShiftLogEntry {
  id: string;
  operatorId: string;
  operatorName: string;
  operatorRole: string;
  actionType: "shift_handover" | "client_call" | "voucher_issued" | "launch_broadcast" | "trash_to_stash";
  summary: string;
  timestamp: string;
}

export interface CxLifecycleRecord {
  id: string;
  brandName: string;
  clientName: string;
  stage1LaunchSource: string;
  stage2ScanOrPostSignal: string;
  initialVerdict: "trash" | "stash";
  operatorAssigned: string;
  actionTaken: string;
  voucherCode?: string;
  finalVerdict: "stash" | "trash" | "pending";
  revenueRetainedZar: number;
  updatedAt: string;
}

export type BrandPlanTierId = "pulse_starter" | "cx_launch_matrix" | "enterprise_intelligence";

export interface BrandSubscriptionPlan {
  id: BrandPlanTierId;
  name: string;
  tagline: string;
  targetAudience: string;
  priceZarMonthly: number;
  priceUsdMonthly: number;
  broadcastLimitLabel: string;
  operatorSeatsLabel: string;
  dataExtractionFeatures: string[];
  highlighted?: boolean;
}

export interface BrandSubscriptionReceipt {
  id: string;
  brandName: string;
  planId: BrandPlanTierId;
  planName: string;
  paymentMethod: "google_pay" | "paystack_eft" | "stripe_card" | "corporate_invoice";
  amountDisplay: string;
  referenceCode: string;
  operatorOnDuty: string;
  status: "active" | "pro_forma_issued";
  createdAt: string;
}

const OPERATORS_KEY = "sot_brand_desk_operators_v1";
const ACTIVE_OPERATOR_ID_KEY = "sot_active_desk_operator_id_v1";
const OPERATOR_LOG_KEY = "sot_brand_operator_logs_v1";
const CX_LIFECYCLE_KEY = "sot_brand_cx_lifecycle_v1";
const BRAND_SUBSCRIPTION_KEY = "sot_brand_subscription_state_v1";

export const B2B_BRAND_PLANS: BrandSubscriptionPlan[] = [
  {
    id: "pulse_starter",
    name: "01. Pulse Starter (SME & Local Hero)",
    tagline: "Essential brand presence & verified public responses",
    targetAudience: "For Spazas, Local Stores & Emerging SMEs",
    priceZarMonthly: 1450,
    priceUsdMonthly: 85,
    broadcastLimitLabel: "15-Min Live Broadcasts (2 / mo)",
    operatorSeatsLabel: "Up to 2 Active Desk Operators",
    dataExtractionFeatures: [
      "Official Claimed Brand Profile & Verified Trust Seal",
      "Live Stash vs Trash Barometer & People's SOT Grade",
      "Switch Active Operator (2 Staff Shift Seats)",
      "15-Minute Product Showcase Broadcasts",
    ],
  },
  {
    id: "cx_launch_matrix",
    name: "02. Full-Cycle CX & Launch Matrix",
    tagline: "Complete Launch-to-Resolution data extraction & client calling",
    targetAudience: "For National Retailers, Fast Food, FMCG & Growth Brands",
    priceZarMonthly: 4950,
    priceUsdMonthly: 290,
    broadcastLimitLabel: "60-Min Commercial Launch & Relaunch Studio",
    operatorSeatsLabel: "Up to 10 Active Desk Operators + Leaderboard",
    highlighted: true,
    dataExtractionFeatures: [
      "Full-Cycle CX Data Matrix (Launch ➔ Trash Callout ➔ Voucher ➔ Stash Flip)",
      "60-Min Live Product Launch & Relaunch Studio + 1-Click Promo Drops",
      "Zero-Phone-Number Direct Client Calling & Request-to-Call Desk",
      "Employee & Operator Performance Leaderboard (Track Trash-to-Stash ROI)",
      "Exportable CSV / Executive CX Intelligence Reports",
    ],
  },
  {
    id: "enterprise_intelligence",
    name: "03. Enterprise Intelligence & Awards Suite",
    tagline: "Unlimited broadcasts, counterfeit radar & SOrT Employee Awards",
    targetAudience: "For Banks, Telcos, Airlines, Multinationals & Agencies",
    priceZarMonthly: 14900,
    priceUsdMonthly: 890,
    broadcastLimitLabel: "Unlimited HD Commercial Broadcasts + Home Stage Priority",
    operatorSeatsLabel: "Unlimited Desk Operators + Official SOrT Staff Awards",
    dataExtractionFeatures: [
      "Everything in CX & Launch Matrix + Priority Home Feed Broadcast Stage",
      "Counterfeit & Grey-Market Leak Radar (Store, Batch & Geo Scan Extraction)",
      "Official SOrT Employee Recognition Awards & Downloadable Staff Certificates",
      "14–20 Business Day CPA Pre-Escalation Shield (Before CGSO / NCC)",
      "AI CX Copilot & Multi-Branch Executive Telemetry API",
    ],
  },
];

const DEFAULT_OPERATORS: BrandDeskOperator[] = [
  {
    id: "op-lerato",
    name: "Lerato Mokoena",
    roleTitle: "Senior CX & Launch Desk Lead",
    shiftLabel: "Day Shift (08:00–17:00)",
    activeSince: "2026-01-15",
    trashesTurnedToStash: 42,
    vouchersIssued: 38,
    medianResponseMinutes: 11,
    clientCallRating: 4.95,
    liveBroadcastsHosted: 9,
    sotOperatorScore: 97,
    awardBadge: "🏆 SOrT Star CX Operator of the Month",
  },
  {
    id: "op-sipho",
    name: "Sipho Dlamini",
    roleTitle: "Client Resolution & Recovery Specialist",
    shiftLabel: "Afternoon / Evening Shift",
    activeSince: "2026-02-10",
    trashesTurnedToStash: 31,
    vouchersIssued: 29,
    medianResponseMinutes: 16,
    clientCallRating: 4.85,
    liveBroadcastsHosted: 5,
    sotOperatorScore: 91,
    awardBadge: "⚡ Rapid Trash-to-Stash Turnaround Award",
  },
  {
    id: "op-thandi",
    name: "Thandi Ndlovu",
    roleTitle: "Counterfeit & Batch Quality Auditor",
    shiftLabel: "Quality & Supply Chain Desk",
    activeSince: "2026-03-01",
    trashesTurnedToStash: 24,
    vouchersIssued: 22,
    medianResponseMinutes: 19,
    clientCallRating: 4.8,
    liveBroadcastsHosted: 6,
    sotOperatorScore: 88,
    awardBadge: "🛡️ Counterfeit Intercept Champion",
  },
];

const DEFAULT_CX_LIFECYCLE: CxLifecycleRecord[] = [
  {
    id: "cx-101",
    brandName: "Nando's",
    clientName: "Thabo M. (Verified Voter)",
    stage1LaunchSource: "Watched 'Peri-Honey Launch Broadcast' (Claimed 25% Code)",
    stage2ScanOrPostSignal: "Posted Trash Callout: Drive-thru missing peri-chips at Sandton",
    initialVerdict: "trash",
    operatorAssigned: "Lerato Mokoena (Senior CX Desk)",
    actionTaken: "Zero-Phone-Number SOT Video Call + Issued Recovery Voucher",
    voucherCode: "SOT_RECOVER_NANDOS_412",
    finalVerdict: "stash",
    revenueRetainedZar: 1850,
    updatedAt: "14 mins ago",
  },
  {
    id: "cx-102",
    brandName: "Takealot",
    clientName: "Zanele K. (Gold Arbitrator)",
    stage1LaunchSource: "Watched '45-Min Locker Relaunch Broadcast'",
    stage2ScanOrPostSignal: "Scanned Barcode #LOT-882 on /scan — Flagged damaged outer box",
    initialVerdict: "trash",
    operatorAssigned: "Sipho Dlamini (Resolution Desk)",
    actionTaken: "1-Click Request-to-Call Approved + Express Replacement Dispatched",
    voucherCode: "SOT_RECOVER_TAKEAL_809",
    finalVerdict: "stash",
    revenueRetainedZar: 3400,
    updatedAt: "42 mins ago",
  },
  {
    id: "cx-103",
    brandName: "Bathu",
    clientName: "Kabelo S. (Level 4 Watchdog)",
    stage1LaunchSource: "Watched 'Midrand Factory Quality Tour'",
    stage2ScanOrPostSignal: "Reported suspected grey-market sneaker stall in CBD via /scan",
    initialVerdict: "trash",
    operatorAssigned: "Thandi Ndlovu (Quality Auditor)",
    actionTaken: "Logged Counterfeit Leak Location + Issued Genuine Store Voucher",
    voucherCode: "BATHU_REAL_250",
    finalVerdict: "stash",
    revenueRetainedZar: 2200,
    updatedAt: "2 hours ago",
  },
];

function emitOperatorUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("sot-brand-operator-updated"));
  }
}

export function getBrandDeskOperators(): BrandDeskOperator[] {
  if (typeof window === "undefined") return DEFAULT_OPERATORS;
  try {
    const raw = window.localStorage.getItem(OPERATORS_KEY);
    if (!raw) {
      window.localStorage.setItem(OPERATORS_KEY, JSON.stringify(DEFAULT_OPERATORS));
      return DEFAULT_OPERATORS;
    }
    const parsed = JSON.parse(raw) as BrandDeskOperator[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_OPERATORS;
  } catch {
    return DEFAULT_OPERATORS;
  }
}

export function getActiveDeskOperator(): BrandDeskOperator {
  const list = getBrandDeskOperators();
  if (typeof window === "undefined") return list[0];
  try {
    const activeId = window.localStorage.getItem(ACTIVE_OPERATOR_ID_KEY);
    return list.find((o) => o.id === activeId) ?? list[0];
  } catch {
    return list[0];
  }
}

export function switchActiveDeskOperator(operatorId: string): BrandDeskOperator {
  const list = getBrandDeskOperators();
  const chosen = list.find((o) => o.id === operatorId) ?? list[0];
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ACTIVE_OPERATOR_ID_KEY, chosen.id);
      logOperatorAction({
        operatorId: chosen.id,
        operatorName: chosen.name,
        operatorRole: chosen.roleTitle,
        actionType: "shift_handover",
        summary: `Active Brand Desk handed over to ${chosen.name} (${chosen.roleTitle} · ${chosen.shiftLabel}). Personal user profile remains 100% separated.`,
      });
    } catch {
      // ignore
    }
  }
  emitOperatorUpdate();
  return chosen;
}

export function addAndSwitchDeskOperator(params: {
  name: string;
  roleTitle: string;
  shiftLabel?: string;
}): BrandDeskOperator {
  const list = getBrandDeskOperators();
  const newOp: BrandDeskOperator = {
    id: `op-${Date.now()}`,
    name: params.name.trim(),
    roleTitle: params.roleTitle.trim() || "Authorized Brand CX Operator",
    shiftLabel: params.shiftLabel?.trim() || "Active Shift Desk",
    activeSince: new Date().toISOString().slice(0, 10),
    trashesTurnedToStash: 1,
    vouchersIssued: 1,
    medianResponseMinutes: 12,
    clientCallRating: 5.0,
    liveBroadcastsHosted: 1,
    sotOperatorScore: 90,
    awardBadge: "🌟 Verified Brand Desk Custodian",
  };
  const next = [newOp, ...list];
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(OPERATORS_KEY, JSON.stringify(next));
      window.localStorage.setItem(ACTIVE_OPERATOR_ID_KEY, newOp.id);
      logOperatorAction({
        operatorId: newOp.id,
        operatorName: newOp.name,
        operatorRole: newOp.roleTitle,
        actionType: "shift_handover",
        summary: `Registered & activated new Brand Desk Operator: ${newOp.name} (${newOp.roleTitle}).`,
      });
    } catch {
      // ignore
    }
  }
  emitOperatorUpdate();
  return newOp;
}

export function recordOperatorResolutionMetric(
  actionType: "client_call" | "voucher_issued" | "launch_broadcast" | "trash_to_stash",
  detailSummary: string,
) {
  const active = getActiveDeskOperator();
  const list = getBrandDeskOperators().map((op) => {
    if (op.id !== active.id) return op;
    return {
      ...op,
      trashesTurnedToStash:
        actionType === "trash_to_stash" ? op.trashesTurnedToStash + 1 : op.trashesTurnedToStash,
      vouchersIssued:
        actionType === "voucher_issued" ? op.vouchersIssued + 1 : op.vouchersIssued,
      liveBroadcastsHosted:
        actionType === "launch_broadcast" ? op.liveBroadcastsHosted + 1 : op.liveBroadcastsHosted,
      sotOperatorScore: Math.min(100, op.sotOperatorScore + 1),
    };
  });

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(OPERATORS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
  logOperatorAction({
    operatorId: active.id,
    operatorName: active.name,
    operatorRole: active.roleTitle,
    actionType,
    summary: detailSummary,
  });
  emitOperatorUpdate();
}

export function logOperatorAction(
  entry: Omit<OperatorShiftLogEntry, "id" | "timestamp">,
): OperatorShiftLogEntry {
  const full: OperatorShiftLogEntry = {
    ...entry,
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
  if (typeof window !== "undefined") {
    try {
      const existing = getOperatorShiftLogs();
      const updated = [full, ...existing].slice(0, 25);
      window.localStorage.setItem(OPERATOR_LOG_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return full;
}

export function getOperatorShiftLogs(): OperatorShiftLogEntry[] {
  const seed: OperatorShiftLogEntry[] = [
    {
      id: "seed-log-1",
      operatorId: "op-lerato",
      operatorName: "Lerato Mokoena",
      operatorRole: "Senior CX & Launch Desk Lead",
      actionType: "trash_to_stash",
      summary:
        "Resolved Sandton drive-thru Trash callout via SOT Video Call & flipped client verdict to Stash.",
      timestamp: "09:42",
    },
    {
      id: "seed-log-2",
      operatorId: "op-sipho",
      operatorName: "Sipho Dlamini",
      operatorRole: "Client Resolution Specialist",
      actionType: "voucher_issued",
      summary: "Issued Revenue Recovery Voucher SOT_RECOVER_TAKEAL_809 after barcode scan alert.",
      timestamp: "09:15",
    },
  ];
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(OPERATOR_LOG_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seed;
  } catch {
    return seed;
  }
}

export function getCxLifecycleMatrix(): CxLifecycleRecord[] {
  if (typeof window === "undefined") return DEFAULT_CX_LIFECYCLE;
  try {
    const raw = window.localStorage.getItem(CX_LIFECYCLE_KEY);
    if (!raw) {
      window.localStorage.setItem(CX_LIFECYCLE_KEY, JSON.stringify(DEFAULT_CX_LIFECYCLE));
      return DEFAULT_CX_LIFECYCLE;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CX_LIFECYCLE;
  } catch {
    return DEFAULT_CX_LIFECYCLE;
  }
}

export function addCxLifecycleResolution(record: Omit<CxLifecycleRecord, "id" | "updatedAt">) {
  const existing = getCxLifecycleMatrix();
  const created: CxLifecycleRecord = {
    ...record,
    id: `cx-${Date.now()}`,
    updatedAt: "Just now",
  };
  const next = [created, ...existing];
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CX_LIFECYCLE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }
  emitOperatorUpdate();
  return created;
}

export function getActiveBrandSubscription(): {
  activePlanId: BrandPlanTierId;
  receipts: BrandSubscriptionReceipt[];
} {
  const fallback = {
    activePlanId: "cx_launch_matrix" as BrandPlanTierId,
    receipts: [] as BrandSubscriptionReceipt[],
  };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(BRAND_SUBSCRIPTION_KEY);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function recordBrandSubscriptionPayment(params: {
  brandName: string;
  planId: BrandPlanTierId;
  paymentMethod: BrandSubscriptionReceipt["paymentMethod"];
  currency: "ZAR" | "USD";
}): BrandSubscriptionReceipt {
  const plan = B2B_BRAND_PLANS.find((p) => p.id === params.planId) ?? B2B_BRAND_PLANS[1];
  const activeOp = getActiveDeskOperator();
  const amountDisplay =
    params.currency === "ZAR"
      ? `R${plan.priceZarMonthly.toLocaleString()} / mo`
      : `$${plan.priceUsdMonthly.toLocaleString()} / mo`;

  const receipt: BrandSubscriptionReceipt = {
    id: `rcpt-${Date.now()}`,
    brandName: params.brandName,
    planId: plan.id,
    planName: plan.name,
    paymentMethod: params.paymentMethod,
    amountDisplay,
    referenceCode: `SOT-B2B-${Math.floor(100000 + Math.random() * 899999)}`,
    operatorOnDuty: `${activeOp.name} (${activeOp.roleTitle})`,
    status: params.paymentMethod === "corporate_invoice" ? "pro_forma_issued" : "active",
    createdAt: new Date().toISOString(),
  };

  const current = getActiveBrandSubscription();
  const nextState = {
    activePlanId: plan.id,
    receipts: [receipt, ...current.receipts].slice(0, 15),
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(BRAND_SUBSCRIPTION_KEY, JSON.stringify(nextState));
    } catch {
      // ignore
    }
  }
  emitOperatorUpdate();
  return receipt;
}
