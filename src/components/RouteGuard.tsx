import { useAuth } from '@/hooks/useAuth';
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';

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
  fallback,
}: RouteGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while auth state is being determined
  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      )
    );
  }

  // Redirect if auth is required but user is not authenticated
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
