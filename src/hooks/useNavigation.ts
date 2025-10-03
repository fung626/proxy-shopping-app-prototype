import {
  getPageTitle,
  getTabFromPath,
  shouldShowTabNavigation,
} from '@/routes';
import { AppTab } from '@/types/routing';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface NavigationHistory {
  canGoBack: boolean;
  canGoForward: boolean;
  previousRoute?: string;
  currentRoute: string;
}

export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current navigation state
  const navigationState = useMemo(
    () => ({
      activeTab: getTabFromPath(location.pathname) as AppTab,
      showTabNavigation: shouldShowTabNavigation(location.pathname),
      pageTitle: getPageTitle(location.pathname),
      currentPath: location.pathname,
    }),
    [location.pathname]
  );

  // Navigation functions
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);

  const navigateToTab = useCallback(
    (tab: AppTab) => {
      const tabRoutes: Record<AppTab, string> = {
        explore: '/',
        messages: '/messages',
        create: '/create',
        orders: '/orders',
        profile: '/profile',
      };
      navigate(tabRoutes[tab]);
    },
    [navigate]
  );

  const navigateToRoute = useCallback(
    (path: string, state?: any) => {
      navigate(path, { state });
    },
    [navigate]
  );

  const replace = useCallback(
    (path: string, state?: any) => {
      navigate(path, { replace: true, state });
    },
    [navigate]
  );

  return {
    ...navigationState,
    goBack,
    goForward,
    navigateToTab,
    navigateToRoute,
    replace,
  };
}

export function useRouteParams<T = Record<string, string>>(): T {
  const location = useLocation();

  const params = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const pathParts = location.pathname.split('/');

    // Extract route parameters (simplified)
    const params: Record<string, string> = {};

    // Add search params
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Add common path params
    if (pathParts.includes('category')) {
      const categoryIndex = pathParts.indexOf('category');
      if (pathParts[categoryIndex + 1]) {
        params.category = pathParts[categoryIndex + 1];
      }
    }

    // Add ID param for detail pages
    if (
      pathParts.length >= 3 &&
      (pathParts[1] === 'offers' || pathParts[1] === 'requests')
    ) {
      params.id = pathParts[2];
    }

    return params as T;
  }, [location.pathname, location.search]);

  return params;
}

export interface Breadcrumb {
  label: string;
  path: string;
  isActive?: boolean;
}

export function useBreadcrumbs() {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const crumbs: Breadcrumb[] = [{ label: 'Home', path: '/' }];

    let currentPath = '';
    pathParts.forEach((part, index) => {
      currentPath += `/${part}`;

      // Generate human-readable labels
      let label = part.charAt(0).toUpperCase() + part.slice(1);
      label = label.replace(/-/g, ' ');

      // Special cases
      if (part === 'all-offers') label = 'All Offers';
      if (part === 'all-requests') label = 'All Requests';
      if (part === 'all-agents') label = 'All Agents';
      if (part === 'email-verification') label = 'Email Verification';
      if (part === 'phone-verification') label = 'Phone Verification';
      if (part === 'identity-verification')
        label = 'Identity Verification';
      if (part === 'business-verification')
        label = 'Business Verification';
      if (part === 'change-password') label = 'Change Password';
      if (part === 'two-factor-auth') label = 'Two-Factor Auth';
      if (part === 'edit-account') label = 'Edit Account';
      if (part === 'delete-account') label = 'Delete Account';
      if (part === 'bank-information') label = 'Bank Information';
      if (part === 'credit-cards') label = 'Credit Cards';
      if (part === 'transaction-password')
        label = 'Transaction Password';
      if (part === 'biometric-auth') label = 'Biometric Auth';
      if (part === 'about-us') label = 'About Us';
      if (part === 'terms') label = 'Terms of Service';
      if (part === 'privacy') label = 'Privacy Policy';

      crumbs.push({
        label,
        path: currentPath,
        isActive: index === pathParts.length - 1,
      });
    });

    return crumbs;
  }, [location.pathname]);

  return breadcrumbs;
}
