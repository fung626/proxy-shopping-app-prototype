// Route configuration types
export interface RouteConfig {
  path: string;
  element: React.ComponentType<any>;
  requireAuth?: boolean;
  showTabNavigation?: boolean;
  showNavBar?: boolean;
  preload?: boolean;
  meta?: {
    title?: string;
    subTitle?: string;
    description?: string;
  };
}

export interface RouteGroup {
  name: string;
  routes: RouteConfig[];
  basePath?: string;
}

// Navigation types
export type AppTab =
  | 'explore'
  | 'messages'
  | 'create'
  | 'orders'
  | 'profile';

export interface NavigationState {
  activeTab: AppTab;
  canGoBack: boolean;
  previousRoute?: string;
}

// Route parameters
export interface RouteParams {
  id?: string;
  category?: string;
  tab?: string;
}

// Page props interface
export interface PageProps {
  onBack?: () => void;
  onComplete?: () => void;
  onSave?: () => void;
  onConfirm?: () => void;
  onShowAuth?: () => void;
  onSignIn?: () => void;
  user?: any;
}
