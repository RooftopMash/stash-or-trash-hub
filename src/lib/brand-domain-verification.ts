import { doc, getDoc, setDoc } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";
import type { Brand } from "@/lib/brands";
import {
  createFirestoreBrandClaim,
  getFirestoreBrandClaims,
  updateFirestoreBrandClaim,
  type FirestoreBrandClaim,
} from "@/services/firestoreService";

export type DomainMatchStatus =
  | "matched"
  | "subdomain_match"
  | "mismatch"
  | "free_provider"
  | "no_website"
  | "invalid_email";

export type BrandClaimEvaluation = {
  email: string;
  emailHost: string | null;
  emailRegistrableDomain: string | null;
  officialDomain: string | null;
  status: DomainMatchStatus;
  canAutoVerifyDomain: boolean;
  isFreeWebmail: boolean;
  headline: string;
  explanation: string;
};

export interface BrandDeskAccessEvaluation {
  allowed: boolean;
  reasonCode:
    | "verified_corporate_owner"
    | "developer_sandbox"
    | "blocked_free_webmail"
    | "blocked_unverified_email"
    | "blocked_domain_mismatch";
  headline: string;
  explanation: string;
  officialDomain: string | null;
  emailHost: string | null;
}

const MULTI_PART_PUBLIC_SUFFIXES = new Set([
  "co.za",
  "org.za",
  "net.za",
  "gov.za",
  "ac.za",
  "web.za",
  "com.ng",
  "org.ng",
  "co.ke",
  "or.ke",
  "co.uk",
  "org.uk",
  "me.uk",
  "com.au",
  "net.au",
  "org.au",
  "co.nz",
  "co.bw",
  "org.bw",
  "com.na",
  "co.zw",
  "co.ls",
  "co.tz",
  "co.ug",
  "com.gh",
  "com.eg",
  "com.br",
  "com.mx",
  "com.ar",
  "com.co",
  "co.jp",
  "co.kr",
  "co.in",
  "co.id",
  "com.sg",
  "com.my",
  "com.ph",
  "co.th",
  "com.vn",
  "com.tr",
  "co.il",
  "com.sa",
  "com.et",
]);

const FREE_WEBMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.co.za",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "mail.com",
  "yandex.com",
  "zoho.com",
  "webmail.co.za",
  "mweb.co.za",
  "telkomsa.net",
]);

const AUTO_SOURCED_OWNER_IDS = new Set([
  "",
  "system",
  "seed-catalog",
  "admin-wikidata-importer",
  "admin-dashboard-importer",
  "admin-importer",
  "admin-reviewer",
]);

const LOCAL_CLAIMS_STORAGE_KEY = "sot-brand-domain-claims-v1";

export type LocalBrandClaimRecord = FirestoreBrandClaim;

export function readLocalBrandClaims(): LocalBrandClaimRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_CLAIMS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalBrandClaimRecord[]) : [];
  } catch {
    return [];
  }
}

export function writeLocalBrandClaims(items: LocalBrandClaimRecord[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_CLAIMS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("sot-brand-claims-updated"));
  } catch {
    /* ignore */
  }
}

export function normalizeWebsiteHostname(websiteOrDomain: string | null | undefined): string | null {
  if (!websiteOrDomain) return null;
  const trimmed = websiteOrDomain.trim().toLowerCase();
  if (!trimmed) return null;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    const host = parsed.hostname.replace(/^www\./, "").replace(/\.$/, "");
    if (!host || !host.includes(".")) return null;
    return host;
  } catch {
    const fallback = trimmed
      .replace(/^https?:\/\//i, "")
      .split("/")[0]
      ?.split("?")[0]
      ?.split(":")[0]
      ?.replace(/^www\./, "");
    if (!fallback || !fallback.includes(".")) return null;
    return fallback;
  }
}

export function extractRegistrableDomain(hostOrUrl: string | null | undefined): string | null {
  const host = normalizeWebsiteHostname(hostOrUrl);
  if (!host) return null;
  const parts = host.split(".").filter(Boolean);
  if (parts.length <= 2) return parts.join(".");
  const lastTwo = parts.slice(-2).join(".");
  if (MULTI_PART_PUBLIC_SUFFIXES.has(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }
  return lastTwo;
}

export function extractEmailDomain(email: string | null | undefined): string | null {
  if (!email) return null;
  const trimmed = email.trim().toLowerCase();
  const atIdx = trimmed.lastIndexOf("@");
  if (atIdx <= 0 || atIdx === trimmed.length - 1) return null;
  const domain = trimmed.slice(atIdx + 1).replace(/\.$/, "");
  if (!domain.includes(".") || /\s/.test(domain)) return null;
  return domain;
}

export function isFreeEmailProvider(email: string | null | undefined): boolean {
  const emailHost = extractEmailDomain(email);
  if (!emailHost) return false;
  const reg = extractRegistrableDomain(emailHost);
  return FREE_WEBMAIL_DOMAINS.has(emailHost) || (!!reg && FREE_WEBMAIL_DOMAINS.has(reg));
}

export function canOperateBrandDesk(input: {
  userEmail: string | null | undefined;
  brandWebsite?: string | null;
  brandVerified?: boolean;
  claimStatus?: string | null;
  brandSlug?: string | null;
  isDeveloper?: boolean;
  firebaseEmailVerified?: boolean;
  hasApprovedClaim?: boolean;
}): BrandDeskAccessEvaluation {
  const cleanEmail = (input.userEmail || "").trim().toLowerCase();
  const isDev =
    !!input.isDeveloper || cleanEmail === "borulelo@gmail.com";
  const emailHost = extractEmailDomain(cleanEmail);
  const officialDomain = extractRegistrableDomain(input.brandWebsite);

  if (isDev) {
    return {
      allowed: true,
      reasonCode: "developer_sandbox",
      headline: "Platform Developer Sandbox Inspection Active",
      explanation:
        "Operating with explicit platform owner developer clearance (borulelo@gmail.com).",
      officialDomain,
      emailHost,
    };
  }

  if (input.hasApprovedClaim || input.claimStatus === "verified_domain" || input.claimStatus === "approved") {
    return {
      allowed: true,
      reasonCode: "verified_corporate_owner",
      headline: `Verified Corporate Custodian (@${emailHost || officialDomain || "corporate"})`,
      explanation: "Corporate domain ownership has been cryptographically or admin verified.",
      officialDomain,
      emailHost,
    };
  }

  if (!cleanEmail || !emailHost) {
    return {
      allowed: false,
      reasonCode: "blocked_unverified_email",
      headline: "Corporate Authentication Required",
      explanation:
        "Sign in with a verified corporate email address or complete DNS TXT verification to unlock Brand Desk controls.",
      officialDomain,
      emailHost: null,
    };
  }

  if (isFreeEmailProvider(cleanEmail)) {
    return {
      allowed: false,
      reasonCode: "blocked_free_webmail",
      headline: `Personal Webmail Blocked (@${emailHost})`,
      explanation: officialDomain
        ? `Enterprise Brand Desks forbid personal @${emailHost} addresses. Authenticate with an @${officialDomain} corporate email or complete DNS TXT verification + Admin Review.`
        : `Personal @${emailHost} addresses cannot operate corporate brand desks. Use your official company domain email or prove domain control via DNS TXT.`,
      officialDomain,
      emailHost,
    };
  }

  const evalResult = evaluateBrandDomainMatch(input.brandWebsite, cleanEmail);
  if (evalResult.canAutoVerifyDomain && (input.firebaseEmailVerified || input.brandVerified)) {
    return {
      allowed: true,
      reasonCode: "verified_corporate_owner",
      headline: `Verified Corporate Domain (@${emailHost})`,
      explanation: "Corporate email domain matches official brand web property.",
      officialDomain,
      emailHost,
    };
  }

  if (!evalResult.canAutoVerifyDomain && officialDomain) {
    return {
      allowed: false,
      reasonCode: "blocked_domain_mismatch",
      headline: `Domain Mismatch: @${emailHost} ≠ ${officialDomain}`,
      explanation: `Only verified @${officialDomain} corporate custodians (or DNS TXT verified owners) may mutate OEM batches, operators, or customer queues.`,
      officialDomain,
      emailHost,
    };
  }

  return {
    allowed: false,
    reasonCode: "blocked_unverified_email",
    headline: "Email / DNS Verification Pending",
    explanation:
      "Confirm your corporate email verification link or verify the DNS TXT record for your official domain to unlock full Brand Desk writes.",
    officialDomain,
    emailHost,
  };
}

export function buildDeterministicDnsToken(brandSlug: string, claimantUid: string): string {
  const cleanSlug = (brandSlug || "brand").replace(/[^a-z0-9]/gi, "").slice(0, 12).toLowerCase();
  const cleanUid = (claimantUid || "custodian").replace(/[^a-z0-9]/gi, "").slice(0, 10).toLowerCase();
  return `sot-${cleanSlug}-${cleanUid}-verified`;
}

export function evaluateBrandDomainMatch(
  brandWebsite: string | null | undefined,
  email: string,
): BrandClaimEvaluation {
  const cleanEmail = email.trim().toLowerCase();
  const emailHost = extractEmailDomain(cleanEmail);
  const officialDomain = extractRegistrableDomain(brandWebsite);

  if (!emailHost) {
    return {
      email: cleanEmail,
      emailHost: null,
      emailRegistrableDomain: null,
      officialDomain,
      status: "invalid_email",
      canAutoVerifyDomain: false,
      isFreeWebmail: false,
      headline: "Enter a valid corporate email address",
      explanation: officialDomain
        ? `Use an email address ending in @${officialDomain} to prove ownership.`
        : "Enter your corporate email address so administrators can review your claim.",
    };
  }

  const emailRegistrableDomain = extractRegistrableDomain(emailHost);

  if (FREE_WEBMAIL_DOMAINS.has(emailHost) || (emailRegistrableDomain && FREE_WEBMAIL_DOMAINS.has(emailRegistrableDomain))) {
    return {
      email: cleanEmail,
      emailHost,
      emailRegistrableDomain,
      officialDomain,
      status: "free_provider",
      canAutoVerifyDomain: false,
      isFreeWebmail: true,
      headline: "Personal/free email provider blocked from auto-verification",
      explanation: officialDomain
        ? `@${emailHost} is a personal email provider. Enterprise verification requires an official @${officialDomain} corporate address, DNS TXT proof, or Admin Approval.`
        : `@${emailHost} is a free webmail provider. Please use a corporate domain email or prove domain control via DNS TXT.`,
    };
  }

  if (!officialDomain) {
    return {
      email: cleanEmail,
      emailHost,
      emailRegistrableDomain,
      officialDomain: null,
      status: "no_website",
      canAutoVerifyDomain: false,
      isFreeWebmail: false,
      headline: "No official brand website domain on file",
      explanation: `This auto-sourced brand does not have an official domain stored yet. Verify ownership via DNS TXT on your domain or route @${emailHost} to Admin Verification.`,
    };
  }

  if (emailHost === officialDomain || emailRegistrableDomain === officialDomain) {
    const isExact = emailHost === officialDomain;
    return {
      email: cleanEmail,
      emailHost,
      emailRegistrableDomain,
      officialDomain,
      status: isExact ? "matched" : "subdomain_match",
      canAutoVerifyDomain: true,
      isFreeWebmail: false,
      headline: isExact
        ? `Domain match confirmed: @${emailHost}`
        : `Corporate subdomain match confirmed: @${emailHost}`,
      explanation: `Your corporate email domain matches the brand's official web domain (${officialDomain}). Complete Firebase email verification or DNS TXT check to activate full Brand Desk access.`,
    };
  }

  return {
    email: cleanEmail,
    emailHost,
    emailRegistrableDomain,
    officialDomain,
    status: "mismatch",
    canAutoVerifyDomain: false,
    isFreeWebmail: false,
    headline: `Domain mismatch: @${emailHost} vs ${officialDomain}`,
    explanation: `Automatic verification is blocked because @${emailHost} does not match the brand's official domain (${officialDomain}). Use an @${officialDomain} email or verify via DNS TXT.`,
  };
}

export function isBrandAutoSourced(brand: Pick<Brand, "id" | "owner_id" | "claimStatus" | "isAutoSourced">): boolean {
  if (brand.claimStatus === "claimed") return false;
  if (brand.isAutoSourced) return true;
  if (!brand.owner_id || AUTO_SOURCED_OWNER_IDS.has(brand.owner_id)) return true;
  if (brand.id.startsWith("seed-") || brand.id.startsWith("brand-")) return true;
  return false;
}

export function isBrandClaimable(
  brand: Pick<Brand, "id" | "owner_id" | "verified" | "claimStatus" | "isAutoSourced">,
  currentUserId?: string | null,
): boolean {
  if (brand.claimStatus === "claimed" && brand.owner_id && brand.owner_id === currentUserId) {
    return false;
  }
  if (isBrandAutoSourced(brand)) return true;
  if (!brand.verified && brand.owner_id !== currentUserId) return true;
  return false;
}

export function getLocalClaimedBrandOverride(slugOrId: string): LocalBrandClaimRecord | null {
  const normalized = slugOrId.trim().toLowerCase();
  const claims = readLocalBrandClaims();
  return (
    claims.find(
      (c) =>
        (c.status === "verified_domain" || c.status === "approved") &&
        (c.brandSlug.toLowerCase() === normalized || c.brandId.toLowerCase() === normalized),
    ) ?? null
  );
}

export function generateVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 899999));
}

export async function initiateBrandDomainClaim(input: {
  brand: Brand;
  claimantUid: string;
  claimantEmail: string;
  roleTitle?: string;
  message?: string;
  websiteOverride?: string;
}): Promise<{
  claim: LocalBrandClaimRecord;
  evaluation: BrandClaimEvaluation;
  instantVerified: boolean;
  challengeCode?: string;
}> {
  const effectiveWebsite = input.brand.website || input.websiteOverride || null;
  const evaluation = evaluateBrandDomainMatch(effectiveWebsite, input.claimantEmail);

  if (evaluation.status === "invalid_email") {
    throw new Error(evaluation.headline);
  }

  const fbUser = auth.currentUser;
  const firebaseVerifiedMatches =
    !!fbUser &&
    fbUser.emailVerified &&
    fbUser.email?.toLowerCase() === evaluation.email &&
    evaluation.canAutoVerifyDomain;

  const challengeCode = evaluation.canAutoVerifyDomain ? generateVerificationCode() : undefined;

  // Best-effort Firebase verification email trigger if signed in with same unverified corporate email
  if (
    evaluation.canAutoVerifyDomain &&
    fbUser &&
    !fbUser.emailVerified &&
    fbUser.email?.toLowerCase() === evaluation.email
  ) {
    try {
      await sendEmailVerification(fbUser);
    } catch {
      /* non-fatal if rate-limited or custom auth */
    }
  }

  const cleanClaimId = `claim_${input.brand.slug.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60)}_${input.claimantUid.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 32)}`;
  const now = new Date().toISOString();
  const status: FirestoreBrandClaim["status"] = firebaseVerifiedMatches
    ? "verified_domain"
    : evaluation.canAutoVerifyDomain
      ? "code_sent"
      : "pending_review";

  const claim: LocalBrandClaimRecord = {
    id: cleanClaimId,
    brandId: input.brand.id,
    brandSlug: input.brand.slug,
    brandName: input.brand.name,
    ...(effectiveWebsite ? { brandWebsite: effectiveWebsite } : {}),
    ...(evaluation.officialDomain ? { officialDomain: evaluation.officialDomain } : {}),
    claimantUid: input.claimantUid,
    claimantEmail: evaluation.email,
    emailDomain: evaluation.emailHost || "",
    ...(input.roleTitle?.trim() ? { roleTitle: input.roleTitle.trim().slice(0, 120) } : {}),
    domainMatchStatus: evaluation.status,
    ...(challengeCode ? { verificationCode: challengeCode } : {}),
    status,
    message:
      input.message?.trim().slice(0, 1000) ||
      (evaluation.canAutoVerifyDomain
        ? `Domain-matched corporate claim for ${input.brand.name} via ${evaluation.email}`
        : `Manual ownership verification requested for ${input.brand.name} (${evaluation.status})`),
    ...(firebaseVerifiedMatches ? { verifiedAt: now } : {}),
    createdAt: now,
    updatedAt: now,
  };

  // Persist locally first for immediate synchronous UI reflection
  const existing = readLocalBrandClaims().filter((c) => c.id !== claim.id);
  writeLocalBrandClaims([claim, ...existing]);

  // Persist to Firestore if user is authenticated with Firebase Auth
  if (fbUser && fbUser.uid === input.claimantUid) {
    try {
      await createFirestoreBrandClaim(claim);
    } catch {
      /* non-fatal fallback to local claims when using preview fallback auth */
    }
  }

  const dnsTxtToken = buildDeterministicDnsToken(input.brand.slug, input.claimantUid);

  // Sync corporate claim status to Postgres `brand_domain_claims` cleanly
  try {
    const db = supabase as any;
    await db.from("brand_domain_claims").upsert(
      {
        brand_slug: input.brand.slug,
        brand_name: input.brand.name,
        official_domain: evaluation.officialDomain || evaluation.emailHost || "pending",
        claimant_uid: input.claimantUid,
        claimant_email: evaluation.email,
        verification_method: firebaseVerifiedMatches ? "corporate_email" : "dns_txt",
        dns_txt_token: dnsTxtToken,
        dns_verified: false,
        email_verified: firebaseVerifiedMatches,
        status: firebaseVerifiedMatches ? "approved" : "pending",
        updated_at: now,
      },
      { onConflict: "brand_slug,claimant_uid" },
    );
  } catch {
    /* non-fatal if migration pending */
  }

  if (firebaseVerifiedMatches) {
    await applyVerifiedBrandOwnershipToStores({
      brand: input.brand,
      ownerUid: input.claimantUid,
      ownerEmail: evaluation.email,
      verifiedDomain: evaluation.officialDomain || evaluation.emailHost || "",
      website: effectiveWebsite || undefined,
    });
  }

  return {
    claim,
    evaluation,
    instantVerified: firebaseVerifiedMatches,
    challengeCode: firebaseVerifiedMatches ? undefined : challengeCode,
  };
}

export async function verifyBrandDnsTxtRecord(input: {
  brand: Brand;
  domain: string;
  claimantUid: string;
  claimantEmail: string;
}): Promise<{ verified: boolean; expectedRecordValue: string; recordsFoundCount: number; message: string }> {
  const token = buildDeterministicDnsToken(input.brand.slug, input.claimantUid);
  const cleanDomain = normalizeWebsiteHostname(input.domain) || input.domain.trim().toLowerCase();
  const res = await fetch("/api/verify-domain-dns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain: cleanDomain, expectedToken: token }),
  });
  const data = await res.json();
  const verified = Boolean(res.ok && data?.verified);
  const expectedRecordValue = `sot-domain-verify=${token}`;

  if (verified) {
    const now = new Date().toISOString();
    const cleanClaimId = `claim_${input.brand.slug.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60)}_${input.claimantUid.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 32)}`;
    const existing = readLocalBrandClaims().filter((c) => c.id !== cleanClaimId);
    const verifiedClaim: LocalBrandClaimRecord = {
      id: cleanClaimId,
      brandId: input.brand.id,
      brandSlug: input.brand.slug,
      brandName: input.brand.name,
      brandWebsite: `https://${cleanDomain}`,
      officialDomain: cleanDomain,
      claimantUid: input.claimantUid,
      claimantEmail: input.claimantEmail.toLowerCase(),
      emailDomain: extractEmailDomain(input.claimantEmail) || cleanDomain,
      domainMatchStatus: "matched",
      status: "verified_domain",
      message: `DNS TXT verification succeeded for ${cleanDomain}`,
      verifiedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    writeLocalBrandClaims([verifiedClaim, ...existing]);

    try {
      const db = supabase as any;
      await db.from("brand_domain_claims").upsert(
        {
          brand_slug: input.brand.slug,
          brand_name: input.brand.name,
          official_domain: cleanDomain,
          claimant_uid: input.claimantUid,
          claimant_email: input.claimantEmail.toLowerCase(),
          verification_method: "dns_txt",
          dns_txt_token: token,
          dns_verified: true,
          email_verified: Boolean(auth.currentUser?.emailVerified),
          status: "approved",
          updated_at: now,
        },
        { onConflict: "brand_slug,claimant_uid" },
      );
    } catch {
      /* ignore if migration pending */
    }

    await applyVerifiedBrandOwnershipToStores({
      brand: input.brand,
      ownerUid: input.claimantUid,
      ownerEmail: input.claimantEmail.toLowerCase(),
      verifiedDomain: cleanDomain,
      website: `https://${cleanDomain}`,
    });

    return {
      verified: true,
      expectedRecordValue,
      recordsFoundCount: Number(data?.recordsFoundCount || 1),
      message: `DNS TXT record verified on ${cleanDomain}. Full corporate Brand Desk ownership unlocked.`,
    };
  }

  return {
    verified: false,
    expectedRecordValue,
    recordsFoundCount: Number(data?.recordsFoundCount || 0),
    message: `TXT record "${expectedRecordValue}" not yet detected on _sot-verify.${cleanDomain} or ${cleanDomain}. Wait for DNS propagation and re-check.`,
  };
}

export async function confirmBrandDomainVerificationCode(input: {
  claimId: string;
  brand: Brand;
  enteredCode: string;
  claimantUid: string;
}): Promise<LocalBrandClaimRecord> {
  const local = readLocalBrandClaims();
  const target = local.find((c) => c.id === input.claimId);
  if (!target) {
    throw new Error("Verification session not found. Please restart your ownership claim.");
  }
  const normalizedCode = input.enteredCode.trim();
  if (!normalizedCode || normalizedCode !== (target.verificationCode || "").trim()) {
    throw new Error("Verification code does not match. Check the 6-digit code and try again.");
  }
  if (target.domainMatchStatus !== "matched" && target.domainMatchStatus !== "subdomain_match") {
    throw new Error("Only domain-matched corporate emails can auto-verify ownership.");
  }

  const now = new Date().toISOString();
  const updated: LocalBrandClaimRecord = {
    ...target,
    status: "verified_domain",
    verifiedAt: now,
    updatedAt: now,
  };
  writeLocalBrandClaims(local.map((c) => (c.id === target.id ? updated : c)));

  if (auth.currentUser?.uid === input.claimantUid) {
    try {
      await updateFirestoreBrandClaim(target.id, {
        status: "verified_domain",
        verifiedAt: now,
      });
    } catch {
      /* ignore */
    }
  }

  await applyVerifiedBrandOwnershipToStores({
    brand: input.brand,
    ownerUid: input.claimantUid,
    ownerEmail: target.claimantEmail,
    verifiedDomain: target.officialDomain || target.emailDomain,
    website: target.brandWebsite,
  });

  return updated;
}

export async function applyVerifiedBrandOwnershipToStores(input: {
  brand: Brand;
  ownerUid: string;
  ownerEmail: string;
  verifiedDomain: string;
  website?: string;
}): Promise<void> {
  const now = new Date().toISOString();
  const cleanId = input.brand.id.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 128);

  if (auth.currentUser?.uid) {
    try {
      const brandRef = doc(db, "brands", cleanId);
      const snap = await getDoc(brandRef);
      if (snap.exists()) {
        await setDoc(
          brandRef,
          {
            ...snap.data(),
            id: cleanId,
            name: input.brand.name.slice(0, 200),
            slug: input.brand.slug.slice(0, 200),
            createdBy: input.ownerUid,
            ownerEmail: input.ownerEmail.slice(0, 200),
            verifiedDomain: input.verifiedDomain.slice(0, 200),
            claimStatus: "claimed",
            isVerified: true,
            isAutoSourced: false,
            ...(input.website ? { website: input.website.slice(0, 500) } : {}),
            updatedAt: now,
          },
          { merge: true },
        );
      } else {
        await setDoc(brandRef, {
          id: cleanId,
          name: input.brand.name.slice(0, 200),
          slug: input.brand.slug.slice(0, 200),
          category: (input.brand.category || "Consumer Brand").slice(0, 100),
          country: (input.brand.country || "ZA").slice(0, 100),
          description: (input.brand.description || `${input.brand.name} official verified brand profile`).slice(0, 2000),
          ...(input.brand.logo_url ? { logoUrl: input.brand.logo_url.slice(0, 500) } : {}),
          ...(input.website || input.brand.website
            ? { website: (input.website || input.brand.website || "").slice(0, 500) }
            : {}),
          trustScore: Number(input.brand.trust_score) || 75,
          riskScore: 10,
          status: "active",
          isVerified: true,
          isAutoSourced: false,
          claimStatus: "claimed",
          ownerEmail: input.ownerEmail.slice(0, 200),
          verifiedDomain: input.verifiedDomain.slice(0, 200),
          createdBy: input.ownerUid,
          createdAt: input.brand.created_at || now,
          updatedAt: now,
        });
      }
    } catch {
      /* fallback cleanly if offline or preview-only auth */
    }
  }

  try {
    await supabase
      .from("brands")
      .update({
        owner_id: input.ownerUid,
        verified: true,
      })
      .eq("id", input.brand.id);
  } catch {
    /* optional legacy store */
  }
}

export async function fetchAllBrandClaimsForReview(): Promise<LocalBrandClaimRecord[]> {
  const local = readLocalBrandClaims();
  const byId = new Map<string, LocalBrandClaimRecord>();
  for (const c of local) byId.set(c.id, c);

  if (auth.currentUser) {
    try {
      const isPlatformOwner = auth.currentUser.email?.toLowerCase() === "borulelo@gmail.com";
      const fsClaims = await getFirestoreBrandClaims({
        claimantUid: auth.currentUser.uid,
        isAdmin: isPlatformOwner,
      });
      for (const c of fsClaims) {
        byId.set(c.id, c);
      }
    } catch {
      /* ignore if user isn't admin */
    }
  }
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function adminReviewBrandClaim(input: {
  claim: LocalBrandClaimRecord;
  reviewerId: string;
  approve: boolean;
}): Promise<void> {
  const now = new Date().toISOString();
  const nextStatus: LocalBrandClaimRecord["status"] = input.approve ? "approved" : "rejected";
  const local = readLocalBrandClaims().map((c) =>
    c.id === input.claim.id
      ? { ...c, status: nextStatus, reviewedBy: input.reviewerId, updatedAt: now }
      : c,
  );
  writeLocalBrandClaims(local);

  if (auth.currentUser) {
    try {
      await updateFirestoreBrandClaim(input.claim.id, {
        status: nextStatus,
        reviewedBy: input.reviewerId,
        ...(input.approve ? { verifiedAt: now } : {}),
      });
    } catch {
      /* ignore */
    }
  }

  if (input.approve) {
    await applyVerifiedBrandOwnershipToStores({
      brand: {
        id: input.claim.brandId,
        owner_id: input.claim.claimantUid,
        name: input.claim.brandName,
        slug: input.claim.brandSlug,
        description: null,
        logo_url: null,
        website: input.claim.brandWebsite ?? null,
        category: null,
        country: null,
        verified: true,
        trust_score: 75,
        created_at: input.claim.createdAt,
        signedLogoUrl: null,
        ownerName: null,
      },
      ownerUid: input.claim.claimantUid,
      ownerEmail: input.claim.claimantEmail,
      verifiedDomain: input.claim.officialDomain || input.claim.emailDomain,
      website: input.claim.brandWebsite,
    });
  }
}
