import { defineEventHandler, readBody, createError, getRouterParam, getCookie } from 'h3';
import { supabase } from '@/integrations/supabase/client';

/**
 * POST /api/responses
 * Brand team responds to a post
 */
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const { postId, teamId, content } = await readBody(event);

  if (!postId || !teamId || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID, team ID, and content required',
    });
  }

  try {
    const { data: member } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (!member) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Not authorized to respond from this team',
      });
    }

    const { data, error } = await supabase
      .from('responses')
      .insert([
        {
          post_id: postId,
          team_id: teamId,
          respondent_id: user.id,
          content,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const { data: post } = await supabase.from('posts').select('author_id').eq('id', postId).single();
    if (post) {
      await supabase.from('notifications').insert([
        {
          user_id: post.author_id,
          type: 'response_needed',
          title: 'Brand responded to your post',
          message: content.substring(0, 100),
          action_url: `/posts/${postId}`,
        },
      ]);
    }

    await auditLog(user.id, teamId, 'RESPONSE_CREATED', 'responses', data.id);

    return { success: true, response: data };
  } catch (error) {
    console.error('Create response error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create response',
    });
  }
});

/**
 * PATCH /api/responses/:id/status
 * Update response status
 */
export const updateResponseStatus = defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const responseId = getRouterParam(event, 'id');
  const { status } = await readBody(event);

  if (!['pending', 'responded', 'resolved', 'escalated'].includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid status required',
    });
  }

  try {
    const { data: response } = await supabase
      .from('responses')
      .select('team_id')
      .eq('id', responseId)
      .single();

    if (!response) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Response not found',
      });
    }

    const { data: member } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', response.team_id)
      .eq('user_id', user.id)
      .single();

    if (!member) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Not authorized',
      });
    }

    const updateData: any = { status };
    if (status === 'responded') {
      updateData.responded_at = new Date().toISOString();
    } else if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('responses')
      .update(updateData)
      .eq('id', responseId)
      .select()
      .single();

    if (error) throw error;

    await auditLog(user.id, response.team_id, 'RESPONSE_STATUS_UPDATED', 'responses', responseId, status);

    return { success: true, response: data };
  } catch (error) {
    console.error('Update response error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update response',
    });
  }
});

async function auditLog(userId: string, teamId: string, action: string, resourceType: string, resourceId: string, details?: string) {
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
