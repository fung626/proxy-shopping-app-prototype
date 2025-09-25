import React, { useState } from 'react';
import { ArrowLeft, Plus, Upload, MapPin, DollarSign, Package, Truck, X, Camera } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { useLanguage } from '../store/LanguageContext';
import { User } from '../types';

interface CreateOfferTabProps {
  user: User | null;
  onSignIn: () => void;
}

export function CreateOfferTab({ user, onSignIn }: CreateOfferTabProps) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    currency: 'USD',
    location: '',
    shoppingLocation: '',
    availableQuantity: '1',
    estimatedDelivery: '',
    specifications: [] as string[],
    tags: [] as string[],
    deliveryOptions: [] as string[],
    images: [] as string[]
  });

  const [newSpecification, setNewSpecification] = useState('');
  const [newTag, setNewTag] = useState('');

  const categories = [
    { id: 'beauty', name: t('categories.beauty') },
    { id: 'fashion', name: t('categories.fashion') },
    { id: 'electronics', name: t('categories.electronics') },
    { id: 'home', name: t('categories.home') },
    { id: 'food', name: t('categories.food') },
    { id: 'toys', name: t('categories.toys') },
    { id: 'sports', name: t('categories.sports') },
    { id: 'books', name: t('categories.books') },
    { id: 'automotive', name: t('categories.automotive') },
    { id: 'health', name: t('categories.health') },
    { id: 'stationery', name: t('categories.stationery') },
    { id: 'jewelry', name: t('categories.jewelry') }
  ];

  const currencies = [
    { id: 'USD', name: 'USD ($)' },
    { id: 'EUR', name: 'EUR (€)' },
    { id: 'GBP', name: 'GBP (£)' },
    { id: 'JPY', name: 'JPY (¥)' },
    { id: 'KRW', name: 'KRW (₩)' },
    { id: 'CNY', name: 'CNY (¥)' },
    { id: 'HKD', name: 'HKD (HK$)' },
    { id: 'SGD', name: 'SGD (S$)' },
    { id: 'AUD', name: 'AUD (A$)' },
    { id: 'CAD', name: 'CAD (C$)' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating offer:', formData);
    // Handle form submission
  };

  const addSpecification = () => {
    if (newSpecification.trim()) {
      setFormData({
        ...formData,
        specifications: [...formData.specifications, newSpecification.trim()]
      });
      setNewSpecification('');
    }
  };

  const removeSpecification = (index: number) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== index)
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  const toggleDeliveryOption = (option: string) => {
    const currentOptions = formData.deliveryOptions;
    if (currentOptions.includes(option)) {
      setFormData({
        ...formData,
        deliveryOptions: currentOptions.filter(opt => opt !== option)
      });
    } else {
      setFormData({
        ...formData,
        deliveryOptions: [...currentOptions, option]
      });
    }
  };

  // If user is not authenticated
  if (!user) {
    return (
      <div className="flex-1 bg-background pb-20">
        <div className="px-4 pt-12 pb-6">
          <h1 className="text-3xl font-semibold text-foreground mb-6">{t('createOffer.title')}</h1>
        </div>
        <div className="px-4 py-8">
          <Card className="p-6 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('createOffer.signInRequired')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('createOffer.signInDescription')}
            </p>
            <Button onClick={onSignIn} className="bg-primary text-white">
              {t('auth.signIn')}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Check if user can create offers (remove role restriction since anyone can be an agent per request)
  const canCreateOffer = user.capabilities?.canBeAgent ?? true;
  
  if (!canCreateOffer) {
    return (
      <div className="flex-1 bg-background pb-20">
        <div className="px-4 pt-12 pb-6">
          <h1 className="text-3xl font-semibold text-foreground mb-6">{t('createOffer.title')}</h1>
        </div>
        <div className="px-4 py-8">
          <Card className="p-6 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('createOffer.agentCapabilityRequired')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('createOffer.agentCapabilityDescription')}
            </p>
            <Button variant="outline" className="border-primary text-primary">
              {t('common.contactSupport')}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background pb-20">
      {/* Header - iOS Style */}
      <div className="px-4 pt-12 pb-6">
        <h1 className="text-3xl font-semibold text-foreground mb-2">{t('createOffer.title')}</h1>
        <p className="text-muted-foreground">{t('createOffer.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 space-y-6">
        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('createOffer.productImages')}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {/* Add Image Button */}
            <div className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/30">
              <Camera className="h-6 w-6 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground text-center">{t('createOffer.addPhoto')}</span>
            </div>
            
            {/* Placeholder for uploaded images */}
            {formData.images.map((image, index) => (
              <div key={index} className="aspect-square border border-border rounded-lg bg-muted relative">
                <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      images: formData.images.filter((_, i) => i !== index)
                    });
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t('createOffer.photoInstructions')}
          </p>
        </div>

        {/* Product Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('createOffer.productTitle')} *
          </label>
          <Input
            placeholder={t('createOffer.titlePlaceholder')}
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="bg-input-background border-border"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('createOffer.category')} *
          </label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger className="bg-input-background border-border">
              <SelectValue placeholder={t('createOffer.selectCategory')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('createOffer.price')} *
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="99.99"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="pl-10 bg-input-background border-border"
                type="number"
                step="0.01"
                required
              />
            </div>
            <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
              <SelectTrigger className="bg-input-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.id} value={currency.id}>
                    {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t('createOffer.priceInstructions')}
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('createOffer.description')} *
          </label>
          <Textarea
            placeholder={t('createOffer.descriptionPlaceholder')}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="bg-input-background border-border min-h-[100px]"
            required
          />
        </div>

        {/* Location & Shopping Location */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.yourLocation')} *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('createOffer.locationPlaceholder')}
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="pl-10 bg-input-background border-border"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.shoppingLocation')} *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('createOffer.shoppingLocationPlaceholder')}
                value={formData.shoppingLocation}
                onChange={(e) => setFormData({...formData, shoppingLocation: e.target.value})}
                className="pl-10 bg-input-background border-border"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('createOffer.shoppingLocationDescription')}
            </p>
          </div>
        </div>

        {/* Quantity & Delivery Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.availableQuantity')}
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="1"
                value={formData.availableQuantity}
                onChange={(e) => setFormData({...formData, availableQuantity: e.target.value})}
                className="pl-10 bg-input-background border-border"
                type="number"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createOffer.estimatedDelivery')}
            </label>
            <Input
              placeholder={t('createOffer.deliveryPlaceholder')}
              value={formData.estimatedDelivery}
              onChange={(e) => setFormData({...formData, estimatedDelivery: e.target.value})}
              className="bg-input-background border-border"
            />
          </div>
        </div>

        {/* Delivery Options */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('createOffer.deliveryOptions')} *
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="pickup"
                checked={formData.deliveryOptions.includes('pickup')}
                onCheckedChange={() => toggleDeliveryOption('pickup')}
              />
              <label htmlFor="pickup" className="text-sm font-medium">
                {t('createOffer.localPickup')}
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="shipping"
                checked={formData.deliveryOptions.includes('ship')}
                onCheckedChange={() => toggleDeliveryOption('ship')}
              />
              <label htmlFor="shipping" className="text-sm font-medium">
                {t('createOffer.shippingAvailable')}
              </label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t('createOffer.deliveryMethodsInstructions')}
          </p>
        </div>

        {/* Product Specifications */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('createOffer.productSpecifications')}
          </label>
          
          {/* Add specification input */}
          <div className="flex gap-2 mb-3">
            <Input
              placeholder={t('createOffer.addSpecificationPlaceholder')}
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
              size="sm"
              className="bg-primary text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Display specifications */}
          {formData.specifications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.specifications.map((spec, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {spec}
                  <Button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('createOffer.tags')}
          </label>
          
          {/* Add tag input */}
          <div className="flex gap-2 mb-3">
            <Input
              placeholder={t('createOffer.addTagsPlaceholder')}
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
              size="sm"
              className="bg-primary text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Display tags */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  #{tag}
                  <Button
                    type="button"
                    onClick={() => removeTag(index)}
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {t('createOffer.tagsInstructions')}
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-primary text-white py-3"
            size="lg"
          >
            {t('createOffer.createButton')}
          </Button>
        </div>
      </form>
    </div>
  );
}