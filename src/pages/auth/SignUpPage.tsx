import {
  SignUpForm,
  SignUpFormData,
} from '@/components/auth/SignUpForm';
import { Button } from '@/components/ui/button';
import { PreferencesSetup } from '@/pages/auth/PreferencesSetup';
import AuthService from '@/services/authService';
import { useLanguage } from '@/store/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SignUpPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<
    'form' | 'preferences'
  >('form');
  const [formData, setFormData] = useState<SignUpFormData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleBack = () => {
    navigate('/auth/signin');
  };

  const handleFormSubmit = (data: SignUpFormData) => {
    setError('');

    // Validation
    if (!data.firstName.trim()) {
      setError(t('auth.firstNameRequired'));
      return;
    }

    if (!data.lastName.trim()) {
      setError(t('auth.lastNameRequired'));
      return;
    }

    if (!data.nickname.trim()) {
      setError(t('auth.nicknameRequired'));
      return;
    }

    if (!data.email.trim()) {
      setError(t('auth.emailRequired'));
      return;
    }

    if (!data.phone.trim()) {
      setError(t('auth.phoneRequired'));
      return;
    }

    if (!data.gender) {
      setError(t('auth.genderRequired'));
      return;
    }

    if (!data.country) {
      setError(t('auth.countryRequired'));
      return;
    }

    if (data.languages.length === 0) {
      setError(t('auth.languageRequired'));
      return;
    }

    if (data.password.length < 8) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    if (!data.agreeToTerms) {
      setError(t('auth.agreeToTerms'));
      return;
    }

    // Save form data and move to preferences step
    setFormData(data);
    setCurrentStep('preferences');
  };

  const handlePreferencesComplete = async (preferences: {
    categories: string[];
  }) => {
    if (!formData) return;
    setIsLoading(true);
    try {
      const submissionData = {
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        nickname: formData.nickname.trim(),
        phone: formData.phone.trim(),
        country_code: formData.countryCode,
        gender: formData.gender,
        bio: formData.bio.trim(),
        country: formData.country,
        languages: formData.languages,
        avatar: formData.avatar,
      };

      console.log('🔧 SignUpPage submissionData:', submissionData);
      console.log('🔧 SignUpPage preferences:', preferences);

      const { error } = await AuthService.signUp(submissionData);

      if (error) {
        throw error;
      }
      // Show success message and redirect
      navigate('/auth/signin');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || t('auth.signUpFailed'));
      // Go back to form step if there's an error
      setCurrentStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  const handleNavigateToSignIn = () => {
    navigate('/auth/signin');
  };

  const handleNavigateToTerms = () => {
    navigate('/info/terms');
  };

  const handleSocialAuth = async (
    provider: 'google' | 'facebook' | 'apple'
  ) => {
    try {
      setIsLoading(true);
      let error;

      switch (provider) {
        case 'google':
          ({ error } = await AuthService.signInWithGoogle());
          break;
        case 'facebook':
          ({ error } = await AuthService.signInWithFacebook());
          break;
        case 'apple':
          ({ error } = await AuthService.signInWithApple());
          break;
      }

      if (error) {
        setError(error.message || t(`auth.${provider}SignInFailed`));
      }
    } catch (error: any) {
      setError(error.message || t(`auth.${provider}SignInFailed`));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      {/* Content */}
      {currentStep === 'form' ? (
        <SignUpForm
          onSubmit={handleFormSubmit}
          onNavigateToSignIn={handleNavigateToSignIn}
          onNavigateToTerms={handleNavigateToTerms}
          onSocialAuth={handleSocialAuth}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <PreferencesSetup
          onComplete={handlePreferencesComplete}
          onBack={handleBackToForm}
        />
      )}
    </div>
  );
}
