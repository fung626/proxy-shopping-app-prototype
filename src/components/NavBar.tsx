import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface NavBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function NavBar({
  title,
  showBack = true,
  onBack,
  rightAction,
  className = '',
}: NavBarProps) {
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
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left side - Back button */}
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
          {/* Spacer for alignment */}
        </div>
        {/* Center - Title */}
        <div className="flex-1 text-center px-4">
          <h1 className="text-lg font-semibold text-foreground truncate">
            {title}
          </h1>
        </div>
        {/* Right side - Action or spacer */}
        <div className="flex items-center">
          {rightAction || <div className="w-9" />}{' '}
          {/* Spacer for alignment */}
        </div>
      </div>
    </header>
  );
}
