import { defineEventHandler, readBody, sendError, createError, getRouterParam } from 'h3';
import { supabase } from '@/integrations/supabase/client';

/**
 * POST /api/posts
 * Create a new post
 */
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  
  const body = await readBody(event);
  const { brandId, content, title, category, imageUrl } = body;

  if (!brandId || !content) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Brand ID and content required',
    }));
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          brand_id: brandId,
          author_id: user.id,
          title: title || null,
          content,
          category: category || 'feedback',
          sentiment: 'unknown',
          image_url: imageUrl || null,
          has_image: !!imageUrl,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Update brand stats
    await updateBrandStats(brandId);

    // Log action
    await auditLog(user.id, null, 'POST_CREATED', 'posts', data.id);

    return { success: true, post: data };
  } catch (error) {
    console.error('Failed to create post:', error);
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Failed to create post',
    }));
  }
});

/**
 * PATCH /api/posts/:id
 * Update a post (author or team admin only)
 */
export const updatePost = defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const postId = getRouterParam(event, 'id');
  const body = await readBody(event);

  if (!postId) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Post ID required',
    }));
  }

  try {
    // Get post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return sendError(event, createError({
        statusCode: 404,
        statusMessage: 'Post not found',
      }));
    }

    // Verify ownership
    if (post.author_id !== user.id) {
      return sendError(event, createError({
        statusCode: 403,
        statusMessage: 'Not authorized to update this post',
      }));
    }

    const { data, error } = await supabase
      .from('posts')
      .update({
        title: body.title !== undefined ? body.title : post.title,
        content: body.content !== undefined ? body.content : post.content,
        category: body.category !== undefined ? body.category : post.category,
        sentiment: body.sentiment !== undefined ? body.sentiment : post.sentiment,
        status: body.status !== undefined ? body.status : post.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;

    await auditLog(user.id, null, 'POST_UPDATED', 'posts', postId, JSON.stringify(body));

    return { success: true, post: data };
  } catch (error) {
    console.error('Failed to update post:', error);
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Failed to update post',
    }));
  }
});

/**
 * POST /api/posts/:id/vote
 * Vote on a post (Stash/Trash)
 */
export const votePost = defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const postId = getRouterParam(event, 'id');
  const { voteType } = await readBody(event);

  if (!postId || !['stash', 'trash'].includes(voteType)) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Post ID and valid vote type required',
    }));
  }

  try {
    // Check existing vote
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (existingVote) {
      // Update existing vote
      if (existingVote.vote_type === voteType) {
        // Remove vote if same type clicked again
        await supabase.from('votes').delete().eq('id', existingVote.id);
      } else {
        // Update to new vote type
        await supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);
      }
    } else {
      // Insert new vote
      await supabase.from('votes').insert([
        {
          post_id: postId,
          user_id: user.id,
          vote_type: voteType,
        },
      ]);
    }

    // Recalculate post stats
    const { data: stashCount } = await supabase
      .from('votes')
      .select('*', { count: 'exact' })
      .eq('post_id', postId)
      .eq('vote_type', 'stash');

    const { data: trashCount } = await supabase
      .from('votes')
      .select('*', { count: 'exact' })
      .eq('post_id', postId)
      .eq('vote_type', 'trash');

    await supabase
      .from('posts')
      .update({
        stash_count: stashCount?.length || 0,
        trash_count: trashCount?.length || 0,
      })
      .eq('id', postId);

    await auditLog(user.id, null, 'VOTE_CAST', 'posts', postId, voteType);

    return { success: true, stashCount: stashCount?.length || 0, trashCount: trashCount?.length || 0 };
  } catch (error) {
    console.error('Failed to vote:', error);
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Failed to vote',
    }));
  }
});

async function updateBrandStats(brandId: string) {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('brand_id', brandId);

  const { data: votes } = await supabase
    .from('votes')
    .select('*')
    .in('post_id', posts?.map(p => p.id) || []);

  await supabase
    .from('brands')
    .update({
      total_posts: posts?.length || 0,
      total_engagement: votes?.length || 0,
    })
    .eq('id', brandId);
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
    console.error('Failed to log audit:', error);
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
  const { data } = await supabase.auth.getUser(token);
  if (!data.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    });
  }
  return data.user;
}
