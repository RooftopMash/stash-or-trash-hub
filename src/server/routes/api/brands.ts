import { defineEventHandler, readBody, sendError, createError, getRouterParam } from 'h3';
import { supabase } from '@/integrations/supabase/client';

/**
 * POST /api/brands
 * Create a new brand (admin only)
 */
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const body = await readBody(event);
  const { name, slug, description, logo, website, category } = body;

  if (!name || !slug) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Name and slug required',
    }));
  }

  try {
    const { data, error } = await supabase
      .from('brands')
      .insert([
        {
          name,
          slug,
          description: description || null,
          logo: logo || null,
          website: website || null,
          category: category || null,
          overall_sentiment: 'unknown',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Create default team
    await supabase.from('brand_teams').insert([
      {
        brand_id: data.id,
        name: `${name} Team`,
        description: `Default team for ${name}`,
      },
    ]);

    await auditLog(user.id, null, 'BRAND_CREATED', 'brands', data.id);

    return { success: true, brand: data };
  } catch (error) {
    console.error('Failed to create brand:', error);
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Failed to create brand',
    }));
  }
});

/**
 * GET /api/brands/:id/team
 * Get brand team details
 */
export const getBrandTeam = defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const brandId = getRouterParam(event, 'id');

  try {
    const { data: team, error: teamError } = await supabase
      .from('brand_teams')
      .select(`
        *,
        team_members(
          *,
          users:user_id(id, email, display_name, avatar)
        )
      `)
      .eq('brand_id', brandId)
      .single();

    if (teamError) throw teamError;

    return { team };
  } catch (error) {
    console.error('Failed to fetch team:', error);
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch team',
    }));
  }
});

/**
 * POST /api/brands/:id/team/members
 * Add team member
 */
export const addTeamMember = defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const teamId = getRouterParam(event, 'id');
  const { userId, role } = await readBody(event);

  if (!userId || !['admin', 'analyst', 'viewer'].includes(role)) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'User ID and valid role required',
    }));
  }

  try {
    // Verify user is admin of team
    const { data: member } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (!member || member.role !== 'admin') {
      return sendError(event, createError({
        statusCode: 403,
        statusMessage: 'Not authorized',
      }));
    }

    const { data, error } = await supabase
      .from('team_members')
      .insert([
        {
          team_id: teamId,
          user_id: userId,
          role,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    await auditLog(user.id, teamId, 'TEAM_MEMBER_ADDED', 'team_members', data.id);

    return { success: true, member: data };
  } catch (error) {
    console.error('Failed to add team member:', error);
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Failed to add team member',
    }));
  }
});

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
