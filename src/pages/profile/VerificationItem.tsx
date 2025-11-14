import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/store/LanguageContext';

interface VerificationItemProps {
  type: 'email' | 'phone' | 'identity' | 'business';
  status: boolean;
  onClick: () => void;
}

const ChevronRight = () => (
  <svg
    className="h-4 w-4 text-muted-foreground flex-shrink-0"
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

const CheckIcon = () => (
  <svg
    className="w-2 h-2 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const verificationIcons = {
  email: (
    <svg
      className="w-2 h-2 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
      />
    </svg>
  ),
  phone: (
    <svg
      className="w-2 h-2 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  ),
  identity: (
    <svg
      className="w-2 h-2 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
      />
    </svg>
  ),
  business: (
    <svg
      className="w-2 h-2 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  ),
};

export default function VerificationItem({
  type,
  status,
  onClick,
}: VerificationItemProps) {
  const { t } = useLanguage();

  return (
    <Button
      variant="ghost"
      className="w-full px-4 py-4 h-auto profile-row-button"
      onClick={onClick}
    >
      <div className="grid grid-cols-[1fr_80px] gap-2 w-full items-center">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                status ? 'bg-green-500' : 'bg-muted-foreground'
              }`}
            >
              {status ? <CheckIcon /> : verificationIcons[type]}
            </div>
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="font-normal truncate">
              {t(`profile.${type}Verification`)}
            </div>
            <div className="text-xs text-muted-foreground leading-tight">
              {status
                ? t(`profile.${type}VerificationDesc`)
                : t(`profile.${type}VerificationDescPending`)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-1">
          <div className="text-right">
            {status ? (
              <Badge
                variant="default"
                className="text-xs whitespace-nowrap"
              >
                {t('profile.verified')}
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="text-xs whitespace-nowrap"
              >
                {t('profile.pending')}
              </Badge>
            )}
          </div>
          <ChevronRight />
        </div>
      </div>
    </Button>
  );
}
