import { supabase } from "@/integrations/supabase/client";
import { WORLD_COUNTRY_CODES, countryLabel } from "@/lib/geo";

export type CountryCoverage = { code: string; label: string; count: number; remaining: number };

export async function fetchCountryCoverage(target = 100): Promise<CountryCoverage[]> {
  const { data, error } = await supabase.from("brands").select("country");
  if (error) throw error;
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    if (row.country) counts.set(row.country.toUpperCase(), (counts.get(row.country.toUpperCase()) ?? 0) + 1);
  }
  return WORLD_COUNTRY_CODES.map((code) => ({
    code,
    label: countryLabel(code),
    count: counts.get(code) ?? 0,
    remaining: Math.max(0, target - (counts.get(code) ?? 0)),
  })).sort((a, b) => a.count - b.count || a.code.localeCompare(b.code));
}
