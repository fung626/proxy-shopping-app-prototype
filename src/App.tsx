import { AppRouter } from '@/components/AppRouter';
import { ErrorBoundary } from '@/components/ErrorHandler';
import { Toaster } from '@/components/ui/sonner';
import { getTabFromPath } from '@/routes';
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

const AppContent = React.memo(function AppContent() {
  const { theme } = useTheme();
  const { loading, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-6 h-6 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen flex flex-col bg-background text-foreground ${
        theme === 'dark' ? 'dark' : ''
      }`}
    >
      <Routes>
        <Route
          path="/*"
          element={
            <AppRouter
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onLogout={handleLogout}
            />
          }
        />
      </Routes>
      <Toaster position="top-center" />
    </div>
  );
});

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
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
