import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { AccountSection } from '@/pages/profile/AccountSection';
import { AppSettingsSection } from '@/pages/profile/AppSettingsSection';
import { HelpSupportSection } from '@/pages/profile/HelpSupportSection';
import { PaymentSection } from '@/pages/profile/PaymentSection';
import {
  ProfileHeader,
  SignInPrompt,
} from '@/pages/profile/ProfileHeader';
import { SecuritySection } from '@/pages/profile/SecuritySection';
import { useLanguage } from '@/store/LanguageContext';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export function ProfileTab() {
  const { user, logout, redirectToAuth } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(true);

  if (!user) {
    return (
      <div className="flex-1 bg-background pb-[74px] relative">
        <div className="py-4 space-y-6">
          <SignInPrompt onSignIn={redirectToAuth} />
          <AppSettingsSection
            notifications={notifications}
            onNotificationsChange={setNotifications}
          />
          <HelpSupportSection />
        </div>
      </div>
    );
  }

  const verificationStatus = user.verificationStatus || {
    email: false,
    phone: false,
    identity: false,
    business: false,
  };

  return (
    <div className="flex-1 bg-background pb-[74px] relative">
      <div className="py-4 space-y-6">
        <ProfileHeader userName={user.name} userEmail={user.email} />
        <AppSettingsSection
          notifications={notifications}
          onNotificationsChange={setNotifications}
        />
        <AccountSection verificationStatus={verificationStatus} />
        <PaymentSection user={user} />
        <SecuritySection />
        <HelpSupportSection />
        {/* Sign Out */}
        <div className="space-y-4">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-4 h-auto profile-row-button text-red-600 hover:bg-red-50"
              onClick={logout}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <span className="font-normal">
                  {t('profile.signOut')}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
