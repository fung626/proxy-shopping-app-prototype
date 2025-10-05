import { supabase } from '@/supabase/client';
import type { User } from '@/types';
import authService from './authService';

class UserSupabaseService {
  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error getting current user:', error);
        return null;
      }

      if (!user) return null;

      // Get user profile from our users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.warn(
          'Profile not found, using auth user data:',
          profileError
        );
        // Return basic user data from auth if profile doesn't exist
        return {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
          nickname: user.user_metadata?.nickname,
          phone: user.phone,
          created_at: user.created_at,
          updated_at: user.updated_at || user.created_at,
        } as User;
      }

      return profile as User;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  }

  async updateUser(
    userId: string,
    userData: Partial<User>
  ): Promise<User> {
    const { data, error } = await authService.updateProfile(
      userId,
      userData
    );

    if (error) {
      throw new Error(error.message);
    }

    const updatedUser = await this.getCurrentUser();
    if (!updatedUser) {
      throw new Error('Failed to get updated user data');
    }

    return updatedUser;
  }

  async getUsers(limit: number = 10): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(limit);
    if (error) {
      console.error('Error fetching top agents:', error);
      throw new Error('Failed to fetch top agents');
    }
    return data || [];
  }
}

// Export singleton instance
export const userSupabaseService = new UserSupabaseService();
