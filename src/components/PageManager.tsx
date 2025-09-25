import { RequestDetailsPage } from '../pages/RequestDetailsPage';
import { RequestDetailsExploreView } from '../pages/RequestDetailsExploreView';
import { ViewOffersPage } from '../pages/ViewOffersPage';
import { MakeOfferPage } from '../pages/MakeOfferPage';
import { PaymentPage } from '../pages/PaymentPage';
import { FeedbackPage } from '../pages/FeedbackPage';
import { ViewFeedbackPage } from '../pages/ViewFeedbackPage';
import { OfferDetailsPage } from '../pages/OfferDetailsPage';
import { LazyOfferDetails } from './LazyOfferDetails';
import { MinimalOfferDetails } from './MinimalOfferDetails';
import { OfferDetailsErrorBoundary } from './OfferDetailsErrorBoundary';
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage';
import { TermsOfServicePage } from '../pages/TermsOfServicePage';
import { SupportPage } from '../pages/SupportPage';
import { AboutUsPage } from '../pages/AboutUsPage';
import { EmailVerificationPage } from '../pages/EmailVerificationPage';
import { PhoneVerificationPage } from '../pages/PhoneVerificationPage';
import { IdentityVerificationPage } from '../pages/IdentityVerificationPage';
import { BusinessVerificationPage } from '../pages/BusinessVerificationPage';
import { ChangePasswordPage } from '../pages/ChangePasswordPage';
import { TwoFactorAuthPage } from '../pages/TwoFactorAuthPage';
import { DeleteAccountPage } from '../pages/DeleteAccountPage';
import { EditAccountPage } from '../pages/EditAccountPage';
import { BankInformationPage } from '../pages/BankInformationPage';
import { CreditCardsPage } from '../pages/CreditCardsPage';
import { AddCreditCardPage } from '../pages/AddCreditCardPage';
import { ArbitrationCentrePage } from '../pages/ArbitrationCentrePage';
import { AllRequestsPage } from '../pages/AllRequestsPage';
import { AllOffersPage } from '../pages/AllOffersPage';
import { AllAgentsPage } from '../pages/AllAgentsPage';
import { CategoryPage } from '../pages/CategoryPage';
import { memo, Suspense, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { User, PageType } from '../types';

interface PageManagerProps {
  currentPage: string | null;
  pageType: PageType;
  selectedRequest: any;
  selectedOffer: any;
  selectedCategory: string | null;
  user: User | null;
  onBack: () => void;
  onContactAgent: (agentId: string) => void;
  onContactClient: (clientId?: string) => void;
  onViewOffers?: (request: any) => void;
  onCancelRequest?: () => void;
  onShareRequest?: () => void;
  onViewFeedback?: (request: any) => void;
  onLeaveFeedback?: (request: any) => void;
  onUpdateStatus?: (status: string, notes?: string) => void;
  onAcceptOffer?: (offer: any) => void;
  onPaymentSuccess?: (data: any) => void;
  onPaymentBack?: () => void;
  onSubmitFeedback?: (feedback: any) => void;
  onComplete?: () => void;
  onSave?: (data: any) => void;
  onNavigateToAddCard?: () => void;
  getMockFeedback?: (requestId: string) => any[];
  onNavigateToArbitration?: () => void;
  onSubmitArbitration?: (data: any) => void;
  onSubmitOffer?: (offer: any) => void;
  onNavigateToMakeOffer?: (request: any) => void;
  onNavigateToOfferDetails?: (offer: any) => void;
}

export const PageManager = memo(function PageManager({
  currentPage,
  pageType,
  selectedRequest,
  selectedOffer,
  selectedCategory,
  user,
  onBack,
  onContactAgent,
  onContactClient,
  onViewOffers,
  onCancelRequest,
  onShareRequest,
  onViewFeedback,
  onLeaveFeedback,
  onUpdateStatus,
  onAcceptOffer,
  onPaymentSuccess,
  onPaymentBack,
  onSubmitFeedback,
  onComplete,
  onSave,
  onNavigateToAddCard,
  getMockFeedback,
  onNavigateToArbitration,
  onSubmitArbitration,
  onSubmitOffer,
  onNavigateToMakeOffer,
  onNavigateToOfferDetails
}: PageManagerProps) {
  // Add timeout protection
  useEffect(() => {
    if (currentPage && pageType) {
      console.debug(`PageManager rendering: ${pageType}/${currentPage}`);
    }
  }, [currentPage, pageType]);

  if (!currentPage) return null;

  const renderPage = () => {
    try {
      // Order pages
  if (pageType === 'order') {
    switch (currentPage) {
      case 'request-details':
        if (!selectedRequest) return null;
        return (
          <RequestDetailsPage 
            request={selectedRequest}
            onBack={onBack}
            onContactAgent={onContactAgent}
            onContactClient={onContactClient}
            onViewOffers={onViewOffers ? () => onViewOffers(selectedRequest) : undefined}
            onCancelRequest={onCancelRequest}
            onShareRequest={onShareRequest}
            onViewFeedback={onViewFeedback ? () => onViewFeedback(selectedRequest) : undefined}
            onLeaveFeedback={onLeaveFeedback ? () => onLeaveFeedback(selectedRequest) : undefined}
            onUpdateStatus={onUpdateStatus}
            onNavigateToArbitration={onNavigateToArbitration}
          />
        );
      case 'explore-request-details':
        if (!selectedRequest) return null;
        return (
          <RequestDetailsExploreView 
            request={selectedRequest}
            onBack={onBack}
            onMakeOffer={() => onNavigateToMakeOffer?.(selectedRequest)}
            onContactClient={() => onContactClient()}
            onShareRequest={onShareRequest}
          />
        );
      case 'make-offer':
        if (!selectedRequest) return null;
        return (
          <MakeOfferPage 
            request={selectedRequest}
            onBack={onBack}
            onSubmitOffer={onSubmitOffer || (() => console.log('Offer submitted'))}
          />
        );
      case 'view-offers':
        if (!selectedRequest) return null;
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
          }
        ];
        return (
          <ViewOffersPage 
            requestTitle={selectedRequest.title}
            offers={mockOffers}
            onBack={onBack}
            onContactAgent={onContactAgent}
            onAcceptOffer={onAcceptOffer}
          />
        );
      case 'payment':
        if (!selectedOffer) return null;
        const requestForPayment = selectedRequest || {
          id: 'temp-request-for-payment',
          title: 'Purchase Request',
          description: selectedOffer.description || 'Payment for selected service',
          budget: {
            min: selectedOffer.price || 0,
            max: selectedOffer.totalAmount || 0,
            currency: selectedOffer.currency || 'USD'
          }
        };
        return (
          <PaymentPage 
            offer={selectedOffer}
            request={requestForPayment}
            user={user}
            onBack={onPaymentBack || onBack}
            onPaymentSuccess={onPaymentSuccess}
          />
        );
      case 'feedback':
        if (!selectedRequest) return null;
        return (
          <FeedbackPage 
            request={selectedRequest}
            onBack={onBack}
            onSubmitFeedback={onSubmitFeedback}
          />
        );
      case 'view-feedback':
        if (!selectedRequest || !getMockFeedback) return null;
        return (
          <ViewFeedbackPage 
            request={selectedRequest}
            feedback={getMockFeedback(selectedRequest.id)}
            onBack={onBack}
          />
        );
      case 'offer-details':
        if (!selectedOffer) {
          console.error('No selectedOffer for offer-details page');
          return null;
        }
        console.log('Rendering offer-details with data:', selectedOffer);
        
        // Use the proper OfferDetailsPage with all features
        return (
          <OfferDetailsPage 
            offer={selectedOffer}
            onBack={onBack}
            onContactAgent={onContactAgent}
            onCreateOrder={onAcceptOffer}
          />
        );
    }
  }

  // Info pages
  if (pageType === 'info') {
    switch (currentPage) {
      case 'privacy':
        return <PrivacyPolicyPage onBack={onBack} />;
      case 'terms':
        return <TermsOfServicePage onBack={onBack} />;
      case 'support':
        return <SupportPage onBack={onBack} />;
      case 'about-us':
        return <AboutUsPage onBack={onBack} />;
    }
  }

  // Verification pages
  if (pageType === 'verification') {
    switch (currentPage) {
      case 'email':
        return (
          <EmailVerificationPage 
            onBack={onBack}
            onComplete={onComplete}
            email={user?.email || 'user@example.com'}
          />
        );
      case 'phone':
        return (
          <PhoneVerificationPage 
            onBack={onBack}
            onComplete={onComplete}
            phone={user?.phone}
          />
        );
      case 'identity':
        return (
          <IdentityVerificationPage 
            onBack={onBack}
            onComplete={onComplete}
          />
        );
      case 'business':
        return (
          <BusinessVerificationPage 
            onBack={onBack}
            onComplete={onComplete}
          />
        );
    }
  }

  // Security pages
  if (pageType === 'security') {
    switch (currentPage) {
      case 'change-password':
        return (
          <ChangePasswordPage 
            onBack={onBack}
            onComplete={onComplete}
          />
        );
      case 'two-factor-auth':
        return (
          <TwoFactorAuthPage 
            onBack={onBack}
            onComplete={onComplete}
          />
        );
      case 'delete-account':
        return (
          <DeleteAccountPage 
            onBack={onBack}
            onComplete={onComplete}
          />
        );
    }
  }

  // Account pages
  if (pageType === 'account') {
    switch (currentPage) {
      case 'edit-account':
        if (!user) return null;
        return (
          <EditAccountPage 
            user={user}
            onBack={onBack}
            onSave={onSave}
          />
        );
      case 'bank-information':
        return (
          <BankInformationPage 
            user={user}
            onBack={onBack}
            onSave={onSave}
          />
        );
      case 'credit-cards':
        return (
          <CreditCardsPage 
            user={user}
            onBack={onBack}
            onSave={onSave}
            onNavigateToAddCard={onNavigateToAddCard}
          />
        );
      case 'add-credit-card':
        return (
          <AddCreditCardPage 
            user={user}
            onBack={onBack}
            onSave={onSave}
          />
        );
    }
  }

  // Arbitration pages
  if (pageType === 'arbitration') {
    switch (currentPage) {
      case 'arbitration-centre':
        return (
          <ArbitrationCentrePage 
            user={user}
            request={selectedRequest}
            onBack={onBack}
            onSubmit={onSubmitArbitration}
          />
        );
    }
  }

  // Explore pages
  if (pageType === 'explore') {
    switch (currentPage) {
      case 'all-requests':
        return (
          <AllRequestsPage 
            onBack={onBack}
            onNavigateToRequestDetails={onNavigateToMakeOffer}
          />
        );
      case 'all-offers':
        return (
          <AllOffersPage 
            onBack={onBack}
            onContactAgent={onContactAgent}
            onNavigateToOfferDetails={onNavigateToOfferDetails}
          />
        );
      case 'all-agents':
        return (
          <AllAgentsPage 
            onBack={onBack}
            onContactAgent={onContactAgent}
          />
        );
      case 'category':
        if (!selectedCategory) return null;
        return (
          <CategoryPage 
            category={selectedCategory}
            onBack={onBack}
            onNavigateToRequestDetails={onNavigateToMakeOffer}
            onContactAgent={onContactAgent}
          />
        );
    }
  }

    return null;
    } catch (error) {
      console.error('PageManager render error:', error);
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading page</p>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {renderPage()}
    </Suspense>
  );
});