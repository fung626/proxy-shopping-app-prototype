import { useLanguage } from '@/store/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface NavBarProps {
  className?: string;
  title?: string;
  subTitle?: string;
  large?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function NavBar({
  className = '',
  title,
  subTitle,
  large = false,
  showBack = true,
  onBack,
  rightAction,
}: NavBarProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={`safe-area-inset-top bg-background border-border sticky top-0 z-50 ${className}`}
    >
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Button>
          )}
          {!showBack && <div className="w-9" />}{' '}
        </div>
        <div className="flex-1 px-4">
          {title && (
            <h1 className="text-lg font-semibold text-foreground truncate">
              {t(title)}
            </h1>
          )}
          {subTitle && (
            <p className="text-sm text-muted-foreground truncate">
              {t(subTitle)}
            </p>
          )}
        </div>
        <div className="flex items-center">
          {rightAction || <div className="w-9" />}{' '}
        </div>
      </div>
    </header>
  );
}
