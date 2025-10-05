import { ReactNode, useEffect } from 'react';
import { useAuthStore } from './zustand/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);
  return <>{children}</>;
}

// Re-export the useAuth hook for backward compatibility
export { useAuth } from '@/hooks/useAuth';
