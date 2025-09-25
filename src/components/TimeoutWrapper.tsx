import { ReactNode } from 'react';

interface TimeoutWrapperProps {
  children: ReactNode;
  timeout?: number;
  onTimeout?: () => void;
  errorMessage?: string;
  retryAction?: () => void;
}

export function TimeoutWrapper({ 
  children
}: TimeoutWrapperProps) {
  // Simplified version - just render children directly
  // This removes all timeout-related complexity that was causing issues
  return <>{children}</>;
}