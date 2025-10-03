import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/store/LanguageContext';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ChangePasswordPageProps {}

export function ChangePasswordPage({}: ChangePasswordPageProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (newPassword.length < 8) {
      setError(t('changePassword.requirement1'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('changePassword.passwordsDoNotMatch'));
      return;
    }

    if (currentPassword === newPassword) {
      setError(t('changePassword.samePassword'));
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      navigate('/profile');
    } catch (error) {
      setError(t('changePassword.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const isValid =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword &&
    newPassword.length >= 8;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {t('changePassword.title')}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {t('changePassword.updatePassword')}
          </h2>
          <p className="text-muted-foreground">
            {t('changePassword.requirements')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current-password">
              {t('changePassword.currentPassword')}
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t('changePassword.enterCurrentPassword')}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() =>
                  setShowCurrentPassword(!showCurrentPassword)
                }
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password">
              {t('changePassword.newPassword')}
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('changePassword.enterNewPassword')}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {newPassword && newPassword.length < 8 && (
              <p className="text-sm text-destructive">
                {t('changePassword.requirement1')}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">
              {t('changePassword.confirmNewPassword')}
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('changePassword.confirmNewPassword')}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-destructive">
                {t('changePassword.passwordsDoNotMatch')}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Password Requirements */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">
              {t('changePassword.passwordRequirements')}:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li
                className={`flex items-center space-x-2 ${
                  newPassword.length >= 8 ? 'text-green-600' : ''
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    newPassword.length >= 8
                      ? 'bg-green-600'
                      : 'bg-muted-foreground'
                  }`}
                />
                <span>{t('changePassword.requirement1')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span>{t('changePassword.requirement2')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span>{t('changePassword.requirement3')}</span>
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading
              ? t('changePassword.updating')
              : t('changePassword.changeButton')}
          </Button>
        </form>
      </div>
    </div>
  );
}
