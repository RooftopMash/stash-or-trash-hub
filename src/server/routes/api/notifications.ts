import { defineEventHandler, createError, getCookie } from 'h3';
import { supabase } from '@/integrations/supabase/client';

/**
 * GET /api/notifications/user
 * Get all notifications for authenticated user
 */
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const query = getQuery(event);
  const limit = query.limit ? parseInt(query.limit as string) : 50;
  const unreadOnly = query.unread === 'true';

  try {
    let q = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      q = q.eq('read', false);
    }

    const { data, error } = await q;

    if (error) throw error;

    return { notifications: data || [], count: data?.length || 0 };
  } catch (error) {
    console.error('Fetch notifications error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch notifications',
    });
  }
});

/**
 * POST /api/notifications/:id/read
 * Mark notification as read
 */
export const markNotificationRead = defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const notificationId = getRouterParam(event, 'id');

  if (!notificationId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Notification ID required',
    });
  }

  try {
    // Verify ownership
    const { data: notification } = await supabase
      .from('notifications')
      .select('user_id')
      .eq('id', notificationId)
      .single();

    if (!notification || notification.user_id !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Not authorized',
      });
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Mark read error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to mark notification as read',
    });
  }
});

/**
 * POST /api/notifications/crisis-alert
 * Create crisis alert (internal, run on analytics cron)
 */
export const createCrisisAlert = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { brandId, crisisLevel, teamId } = body;

  if (!brandId || crisisLevel === undefined || !teamId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Brand ID, crisis level, and team ID required',
    });
  }

  try {
    // Get all team members
    const { data: members } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', teamId);

    if (!members) return { success: true };

    // Create notification for each member
    const notifications = members.map((member: any) => ({
      user_id: member.user_id,
      type: 'crisis',
      title: '🚨 Crisis Alert',
      message: `Crisis detected (Level ${crisisLevel}/100). Immediate action required.`,
      action_url: `/dashboard/brands/${brandId}`,
    }));

    const { error } = await supabase.from('notifications').insert(notifications);

    if (error) throw error;

    return { success: true, notificationsCreated: notifications.length };
  } catch (error) {
    console.error('Crisis alert error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create crisis alert',
    });
  }
});

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

function getQuery(event: any) {
  return event.node?.req?.url ? new URL(event.node.req.url, 'http://localhost').searchParams : new Map();
}

function getRouterParam(event: any, param: string) {
  return event.context?.params?.[param];
}

const { readBody } = require('h3');
