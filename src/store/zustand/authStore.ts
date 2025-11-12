import authService from '@/services/authSupabaseService';
import { userSupabaseService } from '@/services/userSupabaseService';
import { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },
      initialize: async () => {
        try {
          // Use the loading store for auth initialization
          const { start: startLoading, stop: stopLoading } =
            await import('./loadingStore').then((m) =>
              m.useLoadingStore.getState()
            );
          startLoading('auth-init', 'Loading...');
          const currentUser =
            await userSupabaseService.getCurrentUser();
          if (currentUser?.email) {
            set({
              user: currentUser,
              isAuthenticated: true,
            });
            console.log(
              '✅ User restored from Supabase:',
              currentUser.email
            );
          } else {
            set({
              user: null,
              isAuthenticated: false,
            });
            console.log('ℹ️ No authenticated user found');
          }
          stopLoading('auth-init');
        } catch (error) {
          console.warn('⚠️ Auth initialization failed:', error);
          set({
            user: null,
            isAuthenticated: false,
          });
          const { stop: stopLoading } = await import(
            './loadingStore'
          ).then((m) => m.useLoadingStore.getState());
          stopLoading('auth-init');
        }
      },
      logout: async () => {
        try {
          const { start: startLoading, stop: stopLoading } =
            await import('./loadingStore').then((m) =>
              m.useLoadingStore.getState()
            );
          startLoading('auth-logout', 'Signing out...');
          await authService.signOut();
          set({
            user: null,
            isAuthenticated: false,
          });
          stopLoading('auth-logout');
        } catch (error) {
          console.error('Logout failed:', error);
          // Still clear local state even if logout fails
          set({
            user: null,
            isAuthenticated: false,
          });
          const { stop: stopLoading } = await import(
            './loadingStore'
          ).then((m) => m.useLoadingStore.getState());
          stopLoading('auth-logout');
        }
      },
      clear: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
