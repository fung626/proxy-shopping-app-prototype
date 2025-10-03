import { PageWrapper } from '@/components/PageWrapper';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/store/LanguageContext';
import {
  Award,
  Globe,
  Heart,
  Shield,
  Target,
  Users,
} from 'lucide-react';

interface AboutUsPageProps {
  onBack?: () => void;
}

export function AboutUsPage({ onBack }: AboutUsPageProps = {}) {
  const { t } = useLanguage();

  const teamValues = [
    {
      icon: Heart,
      title: t('about.customerFirst'),
      description: t('about.customerFirstDescription'),
    },
    {
      icon: Shield,
      title: t('about.trustSafety'),
      description: t('about.trustSafetyDescription'),
    },
    {
      icon: Globe,
      title: t('about.globalCommunity'),
      description: t('about.globalCommunityDescription'),
    },
    {
      icon: Award,
      title: t('about.qualityExcellence'),
      description: t('about.qualityExcellenceDescription'),
    },
  ];

  const milestones = [
    { year: '2023', event: t('about.milestone2023Founded') },
    { year: '2023', event: t('about.milestone2023Launch') },
    { year: '2024', event: t('about.milestone2024Users') },
    { year: '2024', event: t('about.milestone2024Security') },
  ];

  return (
    <PageWrapper
      title={t('about.title')}
      onBack={onBack}
      className="min-h-screen bg-background"
      contentClassName="p-4 space-y-6"
    >
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            {t('about.welcomeTitle')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('about.welcomeDescription')}
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">
              {t('about.ourMission')}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('about.ourMissionDescription')}
            </p>
          </div>
        </div>
      </Card>

      {/* Our Values */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          {t('about.ourValues')}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {teamValues.map((value, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <value.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          {t('about.howItWorks')}
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1"
              >
                1
              </Badge>
              <div>
                <h4 className="font-medium mb-1">
                  {t('about.step1Title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('about.step1Description')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start space-x-3">
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1"
              >
                2
              </Badge>
              <div>
                <h4 className="font-medium mb-1">
                  {t('about.step2Title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('about.step2Description')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start space-x-3">
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1"
              >
                3
              </Badge>
              <div>
                <h4 className="font-medium mb-1">
                  {t('about.step3Title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('about.step3Description')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-start space-x-3">
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1"
              >
                4
              </Badge>
              <div>
                <h4 className="font-medium mb-1">
                  {t('about.step4Title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('about.step4Description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Journey */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          {t('about.ourJourney')}
        </h3>
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-3 bg-muted/30 rounded-lg"
            >
              <Badge variant="outline" className="text-xs font-mono">
                {milestone.year}
              </Badge>
              <p className="text-sm flex-1">{milestone.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          {t('about.byTheNumbers')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              10K+
            </div>
            <div className="text-sm text-muted-foreground">
              {t('about.activeUsers')}
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              50+
            </div>
            <div className="text-sm text-muted-foreground">
              {t('about.countries')}
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              25K+
            </div>
            <div className="text-sm text-muted-foreground">
              Completed Orders
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              98%
            </div>
            <div className="text-sm text-muted-foreground">
              Satisfaction Rate
            </div>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div className="space-y-4 pb-8">
        <h3 className="font-semibold text-lg">Get in Touch</h3>
        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <p className="text-sm text-muted-foreground">
            Have questions or suggestions? We'd love to hear from you.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">hello@proxyshop.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Support:</span>
              <span className="font-medium">
                support@proxyshop.com
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Business:</span>
              <span className="font-medium">
                business@proxyshop.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
