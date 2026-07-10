import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { fetchPendingVerifications, reviewVerification } from "@/lib/brands";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isAdmin, loading } = useRoles();

  const { data, refetch } = useQuery({
    queryKey: ["pending-verifications"],
    queryFn: fetchPendingVerifications,
    enabled: isAdmin,
  });

  const review = async (requestId: string, brandId: string, approve: boolean) => {
    if (!user) return;
    try {
      await reviewVerification({ requestId, brandId, reviewerId: user.id, approve });
      toast.success(approve ? t("admin.approved") : t("admin.rejected"));
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed.");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 font-display text-3xl font-extrabold">{t("admin.title")}</h1>
        {loading ? null : !isAdmin ? (
          <p className="text-muted-foreground">You don't have access to this page.</p>
        ) : (data ?? []).length === 0 ? (
          <p className="text-muted-foreground">{t("admin.empty")}</p>
        ) : (
          <div className="space-y-3">
            {(data ?? []).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div>
                  <p className="font-display text-lg font-bold">{r.brandName}</p>
                  {r.message && <p className="text-sm text-muted-foreground">{r.message}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => review(r.id, r.brand_id, true)}>
                    {t("admin.approve")}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => review(r.id, r.brand_id, false)}>
                    {t("admin.reject")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
