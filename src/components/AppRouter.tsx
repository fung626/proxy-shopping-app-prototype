import { useState, memo } from 'react';
import { TabNavigation } from '../layouts/TabNavigation';
import { ExploreTab } from '../pages/ExploreTab';
import { CreateTab } from '../pages/CreateTab';
import { MessagesTab } from '../pages/MessagesTab';
import { OrdersTab } from '../pages/OrdersTab';
import { ProfileTab } from '../pages/ProfileTab';
import { AppTab, User } from '../types';

interface AppRouterProps {
  user: User | null;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  selectedAgentId: string | null;
  inChatView: boolean;
  onChatViewChange: (inChatView: boolean) => void;
  onShowAuth: () => void;
  onLogout: () => void;
  onNavigateToRequestDetails: (request: any) => void;
  onNavigateToExploreRequestDetails: (request: any) => void;
  onNavigateToViewOffers: (request: any) => void;
  onNavigateToFeedback: (request: any) => void;
  onNavigateToViewFeedback: (request: any) => void;
  onContactAgent: (agentId: string) => void;
  onNavigateToPrivacyPolicy: () => void;
  onNavigateToTermsOfService: () => void;
  onNavigateToSupport: () => void;
  onNavigateToAboutUs: () => void;
  onNavigateToEmailVerification: () => void;
  onNavigateToPhoneVerification: () => void;
  onNavigateToIdentityVerification: () => void;
  onNavigateToBusinessVerification: () => void;
  onNavigateToChangePassword: () => void;
  onNavigateToTwoFactorAuth: () => void;
  onNavigateToEditAccount: () => void;
  onNavigateToDeleteAccount: () => void;
  onNavigateToBankInformation: () => void;
  onNavigateToCreditCards: () => void;
  onNavigateToTransactionPassword: () => void;
  onNavigateToBiometricAuth: () => void;
  onViewAllRequests?: () => void;
  onViewAllOffers?: () => void;
  onViewAllAgents?: () => void;
  onNavigateToCategory?: (category: string) => void;
  onNavigateToOfferDetails?: (offer: any) => void;
  favorites?: Set<number>;
  onToggleFavorite?: (itemId: number) => void;
  onNavigateToWishlist?: () => void;
  onNavigateToSearch?: (query?: string) => void;
}

export const AppRouter = memo(function AppRouter({
  user,
  activeTab,
  onTabChange,
  selectedAgentId,
  inChatView,
  onChatViewChange,
  onShowAuth,
  onLogout,
  onNavigateToRequestDetails,
  onNavigateToExploreRequestDetails,
  onNavigateToViewOffers,
  onNavigateToFeedback,
  onNavigateToViewFeedback,
  onContactAgent,
  onNavigateToPrivacyPolicy,
  onNavigateToTermsOfService,
  onNavigateToSupport,
  onNavigateToAboutUs,
  onNavigateToEmailVerification,
  onNavigateToPhoneVerification,
  onNavigateToIdentityVerification,
  onNavigateToBusinessVerification,
  onNavigateToChangePassword,
  onNavigateToTwoFactorAuth,
  onNavigateToEditAccount,
  onNavigateToDeleteAccount,
  onNavigateToBankInformation,
  onNavigateToCreditCards,
  onNavigateToTransactionPassword,
  onNavigateToBiometricAuth,
  onViewAllRequests,
  onViewAllOffers,
  onViewAllAgents,
  onNavigateToCategory,
  onNavigateToOfferDetails,
  favorites,
  onToggleFavorite,
  onNavigateToWishlist,
  onNavigateToSearch
}: AppRouterProps) {

  const handleTabChange = (tab: string) => {
    onTabChange(tab as AppTab);
    if (tab !== 'messages') {
      onChatViewChange(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'explore':
        return <ExploreTab 
          user={user}
          onNavigateToRequestDetails={onNavigateToExploreRequestDetails}
          onContactAgent={onContactAgent}
          onViewAllRequests={onViewAllRequests}
          onViewAllOffers={onViewAllOffers}
          onViewAllAgents={onViewAllAgents}
          onNavigateToCategory={onNavigateToCategory}
          onNavigateToOfferDetails={onNavigateToOfferDetails}
          onNavigateToWishlist={onNavigateToWishlist}
          onNavigateToSearch={onNavigateToSearch}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />;
      case 'messages':
        return <MessagesTab 
          user={user}
          onSignIn={onShowAuth}
          onChatViewChange={onChatViewChange} 
          selectedAgentId={selectedAgentId}
        />;
      case 'create':
        return <CreateTab 
          user={user}
          onSignIn={onShowAuth}
        />;
      case 'orders':
        return <OrdersTab 
          user={user} 
          onSignIn={onShowAuth}
          onViewDetails={onNavigateToRequestDetails}
          onViewOffers={onNavigateToViewOffers}
          onContactAgent={onContactAgent}
          onLeaveFeedback={onNavigateToFeedback}
          onViewFeedback={onNavigateToViewFeedback}
        />;
      case 'profile':
        return <ProfileTab 
          user={user} 
          onSignIn={onShowAuth} 
          onLogout={onLogout}
          onNavigateToPrivacyPolicy={onNavigateToPrivacyPolicy}
          onNavigateToTermsOfService={onNavigateToTermsOfService}
          onNavigateToSupport={onNavigateToSupport}
          onNavigateToAboutUs={onNavigateToAboutUs}
          onNavigateToEmailVerification={onNavigateToEmailVerification}
          onNavigateToPhoneVerification={onNavigateToPhoneVerification}
          onNavigateToIdentityVerification={onNavigateToIdentityVerification}
          onNavigateToBusinessVerification={onNavigateToBusinessVerification}
          onNavigateToChangePassword={onNavigateToChangePassword}
          onNavigateToTwoFactorAuth={onNavigateToTwoFactorAuth}
          onNavigateToEditAccount={onNavigateToEditAccount}
          onNavigateToDeleteAccount={onNavigateToDeleteAccount}
          onNavigateToBankInformation={onNavigateToBankInformation}
          onNavigateToCreditCards={onNavigateToCreditCards}
          onNavigateToTransactionPassword={onNavigateToTransactionPassword}
          onNavigateToBiometricAuth={onNavigateToBiometricAuth}
        />;
      default:
        return <ExploreTab />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </main>
      
      {!inChatView && (
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
      )}
    </div>
  );
});