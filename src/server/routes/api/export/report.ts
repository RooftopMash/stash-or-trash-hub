import { defineEventHandler, readBody, createError } from 'h3';
import { supabase } from '@/integrations/supabase/client';

/**
 * POST /api/export/report
 * Generate and return a report (JSON, CSV, or PDF)
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { brandId, format = 'json', startDate, endDate } = body;

  if (!brandId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Brand ID required',
    });
  }

  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  try {
    // Fetch all analytics for period
    const { data: analytics } = await supabase
      .from('analytics')
      .select('*')
      .eq('brand_id', brandId)
      .gte('date', start.toISOString())
      .lte('date', end.toISOString())
      .order('date', { ascending: true });

    // Fetch brand info
    const { data: brand } = await supabase
      .from('brands')
      .select('*')
      .eq('id', brandId)
      .single();

    // Fetch crisis events
    const { data: crises } = await supabase
      .from('analytics')
      .select('*')
      .eq('brand_id', brandId)
      .eq('crisis_detected', true)
      .gte('date', start.toISOString())
      .lte('date', end.toISOString());

    // Calculate summary stats
    const totalPosts = analytics?.reduce((sum, a) => sum + (a.total_posts || 0), 0) || 0;
    const avgSentimentScore = analytics && analytics.length > 0
      ? (analytics.reduce((sum, a) => sum + (a.average_sentiment_score || 0), 0) / analytics.length).toFixed(2)
      : 0;
    const maxCrisisLevel = Math.max(...(crises?.map(c => c.crisis_level) || [0]));

    const reportData = {
      brand: brand ? { name: brand.name, slug: brand.slug, category: brand.category } : null,
      period: { start: start.toISOString(), end: end.toISOString() },
      summary: {
        totalPosts,
        averageSentimentScore: avgSentimentScore,
        crisisEventsCount: crises?.length || 0,
        maxCrisisLevel,
      },
      analytics: analytics || [],
      crises: crises || [],
      generatedAt: new Date().toISOString(),
    };

    if (format === 'csv') {
      return generateCSV(reportData);
    }

    return reportData;
  } catch (error) {
    console.error('Export error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate report',
    });
  }
});

function generateCSV(data: any) {
  const headers = [
    'Date',
    'Total Posts',
    'Positive',
    'Neutral',
    'Negative',
    'Unknown',
    'Avg Sentiment Score',
    'Crisis Detected',
    'Crisis Level',
  ];

  const rows = data.analytics.map((a: any) => {
    const sentiment = JSON.parse(a.total_sentiment || '{}');
    return [
      new Date(a.date).toLocaleDateString(),
      a.total_posts || 0,
      sentiment.positive || 0,
      sentiment.neutral || 0,
      sentiment.negative || 0,
      sentiment.unknown || 0,
      (a.average_sentiment_score || 0).toFixed(2),
      a.crisis_detected ? 'Yes' : 'No',
      a.crisis_level || 0,
    ];
  });

  const csv = [
    `Brand Report: ${data.brand?.name}`,
    `Period: ${new Date(data.period.start).toLocaleDateString()} - ${new Date(data.period.end).toLocaleDateString()}`,
    `Generated: ${new Date(data.generatedAt).toLocaleString()}`,
    '',
    'SUMMARY',
    `Total Posts,${data.summary.totalPosts}`,
    `Avg Sentiment,${data.summary.averageSentimentScore}%`,
    `Crisis Events,${data.summary.crisisEventsCount}`,
    `Max Crisis Level,${data.summary.maxCrisisLevel}/100`,
    '',
    headers.join(','),
    ...rows.map(row => row.map((cell: any) => `"${cell}"`).join(',')),
  ].join('\n');

  return csv;
}
