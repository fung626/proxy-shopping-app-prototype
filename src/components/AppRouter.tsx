import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { TabNavigation } from '@/layouts/TabNavigation';
import { allRoutes } from '@/routes';
import { AppTab, PageProps } from '@/types/routing';
import { ArrowLeft } from 'lucide-react';
import React, { memo, Suspense, useMemo } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';
import { RouteGuard } from './RouteGuard';
import { Button } from './ui/button';

interface AppRouterProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
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

// Generic placeholder for unimplemented detail pages
function DetailPagePlaceholder({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <div className="p-4 text-center">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">{title} page coming soon</p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
    </div>
  );
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
  activeTab,
  onTabChange,
  onLogout,
}: AppRouterProps) {
  const { user, redirectToAuth } = useAuth();
  const { goBack, navigateToRoute, showTabNavigation } =
    useNavigation();

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

  const handleTabChange = (tab: string) => {
    onTabChange(tab as AppTab);
  };

  // Generate routes from configuration
  const routeElements = useMemo(() => {
    return allRoutes.map((route) => {
      const { path, element: Component, requireAuth } = route;

      // Special handling for detail pages that aren't implemented yet
      if (path === '/offers/:id') {
        return (
          <Route
            key={path}
            path={path}
            element={
              <DetailPagePlaceholder
                title="Offer Details"
                onBack={goBack}
              />
            }
          />
        );
      }

      if (path === '/requests/:id') {
        return (
          <Route
            key={path}
            path={path}
            element={
              <DetailPagePlaceholder
                title="Request Details"
                onBack={goBack}
              />
            }
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
    <div className="h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 overflow-y-auto">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {routeElements}

            {/* Fallback route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {showTabNavigation && (
        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  );
});
