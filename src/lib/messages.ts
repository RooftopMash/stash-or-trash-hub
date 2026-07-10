import { supabase } from "@/integrations/supabase/client";

export type ChatMessage = {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

export type Conversation = {
  partnerId: string;
  partnerName: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
};

export async function fetchInbox(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = data ?? [];

  const byPartner = new Map<string, ChatMessage[]>();
  for (const m of rows) {
    const partner = m.sender_id === userId ? m.recipient_id : m.sender_id;
    if (!byPartner.has(partner)) byPartner.set(partner, []);
    byPartner.get(partner)!.push(m);
  }

  const partnerIds = [...byPartner.keys()];
  const { data: profiles } = partnerIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", partnerIds)
    : { data: [] as { id: string; display_name: string }[] };
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));

  return [...byPartner.entries()]
    .map(([partnerId, msgs]) => {
      const last = msgs[0];
      return {
        partnerId,
        partnerName: nameById.get(partnerId) ?? "Someone",
        lastMessage: last.body,
        lastAt: last.created_at,
        unread: msgs.filter((m) => m.recipient_id === userId && !m.read_at).length,
      };
    })
    .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));
}

export async function fetchThread(userId: string, partnerId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId})`,
    )
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function sendMessage(input: { senderId: string; recipientId: string; body: string }) {
  const { error } = await supabase.from("messages").insert({
    sender_id: input.senderId,
    recipient_id: input.recipientId,
    body: input.body.trim(),
  });
  if (error) throw error;
}

export async function markThreadRead(userId: string, partnerId: string) {
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient_id", userId)
    .eq("sender_id", partnerId)
    .is("read_at", null);
}

export async function partnerName(partnerId: string): Promise<string> {
  const { data } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", partnerId)
    .maybeSingle();
  return data?.display_name ?? "Someone";
}
