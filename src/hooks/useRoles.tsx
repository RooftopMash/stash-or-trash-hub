import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AppRole = "admin" | "brand" | "user";
export type ActiveAccountPersona = "consumer" | "brand_owner";

const KNOWN_ADMIN_EMAILS = ["borulelo@gmail.com"];
const PERSONA_STORAGE_KEY = "sot_active_account_persona_v1";

export function getStoredAccountPersona(defaultIsBrand = false): ActiveAccountPersona {
  if (typeof window === "undefined") return defaultIsBrand ? "brand_owner" : "consumer";
  try {
    const saved = window.localStorage.getItem(PERSONA_STORAGE_KEY);
    if (saved === "brand_owner" || saved === "consumer") return saved;
  } catch {
    // ignore
  }
  return defaultIsBrand ? "brand_owner" : "consumer";
}

export function setStoredAccountPersona(persona: ActiveAccountPersona) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PERSONA_STORAGE_KEY, persona);
    window.dispatchEvent(new CustomEvent("sot-persona-changed", { detail: persona }));
  } catch {
    // ignore
  }
}

export function useRoles() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["roles", user?.id ?? "anon", user?.email ?? "no-email"],
    enabled: !!user,
    queryFn: async (): Promise<AppRole[]> => {
      if (!user) return [];
      const rolesSet = new Set<AppRole>();

      // 1. Direct owner/admin email check (matches firestore.rules)
      const userEmail = (user.email || "").toLowerCase().trim();
      if (KNOWN_ADMIN_EMAILS.includes(userEmail)) {
        rolesSet.add("admin");
      }

      // 2. Check Firestore "admins" and "users" collection
      try {
        const adminDocRef = doc(db, "admins", user.id);
        const adminDocSnap = await getDoc(adminDocRef);
        if (adminDocSnap.exists()) {
          rolesSet.add("admin");
        }

        const userDocRef = doc(db, "users", user.id);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const udata = userDocSnap.data();
          if (udata?.role === "admin" || udata?.isAdmin === true) {
            rolesSet.add("admin");
          }
          if (udata?.role === "brand" || udata?.isBrand === true) {
            rolesSet.add("brand");
          }
        }
      } catch {
        // Firestore read error ignored if offline or rule restricted
      }

      // 3. Fallback to Supabase user_roles table if present
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);
        if (data) {
          data.forEach((r) => rolesSet.add(r.role as AppRole));
        }
      } catch {
        // Supabase error ignored
      }

      if (rolesSet.size === 0) {
        rolesSet.add("user");
      }

      return Array.from(rolesSet);
    },
  });

  const roles = query.data ?? [];
  const isOwnerEmail = !!user?.email && KNOWN_ADMIN_EMAILS.includes(user.email.toLowerCase().trim());
  const isAdmin = isOwnerEmail || roles.includes("admin");
  const hasBrandRole = roles.includes("brand") || isAdmin;

  const [persona, setPersonaState] = useState<ActiveAccountPersona>(() =>
    getStoredAccountPersona(roles.includes("brand")),
  );

  useEffect(() => {
    const syncPersona = () => {
      setPersonaState(getStoredAccountPersona(roles.includes("brand")));
    };
    window.addEventListener("sot-persona-changed", syncPersona);
    return () => window.removeEventListener("sot-persona-changed", syncPersona);
  }, [roles]);

  const setPersona = (next: ActiveAccountPersona) => {
    setStoredAccountPersona(next);
    setPersonaState(next);
  };

  const isBrand = persona === "brand_owner" || roles.includes("brand");

  return {
    roles,
    isAdmin,
    isBrand,
    hasBrandRole,
    persona,
    setPersona,
    loading: query.isLoading,
  };
}


