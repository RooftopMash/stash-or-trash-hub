import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, TrendingUp, MessageSquare, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/dashboard/brands/:brandId')({ 
  component: BrandDashboardPage,
});

function BrandDashboardPage() {
  const { user } = useAuth();
  const brandId = Route.useParams().brandId;
  const [activeTab, setActiveTab] = useState('overview');
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('analyst');

  // Fetch brand data
  const { data: brand, isLoading: brandLoading } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', brandId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Fetch team data
  const { data: team, isLoading: teamLoading, refetch: refetchTeam } = useQuery({
    queryKey: ['brand-team', brandId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_teams')
        .select(`
          *,
          team_members(
            *,
            users:user_id(id, email, display_name, avatar)
          )
        `)
        .eq('brand_id', brandId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Fetch pending responses
  const { data: pendingResponses, isLoading: responsesLoading } = useQuery({
    queryKey: ['pending-responses', brandId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('responses')
        .select(`
          *,
          posts:post_id(
            id, content, author_id, created_at,
            users:author_id(display_name, avatar)
          )
        `)
        .eq('team_id', team?.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!team?.id,
  });

  // Fetch daily analytics
  const { data: analytics } = useQuery({
    queryKey: ['analytics', brandId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('brand_id', brandId)
        .order('date', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data || [];
    },
  });

  const handleAddTeamMember = async () => {
    if (!newMemberEmail) {
      toast.error('Email required');
      return;
    }

    try {
      // Find user by email
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', newMemberEmail)
        .single();

      if (!userData) {
        toast.error('User not found');
        return;
      }

      // Add to team
      const { error } = await supabase.from('team_members').insert([
        {
          team_id: team?.id,
          user_id: userData.id,
          role: newMemberRole,
        },
      ]);

      if (error) throw error;

      toast.success('Team member added');
      setNewMemberEmail('');
      setAddMemberOpen(false);
      refetchTeam();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add member');
    }
  };

  if (brandLoading || teamLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!brand) {
    return <div className="p-8 text-center">Brand not found</div>;
  }

  const sentimentData = [
    { name: 'Positive', value: 45, fill: '#22c55e' },
    { name: 'Neutral', value: 30, fill: '#94a3b8' },
    { name: 'Negative', value: 25, fill: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            {brand.logo && <img src={brand.logo} alt={brand.name} className="h-12 w-12 rounded" />}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{brand.name}</h1>
              <p className="text-sm text-muted-foreground">{brand.category || 'Brand'}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Sentiment Score</div>
              <div className={`text-2xl font-bold ${
                brand.sentiment_score > 0 ? 'text-green-500' : brand.sentiment_score < 0 ? 'text-red-500' : 'text-gray-500'
              }`}>
                {brand.sentiment_score > 0 ? '+' : ''}{brand.sentiment_score}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="responses">
              Responses
              {pendingResponses && pendingResponses.length > 0 && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {pendingResponses.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{brand.total_posts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{brand.total_engagement}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${
                    brand.overall_sentiment === 'positive' ? 'text-green-500' : 
                    brand.overall_sentiment === 'negative' ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {brand.overall_sentiment}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Team Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{team?.team_members?.length || 0}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crisis Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analytics && analytics.length > 0 && analytics[0].crisis_detected ? (
                    <Alert className="border-red-500 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <div className="ml-4">
                        <div className="font-semibold text-red-900">Crisis Detected</div>
                        <div className="text-sm text-red-800">Crisis Level: {analytics[0].crisis_level}/100</div>
                      </div>
                    </Alert>
                  ) : (
                    <div className="text-sm text-muted-foreground">No active crises</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Responses Tab */}
          <TabsContent value="responses" className="space-y-4">
            {responsesLoading ? (
              <div className="text-center">Loading responses...</div>
            ) : pendingResponses && pendingResponses.length > 0 ? (
              <div className="space-y-4">
                {pendingResponses.map((response: any) => (
                  <Card key={response.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {response.posts?.users?.avatar && (
                              <img src={response.posts.users.avatar} alt="Author" className="h-8 w-8 rounded-full" />
                            )}
                            <div>
                              <div className="font-semibold">{response.posts?.users?.display_name}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(response.posts?.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">{response.posts?.content}</div>
                        </div>
                        <div className="text-xs font-medium text-orange-600">PENDING RESPONSE</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" onClick={() => {
                        // Open response composer
                      }}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Respond
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <div className="text-sm text-muted-foreground">All responses up to date</div>
              </div>
            )}
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <AlertDialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                <AlertDialogTrigger asChild>
                  <Button>Add Member</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Add Team Member</AlertDialogTitle>
                    <AlertDialogDescription>Invite a user to join this brand team</AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="user@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="analyst">Analyst</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full" onClick={handleAddTeamMember}>
                      Add Member
                    </Button>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {team?.team_members && team.team_members.length > 0 ? (
              <div className="space-y-2">
                {team.team_members.map((member: any) => (
                  <Card key={member.id}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        {member.users?.avatar && <img src={member.users.avatar} alt="Member" className="h-8 w-8 rounded-full" />}
                        <div>
                          <div className="font-semibold">{member.users?.display_name}</div>
                          <div className="text-xs text-muted-foreground">{member.users?.email}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium capitalize text-primary">{member.role}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <div className="text-sm text-muted-foreground">No team members yet</div>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Posts Over Time (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_posts" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
