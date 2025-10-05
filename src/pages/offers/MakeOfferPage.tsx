import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { BudgetDisplay } from '@/components/ui/budget-display';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/store/LanguageContext';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Package,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface MakeOfferPageProps {
  request: {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    createdDate: string;
    budget?: string | { min: number; max: number; currency: string };
    timeline?: string;
    clientName?: string;
    clientRating?: number;
    clientReviews?: number;
    deliveryMethod?: string;
    images?: string[];
  };
  onBack: () => void;
  onSubmitOffer: (offer: any) => void;
}

export function MakeOfferPage({
  request,
  onBack,
  onSubmitOffer,
}: MakeOfferPageProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [offerPrice, setOfferPrice] = useState('');
  const [serviceFee, setServiceFee] = useState('5.00');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [experience, setExperience] = useState('');

  // Error states
  const [priceError, setPriceError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  // Mock client data
  const clientData = {
    name: request.clientName || 'Sarah Chen',
    rating: request.clientRating || 4.8,
    reviews: request.clientReviews || 156,
    since: '2023',
    verified: true,
    image:
      'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4NjE2NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  };

  // Sample main image
  const mainImage =
    request.images?.[0] ||
    'https://images.unsplash.com/photo-1726695716109-68a7321c0664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob3BwaW5nJTIwcHJvZHVjdHxlbnwxfHx8fDE3NTg2MzU5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setPriceError('');
    setTimeError('');
    setDescriptionError('');

    // Validate price
    const price = parseFloat(offerPrice);
    if (!offerPrice || isNaN(price) || price <= 0) {
      setPriceError(t('makeOffer.enterValidPrice'));
      isValid = false;
    }

    // Validate time
    if (!estimatedTime) {
      setTimeError(t('makeOffer.selectEstimatedTime'));
      isValid = false;
    }

    // Validate description
    if (
      !offerDescription.trim() ||
      offerDescription.trim().length < 50
    ) {
      setDescriptionError(t('makeOffer.provideDescription'));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const offer = {
        id: Date.now().toString(),
        requestId: request.id,
        agentName: 'Current User', // Would come from auth context
        price: parseFloat(offerPrice),
        serviceFee: parseFloat(serviceFee),
        totalAmount: parseFloat(offerPrice) + parseFloat(serviceFee),
        estimatedTime,
        description: offerDescription,
        specialties: specialties
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s),
        experience,
        submittedDate: new Date().toISOString(),
        status: 'pending',
      };

      toast.success(t('makeOffer.offerSubmitted'), {
        description: t('makeOffer.clientNotified'),
      });

      onSubmitOffer(offer);
    } catch (error) {
      console.error('Failed to submit offer:', error);
      toast.error(t('makeOffer.submitFailed'), {
        description: t('makeOffer.tryAgainLater'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount =
    (parseFloat(offerPrice) || 0) + (parseFloat(serviceFee) || 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {t('makeOffer.title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('makeOffer.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-40">
        {/* Request Summary */}
        <div className="mb-6 p-4 bg-muted/50 rounded-xl">
          <div className="flex space-x-4">
            <div className="aspect-square w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <ImageWithFallback
                src={mainImage}
                alt={request.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium mb-1 truncate">
                {request.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {request.description}
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{request.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Package className="h-3 w-3" />
                  <span>{request.category}</span>
                </div>
              </div>
            </div>
          </div>
          {request.budget && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t('makeOffer.clientBudget')}
                </span>
                <BudgetDisplay
                  budget={request.budget}
                  variant="minimal"
                />
              </div>
            </div>
          )}
        </div>

        {/* Client Info */}
        <div className="mb-6 p-4 bg-muted/50 rounded-xl">
          <h3 className="font-medium mb-3 text-foreground">
            {t('makeOffer.clientInformation')}
          </h3>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
              <ImageWithFallback
                src={clientData.image}
                alt={clientData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium">{clientData.name}</h4>
                {clientData.verified && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {t('makeOffer.verified')}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>★ {clientData.rating}</span>
                <span>•</span>
                <span>
                  {clientData.reviews} {t('makeOffer.reviews')}
                </span>
                <span>•</span>
                <span>
                  {t('makeOffer.memberSince')} {clientData.since}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Offer Details Form */}
        <form className="space-y-6">
          {/* Pricing Details */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('makeOffer.servicePrice')} *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                step="0.01"
                min="1"
                placeholder={t('makeOffer.servicePricePlaceholder')}
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className={`pl-10 bg-input-background border-border ${
                  priceError ? 'border-destructive' : ''
                }`}
              />
            </div>
            {priceError && (
              <p className="text-sm text-destructive flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {priceError}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {t('makeOffer.servicePriceHelper')}
            </p>
          </div>

          {/* Platform Service Fee */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('makeOffer.platformServiceFee')}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                step="0.01"
                min="0"
                value={serviceFee}
                onChange={(e) => setServiceFee(e.target.value)}
                className="pl-10 bg-input-background border-border"
                readOnly
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('makeOffer.platformFeeHelper')}
            </p>
          </div>

          {/* Total Amount */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <span className="font-medium">
              {t('makeOffer.totalAmount')}
            </span>
            <span className="text-lg font-bold text-primary">
              ${totalAmount.toFixed(2)}
            </span>
          </div>

          {/* Estimated Completion Time */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('makeOffer.estimatedTime')} *
            </label>
            <Select
              value={estimatedTime}
              onValueChange={setEstimatedTime}
            >
              <SelectTrigger
                className={`bg-input-background border-border ${
                  timeError ? 'border-destructive' : ''
                }`}
              >
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <SelectValue
                    placeholder={t('makeOffer.selectTimeframe')}
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2 days">
                  {t('makeOffer.timeframe1to2Days')}
                </SelectItem>
                <SelectItem value="3-5 days">
                  {t('makeOffer.timeframe3to5Days')}
                </SelectItem>
                <SelectItem value="5-7 days">
                  {t('makeOffer.timeframe5to7Days')}
                </SelectItem>
                <SelectItem value="1-2 weeks">
                  {t('makeOffer.timeframe1to2Weeks')}
                </SelectItem>
                <SelectItem value="2-3 weeks">
                  {t('makeOffer.timeframe2to3Weeks')}
                </SelectItem>
                <SelectItem value="1 month">
                  {t('makeOffer.timeframe1Month')}
                </SelectItem>
              </SelectContent>
            </Select>
            {timeError && (
              <p className="text-sm text-destructive flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {timeError}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {t('makeOffer.timeHelper')}
            </p>
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('makeOffer.deliveryMethod')}
            </label>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                {request.deliveryMethod === 'personal' ? (
                  <User className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Package className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">
                  {request.deliveryMethod === 'personal'
                    ? t('makeOffer.personalDelivery')
                    : t('makeOffer.shipToClient')}
                </span>
              </div>
            </div>
          </div>

          {/* Offer Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('makeOffer.describeApproach')} *
            </label>
            <Textarea
              value={offerDescription}
              onChange={(e) => setOfferDescription(e.target.value)}
              placeholder={t('makeOffer.approachPlaceholder')}
              className={`bg-input-background border-border min-h-[120px] ${
                descriptionError ? 'border-destructive' : ''
              }`}
            />
            {descriptionError && (
              <p className="text-sm text-destructive flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {descriptionError}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {offerDescription.length}/500{' '}
              {t('makeOffer.charactersMinimum')}
            </p>
          </div>

          {/* Your Specialties */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('makeOffer.specialties')}
            </label>
            <Input
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder={t('makeOffer.specialtiesPlaceholder')}
              className="bg-input-background border-border"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('makeOffer.specialtiesHelper')}
            </p>
          </div>

          {/* Relevant Experience */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('makeOffer.relevantExperience')}
            </label>
            <Textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder={t('makeOffer.experiencePlaceholder')}
              className="bg-input-background border-border min-h-[80px]"
            />
          </div>

          {/* Terms Notice */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {t('makeOffer.beforeSubmitting')}
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• {t('makeOffer.notice1')}</li>
                  <li>• {t('makeOffer.notice2')}</li>
                  <li>• {t('makeOffer.notice3')}</li>
                  <li>• {t('makeOffer.notice4')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-12 text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {t('makeOffer.submitting')}
                </>
              ) : (
                t('makeOffer.submitOffer')
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
