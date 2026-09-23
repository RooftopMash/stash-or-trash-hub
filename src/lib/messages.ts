import { supabase } from "@/integrations/supabase/client";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, doc, updateDoc, orderBy } from "firebase/firestore";

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
  const rows: ChatMessage[] = [];

  // 1. Fetch Firestore messages
  try {
    const q1 = query(collection(db, "messages"), where("senderId", "==", userId));
    const q2 = query(collection(db, "messages"), where("receiverId", "==", userId));
    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

    const docMap = new Map();
    [...snap1.docs, ...snap2.docs].forEach((d) => {
      if (!docMap.has(d.id)) {
        const data = d.data();
        docMap.set(d.id, {
          id: d.id,
          sender_id: data.senderId,
          recipient_id: data.receiverId || "",
          body: data.content,
          read_at: data.read_at || null,
          created_at: data.createdAt || new Date().toISOString(),
        });
      }
    });
    rows.push(...docMap.values());
  } catch (err) {
    console.warn("Firestore fetchInbox note:", err);
  }

  // 2. Fetch Supabase messages if available
  try {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order("created_at", { ascending: false });
    if (data) {
      rows.push(...data);
    }
  } catch {
    // legacy store unavailable
  }

  const byPartner = new Map<string, ChatMessage[]>();
  for (const m of rows) {
    const partner = m.sender_id === userId ? m.recipient_id : m.sender_id;
    if (!partner) continue;
    if (!byPartner.has(partner)) byPartner.set(partner, []);
    byPartner.get(partner)!.push(m);
  }

  const partnerIds = [...byPartner.keys()];
  const nameById = new Map<string, string>();
  try {
    const { data: profiles } = partnerIds.length
      ? await supabase.from("profiles").select("id, display_name").in("id", partnerIds)
      : { data: [] as { id: string; display_name: string }[] };
    (profiles ?? []).forEach((p) => nameById.set(p.id, p.display_name));
  } catch {
    // profiles unavailable
  }

  return [...byPartner.entries()]
    .map(([partnerId, msgs]) => {
      const sorted = msgs.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      const last = sorted[0];
      return {
        partnerId,
        partnerName: nameById.get(partnerId) ?? "User",
        lastMessage: last.body,
        lastAt: last.created_at,
        unread: msgs.filter((m) => m.recipient_id === userId && !m.read_at).length,
      };
    })
    .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));
}

export async function fetchThread(userId: string, partnerId: string): Promise<ChatMessage[]> {
  const messages: ChatMessage[] = [];

  // Firestore thread
  try {
    const q1 = query(
      collection(db, "messages"),
      where("senderId", "==", userId),
      where("receiverId", "==", partnerId)
    );
    const q2 = query(
      collection(db, "messages"),
      where("senderId", "==", partnerId),
      where("receiverId", "==", userId)
    );
    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

    const docMap = new Map();
    [...snap1.docs, ...snap2.docs].forEach((d) => {
      const data = d.data();
      docMap.set(d.id, {
        id: d.id,
        sender_id: data.senderId,
        recipient_id: data.receiverId,
        body: data.content,
        read_at: data.read_at || null,
        created_at: data.createdAt,
      });
    });
    messages.push(...docMap.values());
  } catch (err) {
    console.warn("Firestore fetchThread note:", err);
  }

  // Supabase thread
  try {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId})`,
      )
      .order("created_at", { ascending: true });
    if (data) {
      messages.push(...data);
    }
  } catch {
    // legacy store unavailable
  }

  const seen = new Set<string>();
  return messages
    .filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    })
    .sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
}

export async function sendMessage(input: { senderId: string; recipientId: string; body: string }) {
  // 1. Send via Firestore
  try {
    const { sendFirestoreMessage } = await import("@/services/firestoreService");
    await sendFirestoreMessage(input.senderId, input.recipientId, input.body.trim());
  } catch (fsErr) {
    console.warn("Firestore sendMessage note:", fsErr);
  }

  // 2. Legacy Supabase
  try {
    await supabase.from("messages").insert({
      sender_id: input.senderId,
      recipient_id: input.recipientId,
      body: input.body.trim(),
    });
  } catch {
    // legacy store unavailable
  }
}

export async function markThreadRead(userId: string, partnerId: string) {
  try {
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("recipient_id", userId)
      .eq("sender_id", partnerId)
      .is("read_at", null);
  } catch {
    // legacy store unavailable
  }
}

export async function partnerName(partnerId: string): Promise<string> {
  try {
    const { data } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", partnerId)
      .maybeSingle();
    if (data?.display_name) return data.display_name;
  } catch {
    // legacy store unavailable
  }

  try {
    const { getFirestoreUserProfile } = await import("@/services/firestoreService");
    const userDoc = await getFirestoreUserProfile(partnerId);
    if (userDoc?.displayName) return userDoc.displayName;
  } catch {
    // firestore profile lookup note
  }

  return "User";
}
