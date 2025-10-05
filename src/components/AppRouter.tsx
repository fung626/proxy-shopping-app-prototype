import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { OfferDetailsPage } from '@/pages/offers/OfferDetailsPage';
import { RequestDetailsPage } from '@/pages/requests/RequestDetailsPage';
import { allRoutes } from '@/routes';
import { PageProps } from '@/types/routing';
import React, { memo, Suspense, useMemo } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';
import { RouteGuard } from './RouteGuard';

interface AppRouterProps {
  onLogout: () => void;
}

// Wrapper for pages that need route parameters
function RouteParamsWrapper({
  Component,
  routeProps,
}: {
  Component: React.ComponentType<any>;
  routeProps: PageProps;
}) {
  const params = useParams();
  return <Component {...params} {...routeProps} />;
}

// 404 Not Found page
function NotFoundPage() {
  const { navigateToRoute } = useNavigation();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="text-lg font-medium text-gray-600">
          Page not found
        </div>
        <button
          onClick={() => navigateToRoute('/')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export const AppRouter = memo(function AppRouter({
  onLogout,
}: AppRouterProps) {
  const { user, redirectToAuth } = useAuth();
  const { goBack, navigateToRoute } = useNavigation();

  // Memoize common page props to prevent unnecessary re-renders
  const commonPageProps = useMemo(
    (): PageProps => ({
      onBack: goBack,
      onComplete: () => navigateToRoute('/profile'),
      onSave: () => navigateToRoute('/profile'),
      onConfirm: () => {
        onLogout();
        navigateToRoute('/');
      },
      onShowAuth: () => redirectToAuth(),
      onSignIn: () => redirectToAuth(),
      user,
    }),
    [goBack, navigateToRoute, onLogout, user, redirectToAuth]
  );

  // Generate routes from configuration
  const routeElements = useMemo(() => {
    return allRoutes.map((route) => {
      const { path, element: Component, requireAuth } = route;

      // Replace placeholder for Offer Details page
      if (path === '/offers/:id') {
        return (
          <Route
            key={path}
            path={path}
            element={<OfferDetailsPage />}
          />
        );
      }

      if (path === '/requests/:id') {
        return (
          <Route
            key={path}
            path={path}
            element={<RequestDetailsPage />}
          />
        );
      }

      // Regular route with optional authentication guard
      const element = path.includes(':') ? (
        <RouteParamsWrapper
          Component={Component}
          routeProps={commonPageProps}
        />
      ) : (
        <Component {...commonPageProps} />
      );

      return (
        <Route
          key={path}
          path={path}
          element={
            <RouteGuard requireAuth={requireAuth}>
              <Suspense fallback={<LoadingSpinner />}>
                {element}
              </Suspense>
            </RouteGuard>
          }
        />
      );
    });
  }, [commonPageProps, goBack]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {routeElements}
        {/* Fallback route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
});
