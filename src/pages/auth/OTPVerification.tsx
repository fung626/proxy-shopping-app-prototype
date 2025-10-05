import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/store/LanguageContext';
import { useRef, useState } from 'react';

interface OTPVerificationProps {
  email: string;
  loginType: 'email' | 'phone';
  onVerify: (otp: string) => void;
  onBack: () => void;
  isSignUp: boolean;
}

export function OTPVerification({
  email,
  loginType,
  onVerify,
  onBack,
  isSignUp,
}: OTPVerificationProps) {
  const { t } = useLanguage();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      onVerify(otp.join(''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '');

    if (digit.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      // Auto-advance to next input if digit is entered
      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);

      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleResend = () => {
    console.log('Resending OTP...');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto text-center">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-3">
              {t('auth.verifyCode')}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {t('auth.verificationCodeSent')}
            </p>
          </div>

          {/* Demo Info */}
          <div className="mb-8 p-4 bg-card border border-border rounded-xl text-left">
            <h3 className="font-medium text-foreground mb-2">
              {t('auth.demoMode')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('auth.demoModeDescription')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center">
              <div className="flex space-x-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    value={otp[index]}
                    onChange={(e) =>
                      handleInputChange(index, e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-medium bg-input-background border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    maxLength={1}
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {t('auth.resendCodeIn')}{' '}
                <span className="font-medium">00:55</span>
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl mt-8"
              disabled={isLoading || otp.join('').length !== 6}
            >
              {isLoading ? t('auth.verifying') : t('auth.verify')}
            </Button>
          </form>

          <div className="mt-6">
            <Button
              variant="link"
              onClick={handleResend}
              className="text-primary text-sm font-medium"
            >
              {t('auth.resendCode')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
