import { SignUpFormData } from '@/components/auth/SignUpForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AuthService from '@/services/authSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { CATEGORIES, getCategoryName } from '@/utils/categories';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SignUpPreferencesPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<
    string[]
  >([]);
  const [formData, setFormData] = useState<SignUpFormData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Get form data from sessionStorage
    const storedData = sessionStorage.getItem('signupFormData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing stored form data:', error);
        // Redirect back to signup if data is invalid
        navigate('/auth/signup');
      }
    } else {
      // Redirect back to signup if no data found
      navigate('/auth/signup');
    }
  }, [navigate]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleComplete = async () => {
    if (selectedCategories.length === 0) {
      alert(t('preferences.selectAtLeastOne'));
      return;
    }

    if (!formData) {
      navigate('/auth/signup');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const preferences = selectedCategories.map(
        (id) =>
          CATEGORIES.find((cat) => cat.id === id)?.translationKey ||
          id
      );

      const submissionData = {
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        nickname: formData.nickname.trim(),
        phone: formData.phone.trim(),
        countryCode: formData.countryCode,
        gender: formData.gender,
        bio: formData.bio.trim(),
        country: formData.country,
        languages: formData.languages,
        avatar: formData.avatar,
        preferences: preferences,
      };

      console.log(
        '🔧 SignUpPreferencesPage submissionData:',
        submissionData
      );

      const { error } = await AuthService.signUp(submissionData);

      if (error) {
        throw error;
      }

      // Clear stored form data
      sessionStorage.removeItem('signupFormData');

      // Show success message and redirect
      navigate('/auth/signin');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || t('auth.signUpFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/auth/signup');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">
          {t('preferences.setup')}
        </h1>
        <div className="w-10" /> {/* Spacer for center alignment */}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 pb-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t('preferences.chooseInterests')}
            </h2>
            <p className="text-muted-foreground">
              {t('preferences.description')}
            </p>
          </div>

          {/* Category Selection */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-3">
                {t('preferences.productCategories')} (
                {selectedCategories.length}{' '}
                {t('preferences.selected')})
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((category) => {
                  const isSelected = selectedCategories.includes(
                    category.id
                  );
                  const IconComponent = category.icon;

                  return (
                    <Button
                      key={category.id}
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => toggleCategory(category.id)}
                      className={`h-auto py-5 px-3 flex flex-col items-center justify-center text-center relative min-h-[120px] ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : ''
                      }`}
                    >
                      {isSelected && (
                        <Check className="absolute top-2 right-2 h-4 w-4" />
                      )}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                          isSelected
                            ? 'bg-primary-foreground/20'
                            : 'bg-red-100'
                        }`}
                      >
                        <IconComponent
                          className={`h-6 w-6 ${
                            isSelected
                              ? 'text-primary-foreground'
                              : 'text-red-600'
                          }`}
                        />
                      </div>
                      <div className="text-sm font-medium">
                        {getCategoryName(category.id, t)}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Selected Categories Preview */}
            {selectedCategories.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  {t('preferences.selectedCategories')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((categoryId) => {
                    return (
                      <Badge key={categoryId} variant="secondary">
                        {getCategoryName(categoryId, t)}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Continue Button */}
          <div className="mt-8">
            <Button
              onClick={handleComplete}
              className="w-full"
              disabled={selectedCategories.length === 0 || isLoading}
            >
              {isLoading
                ? t('common.loading')
                : t('preferences.completeSetup')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
