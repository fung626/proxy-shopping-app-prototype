import { supabase } from '@/supabase/client';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import { SignInData, SignUpData, UpdateProfileData } from './type';

class AuthSupabaseService {
  // Get current session
  async getCurrentSession(): Promise<{
    data: { session: Session | null };
    error: AuthError | null;
  }> {
    return await supabase.auth.getSession();
  }

  // Get current user
  async getCurrentUser(): Promise<{
    data: { user: User | null };
    error: AuthError | null;
  }> {
    return await supabase.auth.getUser();
  }

  // Sign up new user
  async signUp(
    userData: SignUpData
  ): Promise<{ data: any; error: AuthError | null }> {
    const {
      email,
      password,
      firstName,
      lastName,
      avatar,
      ...profileData
    } = userData;

    // Combine first and last name
    const fullName = `${firstName} ${lastName}`.trim();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: fullName,
          firstName,
          lastName,
          ...profileData,
        },
      },
    });

    if (error) return { data: null, error };

    // Create user profile in our users table
    if (data.user) {
      let avatarUrl = null;

      // Upload avatar if provided
      if (avatar) {
        const { data: uploadData, error: uploadError } =
          await this.uploadAvatar(data.user.id, avatar);

        if (!uploadError && uploadData) {
          avatarUrl = uploadData.publicUrl;
        }
      }

      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: data.user.email!,
            name: fullName,
            avatar: avatarUrl,
            ...profileData,
            verification_status: {
              email: false,
              phone: false,
              identity: false,
              business: false,
            },
          },
        ]);

      if (profileError) {
        console.warn('Profile creation failed:', profileError);
      }
    }

    return { data, error };
  }

  // Sign in user
  async signIn(
    credentials: SignInData
  ): Promise<{ data: any; error: AuthError | null }> {
    return await supabase.auth.signInWithPassword(credentials);
  }

  // Sign out user
  async signOut(): Promise<{ error: AuthError | null }> {
    return await supabase.auth.signOut();
  }

  // Reset password
  async resetPassword(
    email: string
  ): Promise<{ data: any; error: AuthError | null }> {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
  }

  // Update password
  async updatePassword(
    authCode: string,
    password: string
  ): Promise<{ data: any; error: AuthError | null }> {
    await supabase.auth.exchangeCodeForSession(authCode);
    return await supabase.auth.updateUser({ password });
  }

  // Update user profile
  async updateProfile(
    userId: string,
    profileData: UpdateProfileData
  ): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  }

  // Get user profile
  async getUserProfile(
    userId: string
  ): Promise<{ data: any; error: any }> {
    return await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
  }

  // Listen to auth state changes
  onAuthStateChange(
    callback: (event: string, session: Session | null) => void
  ) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Upload avatar
  async uploadAvatar(
    userId: string,
    file: File
  ): Promise<{ data: any; error: any }> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (error) return { data: null, error };

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Update user profile with avatar URL
    const profileUpdate = await this.updateProfile(userId, {
      avatar: publicUrl,
    });

    return {
      data: { ...data, publicUrl },
      error: profileUpdate.error,
    };
  }

  // Verify email
  async resendEmailConfirmation(
    email: string
  ): Promise<{ data: any; error: AuthError | null }> {
    return await supabase.auth.resend({
      type: 'signup',
      email,
    });
  }

  // Social authentication
  async signInWithGoogle(): Promise<{
    data: any;
    error: AuthError | null;
  }> {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async signInWithFacebook(): Promise<{
    data: any;
    error: AuthError | null;
  }> {
    return await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async signInWithApple(): Promise<{
    data: any;
    error: AuthError | null;
  }> {
    return await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  // Forgot password
  async forgotPassword(
    email: string
  ): Promise<{ data: any; error: AuthError | null }> {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
  }
}

// Create and export singleton instance
export default new AuthSupabaseService();

export const authSupabaseService = new AuthSupabaseService();

// Export types
export type { AuthError, Session, User } from '@supabase/supabase-js';
