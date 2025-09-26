import { useState } from 'react';
import { ArrowLeft, Fingerprint, Smartphone, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { useLanguage } from '../store/LanguageContext';
import { User } from '../types';

interface BiometricAuthPageProps {
  user?: User | null;
  onBack: () => void;
  onSave?: (data: any) => void;
}

export function BiometricAuthPage({ 
  user,
  onBack,
  onSave
}: BiometricAuthPageProps) {
  const { t } = useLanguage();
  const [biometricEnabled, setBiometricEnabled] = useState(user?.biometricEnabled || false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave && user) {
        onSave({
          ...user,
          biometricEnabled
        });
      }
    } catch (error) {
      console.error('Failed to save biometric settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBiometric = async (enabled: boolean) => {
    if (enabled) {
      // Simulate biometric enrollment process
      try {
        setLoading(true);
        
        // Check if biometric authentication is available
        if (typeof navigator !== 'undefined' && 'credentials' in navigator) {
          // Simulate WebAuthn biometric setup
          await new Promise(resolve => setTimeout(resolve, 1500));
          setBiometricEnabled(true);
        } else {
          // Fallback for devices without biometric support
          setBiometricEnabled(true);
        }
      } catch (error) {
        console.error('Biometric setup failed:', error);
        setBiometricEnabled(false);
      } finally {
        setLoading(false);
      }
    } else {
      setBiometricEnabled(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">{t('biometricAuth.title')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Fingerprint className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t('biometricAuth.enableBiometric')}</h2>
          <p className="text-muted-foreground">
            {t('biometricAuth.enableDescription')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Main Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Fingerprint className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{t('biometricAuth.enableBiometric')}</div>
                  <div className="text-sm text-muted-foreground">{t('biometricAuth.enableDescription')}</div>
                </div>
              </div>
              <Switch 
                checked={biometricEnabled} 
                onCheckedChange={handleToggleBiometric}
                disabled={loading}
              />
            </div>
          </div>

          {/* Information Cards */}
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">{t('biometricAuth.faceIdTitle')}</h3>
                  <p className="text-sm text-muted-foreground">{t('biometricAuth.faceIdDescription')}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Fingerprint className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">{t('biometricAuth.touchIdTitle')}</h3>
                  <p className="text-sm text-muted-foreground">{t('biometricAuth.touchIdDescription')}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">{t('biometricAuth.deviceSecurityTitle')}</h3>
                  <p className="text-sm text-muted-foreground">{t('biometricAuth.deviceSecurityDescription')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">{t('biometricAuth.securityNoticeTitle')}</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span>{t('biometricAuth.securityPoint1')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span>{t('biometricAuth.securityPoint2')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span>{t('biometricAuth.securityPoint3')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span>{t('biometricAuth.securityPoint4')}</span>
              </li>
            </ul>
          </div>

          {/* Current Status */}
          {biometricEnabled && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md">
              <div className="flex items-center space-x-2">
                <Fingerprint className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  {t('biometricAuth.biometricActive')}
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                {t('biometricAuth.biometricActiveDescription')}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            onClick={handleSave}
            className="w-full"
            disabled={loading}
          >
            {loading ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}