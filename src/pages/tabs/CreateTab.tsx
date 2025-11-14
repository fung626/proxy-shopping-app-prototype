import { CreateOfferForm } from '@/components/CreateOfferForm';
import { CreateRequestForm } from '@/components/CreateRequestForm';
import { Button } from '@/components/ui/button';
import SignInView from '@/pages/auth/SignInView';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand/authStore';
import { Package, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';

export function CreateTab() {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState<'request' | 'offer'>(
    'request'
  );
  const [showModeDescription, setShowModeDescription] =
    useState(true);

  const { user } = useAuthStore();

  if (!user) {
    return (
      <SignInView
        title="nav.create"
        description="create.description"
        signInPrompt="create.signInPrompt"
        signInDescription="create.signInDescription"
        signInButtonText="profile.signIn"
      />
    );
  }

  return (
    <div className="flex-1 bg-background pb-20 flex flex-col">
      {/* Header with Mode Toggle */}
      <div className="px-4 pt-12 pb-6 flex-shrink-0">
        <h1 className="text-3xl font-semibold text-foreground mb-6">
          Create
        </h1>
        {/* Mode Toggle */}
        <div className="bg-muted/50 rounded-lg p-1 mb-4">
          <div className="grid grid-cols-2 gap-1">
            <Button
              variant={activeMode === 'request' ? 'default' : 'ghost'}
              className={`justify-center ${
                activeMode === 'request'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveMode('request')}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {t('create.request')}
            </Button>
            <Button
              variant={activeMode === 'offer' ? 'default' : 'ghost'}
              className={`justify-center ${
                activeMode === 'offer'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveMode('offer')}
            >
              <Package className="h-4 w-4 mr-2" />
              {t('create.offer')}
            </Button>
          </div>
        </div>
        {/* Mode Description */}
        {showModeDescription && (
          <div className="mb-0 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  {activeMode === 'request' ? (
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  ) : (
                    <Package className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  {activeMode === 'request' ? (
                    <>
                      <h4 className="font-medium text-foreground mb-1">
                        {t('create.creatingRequest')}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('create.requestDescription')}
                      </p>
                    </>
                  ) : (
                    <>
                      <h4 className="font-medium text-foreground mb-1">
                        {t('create.creatingOffer')}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('create.offerDescription')}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground ml-2"
                onClick={() => setShowModeDescription(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Content based on selected mode */}
      <div className="flex-1 min-h-0">
        {activeMode === 'request' ? (
          <CreateRequestForm />
        ) : (
          <CreateOfferForm />
        )}
      </div>
    </div>
  );
}
