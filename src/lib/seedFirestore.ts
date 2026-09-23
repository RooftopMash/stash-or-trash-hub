import { collection, getDocs, limit, query, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SOUTH_AFRICAN_SEED_BRANDS, INTERNATIONAL_SEED_BRANDS } from "@/lib/seed-brands";

let hasChecked = false;

export async function autoSeedFirestoreIfEmpty(): Promise<void> {
  if (hasChecked || typeof window === "undefined") return;
  hasChecked = true;

  try {
    const q = query(collection(db, "brands"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return; // Already populated
    }

    const seeds = [...SOUTH_AFRICAN_SEED_BRANDS, ...INTERNATIONAL_SEED_BRANDS];
    const unique = new Map<string, (typeof seeds)[0]>();
    for (const b of seeds) {
      if (!unique.has(b.slug)) unique.set(b.slug, b);
    }

    const batch = writeBatch(db);
    let count = 0;
    for (const brand of unique.values()) {
      if (count >= 50) break; // Keep initial seed batch responsive
      const ref = doc(db, "brands", brand.id || brand.slug);
      batch.set(ref, {
        id: brand.id || brand.slug,
        name: brand.name,
        slug: brand.slug,
        category: brand.category || "General",
        country: brand.country || "ZA",
        description: brand.description || null,
        website: brand.website || null,
        logoUrl: brand.logo_url || null,
        trustScore: brand.trust_score || 75,
        riskScore: 25,
        status: "active",
        isVerified: brand.verified || false,
        createdBy: "system",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      count++;
    }

    await batch.commit();
    console.log(`Seeded ${count} initial brands into Firestore.`);
  } catch (err) {
    console.warn("Firestore auto-seed note:", err);
  }
}
