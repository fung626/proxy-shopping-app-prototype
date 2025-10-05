import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/store/LanguageContext';
import { User } from '@/types';
import {
  CheckCircle,
  CreditCard as CreditCardIcon,
  Lock,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface PaymentPageProps {
  offer: {
    id: string;
    agentName: string;
    agentAvatar?: string;
    agentRating: number;
    agentReviews: number;
    price: number;
    serviceFee: number;
    totalAmount: number;
    estimatedDelivery: string;
    description: string;
  };
  request: {
    id: string;
    title: string;
    description: string;
    category: string;
    budget: {
      min: number;
      max: number;
      currency: string;
    };
  };
  user?: User;
  onBack: () => void;
  onPaymentSuccess: (paymentData: any) => void;
}

export function PaymentPage({
  offer,
  request,
  user,
  onBack,
  onPaymentSuccess,
}: PaymentPageProps) {
  const { language, t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(
    null
  );
  const [paymentStep, setPaymentStep] = useState<
    'details' | 'processing' | 'success'
  >('details');

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'saved' | 'new'>(
    'saved'
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    null
  );

  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');

  // Initialize payment method based on available cards
  const savedCards = user?.creditCards || [];
  const defaultCard = useMemo(() => {
    return savedCards.find((card) => card.isDefault) || savedCards[0];
  }, [savedCards]);

  // Set initial selection
  useEffect(() => {
    if (savedCards.length > 0) {
      setPaymentMethod('saved');
      setSelectedCardId(defaultCard?.id || null);
    } else {
      setPaymentMethod('new');
    }
  }, [savedCards.length, defaultCard?.id]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleCvvChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvv(value);
  };

  // Helper functions for saved cards
  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.replace(
      /(\d{4})(\d{4})(\d{4})(\d{4})/,
      '**** **** **** $4'
    );
  };

  const getCardIcon = (cardType: string) => {
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
          <CreditCardIcon className="w-6 h-6 text-muted-foreground" />
        );
    }
  };

  const validateForm = () => {
    if (paymentMethod === 'saved') {
      if (!selectedCardId) {
        setPaymentError(t('payment.errors.selectPaymentMethod'));
        return false;
      }
      if (!cvv || cvv.length < 3) {
        setPaymentError(t('payment.errors.enterCvv'));
        return false;
      }
    } else {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        setPaymentError(t('payment.errors.validCardNumber'));
        return false;
      }
      if (!expiryDate || expiryDate.length < 5) {
        setPaymentError(t('payment.errors.validExpiryDate'));
        return false;
      }
      if (!cvv || cvv.length < 3) {
        setPaymentError(t('payment.errors.validCvv'));
        return false;
      }
      if (!cardName.trim()) {
        setPaymentError(t('payment.errors.cardholderName'));
        return false;
      }
      if (!billingEmail.trim() || !billingEmail.includes('@')) {
        setPaymentError(t('payment.errors.validEmail'));
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setPaymentError(null);
    setPaymentStep('processing');

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock payment success
      const selectedCard =
        paymentMethod === 'saved' && selectedCardId
          ? savedCards.find((card) => card.id === selectedCardId)
          : null;

      const paymentData = {
        transactionId: `TXN-${Date.now()}`,
        amount: offer.totalAmount,
        currency: request.budget.currency,
        paymentMethod:
          paymentMethod === 'saved' ? 'saved_card' : 'new_card',
        cardLast4:
          paymentMethod === 'saved' && selectedCard
            ? selectedCard.cardNumber.replace(/\s/g, '').slice(-4)
            : cardNumber.replace(/\s/g, '').slice(-4),
        agentId: offer.id,
        requestId: request.id,
        timestamp: new Date().toISOString(),
      };

      setPaymentStep('success');

      // Wait a moment to show success state
      setTimeout(() => {
        onPaymentSuccess(paymentData);
      }, 2000);
    } catch (error) {
      setPaymentError(t('payment.errors.paymentFailed'));
      setPaymentStep('details');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="safe-area-inset-top bg-background border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="w-8" /> {/* Spacer */}
            <h1 className="font-semibold">
              {t('payment.processing.title')}
            </h1>
            <div className="w-8" /> {/* Spacer */}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-lg font-semibold mb-2">
              {t('payment.processing.header')}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t('payment.processing.description')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="safe-area-inset-top bg-background border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="w-8" /> {/* Spacer */}
            <h1 className="font-semibold">
              {t('payment.success.title')}
            </h1>
            <div className="w-8" /> {/* Spacer */}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold mb-2">
              {t('payment.success.header')}
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              {t('payment.success.description')}
            </p>
            <div className="text-sm text-muted-foreground">
              <p>
                {t('payment.success.amount')}:{' '}
                {request.budget.currency} {offer.totalAmount}
              </p>
              <p>
                {t('payment.success.agent')}: {offer.agentName}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="p-4">
        {/* Header Section */}
        <div className="mb-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {t('payment.securePayment')}
          </h2>
          <p className="text-muted-foreground">
            {t('payment.description')}
          </p>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-4">
              {t('payment.orderSummary')}
            </h3>

            <div className="space-y-3">
              <div>
                <p className="font-medium">{request.title}</p>
                <p className="text-sm text-muted-foreground">
                  {request.category}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {t('payment.serviceFee')}
                  </span>
                  <span className="text-sm">
                    {offer.currency ||
                      request.budget?.currency ||
                      'USD'}{' '}
                    {offer.price}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {t('payment.platformFee')}
                  </span>
                  <span className="text-sm">
                    {offer.currency ||
                      request.budget?.currency ||
                      'USD'}{' '}
                    {offer.serviceFee}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>{t('payment.total')}</span>
                  <span>
                    {offer.currency ||
                      request.budget?.currency ||
                      'USD'}{' '}
                    {offer.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Details */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-3">
              {t('payment.shoppingAgent')}
            </h4>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {offer.agentName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{offer.agentName}</p>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <span className="text-xs">
                      ⭐ {offer.agentRating}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    •
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {offer.agentReviews} {t('payment.reviews')}
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {t('payment.estimated')} {offer.estimatedDelivery}
              </Badge>
            </div>
          </div>

          {/* Payment Method Selection */}
          {savedCards.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">
                {t('payment.paymentMethod')}
              </h3>

              <div className="space-y-3">
                {/* Saved Cards Option */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="saved-card"
                      name="payment-method"
                      checked={paymentMethod === 'saved'}
                      onChange={() => setPaymentMethod('saved')}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <Label
                      htmlFor="saved-card"
                      className="font-medium"
                    >
                      {t('payment.useSavedCard')}
                    </Label>
                  </div>

                  {paymentMethod === 'saved' && (
                    <div className="ml-6 space-y-2">
                      {savedCards.map((card) => (
                        <div
                          key={card.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedCardId === card.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedCardId(card.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getCardIcon(card.cardType)}
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">
                                    {card.nickname ||
                                      `${
                                        card.cardType
                                          .charAt(0)
                                          .toUpperCase() +
                                        card.cardType.slice(1)
                                      } Card`}
                                  </span>
                                  {card.isDefault && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      Default
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {maskCardNumber(card.cardNumber)} •
                                  Expires{' '}
                                  {card.expiryDate ||
                                    `${
                                      card.expiryMonth
                                    }/${card.expiryYear.slice(-2)}`}
                                </div>
                              </div>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedCardId === card.id
                                  ? 'border-primary bg-primary'
                                  : 'border-gray-300'
                              }`}
                            >
                              {selectedCardId === card.id && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="mt-3 pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-2">
                          Don't see the card you want to use?
                        </p>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('new')}
                          className="text-sm text-primary hover:text-primary/80 font-medium"
                        >
                          + Add a new payment method
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* New Card Option */}
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="new-card"
                    name="payment-method"
                    checked={paymentMethod === 'new'}
                    onChange={() => setPaymentMethod('new')}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <Label htmlFor="new-card" className="font-medium">
                    Use new card
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Payment Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePayment();
            }}
            className="space-y-6"
          >
            {savedCards.length === 0 && (
              <h3 className="font-semibold">Payment Details</h3>
            )}
            {paymentMethod === 'saved' && (
              <h3 className="font-semibold">Security Verification</h3>
            )}
            {paymentMethod === 'new' && (
              <h3 className="font-semibold">Card Details</h3>
            )}

            {/* Error Message */}
            {paymentError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">
                  {paymentError}
                </p>
              </div>
            )}

            {/* CVV for saved cards */}
            {paymentMethod === 'saved' && (
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV Security Code</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={handleCvvChange}
                  className="max-w-32"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 3-digit security code from the back of
                  your selected card
                </p>
              </div>
            )}

            {/* New card fields */}
            {paymentMethod === 'new' && (
              <>
                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="pl-10"
                      required
                    />
                    <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv-new">CVV</Label>
                    <Input
                      id="cvv-new"
                      placeholder="123"
                      value={cvv}
                      onChange={handleCvvChange}
                      required
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Smith"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>

                {/* Billing Email */}
                <div className="space-y-2">
                  <Label htmlFor="billingEmail">Billing Email</Label>
                  <Input
                    id="billingEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {/* Terms and Conditions */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Payment Terms:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  <span>
                    Funds held in secure escrow until completion
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  <span>
                    Released to agent upon successful delivery
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  <span>Full refund protection available</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                isProcessing ||
                (paymentMethod === 'saved' &&
                  (!selectedCardId || !cvv)) ||
                (paymentMethod === 'new' &&
                  (!cardNumber ||
                    !expiryDate ||
                    !cvv ||
                    !cardName ||
                    !billingEmail))
              }
              className="w-full"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </div>
              ) : (
                `Pay ${
                  offer.currency || request.budget?.currency || 'USD'
                } ${offer.totalAmount}`
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
