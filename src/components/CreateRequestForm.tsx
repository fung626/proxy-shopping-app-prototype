import { useLanguage } from '@/store/LanguageContext';
import { User } from '@/types';
import {
  DollarSign,
  MapPin,
  Plus,
  Truck,
  Upload,
  User as UserIcon,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { CreateFormLoadingOverlay } from './CreateFormLoadingOverlay';
import { Button } from './ui/button';
import { CountrySelect } from './ui/country-select';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';

interface CreateRequestFormProps {
  user: User;
}

export function CreateRequestForm({ user }: CreateRequestFormProps) {
  const { t } = useLanguage();
  const [showInfoBox, setShowInfoBox] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    specificRequirements: [] as string[],
    category: '',
    quantity: '1',
    budgetMin: '',
    budgetMax: '',
    productOrigin: '',
    designatedPurchasingLocation: '',
    expectedDeliveryLocation: '',
    shippingAddress: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    deliveryMethod: 'ship',
  });

  const [newRequirement, setNewRequirement] = useState('');

  const categories = useMemo(
    () => [
      { id: 'beauty', name: 'Beauty & Skincare' },
      { id: 'home', name: 'Furniture & Home' },
      { id: 'food', name: 'Food' },
      { id: 'electronics', name: 'Electronics' },
      { id: 'toys', name: 'Toys & Dolls' },
      { id: 'stationery', name: 'Stationery' },
      { id: 'fashion', name: 'Fashion' },
      { id: 'sports', name: 'Sports & Fitness' },
      { id: 'accessories', name: 'Watches & Jewelry' },
      { id: 'bags', name: 'Bags & Handbags' },
      { id: 'automotive', name: 'Cars & Motorcycles' },
      { id: 'others', name: 'Others' },
    ],
    []
  );

  const countries = useMemo(
    () => [
      { id: 'us', name: 'United States' },
      { id: 'jp', name: 'Japan' },
      { id: 'kr', name: 'South Korea' },
      { id: 'cn', name: 'China' },
      { id: 'tw', name: 'Taiwan' },
      { id: 'hk', name: 'Hong Kong' },
      { id: 'sg', name: 'Singapore' },
      { id: 'my', name: 'Malaysia' },
      { id: 'th', name: 'Thailand' },
      { id: 'ph', name: 'Philippines' },
      { id: 'id', name: 'Indonesia' },
      { id: 'vn', name: 'Vietnam' },
      { id: 'in', name: 'India' },
      { id: 'au', name: 'Australia' },
      { id: 'nz', name: 'New Zealand' },
      { id: 'uk', name: 'United Kingdom' },
      { id: 'fr', name: 'France' },
      { id: 'de', name: 'Germany' },
      { id: 'it', name: 'Italy' },
      { id: 'es', name: 'Spain' },
      { id: 'nl', name: 'Netherlands' },
      { id: 'se', name: 'Sweden' },
      { id: 'no', name: 'Norway' },
      { id: 'dk', name: 'Denmark' },
      { id: 'fi', name: 'Finland' },
      { id: 'ch', name: 'Switzerland' },
      { id: 'at', name: 'Austria' },
      { id: 'be', name: 'Belgium' },
      { id: 'ca', name: 'Canada' },
      { id: 'mx', name: 'Mexico' },
      { id: 'br', name: 'Brazil' },
      { id: 'ar', name: 'Argentina' },
      { id: 'cl', name: 'Chile' },
      { id: 'co', name: 'Colombia' },
      { id: 'pe', name: 'Peru' },
      { id: 'ae', name: 'United Arab Emirates' },
      { id: 'sa', name: 'Saudi Arabia' },
      { id: 'il', name: 'Israel' },
      { id: 'tr', name: 'Turkey' },
      { id: 'eg', name: 'Egypt' },
      { id: 'za', name: 'South Africa' },
      { id: 'ng', name: 'Nigeria' },
      { id: 'ke', name: 'Kenya' },
      { id: 'ru', name: 'Russia' },
      { id: 'ua', name: 'Ukraine' },
      { id: 'pl', name: 'Poland' },
      { id: 'cz', name: 'Czech Republic' },
      { id: 'hu', name: 'Hungary' },
      { id: 'ro', name: 'Romania' },
      { id: 'bg', name: 'Bulgaria' },
      { id: 'gr', name: 'Greece' },
      { id: 'pt', name: 'Portugal' },
      { id: 'ie', name: 'Ireland' },
      { id: 'lv', name: 'Latvia' },
      { id: 'lt', name: 'Lithuania' },
      { id: 'ee', name: 'Estonia' },
      { id: 'is', name: 'Iceland' },
    ],
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Creating request:', formData);

      // Show success message
      toast.success(t('createRequest.successMessage'), {
        description: t('createRequest.successMessageDescription'),
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        specificRequirements: [],
        category: '',
        quantity: '1',
        budgetMin: '',
        budgetMax: '',
        productOrigin: '',
        designatedPurchasingLocation: '',
        expectedDeliveryLocation: '',
        shippingAddress: {
          fullName: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
        deliveryMethod: 'ship',
      });
    } catch (error) {
      toast.error(t('createRequest.errorMessage'), {
        description: t('createRequest.errorMessageDescription'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CreateFormLoadingOverlay
        type="request"
        isVisible={isSubmitting}
      />
      <div className="px-4 pt-0 pb-4">
        {/* Create Request Info */}
        {showInfoBox && (
          <div className="mt-4 mb-4 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">
                    {t('createRequest.infoBoxTitle')}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('createRequest.infoBoxDescription')}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground ml-2"
                onClick={() => setShowInfoBox(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createRequest.requestTitle')} *
            </label>
            <Input
              placeholder={t('createRequest.requestTitlePlaceholder')}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-input-background border-border"
              required
            />
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createRequest.budgetRange')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t(
                    'createRequest.budgetMinPlaceholder'
                  )}
                  value={formData.budgetMin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budgetMin: e.target.value,
                    })
                  }
                  className="pl-10 bg-input-background border-border"
                  type="number"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t(
                    'createRequest.budgetMaxPlaceholder'
                  )}
                  value={formData.budgetMax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budgetMax: e.target.value,
                    })
                  }
                  className="pl-10 bg-input-background border-border"
                  type="number"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('createRequest.budgetRangeDescription')}
            </p>
          </div>

          {/* Product Origin */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createRequest.productOrigin')}
            </label>
            <Select
              value={formData.productOrigin}
              onValueChange={(value) =>
                setFormData({ ...formData, productOrigin: value })
              }
            >
              <SelectTrigger className="bg-input-background border-border">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                  <SelectValue
                    placeholder={t(
                      'createRequest.selectCountryRegion'
                    )}
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {t('createRequest.productOriginDescription')}
            </p>
          </div>

          {/* Designated Purchasing Location */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createRequest.designatedPurchasingLocation')}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t(
                  'createRequest.purchasingLocationPlaceholder'
                )}
                value={formData.designatedPurchasingLocation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    designatedPurchasingLocation: e.target.value,
                  })
                }
                className="pl-10 bg-input-background border-border"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('createRequest.purchasingLocationDescription')}
            </p>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createRequest.category')} *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => {
                const isSelected = formData.category === category.id;

                return (
                  <Button
                    key={category.id}
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        category: category.id,
                      })
                    }
                    className="h-auto py-3 px-4 text-left justify-start"
                  >
                    <div className="text-sm font-medium">
                      {category.name}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createRequest.quantity')} *
            </label>
            <Input
              placeholder={t('createRequest.quantityPlaceholder')}
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="bg-input-background border-border"
              type="number"
              min="1"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('createRequest.quantityDescription')}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createRequest.description')} *
            </label>
            <Textarea
              placeholder={t('createRequest.descriptionPlaceholder')}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="bg-input-background border-border min-h-[80px]"
              required
            />
          </div>

          {/* Specific Requirements */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createRequest.specificRequirements')}
            </label>

            {/* Add requirement input */}
            <div className="flex gap-2 mb-3">
              <Input
                placeholder={t(
                  'createRequest.requirementPlaceholder'
                )}
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                className="bg-input-background border-border flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newRequirement.trim()) {
                      setFormData({
                        ...formData,
                        specificRequirements: [
                          ...formData.specificRequirements,
                          newRequirement.trim(),
                        ],
                      });
                      setNewRequirement('');
                    }
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  if (newRequirement.trim()) {
                    setFormData({
                      ...formData,
                      specificRequirements: [
                        ...formData.specificRequirements,
                        newRequirement.trim(),
                      ],
                    });
                    setNewRequirement('');
                  }
                }}
                className="px-4"
                disabled={!newRequirement.trim()}
              >
                {t('createRequest.add')}
              </Button>
            </div>

            {/* Requirements list */}
            {formData.specificRequirements.length > 0 && (
              <div className="space-y-2 mb-3">
                {formData.specificRequirements.map(
                  (requirement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                      <span className="flex-1 text-sm">
                        {requirement}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated =
                            formData.specificRequirements.filter(
                              (_, i) => i !== index
                            );
                          setFormData({
                            ...formData,
                            specificRequirements: updated,
                          });
                        }}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  )
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {t('createRequest.requirementsDescription')}
            </p>
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createRequest.deliveryMethod')} *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={
                  formData.deliveryMethod === 'ship'
                    ? 'default'
                    : 'outline'
                }
                onClick={() =>
                  setFormData({ ...formData, deliveryMethod: 'ship' })
                }
                className="flex items-center justify-center space-x-2 h-auto py-4"
              >
                <Truck className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">
                    {t('createRequest.shipToMe')}
                  </div>
                  <div className="text-xs opacity-70">
                    {t('createRequest.shipToMeDescription')}
                  </div>
                </div>
              </Button>
              <Button
                type="button"
                variant={
                  formData.deliveryMethod === 'personal'
                    ? 'default'
                    : 'outline'
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    deliveryMethod: 'personal',
                  })
                }
                className="flex items-center justify-center space-x-2 h-auto py-4"
              >
                <UserIcon className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">
                    {t('createRequest.deliverPersonally')}
                  </div>
                  <div className="text-xs opacity-70">
                    {t('createRequest.deliverPersonallyDescription')}
                  </div>
                </div>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {formData.deliveryMethod === 'personal'
                ? t('createRequest.personalDeliveryNote')
                : t('createRequest.shippingNote')}
            </p>
          </div>

          {/* Expected Delivery Location - Only show when "Deliver Personally" is selected */}
          {formData.deliveryMethod === 'personal' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <UserIcon className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-foreground">
                  {t('createRequest.expectedDeliveryLocation')}
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('createRequest.location')} *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t(
                      'createRequest.meetingLocationPlaceholder'
                    )}
                    value={formData.expectedDeliveryLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expectedDeliveryLocation: e.target.value,
                      })
                    }
                    className="pl-10 bg-input-background border-border"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('createRequest.meetingLocationDescription')}
                </p>
              </div>
            </div>
          )}

          {/* Shipping Address - Only show when "Ship to Me" is selected */}
          {formData.deliveryMethod === 'ship' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <Truck className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-foreground">
                  {t('createRequest.shippingAddress')}
                </h3>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t('createRequest.fullName')} *
                </label>
                <Input
                  placeholder={t('createRequest.fullNamePlaceholder')}
                  value={formData.shippingAddress.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        fullName: e.target.value,
                      },
                    })
                  }
                  className="bg-input-background border-border"
                  required
                />
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t('createRequest.addressLine1')} *
                </label>
                <Input
                  placeholder={t(
                    'createRequest.addressLine1Placeholder'
                  )}
                  value={formData.shippingAddress.addressLine1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        addressLine1: e.target.value,
                      },
                    })
                  }
                  className="bg-input-background border-border"
                  required
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t('createRequest.addressLine2')}
                </label>
                <Input
                  placeholder={t(
                    'createRequest.addressLine2Placeholder'
                  )}
                  value={formData.shippingAddress.addressLine2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        addressLine2: e.target.value,
                      },
                    })
                  }
                  className="bg-input-background border-border"
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('createRequest.city')} *
                  </label>
                  <Input
                    placeholder={t('createRequest.cityPlaceholder')}
                    value={formData.shippingAddress.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          city: e.target.value,
                        },
                      })
                    }
                    className="bg-input-background border-border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('createRequest.state')} *
                  </label>
                  <Input
                    placeholder={t('createRequest.statePlaceholder')}
                    value={formData.shippingAddress.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          state: e.target.value,
                        },
                      })
                    }
                    className="bg-input-background border-border"
                    required
                  />
                </div>
              </div>

              {/* Postal Code and Country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('createRequest.postalCode')} *
                  </label>
                  <Input
                    placeholder={t(
                      'createRequest.postalCodePlaceholder'
                    )}
                    value={formData.shippingAddress.postalCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          postalCode: e.target.value,
                        },
                      })
                    }
                    className="bg-input-background border-border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('createRequest.country')} *
                  </label>
                  <CountrySelect
                    value={formData.shippingAddress.country}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          country: value,
                        },
                      })
                    }
                    placeholder={t('createRequest.selectCountry')}
                    className="bg-input-background border-border"
                  />
                </div>
              </div>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createRequest.attachments')}
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                {t('createRequest.uploadDescription')}
              </p>
              <Button type="button" variant="outline" size="sm">
                {t('createRequest.chooseFiles')}
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={
                isSubmitting ||
                !formData.title ||
                !formData.description ||
                !formData.category ||
                (formData.deliveryMethod === 'personal' &&
                  !formData.expectedDeliveryLocation) ||
                (formData.deliveryMethod === 'ship' &&
                  (!formData.shippingAddress.fullName ||
                    !formData.shippingAddress.addressLine1 ||
                    !formData.shippingAddress.city ||
                    !formData.shippingAddress.state ||
                    !formData.shippingAddress.postalCode ||
                    !formData.shippingAddress.country))
              }
            >
              {isSubmitting
                ? t('create.creatingRequest')
                : t('createRequest.createRequest')}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
