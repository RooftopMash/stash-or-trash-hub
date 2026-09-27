import "../_libs/firebase.mjs";
import { A as collection, g as query, m as getDocs, y as where } from "../_libs/@firebase/firestore+[...].mjs";
import { r as db } from "./firebase-CdNcIlsJ.mjs";
import { Ot as supabase } from "./router-BjpvJuyR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages-DMg_5OEi.js
async function fetchInbox(userId) {
	const rows = [];
	try {
		const q1 = query(collection(db, "messages"), where("senderId", "==", userId));
		const q2 = query(collection(db, "messages"), where("receiverId", "==", userId));
		const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
		const docMap = /* @__PURE__ */ new Map();
		[...snap1.docs, ...snap2.docs].forEach((d) => {
			if (!docMap.has(d.id)) {
				const data = d.data();
				docMap.set(d.id, {
					id: d.id,
					sender_id: data.senderId,
					recipient_id: data.receiverId || "",
					body: data.content,
					read_at: data.read_at || null,
					created_at: data.createdAt || (/* @__PURE__ */ new Date()).toISOString()
				});
			}
		});
		rows.push(...docMap.values());
	} catch (err) {
		console.warn("Firestore fetchInbox note:", err);
	}
	try {
		const { data } = await supabase.from("messages").select("*").or(`sender_id.eq.${userId},recipient_id.eq.${userId}`).order("created_at", { ascending: false });
		if (data) rows.push(...data);
	} catch {}
	const byPartner = /* @__PURE__ */ new Map();
	for (const m of rows) {
		const partner = m.sender_id === userId ? m.recipient_id : m.sender_id;
		if (!partner) continue;
		if (!byPartner.has(partner)) byPartner.set(partner, []);
		byPartner.get(partner).push(m);
	}
	const partnerIds = [...byPartner.keys()];
	const nameById = /* @__PURE__ */ new Map();
	try {
		const { data: profiles } = partnerIds.length ? await supabase.from("profiles").select("id, display_name").in("id", partnerIds) : { data: [] };
		(profiles ?? []).forEach((p) => nameById.set(p.id, p.display_name));
	} catch {}
	return [...byPartner.entries()].map(([partnerId, msgs]) => {
		const last = msgs.sort((a, b) => a.created_at < b.created_at ? 1 : -1)[0];
		return {
			partnerId,
			partnerName: nameById.get(partnerId) ?? "User",
			lastMessage: last.body,
			lastAt: last.created_at,
			unread: msgs.filter((m) => m.recipient_id === userId && !m.read_at).length
		};
	}).sort((a, b) => a.lastAt < b.lastAt ? 1 : -1);
}
async function fetchThread(userId, partnerId) {
	const messages = [];
	try {
		const q1 = query(collection(db, "messages"), where("senderId", "==", userId), where("receiverId", "==", partnerId));
		const q2 = query(collection(db, "messages"), where("senderId", "==", partnerId), where("receiverId", "==", userId));
		const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
		const docMap = /* @__PURE__ */ new Map();
		[...snap1.docs, ...snap2.docs].forEach((d) => {
			const data = d.data();
			docMap.set(d.id, {
				id: d.id,
				sender_id: data.senderId,
				recipient_id: data.receiverId,
				body: data.content,
				read_at: data.read_at || null,
				created_at: data.createdAt
			});
		});
		messages.push(...docMap.values());
	} catch (err) {
		console.warn("Firestore fetchThread note:", err);
	}
	try {
		const { data } = await supabase.from("messages").select("*").or(`and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId})`).order("created_at", { ascending: true });
		if (data) messages.push(...data);
	} catch {}
	const seen = /* @__PURE__ */ new Set();
	return messages.filter((m) => {
		if (seen.has(m.id)) return false;
		seen.add(m.id);
		return true;
	}).sort((a, b) => a.created_at > b.created_at ? 1 : -1);
}
async function sendMessage(input) {
	try {
		const { sendFirestoreMessage } = await import("./firestoreService-CJHy5N5W.mjs");
		await sendFirestoreMessage(input.senderId, input.recipientId, input.body.trim());
	} catch (fsErr) {
		console.warn("Firestore sendMessage note:", fsErr);
	}
	try {
		await supabase.from("messages").insert({
			sender_id: input.senderId,
			recipient_id: input.recipientId,
			body: input.body.trim()
		});
	} catch {}
}
async function markThreadRead(userId, partnerId) {
	try {
		await supabase.from("messages").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("recipient_id", userId).eq("sender_id", partnerId).is("read_at", null);
	} catch {}
}
async function partnerName(partnerId) {
	try {
		const { data } = await supabase.from("profiles").select("display_name").eq("id", partnerId).maybeSingle();
		if (data?.display_name) return data.display_name;
	} catch {}
	try {
		const { getFirestoreUserProfile } = await import("./firestoreService-CJHy5N5W.mjs");
		const userDoc = await getFirestoreUserProfile(partnerId);
		if (userDoc?.displayName) return userDoc.displayName;
	} catch {}
	return "User";
}
//#endregion
export { sendMessage as a, partnerName as i, fetchThread as n, markThreadRead as r, fetchInbox as t };
