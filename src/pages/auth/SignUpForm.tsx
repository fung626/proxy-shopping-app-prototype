import { Button } from '@/components/ui/button';
import { CountrySelect } from '@/components/ui/country-select';
import { GenderRadioGroup } from '@/components/ui/gender-radio-group';
import { AuthInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageMultiSelect } from '@/components/ui/language-multi-select';
import { PhoneInput } from '@/components/ui/phone-input';
import { Textarea } from '@/components/ui/textarea';
import AuthService from '@/services/authSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { Camera, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  phone: string;
  countryCode: string;
  gender: string;
  bio: string;
  country: string;
  languages: string[];
  password: string;
  confirmPassword: string;
  avatar: File | null;
  agreeToTerms: boolean;
}

export const SignUpForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    phone: '',
    countryCode: '+852',
    gender: '',
    bio: '',
    country: '',
    languages: [],
    password: '',
    confirmPassword: '',
    avatar: null,
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // Cleanup avatar preview URL on unmount
  useEffect(() => {
    return () => {
      if (formData.avatar) {
        URL.revokeObjectURL(URL.createObjectURL(formData.avatar));
      }
    };
  }, [formData.avatar]);

  const updateFormData = (
    field: keyof SignUpFormData,
    value: string | boolean | File | null | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (_: React.FormEvent) => {
    setError('');
    // Validation
    if (!formData.nickname.trim()) {
      setError(t('auth.nicknameRequired'));
      return;
    }
    if (!formData.email.trim()) {
      setError(t('auth.emailRequired'));
      return;
    }
    if (formData.password.length < 8) {
      setError(t('auth.passwordTooShort'));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }
    if (!formData.agreeToTerms) {
      setError(t('auth.agreeToTerms'));
      return;
    }

    sessionStorage.setItem(
      'signupFormData',
      JSON.stringify(formData)
    );
    navigate('/auth/signup-preferences');
  };

  const handleSocialAuth = async (
    provider: 'google' | 'facebook' | 'apple'
  ) => {
    try {
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
    <div className="flex-1 px-6 py-8">
      <div className="max-w-sm mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-3">
            {t('auth.createAccount')}
          </h1>
          <p className="text-muted-foreground">
            {t('auth.joinPlatform')}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Upload */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-foreground">
              {t('auth.profilePicture')}
            </Label>
            <div className="flex justify-center">
              <div className="relative">
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    updateFormData('avatar', file);
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById('avatar')?.click()
                  }
                  className="w-20 h-20 bg-muted/20 border-2 border-dashed border-muted rounded-full flex items-center justify-center overflow-hidden hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  {formData.avatar ? (
                    <img
                      src={URL.createObjectURL(formData.avatar)}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-6 w-6 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              {t('auth.name')}
            </Label>
            <AuthInput
              id="name"
              value={formData.firstName}
              onChange={(e) =>
                updateFormData('firstName', e.target.value)
              }
              placeholder={t('auth.firstName')}
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-foreground"
            >
              {t('auth.lastName')}
            </Label>
            <AuthInput
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                updateFormData('lastName', e.target.value)
              }
              placeholder={t('auth.lastName')}
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="nickname"
              className="text-sm font-medium text-foreground"
            >
              {t('auth.nickname')}
            </Label>
            <AuthInput
              id="nickname"
              value={formData.nickname}
              onChange={(e) =>
                updateFormData('nickname', e.target.value)
              }
              placeholder={t('auth.nickname')}
              required
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              {t('auth.gender')}
            </Label>
            <GenderRadioGroup
              value={formData.gender}
              onValueChange={(value) =>
                updateFormData('gender', value)
              }
              variant="default"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              {t('auth.email')}
            </Label>
            <AuthInput
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                updateFormData('email', e.target.value)
              }
              placeholder="johndoe@email.com"
              required
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-foreground"
            >
              {t('auth.phoneNo')}
            </Label>
            <PhoneInput
              phoneValue={formData.phone}
              countryCode={formData.countryCode}
              onPhoneChange={(value) =>
                updateFormData('phone', value)
              }
              onCountryCodeChange={(value) =>
                updateFormData('countryCode', value)
              }
              variant="auth"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="country"
              className="text-sm font-medium text-foreground"
            >
              {t('auth.country')}
            </Label>
            <CountrySelect
              value={formData.country}
              onValueChange={(value) =>
                updateFormData('country', value)
              }
              placeholder="Select your country"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="bio"
              className="text-sm font-medium text-foreground"
            >
              {t('auth.bio')}
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => updateFormData('bio', e.target.value)}
              placeholder={t('auth.tellUsAboutYourself')}
              className="min-h-[80px] resize-none"
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.bio.length}/300
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm font-medium text-foreground">
              {t('auth.languages')}
            </Label>
            <LanguageMultiSelect
              value={formData.languages}
              onValueChange={(value) =>
                updateFormData('languages', value)
              }
              placeholder={t('auth.selectLanguages')}
              maxSelected={5}
            />
            <p className="text-xs text-muted-foreground">
              {t('auth.languagesHelp')}
            </p>
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              {t('auth.password')}
            </Label>
            <div className="relative">
              <AuthInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) =>
                  updateFormData('password', e.target.value)
                }
                placeholder="●●●●●●●●●●●●"
                required
                className="pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground"
            >
              {t('auth.confirmPassword')}
            </Label>
            <div className="relative">
              <AuthInput
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) =>
                  updateFormData('confirmPassword', e.target.value)
                }
                placeholder="●●●●●●●●●●●●"
                required
                className="pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 hover:bg-transparent"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-start space-x-3 pt-2">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) =>
                updateFormData('agreeToTerms', e.target.checked)
              }
              className="mt-0.5 w-4 h-4 text-primary border-muted rounded focus:ring-primary focus:ring-2"
              required
            />
            <div className="text-sm text-muted-foreground leading-relaxed">
              {t('auth.agreeWith')}{' '}
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/info/terms')}
                className="p-0 h-auto text-primary text-sm font-medium underline"
              >
                {t('auth.termsConditions')}
              </Button>
            </div>
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl mt-8"
            disabled={isLoading}
          >
            {isLoading
              ? t('auth.creatingAccount')
              : t('auth.continueToPreferences')}
          </Button>
        </form>
        {/* Social Login */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-4 text-muted-foreground">
                {t('auth.orSignUpWith')}
              </span>
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-6">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full border border-muted hover:bg-muted/50"
              onClick={() => handleSocialAuth('facebook')}
              disabled={isLoading}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="#1877F2"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full border border-muted hover:bg-muted/50"
              onClick={() => handleSocialAuth('google')}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full border border-muted hover:bg-muted/50"
              onClick={() => handleSocialAuth('apple')}
              disabled={isLoading}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="#000000"
              >
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="mt-8 text-center">
          <span className="text-muted-foreground text-sm">
            {t('auth.alreadyHaveAccount')}{' '}
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
  );
};
