/**
 * API Client for SOT endpoints
 * Centralized fetch wrapper with auth and error handling
 */

interface APIResponse<T = any> {
  success?: boolean;
  error?: string;
  data?: T;
  [key: string]: any;
}

async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  const url = `/api${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.statusMessage || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const api = {
  // Auth endpoints
  linkSocialProfile: (platform: string, socialProfile: any) =>
    apiCall('/auth/social-link', {
      method: 'POST',
      body: JSON.stringify({ platform, socialProfile }),
    }),

  getSocialProfiles: () => apiCall('/auth/social-profiles'),

  unlinkSocialProfile: (id: string) =>
    apiCall(`/auth/social-profiles/${id}`, { method: 'DELETE' }),

  // Posts endpoints
  createPost: (brandId: string, content: string, options?: any) =>
    apiCall('/posts', {
      method: 'POST',
      body: JSON.stringify({ brandId, content, ...options }),
    }),

  updatePost: (id: string, updates: any) =>
    apiCall(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  votePost: (postId: string, voteType: 'stash' | 'trash') =>
    apiCall(`/posts/${postId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    }),

  // Brands endpoints
  createBrand: (name: string, slug: string, options?: any) =>
    apiCall('/brands', {
      method: 'POST',
      body: JSON.stringify({ name, slug, ...options }),
    }),

  getBrandTeam: (brandId: string) => apiCall(`/brands/${brandId}/team`),

  addTeamMember: (teamId: string, userId: string, role: string) =>
    apiCall(`/brands/${teamId}/team/members`, {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    }),

  // Responses endpoints
  createResponse: (postId: string, teamId: string, content: string) =>
    apiCall('/responses', {
      method: 'POST',
      body: JSON.stringify({ postId, teamId, content }),
    }),

  updateResponseStatus: (responseId: string, status: string) =>
    apiCall(`/responses/${responseId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
