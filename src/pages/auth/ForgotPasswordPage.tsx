import { Button } from '@/components/ui/button';
import { AuthInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { useLanguage } from '@/store/LanguageContext';
import { ArrowLeft, CheckCircle, Mail, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>(
    'email'
  );
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'email' && !email) {
      setError(t('auth.enterEmailAddress'));
      return;
    }

    if (activeTab === 'phone' && !phone) {
      setError(t('auth.enterPhoneNumber'));
      return;
    }

    setLoading(true);
    try {
      // Here you would integrate with your password reset service
      if (activeTab === 'email') {
        console.log('Password reset requested for email:', email);
      } else {
        console.log(
          'Password reset requested for phone:',
          `${countryCode}${phone}`
        );
      }
      setIsSubmitted(true);
    } catch (error: any) {
      setError(error.message || t('auth.resetEmailFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center p-4 pt-12">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold ml-4">
            {t('auth.checkYourInbox')}
          </h1>
        </div>

        {/* Success Content */}
        <div className="flex-1 px-4 py-6">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {t('auth.resetLinkSent')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {activeTab === 'email'
                ? t('auth.resetLinkSentDescription', {
                    contact: email,
                  })
                : t('auth.resetCodeSentDescription', {
                    contact: `${countryCode}${phone}`,
                  })}
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full"
              >
                {t('auth.tryDifferentMethod')}
              </Button>

              <Button
                onClick={() => navigate('/auth/signin')}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {t('auth.backToSignIn')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 pt-12">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold ml-4">
          {t('auth.resetPassword')}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'email' ? (
                <Mail className="h-8 w-8 text-primary" />
              ) : (
                <Phone className="h-8 w-8 text-primary" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t('auth.forgotPasswordTitle')}
            </h2>
            <p className="text-muted-foreground">
              {activeTab === 'email'
                ? t('auth.resetPasswordEmailDescription')
                : t('auth.resetPasswordPhoneDescription')}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === 'email' && (
              <div className="space-y-1">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  {t('auth.emailAddress')}
                </Label>
                <AuthInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.enterEmailAddress')}
                  required
                />
              </div>
            )}

            {activeTab === 'phone' && (
              <div className="space-y-1">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-foreground"
                >
                  {t('auth.phoneNumber')}
                </Label>
                <PhoneInput
                  phoneValue={phone}
                  countryCode={countryCode}
                  onPhoneChange={setPhone}
                  onCountryCodeChange={setCountryCode}
                  required
                  variant="auth"
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                onClick={() =>
                  setActiveTab(
                    activeTab === 'email' ? 'phone' : 'email'
                  )
                }
                className="p-0 h-auto text-sm font-medium text-primary"
              >
                {activeTab === 'email'
                  ? t('auth.usePhoneInstead')
                  : t('auth.useEmailInstead')}
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl"
              disabled={
                loading ||
                (activeTab === 'email'
                  ? !email.trim()
                  : !phone.trim())
              }
            >
              {loading ? t('auth.sending') : t('auth.sendResetLink')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground text-sm">
              {t('auth.rememberPassword')}{' '}
            </span>
            <Button
              variant="link"
              onClick={() => navigate('/auth/signin')}
              className="p-0 h-auto text-primary text-sm font-medium"
            >
              {t('auth.signIn')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
