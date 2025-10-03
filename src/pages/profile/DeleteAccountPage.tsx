import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/store/LanguageContext';
import { AlertTriangle, ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function DeleteAccountPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [understoodConsequences, setUnderstoodConsequences] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!password) {
      setError(t('deleteAccount.passwordRequired'));
      return;
    }

    if (!understoodConsequences) {
      setError(t('deleteAccount.confirmUnderstanding'));
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, delete account and logout
      console.log('Account deleted');

      // Navigate to home page
      navigate('/');
    } catch (error) {
      setError(t('deleteAccount.deleteError'));
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = password && understoodConsequences;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {t('deleteAccount.title')}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {t('deleteAccount.deleteYourAccount')}
          </h2>
          <p className="text-muted-foreground">
            {t('deleteAccount.warning')}
          </p>
        </div>

        {/* Warning Section */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900 mb-2">
                {t('deleteAccount.whatWillBeDeleted')}
              </h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• {t('deleteAccount.profileInfo')}</li>
                <li>• {t('deleteAccount.requestsOrders')}</li>
                <li>• {t('deleteAccount.messageHistory')}</li>
                <li>• {t('deleteAccount.verificationStatus')}</li>
                <li>• {t('deleteAccount.paymentMethods')}</li>
                <li>• {t('deleteAccount.preferences')}</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Confirmation */}
          <div className="space-y-2">
            <Label htmlFor="password">
              {t('deleteAccount.confirmPassword')}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('deleteAccount.enterPassword')}
              required
            />
          </div>

          {/* Consequences Checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="consequences"
              checked={understoodConsequences}
              onCheckedChange={(checked) =>
                setUnderstoodConsequences(checked as boolean)
              }
            />
            <Label
              htmlFor="consequences"
              className="text-sm leading-relaxed"
            >
              {t('deleteAccount.understandingText')}
            </Label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Alternative Actions */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">
              {t('deleteAccount.alternatives')}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {t('deleteAccount.alternative1')}</li>
              <li>• {t('deleteAccount.alternative2')}</li>
              <li>• {t('deleteAccount.alternative3')}</li>
              <li>• {t('deleteAccount.alternative4')}</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              type="submit"
              variant="destructive"
              className="w-full"
              disabled={!isValid || isLoading}
            >
              {isLoading
                ? t('deleteAccount.deleting')
                : t('deleteAccount.deleteMyAccount')}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/profile')}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
