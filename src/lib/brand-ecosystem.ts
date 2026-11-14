import { auth } from "@/lib/firebase";
import {
  createFirestoreCollabApplication,
  createFirestoreEcosystemItem,
  getFirestoreCollabApplications,
  getFirestoreEcosystemItems,
  updateFirestoreEcosystemItemCounts,
  type FirestoreBrandCollabApplication,
  type FirestoreEcosystemItem,
  type EcosystemItemType,
} from "@/services/firestoreService";

export type { EcosystemItemType, FirestoreEcosystemItem, FirestoreBrandCollabApplication };

const LOCAL_ECOSYSTEM_KEY = "sot-brand-ecosystem-items-v1";
const LOCAL_APPLICATIONS_KEY = "sot-brand-collab-applications-v1";
const LOCAL_UPVOTES_KEY = "sot-ecosystem-upvotes-v1";
const LOCAL_RSVPS_KEY = "sot-ecosystem-rsvps-v1";

export const SEED_ECOSYSTEM_ITEMS: FirestoreEcosystemItem[] = [
  // NEW RELEASES
  {
    id: "rel-woolworths-trace-2026",
    brandId: "brand-za-woolworths",
    brandSlug: "woolworths-south-africa",
    brandName: "Woolworths South Africa",
    itemType: "release",
    title: "Good Business Journey: Origin-Verified Fresh Range",
    summary:
      "Every pack now carries an on-pack QR seal tracing farm origin, cold-chain timestamps, and recyclable packaging compliance in real time.",
    category: "Retail & Food Traceability",
    status: "Available Now",
    eventDate: "Launched Q4 2026",
    location: "Nationwide Stores & Online",
    externalUrl: "https://www.woolworths.co.za",
    authorUid: "system",
    authorName: "Woolworths Product Studio",
    upvotes: 184,
    rsvpCount: 0,
    createdAt: "2026-11-01T09:00:00.000Z",
    updatedAt: "2026-11-01T09:00:00.000Z",
  },
  {
    id: "rel-bathu-khalanga-v3",
    brandId: "seed-za-10",
    brandSlug: "bathu",
    brandName: "Bathu",
    itemType: "release",
    title: "Khalanga Knit V3 — NFC Authentic Ownership Edition",
    summary:
      "Limited South African heritage runner featuring an embedded NFC tag in the tongue so buyers verify originality before unboxing.",
    category: "Footwear & Apparel",
    status: "Pre-Order Open",
    eventDate: "Shipping Nov 22, 2026",
    location: "SA Flagship Stores & bathu.co.za",
    externalUrl: "https://bathu.co.za",
    authorUid: "system",
    authorName: "Bathu Design Lab",
    upvotes: 247,
    rsvpCount: 0,
    createdAt: "2026-11-03T10:30:00.000Z",
    updatedAt: "2026-11-03T10:30:00.000Z",
  },
  {
    id: "rel-capitec-global-vault",
    brandId: "brand-za-capitec-bank",
    brandSlug: "capitec-bank",
    brandName: "Capitec Bank",
    itemType: "release",
    title: "Global One Zero-Markup Travel & Multi-Currency Vault",
    summary:
      "Instant virtual cards with live exchange-rate transparency and zero hidden international POS fees for everyday South African travellers.",
    category: "Banking & Fintech",
    status: "Live Rollout",
    eventDate: "Rolling Out Nov 2026",
    location: "Capitec App (iOS & Android)",
    externalUrl: "https://www.capitecbank.co.za",
    authorUid: "system",
    authorName: "Capitec Digital Product",
    upvotes: 312,
    rsvpCount: 0,
    createdAt: "2026-11-04T08:15:00.000Z",
    updatedAt: "2026-11-04T08:15:00.000Z",
  },
  {
    id: "rel-nandos-craft-reserve",
    brandId: "brand-za-nandos",
    brandSlug: "nandos",
    brandName: "Nando's",
    itemType: "release",
    title: "Peri-Peri Craft Reserve Batch — Tamper-Proof Glass Drop",
    summary:
      "Small-batch bird's eye chilli reserve harvested in Southern Africa, complete with serialized neck seals to stop counterfeit shelf bottles.",
    category: "Food & FMCG",
    status: "Upcoming Drop",
    eventDate: "Nov 28, 2026",
    location: "Select Casas & Retail",
    externalUrl: "https://www.nandos.co.za",
    authorUid: "system",
    authorName: "Nando's Grocery & Sauce",
    upvotes: 196,
    rsvpCount: 0,
    createdAt: "2026-11-06T12:00:00.000Z",
    updatedAt: "2026-11-06T12:00:00.000Z",
  },

  // INNOVATION PRESENTATIONS (BRAND TO COMMUNITY)
  {
    id: "inn-pres-checkers-coldchain",
    brandId: "brand-za-checkers-sixty60",
    brandSlug: "checkers-sixty60",
    brandName: "Checkers Sixty60",
    itemType: "innovation_presentation",
    title: "Live Cold-Chain Thermal Seal for 60-Minute Groceries",
    summary:
      "Interactive insulated tote sensors let customers verify frozen & dairy temperatures stayed under 4°C from dark-store dispatch to doorstep.",
    category: "Logistics Innovation",
    status: "Live Pilot Showcase",
    eventDate: "Presentation Deck Open",
    location: "Western Cape & Gauteng Pilot",
    externalUrl: "https://www.checkers.co.za",
    authorUid: "system",
    authorName: "Checkers Sixty60 Engineering",
    upvotes: 168,
    rsvpCount: 0,
    createdAt: "2026-11-02T14:00:00.000Z",
    updatedAt: "2026-11-02T14:00:00.000Z",
  },
  {
    id: "inn-pres-samsung-passport",
    brandId: "seed-global-12",
    brandSlug: "samsung-kr",
    brandName: "Samsung",
    itemType: "innovation_presentation",
    title: "On-Device Knox Component Authenticity Passport",
    summary:
      "Consumers can verify genuine OLED panels, OEM batteries, and authorized service-center replacements directly before buying pre-owned hardware.",
    category: "Hardware Authenticity",
    status: "Open Demo",
    eventDate: "Q4 Technical Keynote",
    location: "Global Platform Rollout",
    externalUrl: "https://www.samsung.com",
    authorUid: "system",
    authorName: "Samsung Customer Care Lab",
    upvotes: 229,
    rsvpCount: 0,
    createdAt: "2026-11-05T11:20:00.000Z",
    updatedAt: "2026-11-05T11:20:00.000Z",
  },

  // INNOVATION SUBMISSIONS (CONSUMER / CREATOR TO BRAND - C2B)
  {
    id: "inn-sub-nandos-refill",
    brandId: "brand-za-nandos",
    brandSlug: "nandos",
    brandName: "Nando's",
    itemType: "innovation_submission",
    title: "C2B Proposal: Deposit-Return Peri-Peri Sauce Refill Stations",
    summary:
      "Submitted by community innovator @ThaboCircular: Install glass sauce refill dispensers at flagship restaurants with R15 Loyalty Credit per returned bottle.",
    category: "Circular Packaging Pitch",
    status: "Under Brand Review",
    eventDate: "Submitted Nov 2026",
    location: "Community C2B Submission",
    authorUid: "community-innovator-1",
    authorName: "Thabo M. (Community Innovator)",
    upvotes: 142,
    rsvpCount: 0,
    createdAt: "2026-11-07T09:40:00.000Z",
    updatedAt: "2026-11-07T09:40:00.000Z",
  },
  {
    id: "inn-sub-ussd-verify",
    brandId: "brand-za-mtn-south-africa",
    brandSlug: "mtn-south-africa",
    brandName: "MTN South Africa",
    itemType: "innovation_submission",
    title: "C2B Pitch: Zero-Data USSD Scratch-Code Counterfeit Verifier",
    summary:
      "Allow shoppers in low-connectivity or zero-data areas to dial a free USSD code to confirm medicine, cosmetics, and food batch originality.",
    category: "Accessibility & Trust",
    status: "Shortlisted for Co-Design",
    eventDate: "Submitted Nov 2026",
    location: "Community C2B Submission",
    authorUid: "community-innovator-2",
    authorName: "Naledi K. (Civic Tech Creator)",
    upvotes: 289,
    rsvpCount: 0,
    createdAt: "2026-11-08T16:10:00.000Z",
    updatedAt: "2026-11-08T16:10:00.000Z",
  },

  // B2C / C2B EVENTS
  {
    id: "evt-nandos-creativity-townhall",
    brandId: "brand-za-nandos",
    brandSlug: "nandos",
    brandName: "Nando's",
    itemType: "event",
    title: "Nando's Open Kitchen, Taste Panel & B2C Feedback Townhall",
    summary:
      "Meet our food innovation chefs & CX directors in person or via SOT Live Stage to sample 2027 menu prototypes and rate live.",
    category: "Customer Townhall & Tasting",
    status: "Registration Open",
    eventDate: "Dec 04, 2026 · 17:30 SAST",
    location: "Johannesburg Central Kitchen + Live Stream",
    externalUrl: "https://www.nandos.co.za",
    authorUid: "system",
    authorName: "Nando's Community Relations",
    upvotes: 118,
    rsvpCount: 84,
    createdAt: "2026-11-04T15:00:00.000Z",
    updatedAt: "2026-11-04T15:00:00.000Z",
  },
  {
    id: "evt-sa-authenticity-expo",
    brandId: "seed-za-10",
    brandSlug: "bathu",
    brandName: "Bathu",
    itemType: "event",
    title: "Walk Your Journey: Authentic Design & Anti-Counterfeit Expo",
    summary:
      "Hands-on showcase comparing genuine stitching, NFC tags, and local manufacturing craft, plus speed-networking for young footwear designers.",
    category: "Launch Expo & Networking",
    status: "RSVP Live",
    eventDate: "Dec 12, 2026 · 11:00 SAST",
    location: "Rosebank Art Mile, Johannesburg",
    externalUrl: "https://bathu.co.za",
    authorUid: "system",
    authorName: "Bathu Brand Team",
    upvotes: 154,
    rsvpCount: 119,
    createdAt: "2026-11-05T13:00:00.000Z",
    updatedAt: "2026-11-05T13:00:00.000Z",
  },

  // B2C / C2B COLLABORATION OPPORTUNITIES
  {
    id: "col-woolworths-artisan-packaging",
    brandId: "brand-za-woolworths",
    brandSlug: "woolworths-south-africa",
    brandName: "Woolworths South Africa",
    itemType: "collab",
    title: "C2B / Supplier Collab: Compostable Food Packaging Innovators",
    summary:
      "Seeking local packaging startups, materials researchers, and eco-designers to co-develop plastic-free takeaway & deli containers for 2027 stores.",
    category: "Supplier & Eco R&D Collab",
    status: "Accepting Proposals",
    eventDate: "Deadline: Jan 15, 2027",
    location: "Cape Town HQ & Remote",
    compensation: "Paid Pilot Grant + National Retail Listing",
    authorUid: "system",
    authorName: "Woolworths Supplier Partnerships",
    upvotes: 205,
    rsvpCount: 31,
    createdAt: "2026-11-06T09:00:00.000Z",
    updatedAt: "2026-11-06T09:00:00.000Z",
  },
  {
    id: "col-bathu-creator-unboxing",
    brandId: "seed-za-10",
    brandSlug: "bathu",
    brandName: "Bathu",
    itemType: "collab",
    title: "B2C Creator Collab: Authentic Unboxing & Streetwear Storytellers",
    summary:
      "Partner with Bathu to film honest durability reviews, NFC authenticity scans, and regional store launch coverage on SOT Live Stage.",
    category: "Creator & Community Ambassador",
    status: "Open to Creators",
    eventDate: "Rolling Cohort",
    location: "All 9 Provinces & Diaspora",
    compensation: "R4,500 Campaign Fee + Limited Drops",
    authorUid: "system",
    authorName: "Bathu Creator Desk",
    upvotes: 173,
    rsvpCount: 46,
    createdAt: "2026-11-08T10:00:00.000Z",
    updatedAt: "2026-11-08T10:00:00.000Z",
  },
];

function readLocalJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalJson<T>(key: string, value: T, eventName?: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    if (eventName) window.dispatchEvent(new CustomEvent(eventName));
  } catch {
    /* ignore */
  }
}

export async function fetchEcosystemItems(options?: {
  brandSlug?: string;
  itemType?: EcosystemItemType;
}): Promise<FirestoreEcosystemItem[]> {
  const localAdded = readLocalJson<FirestoreEcosystemItem[]>(LOCAL_ECOSYSTEM_KEY, []);
  let remoteItems: FirestoreEcosystemItem[] = [];

  try {
    remoteItems = await getFirestoreEcosystemItems();
  } catch {
    /* offline or rules fallback cleanly to seeded + local */
  }

  const byId = new Map<string, FirestoreEcosystemItem>();
  for (const item of SEED_ECOSYSTEM_ITEMS) byId.set(item.id, item);
  for (const item of localAdded) byId.set(item.id, item);
  for (const item of remoteItems) byId.set(item.id, item);

  const upvotesMap = readLocalJson<Record<string, boolean>>(LOCAL_UPVOTES_KEY, {});
  const rsvpsMap = readLocalJson<Record<string, boolean>>(LOCAL_RSVPS_KEY, {});

  let list = Array.from(byId.values()).map((item) => ({
    ...item,
    upvotes: item.upvotes + (upvotesMap[item.id] && !remoteItems.some((r) => r.id === item.id) ? 1 : 0),
    rsvpCount: item.rsvpCount + (rsvpsMap[item.id] && !remoteItems.some((r) => r.id === item.id) ? 1 : 0),
  }));

  if (options?.brandSlug) {
    const target = options.brandSlug.trim().toLowerCase();
    list = list.filter((i) => i.brandSlug.toLowerCase() === target);
  }
  if (options?.itemType) {
    list = list.filter((i) => i.itemType === options.itemType);
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function publishEcosystemItem(input: {
  brandId: string;
  brandSlug: string;
  brandName: string;
  itemType: EcosystemItemType;
  title: string;
  summary: string;
  category: string;
  status: string;
  eventDate?: string;
  location?: string;
  compensation?: string;
  externalUrl?: string;
  authorUid: string;
  authorName: string;
}): Promise<FirestoreEcosystemItem> {
  const now = new Date().toISOString();
  const id = `eco_${input.itemType}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const item: FirestoreEcosystemItem = {
    id,
    brandId: input.brandId,
    brandSlug: input.brandSlug,
    brandName: input.brandName,
    itemType: input.itemType,
    title: input.title.trim().slice(0, 200),
    summary: input.summary.trim().slice(0, 2000),
    category: input.category.trim().slice(0, 100) || "General",
    status: input.status.trim().slice(0, 80) || "Active",
    ...(input.eventDate?.trim() ? { eventDate: input.eventDate.trim().slice(0, 120) } : {}),
    ...(input.location?.trim() ? { location: input.location.trim().slice(0, 200) } : {}),
    ...(input.compensation?.trim() ? { compensation: input.compensation.trim().slice(0, 200) } : {}),
    ...(input.externalUrl?.trim() ? { externalUrl: input.externalUrl.trim().slice(0, 500) } : {}),
    authorUid: input.authorUid,
    authorName: input.authorName.trim().slice(0, 100) || "Community Member",
    upvotes: 1,
    rsvpCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const localAdded = readLocalJson<FirestoreEcosystemItem[]>(LOCAL_ECOSYSTEM_KEY, []);
  writeLocalJson(LOCAL_ECOSYSTEM_KEY, [item, ...localAdded], "sot-ecosystem-updated");

  if (auth.currentUser && auth.currentUser.uid === input.authorUid) {
    try {
      await createFirestoreEcosystemItem(item);
    } catch {
      /* fallback safely */
    }
  }

  return item;
}

export function hasUpvotedEcosystemItem(itemId: string): boolean {
  const map = readLocalJson<Record<string, boolean>>(LOCAL_UPVOTES_KEY, {});
  return !!map[itemId];
}

export function hasRsvpedEcosystemItem(itemId: string): boolean {
  const map = readLocalJson<Record<string, boolean>>(LOCAL_RSVPS_KEY, {});
  return !!map[itemId];
}

export async function toggleUpvoteEcosystemItem(item: FirestoreEcosystemItem): Promise<boolean> {
  const map = readLocalJson<Record<string, boolean>>(LOCAL_UPVOTES_KEY, {});
  const nextVoted = !map[item.id];
  map[item.id] = nextVoted;
  writeLocalJson(LOCAL_UPVOTES_KEY, map, "sot-ecosystem-updated");

  if (auth.currentUser && !item.id.startsWith("rel-") && !item.id.startsWith("inn-") && !item.id.startsWith("evt-") && !item.id.startsWith("col-")) {
    try {
      await updateFirestoreEcosystemItemCounts(item.id, {
        upvotes: Math.max(0, item.upvotes + (nextVoted ? 1 : -1)),
      });
    } catch {
      /* ignore */
    }
  }
  return nextVoted;
}

export async function submitCollabOrEventResponse(input: {
  item: FirestoreEcosystemItem;
  applicantUid: string;
  applicantName: string;
  applicantEmail?: string;
  kind: "rsvp" | "collab_application";
  pitch?: string;
  portfolioUrl?: string;
}): Promise<FirestoreBrandCollabApplication> {
  const now = new Date().toISOString();
  const id = `app_${input.item.id.slice(0, 28)}_${input.applicantUid.slice(0, 24)}_${Date.now().toString(36)}`;
  const appRecord: FirestoreBrandCollabApplication = {
    id,
    itemId: input.item.id,
    itemTitle: input.item.title,
    brandId: input.item.brandId,
    brandSlug: input.item.brandSlug,
    brandName: input.item.brandName,
    brandOwnerUid: input.item.authorUid || "system",
    applicantUid: input.applicantUid,
    applicantName: input.applicantName.trim().slice(0, 100) || "SOT Member",
    ...(input.applicantEmail?.trim() ? { applicantEmail: input.applicantEmail.trim().slice(0, 200) } : {}),
    kind: input.kind,
    pitch:
      input.pitch?.trim().slice(0, 2000) ||
      (input.kind === "rsvp" ? `Confirmed attendance for ${input.item.title}` : "Interested in collaborating."),
    ...(input.portfolioUrl?.trim() ? { portfolioUrl: input.portfolioUrl.trim().slice(0, 500) } : {}),
    status: "submitted",
    createdAt: now,
    updatedAt: now,
  };

  if (input.kind === "rsvp") {
    const rsvps = readLocalJson<Record<string, boolean>>(LOCAL_RSVPS_KEY, {});
    rsvps[input.item.id] = true;
    writeLocalJson(LOCAL_RSVPS_KEY, rsvps, "sot-ecosystem-updated");
  }

  const localApps = readLocalJson<FirestoreBrandCollabApplication[]>(LOCAL_APPLICATIONS_KEY, []);
  writeLocalJson(LOCAL_APPLICATIONS_KEY, [appRecord, ...localApps], "sot-ecosystem-updated");

  if (auth.currentUser && auth.currentUser.uid === input.applicantUid) {
    try {
      await createFirestoreCollabApplication(appRecord);
    } catch {
      /* non-fatal fallback */
    }
  }

  return appRecord;
}

export async function fetchMyCollabApplications(userId: string): Promise<FirestoreBrandCollabApplication[]> {
  const localApps = readLocalJson<FirestoreBrandCollabApplication[]>(LOCAL_APPLICATIONS_KEY, []).filter(
    (a) => a.applicantUid === userId || a.brandOwnerUid === userId,
  );
  const byId = new Map<string, FirestoreBrandCollabApplication>();
  for (const a of localApps) byId.set(a.id, a);

  if (auth.currentUser?.uid === userId) {
    try {
      const remote = await getFirestoreCollabApplications(userId);
      for (const r of remote) byId.set(r.id, r);
    } catch {
      /* ignore */
    }
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
