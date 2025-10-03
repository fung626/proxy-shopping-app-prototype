import { ReactNode, useEffect } from 'react';
import { useAuthStore } from './zustand/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initializeAuth = useAuthStore(
    (state) => state.initializeAuth
  );

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}

// Re-export the useAuth hook for backward compatibility
export { useAuth } from '@/hooks/useAuth';
