import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type AppRole = "admin" | "brand" | "user";

export function useRoles() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["roles", user?.id ?? "anon"],
    enabled: !!user,
    queryFn: async (): Promise<AppRole[]> => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as AppRole);
    },
  });
  const roles = query.data ?? [];
  return {
    roles,
    isAdmin: roles.includes("admin"),
    isBrand: roles.includes("brand"),
    loading: query.isLoading,
  };
}
