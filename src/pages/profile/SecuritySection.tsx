import { Button } from '@/components/ui/button';
import { useLanguage } from '@/store/LanguageContext';
import { Settings, Shield } from 'lucide-react';
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

export function SecuritySection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground px-4">
        {t('profile.securitySettings')}
      </h3>

      <div className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-4 h-auto profile-row-button"
          onClick={() => navigate('/profile/change-password')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="font-normal">
              {t('profile.changePassword')}
            </span>
          </div>
          <ChevronRight />
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-4 h-auto profile-row-button"
          onClick={() => navigate('/profile/two-factor-auth')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="font-normal">
              {t('profile.twoFactor')}
            </span>
          </div>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
