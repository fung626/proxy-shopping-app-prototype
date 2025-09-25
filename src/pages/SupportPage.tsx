import React from 'react';
import { ArrowLeft, Mail, Phone, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useLanguage } from '../store/LanguageContext';

interface SupportPageProps {
  onBack: () => void;
}

export function SupportPage({ onBack }: SupportPageProps) {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Support message sent');
  };

  const supportOptions = [
    {
      icon: Mail,
      title: t('support.emailSupport'),
      description: t('support.emailSupportDescription'),
      action: t('support.emailSupportAction'),
      actionType: 'email'
    },
    {
      icon: MessageCircle,
      title: t('support.liveChat'),
      description: t('support.liveChatDescription'),
      action: t('support.liveChatAction'),
      actionType: 'chat'
    },
    {
      icon: Phone,
      title: t('support.phoneSupport'),
      description: t('support.phoneSupportDescription'),
      action: t('support.phoneSupportAction'),
      actionType: 'phone'
    }
  ];

  const faqItems = [
    {
      question: t('support.faq.createRequest'),
      answer: t('support.faq.createRequestAnswer')
    },
    {
      question: t('support.faq.agentVerification'),
      answer: t('support.faq.agentVerificationAnswer')
    },
    {
      question: t('support.faq.paymentMethods'),
      answer: t('support.faq.paymentMethodsAnswer')
    },
    {
      question: t('support.faq.trackOrders'),
      answer: t('support.faq.trackOrdersAnswer')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center p-4 pt-6 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold ml-4">{t('support.title')}</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Support Info Section */}
        <div className="mb-6 p-4 bg-muted/50 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <HelpCircle className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">{t('support.needHelp')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('support.needHelpDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Support Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Options */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('support.contactMethod')}</label>
            <div className="space-y-3">
              {supportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.title} className="p-4 border border-border rounded-lg bg-input-background">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{option.title}</h3>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                        <p className="text-sm text-primary mt-1">{option.action}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        {t('support.contact')}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('support.firstName')}</label>
              <Input 
                placeholder={t('support.firstNamePlaceholder')} 
                className="bg-input-background border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('support.lastName')}</label>
              <Input 
                placeholder={t('support.lastNamePlaceholder')} 
                className="bg-input-background border-border"
              />
            </div>
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('support.emailAddress')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email" 
                placeholder={t('support.emailPlaceholder')}
                className="pl-10 bg-input-background border-border"
              />
            </div>
          </div>
          
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('support.subject')}</label>
            <select className="w-full p-3 border border-border rounded-md bg-input-background text-foreground">
              <option>{t('support.subjectGeneral')}</option>
              <option>{t('support.subjectTechnical')}</option>
              <option>{t('support.subjectAccount')}</option>
              <option>{t('support.subjectBilling')}</option>
              <option>{t('support.subjectFeature')}</option>
            </select>
          </div>
          
          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('support.message')}</label>
            <Textarea 
              placeholder={t('support.messagePlaceholder')}
              className="bg-input-background border-border min-h-[120px]"
            />
          </div>

          {/* FAQ Items */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('support.commonQuestions')}</label>
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <div key={index} className="p-4 border border-border rounded-lg bg-input-background">
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">{item.question}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('support.helpfulResources')}</label>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-auto py-3 bg-input-background border-border">
                <div className="text-left">
                  <div className="font-medium">{t('support.userGuide')}</div>
                  <div className="text-sm text-muted-foreground">{t('support.userGuideDescription')}</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto py-3 bg-input-background border-border">
                <div className="text-left">
                  <div className="font-medium">{t('support.videoTutorials')}</div>
                  <div className="text-sm text-muted-foreground">{t('support.videoTutorialsDescription')}</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto py-3 bg-input-background border-border">
                <div className="text-left">
                  <div className="font-medium">{t('support.apiDocumentation')}</div>
                  <div className="text-sm text-muted-foreground">{t('support.apiDocumentationDescription')}</div>
                </div>
              </Button>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" className="w-full h-12 text-base">
              {t('support.sendMessage')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}