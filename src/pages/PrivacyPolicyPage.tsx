import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLanguage } from '../store/LanguageContext';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center p-4 pt-6 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold ml-4">{t('privacy.title')}</h1>
      </div>

      {/* Content */}
      <div className="p-4 pb-20 max-w-2xl mx-auto">
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('privacy.informationWeCollect')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacy.informationWeCollectContent')}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('privacy.howWeUseInfo')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              {t('privacy.howWeUseInfoContent')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>{t('privacy.useInfo1')}</li>
              <li>{t('privacy.useInfo2')}</li>
              <li>{t('privacy.useInfo3')}</li>
              <li>{t('privacy.useInfo4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('privacy.informationSharing')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacy.informationSharingContent')}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('privacy.dataSecurity')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacy.dataSecurityContent')}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('privacy.yourRights')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacy.yourRightsContent')}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('privacy.contactUs')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacy.contactUsContent')}
            </p>
          </section>

          <section className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {t('privacy.lastUpdated')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}