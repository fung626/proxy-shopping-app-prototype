import { supabase } from '@/supabase/client';
import authService, { User } from './authSupabaseService';

export interface SupabaseUser extends User {
  name?: string;
  nickname?: string;
  email?: string;
  country_code?: string;
  phone?: string;
  country?: string;
  bio?: string;
  avatar?: string;
  gender?: string;
  date_of_birth?: string;
  website?: string;
  company?: string;
  job_title?: string;
  languages?: string[];
  preferences?: {
    categories?: string[];
  };
  verification_status?: string;
  credit_cards?: any;
  rating: number;
  reviews: number;
  since: string;
  verified: boolean;
  image: string;
  success_rate: number;
  total_orders: number;
}

class UserSupabaseService {
  async getCurrentUser(): Promise<SupabaseUser | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting current user:', error);
        return null;
      }
      if (!user) {
        return null;
      }
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
          name:
            user.user_metadata?.name ||
            user.user_metadata?.full_name ||
            user.email!.split('@')[0],
          nickname: user.user_metadata?.nickname,
          phone: user.phone,
          rating: 0,
          reviews: 0,
          since: new Date(user.created_at).getFullYear().toString(),
          verified: false,
          image: user.user_metadata?.avatar_url || '',
          success_rate: 0,
          total_orders: 0,
        } as SupabaseUser;
      }
      // Ensure name field exists in profile data
      return {
        ...profile,
        name: profile.name || profile.email?.split('@')[0] || 'User',
      } as SupabaseUser;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  }

  async updateUser(
    userId: string,
    userData: Partial<SupabaseUser>
  ): Promise<SupabaseUser> {
    const { error } = await authService.updateProfile(
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

  async getUsers(limit: number = 10): Promise<SupabaseUser[]> {
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

  async getUserById(userId: string): Promise<SupabaseUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Error fetching user by ID:', error);
        return null;
      }
      return data as SupabaseUser;
    } catch (error) {
      console.error('Unexpected error in getUserById:', error);
      return null;
    }
  }
}

// Create and export singleton instance
export default new UserSupabaseService();

// Export singleton instance
export const userSupabaseService = new UserSupabaseService();
