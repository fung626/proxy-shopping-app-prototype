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

const SimpleAppContent = React.memo(function SimpleAppContent() {
  const { theme } = useTheme();
  
  // Core app state with simplified management
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [pageType, setPageType] = useState<PageType | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('explore');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [inChatView, setInChatView] = useState(false);

  // Emergency reset for timeout protection
  const emergencyReset = useCallback(() => {
    console.warn('Emergency reset triggered');
    setCurrentPage(null);
    setPageType(null);
    setSelectedRequest(null);
    setSelectedOffer(null);
    setSelectedCategory(null);
    setShowAuth(false);
  }, []);

  // Simple timeout protection
  React.useEffect(() => {
    if (currentPage && pageType) {
      const timeoutId = setTimeout(() => {
        console.warn(`Page timeout: ${pageType}/${currentPage}`);
        emergencyReset();
      }, 3000); // Very short timeout
      
      return () => clearTimeout(timeoutId);
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
      setSelectedOffer(offer);
      setPageType('order');
      setCurrentPage('offer-details');
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

  // Fallback component
  const FallbackComponent = () => (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">We're having trouble loading this page.</p>
        <button
          onClick={emergencyReset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );

  // Render active page with protection
  if (currentPage && pageType) {
    return (
      <ErrorBoundary fallback={<FallbackComponent />}>
        <React.Suspense fallback={<QuickLoader />}>
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
          setSelectedOffer(offer);
          setPageType('order');
          setCurrentPage('offer-details');
        }}
      />
      <Toaster position="top-center" />
    </div>
  );
});

export default function SimpleApp() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <SimpleAppContent />
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}