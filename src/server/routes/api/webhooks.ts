import { defineEventHandler, readBody, createError, getCookie } from 'h3';
import { supabase } from '@/integrations/supabase/client';
import crypto from 'crypto';

/**
 * POST /api/webhooks/register
 * Register a webhook endpoint
 */
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const { url, events, teamId } = await readBody(event);

  if (!url || !events || !teamId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL, events, and team ID required',
    });
  }

  try {
    // Verify user is in team
    const { data: member } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (!member) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Not authorized',
      });
    }

    // Store webhook (in production, use a webhooks table)
    const webhookSecret = crypto.randomBytes(32).toString('hex');

    return {
      success: true,
      webhook: {
        id: crypto.randomUUID(),
        url,
        events,
        teamId,
        secret: webhookSecret,
        active: true,
        createdAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Webhook register error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to register webhook',
    });
  }
});

/**
 * POST /api/webhooks/trigger
 * Trigger webhook (internal use)
 */
export const triggerWebhook = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { webhookUrl, event: webhookEvent, payload, secret } = body;

  if (!webhookUrl || !webhookEvent) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Webhook URL and event required',
    });
  }

  try {
    // Sign payload
    const timestamp = Date.now().toString();
    const signature = crypto
      .createHmac('sha256', secret || 'webhook-secret')
      .update(`${timestamp}.${JSON.stringify(payload)}`)
      .digest('hex');

    // Send webhook
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SOT-Event': webhookEvent,
        'X-SOT-Timestamp': timestamp,
        'X-SOT-Signature': signature,
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      // Don't fail if webhook delivery fails
      console.error('Webhook delivery error:', err);
    });

    return { success: true };
  } catch (error) {
    console.error('Trigger webhook error:', error);
    // Don't fail webhook, log for retry
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

/**
 * Slack integration helper
 */
export const sendSlackNotification = async (slackWebhookUrl: string, message: any) => {
  try {
    await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error('Slack notification error:', error);
  }
};

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
