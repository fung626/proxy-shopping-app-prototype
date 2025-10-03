import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { useLanguage } from '@/store/LanguageContext';
import {
  ArrowLeft,
  CheckCircle,
  Phone,
  RefreshCw,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PhoneVerificationPageProps {
  phone?: string;
}

export function PhoneVerificationPage({
  phone = '',
}: PhoneVerificationPageProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(phone ? 2 : 1); // Skip phone input if provided
  const [phoneNumber, setPhoneNumber] = useState(
    phone ? phone.replace(/^\+\d+/, '') : ''
  ); // Extract phone without country code
  const [countryCode, setCountryCode] = useState(
    phone ? phone.match(/^\+\d+/)?.[0] || '+1' : '+1'
  ); // Extract country code or default
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [lastResendTime, setLastResendTime] = useState<Date | null>(
    null
  );
  const [cooldown, setCooldown] = useState(0);

  // Update cooldown timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastResendTime) {
        const timeDiff = Date.now() - lastResendTime.getTime();
        const remaining = Math.max(
          0,
          60 - Math.floor(timeDiff / 1000)
        );
        setCooldown(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastResendTime]);

  const handleSendCode = async () => {
    setIsResending(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResendCount((prev) => prev + 1);
      setLastResendTime(new Date());
      setStep(2);
    } finally {
      setIsResending(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResendCount((prev) => prev + 1);
      setLastResendTime(new Date());
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyCode = () => {
    // Simulate successful verification
    navigate('/profile');
  };

  const canResend = () => {
    if (!lastResendTime) return true;
    const timeDiff = Date.now() - lastResendTime.getTime();
    return timeDiff > 60000; // 1 minute cooldown
  };

  const formatPhoneNumber = (code: string, phone: string) => {
    // Simple phone number formatting with country code
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `${code} (${cleaned.slice(0, 3)}) ${cleaned.slice(
        3,
        6
      )}-${cleaned.slice(6, 10)}`;
    }
    return `${code} ${phone}`;
  };

  const getFullPhoneNumber = () => {
    return `${countryCode}${phoneNumber.replace(/\D/g, '')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-4 safe-area-inset-top">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            {t('phoneVerification.title')}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-20">
        <div className="max-w-md mx-auto">
          {step === 1 ? (
            // Step 1: Phone Number Input
            <div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">
                  {t('phoneVerification.verifyYourPhone')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('phoneVerification.sendCodeDescription')}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <Label htmlFor="phone">
                    {t('phoneVerification.phoneLabel')}
                  </Label>
                  <PhoneInput
                    phoneValue={phoneNumber}
                    countryCode={countryCode}
                    onPhoneChange={setPhoneNumber}
                    onCountryCodeChange={setCountryCode}
                    placeholder={t(
                      'phoneVerification.phonePlaceholder'
                    )}
                    required
                    className="mt-1"
                    id="phone"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('phoneVerification.phoneHint')}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSendCode}
                disabled={!phoneNumber.trim() || isResending}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {t('phoneVerification.sendingCode')}
                  </>
                ) : (
                  t('phoneVerification.sendVerificationCode')
                )}
              </Button>
            </div>
          ) : (
            // Step 2: Code Verification
            <div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">
                  {t('phoneVerification.enterVerificationCode')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('phoneVerification.codeDescription', {
                    phone: formatPhoneNumber(
                      countryCode,
                      phoneNumber
                    ),
                  })}
                </p>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <Label htmlFor="code">
                    {t('phoneVerification.verificationCodeLabel')}
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, '').slice(0, 6)
                      )
                    }
                    placeholder={t(
                      'phoneVerification.codePlaceholder'
                    )}
                    className="mt-1 text-center text-2xl tracking-widest"
                    maxLength={6}
                  />
                </div>

                {/* Resend Section */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('phoneVerification.didntReceiveCode')}
                    {resendCount > 0 &&
                      ` ${t('phoneVerification.sentCodeCount', {
                        count: resendCount,
                        plural: resendCount > 1 ? 's' : '',
                      })}`}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResendCode}
                    disabled={isResending || !canResend()}
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        {t('phoneVerification.sending')}
                      </>
                    ) : cooldown > 0 ? (
                      t('phoneVerification.resendInSeconds', {
                        seconds: cooldown,
                      })
                    ) : (
                      t('phoneVerification.resendCode')
                    )}
                  </Button>
                </div>

                {/* SMS Tips */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">
                    {t('phoneVerification.smsTips')}
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t('phoneVerification.tip1')}</li>
                    <li>• {t('phoneVerification.tip2')}</li>
                    <li>• {t('phoneVerification.tip3')}</li>
                    <li>• {t('phoneVerification.tip4')}</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6}
                  className="w-full"
                >
                  {t('phoneVerification.verifyPhoneNumber')}
                </Button>

                {/* Demo Mode Actions */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('phoneVerification.demoMode')}
                  </p>
                  <Button
                    variant="outline"
                    onClick={onComplete}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t('phoneVerification.simulateVerified')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
