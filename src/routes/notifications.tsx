import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/notifications')({ 
  component: NotificationsPage,
});

function NotificationsPage() {
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data: notifications, isLoading, refetch } = useQuery({
    queryKey: ['notifications', unreadOnly],
    queryFn: async () => {
      const response = await fetch(`/api/notifications?unread=${unreadOnly}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const { notifications } = await response.json();
      return notifications;
    },
    refetchInterval: 30000, // Poll every 30s
  });

  const handleMarkRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to mark as read');
      refetch();
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'crisis':
        return '🚨';
      case 'response_needed':
        return '💬';
      case 'trending':
        return '📈';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'crisis':
        return 'bg-red-50 border-red-200';
      case 'response_needed':
        return 'bg-yellow-50 border-yellow-200';
      case 'trending':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card p-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-sm text-muted-foreground">Stay updated on crises, responses, and trends</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6 flex gap-2">
          <Button
            variant={unreadOnly ? 'default' : 'outline'}
            onClick={() => setUnreadOnly(true)}
          >
            Unread Only
          </Button>
          <Button
            variant={!unreadOnly ? 'default' : 'outline'}
            onClick={() => setUnreadOnly(false)}
          >
            All Notifications
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading notifications...</div>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification: any) => (
              <Card key={notification.id} className={`border-l-4 ${getNotificationColor(notification.type)}`}>
                <CardContent className="flex items-start justify-between py-4">
                  <div className="flex gap-4">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{notification.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{notification.message}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {notification.action_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={notification.action_url}>View</a>
                      </Button>
                    )}
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkRead(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No notifications yet
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
