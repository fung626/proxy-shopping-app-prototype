import { Button } from '@/components/ui/button';
import { AuthInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import authSupabaseService from '@/services/authSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { CheckCircle, Lock } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError(t('auth.enterPasswordAndConfirm'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    const code = searchParams.get('code');
    if (!code) {
      setError(t('auth.invalidResetToken'));
      return;
    }

    setLoading(true);
    try {
      const { error } = await authSupabaseService.updatePassword(
        code,
        password
      );
      if (error) {
        throw new Error(error.message);
      }
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || t('auth.resetPasswordFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 px-4 py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {t('auth.passwordResetSuccess')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('auth.passwordResetSuccessDescription')}
            </p>
            <Button
              onClick={() => navigate('/auth/signin')}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {t('auth.backToSignIn')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t('auth.resetPasswordTitle')}
            </h2>
            <p className="text-muted-foreground">
              {t('auth.resetPasswordDescription')}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                {t('auth.newPassword')}
              </Label>
              <AuthInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.enterNewPassword')}
                required
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                {t('auth.confirmPassword')}
              </Label>
              <AuthInput
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.confirmNewPassword')}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl"
              disabled={
                loading || !password.trim() || !confirmPassword.trim()
              }
            >
              {loading ? t('auth.saving') : t('auth.saveNewPassword')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
