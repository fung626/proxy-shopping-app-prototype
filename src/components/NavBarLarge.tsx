import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface NavBarLargeProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightActions?: React.ReactNode[];
  showSearch?: boolean;
  onSearch?: () => void;
  showFilter?: boolean;
  onFilter?: () => void;
  className?: string;
  headerContent?: React.ReactNode;
}

export function NavBarLarge({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightActions = [],
  className = '',
}: NavBarLargeProps) {
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
      className={`safe-area-inset-top bg-background border-b border-border sticky top-0 z-50 ${className}`}
    >
      {/* Main navigation bar */}
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side - Back button */}
        <div className="flex items-center">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft className="h-6 w-6 text-foreground" />
            </Button>
          )}
          {!showBack && <div className="w-10" />}{' '}
          {/* Spacer for alignment */}
        </div>
        {/* Center - Title and subtitle */}
        <div className="max-w-sm mx-auto">
          <h1 className="text-3xl font-semibold text-foreground mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
