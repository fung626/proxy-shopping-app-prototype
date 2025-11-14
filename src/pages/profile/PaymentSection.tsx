import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/store/LanguageContext';
import { User } from '@/types';
import { CreditCard, Fingerprint, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChevronRight = () => (
  <svg
    className="h-5 w-5 text-muted-foreground"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const BankIcon = () => (
  <svg
    className="h-5 w-5 text-muted-foreground"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

interface PaymentSectionProps {
  user: User | null;
}

export function PaymentSection({ user }: PaymentSectionProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground px-4">
        {t('profile.paymentSettings')}
      </h3>

      <div className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-4 h-auto profile-row-button"
          onClick={() => navigate('/profile/bank-information')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <BankIcon />
            </div>
            <span className="font-normal">
              {t('profile.bankInformation')}
            </span>
          </div>
          <ChevronRight />
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-4 h-auto profile-row-button"
          onClick={() => navigate('/profile/credit-cards')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="font-normal">
              {t('profile.creditCards')}
            </span>
          </div>
          <ChevronRight />
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-4 h-auto profile-row-button"
          onClick={() => navigate('/profile/transaction-password')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-normal">
                {t('profile.transactionPassword')}
              </div>
              <div className="text-xs text-muted-foreground">
                {user?.transactionPasswordEnabled
                  ? t('profile.transactionPasswordEnabled')
                  : t('profile.transactionPasswordDisabled')}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {user?.transactionPasswordEnabled && (
              <Badge variant="default" className="text-xs">
                {t('profile.enabled')}
              </Badge>
            )}
            <ChevronRight />
          </div>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-4 h-auto profile-row-button"
          onClick={() => navigate('/profile/biometric-auth')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <Fingerprint className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-normal">
                {t('profile.biometricAuth')}
              </div>
              <div className="text-xs text-muted-foreground">
                {user?.biometricAuthEnabled
                  ? t('profile.biometricAuthEnabled')
                  : t('profile.biometricAuthDisabled')}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {user?.biometricAuthEnabled && (
              <Badge variant="default" className="text-xs">
                {t('profile.enabled')}
              </Badge>
            )}
            <ChevronRight />
          </div>
        </Button>
      </div>
    </div>
  );
}
