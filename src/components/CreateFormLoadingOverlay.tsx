import { useLanguage } from '@/store/LanguageContext';

interface CreateFormLoadingOverlayProps {
  type: 'request' | 'offer';
  isVisible: boolean;
}

export function CreateFormLoadingOverlay({
  type,
  isVisible,
}: CreateFormLoadingOverlayProps) {
  const { t } = useLanguage();
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-lg font-semibold mb-2">
            {type === 'request'
              ? t('createRequest.creatingYourRequest')
              : t('createOffer.creatingYourOffer')}
          </h2>
          <p className="text-muted-foreground text-sm">
            {type === 'request'
              ? t('createRequest.creatingRequestDescription')
              : t('createOffer.creatingOfferDescription')}
          </p>
        </div>
      </div>
    </div>
  );
}
