import { supabase } from "@/integrations/supabase/client";

const ISO_TO_QID: Record<string, string> = {
  ZA: "Q258", US: "Q30", GB: "Q145", FR: "Q142", DE: "Q183",
  IT: "Q38", ES: "Q29", PT: "Q45", NL: "Q55", BR: "Q155",
  IN: "Q668", CN: "Q148", JP: "Q17", KR: "Q884", MX: "Q96",
  CA: "Q16", AU: "Q408", NG: "Q1033", KE: "Q114", EG: "Q79",
  MA: "Q1028", GH: "Q117", SN: "Q1041", ET: "Q115",
};

const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

export type WikidataImportResult = {
  inserted: number;
  skipped: number;
};

export type ApprovedBrand = {
  brandId: string;
  name: string;
  slug: string;
  website: string | null;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function buildBrandInvitation(input: {
  name: string;
  slug: string;
  website?: string | null;
}) {
  const origin = typeof window === "undefined" ? "https://stash-or-trash-hub.lovable.app" : window.location.origin;
  const brandUrl = `${origin}/brands/${input.slug}`;
  return `Subject: ${input.name} is now on SOT — Stash Or Trash\n\nHello ${input.name} team,\n\nWe have opened a live brand-rating page for ${input.name} on SOT — Stash Or Trash, the Consumer Brand Revolution built to turn everyday customer feedback into a credible reputation signal.\n\nYour page: ${brandUrl}\n${input.website ? `Website we found: ${input.website}\n` : ""}\nConsumers can now Stash or Trash brand experiences in public, and verified brand owners can claim their page, monitor sentiment, and respond directly through the platform.\n\nPlease create an account with your official company email, open the page above, and choose “Claim this brand” so our team can verify your ownership.\n\nRegards,\nSOT — Stash Or Trash\nThe Brand Barometer`;
}

// Wikidata's public endpoint times out on broad subclass traversal for large
// countries (e.g. the US), so we query each company class separately and merge.
const BRAND_CLASSES = ["Q4830453", "Q891723", "Q431289", "Q6881511", "Q783794"];

type Candidate = {
  source: string;
  source_id: string;
  name: string;
  slug: string;
  country: string;
  category: string | null;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  status: string;
};

function buildQuery(cls: string, qid: string, path: "P17" | "P159/wdt:P17", limit: number) {
  const countryPath = path === "P17" ? "wdt:P17" : "wdt:P159/wdt:P17";
  return `
    SELECT ?item ?itemLabel ?desc ?logo ?website ?industryLabel ?sitelinks WHERE {
      { SELECT ?item ?sitelinks WHERE {
          ?item wdt:P31 wd:${cls} ;
                ${countryPath} wd:${qid} ;
                wikibase:sitelinks ?sitelinks .
        } ORDER BY DESC(?sitelinks) LIMIT ${limit} }
      OPTIONAL { ?item wdt:P154 ?logo }
      OPTIONAL { ?item wdt:P856 ?website }
      OPTIONAL { ?item wdt:P452 ?industry . ?industry rdfs:label ?industryLabel FILTER(LANG(?industryLabel)="en") }
      OPTIONAL { ?item schema:description ?desc FILTER(LANG(?desc)="en") }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    }
    ORDER BY DESC(?sitelinks)
  `;
}

async function runQuery(query: string): Promise<any[]> {
  const url = `${SPARQL_ENDPOINT}?origin=*&format=json&query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/sparql-results+json",
      "Api-User-Agent": "StashOrTrashHub/1.0 (https://stash-or-trash-hub.lovable.app; contact@stash-or-trash-hub.lovable.app)",
    },
  });
  if (!res.ok) throw new Error(`Wikidata returned ${res.status}`);
  const json = (await res.json()) as { results?: { bindings?: any[] } };
  return json.results?.bindings ?? [];
}

export async function importBrandsFromWikidata(input: {
  countryCode: string;
  limit: number;
}): Promise<WikidataImportResult> {
  const countryCode = input.countryCode.toUpperCase();
  const limit = Math.max(1, Math.min(200, input.limit));
  const qid = ISO_TO_QID[countryCode];
  if (!qid) throw new Error(`Country ${countryCode} is not supported yet.`);

  const queries: string[] = [];
  for (const cls of BRAND_CLASSES) {
    queries.push(buildQuery(cls, qid, "P17", limit));
    queries.push(buildQuery(cls, qid, "P159/wdt:P17", limit));
  }

  const settled = await Promise.allSettled(queries.map(runQuery));
  const bindings = settled.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  if (!bindings.length) {
    throw new Error("Wikidata did not respond in time. Please try again with a smaller limit.");
  }

  // Wikidata returns one row per optional value combination — collapse to one row per entity.
  const byId = new Map<string, Candidate & { sitelinks: number }>();

  for (const b of bindings) {
    const qUrl: string = b.item?.value ?? "";
    const sourceId = qUrl.split("/").pop() ?? "";
    const name: string = b.itemLabel?.value ?? "";
    // Skip entities with no English label (Wikidata falls back to the raw Q-id).
    if (!sourceId || !name || /^Q\d+$/.test(name)) continue;
    const slug = slugify(name);
    if (!slug) continue;

    const existing = byId.get(sourceId);
    if (existing) {
      existing.category ??= b.industryLabel?.value ?? null;
      existing.description ??= b.desc?.value ?? null;
      existing.website ??= b.website?.value ?? null;
      existing.logo_url ??= b.logo?.value ?? null;
      continue;
    }

    byId.set(sourceId, {
      source: "wikidata",
      source_id: sourceId,
      name,
      slug,
      country: countryCode,
      category: b.industryLabel?.value ?? null,
      description: b.desc?.value ?? null,
      website: b.website?.value ?? null,
      logo_url: b.logo?.value ?? null,
      status: "pending",
      sitelinks: Number(b.sitelinks?.value ?? 0),
    });
  }

  const rows: Candidate[] = [...byId.values()]
    .sort((a, b) => b.sitelinks - a.sitelinks)
    .slice(0, limit)
    .map(({ sitelinks: _s, ...row }) => row);
  if (!rows.length) return { inserted: 0, skipped: 0 };

  const { data, error } = await supabase
    .from("brand_import_candidates")
    .upsert(rows, { onConflict: "source,source_id", ignoreDuplicates: true })
    .select("id");
  if (error) throw error;

  return { inserted: data?.length ?? 0, skipped: rows.length - (data?.length ?? 0) };
}


export async function approveBrandCandidate(id: string, reviewerId: string): Promise<ApprovedBrand> {
  const { data: cand, error: candidateError } = await supabase
    .from("brand_import_candidates")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (candidateError) throw candidateError;
  if (!cand) throw new Error("Candidate not found.");

  let slug = cand.slug;
  for (let i = 0; i < 5; i += 1) {
    const { data: existing } = await supabase.from("brands").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    slug = `${cand.slug}-${Math.floor(Math.random() * 10000)}`;
  }

  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .insert({
      owner_id: reviewerId,
      name: cand.name,
      slug,
      description: cand.description,
      website: cand.website,
      category: cand.category,
      logo_url: cand.logo_url,
    })
    .select("id, name, slug, website")
    .single();
  if (brandError) throw brandError;

  const { error: updateError } = await supabase
    .from("brand_import_candidates")
    .update({ status: "approved", imported_brand_id: brand.id, reviewed_by: reviewerId })
    .eq("id", id);
  if (updateError) throw updateError;

  return { brandId: brand.id, name: brand.name, slug: brand.slug, website: brand.website };
}

export async function rejectBrandCandidate(id: string, reviewerId: string) {
  const { error } = await supabase
    .from("brand_import_candidates")
    .update({ status: "rejected", reviewed_by: reviewerId })
    .eq("id", id);
  if (error) throw error;
}