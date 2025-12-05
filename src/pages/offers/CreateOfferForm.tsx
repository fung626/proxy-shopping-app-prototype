import { CreateFormLoadingOverlay } from '@/components/CreateFormLoadingOverlay';
import { FileUpload } from '@/components/FileUpload';
import { Badge } from '@/components/ui/badge';
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
import CURRENCIES from '@/config/currencies';
import { offersSupabaseService } from '@/services/offersSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand/authStore';
import { supabase } from '@/supabase/client';
import { CATEGORIES } from '@/utils/categories';
import { Camera, DollarSign, MapPin, Package, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

const EstimatedDeliveryTypeOptions = [
  { value: 'days', label: 'days' },
  { value: 'weeks', label: 'weeks' },
  { value: 'months', label: 'months' },
];

const defaultFormData = {
  title: '',
  description: '',
  category: '',
  price: '',
  currency: 'HKD',
  location: '',
  availableQuantity: '1',
  estimatedDelivery: { start: 0, end: 0, type: 'days' },
  specifications: [] as string[],
  tags: [] as string[],
  deliveryOptions: ['personal_handoff'],
  images: [] as string[],
};

export function CreateOfferForm() {
  const { t } = useLanguage();
  const [showInfoBox, setShowInfoBox] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState(defaultFormData);

  const [newSpecification, setNewSpecification] = useState('');
  const [newTag, setNewTag] = useState('');

  const { user } = useAuthStore();

  const uploadImagesToStorage = async (
    files: File[]
  ): Promise<string[]> => {
    const imageUrls: string[] = [];

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const filePath = `offer-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('uploads').getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error(t('createOffer.uploadError'));
      }
    }

    return imageUrls;
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setUploadedFiles([]);
    setUploadPreviews([]);
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

  const isFormValid = () => {
    return !!(
      formData.title &&
      formData.description &&
      formData.category &&
      formData.price &&
      formData.location
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error(t('createOffer.authError'), {
        description: t('createOffer.authErrorDescription'),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files to Supabase storage
      const imageUrls =
        uploadedFiles.length > 0
          ? await uploadImagesToStorage(uploadedFiles)
          : [];

      // Create offer data
      const offerData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        currency: formData.currency,
        location: formData.location,
        shopping_location: formData.location,
        available_quantity: parseInt(formData.availableQuantity),
        estimated_delivery: formData.estimatedDelivery,
        specifications: formData.specifications,
        tags: formData.tags,
        delivery_options:
          formData.deliveryOptions.length > 0
            ? formData.deliveryOptions
            : ['personal_handoff'],
        images: imageUrls,
        status: 'active',
      };

      // Create offer in Supabase
      await offersSupabaseService.createOffer(offerData);

      toast.success(t('createOffer.successTitle'), {
        description: t('createOffer.successDescription'),
      });

      resetForm();
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error(t('createOffer.errorTitle'), {
        description: t('createOffer.errorDescription'),
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <div className="col-span-3 relative">
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
              <div className="col-span-3">
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
                className="!h-full px-4"
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
            <div className="grid grid-cols-9 gap-3">
              <Input
                placeholder={t('createOffer.deliveryTimePlaceholder')}
                value={formData.estimatedDelivery.start}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedDelivery: {
                      ...formData.estimatedDelivery,
                      start: Number(e.target.value),
                    },
                  })
                }
                className="col-span-3 bg-input-background border-border"
              />
              <Input
                placeholder={t('createOffer.deliveryTimePlaceholder')}
                value={formData.estimatedDelivery.end}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedDelivery: {
                      ...formData.estimatedDelivery,
                      end: Number(e.target.value),
                    },
                  })
                }
                className="col-span-3 bg-input-background border-border"
              />
              <div className="col-span-3">
                <Select
                  value={formData.estimatedDelivery.type}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      estimatedDelivery: {
                        ...formData.estimatedDelivery,
                        type: value,
                      },
                    })
                  }
                >
                  <SelectTrigger className="bg-input-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EstimatedDeliveryTypeOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {t(`common.${option.label}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                className="!h-full px-4"
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
          <FileUpload
            files={uploadedFiles}
            previews={uploadPreviews}
            maxFiles={5}
            onFilesChange={setUploadedFiles}
            onPreviewsChange={setUploadPreviews}
            accept="image/*"
            label={t('createOffer.productImages')}
            description={t('createOffer.uploadPhotos')}
            icon={
              <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            }
            buttonText={t('createOffer.chooseImages')}
          />
          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isSubmitting || !isFormValid()}
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
