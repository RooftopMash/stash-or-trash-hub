import { defineEventHandler, getQuery, sendError } from 'h3';
import { supabase } from '@/integrations/supabase/client';

type SocialPlatform = 'twitter' | 'facebook' | 'instagram' | 'tiktok' | 'linkedin';

interface SocialProfile {
  socialId: string;
  username: string;
  profileUrl?: string;
  avatar?: string;
  followers?: number;
  verified?: boolean;
}

/**
 * POST /api/auth/social-link
 * Link a social profile to the authenticated user
 */
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  
  const body = await readBody(event);
  const { platform, socialProfile } = body as {
    platform: SocialPlatform;
    socialProfile: SocialProfile;
  };

  if (!platform || !socialProfile?.socialId) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Platform and socialId required',
    }));
  }

  try {
    // Check if already linked
    const { data: existing } = await supabase
      .from('social_profiles')
      .select('id')
      .eq('user_id', user.id)
      .eq('platform', platform)
      .single();

    if (existing) {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: 'Social profile already linked',
      }));
    }

    // Insert new social profile
    const { data, error } = await supabase
      .from('social_profiles')
      .insert([
        {
          user_id: user.id,
          platform,
          social_id: socialProfile.socialId,
          username: socialProfile.username,
          profile_url: socialProfile.profileUrl,
          avatar: socialProfile.avatar,
          followers: socialProfile.followers || 0,
          verified: socialProfile.verified || false,
          metadata: JSON.stringify(socialProfile),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, profile: data };
  } catch (error) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Failed to link social profile',
    }));
  }
});

/**
 * GET /api/auth/social-profiles
 * Get all linked social profiles for authenticated user
 */
export const getSocialProfiles = defineEventHandler(async (event) => {
  const user = await requireAuth(event);

  try {
    const { data, error } = await supabase
      .from('social_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('linked_at', { ascending: false });

    if (error) throw error;

    return { profiles: data };
  } catch (error) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch social profiles',
    }));
  }
});

/**
 * DELETE /api/auth/social-profiles/:id
 * Unlink a social profile
 */
export const deleteSocialProfile = defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterParam(event, 'id');

  if (!id) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Profile ID required',
    }));
  }

  try {
    // Verify ownership
    const { data: profile } = await supabase
      .from('social_profiles')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!profile || profile.user_id !== user.id) {
      return sendError(event, createError({
        statusCode: 403,
        statusMessage: 'Not authorized',
      }));
    }

    const { error } = await supabase
      .from('social_profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Failed to delete social profile',
    }));
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
  // Verify with Supabase
  const { data } = await supabase.auth.getUser(token);
  if (!data.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    });
  }
  return data.user;
}
