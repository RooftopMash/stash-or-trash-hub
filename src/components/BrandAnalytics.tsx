import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchBrandTrend,
  fetchBrandTopVoices,
  fetchOpenCrisisAlert,
  resolveCrisisAlert,
  trendToCsv,
} from "@/lib/brand-platform";
import { toast } from "sonner";

const WINDOWS = [7, 30, 90] as const;

/** Phase B — trends, crisis alert banner, top voices and CSV export for one brand. */
export function BrandAnalytics({ brandId, brandName }: { brandId: string; brandName: string }) {
  const { t } = useTranslation();
  const [days, setDays] = useState<(typeof WINDOWS)[number]>(30);

  const { data: trend } = useQuery({
    queryKey: ["brand-trend", brandId, days],
    queryFn: () => fetchBrandTrend(brandId, days),
  });

  const { data: voices } = useQuery({
    queryKey: ["brand-voices", brandId, days],
    queryFn: () => fetchBrandTopVoices(brandId, days),
  });

  const { data: alert, refetch: refetchAlert } = useQuery({
    queryKey: ["brand-crisis", brandId],
    queryFn: () => fetchOpenCrisisAlert(brandId),
  });

  const rows = useMemo(
    () => (trend ?? []).map((r) => ({ ...r, label: r.day.slice(5) })),
    [trend],
  );

  const exportCsv = () => {
    const csv = trendToCsv(trend ?? []);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `sot-${brandName.toLowerCase().replace(/\s+/g, "-")}-${days}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const dismiss = async () => {
    if (!alert) return;
    try {
      await resolveCrisisAlert(alert.id);
      await refetchAlert();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("analytics.crisisDismissFailed"));
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-border p-3">
      {alert && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-trash/40 bg-trash/10 p-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-trash" />
          <p className="flex-1 text-sm">
            <span className="font-semibold">{t("analytics.crisisTitle")}</span>{" "}
            {t("analytics.crisisBody", {
              share: Math.round(Number(alert.negative_share)),
              baseline: Math.round(Number(alert.baseline_share)),
            })}
          </p>
          <Button size="sm" variant="outline" onClick={dismiss}>
            {t("analytics.crisisDismiss")}
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("analytics.title")}
        </p>
        <div className="flex items-center gap-1">
          {WINDOWS.map((w) => (
            <Button
              key={w}
              size="sm"
              variant={days === w ? "default" : "ghost"}
              className="h-7 px-2 text-xs"
              onClick={() => setDays(w)}
            >
              {t("analytics.days", { count: w })}
            </Button>
          ))}
          <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" onClick={exportCsv}>
            <Download className="h-3.5 w-3.5" /> {t("analytics.export")}
          </Button>
        </div>
      </div>

      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-xs text-muted-foreground">{t("analytics.stashPctOverTime")}</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows}>
                <CartesianGrid strokeOpacity={0.15} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} width={28} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="stash_pct"
                  name={t("analytics.stashPct")}
                  stroke="var(--stash)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs text-muted-foreground">{t("analytics.volumeSentiment")}</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rows}>
                <CartesianGrid strokeOpacity={0.15} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10 }} width={28} allowDecimals={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="positive"
                  name={t("brandTeam.positive")}
                  stackId="1"
                  stroke="var(--stash)"
                  fill="var(--stash)"
                  fillOpacity={0.35}
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  name={t("brandTeam.neutral")}
                  stackId="1"
                  stroke="var(--muted-foreground)"
                  fill="var(--muted-foreground)"
                  fillOpacity={0.25}
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  name={t("brandTeam.negative")}
                  stackId="1"
                  stroke="var(--trash)"
                  fill="var(--trash)"
                  fillOpacity={0.35}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("analytics.topVoices")}
        </p>
        {(voices ?? []).length === 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">{t("analytics.noVoices")}</p>
        ) : (
          <ul className="mt-2 divide-y divide-border">
            {(voices ?? []).map((v) => (
              <li key={v.user_id} className="flex items-center gap-3 py-2 text-sm">
                <Link
                  to="/users/$id"
                  params={{ id: v.user_id }}
                  className="flex-1 truncate font-medium hover:underline"
                >
                  {v.display_name ?? t("analytics.someone")}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {t("analytics.voiceStats", {
                    posts: v.posts,
                    engagement: v.engagement,
                    followers: v.followers,
                  })}
                </span>
                <span className="text-xs font-semibold text-stash">{v.trust_score ?? 0}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
