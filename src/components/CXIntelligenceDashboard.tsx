import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Table, TableBody, TableCell, TableHead, TableRow } from 'recharts';
import { Download, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

interface CXIntelligenceDashboardProps {
  brandId: string;
}

export function CXIntelligenceDashboard({ brandId }: CXIntelligenceDashboardProps) {
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch 90-day analytics trend
  const { data: analytics } = useQuery({
    queryKey: ['analytics-trend', brandId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('brand_id', brandId)
        .order('date', { ascending: true })
        .limit(90);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch influencers
  const { data: influencers } = useQuery({
    queryKey: ['influencers', brandId],
    queryFn: async () => {
      const { data: posts } = await supabase
        .from('posts')
        .select(`
          author_id,
          users:author_id(id, display_name, avatar, email),
          social_profiles:author_id(followers, verified, platform)
        `)
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })
        .limit(100);

      // Group by author and calculate scores
      const influencerMap = new Map();
      posts?.forEach((post: any) => {
        const author = post.author_id;
        if (!influencerMap.has(author)) {
          const profiles = post.social_profiles || [];
          const maxFollowers = Math.max(...profiles.map((p: any) => p.followers || 0), 0);
          const isVerified = profiles.some((p: any) => p.verified);
          const influenceScore = Math.min((maxFollowers / 10000) * 100 + (isVerified ? 20 : 0), 100);
          influencerMap.set(author, {
            ...post.users,
            followers: maxFollowers,
            verified: isVerified,
            influenceScore: influenceScore.toFixed(1),
            postCount: 0,
            platforms: profiles.map((p: any) => p.platform),
          });
        }
        influencerMap.get(author).postCount++;
      });

      return Array.from(influencerMap.values())
        .sort((a: any, b: any) => parseFloat(b.influenceScore) - parseFloat(a.influenceScore))
        .slice(0, 10);
    },
  });

  // Fetch crisis history
  const { data: crisisHistory } = useQuery({
    queryKey: ['crisis-history', brandId],
    queryFn: async () => {
      const { data } = await supabase
        .from('analytics')
        .select('*')
        .eq('brand_id', brandId)
        .eq('crisis_detected', true)
        .order('date', { ascending: false })
        .limit(30);
      return data || [];
    },
  });

  // Calculate trend metrics
  const calculateTrend = (data: any[]) => {
    if (!data || data.length < 2) return { trend: 0, direction: 'neutral' };
    const recent = data.slice(-7);
    const older = data.slice(-14, -7);
    const recentAvg = recent.reduce((sum, d) => sum + (d.average_sentiment_score || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + (d.average_sentiment_score || 0), 0) / older.length;
    const trend = recentAvg - olderAvg;
    return {
      trend: trend.toFixed(1),
      direction: trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral',
    };
  };

  const handleExportReport = async () => {
    setExportLoading(true);
    try {
      // Generate CSV
      const analyticsData = analytics || [];
      const headers = ['Date', 'Posts', 'Positive', 'Neutral', 'Negative', 'Sentiment Score', 'Crisis Level'];
      const rows = analyticsData.map((row: any) => {
        const sentiment = JSON.parse(row.total_sentiment || '{}');
        return [
          new Date(row.date).toLocaleDateString(),
          row.total_posts,
          sentiment.positive || 0,
          sentiment.neutral || 0,
          sentiment.negative || 0,
          row.average_sentiment_score?.toFixed(2) || 'N/A',
          row.crisis_level || 0,
        ];
      });

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map((cell: any) => `"${cell}"`).join(',')),
      ].join('\n');

      // Download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `brand-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();

      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setExportLoading(false);
    }
  };

  const trend = calculateTrend(analytics);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sentiment Trend (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className={`text-3xl font-bold ${
                trend.direction === 'up' ? 'text-green-500' : trend.direction === 'down' ? 'text-red-500' : 'text-gray-500'
              }`}>
                {trend.trend}%
              </div>
              <div className="mb-1 text-sm font-medium text-muted-foreground capitalize">
                {trend.direction}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Crisis Events (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{crisisHistory?.length || 0}</div>
            {crisisHistory && crisisHistory.length > 0 && (
              <div className="text-xs text-muted-foreground mt-2">
                Last: {new Date(crisisHistory[0].date).toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Influencers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{influencers?.length || 0}</div>
            <div className="text-xs text-muted-foreground mt-2">Tracked users</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Action</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportReport}
              disabled={exportLoading}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Sentiment Trends</TabsTrigger>
          <TabsTrigger value="influencers">Influencers</TabsTrigger>
          <TabsTrigger value="crises">Crisis History</TabsTrigger>
        </TabsList>

        {/* Sentiment Trends */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Score Over Time (90 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics && analytics.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[-100, 100]} />
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="average_sentiment_score"
                      stroke="#3b82f6"
                      name="Sentiment Score"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground py-8">No data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Influencers */}
        <TabsContent value="influencers">
          <Card>
            <CardHeader>
              <CardTitle>Top Influencers</CardTitle>
            </CardHeader>
            <CardContent>
              {influencers && influencers.length > 0 ? (
                <div className="space-y-3">
                  {influencers.map((influencer: any) => (
                    <div key={influencer.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="flex items-center gap-3">
                        {influencer.avatar && <img src={influencer.avatar} alt="" className="h-8 w-8 rounded-full" />}
                        <div>
                          <div className="font-semibold text-sm">{influencer.display_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {influencer.followers.toLocaleString()} followers {influencer.verified && '✓'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{influencer.influenceScore}</div>
                        <div className="text-xs text-muted-foreground">{influencer.postCount} posts</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">No influencer data</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crisis History */}
        <TabsContent value="crises">
          <Card>
            <CardHeader>
              <CardTitle>Crisis Detection Events</CardTitle>
            </CardHeader>
            <CardContent>
              {crisisHistory && crisisHistory.length > 0 ? (
                <div className="space-y-2">
                  {crisisHistory.map((crisis: any) => (
                    <div key={crisis.id} className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <div>
                          <div className="font-semibold text-sm">Crisis Detected</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(crisis.date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">{crisis.crisis_level}/100</div>
                        <div className="text-xs text-muted-foreground">Level</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">No crisis events detected</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
