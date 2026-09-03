import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BadgeCheck, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostText } from "@/components/PostText";
import { useAuth } from "@/hooks/useAuth";
import {
  createBrandResponse,
  deleteBrandResponse,
  fetchBrandResponses,
  fetchManagedBrandIds,
} from "@/lib/brand-platform";

/**
 * Official brand replies on a post: publicly readable, written only by users
 * with an analyst/admin role on that brand.
 */
export function BrandResponses({
  itemId,
  brandId,
}: {
  itemId: string;
  brandId: string | null;
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: responses, refetch } = useQuery({
    queryKey: ["brand-responses", itemId],
    queryFn: () => fetchBrandResponses(itemId),
  });

  const { data: managed } = useQuery({
    queryKey: ["managed-brands", user?.id],
    queryFn: () => fetchManagedBrandIds(user!.id),
    enabled: !!user && !!brandId,
  });

  const canRespond = !!brandId && !!managed?.has(brandId);
  const list = responses ?? [];

  const submit = async () => {
    if (!user || !brandId) return;
    setBusy(true);
    try {
      await createBrandResponse({ itemId, brandId, userId: user.id, body });
      setBody("");
      toast.success(t("brandTeam.responsePosted"));
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("brandTeam.responseFailed"));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteBrandResponse(id);
      refetch();
    } catch {
      toast.error(t("brandTeam.responseFailed"));
    }
  };

  if (!list.length && !canRespond) return null;

  return (
    <div className="mt-4 space-y-3">
      {list.map((r) => (
        <div key={r.id} className="rounded-xl border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Megaphone className="h-3.5 w-3.5" />
              {t("brandTeam.officialResponse", { brand: r.brandName ?? "" })}
              {r.brandVerified && <BadgeCheck className="h-3.5 w-3.5" />}
            </div>
            {user?.id === r.user_id && (
              <Button variant="ghost" size="sm" className="h-auto px-1 py-0 text-xs" onClick={() => remove(r.id)}>
                {t("social.delete")}
              </Button>
            )}
          </div>
          <p className="mt-1.5 text-sm">
            <PostText text={r.body} />
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {r.authorName} · {new Date(r.created_at).toLocaleString()}
          </p>
        </div>
      ))}

      {canRespond && (
        <div className="rounded-xl border border-dashed border-primary/40 p-3">
          <p className="text-xs font-semibold text-primary">{t("brandTeam.respondAsBrand")}</p>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("brandTeam.responsePlaceholder")}
            className="mt-2 text-sm"
            rows={3}
          />
          <Button size="sm" className="mt-2" disabled={busy || !body.trim()} onClick={submit}>
            {busy ? t("common.loading") : t("brandTeam.postResponse")}
          </Button>
        </div>
      )}
    </div>
  );
}
