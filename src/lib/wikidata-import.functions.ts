import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Wikidata SPARQL importer for brands (companies) by country.
 * Free, attribution-friendly, and includes logos where available.
 * Result is inserted into brand_import_candidates for admin moderation.
 */

const ISO_TO_QID: Record<string, string> = {
  ZA: "Q258", US: "Q30", GB: "Q145", FR: "Q142", DE: "Q183",
  IT: "Q38", ES: "Q29", PT: "Q45", NL: "Q55", BR: "Q155",
  IN: "Q668", CN: "Q148", JP: "Q17", KR: "Q884", MX: "Q96",
  CA: "Q16", AU: "Q408", NG: "Q1033", KE: "Q114", EG: "Q79",
  MA: "Q1028", GH: "Q117", SN: "Q1041", ET: "Q115",
};

const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

export const importBrandsFromWikidata = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      countryCode: z.string().length(2).toUpperCase(),
      limit: z.number().int().min(1).max(200).default(50),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const qid = ISO_TO_QID[data.countryCode];
    if (!qid) throw new Error(`Country ${data.countryCode} not supported yet`);

    // SPARQL: businesses / brands headquartered or based in the country, with logos preferred.
    const query = `
      SELECT DISTINCT ?item ?itemLabel ?desc ?logo ?website ?industryLabel WHERE {
        ?item wdt:P31/wdt:P279* wd:Q4830453 .   # instance of / subclass of business
        { ?item wdt:P17 wd:${qid} } UNION { ?item wdt:P159/wdt:P17 wd:${qid} } .
        OPTIONAL { ?item wdt:P154 ?logo }
        OPTIONAL { ?item wdt:P856 ?website }
        OPTIONAL { ?item wdt:P452 ?industry . ?industry rdfs:label ?industryLabel FILTER(LANG(?industryLabel)="en") }
        OPTIONAL { ?item schema:description ?desc FILTER(LANG(?desc)="en") }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
      }
      LIMIT ${data.limit}
    `;

    const res = await fetch(`${SPARQL_ENDPOINT}?format=json&query=${encodeURIComponent(query)}`, {
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": "SOT-StashOrTrash/1.0 (https://stash-or-trash-hub.lovable.app)",
      },
    });
    if (!res.ok) throw new Error(`Wikidata error ${res.status}`);
    const json = await res.json() as { results: { bindings: any[] } };

    const rows = json.results.bindings.map((b) => {
      const qUrl: string = b.item.value;
      const wdId = qUrl.split("/").pop() ?? "";
      const name: string = b.itemLabel?.value ?? "";
      return {
        source: "wikidata",
        source_id: wdId,
        name,
        slug: slugify(name),
        country: data.countryCode,
        category: b.industryLabel?.value ?? null,
        description: b.desc?.value ?? null,
        website: b.website?.value ?? null,
        logo_url: b.logo?.value ?? null,
        status: "pending",
      };
    }).filter((r) => r.name && r.slug);

    if (!rows.length) return { inserted: 0, skipped: 0 };

    // Upsert on (source, source_id) unique index — ignore duplicates.
    const { data: inserted, error } = await context.supabase
      .from("brand_import_candidates" as any)
      .upsert(rows, { onConflict: "source,source_id", ignoreDuplicates: true })
      .select("id");
    if (error) throw error;

    return { inserted: inserted?.length ?? 0, skipped: rows.length - (inserted?.length ?? 0) };
  });

export const approveBrandCandidate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { data: cand, error: cErr } = await context.supabase
      .from("brand_import_candidates" as any)
      .select("*").eq("id", data.id).maybeSingle();
    if (cErr) throw cErr;
    if (!cand) throw new Error("Not found");
    const c = cand as any;

    // Ensure slug uniqueness
    let slug = c.slug;
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await context.supabase.from("brands").select("id").eq("slug", slug).maybeSingle();
      if (!existing) break;
      slug = `${c.slug}-${Math.floor(Math.random() * 10000)}`;
    }

    const { data: brand, error: bErr } = await context.supabase
      .from("brands")
      .insert({
        owner_id: context.userId, // admin owns until claimed
        name: c.name,
        slug,
        description: c.description,
        website: c.website,
        category: c.category,
        logo_url: c.logo_url,
      })
      .select("id").single();
    if (bErr) throw bErr;

    await context.supabase
      .from("brand_import_candidates" as any)
      .update({ status: "approved", imported_brand_id: brand.id, reviewed_by: context.userId })
      .eq("id", data.id);

    return { brandId: brand.id };
  });

export const rejectBrandCandidate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("brand_import_candidates" as any)
      .update({ status: "rejected", reviewed_by: context.userId })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
