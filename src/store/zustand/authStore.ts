import authService from '@/services/authService';
import UserService from '@/services/userService';
import { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      isAuthenticated: false,

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
          loading: false,
        });
      },

      initializeAuth: async () => {
        try {
          set({ loading: true });
          const currentUser = await UserService.getCurrentUser();

          if (currentUser?.email) {
            set({
              user: currentUser,
              isAuthenticated: true,
              loading: false,
            });
            console.log(
              '✅ User restored from Supabase:',
              currentUser.email
            );
          } else {
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
            });
            console.log('ℹ️ No authenticated user found');
          }
        } catch (error) {
          console.warn('⚠️ Auth initialization failed:', error);
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },

      logout: async () => {
        try {
          await authService.signOut();
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        } catch (error) {
          console.error('Logout failed:', error);
          // Still clear local state even if logout fails
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },

      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
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
