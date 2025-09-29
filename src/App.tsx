import React, { useState, useCallback } from 'react';
import { ThemeProvider, useTheme } from './store/ThemeContext';
import { LanguageProvider } from './store/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppRouter } from './components/AppRouter';
import { AuthManager } from './components/AuthManager';
import { PageManager } from './components/PageManager';
import { QuickLoader } from './components/QuickLoader';
import { Toaster } from './components/ui/sonner';
import { User, AppTab, PageType } from './types';

const AppContent = React.memo(function AppContent() {
  const { theme } = useTheme();
  
  // Core app state with simplified management
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [pageType, setPageType] = useState<PageType | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<AppTab>('explore');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [inChatView, setInChatView] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [pageLoadStartTime, setPageLoadStartTime] = useState<number | null>(null);

  // Global safety timeouts - BUT ONLY for pages that DON'T use direct bypass
  React.useEffect(() => {
    if (currentPage && pageType) {
      const startTime = Date.now();
      setPageLoadStartTime(startTime);
      
      // List of pages that use direct bypasses - NO timeout needed for these
      const directBypassPages = [
        'offer-details', 'view-offers', 'category', 'wishlist', 'request-details', 
        'explore-request-details', 'all-agents', 'all-offers', 'all-requests', 'search',
        'email', 'phone', 'identity', 'business', 'support', 'privacy', 'terms', 'about-us',
        'two-factor-auth', 'change-password', 'delete-account', 'edit-account', 
        'bank-information', 'credit-cards', 'add-credit-card', 'transaction-password', 
        'biometric-auth', 'arbitration-centre'
      ];
      
      // Skip global timeouts for direct bypass pages - they handle their own errors
      if (directBypassPages.includes(currentPage)) {
        console.log(`✅ Global timeout SKIPPED for direct bypass page: ${pageType}/${currentPage}`);
        return;
      }
      
      console.warn(`⚠️ Global timeout ACTIVE for PageManager page: ${pageType}/${currentPage}`);
      
      // First timeout - give a warning
      const warningTimeout = setTimeout(() => {
        console.warn(`⚠️ PageManager page ${pageType}/${currentPage} taking longer than expected (5s)`);
      }, 5000);
      
      // Second timeout - serious warning
      const criticalTimeout = setTimeout(() => {
        console.error(`🚨 CRITICAL: PageManager page ${pageType}/${currentPage} exceeded 8s - preparing emergency reset`);
      }, 8000);
      
      // Final timeout - force reset
      const globalTimeout = setTimeout(() => {
        const elapsed = Date.now() - startTime;
        console.error(`🚨 GLOBAL SAFETY TIMEOUT: PageManager page ${pageType}/${currentPage} exceeded 10s limit (${elapsed}ms)`);
        console.error('FORCING EMERGENCY RESET TO PREVENT INFINITE LOADING');
        emergencyReset();
      }, 10000); // 10 second absolute maximum
      
      return () => {
        clearTimeout(warningTimeout);
        clearTimeout(criticalTimeout);
        clearTimeout(globalTimeout);
        setPageLoadStartTime(null);
      };
    }
  }, [currentPage, pageType]);

  // Additional safety: reset if stuck on same page for too long - BUT ONLY for PageManager pages
  React.useEffect(() => {
    if (currentPage && pageType) {
      // List of pages that use direct bypasses - NO stuck detection needed
      const directBypassPages = [
        'offer-details', 'view-offers', 'category', 'wishlist', 'request-details', 
        'explore-request-details', 'all-agents', 'all-offers', 'all-requests', 'search',
        'email', 'phone', 'identity', 'business', 'support', 'privacy', 'terms', 'about-us',
        'two-factor-auth', 'change-password', 'delete-account', 'edit-account', 
        'bank-information', 'credit-cards', 'add-credit-card', 'transaction-password', 
        'biometric-auth', 'arbitration-centre'
      ];
      
      // Skip stuck detection for direct bypass pages
      if (directBypassPages.includes(currentPage)) {
        return;
      }
      
      const stuckTimeout = setTimeout(() => {
        console.error(`🚨 STUCK PAGE DETECTION: PageManager page ${pageType}/${currentPage} has been active for 30s`);
        console.error('User may be stuck - providing emergency reset option');
        
        // Show a toast or overlay option for the user to manually reset
        const shouldReset = window.confirm(
          `The page "${currentPage}" seems to be taking a long time to load. Would you like to go back to the home screen?`
        );
        
        if (shouldReset) {
          emergencyReset();
        }
      }, 30000); // 30 second check for stuck pages
      
      return () => clearTimeout(stuckTimeout);
    }
  }, [currentPage, pageType]);

  // Enhanced emergency reset with better logging and cleanup
  const emergencyReset = useCallback(() => {
    console.warn('🚨 EMERGENCY RESET TRIGGERED');
    console.warn('Resetting all page state to prevent infinite loading...');
    
    // Clear all page state immediately
    setCurrentPage(null);
    setPageType(null);
    setSelectedRequest(null);
    setSelectedOffer(null);
    setSelectedCategory(null);
    setShowAuth(false);
    setInChatView(false);
    setSelectedAgentId(null);
    
    // Force active tab back to explore if not already there
    if (activeTab !== 'explore') {
      console.warn('Forcing tab back to explore to ensure stable state');
      setActiveTab('explore');
    }
    
    console.warn('✅ Emergency reset completed - app should be stable now');
  }, [activeTab]);

  // Enhanced timeout protection with shorter timeouts and better error handling
  React.useEffect(() => {
    if (currentPage && pageType) {
      console.log(`Loading page: ${pageType}/${currentPage} at ${new Date().toISOString()}`);
      
      // List of pages that use direct bypasses - no timeout needed
      const directBypassPages = [
        'offer-details', 'view-offers', 'category', 'wishlist', 'request-details', 
        'explore-request-details', 'all-agents', 'all-offers', 'all-requests', 'search',
        'email', 'phone', 'identity', 'business', 'support', 'privacy', 'terms', 'about-us',
        'two-factor-auth', 'change-password', 'delete-account', 'edit-account', 
        'bank-information', 'credit-cards', 'add-credit-card', 'transaction-password', 
        'biometric-auth', 'arbitration-centre'
      ];
      
      if (directBypassPages.includes(currentPage)) {
        console.log(`✓ Direct bypass page: ${currentPage} - no timeout needed`);
        return;
      }
      
      // Much shorter timeout for remaining pages to prevent hanging
      const timeout = 2000; // Reduced to 2s to prevent long hangs
      
      console.warn(`⚠️ Using PageManager for ${pageType}/${currentPage} - applying ${timeout}ms timeout`);
      
      const timeoutId = setTimeout(() => {
        console.error(`❌ CRITICAL TIMEOUT: Page ${pageType}/${currentPage} failed to load after ${timeout}ms`);
        console.error('Forcing emergency reset to prevent infinite loading...');
        console.error('State snapshot:', { 
          currentPage, 
          pageType, 
          selectedRequest: !!selectedRequest, 
          selectedOffer: !!selectedOffer, 
          selectedCategory: !!selectedCategory,
          timestamp: new Date().toISOString()
        });
        
        // Force reset immediately
        emergencyReset();
      }, timeout);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [currentPage, pageType, emergencyReset]);

  // Basic handlers without complex memoization
  const handleTabChange = (tab: AppTab) => setActiveTab(tab);
  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
  };
  const handleShowAuth = () => setShowAuth(true);
  const handleCloseAuth = () => setShowAuth(false);
  const handleLogout = () => {
    setUser(null);
    emergencyReset();
  };

  const navigateToPage = (type: PageType, page: string) => {
    setPageType(type);
    setCurrentPage(page);
  };

  const handleBackFromPage = () => {
    setCurrentPage(null);
    setPageType(null);
    setSelectedRequest(null);
    setSelectedOffer(null);
    setSelectedCategory(null);
  };

  // Favorites handlers
  const handleToggleFavorite = (itemId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const handleRemoveFromWishlist = (itemId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      newFavorites.delete(itemId);
      return newFavorites;
    });
  };

  const handleNavigateToWishlist = () => {
    setPageType('explore');
    setCurrentPage('wishlist');
  };

  // Simplified page manager props
  const pageManagerProps = {
    selectedRequest,
    selectedOffer,
    selectedCategory,
    user,
    onBack: handleBackFromPage,
    onContactAgent: (agentId: string) => {
      setActiveTab('messages');
      setSelectedAgentId(agentId);
      setInChatView(true);
      setCurrentPage(null);
      setPageType(null);
    },
    onContactClient: (clientId?: string) => {
      setActiveTab('messages');
      setSelectedAgentId(clientId || 'client_default');
      setInChatView(true);
      setCurrentPage(null);
      setPageType(null);
    },
    onViewOffers: (request: any) => {
      setSelectedRequest(request);
      setPageType('order');
      setCurrentPage('view-offers');
    },
    onCancelRequest: handleBackFromPage,
    onShareRequest: () => console.log('Share request'),
    onViewFeedback: (request: any) => {
      setSelectedRequest(request);
      setPageType('order');
      setCurrentPage('view-feedback');
    },
    onLeaveFeedback: (request: any) => {
      setSelectedRequest(request);
      setPageType('order');
      setCurrentPage('feedback');
    },
    onUpdateStatus: (status: string, notes: string, trackingNumber?: string) => 
      console.log('Update status:', status, notes, trackingNumber),
    onAcceptOffer: (offer: any) => {
      setSelectedOffer(offer);
      setPageType('order');
      setCurrentPage('payment');
    },
    onPaymentSuccess: () => {
      setCurrentPage(null);
      setPageType(null);
      setSelectedRequest(null);
      setSelectedOffer(null);
    },
    onPaymentBack: () => {
      setCurrentPage('view-offers');
      setSelectedOffer(null);
    },
    onSubmitFeedback: () => {
      setTimeout(() => {
        setCurrentPage(null);
        setPageType(null);
        setSelectedRequest(null);
      }, 1000);
    },
    getMockFeedback: (requestId: string) => {
      const feedbackData: { [key: string]: any[] } = {
        'REQ-003': [{
          id: 'fb-001',
          rating: 5,
          comment: 'Excellent service! Marie was very professional and found exactly what I was looking for.',
          recipientType: 'agent' as const,
          recipientName: 'Marie Dubois',
          authorName: 'Sarah Chen',
          authorType: 'client' as const,
          createdDate: '2024-01-20'
        }]
      };
      return feedbackData[requestId] || [];
    },
    onNavigateToArbitration: () => navigateToPage('arbitration', 'arbitration-centre'),
    onNavigateToAddCard: () => navigateToPage('account', 'add-credit-card'),
    onComplete: () => {
      if (user && currentPage) {
        setUser({
          ...user,
          verificationStatus: {
            ...user.verificationStatus,
            [currentPage]: true
          }
        });
      }
      handleBackFromPage();
    },
    onSubmitArbitration: emergencyReset,
    onSubmitOffer: (offer: any) => {
      console.log('Offer submitted:', offer);
      setTimeout(emergencyReset, 1000);
    },
    onNavigateToMakeOffer: (request: any) => {
      setSelectedRequest(request);
      setPageType('order');
      setCurrentPage('make-offer');
    },
    onNavigateToOfferDetails: (offer: any) => {
      console.log('pageManagerProps: Navigating to offer details with offer:', offer);
      setSelectedOffer(offer);
      setPageType('order');
      setCurrentPage('offer-details');
    },
    onNavigateToExploreRequestDetails: (request: any) => {
      setSelectedRequest(request);
      setPageType('order');
      setCurrentPage('explore-request-details');
    },
    onSave: (data: any) => {
      if (currentPage === 'bank-information' && user) {
        setUser({
          ...user,
          bankInformation: data,
          verificationStatus: { ...user.verificationStatus, bank: true }
        });
      } else if (currentPage === 'credit-cards' && user) {
        setUser({ ...user, creditCards: data });
      } else if (currentPage === 'add-credit-card' && user) {
        const existingCards = user.creditCards || [];
        if (data.isDefault) {
          existingCards.forEach(card => card.isDefault = false);
        }
        setUser({ ...user, creditCards: [...existingCards, data] });
        setCurrentPage('credit-cards');
        return;
      } else if (user) {
        setUser(data);
      }
      handleBackFromPage();
    }
  };

  // Enhanced fallback component with more debugging info
  const FallbackComponent = ({ error }: { error?: Error }) => (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-2">We're having trouble loading this page.</p>
        {error && (
          <details className="text-xs text-muted-foreground mb-4 text-left">
            <summary className="cursor-pointer mb-2">Error Details</summary>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        {currentPage && pageType && (
          <p className="text-xs text-muted-foreground mb-4">
            Failed page: {pageType}/{currentPage}
            {pageLoadStartTime && (
              <span className="block">
                Load time: {Date.now() - pageLoadStartTime}ms
              </span>
            )}
          </p>
        )}
        <div className="flex gap-2 justify-center">
          <button
            onClick={emergencyReset}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Go Back to Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80"
          >
            Reload App
          </button>
        </div>
      </div>
    </div>
  );

  // DIRECT BYPASS FOR WISHLIST PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'wishlist' && pageType === 'explore') {
    console.log('DIRECT BYPASS: Rendering wishlist page directly to avoid timeout');
    
    // Import WishlistsPage dynamically
    const WishlistsPageComponent = React.lazy(() => 
      import('./pages/WishlistsPage').then(module => ({
        default: module.WishlistsPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <WishlistsPageComponent
            onBack={handleBackFromPage}
            onNavigateToOfferDetails={(offer: any) => {
              setSelectedOffer(offer);
              setPageType('order');
              setCurrentPage('offer-details');
            }}
            onNavigateToRequestDetails={(request: any) => {
              setSelectedRequest(request);
              setPageType('order');
              setCurrentPage('explore-request-details');
            }}
            onContactAgent={pageManagerProps.onContactAgent}
            favoriteItems={favorites}
            onRemoveFromWishlist={handleRemoveFromWishlist}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR SEARCH PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'search' && pageType === 'explore') {
    console.log('DIRECT BYPASS: Rendering search page directly to avoid timeout');
    
    const SearchPageComponent = React.lazy(() => 
      import('./pages/SearchPage').then(module => ({
        default: module.SearchPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <SearchPageComponent
            onBack={handleBackFromPage}
            onNavigateToRequestDetails={pageManagerProps.onNavigateToExploreRequestDetails}
            onNavigateToOfferDetails={pageManagerProps.onNavigateToOfferDetails}
            onContactAgent={pageManagerProps.onContactAgent}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            initialQuery={searchQuery}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR OFFER DETAILS - AVOID TIMEOUT AND SUSPENSE ISSUES
  if (currentPage === 'offer-details' && pageType === 'order' && selectedOffer) {
    console.log('DIRECT BYPASS: Rendering offer-details directly to avoid timeout');
    
    // Import the OfferDetailsPage dynamically
    const OfferDetailsPageComponent = React.lazy(() => 
      import('./pages/OfferDetailsPage').then(module => ({
        default: module.OfferDetailsPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <OfferDetailsPageComponent
            offer={selectedOffer}
            onBack={handleBackFromPage}
            onContactAgent={pageManagerProps.onContactAgent}
            onCreateOrder={pageManagerProps.onAcceptOffer}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR VIEW OFFERS - AVOID TIMEOUT ISSUES
  if (currentPage === 'view-offers' && pageType === 'order') {
    console.log('DIRECT BYPASS: Rendering view-offers directly to avoid timeout');
    
    // Import ViewOffersPage dynamically
    const ViewOffersPageComponent = React.lazy(() => 
      import('./pages/ViewOffersPage').then(module => ({
        default: module.ViewOffersPage
      }))
    );
    
    // Create mock data if selectedRequest is null
    const requestTitle = selectedRequest?.title || 'Proxy Shopping Request';
    const mockOffers = [
      {
        id: '1',
        agentName: 'Marie Dubois',
        rating: 4.9,
        agentRating: 4.9,
        agentReviews: 156,
        totalOrders: 156,
        completedOrders: 152,
        location: 'Paris, France',
        estimatedTime: '5-7 days',
        estimatedDelivery: '5-7 days',
        estimatedCost: 'USD 45.00',
        price: 45.00,
        serviceFee: 5.00,
        totalCost: 'USD 50.00',
        totalAmount: 50.00,
        currency: 'USD',
        description: 'Luxury shopping specialist with 5+ years experience.',
        specialties: ['Luxury Goods', 'Fashion', 'Authenticity Verification'],
        isVerified: true,
        responseTime: '2 hours'
      },
      {
        id: '2',
        agentName: 'Hiroshi Tanaka',
        rating: 4.7,
        agentRating: 4.7,
        agentReviews: 89,
        totalOrders: 89,
        completedOrders: 84,
        location: 'Tokyo, Japan',
        estimatedTime: '3-5 days',
        estimatedDelivery: '3-5 days',
        estimatedCost: 'USD 38.00',
        price: 38.00,
        serviceFee: 4.00,
        totalCost: 'USD 42.00',
        totalAmount: 42.00,
        currency: 'USD',
        description: 'Expert in Japanese products and electronics.',
        specialties: ['Electronics', 'Fashion', 'Collectibles'],
        isVerified: true,
        responseTime: '1 hour'
      }
    ];
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <ViewOffersPageComponent
            requestTitle={requestTitle}
            offers={mockOffers}
            onBack={handleBackFromPage}
            onContactAgent={pageManagerProps.onContactAgent}
            onAcceptOffer={pageManagerProps.onAcceptOffer}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR CATEGORY PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'category' && pageType === 'explore' && selectedCategory) {
    console.log('DIRECT BYPASS: Rendering category page directly to avoid timeout');
    
    // Import CategoryPage dynamically
    const CategoryPageComponent = React.lazy(() => 
      import('./pages/CategoryPage').then(module => ({
        default: module.CategoryPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <CategoryPageComponent
            category={selectedCategory}
            onBack={handleBackFromPage}
            onNavigateToRequestDetails={pageManagerProps.onNavigateToExploreRequestDetails}
            onContactAgent={pageManagerProps.onContactAgent}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR EMAIL VERIFICATION - AVOID TIMEOUT ISSUES
  if (currentPage === 'email' && pageType === 'verification') {
    console.log('DIRECT BYPASS: Rendering email verification directly to avoid timeout');
    
    const EmailVerificationPageComponent = React.lazy(() => 
      import('./pages/EmailVerificationPage').then(module => ({
        default: module.EmailVerificationPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <EmailVerificationPageComponent
            user={user}
            onBack={handleBackFromPage}
            onComplete={pageManagerProps.onComplete}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR PHONE VERIFICATION - AVOID TIMEOUT ISSUES
  if (currentPage === 'phone' && pageType === 'verification') {
    console.log('DIRECT BYPASS: Rendering phone verification directly to avoid timeout');
    
    const PhoneVerificationPageComponent = React.lazy(() => 
      import('./pages/PhoneVerificationPage').then(module => ({
        default: module.PhoneVerificationPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <PhoneVerificationPageComponent
            user={user}
            onBack={handleBackFromPage}
            onComplete={pageManagerProps.onComplete}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR IDENTITY VERIFICATION - AVOID TIMEOUT ISSUES
  if (currentPage === 'identity' && pageType === 'verification') {
    console.log('DIRECT BYPASS: Rendering identity verification directly to avoid timeout');
    
    const IdentityVerificationPageComponent = React.lazy(() => 
      import('./pages/IdentityVerificationPage').then(module => ({
        default: module.IdentityVerificationPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <IdentityVerificationPageComponent
            user={user}
            onBack={handleBackFromPage}
            onComplete={pageManagerProps.onComplete}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR BUSINESS VERIFICATION - AVOID TIMEOUT ISSUES
  if (currentPage === 'business' && pageType === 'verification') {
    console.log('DIRECT BYPASS: Rendering business verification directly to avoid timeout');
    
    const BusinessVerificationPageComponent = React.lazy(() => 
      import('./pages/BusinessVerificationPage').then(module => ({
        default: module.BusinessVerificationPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <BusinessVerificationPageComponent
            user={user}
            onBack={handleBackFromPage}
            onComplete={pageManagerProps.onComplete}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR SUPPORT PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'support' && pageType === 'info') {
    console.log('DIRECT BYPASS: Rendering support page directly to avoid timeout');
    
    const SupportPageComponent = React.lazy(() => 
      import('./pages/SupportPage').then(module => ({
        default: module.SupportPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <SupportPageComponent onBack={handleBackFromPage} />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR PRIVACY POLICY PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'privacy' && pageType === 'info') {
    console.log('DIRECT BYPASS: Rendering privacy policy page directly to avoid timeout');
    
    const PrivacyPolicyPageComponent = React.lazy(() => 
      import('./pages/PrivacyPolicyPage').then(module => ({
        default: module.PrivacyPolicyPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <PrivacyPolicyPageComponent onBack={handleBackFromPage} />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR TERMS OF SERVICE PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'terms' && pageType === 'info') {
    console.log('DIRECT BYPASS: Rendering terms of service page directly to avoid timeout');
    
    const TermsOfServicePageComponent = React.lazy(() => 
      import('./pages/TermsOfServicePage').then(module => ({
        default: module.TermsOfServicePage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <TermsOfServicePageComponent onBack={handleBackFromPage} />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR ABOUT US PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'about-us' && pageType === 'info') {
    console.log('DIRECT BYPASS: Rendering about us page directly to avoid timeout');
    
    const AboutUsPageComponent = React.lazy(() => 
      import('./pages/AboutUsPage').then(module => ({
        default: module.AboutUsPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <AboutUsPageComponent onBack={handleBackFromPage} />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR TWO-FACTOR AUTH PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'two-factor-auth' && pageType === 'security') {
    console.log('DIRECT BYPASS: Rendering two-factor auth page directly to avoid timeout');
    
    const TwoFactorAuthPageComponent = React.lazy(() => 
      import('./pages/TwoFactorAuthPage').then(module => ({
        default: module.TwoFactorAuthPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <TwoFactorAuthPageComponent 
            user={user}
            onBack={handleBackFromPage}
            onSave={pageManagerProps.onSave}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR CHANGE PASSWORD PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'change-password' && pageType === 'security') {
    console.log('DIRECT BYPASS: Rendering change password page directly to avoid timeout');
    
    const ChangePasswordPageComponent = React.lazy(() => 
      import('./pages/ChangePasswordPage').then(module => ({
        default: module.ChangePasswordPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <ChangePasswordPageComponent onBack={handleBackFromPage} />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR DELETE ACCOUNT PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'delete-account' && pageType === 'security') {
    console.log('DIRECT BYPASS: Rendering delete account page directly to avoid timeout');
    
    const DeleteAccountPageComponent = React.lazy(() => 
      import('./pages/DeleteAccountPage').then(module => ({
        default: module.DeleteAccountPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <DeleteAccountPageComponent onBack={handleBackFromPage} />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR EDIT ACCOUNT PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'edit-account' && pageType === 'account') {
    console.log('DIRECT BYPASS: Rendering edit account page directly to avoid timeout');
    
    const EditAccountPageComponent = React.lazy(() => 
      import('./pages/EditAccountPage').then(module => ({
        default: module.EditAccountPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <EditAccountPageComponent 
            user={user}
            onBack={handleBackFromPage}
            onSave={pageManagerProps.onSave}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR BANK INFORMATION PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'bank-information' && pageType === 'account') {
    console.log('DIRECT BYPASS: Rendering bank information page directly to avoid timeout');
    
    const BankInformationPageComponent = React.lazy(() => 
      import('./pages/BankInformationPage').then(module => ({
        default: module.BankInformationPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <BankInformationPageComponent 
            user={user}
            onBack={handleBackFromPage}
            onSave={pageManagerProps.onSave}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR CREDIT CARDS PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'credit-cards' && pageType === 'account') {
    console.log('DIRECT BYPASS: Rendering credit cards page directly to avoid timeout');
    
    const CreditCardsPageComponent = React.lazy(() => 
      import('./pages/CreditCardsPage').then(module => ({
        default: module.CreditCardsPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <CreditCardsPageComponent 
            user={user}
            onBack={handleBackFromPage}
            onSave={pageManagerProps.onSave}
            onNavigateToAddCard={pageManagerProps.onNavigateToAddCard}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR ADD CREDIT CARD PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'add-credit-card' && pageType === 'account') {
    console.log('DIRECT BYPASS: Rendering add credit card page directly to avoid timeout');
    
    const AddCreditCardPageComponent = React.lazy(() => 
      import('./pages/AddCreditCardPage').then(module => ({
        default: module.AddCreditCardPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <AddCreditCardPageComponent 
            onBack={handleBackFromPage}
            onSave={pageManagerProps.onSave}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR TRANSACTION PASSWORD PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'transaction-password' && pageType === 'account') {
    console.log('DIRECT BYPASS: Rendering transaction password page directly to avoid timeout');
    
    const TransactionPasswordPageComponent = React.lazy(() => 
      import('./pages/TransactionPasswordPage').then(module => ({
        default: module.TransactionPasswordPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <TransactionPasswordPageComponent 
            user={user}
            onBack={handleBackFromPage}
            onSave={pageManagerProps.onSave}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR BIOMETRIC AUTH PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'biometric-auth' && pageType === 'account') {
    console.log('✅ DIRECT BYPASS: Rendering biometric auth page directly (NO TIMEOUT WARNINGS)');
    
    const BiometricAuthPageComponent = React.lazy(() => 
      import('./pages/BiometricAuthPage').then(module => ({
        default: module.BiometricAuthPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <BiometricAuthPageComponent 
            user={user}
            onBack={handleBackFromPage}
            onSave={pageManagerProps.onSave}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR REQUEST DETAILS PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'request-details' && pageType === 'order' && selectedRequest) {
    console.log('DIRECT BYPASS: Rendering request-details directly to avoid timeout');
    
    const RequestDetailsPageComponent = React.lazy(() => 
      import('./pages/RequestDetailsPage').then(module => ({
        default: module.RequestDetailsPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <RequestDetailsPageComponent
            request={selectedRequest}
            user={user}
            onBack={handleBackFromPage}
            onContactAgent={pageManagerProps.onContactAgent}
            onContactClient={pageManagerProps.onContactClient}
            onViewOffers={pageManagerProps.onViewOffers}
            onCancelRequest={pageManagerProps.onCancelRequest}
            onShareRequest={pageManagerProps.onShareRequest}
            onViewFeedback={pageManagerProps.onViewFeedback}
            onLeaveFeedback={pageManagerProps.onLeaveFeedback}
            onUpdateStatus={pageManagerProps.onUpdateStatus}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR ALL AGENTS PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'all-agents' && pageType === 'explore') {
    console.log('DIRECT BYPASS: Rendering all-agents page directly to avoid timeout');
    
    const AllAgentsPageComponent = React.lazy(() => 
      import('./pages/AllAgentsPage').then(module => ({
        default: module.AllAgentsPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <AllAgentsPageComponent
            onBack={handleBackFromPage}
            onContactAgent={pageManagerProps.onContactAgent}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR ALL OFFERS PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'all-offers' && pageType === 'explore') {
    console.log('DIRECT BYPASS: Rendering all-offers page directly to avoid timeout');
    
    const AllOffersPageComponent = React.lazy(() => 
      import('./pages/AllOffersPage').then(module => ({
        default: module.AllOffersPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <AllOffersPageComponent
            onBack={handleBackFromPage}
            onNavigateToOfferDetails={pageManagerProps.onNavigateToOfferDetails}
            onContactAgent={pageManagerProps.onContactAgent}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR ALL REQUESTS PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'all-requests' && pageType === 'explore') {
    console.log('DIRECT BYPASS: Rendering all-requests page directly to avoid timeout');
    
    const AllRequestsPageComponent = React.lazy(() => 
      import('./pages/AllRequestsPage').then(module => ({
        default: module.AllRequestsPage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <AllRequestsPageComponent
            onBack={handleBackFromPage}
            onNavigateToRequestDetails={pageManagerProps.onNavigateToExploreRequestDetails}
            onNavigateToMakeOffer={pageManagerProps.onNavigateToMakeOffer}
            onContactAgent={pageManagerProps.onContactAgent}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR EXPLORE REQUEST DETAILS PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'explore-request-details' && pageType === 'order' && selectedRequest) {
    console.log('DIRECT BYPASS: Rendering explore-request-details directly to avoid timeout');
    
    const RequestDetailsExploreViewComponent = React.lazy(() => 
      import('./pages/RequestDetailsExploreView').then(module => ({
        default: module.RequestDetailsExploreView
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <RequestDetailsExploreViewComponent
            request={selectedRequest}
            onBack={handleBackFromPage}
            onNavigateToMakeOffer={pageManagerProps.onNavigateToMakeOffer}
            onContactAgent={pageManagerProps.onContactAgent}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // DIRECT BYPASS FOR ARBITRATION CENTRE PAGE - AVOID TIMEOUT ISSUES
  if (currentPage === 'arbitration-centre' && pageType === 'arbitration') {
    console.log('DIRECT BYPASS: Rendering arbitration centre page directly to avoid timeout');
    
    const ArbitrationCentrePageComponent = React.lazy(() => 
      import('./pages/ArbitrationCentrePage').then(module => ({
        default: module.ArbitrationCentrePage
      }))
    );
    
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
          <ArbitrationCentrePageComponent
            onBack={handleBackFromPage}
            onSubmitArbitration={pageManagerProps.onSubmitArbitration}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // Render remaining pages with enhanced error protection
  if (currentPage && pageType) {
    console.warn(`⚠️ FALLBACK: Using PageManager for ${pageType}/${currentPage}`);
    console.warn('This page should ideally have a direct bypass to prevent timeout issues');
    
    // Additional safety check - if we've been here too long, reset
    const renderStartTime = Date.now();
    
    return (
      <ErrorBoundary 
        fallback={<FallbackComponent />}
        onError={(error) => {
          console.error('PageManager Error Boundary triggered:', error);
          console.error('Forcing emergency reset due to PageManager error');
          setTimeout(emergencyReset, 100);
        }}
      >
        <React.Suspense 
          fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="text-center">
                <QuickLoader />
                <p className="text-sm text-muted-foreground mt-4">
                  Loading {pageType}/{currentPage}...
                </p>
                <button
                  onClick={emergencyReset}
                  className="mt-4 px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                >
                  Cancel Loading
                </button>
              </div>
            </div>
          }
        >
          <PageManager
            currentPage={currentPage}
            pageType={pageType}
            {...pageManagerProps}
          />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  if (showAuth) {
    return (
      <AuthManager
        onAuthSuccess={handleAuthSuccess}
        onClose={handleCloseAuth}
        onNavigateToTermsOfService={() => navigateToPage('info', 'terms')}
      />
    );
  }

  return (
    <div className={`h-screen flex flex-col bg-background text-foreground transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <AppRouter
        user={user}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        selectedAgentId={selectedAgentId}
        inChatView={inChatView}
        onChatViewChange={setInChatView}
        onShowAuth={handleShowAuth}
        onLogout={handleLogout}
        onNavigateToRequestDetails={(request: any) => {
          setSelectedRequest(request);
          setPageType('order');
          setCurrentPage('request-details');
        }}
        onNavigateToExploreRequestDetails={(request: any) => {
          setSelectedRequest(request);
          setPageType('order');
          setCurrentPage('explore-request-details');
        }}
        onNavigateToViewOffers={(request: any) => {
          setSelectedRequest(request);
          setPageType('order');
          setCurrentPage('view-offers');
        }}
        onNavigateToFeedback={(request: any) => {
          setSelectedRequest(request);
          setPageType('order');
          setCurrentPage('feedback');
        }}
        onNavigateToViewFeedback={(request: any) => {
          setSelectedRequest(request);
          setPageType('order');
          setCurrentPage('view-feedback');
        }}
        onContactAgent={(agentId: string) => {
          setActiveTab('messages');
          setSelectedAgentId(agentId);
          setInChatView(true);
          setCurrentPage(null);
          setPageType(null);
        }}
        onNavigateToPrivacyPolicy={() => navigateToPage('info', 'privacy')}
        onNavigateToTermsOfService={() => navigateToPage('info', 'terms')}
        onNavigateToSupport={() => navigateToPage('info', 'support')}
        onNavigateToAboutUs={() => navigateToPage('info', 'about-us')}
        onNavigateToEmailVerification={() => navigateToPage('verification', 'email')}
        onNavigateToPhoneVerification={() => navigateToPage('verification', 'phone')}
        onNavigateToIdentityVerification={() => navigateToPage('verification', 'identity')}
        onNavigateToBusinessVerification={() => navigateToPage('verification', 'business')}
        onNavigateToChangePassword={() => navigateToPage('security', 'change-password')}
        onNavigateToTwoFactorAuth={() => navigateToPage('security', 'two-factor-auth')}
        onNavigateToEditAccount={() => navigateToPage('account', 'edit-account')}
        onNavigateToDeleteAccount={() => navigateToPage('security', 'delete-account')}
        onNavigateToBankInformation={() => navigateToPage('account', 'bank-information')}
        onNavigateToCreditCards={() => navigateToPage('account', 'credit-cards')}
        onNavigateToTransactionPassword={() => navigateToPage('account', 'transaction-password')}
        onNavigateToBiometricAuth={() => navigateToPage('account', 'biometric-auth')}
        onViewAllRequests={() => {
          setPageType('explore');
          setCurrentPage('all-requests');
        }}
        onViewAllOffers={() => {
          setPageType('explore');
          setCurrentPage('all-offers');
        }}
        onViewAllAgents={() => {
          setPageType('explore');
          setCurrentPage('all-agents');
        }}
        onNavigateToCategory={(category: string) => {
          setSelectedCategory(category);
          setPageType('explore');
          setCurrentPage('category');
        }}
        onNavigateToOfferDetails={(offer: any) => {
          console.log('Navigating to offer details with offer:', offer);
          setSelectedOffer(offer);
          setPageType('order');
          setCurrentPage('offer-details');
        }}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onNavigateToWishlist={handleNavigateToWishlist}
        onNavigateToSearch={(query?: string) => {
          setSearchQuery(query || '');
          setPageType('explore');
          setCurrentPage('search');
        }}
      />
      <Toaster position="top-center" />
    </div>
  );
});

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}