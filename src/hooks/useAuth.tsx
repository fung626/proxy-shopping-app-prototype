import { useAuthStore } from '@/store/zustand/authStore';
import { useAuthNavigation } from './useAuthNavigation';

export function useAuth() {
  const authStore = useAuthStore();
  const { redirectToAuth, redirectAfterAuth } = useAuthNavigation();
  return {
    ...authStore,
    redirectToAuth,
    redirectAfterAuth,
  };
}
