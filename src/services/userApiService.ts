import { supabase } from '@/supabase/client';
import { BaseApiService } from './baseApiService';

export class UserApiService extends BaseApiService {
  private readonly endpoint = '/users';

  // Get current user (with Supabase integration)
  async getCurrentUser(): Promise<any> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw new Error(error.message);
      return user;
    } catch {
      // Fallback to API endpoint
      return this.request(`${this.endpoint}/current`);
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<{ user: any }> {
    return this.request(
      `${this.endpoint}/${userId}`,
      {},
      `user-${userId}`,
      5 * 60 * 1000 // 5 minutes cache
    );
  }

  // Get all users (with pagination)
  async getUsers(
    page: number = 1,
    limit: number = 20
  ): Promise<{ users: any[]; total: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return this.request(
      `${this.endpoint}?${params}`,
      {},
      `users-page-${page}-limit-${limit}`,
      2 * 60 * 1000 // 2 minutes cache
    );
  }

  // Update user
  async updateUser(
    userId: string,
    userData: any
  ): Promise<{ user: any }> {
    const result = await this.request<{ user: any }>(
      `${this.endpoint}/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(userData),
      }
    );

    // Invalidate related caches
    this.clearCache(`user-${userId}`);
    this.clearCachePattern('users-page-');

    return result;
  }

  // Delete user
  async deleteUser(userId: string): Promise<{ success: boolean }> {
    const result = await this.request<{ success: boolean }>(
      `${this.endpoint}/${userId}`,
      {
        method: 'DELETE',
      }
    );

    // Invalidate related caches
    this.clearCache(`user-${userId}`);
    this.clearCachePattern('users-page-');

    return result;
  }

  // Search users
  async searchUsers(
    query: string,
    filters?: any
  ): Promise<{ users: any[]; total: number }> {
    const params = new URLSearchParams({ q: query, ...filters });
    return this.request(`/search/users?${params}`);
  }

  // Upload user avatar
  async uploadAvatar(
    userId: string,
    file: File
  ): Promise<{ url: string; path: string }> {
    const { url, path } = await this.uploadFile(file, 'avatars');

    // Update user with new avatar URL
    await this.updateUser(userId, { avatar: url });

    return { url, path };
  }

  // Update user preferences
  async updatePreferences(
    userId: string,
    preferences: any
  ): Promise<{ user: any }> {
    return this.updateUser(userId, { preferences });
  }

  // Update verification status
  async updateVerificationStatus(
    userId: string,
    verificationType: 'email' | 'phone' | 'identity' | 'business',
    status: boolean
  ): Promise<{ user: any }> {
    const result = await this.request<{ user: any }>(
      `${this.endpoint}/${userId}/verification`,
      {
        method: 'PUT',
        body: JSON.stringify({ type: verificationType, status }),
      }
    );

    // Invalidate related caches
    this.clearCache(`user-${userId}`);

    return result;
  }
}

// Create and export singleton instance
export const userApiService = new UserApiService();
