import { Button } from '@/components/ui/button';
import { useLanguage } from '@/store/LanguageContext';
import { FileText, HelpCircle, Users } from 'lucide-react';
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

export function HelpSupportSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const links = [
    {
      icon: HelpCircle,
      label: t('profile.helpCenter'),
      path: '/info/support',
    },
    {
      icon: Users,
      label: t('profile.aboutUs'),
      path: '/info/about-us',
    },
    {
      icon: FileText,
      label: t('profile.privacy'),
      path: '/info/privacy',
    },
    {
      icon: FileText,
      label: t('profile.terms'),
      path: '/info/terms',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground px-4">
        {t('profile.helpSupport')}
      </h3>

      <div className="space-y-1">
        {links.map((link) => (
          <Button
            key={link.path}
            variant="ghost"
            className="w-full justify-between px-4 py-4 h-auto profile-row-button"
            onClick={() => navigate(link.path)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <link.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="font-normal">{link.label}</span>
            </div>
            <ChevronRight />
          </Button>
        ))}
      </div>
    </div>
  );
}
