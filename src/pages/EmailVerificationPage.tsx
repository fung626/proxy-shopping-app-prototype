import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useLanguage } from '../store/LanguageContext';

interface EmailVerificationPageProps {
  onBack: () => void;
  onComplete: () => void;
  email: string;
}

export function EmailVerificationPage({ onBack, onComplete, email }: EmailVerificationPageProps) {
  const { t } = useLanguage();
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [lastResendTime, setLastResendTime] = useState<Date | null>(null);

  const handleResend = async () => {
    setIsResending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendCount(prev => prev + 1);
      setLastResendTime(new Date());
    } finally {
      setIsResending(false);
    }
  };

  const handleVerificationComplete = () => {
    // Simulate successful verification
    onComplete();
  };

  const canResend = () => {
    if (!lastResendTime) return true;
    const timeDiff = Date.now() - lastResendTime.getTime();
    return timeDiff > 60000; // 1 minute cooldown
  };

  const getResendCooldown = () => {
    if (!lastResendTime) return 0;
    const timeDiff = Date.now() - lastResendTime.getTime();
    const remaining = Math.max(0, 60 - Math.floor(timeDiff / 1000));
    return remaining;
  };

  const [cooldown, setCooldown] = useState(getResendCooldown());

  // Update cooldown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldown(getResendCooldown());
    }, 1000);

    return () => clearInterval(interval);
  }, [lastResendTime]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-4 safe-area-inset-top">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Email Verification</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">Check Your Email</h2>
            <p className="text-muted-foreground leading-relaxed">
              We've sent a verification link to <span className="font-medium text-foreground">{email}</span>. 
              Click the link in the email to verify your account.
            </p>
          </div>

          {/* Email Instructions */}
          <Card className="p-6 mb-6">
            <h3 className="font-medium text-foreground mb-4">Next Steps:</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                  1
                </div>
                <span>Check your email inbox (and spam folder)</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                  2
                </div>
                <span>Click the "Verify Email" link in the email</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                  3
                </div>
                <span>Return to this app to continue</span>
              </li>
            </ol>
          </Card>

          {/* Resend Section */}
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Didn't receive the email?</h4>
                <p className="text-sm text-muted-foreground">
                  {resendCount > 0 && `Sent ${resendCount} time${resendCount > 1 ? 's' : ''}`}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResend}
                disabled={isResending || !canResend()}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : cooldown > 0 ? (
                  `Resend in ${cooldown}s`
                ) : (
                  'Resend Email'
                )}
              </Button>
            </div>
          </Card>

          {/* Email Tips */}
          <Card className="p-4 bg-muted/50">
            <h4 className="font-medium text-foreground mb-2">Email Tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check your spam or junk mail folder</li>
              <li>• Add our email to your contacts</li>
              <li>• Make sure your email is correct: {email}</li>
              <li>• It may take a few minutes to arrive</li>
            </ul>
          </Card>

          {/* Demo Mode Actions */}
          <div className="mt-8 space-y-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Demo Mode: Click below to simulate email verification
              </p>
              <Button onClick={handleVerificationComplete} className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Simulate Email Verified
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}