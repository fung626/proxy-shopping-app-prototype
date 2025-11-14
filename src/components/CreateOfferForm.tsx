import CURRENCIES from '@/config/currencies';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand/authStore';
import { CATEGORIES } from '@/utils/categories';
import { Camera, DollarSign, MapPin, Package, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CreateFormLoadingOverlay } from './CreateFormLoadingOverlay';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';

export function CreateOfferForm() {
  const { t } = useLanguage();
  const [showInfoBox, setShowInfoBox] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    currency: 'USD',
    location: '',
    availableQuantity: '1',
    estimatedDelivery: '',
    specifications: [] as string[],
    tags: [] as string[],
    deliveryOptions: [] as string[],
    images: [] as string[],
  });

  const [newSpecification, setNewSpecification] = useState('');
  const [newTag, setNewTag] = useState('');

  const { user } = useAuthStore();

  const categories = useMemo(
    () => [
      { id: 'beauty', name: 'Beauty & Skincare' },
      { id: 'fashion', name: 'Fashion & Clothing' },
      { id: 'electronics', name: 'Electronics' },
      { id: 'home', name: 'Home & Garden' },
      { id: 'food', name: 'Food & Beverages' },
      { id: 'toys', name: 'Toys & Games' },
      { id: 'sports', name: 'Sports & Fitness' },
      { id: 'books', name: 'Books & Media' },
      { id: 'automotive', name: 'Automotive' },
      { id: 'health', name: 'Health & Wellness' },
      { id: 'stationery', name: 'Stationery & Office' },
      { id: 'jewelry', name: 'Jewelry & Accessories' },
    ],
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Creating offer:', formData);
      // Show success message
      toast.success(t('createOffer.successTitle'), {
        description: t('createOffer.successDescription'),
      });
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        currency: 'HKD',
        location: '',
        availableQuantity: '1',
        estimatedDelivery: '',
        specifications: [],
        tags: [],
        deliveryOptions: [],
        images: [],
      });
    } catch (error) {
      toast.error(t('createOffer.errorTitle'), {
        description: t('createOffer.errorDescription'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSpecification = () => {
    if (newSpecification.trim()) {
      setFormData({
        ...formData,
        specifications: [
          ...formData.specifications,
          newSpecification.trim(),
        ],
      });
      setNewSpecification('');
    }
  };

  const removeSpecification = (index: number) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <>
      <CreateFormLoadingOverlay
        type="offer"
        isVisible={isSubmitting}
      />
      <div className="px-4 pt-0 pb-4">
        {/* Create Offer Info */}
        {showInfoBox && (
          <div className="mt-4 mb-4 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">
                    {t('createOffer.infoBoxTitle')}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('createOffer.infoBoxDescription')}
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
          {/* Offer Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.offerTitle')} *
            </label>
            <Input
              placeholder={t('createOffer.offerTitlePlaceholder')}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-input-background border-border"
              required
            />
          </div>
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.category')} *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((category) => {
                const isSelected = formData.category === category.id;
                const Icon = category.icon;
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
                    <Icon className="h-4 w-4 text-muted-foreground mr-2" />
                    <div className="text-sm font-medium">
                      {t(category.translationKey)}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
          {/* Price and Currency */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.price')} *
            </label>
            <div className="grid grid-cols-6 gap-3">
              <div className="col-span-4 relative">
                <DollarSign className="absolute left-3 top-[14px] h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('createOffer.enterPrice')}
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value,
                    })
                  }
                  className="pl-10 bg-input-background border-border"
                  type="number"
                  step="0.01"
                  required
                />
              </div>
              <div className="col-span-2">
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData({ ...formData, currency: value })
                  }
                >
                  <SelectTrigger className="bg-input-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem
                        key={currency.id}
                        value={currency.id}
                      >
                        {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.yourLocation')} *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-[14px] h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('createOffer.locationPlaceholder')}
                value={formData.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  })
                }
                className="pl-10 bg-input-background border-border"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('createOffer.locationDescription')}
            </p>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.serviceDescription')} *
            </label>
            <Textarea
              placeholder={t(
                'createOffer.serviceDescriptionPlaceholder'
              )}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="bg-input-background border-border min-h-[100px]"
              required
            />
          </div>
          {/* Product Specifications */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.productSpecifications')}
            </label>

            <div className="flex gap-2 mb-3">
              <Input
                placeholder={t(
                  'createOffer.addSpecificationPlaceholder'
                )}
                value={newSpecification}
                onChange={(e) => setNewSpecification(e.target.value)}
                className="bg-input-background border-border flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSpecification();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addSpecification}
                className="px-4"
                disabled={!newSpecification.trim()}
              >
                {t('createOffer.add')}
              </Button>
            </div>

            {formData.specifications.length > 0 && (
              <div className="space-y-2 mb-3">
                {formData.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                    <span className="flex-1 text-sm">{spec}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecification(index)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {t('createOffer.specificationsDescription')}
            </p>
          </div>
          {/* Available Quantity */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.availableQuantity')}
            </label>
            <Input
              placeholder={t('createOffer.quantityPlaceholder')}
              value={formData.availableQuantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availableQuantity: e.target.value,
                })
              }
              className="bg-input-background border-border"
              type="number"
              min="1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('createOffer.quantityDescription')}
            </p>
          </div>

          {/* Estimated Delivery Time */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.estimatedDeliveryTime')}
            </label>
            <Input
              placeholder={t('createOffer.deliveryTimePlaceholder')}
              value={formData.estimatedDelivery}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedDelivery: e.target.value,
                })
              }
              className="bg-input-background border-border"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('createOffer.deliveryTimeDescription')}
            </p>
          </div>
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.tags')}
            </label>

            <div className="flex gap-2 mb-3">
              <Input
                placeholder={t('createOffer.tagPlaceholder')}
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="bg-input-background border-border flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addTag}
                className="px-4"
                disabled={
                  !newTag.trim() ||
                  formData.tags.includes(newTag.trim())
                }
              >
                {t('createOffer.add')}
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag)}
                      className="h-4 w-4 p-0 ml-2 text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {t('createOffer.tagsDescription')}
            </p>
          </div>
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.productImages')}
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                {t('createOffer.uploadPhotos')}
              </p>
              <Button type="button" variant="outline" size="sm">
                {t('createOffer.chooseImages')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('createOffer.imageDescription')}
            </p>
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
                !formData.price ||
                !formData.location ||
                formData.deliveryOptions.length === 0
              }
            >
              {isSubmitting
                ? t('create.creatingOffer')
                : t('createOffer.createOffer')}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
