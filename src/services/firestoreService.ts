import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  deleteDoc,
  type DocumentData,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";

export interface FirestoreBrand {
  id: string;
  name: string;
  slug: string;
  category?: string;
  country?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  trustScore?: number;
  riskScore?: number;
  status?: "active" | "pending" | "flagged";
  isVerified?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirestoreBrandVote {
  id: string;
  brandId: string;
  userId: string;
  voteType: "stash" | "trash";
  createdAt: string;
}

export interface FirestoreCrisisAlert {
  id: string;
  brandId: string;
  title: string;
  description?: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "resolved" | "investigating";
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirestoreIncident {
  id: string;
  brandId: string;
  title: string;
  details?: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "dismissed";
  reportedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirestoreChatMessage {
  id: string;
  senderId: string;
  receiverId?: string;
  content: string;
  createdAt: string;
}

export interface FirestoreNotification {
  id: string;
  userId: string;
  title: string;
  body?: string;
  read: boolean;
  createdAt: string;
}

// ----------------------------------------------------
// BRANDS
// ----------------------------------------------------
export async function getFirestoreBrands(): Promise<FirestoreBrand[]> {
  const collectionPath = "brands";
  try {
    const q = query(collection(db, collectionPath), limit(200));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as FirestoreBrand[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}

export async function getFirestoreBrandBySlug(slug: string): Promise<FirestoreBrand | null> {
  const collectionPath = "brands";
  try {
    const q = query(collection(db, collectionPath), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as FirestoreBrand;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${collectionPath}/slug/${slug}`);
  }
}

export async function createFirestoreBrand(data: Omit<FirestoreBrand, "id">, customId?: string): Promise<FirestoreBrand> {
  const collectionPath = "brands";
  const brandId = customId || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `brand_${Date.now()}`);
  const docRef = doc(db, collectionPath, brandId);
  try {
    const payload = {
      ...data,
      id: brandId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload);
    return payload as FirestoreBrand;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionPath}/${brandId}`);
  }
}

// ----------------------------------------------------
// BRAND VOTES
// ----------------------------------------------------
export async function castFirestoreBrandVote(brandId: string, userId: string, voteType: "stash" | "trash"): Promise<FirestoreBrandVote> {
  const votePath = `brands/${brandId}/votes/${userId}`;
  const docRef = doc(db, "brands", brandId, "votes", userId);
  try {
    const payload: FirestoreBrandVote = {
      id: userId,
      brandId,
      userId,
      voteType,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, votePath);
  }
}

export async function getFirestoreBrandVotes(brandId: string): Promise<FirestoreBrandVote[]> {
  const collectionPath = `brands/${brandId}/votes`;
  try {
    const snapshot = await getDocs(collection(db, "brands", brandId, "votes"));
    return snapshot.docs.map((docSnap) => docSnap.data() as FirestoreBrandVote);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}

// ----------------------------------------------------
// CRISIS ALERTS
// ----------------------------------------------------
export async function getFirestoreCrisisAlerts(): Promise<FirestoreCrisisAlert[]> {
  const collectionPath = "brand_crisis_alerts";
  try {
    const snapshot = await getDocs(collection(db, collectionPath));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as FirestoreCrisisAlert[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}

export async function createFirestoreCrisisAlert(alert: Omit<FirestoreCrisisAlert, "id">): Promise<FirestoreCrisisAlert> {
  const id = `alert_${Date.now()}`;
  const docPath = `brand_crisis_alerts/${id}`;
  try {
    const payload: FirestoreCrisisAlert = {
      ...alert,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "brand_crisis_alerts", id), payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

// ----------------------------------------------------
// INCIDENTS
// ----------------------------------------------------
export async function getFirestoreIncidents(): Promise<FirestoreIncident[]> {
  const collectionPath = "incidents";
  try {
    const snapshot = await getDocs(collection(db, collectionPath));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as FirestoreIncident[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}

export async function createFirestoreIncident(incident: Omit<FirestoreIncident, "id">): Promise<FirestoreIncident> {
  const id = `inc_${Date.now()}`;
  const docPath = `incidents/${id}`;
  try {
    const payload: FirestoreIncident = {
      ...incident,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "incidents", id), payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

// ----------------------------------------------------
// CHAT MESSAGES
// ----------------------------------------------------
export async function getFirestoreMessages(userId: string): Promise<FirestoreChatMessage[]> {
  const collectionPath = "messages";
  try {
    const snapshot = await getDocs(query(collection(db, collectionPath), limit(100)));
    return snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }) as FirestoreChatMessage)
      .filter((m) => m.senderId === userId || m.receiverId === userId);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}

export async function sendFirestoreMessage(senderId: string, receiverId: string | undefined, content: string): Promise<FirestoreChatMessage> {
  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docPath = `messages/${id}`;
  try {
    const payload: FirestoreChatMessage = {
      id,
      senderId,
      ...(receiverId ? { receiverId } : {}),
      content,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "messages", id), payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

// ----------------------------------------------------
// NOTIFICATIONS
// ----------------------------------------------------
export async function getFirestoreNotifications(userId: string): Promise<FirestoreNotification[]> {
  const collectionPath = "notifications";
  try {
    const snapshot = await getDocs(query(collection(db, collectionPath), where("userId", "==", userId), limit(50)));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as FirestoreNotification[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}

export async function markFirestoreNotificationRead(id: string): Promise<void> {
  const docPath = `notifications/${id}`;
  try {
    await updateDoc(doc(db, "notifications", id), { read: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

// ----------------------------------------------------
// USER PROFILES
// ----------------------------------------------------
export async function getFirestoreUserProfile(userId: string): Promise<DocumentData | null> {
  const docPath = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, "users", userId));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

export async function updateFirestoreUserProfile(userId: string, data: Record<string, unknown>): Promise<void> {
  const docPath = `users/${userId}`;
  try {
    await updateDoc(doc(db, "users", userId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}
