import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { fetchAllUserBrands } from "@/lib/brand-platform";
import {
  fetchAnalyticsData,
  fetchInfluencerRankings,
  exportAnalyticsCSV,
  type TimeWindow,
} from "@/lib/brand-analytics";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  BarChart3,
  Download,
  Users,
  TrendingUp,
  Shield,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/analytics")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
  },
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selectedBrandId, setSelectedBrandId] = useState<string>("all");
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(30);

  // Fetch user's brands
  const { data: userBrands, isLoading: brandsLoading } = useQuery({
    queryKey: ["user-brands", user?.id],
    queryFn: () => (user ? fetchAllUserBrands(user.id) : []),
    enabled: !!user,
  });

  const activeBrandIds =
    selectedBrandId === "all"
      ? (userBrands ?? []).map((b) => b.id)
      : [selectedBrandId];

  // Fetch trend analytics
  const { data: trendData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["brand-analytics", activeBrandIds, timeWindow],
    queryFn: () => fetchAnalyticsData(activeBrandIds, timeWindow),
    enabled: activeBrandIds.length > 0,
  });

  // Fetch influencer rankings
  const { data: influencers, isLoading: influencersLoading } = useQuery({
    queryKey: ["influencer-rankings", activeBrandIds],
    queryFn: () => fetchInfluencerRankings(activeBrandIds),
    enabled: activeBrandIds.length > 0,
  });

  // Evaluate crisis manual trigger
  const evaluateCrisisMutation = useMutation({
    mutationFn: async () => {
      if (activeBrandIds.length === 0) return;
      for (const bid of activeBrandIds) {
        await supabase.rpc("evaluate_crisis_alert" as any, { _brand_id: bid });
      }
    },
    onSuccess: () => {
      toast.success("Crisis evaluation complete.");
    },
  });

  const handleExportCSV = () => {
    if (!trendData || trendData.length === 0) {
      toast.error("No analytics data available to export.");
      return;
    }
    const brandLabel =
      selectedBrandId === "all"
        ? "all-brands"
        : (userBrands ?? []).find((b) => b.id === selectedBrandId)?.slug || "brand";
    exportAnalyticsCSV(trendData, `sot-cx-analytics-${brandLabel}-${timeWindow}d.csv`);
    toast.success("Analytics CSV exported!");
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 font-display text-3xl font-extrabold">
                <BarChart3 className="h-7 w-7 text-primary" /> Enterprise CX Intelligence
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                90-day trend analytics, sentiment mix, Stash % tracking & influencer rankings
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Brand filter */}
              <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                <SelectTrigger className="w-[180px] text-xs h-9">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workspace Brands</SelectItem>
                  {(userBrands ?? []).map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Time window toggles */}
              <div className="flex rounded-lg border border-border bg-card p-1">
                {([7, 30, 90] as TimeWindow[]).map((w) => (
                  <Button
                    key={w}
                    size="sm"
                    variant={timeWindow === w ? "default" : "ghost"}
                    onClick={() => setTimeWindow(w)}
                    className="h-7 px-2.5 text-xs font-semibold"
                  >
                    {w}d
                  </Button>
                ))}
              </div>

              {/* CSV Export */}
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportCSV}
                className="gap-1.5 h-9 text-xs"
              >
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Post Volume Chart */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg">Post Volume Trend</h3>
                <p className="text-xs text-muted-foreground">
                  Daily feedback and post submissions over {timeWindow} days
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {timeWindow} Days
              </Badge>
            </div>

            {analyticsLoading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData ?? []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Posts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Stash % Trend Chart */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg">Stash % Satisfaction Index</h3>
                <p className="text-xs text-muted-foreground">
                  Percentage of Stash vs Trash verdicts over time
                </p>
              </div>
              <Badge variant="outline" className="border-stash text-stash text-xs">
                Stash Meter
              </Badge>
            </div>

            {analyticsLoading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData ?? []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#888888" fontSize={11} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="stashPct"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      name="Stash %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Sentiment Mix Stacked Area Chart */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg">Sentiment Distribution Breakdown</h3>
                <p className="text-xs text-muted-foreground">
                  Positive vs Neutral vs Negative post distribution
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => evaluateCrisisMutation.mutate()}
                disabled={evaluateCrisisMutation.isPending}
                className="gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <AlertTriangle className="h-3.5 w-3.5" /> Run Crisis Check
              </Button>
            </div>

            {analyticsLoading ? (
              <Skeleton className="h-72 w-full rounded-xl" />
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData ?? []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Area
                      type="monotone"
                      dataKey="positive"
                      stackId="1"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.6}
                      name="Positive"
                    />
                    <Area
                      type="monotone"
                      dataKey="neutral"
                      stackId="1"
                      stroke="#9ca3af"
                      fill="#9ca3af"
                      fillOpacity={0.6}
                      name="Neutral"
                    />
                    <Area
                      type="monotone"
                      dataKey="negative"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="Negative"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Influencer Ranking Section */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold">
                <Users className="h-5 w-5 text-primary" /> Key Brand Influencers & Advocates
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Ranked by user trust score, follower network, and total engagement generated
              </p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3 text-primary" /> Top Advocates
            </Badge>
          </div>

          {influencersLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : (influencers ?? []).length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
              No brand advocates or influencers found for the selected view.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 font-semibold">Rank</th>
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold">Trust Score</th>
                    <th className="pb-3 font-semibold">Followers</th>
                    <th className="pb-3 font-semibold">Posts</th>
                    <th className="pb-3 font-semibold">Stash Received</th>
                    <th className="pb-3 font-semibold text-right">Engagement Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {(influencers ?? []).map((inf, idx) => (
                    <tr key={inf.userId} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-3 font-bold text-muted-foreground">#{idx + 1}</td>
                      <td className="py-3 font-bold text-foreground">
                        <Link
                          to="/users/$id"
                          params={{ id: inf.userId }}
                          className="hover:underline text-primary"
                        >
                          {inf.displayName}
                        </Link>
                      </td>
                      <td className="py-3 font-semibold text-stash">
                        <Shield className="inline h-3.5 w-3.5 mr-1" />
                        {inf.trustScore}
                      </td>
                      <td className="py-3 text-foreground">{inf.followerCount}</td>
                      <td className="py-3 text-foreground">{inf.postsCount}</td>
                      <td className="py-3 text-stash font-bold">{inf.totalStash}</td>
                      <td className="py-3 text-right font-display font-extrabold text-primary text-sm">
                        {inf.engagementScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
