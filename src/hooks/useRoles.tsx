import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AppRole = "admin" | "brand" | "user";

const KNOWN_ADMIN_EMAILS = ["borulelo@gmail.com"];

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
  const isBrand = roles.includes("brand");

  return {
    roles,
    isAdmin,
    isBrand,
    loading: query.isLoading,
  };
}

