import { Button } from '@/components/ui/button';
import SignInView from '@/pages/auth/SignInView';
import { CreateOfferForm } from '@/pages/offers/CreateOfferForm';
import { CreateRequestForm } from '@/pages/requests/CreateRequestForm';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand/authStore';
import { Package, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export function CreateTab() {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState<'request' | 'offer'>(
    'request'
  );

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
      <div className="px-4 pt-12 pb-2 flex-shrink-0">
        <h1 className="text-3xl font-semibold text-foreground mb-6">
          {t('nav.create')}
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
