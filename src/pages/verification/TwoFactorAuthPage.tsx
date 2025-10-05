import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/store/LanguageContext';
import {
  AlertCircle,
  Check,
  CheckCircle,
  Copy,
  Shield,
  Smartphone,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TwoFactorAuthPageProps {}

export function TwoFactorAuthPage({}: TwoFactorAuthPageProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isEnabled, setIsEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState<
    'disabled' | 'setup' | 'verify' | 'enabled'
  >('disabled');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Mock setup key for authenticator app
  const setupKey = 'JBSWY3DPEHPK3PXP';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/ProcurementApp:user@example.com?secret=${setupKey}&issuer=ProcurementApp`;

  const mockBackupCodes = [
    '1234-5678-9012',
    '3456-7890-1234',
    '5678-9012-3456',
    '7890-1234-5678',
    '9012-3456-7890',
    '2345-6789-0123',
    '4567-8901-2345',
    '6789-0123-4567',
  ];

  const handleToggle2FA = () => {
    if (isEnabled) {
      // Disable 2FA
      setIsEnabled(false);
      setSetupStep('disabled');
      setError('');
    } else {
      // Start setup process
      setSetupStep('setup');
      setError('');
    }
  };

  const handleStartSetup = () => {
    setSetupStep('verify');
  };

  const handleVerify = async () => {
    setError('');

    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate backup codes
      setBackupCodes(mockBackupCodes);
      setIsEnabled(true);
      setSetupStep('enabled');
      setVerificationCode('');
    } catch (error) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const copyAllCodes = async () => {
    const allCodes = backupCodes.join('\n');
    try {
      await navigator.clipboard.writeText(allCodes);
      setCopiedCode('all');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy backup codes: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="p-4">
        {setupStep === 'disabled' && (
          <>
            <div className="mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {t('twoFactor.secureAccount')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('twoFactor.description')}
              </p>

              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{t('twoFactor.recommended')}:</strong>{' '}
                  {t('twoFactor.recommendedText')}
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {t('twoFactor.title')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('twoFactor.currentlyDisabled')}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={handleToggle2FA}
                />
              </div>
            </div>
          </>
        )}

        {setupStep === 'setup' && (
          <>
            <div className="mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {t('twoFactor.setupApp')}
              </h2>
              <p className="text-muted-foreground">
                {t('twoFactor.setupDescription')}
              </p>
            </div>

            <div className="space-y-6">
              {/* QR Code */}
              <div className="bg-white p-6 rounded-lg border border-border text-center">
                <img
                  src={qrCodeUrl}
                  alt="QR Code for 2FA setup"
                  className="mx-auto mb-4"
                />
                <p className="text-sm text-muted-foreground">
                  {t('twoFactor.scanQR')}
                </p>
              </div>

              {/* Manual Setup */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">
                  {t('twoFactor.manualSetup')}
                </h4>
                <div className="flex items-center justify-between bg-background p-3 rounded border">
                  <code className="text-sm font-mono">
                    {setupKey}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(setupKey)}
                  >
                    {copiedCode === setupKey ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Setup Instructions */}
              <div className="space-y-3">
                <h4 className="font-medium">
                  {t('twoFactor.setupInstructions')}
                </h4>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                      1
                    </span>
                    <span>{t('twoFactor.instruction1')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                      2
                    </span>
                    <span>{t('twoFactor.instruction2')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                      3
                    </span>
                    <span>{t('twoFactor.instruction3')}</span>
                  </li>
                </ol>
              </div>

              <Button onClick={handleStartSetup} className="w-full">
                {t('twoFactor.addedAccount')}
              </Button>
            </div>
          </>
        )}

        {setupStep === 'verify' && (
          <>
            <div className="mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {t('twoFactor.verifySetup')}
              </h2>
              <p className="text-muted-foreground">
                {t('twoFactor.verifyDescription')}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="verification-code">
                  {t('twoFactor.verificationCode')}
                </Label>
                <Input
                  id="verification-code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(
                      e.target.value.replace(/\D/g, '').slice(0, 6)
                    )
                  }
                  placeholder={t('twoFactor.enterCode')}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSetupStep('setup')}
                  className="flex-1"
                >
                  {t('common.back')}
                </Button>
                <Button
                  onClick={handleVerify}
                  disabled={
                    verificationCode.length !== 6 || isLoading
                  }
                  className="flex-1"
                >
                  {isLoading
                    ? t('twoFactor.verifying')
                    : t('twoFactor.verifyAndEnable')}
                </Button>
              </div>
            </div>
          </>
        )}

        {setupStep === 'enabled' && (
          <>
            <div className="mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {t('twoFactor.enabledSuccess')}
              </h2>
              <p className="text-muted-foreground">
                {t('twoFactor.enabledDescription')}
              </p>
            </div>

            <div className="space-y-6">
              {/* Backup Codes */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-yellow-800">
                    {t('twoFactor.backupCodes')}
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAllCodes}
                    className="text-yellow-700 border-yellow-300"
                  >
                    {copiedCode === 'all' ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {t('twoFactor.copyAll')}
                  </Button>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  {t('twoFactor.backupDescription')}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-2 rounded border"
                    >
                      <code className="text-sm font-mono">
                        {code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(code)}
                      >
                        {copiedCode === code ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">
                      {t('twoFactor.title')}
                    </p>
                    <p className="text-sm text-green-600">
                      {t('twoFactor.currentlyEnabled')}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={handleToggle2FA}
                />
              </div>

              <Button onClick={onComplete} className="w-full">
                {t('common.done')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
