import { defineEventHandler, readBody, createError, getRouterParam, getCookie } from 'h3';
import { supabase } from '@/integrations/supabase/client';

/**
 * POST /api/analytics/sentiment-tag
 * Tag a post with sentiment
 */
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const { postId, sentiment, category } = await readBody(event);

  if (!postId || !['positive', 'neutral', 'negative', 'unknown'].includes(sentiment)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID and valid sentiment required',
    });
  }

  try {
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('brand_id')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found',
      });
    }

    // Update post sentiment
    const { error } = await supabase
      .from('posts')
      .update({
        sentiment,
        category: category || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId);

    if (error) throw error;

    // Recalculate brand sentiment
    await recalculateBrandSentiment(post.brand_id);
    await auditLog(user.id, null, 'POST_TAGGED', 'posts', postId, `sentiment:${sentiment}`);

    return { success: true };
  } catch (error) {
    console.error('Sentiment tag error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to tag sentiment',
    });
  }
});

/**
 * GET /api/analytics/brand/:brandId
 * Get brand analytics dashboard data
 */
export const getBrandAnalytics = defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const brandId = getRouterParam(event, 'brandId');

  try {
    const { data: analytics, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('brand_id', brandId)
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw error;

    return { analytics };
  } catch (error) {
    console.error('Fetch analytics error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch analytics',
    });
  }
});

/**
 * POST /api/analytics/snapshot
 * Generate daily analytics snapshot (run via cron)
 */
export const generateAnalyticsSnapshot = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { brandId } = body;

  if (!brandId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Brand ID required',
    });
  }

  try {
    // Get all posts for brand from last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('brand_id', brandId)
      .gte('created_at', yesterday.toISOString());

    // Calculate sentiment distribution
    const sentimentCounts = {
      positive: 0,
      neutral: 0,
      negative: 0,
      unknown: 0,
    };

    let totalSentimentScore = 0;
    posts?.forEach((post: any) => {
      sentimentCounts[post.sentiment as keyof typeof sentimentCounts]++;
      if (post.sentiment === 'positive') totalSentimentScore += 1;
      else if (post.sentiment === 'negative') totalSentimentScore -= 1;
    });

    const avgSentimentScore = posts && posts.length > 0 ? (totalSentimentScore / posts.length) * 100 : 0;

    // Detect crisis (more than 30% negative in 24h)
    const negativePercentage = posts && posts.length > 0 ? (sentimentCounts.negative / posts.length) * 100 : 0;
    const crisisDetected = negativePercentage > 30;
    const crisisLevel = Math.min(Math.round(negativePercentage * 3.3), 100);

    // Get top influencers
    const { data: topInfluencers } = await supabase
      .from('posts')
      .select(`
        author_id,
        users:author_id(id, display_name, avatar),
        social_profiles(followers, verified)
      `)
      .eq('brand_id', brandId)
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Get top hashtags
    const { data: topHashtags } = await supabase
      .from('hashtags')
      .select('*')
      .eq('brand_id', brandId)
      .order('post_count', { ascending: false })
      .limit(5);

    // Insert snapshot
    const { error } = await supabase.from('analytics').insert([
      {
        brand_id: brandId,
        date: new Date().toISOString(),
        total_posts: posts?.length || 0,
        total_sentiment: JSON.stringify(sentimentCounts),
        average_sentiment_score: avgSentimentScore,
        top_influencers: JSON.stringify(topInfluencers || []),
        top_hashtags: JSON.stringify(topHashtags || []),
        crisis_detected: crisisDetected,
        crisis_level: crisisLevel,
      },
    ]);

    if (error) throw error;

    return { success: true, snapshot: { sentimentCounts, crisisDetected, crisisLevel } };
  } catch (error) {
    console.error('Analytics snapshot error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate snapshot',
    });
  }
});

async function recalculateBrandSentiment(brandId: string) {
  try {
    const { data: posts } = await supabase
      .from('posts')
      .select('sentiment')
      .eq('brand_id', brandId)
      .eq('status', 'published');

    if (!posts || posts.length === 0) return;

    const sentiments = posts.reduce((acc: any, post: any) => {
      acc[post.sentiment] = (acc[post.sentiment] || 0) + 1;
      return acc;
    }, {});

    let overallSentiment = 'unknown';
    if (sentiments.positive > sentiments.negative) overallSentiment = 'positive';
    else if (sentiments.negative > sentiments.positive) overallSentiment = 'negative';
    else if (sentiments.positive > 0 || sentiments.negative > 0) overallSentiment = 'neutral';

    const sentimentScore = (
      ((sentiments.positive || 0) - (sentiments.negative || 0)) /
      posts.length
    ) * 100;

    await supabase
      .from('brands')
      .update({
        overall_sentiment: overallSentiment,
        sentiment_score: sentimentScore.toFixed(2),
      })
      .eq('id', brandId);
  } catch (error) {
    console.error('Recalculate sentiment error:', error);
  }
}

async function auditLog(userId: string, teamId: string | null, action: string, resourceType: string, resourceId: string, details?: string) {
  try {
    await supabase.from('audit_logs').insert([
      {
        user_id: userId,
        team_id: teamId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: details || null,
      },
    ]);
  } catch (error) {
    console.error('Audit log error:', error);
  }
}

async function requireAuth(event: any) {
  const token = getCookie(event, 'sb-access-token');
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }
  return { id: 'user-from-token' };
}
