import { AppRouter } from '@/components/AppRouter';
import { ErrorBoundary } from '@/components/ErrorHandler';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { NavBar } from '@/components/NavBar';
import { Toaster } from '@/components/ui/sonner';
import { useNavigation } from '@/hooks/useNavigation';
import { TabNavigation } from '@/layouts/TabNavigation';
import { getRouteByPath, getTabFromPath } from '@/routes';
import { AuthProvider } from '@/store/AuthContext';
import { LanguageProvider } from '@/store/LanguageContext';
import { ThemeProvider, useTheme } from '@/store/ThemeContext';
import { useAuthStore } from '@/store/zustand/authStore';
import { AppTab } from '@/types/routing';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { ModalProvider } from './components/modal';

const AppContent = React.memo(function AppContent() {
  const { theme } = useTheme();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { showTabNavigation, pageTitle } = useNavigation();

  // Determine when to show navbar based on route configuration
  const route = getRouteByPath(location.pathname);
  const shouldShowNavBar = route?.showNavBar ?? false;

  const [activeTab, setActiveTab] = useState<AppTab>('explore');

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname) as AppTab);
  }, [location.pathname]);

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    const tabRoutes: Record<AppTab, string> = {
      explore: '/',
      messages: '/messages',
      create: '/create',
      orders: '/orders',
      profile: '/profile',
    };
    navigate(tabRoutes[tab]);
  };

  const handleTabChangeString = (tab: string) => {
    handleTabChange(tab as AppTab);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div
      className={`h-svh flex flex-col bg-background text-foreground ${
        theme === 'dark' ? 'dark' : ''
      } relative`}
    >
      {shouldShowNavBar && (
        <NavBar
          title={pageTitle}
          onBack={handleBack}
          showBack={location.pathname !== '/'}
        />
      )}
      <ModalProvider>
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route
              path="/*"
              element={<AppRouter onLogout={handleLogout} />}
            />
          </Routes>
        </main>
      </ModalProvider>
      {showTabNavigation && (
        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChangeString}
        />
      )}
      <Toaster position="top-center" />
      <LoadingOverlay />
    </div>
  );
});

export default function App() {
  // Use base path only in production (GitHub Pages)
  const basename = import.meta.env.PROD
    ? '/proxy-shopping-app-prototype'
    : '/';
  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
