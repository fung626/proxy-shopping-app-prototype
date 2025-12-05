import { CreateFormLoadingOverlay } from '@/components/CreateFormLoadingOverlay';
import { FileUpload } from '@/components/FileUpload';
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
import { CATEGORIES } from '@/config/categories';
import { COUNTRIES } from '@/config/countries';
import { requestsSupabaseService } from '@/services/requestsSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand/authStore';
import { supabase } from '@/supabase/client';
import {
  DollarSign,
  MapPin,
  Plus,
  User as UserIcon,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export function CreateRequestForm() {
  const { t } = useLanguage();
  const [showInfoBox, setShowInfoBox] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
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
    expectedMeetingLocation: '', // Renamed from expectedDeliveryLocation
    shippingAddress: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    deliveryMethod: 'personal_handoff', // 'ship' or 'personal_handoff',
  });

  const [newRequirement, setNewRequirement] = useState('');

  const { user } = useAuthStore();

  const addRequirement = () => {
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
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      specificRequirements: formData.specificRequirements.filter(
        (_, i) => i !== index
      ),
    });
  };

  const isFormValid = () => {
    // Check required fields
    if (
      !formData.title ||
      !formData.description ||
      !formData.category
    ) {
      return false;
    }

    // Check delivery method specific requirements
    if (formData.deliveryMethod === 'personal_handoff') {
      return !!formData.expectedMeetingLocation;
    }

    if (formData.deliveryMethod === 'ship') {
      const {
        fullName,
        addressLine1,
        city,
        state,
        postalCode,
        country,
      } = formData.shippingAddress;
      return !!(
        fullName &&
        addressLine1 &&
        city &&
        state &&
        postalCode &&
        country
      );
    }

    return true;
  };

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
        const filePath = `request-images/${fileName}`;

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
        toast.error(t('createRequest.uploadError'));
      }
    }

    return imageUrls;
  };

  const resetForm = () => {
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
      expectedMeetingLocation: '',
      shippingAddress: {
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      deliveryMethod: 'personal_handoff',
    });
    setUploadedFiles([]);
    setUploadPreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error(t('auth.authenticationError'), {
        description: t('auth.authCreateRequestError'),
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

      // Create request data
      const requestData = {
        user_id: user.id,
        user_name: user.nickname || user.name || 'User',
        title: formData.title,
        description: formData.description,
        specific_requirements: formData.specificRequirements,
        category: formData.category,
        budget_min: formData.budgetMin
          ? parseFloat(formData.budgetMin)
          : undefined,
        budget_max: formData.budgetMax
          ? parseFloat(formData.budgetMax)
          : undefined,
        currency: 'HKD',
        product_origin: formData.productOrigin,
        designated_purchasing_location:
          formData.designatedPurchasingLocation,
        expected_delivery_location: formData.expectedMeetingLocation,
        expected_delivery: {
          start: '7',
          end: '14',
          unit: 'days',
        },
        shipping_address:
          formData.deliveryMethod === 'ship'
            ? formData.shippingAddress
            : undefined,
        delivery_method: formData.deliveryMethod,
        images: imageUrls,
        status: 'active',
        urgency: 'normal',
      };

      // Create request in Supabase
      await requestsSupabaseService.createRequest(requestData);

      toast.success(t('createRequest.successMessage'), {
        description: t('createRequest.successMessageDescription'),
      });

      resetForm();
    } catch (error) {
      console.error('Error creating request:', error);
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
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {t(country.translationKey)}
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
            <div className="flex items-center gap-2 mb-3">
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
                    addRequirement();
                  }
                }}
              />
              <Button
                type="button"
                className="!h-full px-4"
                onClick={addRequirement}
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
                        onClick={() => removeRequirement(index)}
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
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <UserIcon className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-foreground">
                {t('createRequest.expectedMeetingLocation')}
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
                  value={formData.expectedMeetingLocation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expectedMeetingLocation: e.target.value,
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
          {/* File Upload */}
          <FileUpload
            files={uploadedFiles}
            previews={uploadPreviews}
            maxFiles={5}
            onFilesChange={setUploadedFiles}
            onPreviewsChange={setUploadPreviews}
            accept="image/*"
            label={t('createRequest.attachments')}
            description={t('createRequest.uploadDescription')}
            buttonText={t('createRequest.chooseFiles')}
          />
          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isSubmitting || !isFormValid()}
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
