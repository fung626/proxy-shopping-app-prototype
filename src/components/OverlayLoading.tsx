import { useLanguage } from '@/store/LanguageContext';

interface OverlayLoadingProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function OverlayLoading({
  isLoading,
  message,
  className = '',
}: OverlayLoadingProps) {
  const { t } = useLanguage();

  if (!isLoading) return null;

  return (
    <div
      className={`absolute h-screen w-screen inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-sm text-muted-foreground">
          {message || t('common.loading')}
        </p>
      </div>
    </div>
  );
}
