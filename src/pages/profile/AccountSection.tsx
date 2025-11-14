import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/store/LanguageContext';
import { User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VerificationItem from './VerificationItem';

interface VerificationStatus {
  email: boolean;
  phone: boolean;
  identity: boolean;
  business: boolean;
}

interface AccountSectionProps {
  verificationStatus: VerificationStatus;
}

export function AccountSection({
  verificationStatus,
}: AccountSectionProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const verificationCount = Object.values(verificationStatus).filter(
    Boolean
  ).length;

  return (
    <div className="space-y-4">
      <div className="px-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-foreground">
            {t('profile.account')}
          </h3>
          <Badge
            variant={verificationCount >= 2 ? 'default' : 'secondary'}
          >
            {verificationCount}/4{' '}
            {t('profile.verified').toLowerCase()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('profile.accountDescription')}
        </p>
      </div>

      <div className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-4 h-auto profile-row-button"
          onClick={() => navigate('/profile/edit-account')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="font-normal">
              {t('profile.editProfile')}
            </span>
          </div>
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
        </Button>

        <VerificationItem
          type="email"
          status={verificationStatus.email}
          onClick={() => navigate('/profile/email-verification')}
        />

        <VerificationItem
          type="phone"
          status={verificationStatus.phone}
          onClick={() => navigate('/profile/phone-verification')}
        />

        <VerificationItem
          type="identity"
          status={verificationStatus.identity}
          onClick={() => navigate('/profile/identity-verification')}
        />

        <VerificationItem
          type="business"
          status={verificationStatus.business}
          onClick={() => navigate('/profile/business-verification')}
        />
      </div>
    </div>
  );
}
