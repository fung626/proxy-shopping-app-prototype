import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLanguage } from '../store/LanguageContext';

interface TermsOfServicePageProps {
  onBack: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center p-4 pt-6 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold ml-4">{t('terms.title')}</h1>
      </div>

      {/* Content */}
      <div className="p-4 pb-20 max-w-2xl mx-auto">
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('terms.acceptanceTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('terms.acceptanceText')}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('terms.useLicenseTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              {t('terms.useLicenseText')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>{t('terms.useLicenseRestriction1')}</li>
              <li>{t('terms.useLicenseRestriction2')}</li>
              <li>{t('terms.useLicenseRestriction3')}</li>
              <li>{t('terms.useLicenseRestriction4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('terms.userAccountsTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('terms.userAccountsText')}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('terms.procurementTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('terms.procurementText')}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('terms.prohibitedTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              {t('terms.prohibitedText')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>{t('terms.prohibited1')}</li>
              <li>{t('terms.prohibited2')}</li>
              <li>{t('terms.prohibited3')}</li>
              <li>{t('terms.prohibited4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('terms.liabilityTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('terms.liabilityText')}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('terms.governingTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('terms.governingText')}
            </p>
          </section>

          <section className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {t('terms.lastUpdated')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}