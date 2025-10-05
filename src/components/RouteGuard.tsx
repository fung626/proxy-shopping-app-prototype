import { useAuth } from '@/hooks/useAuth';
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
}

export function RouteGuard({
  children,
  requireAuth = false,
  redirectTo = '/auth/signin',
}: RouteGuardProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (requireAuth && !user) {
    return (
      <Navigate to={redirectTo} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
}

// Higher-order component for route protection
export function withRouteGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps: Omit<RouteGuardProps, 'children'>
) {
  return function GuardedComponent(props: P) {
    return (
      <RouteGuard {...guardProps}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}
