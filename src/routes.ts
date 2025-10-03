import { RouteConfig, RouteGroup } from '@/types/routing';
import { lazy } from 'react';

// Lazy load tab components for better performance
const ExploreTab = lazy(() =>
  import('@/pages/tabs/ExploreTab').then((m) => ({
    default: m.ExploreTab,
  }))
);
const CreateTab = lazy(() =>
  import('@/pages/tabs/CreateTab').then((m) => ({
    default: m.CreateTab,
  }))
);
const MessagesTab = lazy(() =>
  import('@/pages/tabs/MessagesTab').then((m) => ({
    default: m.MessagesTab,
  }))
);
const OrdersTab = lazy(() =>
  import('@/pages/tabs/OrdersTab').then((m) => ({
    default: m.OrdersTab,
  }))
);
const ProfileTab = lazy(() =>
  import('@/pages/tabs/ProfileTab').then((m) => ({
    default: m.ProfileTab,
  }))
);

// Explore sub-pages
const WishlistsPage = lazy(() =>
  import('@/pages/explore/WishlistsPage').then((m) => ({
    default: m.WishlistsPage,
  }))
);
const SearchPage = lazy(() =>
  import('@/pages/explore/SearchPage').then((m) => ({
    default: m.SearchPage,
  }))
);
const AllOffersPage = lazy(() =>
  import('@/pages/offers/AllOffersPage').then((m) => ({
    default: m.AllOffersPage,
  }))
);
const AllRequestsPage = lazy(() =>
  import('@/pages/requests/AllRequestsPage').then((m) => ({
    default: m.AllRequestsPage,
  }))
);
const AllAgentsPage = lazy(() =>
  import('@/pages/explore/AllAgentsPage').then((m) => ({
    default: m.AllAgentsPage,
  }))
);
const CategoryPage = lazy(() =>
  import('@/pages/explore/CategoryPage').then((m) => ({
    default: m.CategoryPage,
  }))
);

// Detail pages
const OfferDetailsPage = lazy(() =>
  import('@/pages/offers/OfferDetailsPage').then((m) => ({
    default: m.OfferDetailsPage,
  }))
);
const RequestDetailsPage = lazy(() =>
  import('@/pages/requests/RequestDetailsPage').then((m) => ({
    default: m.RequestDetailsPage,
  }))
);

// Verification pages
const EmailVerificationPage = lazy(() =>
  import('@/pages/verification/EmailVerificationPage').then((m) => ({
    default: m.EmailVerificationPage,
  }))
);
const PhoneVerificationPage = lazy(() =>
  import('@/pages/verification/PhoneVerificationPage').then((m) => ({
    default: m.PhoneVerificationPage,
  }))
);
const IdentityVerificationPage = lazy(() =>
  import('@/pages/verification/IdentityVerificationPage').then(
    (m) => ({
      default: m.IdentityVerificationPage,
    })
  )
);
const BusinessVerificationPage = lazy(() =>
  import('@/pages/verification/BusinessVerificationPage').then(
    (m) => ({
      default: m.BusinessVerificationPage,
    })
  )
);
const ChangePasswordPage = lazy(() =>
  import('@/pages/profile/ChangePasswordPage').then((m) => ({
    default: m.ChangePasswordPage,
  }))
);
const TwoFactorAuthPage = lazy(() =>
  import('@/pages/verification/TwoFactorAuthPage').then((m) => ({
    default: m.TwoFactorAuthPage,
  }))
);
const EditAccountPage = lazy(() =>
  import('@/pages/profile/EditAccountPage').then((m) => ({
    default: m.EditAccountPage,
  }))
);
const DeleteAccountPage = lazy(() =>
  import('@/pages/profile/DeleteAccountPage').then((m) => ({
    default: m.DeleteAccountPage,
  }))
);
const BankInformationPage = lazy(() =>
  import('@/pages/payment/BankInformationPage').then((m) => ({
    default: m.BankInformationPage,
  }))
);
const CreditCardsPage = lazy(() =>
  import('@/pages/payment/CreditCardsPage').then((m) => ({
    default: m.CreditCardsPage,
  }))
);
const TransactionPasswordPage = lazy(() =>
  import('@/pages/profile/TransactionPasswordPage').then((m) => ({
    default: m.TransactionPasswordPage,
  }))
);
const BiometricAuthPage = lazy(() =>
  import('@/pages/verification/BiometricAuthPage').then((m) => ({
    default: m.BiometricAuthPage,
  }))
);

// Auth pages
const SignInPage = lazy(() =>
  import('@/pages/auth/SignInPage').then((m) => ({
    default: m.SignInPage,
  }))
);
const SignUpPage = lazy(() =>
  import('@/pages/auth/SignUpPage').then((m) => ({
    default: m.SignUpPage,
  }))
);
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  }))
);
const AuthCallbackPage = lazy(() =>
  import('@/pages/auth/AuthCallbackPage').then((m) => ({
    default: m.AuthCallbackPage,
  }))
);

// Support & Legal pages
const SupportPage = lazy(() =>
  import('@/pages/support/SupportPage').then((m) => ({
    default: m.SupportPage,
  }))
);
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/legal/PrivacyPolicyPage').then((m) => ({
    default: m.PrivacyPolicyPage,
  }))
);
const TermsOfServicePage = lazy(() =>
  import('@/pages/legal/TermsOfServicePage').then((m) => ({
    default: m.TermsOfServicePage,
  }))
);
const AboutUsPage = lazy(() =>
  import('@/pages/legal/AboutUsPage').then((m) => ({
    default: m.AboutUsPage,
  }))
);

// Route groups configuration
export const routeGroups: RouteGroup[] = [
  {
    name: 'main',
    routes: [
      {
        path: '/',
        element: ExploreTab,
        showTabNavigation: true,
        preload: true,
        meta: {
          title: 'Explore',
          description: 'Discover shopping opportunities',
        },
      },
      {
        path: '/messages',
        element: MessagesTab,
        requireAuth: true,
        showTabNavigation: true,
        meta: {
          title: 'Messages',
          description: 'Chat with agents and clients',
        },
      },
      {
        path: '/create',
        element: CreateTab,
        showTabNavigation: true,
        meta: {
          title: 'Create',
          description: 'Create offers and requests',
        },
      },
      {
        path: '/orders',
        element: OrdersTab,
        requireAuth: true,
        showTabNavigation: true,
        meta: {
          title: 'Orders',
          description: 'Manage your orders',
        },
      },
      {
        path: '/profile',
        element: ProfileTab,
        showTabNavigation: true,
        meta: {
          title: 'Profile',
          description: 'Manage your account',
        },
      },
    ],
  },
  {
    name: 'explore',
    basePath: '/explore',
    routes: [
      {
        path: '/explore/wishlist',
        element: WishlistsPage,
        requireAuth: true,
        meta: {
          title: 'Wishlist',
          description: 'Your saved items',
        },
      },
      {
        path: '/explore/search',
        element: SearchPage,
        meta: {
          title: 'Search',
          description: 'Search for offers and requests',
        },
      },
      {
        path: '/explore/all-offers',
        element: AllOffersPage,
        meta: {
          title: 'All Offers',
          description: 'Browse all available offers',
        },
      },
      {
        path: '/explore/all-requests',
        element: AllRequestsPage,
        meta: {
          title: 'All Requests',
          description: 'Browse all shopping requests',
        },
      },
      {
        path: '/explore/all-agents',
        element: AllAgentsPage,
        meta: {
          title: 'All Agents',
          description: 'Browse all shopping agents',
        },
      },
      {
        path: '/explore/category/:category',
        element: CategoryPage,
        meta: {
          title: 'Category',
          description: 'Browse category items',
        },
      },
    ],
  },
  {
    name: 'details',
    routes: [
      {
        path: '/offers/:id',
        element: OfferDetailsPage,
        meta: {
          title: 'Offer Details',
          description: 'View offer details',
        },
      },
      {
        path: '/requests/:id',
        element: RequestDetailsPage,
        meta: {
          title: 'Request Details',
          description: 'View request details',
        },
      },
    ],
  },
  {
    name: 'profile',
    basePath: '/profile',
    routes: [
      {
        path: '/profile/email-verification',
        element: EmailVerificationPage,
        requireAuth: true,
        meta: {
          title: 'Email Verification',
          description: 'Verify your email address',
        },
      },
      {
        path: '/profile/phone-verification',
        element: PhoneVerificationPage,
        requireAuth: true,
        meta: {
          title: 'Phone Verification',
          description: 'Verify your phone number',
        },
      },
      {
        path: '/profile/identity-verification',
        element: IdentityVerificationPage,
        requireAuth: true,
        meta: {
          title: 'Identity Verification',
          description: 'Verify your identity',
        },
      },
      {
        path: '/profile/business-verification',
        element: BusinessVerificationPage,
        requireAuth: true,
        meta: {
          title: 'Business Verification',
          description: 'Verify your business',
        },
      },
      {
        path: '/profile/change-password',
        element: ChangePasswordPage,
        requireAuth: true,
        meta: {
          title: 'Change Password',
          description: 'Update your password',
        },
      },
      {
        path: '/profile/two-factor-auth',
        element: TwoFactorAuthPage,
        requireAuth: true,
        meta: {
          title: 'Two-Factor Authentication',
          description: 'Manage 2FA settings',
        },
      },
      {
        path: '/profile/edit-account',
        element: EditAccountPage,
        requireAuth: true,
        meta: {
          title: 'Edit Account',
          description: 'Update your profile',
        },
      },
      {
        path: '/profile/delete-account',
        element: DeleteAccountPage,
        requireAuth: true,
        meta: {
          title: 'Delete Account',
          description: 'Delete your account',
        },
      },
      {
        path: '/profile/bank-information',
        element: BankInformationPage,
        requireAuth: true,
        meta: {
          title: 'Bank Information',
          description: 'Manage bank details',
        },
      },
      {
        path: '/profile/credit-cards',
        element: CreditCardsPage,
        requireAuth: true,
        meta: {
          title: 'Credit Cards',
          description: 'Manage payment methods',
        },
      },
      {
        path: '/profile/transaction-password',
        element: TransactionPasswordPage,
        requireAuth: true,
        meta: {
          title: 'Transaction Password',
          description: 'Set transaction password',
        },
      },
      {
        path: '/profile/biometric-auth',
        element: BiometricAuthPage,
        requireAuth: true,
        meta: {
          title: 'Biometric Authentication',
          description: 'Manage biometric login',
        },
      },
    ],
  },
  {
    name: 'info',
    basePath: '/info',
    routes: [
      {
        path: '/info/support',
        element: SupportPage,
        meta: {
          title: 'Support',
          description: 'Get help and support',
        },
      },
      {
        path: '/info/privacy',
        element: PrivacyPolicyPage,
        meta: {
          title: 'Privacy Policy',
          description: 'Our privacy policy',
        },
      },
      {
        path: '/info/terms',
        element: TermsOfServicePage,
        meta: {
          title: 'Terms of Service',
          description: 'Terms and conditions',
        },
      },
      {
        path: '/info/about-us',
        element: AboutUsPage,
        meta: {
          title: 'About Us',
          description: 'Learn about our company',
        },
      },
    ],
  },
  {
    name: 'auth',
    basePath: '/auth',
    routes: [
      {
        path: '/auth/signin',
        element: SignInPage,
        meta: {
          title: 'Sign In',
          description: 'Sign in to your account',
        },
      },
      {
        path: '/auth/signup',
        element: SignUpPage,
        meta: {
          title: 'Sign Up',
          description: 'Create a new account',
        },
      },
      {
        path: '/auth/forgot-password',
        element: ForgotPasswordPage,
        meta: {
          title: 'Forgot Password',
          description: 'Reset your password',
        },
      },
      {
        path: '/auth/callback',
        element: AuthCallbackPage,
        meta: {
          title: 'Completing Sign In',
          description: 'Processing authentication',
        },
      },
    ],
  },
];

// Flatten all routes
export const allRoutes: RouteConfig[] = routeGroups.flatMap(
  (group) => group.routes
);

// Route utilities
export const getRouteByPath = (
  path: string
): RouteConfig | undefined => {
  return allRoutes.find((route) => route.path === path);
};

export const getTabFromPath = (pathname: string): string => {
  if (pathname === '/' || pathname.startsWith('/explore'))
    return 'explore';
  if (pathname.startsWith('/messages')) return 'messages';
  if (pathname.startsWith('/create')) return 'create';
  if (pathname.startsWith('/orders')) return 'orders';
  if (pathname.startsWith('/profile')) return 'profile';
  return 'explore';
};

export const shouldShowTabNavigation = (
  pathname: string
): boolean => {
  const route = getRouteByPath(pathname);
  if (route?.showTabNavigation !== undefined) {
    return route.showTabNavigation;
  }

  // Default logic: show tab navigation only on main tab routes
  return [
    '/',
    '/messages',
    '/create',
    '/orders',
    '/profile',
  ].includes(pathname);
};

export const getPageTitle = (pathname: string): string => {
  const route = getRouteByPath(pathname);
  return route?.meta?.title || 'ProxyShop';
};
