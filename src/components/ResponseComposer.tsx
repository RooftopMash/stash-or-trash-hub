import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ResponseComposerProps {
  postId: string;
  teamId: string;
  onResponseSent?: () => void;
}

export function ResponseComposer({ postId, teamId, onResponseSent }: ResponseComposerProps) {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSend = async () => {
    if (!content.trim()) {
      toast.error('Response cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, teamId, content }),
      });

      if (!response.ok) throw new Error('Failed to send response');

      toast.success('Response sent successfully');
      setContent('');
      onResponseSent?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Brand Response</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Compose your response to this customer..."
            className="min-h-[120px]"
          />
          <div className="text-xs text-muted-foreground">
            {content.length} characters
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Initial Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showPreview && (
          <div className="rounded border border-border bg-muted p-3">
            <div className="text-xs font-medium text-muted-foreground mb-2">Preview</div>
            <p className="text-sm">{content}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex-1"
          >
            {showPreview ? 'Hide' : 'Preview'}
          </Button>
          <Button
            onClick={handleSend}
            disabled={loading || !content.trim()}
            className="flex-1"
          >
            {loading ? 'Sending...' : 'Send Response'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
