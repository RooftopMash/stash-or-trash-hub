export type DetectorName = "sightengine" | "hive" | "aiornot";
export type DetectorResult = { name: DetectorName; score: number; raw: unknown };
export function activeDetectors(): DetectorName[] {
  const a: DetectorName[] = [];
  if (process.env.SIGHTENGINE_API_KEY) a.push("sightengine");
  if (process.env.HIVE_API_KEY) a.push("hive");
  if (process.env.AIORNOT_API_KEY) a.push("aiornot");
  return a;
}
export async function runCommercialDetectors(_url: string, _type: "image" | "video" | "audio"): Promise<DetectorResult[]> {
  return [];
}
