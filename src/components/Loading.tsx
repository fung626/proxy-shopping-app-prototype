import { useLanguage } from '@/store/LanguageContext';

const Loading = () => {
  const { t } = useLanguage();
  return (
    <div className="flex-1 bg-background pb-20 min-h-screen relative">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">
            {t('common.loading')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
