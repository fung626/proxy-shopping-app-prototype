import { SupportedLanguage, t } from '@/locales';
import authService from '@/services/authSupabaseService';
import {
  SupabaseUser as User,
  userSupabaseService as userService,
} from '@/services/userSupabaseService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useLoadingStore } from './loadingStore';

// Helper to get current language from localStorage
const getCurrentLanguage = (): SupportedLanguage => {
  return (
    (localStorage.getItem('language') as SupportedLanguage) || 'en'
  );
};

interface AuthState {
  initalizing: boolean;
  user?: User;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      initalizing: false,
      user: undefined,
      isAuthenticated: false,
      initialize: async () => {
        try {
          const user = await userService.getCurrentUser();
          if (user) {
            set({
              user,
              isAuthenticated: true,
            });
          } else {
            set({
              user: undefined,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          console.warn('⚠️ Auth initialization failed:', error);
          set({
            user: undefined,
            isAuthenticated: false,
          });
          const { stop: stopLoading } = useLoadingStore.getState();
          stopLoading('auth-init');
        }
      },
      logout: async () => {
        try {
          const { start: startLoading, stop: stopLoading } =
            useLoadingStore.getState();
          const lang = getCurrentLanguage();
          startLoading('auth-logout', t(lang, 'auth.signingOut'));
          await authService.signOut();
          set({
            user: undefined,
            isAuthenticated: false,
          });
          stopLoading('auth-logout');
        } catch (error) {
          console.error('Logout failed:', error);
          set({
            user: undefined,
            isAuthenticated: false,
          });
          const { stop: stopLoading } = useLoadingStore.getState();
          stopLoading('auth-logout');
        }
      },
      clear: () => {
        set({
          user: undefined,
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
