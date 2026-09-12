import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const allCountryCodes = `AF AX AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UM UY UZ VU VE VN VG VI WF EH YE ZM ZW`.split(" ");
const requestedCodes = process.env.COUNTRY_CODES?.split(",").map((code) => code.trim().toUpperCase()).filter(Boolean);
const countryCodes = requestedCodes?.length ? requestedCodes : allCountryCodes;
const checkpointPath = process.env.COUNTRY_CHECKPOINT ?? ".country-import-checkpoint.json";
const checkpoint = existsSync(checkpointPath) ? JSON.parse(readFileSync(checkpointPath, "utf8")) : {};
const endpoint = "https://query.wikidata.org/sparql";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const classes = ["Q4830453", "Q891723", "Q431289", "Q6881511", "Q783794"];
const qidCache = new Map();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function queryWikidata(query) {
  let last;
  for (let i = 0; i < 4; i++) {
    try {
      const response = await fetch(`${endpoint}?origin=*&format=json&query=${encodeURIComponent(query)}`, { signal: AbortSignal.timeout(30000), headers: { Accept: "application/sparql-results+json", "User-Agent": "StashOrTrashHub/1.0" } });
      if (!response.ok) throw new Error(`Wikidata ${response.status}`);
      return (await response.json()).results?.bindings ?? [];
    } catch (error) { last = error; await sleep(750 * (i + 1)); }
  }
  throw last;
}

async function qid(code) {
  if (qidCache.has(code)) return qidCache.get(code);
  const rows = await queryWikidata(`SELECT ?country WHERE { ?country wdt:P297 "${code}". } LIMIT 1`);
  const value = rows[0]?.country?.value?.split("/").pop() ?? null;
  qidCache.set(code, value);
  return value;
}

function slugify(value) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60); }
function query(cls, country, path) { return `SELECT ?item ?itemLabel ?desc ?logo ?website ?industryLabel ?sitelinks WHERE { { SELECT ?item ?sitelinks WHERE { ?item wdt:P31 wd:${cls}; ${path} wd:${country}; wikibase:sitelinks ?sitelinks. } ORDER BY DESC(?sitelinks) LIMIT 50 } OPTIONAL { ?item wdt:P154 ?logo } OPTIONAL { ?item wdt:P856 ?website } OPTIONAL { ?item wdt:P452 ?industry . ?industry rdfs:label ?industryLabel FILTER(LANG(?industryLabel)="en") } OPTIONAL { ?item schema:description ?desc FILTER(LANG(?desc)="en") } SERVICE wikibase:label { bd:serviceParam wikibase:language "en" } } ORDER BY DESC(?sitelinks)`; }

async function importCountry(code) {
  if (checkpoint[code] && !process.env.RETRY_FAILED) return checkpoint[code];
  const country = await qid(code);
  if (!country) return { code, inserted: 0, error: "no QID" };
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("country timeout")), 90000));
  return Promise.race([importCountryUnbounded(code, country), timeout]);
}

async function importCountryUnbounded(code, country) {
  const queries = classes.flatMap((cls) => [query(cls, country, "wdt:P17"), query(cls, country, "wdt:P159/wdt:P17")]);
  const responses = await Promise.allSettled(queries.map(queryWikidata));
  const entities = new Map();
  for (const result of responses) for (const row of result.status === "fulfilled" ? result.value : []) {
    const sourceId = row.item?.value?.split("/").pop(); const name = row.itemLabel?.value;
    if (!sourceId || !name || /^Q\\d+$/.test(name)) continue;
    const current = entities.get(sourceId) ?? { source: "wikidata", source_id: sourceId, name, slug: slugify(name), country: code, category: null, description: null, website: null, logo_url: null, status: "pending" };
    current.category ||= row.industryLabel?.value ?? null; current.description ||= row.desc?.value ?? null; current.website ||= row.website?.value ?? null; current.logo_url ||= row.logo?.value ?? null; entities.set(sourceId, current);
  }
  if (!entities.size) {
    const fallback = `SELECT DISTINCT ?item ?itemLabel ?desc ?logo ?website ?sitelinks WHERE { { ?item wdt:P17 wd:${country} } UNION { ?item wdt:P159/wdt:P17 wd:${country} } UNION { ?item wdt:P495 wd:${country} } ?item wikibase:sitelinks ?sitelinks . OPTIONAL { ?item wdt:P154 ?logo } OPTIONAL { ?item wdt:P856 ?website } OPTIONAL { ?item schema:description ?desc FILTER(LANG(?desc)="en") } SERVICE wikibase:label { bd:serviceParam wikibase:language "en" } } ORDER BY DESC(?sitelinks) LIMIT 50`;
    const fallbackRows = await queryWikidata(fallback).catch(() => []);
    for (const row of fallbackRows) {
      const sourceId = row.item?.value?.split("/").pop(); const name = row.itemLabel?.value;
      if (!sourceId || !name || /^Q\\d+$/.test(name)) continue;
      entities.set(sourceId, { source: "wikidata", source_id: sourceId, name, slug: slugify(name), country: code, category: "brand", description: row.desc?.value ?? null, website: row.website?.value ?? null, logo_url: row.logo?.value ?? null, status: "pending" });
    }
  }
  const rows = [...entities.values()].filter((row) => row.slug).slice(0, 100);
  if (!rows.length) return { code, inserted: 0, error: "no candidates" };
  const { data, error } = await supabase.from("brand_import_candidates").upsert(rows, { onConflict: "source,source_id", ignoreDuplicates: true }).select("id");
  if (!error) return { code, inserted: data?.length ?? 0 };
  let inserted = 0;
  for (const row of rows) {
    const result = await supabase.from("brand_import_candidates").upsert(row, { onConflict: "source,source_id", ignoreDuplicates: true }).select("id").maybeSingle();
    if (!result.error && result.data) inserted += 1;
  }
  return inserted ? { code, inserted } : { code, inserted: 0, error: error.message };
}

const results = [];
for (let i = 0; i < countryCodes.length; i += 3) {
  const batch = await Promise.all(countryCodes.slice(i, i + 3).map(async (code) => {
    try { return await importCountry(code); }
    catch (error) { return { code, inserted: 0, error: error instanceof Error ? error.message : "unknown error" }; }
  }));
  results.push(...batch);
  for (const result of batch) checkpoint[result.code] = result;
  writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2));
  console.log(JSON.stringify(batch)); await sleep(1000);
}
console.log(JSON.stringify({ countries: results.length, inserted: results.reduce((sum, item) => sum + item.inserted, 0), failed: results.filter((item) => item.error) }, null, 2));
