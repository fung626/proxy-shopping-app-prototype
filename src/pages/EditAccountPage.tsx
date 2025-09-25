import { useState } from 'react';
import { ArrowLeft, User as UserIcon, Mail, Phone, Calendar, Camera, Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { PhoneInput } from '../components/ui/phone-input';
import { GenderRadioGroup } from '../components/ui/gender-radio-group';
import { CountrySelect } from '../components/ui/country-select';
import { LanguageMultiSelect } from '../components/ui/language-multi-select';
import { useLanguage } from '../store/LanguageContext';
import { User } from '../types';

interface EditAccountPageProps {
  user: User;
  onBack: () => void;
  onSave: (updatedUser: User) => void;
}

export function EditAccountPage({ user, onBack, onSave }: EditAccountPageProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: user.name?.split(' ')[0] || '',
    lastName: user.name?.split(' ').slice(1).join(' ') || '',
    nickname: user.nickname || '',
    gender: user.gender || '',
    email: user.email || '',
    phone: user.phone ? user.phone.replace(/^\+\d+/, '') : '', // Extract phone without country code
    countryCode: user.phone ? user.phone.match(/^\+\d+/)?.[0] || '+1' : '+1', // Extract country code or default
    bio: user.bio || '',
    country: user.country || '',
    languages: user.languages || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatar || '');

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setHasChanges(true);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarRemove = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    setHasChanges(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('validation.firstNameRequired');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('validation.lastNameRequired');
    }

    if (!formData.nickname.trim()) {
      newErrors.nickname = t('validation.nicknameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.emailInvalid');
    }

    if (formData.phone && !/^[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = t('validation.phoneInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedUser: User = {
        ...user,
        name: `${formData.firstName} ${formData.lastName}`,
        nickname: formData.nickname,
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone ? `${formData.countryCode}${formData.phone.replace(/\D/g, '')}` : '',
        bio: formData.bio,
        country: formData.country,
        languages: formData.languages
      };
      
      // Add avatar to updated user
      updatedUser.avatar = avatarPreview;

      onSave(updatedUser);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      // In a real app, you might want to show a confirmation dialog
      console.log('Changes will be lost');
    }
    onBack();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCancel}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">{t('editProfile.title')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Profile Info Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={avatarPreview} alt="Profile picture" />
                <AvatarFallback className="bg-red-100 text-red-600">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              
              {/* Camera button overlay */}
              <label 
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
              >
                <Camera className="h-4 w-4 text-primary-foreground" />
              </label>
              
              {/* Hidden file input */}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              
              {/* Remove button */}
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleAvatarRemove}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-lg"
                >
                  <X className="h-3 w-3 text-destructive-foreground" />
                </button>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{t('editProfile.title')}</h2>
              <p className="text-muted-foreground">
                {t('editProfile.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('editProfile.firstName')} *</label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                placeholder={t('editProfile.firstNamePlaceholder')}
                className="bg-input-background border-border"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('editProfile.lastName')} *</label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateFormData('lastName', e.target.value)}
                placeholder={t('editProfile.lastNamePlaceholder')}
                className="bg-input-background border-border"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('editProfile.nickname')} *</label>
            <Input
              id="nickname"
              value={formData.nickname}
              onChange={(e) => updateFormData('nickname', e.target.value)}
              placeholder={t('editProfile.nicknamePlaceholder')}
              className="bg-input-background border-border"
            />
            {errors.nickname && (
              <p className="text-sm text-destructive mt-1">{errors.nickname}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">{t('editProfile.gender')}</label>
            <GenderRadioGroup
              value={formData.gender}
              onValueChange={(value) => updateFormData('gender', value)}
              variant="compact"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('editProfile.email')} *</label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder={t('editProfile.emailPlaceholder')}
              className="bg-input-background border-border"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone No. */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('editProfile.phone')}</label>
            <PhoneInput
              phoneValue={formData.phone}
              onPhoneChange={(value) => updateFormData('phone', value)}
              countryCode={formData.countryCode}
              onCountryCodeChange={(code) => updateFormData('countryCode', code)}
              placeholder={t('editProfile.phonePlaceholder')}
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('editProfile.country')}</label>
            <CountrySelect
              value={formData.country}
              onValueChange={(value) => updateFormData('country', value)}
              placeholder={t('editProfile.selectCountry')}
              className="bg-input-background border-border"
            />
            {errors.country && (
              <p className="text-sm text-destructive mt-1">{errors.country}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('editProfile.bio')}</label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => updateFormData('bio', e.target.value)}
              placeholder={t('editProfile.bioPlaceholder')}
              className="bg-input-background border-border min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio}</p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {formData.bio.length}/500
              </p>
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('editProfile.languages')}</label>
            <LanguageMultiSelect
              value={formData.languages}
              onValueChange={(value) => updateFormData('languages', value)}
              placeholder={t('editProfile.selectLanguages')}
              className="bg-input-background border-border"
              maxSelected={5}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('editProfile.languagesHelp')}
            </p>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-8 mb-8">
          <Button 
            onClick={handleSave}
            className="flex-1"
            disabled={isLoading || !hasChanges}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('editProfile.saving')}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span>{t('common.save')}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}