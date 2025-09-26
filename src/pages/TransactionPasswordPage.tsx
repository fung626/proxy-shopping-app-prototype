import { useState, useRef } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { useLanguage } from '../store/LanguageContext';
import { User } from '../types';

interface TransactionPasswordPageProps {
  user?: User | null;
  onBack: () => void;
  onSave?: (data: any) => void;
}

export function TransactionPasswordPage({ 
  user,
  onBack,
  onSave
}: TransactionPasswordPageProps) {
  const { t } = useLanguage();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState(['', '', '', '', '', '']);
  const [confirmPassword, setConfirmPassword] = useState(['', '', '', '', '', '']);
  const [isEnabled, setIsEnabled] = useState(user?.transactionPasswordEnabled || false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const currentPasswordRefs = useRef<(HTMLInputElement | null)[]>([]);
  const newPasswordRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPasswordRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (isEnabled) {
      const currentPasswordString = currentPassword.join('');
      const newPasswordString = newPassword.join('');
      const confirmPasswordString = confirmPassword.join('');

      if (!user?.transactionPasswordEnabled && !currentPasswordString) {
        // If enabling for first time, don't require current password
      } else if (user?.transactionPasswordEnabled && (!currentPasswordString || currentPasswordString.length !== 6)) {
        newErrors.currentPassword = t('transactionPassword.currentPasswordRequired');
      }

      if (!newPasswordString || newPasswordString.length !== 6) {
        newErrors.newPassword = t('transactionPassword.newPasswordRequired');
      }

      if (!confirmPasswordString || confirmPasswordString.length !== 6) {
        newErrors.confirmPassword = t('transactionPassword.confirmPasswordRequired');
      } else if (newPasswordString !== confirmPasswordString) {
        newErrors.confirmPassword = t('transactionPassword.passwordsDoNotMatch');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Separate validation check that doesn't cause side effects
  const isFormValid = () => {
    if (!isEnabled) return true;

    const currentPasswordString = currentPassword.join('');
    const newPasswordString = newPassword.join('');
    const confirmPasswordString = confirmPassword.join('');

    const hasCurrentPasswordError = user?.transactionPasswordEnabled && (!currentPasswordString || currentPasswordString.length !== 6);
    const hasNewPasswordError = !newPasswordString || newPasswordString.length !== 6;
    const hasConfirmPasswordError = !confirmPasswordString || confirmPasswordString.length !== 6 || newPasswordString !== confirmPasswordString;

    return !hasCurrentPasswordError && !hasNewPasswordError && !hasConfirmPasswordError;
  };

  // Input handlers for PIN-style inputs
  const handleInputChange = (index: number, value: string, type: 'current' | 'new' | 'confirm') => {
    // Only allow digits
    const digit = value.replace(/\D/g, '');
    
    if (digit.length <= 1) {
      let newArray;
      let refs;
      
      if (type === 'current') {
        newArray = [...currentPassword];
        refs = currentPasswordRefs.current;
        newArray[index] = digit;
        setCurrentPassword(newArray);
      } else if (type === 'new') {
        newArray = [...newPassword];
        refs = newPasswordRefs.current;
        newArray[index] = digit;
        setNewPassword(newArray);
      } else {
        newArray = [...confirmPassword];
        refs = confirmPasswordRefs.current;
        newArray[index] = digit;
        setConfirmPassword(newArray);
      }
      
      // Auto-advance to next input if digit is entered
      if (digit && index < 5) {
        refs[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, type: 'current' | 'new' | 'confirm') => {
    let passwordArray;
    let refs;
    
    if (type === 'current') {
      passwordArray = currentPassword;
      refs = currentPasswordRefs.current;
    } else if (type === 'new') {
      passwordArray = newPassword;
      refs = newPasswordRefs.current;
    } else {
      passwordArray = confirmPassword;
      refs = confirmPasswordRefs.current;
    }
    
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !passwordArray[index] && index > 0) {
      refs[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, type: 'current' | 'new' | 'confirm') => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData) {
      let newArray;
      let refs;
      
      if (type === 'current') {
        newArray = [...currentPassword];
        refs = currentPasswordRefs.current;
        setCurrentPassword(prev => {
          const updated = [...prev];
          for (let i = 0; i < 6; i++) {
            updated[i] = pastedData[i] || '';
          }
          return updated;
        });
      } else if (type === 'new') {
        newArray = [...newPassword];
        refs = newPasswordRefs.current;
        setNewPassword(prev => {
          const updated = [...prev];
          for (let i = 0; i < 6; i++) {
            updated[i] = pastedData[i] || '';
          }
          return updated;
        });
      } else {
        newArray = [...confirmPassword];
        refs = confirmPasswordRefs.current;
        setConfirmPassword(prev => {
          const updated = [...prev];
          for (let i = 0; i < 6; i++) {
            updated[i] = pastedData[i] || '';
          }
          return updated;
        });
      }
      
      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedData.length, 5);
      refs[nextIndex]?.focus();
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        transactionPasswordEnabled: isEnabled,
        transactionPasswordSet: isEnabled && newPassword ? true : user?.transactionPasswordSet || false
      };

      onSave?.(updatedUser);
    } catch (error) {
      console.error('Failed to update transaction password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (!enabled) {
      // Clear form when disabling
      setCurrentPassword(['', '', '', '', '', '']);
      setNewPassword(['', '', '', '', '', '']);
      setConfirmPassword(['', '', '', '', '', '']);
      setErrors({});
    }
  };

  const hasExistingPassword = user?.transactionPasswordEnabled && user?.transactionPasswordSet;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto">
          {/* Title */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-semibold text-foreground mb-3">{t('transactionPassword.title')}</h1>
            <p className="text-muted-foreground leading-relaxed">
              {t('transactionPassword.enableDescription')}
            </p>
          </div>

          {/* Enable/Disable Toggle */}
          <div className="mb-8 p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground mb-1">{t('transactionPassword.enableTitle')}</h3>
                <p className="text-sm text-muted-foreground">
                  {isEnabled ? t('transactionPassword.enabled') : t('transactionPassword.disabled')}
                </p>
              </div>
              <Switch
                checked={isEnabled}
                onCheckedChange={handleToggleEnabled}
              />
            </div>
          </div>

          {/* Password Form - Only show if enabled */}
          {isEnabled && (
            <div className="space-y-6">
              {/* Current Password - Only if user already has one */}
              {hasExistingPassword && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      {t('transactionPassword.currentPassword')}
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex space-x-3">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <Input
                          key={index}
                          ref={(el) => (currentPasswordRefs.current[index] = el)}
                          type={showCurrentPassword ? "text" : "password"}
                          inputMode="numeric"
                          value={currentPassword[index]}
                          onChange={(e) => handleInputChange(index, e.target.value, 'current')}
                          onKeyDown={(e) => handleKeyDown(index, e, 'current')}
                          onPaste={(e) => handlePaste(e, 'current')}
                          className={`w-12 h-12 text-center text-lg font-medium bg-muted/20 border-muted rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.currentPassword ? 'border-red-500' : ''}`}
                          maxLength={1}
                          autoComplete="off"
                        />
                      ))}
                    </div>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-red-500 text-center">{errors.currentPassword}</p>
                  )}
                </div>
              )}

              {/* New Password */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    {hasExistingPassword ? 
                      t('transactionPassword.newPassword') : 
                      t('transactionPassword.password')
                    }
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <div className="flex justify-center">
                  <div className="flex space-x-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <Input
                        key={index}
                        ref={(el) => (newPasswordRefs.current[index] = el)}
                        type={showNewPassword ? "text" : "password"}
                        inputMode="numeric"
                        value={newPassword[index]}
                        onChange={(e) => handleInputChange(index, e.target.value, 'new')}
                        onKeyDown={(e) => handleKeyDown(index, e, 'new')}
                        onPaste={(e) => handlePaste(e, 'new')}
                        className={`w-12 h-12 text-center text-lg font-medium bg-muted/20 border-muted rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.newPassword ? 'border-red-500' : ''}`}
                        maxLength={1}
                        autoComplete="off"
                      />
                    ))}
                  </div>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500 text-center">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    {t('transactionPassword.confirmPassword')}
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <div className="flex justify-center">
                  <div className="flex space-x-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <Input
                        key={index}
                        ref={(el) => (confirmPasswordRefs.current[index] = el)}
                        type={showConfirmPassword ? "text" : "password"}
                        inputMode="numeric"
                        value={confirmPassword[index]}
                        onChange={(e) => handleInputChange(index, e.target.value, 'confirm')}
                        onKeyDown={(e) => handleKeyDown(index, e, 'confirm')}
                        onPaste={(e) => handlePaste(e, 'confirm')}
                        className={`w-12 h-12 text-center text-lg font-medium bg-muted/20 border-muted rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        maxLength={1}
                        autoComplete="off"
                      />
                    ))}
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 text-center">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="text-sm font-medium mb-3 text-foreground">{t('transactionPassword.requirements')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      newPassword.join('').length === 6 ? 'bg-green-500' : 'bg-muted-foreground'
                    }`}>
                      {newPassword.join('').length === 6 && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      newPassword.join('').length === 6 ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {t('transactionPassword.requirementLength')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      newPassword.join('') === confirmPassword.join('') && newPassword.join('').length === 6 ? 'bg-green-500' : 'bg-muted-foreground'
                    }`}>
                      {newPassword.join('') === confirmPassword.join('') && newPassword.join('').length === 6 && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      newPassword.join('') === confirmPassword.join('') && newPassword.join('').length === 6 ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {t('transactionPassword.requirementMatch')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={loading || !isFormValid()}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl mt-8"
              >
                {loading ? t('common.saving') : t('common.save')}
              </Button>
            </div>
          )}

          {/* Information */}
          <div className="mt-8 p-4 transaction-password-info-box rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 transaction-password-info-icon-bg rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium transaction-password-info-title mb-1">
                  {t('transactionPassword.infoTitle')}
                </h4>
                <p className="text-sm transaction-password-info-text leading-relaxed">
                  {t('transactionPassword.infoDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}