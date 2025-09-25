import { useState } from 'react';
import { ArrowLeft, CreditCard, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useLanguage } from '../store/LanguageContext';

interface BankInformationPageProps {
  onBack: () => void;
  onSave?: (bankInfo: BankInformation) => void;
  user?: any;
}

interface BankInformation {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  country: string;
  currency: string;
  swiftCode?: string;
  iban?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export function BankInformationPage({ onBack, onSave, user }: BankInformationPageProps) {
  const { t } = useLanguage();
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showRoutingNumber, setShowRoutingNumber] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Mock existing bank info (in real app, this would come from user data)
  const [bankInfo, setBankInfo] = useState<BankInformation>({
    accountHolderName: user?.name || '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking',
    country: 'US',
    currency: 'USD',
    swiftCode: '',
    iban: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!bankInfo.accountHolderName.trim()) {
      newErrors.accountHolderName = t('bank.errors.accountHolderNameRequired');
    }

    if (!bankInfo.bankName.trim()) {
      newErrors.bankName = t('bank.errors.bankNameRequired');
    }

    if (!bankInfo.accountNumber.trim()) {
      newErrors.accountNumber = t('bank.errors.accountNumberRequired');
    } else if (bankInfo.accountNumber.length < 8) {
      newErrors.accountNumber = t('bank.errors.accountNumberMinLength');
    }

    if (!bankInfo.routingNumber.trim()) {
      newErrors.routingNumber = t('bank.errors.routingNumberRequired');
    } else if (bankInfo.routingNumber.length !== 9) {
      newErrors.routingNumber = t('bank.errors.routingNumberLength');
    }

    if (bankInfo.country !== 'US' && !bankInfo.swiftCode?.trim()) {
      newErrors.swiftCode = t('bank.errors.swiftCodeRequired');
    }

    if (!bankInfo.address.street.trim()) {
      newErrors.street = t('bank.errors.streetRequired');
    }

    if (!bankInfo.address.city.trim()) {
      newErrors.city = t('bank.errors.cityRequired');
    }

    if (!bankInfo.address.zipCode.trim()) {
      newErrors.zipCode = t('bank.errors.zipCodeRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving bank information:', bankInfo);
      onSave?.(bankInfo);
      
      onBack();
    } catch (error) {
      console.error('Error saving bank information:', error);
      setError(t('bank.errors.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const updateBankInfo = (field: string, value: string) => {
    setBankInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const updateAddress = (field: string, value: string) => {
    setBankInfo(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const isInternational = bankInfo.country !== 'US';
  const isValid = bankInfo.accountHolderName && bankInfo.bankName && bankInfo.accountNumber && 
                  bankInfo.address.street && bankInfo.address.city && bankInfo.address.zipCode &&
                  (isInternational ? bankInfo.swiftCode : bankInfo.routingNumber);

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
          <h1 className="text-lg font-semibold">{t('bank.title')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t('bank.addBankInfo')}</h2>
          <p className="text-muted-foreground">
            {t('bank.description')}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Account Holder Name */}
          <div className="space-y-2">
            <Label htmlFor="accountHolderName">{t('bank.fullName')}</Label>
            <Input
              id="accountHolderName"
              value={bankInfo.accountHolderName}
              onChange={(e) => updateBankInfo('accountHolderName', e.target.value)}
              placeholder={t('bank.placeholders.fullName')}
              required
            />
            {errors.accountHolderName && (
              <p className="text-sm text-destructive">{errors.accountHolderName}</p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">{t('bank.country')}</Label>
            <Select value={bankInfo.country} onValueChange={(value) => updateBankInfo('country', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('bank.placeholders.selectCountry')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">{t('countries.unitedStates')}</SelectItem>
                <SelectItem value="CA">{t('countries.canada')}</SelectItem>
                <SelectItem value="GB">{t('countries.unitedKingdom')}</SelectItem>
                <SelectItem value="DE">{t('countries.germany')}</SelectItem>
                <SelectItem value="FR">{t('countries.france')}</SelectItem>
                <SelectItem value="JP">{t('countries.japan')}</SelectItem>
                <SelectItem value="AU">{t('countries.australia')}</SelectItem>
                <SelectItem value="SG">{t('countries.singapore')}</SelectItem>
                <SelectItem value="HK">{t('countries.hongKong')}</SelectItem>
                <SelectItem value="KR">{t('countries.southKorea')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="currency">{t('bank.currency')}</Label>
            <Select value={bankInfo.currency} onValueChange={(value) => updateBankInfo('currency', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('bank.placeholders.selectCurrency')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">{t('currencies.usd')}</SelectItem>
                <SelectItem value="EUR">{t('currencies.eur')}</SelectItem>
                <SelectItem value="GBP">{t('currencies.gbp')}</SelectItem>
                <SelectItem value="JPY">{t('currencies.jpy')}</SelectItem>
                <SelectItem value="CAD">{t('currencies.cad')}</SelectItem>
                <SelectItem value="AUD">{t('currencies.aud')}</SelectItem>
                <SelectItem value="SGD">{t('currencies.sgd')}</SelectItem>
                <SelectItem value="HKD">{t('currencies.hkd')}</SelectItem>
                <SelectItem value="KRW">{t('currencies.krw')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bankName">{t('bank.bankName')}</Label>
            <Input
              id="bankName"
              value={bankInfo.bankName}
              onChange={(e) => updateBankInfo('bankName', e.target.value)}
              placeholder={t('bank.placeholders.bankName')}
              required
            />
            {errors.bankName && (
              <p className="text-sm text-destructive">{errors.bankName}</p>
            )}
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label htmlFor="accountType">{t('bank.accountType')}</Label>
            <Select value={bankInfo.accountType} onValueChange={(value: 'checking' | 'savings') => updateBankInfo('accountType', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('bank.placeholders.selectAccountType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">{t('bank.checkingAccount')}</SelectItem>
                <SelectItem value="savings">{t('bank.savingsAccount')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">{t('bank.accountNumber')}</Label>
            <div className="relative">
              <Input
                id="accountNumber"
                type={showAccountNumber ? 'text' : 'password'}
                value={bankInfo.accountNumber}
                onChange={(e) => updateBankInfo('accountNumber', e.target.value.replace(/\D/g, ''))}
                placeholder={t('bank.placeholders.accountNumber')}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowAccountNumber(!showAccountNumber)}
              >
                {showAccountNumber ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.accountNumber && (
              <p className="text-sm text-destructive">{errors.accountNumber}</p>
            )}
          </div>

          {/* Routing Number for US or SWIFT for International */}
          {!isInternational ? (
            <div className="space-y-2">
              <Label htmlFor="routingNumber">{t('bank.routingNumber')}</Label>
              <div className="relative">
                <Input
                  id="routingNumber"
                  type={showRoutingNumber ? 'text' : 'password'}
                  value={bankInfo.routingNumber}
                  onChange={(e) => updateBankInfo('routingNumber', e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder={t('bank.placeholders.routingNumber')}
                  maxLength={9}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowRoutingNumber(!showRoutingNumber)}
                >
                  {showRoutingNumber ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.routingNumber && (
                <p className="text-sm text-destructive">{errors.routingNumber}</p>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="swiftCode">{t('bank.swiftCode')}</Label>
                <Input
                  id="swiftCode"
                  value={bankInfo.swiftCode || ''}
                  onChange={(e) => updateBankInfo('swiftCode', e.target.value.toUpperCase())}
                  placeholder={t('bank.placeholders.swiftCode')}
                  required
                />
                {errors.swiftCode && (
                  <p className="text-sm text-destructive">{errors.swiftCode}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="iban">{t('bank.iban')}</Label>
                <Input
                  id="iban"
                  value={bankInfo.iban || ''}
                  onChange={(e) => updateBankInfo('iban', e.target.value.toUpperCase())}
                  placeholder={t('bank.placeholders.iban')}
                />
              </div>
            </>
          )}

          {/* Bank Address */}
          <div className="space-y-4">
            <h3 className="font-medium">{t('bank.bankAddress')}</h3>
            
            <div className="space-y-2">
              <Label htmlFor="street">{t('bank.streetAddress')}</Label>
              <Input
                id="street"
                value={bankInfo.address.street}
                onChange={(e) => updateAddress('street', e.target.value)}
                placeholder={t('bank.placeholders.streetAddress')}
                required
              />
              {errors.street && (
                <p className="text-sm text-destructive">{errors.street}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">{t('bank.city')}</Label>
                <Input
                  id="city"
                  value={bankInfo.address.city}
                  onChange={(e) => updateAddress('city', e.target.value)}
                  placeholder={t('bank.placeholders.city')}
                  required
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">{t('bank.stateProvince')}</Label>
                <Input
                  id="state"
                  value={bankInfo.address.state}
                  onChange={(e) => updateAddress('state', e.target.value)}
                  placeholder={t('bank.placeholders.stateProvince')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">{t('bank.zipCode')}</Label>
                <Input
                  id="zipCode"
                  value={bankInfo.address.zipCode}
                  onChange={(e) => updateAddress('zipCode', e.target.value)}
                  placeholder={t('bank.placeholders.zipCode')}
                  required
                />
                {errors.zipCode && (
                  <p className="text-sm text-destructive">{errors.zipCode}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressCountry">{t('bank.addressCountry')}</Label>
                <Select value={bankInfo.address.country} onValueChange={(value) => updateAddress('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('bank.placeholders.selectCountry')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">{t('countries.unitedStates')}</SelectItem>
                    <SelectItem value="CA">{t('countries.canada')}</SelectItem>
                    <SelectItem value="GB">{t('countries.unitedKingdom')}</SelectItem>
                    <SelectItem value="DE">{t('countries.germany')}</SelectItem>
                    <SelectItem value="FR">{t('countries.france')}</SelectItem>
                    <SelectItem value="JP">{t('countries.japan')}</SelectItem>
                    <SelectItem value="AU">{t('countries.australia')}</SelectItem>
                    <SelectItem value="SG">{t('countries.singapore')}</SelectItem>
                    <SelectItem value="HK">{t('countries.hongKong')}</SelectItem>
                    <SelectItem value="KR">{t('countries.southKorea')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Verification Information */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">{t('bank.verificationProcess')}:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span>{t('bank.securityInfo')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span>{t('bank.verificationTime')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span>{t('bank.paymentsInfo')}</span>
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={!isValid || isSaving}
          >
            {isSaving ? t('bank.saving') : t('bank.save')}
          </Button>
        </form>
      </div>
    </div>
  );
}