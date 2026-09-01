import { supabase } from "@/integrations/supabase/client";

export type IncidentMediaType = "photo" | "video" | "audio";

export type Incident = {
  id: string;
  user_id: string;
  brand_id: string | null;
  title: string;
  description: string | null;
  media_url: string | null;
  media_type: IncidentMediaType | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  authorName: string;
  brandName: string | null;
  brandSlug: string | null;
  signedMediaUrl: string | null;
};

export const INCIDENT_BUCKET = "incident-media";

async function sign(paths: (string | null)[]): Promise<Map<string, string>> {
  const unique = [...new Set(paths.filter((p): p is string => !!p))];
  const map = new Map<string, string>();
  if (unique.length === 0) return map;
  const { data } = await supabase.storage.from(INCIDENT_BUCKET).createSignedUrls(unique, 60 * 60 * 24 * 7);
  data?.forEach((e) => {
    if (e.signedUrl && e.path) map.set(e.path, e.signedUrl);
  });
  return map;
}

export async function fetchIncidents(limit = 100): Promise<Incident[]> {
  const { data, error } = await supabase
    .from("incidents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  const rows = (data ?? []) as any[];
  if (!rows.length) return [];

  const authorIds = [...new Set(rows.map((r) => r.user_id))];
  const brandIds = [...new Set(rows.map((r) => r.brand_id).filter((b): b is string => !!b))];
  const [{ data: profiles }, { data: brands }, signed] = await Promise.all([
    supabase.from("profiles").select("id, display_name").in("id", authorIds),
    brandIds.length
      ? supabase.from("brands").select("id, name, slug").in("id", brandIds)
      : Promise.resolve({ data: [] as { id: string; name: string; slug: string }[] }),
    sign(rows.map((r) => r.media_url)),
  ]);
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
  const brandById = new Map((brands ?? []).map((b) => [b.id, b]));
  return rows.map((r) => ({
    ...r,
    authorName: nameById.get(r.user_id) ?? "Anonymous",
    brandName: r.brand_id ? (brandById.get(r.brand_id)?.name ?? null) : null,
    brandSlug: r.brand_id ? (brandById.get(r.brand_id)?.slug ?? null) : null,
    signedMediaUrl: r.media_url ? (signed.get(r.media_url) ?? null) : null,
  }));
}

export async function createIncident(input: {
  userId: string;
  brandId?: string | null;
  title: string;
  description?: string | null;
  file?: File | null;
  mediaType?: IncidentMediaType | null;
  lat?: number | null;
  lng?: number | null;
}): Promise<Incident> {
  let mediaPath: string | null = null;
  if (input.file) {
    const ext = input.file.name.split(".").pop() || (input.mediaType === "audio" ? "webm" : "jpg");
    const path = `${input.userId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(INCIDENT_BUCKET).upload(path, input.file, { upsert: false });
    if (error) throw error;
    mediaPath = path;
  }
  const { data, error } = await supabase
    .from("incidents")
    .insert({
      user_id: input.userId,
      brand_id: input.brandId || null,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      media_url: mediaPath,
      media_type: mediaPath ? input.mediaType ?? "photo" : null,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Incident;
}

export function subscribeToIncidents(onEvent: (payload: any) => void) {
  return supabase
    .channel("live-incidents")
    .on("postgres_changes", { event: "*", schema: "public", table: "incidents" }, (payload) => onEvent(payload))
    .subscribe();
}
