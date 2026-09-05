import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { castBrandVote, removeBrandVote, fetchBrandVerdict } from "@/lib/brands";
import { recordVote, emitEngagementChange } from "@/lib/engagement";
import coinIcon from "@/assets/icon-coin.png";
import binIcon from "@/assets/icon-bin.png";
import { cn } from "@/lib/utils";

/**
 * One-tap Stash / Trash on a brand itself. `compact` renders just the two
 * buttons for use inside brand cards; the default renders the full panel with
 * the live community meter.
 */
export function BrandVerdict({
  brandId,
  brandName,
  compact = false,
  className,
}: {
  brandId: string;
  brandName: string;
  compact?: boolean;
  className?: string;
}) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["brand-verdict", brandId, user?.id ?? "anon"],
    queryFn: () => fetchBrandVerdict(brandId, user?.id ?? null),
  });

  const mine = data?.myVerdict ?? null;
  const pct = data?.stash_pct ?? 50;

  const vote = async (verdict: "stash" | "trash") => {
    if (!user) {
      toast.info(t("vote.signInPrompt"));
      navigate({ to: "/auth" });
      return;
    }
    setBusy(true);
    try {
      if (mine === verdict) {
        await removeBrandVote(brandId, user.id);
      } else {
        await castBrandVote(brandId, user.id, verdict);
        const { reward, milestone } = recordVote();
        emitEngagementChange();
        toast.success(milestone ?? reward);
      }
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("vote.voteFailed"));
    } finally {
      setBusy(false);
    }
  };

  const buttons = (
    <div className={cn("grid grid-cols-2 gap-2", !compact && "gap-3")}>
      <Button
        variant="stash"
        size={compact ? "sm" : "lg"}
        disabled={busy}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          vote("stash");
        }}
        className={cn("gap-2", mine === "stash" && "verdict-picked", mine === "trash" && "verdict-dimmed")}
      >
        <img src={coinIcon} alt="" aria-hidden className="verdict-icon" /> {t("vote.stash")}
      </Button>
      <Button
        variant="trash"
        size={compact ? "sm" : "lg"}
        disabled={busy}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          vote("trash");
        }}
        className={cn("gap-2", mine === "trash" && "verdict-picked", mine === "stash" && "verdict-dimmed")}
      >
        <img src={binIcon} alt="" aria-hidden className="verdict-icon" /> {t("vote.trash")}
      </Button>
    </div>
  );

  if (compact) return <div className={className}>{buttons}</div>;

  return (
    <section
      className={cn("rounded-2xl border border-border bg-card p-5", className)}
      aria-label={t("brand.verdictTitle", { brand: brandName })}
    >
      <h2 className="font-display text-xl font-extrabold">
        {t("brand.verdictTitle", { brand: brandName })}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("brand.verdictHint")}</p>

      <div className="mt-4">{buttons}</div>

      <div className="mt-4">
        <div className="flex h-2.5 overflow-hidden rounded-full bg-secondary">
          <div className="bg-stash" style={{ width: `${pct}%` }} />
          <div className="bg-trash" style={{ width: `${100 - pct}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between text-xs font-medium">
          <span className="text-stash">{t("vote.stashCount", { count: data?.stash ?? 0 })}</span>
          <span className="text-muted-foreground">
            {(data?.total ?? 0) === 0 ? t("vote.noVotes") : t("vote.stashPct", { pct })}
          </span>
          <span className="text-trash">{t("vote.trashCount", { count: data?.trash ?? 0 })}</span>
        </div>
      </div>
    </section>
  );
}
