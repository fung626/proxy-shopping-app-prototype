import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/store/LanguageContext';
import { CreditCard, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface CreditCardInfo {
  id: string;
  cardNumber: string;
  expiryDate: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  billingEmail: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  isDefault: boolean;
  nickname?: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface AddCreditCardPageProps {
  onBack: () => void;
  onSave: (card: CreditCardInfo) => void;
  user?: any;
}

export function AddCreditCardPage({
  onBack,
  onSave,
  user,
}: AddCreditCardPageProps) {
  const { t } = useLanguage();
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [cardData, setCardData] = useState<Partial<CreditCardInfo>>({
    cardNumber: '',
    expiryDate: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: user?.name || '',
    billingEmail: user?.email || '',
    cardType: 'visa',
    isDefault: false,
    nickname: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
  });

  const cardTypeFromNumber = (
    number: string
  ): CreditCardInfo['cardType'] => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2'))
      return 'mastercard';
    if (cleaned.startsWith('3')) return 'amex';
    if (cleaned.startsWith('6')) return 'discover';
    return 'other';
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/\d{1,4}/g);
    return match ? match.join(' ') : '';
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const parseExpiryDate = (expiryDate: string) => {
    const parts = expiryDate.split('/');
    if (parts.length === 2) {
      const month = parts[0].padStart(2, '0');
      const year = '20' + parts[1]; // Convert YY to YYYY
      return { month, year };
    }
    return { month: '', year: '' };
  };

  const getCardIcon = (cardType: CreditCardInfo['cardType']) => {
    const iconClass =
      'w-8 h-6 rounded border bg-white flex items-center justify-center text-xs font-bold';
    switch (cardType) {
      case 'visa':
        return (
          <div className={`${iconClass} text-blue-600`}>VISA</div>
        );
      case 'mastercard':
        return <div className={`${iconClass} text-red-600`}>MC</div>;
      case 'amex':
        return (
          <div className={`${iconClass} text-green-600`}>AMEX</div>
        );
      case 'discover':
        return (
          <div className={`${iconClass} text-orange-600`}>DISC</div>
        );
      default:
        return (
          <CreditCard className="w-6 h-6 text-muted-foreground" />
        );
    }
  };

  const validateForm = () => {
    if (
      !cardData.cardNumber ||
      !cardData.expiryDate ||
      !cardData.cvv
    ) {
      setError(t('addCreditCard.errorFillFields'));
      return false;
    }
    if (cardData.expiryDate && cardData.expiryDate.length < 5) {
      setError(t('addCreditCard.errorValidExpiry'));
      return false;
    }
    if (!cardData.cardholderName) {
      setError(t('addCreditCard.errorCardholderName'));
      return false;
    }
    if (!cardData.billingEmail) {
      setError(t('addCreditCard.errorBillingEmail'));
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { month, year } = parseExpiryDate(cardData.expiryDate!);

      const cardToSave: CreditCardInfo = {
        id: Date.now().toString(),
        cardNumber: cardData.cardNumber!,
        expiryDate: cardData.expiryDate!,
        expiryMonth: month,
        expiryYear: year,
        cvv: cardData.cvv!,
        cardholderName: cardData.cardholderName!,
        billingEmail: cardData.billingEmail!,
        cardType: cardTypeFromNumber(cardData.cardNumber!),
        isDefault: cardData.isDefault!,
        nickname: cardData.nickname,
        billingAddress: cardData.billingAddress!,
      };

      onSave(cardToSave);
    } catch (err) {
      setError(t('addCreditCard.errorSaveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="p-4">
        <div className="mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {t('addCreditCard.subtitle')}
          </h2>
          <p className="text-muted-foreground">
            {t('addCreditCard.description')}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md mb-6">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">
              {t('addCreditCard.cardNumber')} *
            </Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder={t('addCreditCard.cardNumberPlaceholder')}
                value={cardData.cardNumber || ''}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  if (formatted.replace(/\s/g, '').length <= 16) {
                    setCardData((prev) => ({
                      ...prev,
                      cardNumber: formatted,
                    }));
                  }
                }}
                type={showCardNumber ? 'text' : 'password'}
                className="pr-20"
                maxLength={19}
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                {cardData.cardNumber &&
                  getCardIcon(
                    cardTypeFromNumber(cardData.cardNumber)
                  )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCardNumber(!showCardNumber)}
                  className="h-6 w-6 p-0"
                >
                  {showCardNumber ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">
                {t('addCreditCard.expiryDate')} *
              </Label>
              <Input
                id="expiryDate"
                placeholder={t('addCreditCard.expiryPlaceholder')}
                value={cardData.expiryDate || ''}
                onChange={(e) => {
                  const formatted = formatExpiryDate(e.target.value);
                  setCardData((prev) => ({
                    ...prev,
                    expiryDate: formatted,
                  }));
                }}
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">{t('addCreditCard.cvv')} *</Label>
              <div className="relative">
                <Input
                  id="cvv"
                  placeholder={t('addCreditCard.cvvPlaceholder')}
                  value={cardData.cvv || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 4) {
                      setCardData((prev) => ({
                        ...prev,
                        cvv: value,
                      }));
                    }
                  }}
                  type={showCvv ? 'text' : 'password'}
                  className="pr-8"
                  maxLength={4}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCvv(!showCvv)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                >
                  {showCvv ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="cardholderName">
              {t('addCreditCard.cardholderName')} *
            </Label>
            <Input
              id="cardholderName"
              placeholder={t('addCreditCard.cardholderPlaceholder')}
              value={cardData.cardholderName || ''}
              onChange={(e) =>
                setCardData((prev) => ({
                  ...prev,
                  cardholderName: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* Billing Email */}
          <div className="space-y-2">
            <Label htmlFor="billingEmail">
              {t('addCreditCard.billingEmail')} *
            </Label>
            <Input
              id="billingEmail"
              type="email"
              placeholder={t('addCreditCard.billingEmailPlaceholder')}
              value={cardData.billingEmail || ''}
              onChange={(e) =>
                setCardData((prev) => ({
                  ...prev,
                  billingEmail: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* Card Nickname */}
          <div className="space-y-2">
            <Label htmlFor="nickname">
              {t('addCreditCard.nickname')}
            </Label>
            <Input
              id="nickname"
              placeholder={t('addCreditCard.nicknamePlaceholder')}
              value={cardData.nickname || ''}
              onChange={(e) =>
                setCardData((prev) => ({
                  ...prev,
                  nickname: e.target.value,
                }))
              }
            />
          </div>

          {/* Billing Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t('addCreditCard.billingAddress')}
            </h3>

            <div className="space-y-2">
              <Label htmlFor="street">
                {t('addCreditCard.streetAddress')}
              </Label>
              <Input
                id="street"
                placeholder={t('addCreditCard.streetPlaceholder')}
                value={cardData.billingAddress?.street || ''}
                onChange={(e) =>
                  setCardData((prev) => ({
                    ...prev,
                    billingAddress: {
                      ...prev.billingAddress!,
                      street: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">
                  {t('addCreditCard.city')}
                </Label>
                <Input
                  id="city"
                  placeholder={t('addCreditCard.cityPlaceholder')}
                  value={cardData.billingAddress?.city || ''}
                  onChange={(e) =>
                    setCardData((prev) => ({
                      ...prev,
                      billingAddress: {
                        ...prev.billingAddress!,
                        city: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">
                  {t('addCreditCard.state')}
                </Label>
                <Input
                  id="state"
                  placeholder={t('addCreditCard.statePlaceholder')}
                  value={cardData.billingAddress?.state || ''}
                  onChange={(e) =>
                    setCardData((prev) => ({
                      ...prev,
                      billingAddress: {
                        ...prev.billingAddress!,
                        state: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="zipCode">
                  {t('addCreditCard.zipCode')}
                </Label>
                <Input
                  id="zipCode"
                  placeholder={t('addCreditCard.zipPlaceholder')}
                  value={cardData.billingAddress?.zipCode || ''}
                  onChange={(e) =>
                    setCardData((prev) => ({
                      ...prev,
                      billingAddress: {
                        ...prev.billingAddress!,
                        zipCode: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">
                  {t('addCreditCard.country')}
                </Label>
                <Select
                  value={cardData.billingAddress?.country || 'US'}
                  onValueChange={(value) =>
                    setCardData((prev) => ({
                      ...prev,
                      billingAddress: {
                        ...prev.billingAddress!,
                        country: value,
                      },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">
                      {t('addCreditCard.unitedStates')}
                    </SelectItem>
                    <SelectItem value="CA">
                      {t('addCreditCard.canada')}
                    </SelectItem>
                    <SelectItem value="UK">
                      {t('addCreditCard.unitedKingdom')}
                    </SelectItem>
                    <SelectItem value="AU">
                      {t('addCreditCard.australia')}
                    </SelectItem>
                    <SelectItem value="DE">
                      {t('addCreditCard.germany')}
                    </SelectItem>
                    <SelectItem value="FR">
                      {t('addCreditCard.france')}
                    </SelectItem>
                    <SelectItem value="JP">
                      {t('addCreditCard.japan')}
                    </SelectItem>
                    <SelectItem value="KR">
                      {t('addCreditCard.southKorea')}
                    </SelectItem>
                    <SelectItem value="CN">
                      {t('addCreditCard.china')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Set as Default */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={cardData.isDefault || false}
              onChange={(e) =>
                setCardData((prev) => ({
                  ...prev,
                  isDefault: e.target.checked,
                }))
              }
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <Label htmlFor="isDefault" className="text-sm">
              {t('addCreditCard.setDefault')}
            </Label>
          </div>
        </div>

        {/* Payment Security Info */}
        <div className="p-4 bg-muted/50 rounded-lg my-6">
          <h4 className="font-medium mb-2">
            {t('addCreditCard.paymentSecurity')}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <span>{t('addCreditCard.security1')}</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <span>{t('addCreditCard.security2')}</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <span>{t('addCreditCard.security3')}</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-8">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving
              ? t('addCreditCard.savingCard')
              : t('addCreditCard.saveCard')}
          </Button>
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
}
