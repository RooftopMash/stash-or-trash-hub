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

export async function importBrandsFromWikidata(input: {
  countryCode: string;
  limit: number;
}): Promise<WikidataImportResult> {
  const countryCode = input.countryCode.toUpperCase();
  const limit = Math.max(1, Math.min(200, input.limit));
  const qid = ISO_TO_QID[countryCode];
  if (!qid) throw new Error(`Country ${countryCode} is not supported yet.`);

  const query = `
    SELECT DISTINCT ?item ?itemLabel ?desc ?logo ?website ?industryLabel WHERE {
      ?item wdt:P31/wdt:P279* wd:Q4830453 .
      { ?item wdt:P17 wd:${qid} } UNION { ?item wdt:P159/wdt:P17 wd:${qid} } .
      OPTIONAL { ?item wdt:P154 ?logo }
      OPTIONAL { ?item wdt:P856 ?website }
      OPTIONAL { ?item wdt:P452 ?industry . ?industry rdfs:label ?industryLabel FILTER(LANG(?industryLabel)="en") }
      OPTIONAL { ?item schema:description ?desc FILTER(LANG(?desc)="en") }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    }
    LIMIT ${limit}
  `;

  const res = await fetch(`${SPARQL_ENDPOINT}?format=json&query=${encodeURIComponent(query)}`, {
    headers: { Accept: "application/sparql-results+json" },
  });
  if (!res.ok) throw new Error(`Wikidata returned ${res.status}. Please try again.`);
  const json = await res.json() as { results?: { bindings?: any[] } };

  const rows = (json.results?.bindings ?? [])
    .map((b) => {
      const qUrl: string = b.item?.value ?? "";
      const name: string = b.itemLabel?.value ?? "";
      return {
        source: "wikidata",
        source_id: qUrl.split("/").pop() ?? null,
        name,
        slug: slugify(name),
        country: countryCode,
        category: b.industryLabel?.value ?? null,
        description: b.desc?.value ?? null,
        website: b.website?.value ?? null,
        logo_url: b.logo?.value ?? null,
        status: "pending",
      };
    })
    .filter((row) => row.name && row.slug);

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