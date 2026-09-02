import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SentimentTaggerProps {
  postId: string;
  currentSentiment?: 'positive' | 'neutral' | 'negative' | 'unknown';
  onTagged?: () => void;
}

export function SentimentTagger({ postId, currentSentiment = 'unknown', onTagged }: SentimentTaggerProps) {
  const [sentiment, setSentiment] = useState<string>(currentSentiment);
  const [category, setCategory] = useState<string>('feedback');
  const [loading, setLoading] = useState(false);

  const handleTag = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/sentiment-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, sentiment, category }),
      });

      if (!response.ok) throw new Error('Failed to tag sentiment');

      toast.success('Post tagged successfully');
      onTagged?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to tag sentiment');
    } finally {
      setLoading(false);
    }
  };

  const sentimentOptions = [
    { value: 'positive', label: 'Positive 👍', icon: TrendingUp, color: 'bg-green-100 text-green-700' },
    { value: 'neutral', label: 'Neutral 😐', icon: Minus, color: 'bg-gray-100 text-gray-700' },
    { value: 'negative', label: 'Negative 👎', icon: TrendingDown, color: 'bg-red-100 text-red-700' },
    { value: 'unknown', label: 'Unknown ❓', icon: Zap, color: 'bg-yellow-100 text-yellow-700' },
  ];

  const categoryOptions = [
    { value: 'feedback', label: 'Feedback' },
    { value: 'support', label: 'Support Request' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'praise', label: 'Praise' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tag Sentiment & Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Sentiment</label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {sentimentOptions.map(({ value, label, icon: Icon, color }) => (
              <button
                key={value}
                onClick={() => setSentiment(value)}
                className={`flex items-center gap-2 rounded border-2 p-2 transition-all ${
                  sentiment === value
                    ? `border-primary ${color}`
                    : 'border-border bg-background hover:border-primary'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={handleTag} disabled={loading}>
          {loading ? 'Tagging...' : 'Tag Post'}
        </Button>
      </CardContent>
    </Card>
  );
}
