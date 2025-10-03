import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Shield, Users, X } from 'lucide-react';

interface LearnMoreModalProps {
  type: 'phone' | 'email' | 'identity' | 'business';
  onClose: () => void;
}

export function LearnMoreModal({
  type,
  onClose,
}: LearnMoreModalProps) {
  const getModalContent = () => {
    switch (type) {
      case 'phone':
        return {
          title: 'Phone Verification',
          icon: Shield,
          description:
            'Secure your account and enable important notifications with phone verification.',
          benefits: [
            'Account security protection',
            'Two-factor authentication',
            'Order status notifications',
            'Emergency account recovery',
          ],
          process: [
            'Enter your phone number',
            'Receive SMS verification code',
            'Enter the 6-digit code',
            'Phone verification complete',
          ],
        };
      case 'email':
        return {
          title: 'Email Verification',
          icon: Shield,
          description:
            'Verify your email address to secure your account and receive important updates.',
          benefits: [
            'Account security protection',
            'Password reset capability',
            'Important notifications',
            'Platform updates and news',
          ],
          process: [
            'Check your email inbox',
            'Click the verification link',
            'Return to the app',
            'Email verification complete',
          ],
        };
      case 'identity':
        return {
          title: 'Identity Verification',
          icon: CheckCircle,
          description:
            'Build trust with suppliers and unlock premium features through identity verification.',
          benefits: [
            'Increased supplier confidence',
            'Access to premium suppliers',
            'Higher transaction limits',
            'Priority customer support',
          ],
          process: [
            'Upload government-issued ID',
            'Take a verification selfie',
            'Review process (1-2 business days)',
            'Identity verification complete',
          ],
        };
      case 'business':
        return {
          title: 'Business Verification',
          icon: Users,
          description:
            'Access enterprise features and higher transaction limits with business verification.',
          benefits: [
            'Bulk ordering capabilities',
            'Extended payment terms',
            'Dedicated account manager',
            'Enterprise-grade support',
          ],
          process: [
            'Upload business registration',
            'Provide tax identification',
            'Business address verification',
            'Review process (2-3 business days)',
          ],
        };
      default:
        return {
          title: 'Verification',
          icon: Shield,
          description: 'Learn more about our verification process.',
          benefits: [],
          process: [],
        };
    }
  };

  const content = getModalContent();
  const Icon = content.icon;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {content.title}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {content.description}
          </p>

          {/* Benefits */}
          <div>
            <h3 className="font-medium text-foreground mb-3">
              Benefits:
            </h3>
            <ul className="space-y-2">
              {content.benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-2"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Process */}
          <div>
            <h3 className="font-medium text-foreground mb-3">
              Verification Process:
            </h3>
            <ol className="space-y-2">
              {content.process.map((step, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3"
                >
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <Button onClick={onClose} className="w-full">
            Got it
          </Button>
        </div>
      </Card>
    </div>
  );
}
