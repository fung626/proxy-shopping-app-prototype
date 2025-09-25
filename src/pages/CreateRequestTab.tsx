import { useState } from 'react';
import { Plus, CirclePlus, Upload, Calendar, MapPin, DollarSign, Truck, User as UserIcon, X, Package, ShoppingBag } from 'lucide-react';
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
import { useLanguage } from '../store/LanguageContext';
import { User } from '../types';


interface CreateRequestTabProps {
  user: User | null;
  onSignIn: () => void;
}

export function CreateRequestTab({ user, onSignIn }: CreateRequestTabProps) {
  const { t } = useLanguage();
  const [showInfoBox, setShowInfoBox] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    specificRequirements: [] as string[],
    category: '',
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
      country: ''
    },
    deliveryMethod: 'ship'
  });

  const [newRequirement, setNewRequirement] = useState('');

  const categories = [
    { id: 'beauty', name: t('categories.beauty') },
    { id: 'home', name: t('categories.home') },
    { id: 'food', name: t('categories.food') },
    { id: 'electronics', name: t('categories.electronics') },
    { id: 'toys', name: t('categories.toys') },
    { id: 'stationery', name: t('categories.stationery') },
    { id: 'fashion', name: t('categories.fashion') },
    { id: 'sports', name: t('categories.sports') },
    { id: 'accessories', name: t('categories.jewelry') },
    { id: 'bags', name: t('categories.bags') },
    { id: 'automotive', name: t('categories.automotive') },
    { id: 'others', name: t('categories.others') }
  ];

  const countries = [
    { id: 'us', name: t('countries.us') },
    { id: 'jp', name: t('countries.jp') },
    { id: 'kr', name: t('countries.kr') },
    { id: 'cn', name: t('countries.cn') },
    { id: 'tw', name: t('countries.tw') },
    { id: 'hk', name: t('countries.hk') },
    { id: 'sg', name: t('countries.sg') },
    { id: 'my', name: t('countries.my') },
    { id: 'th', name: t('countries.th') },
    { id: 'ph', name: t('countries.ph') },
    { id: 'id', name: t('countries.id') },
    { id: 'vn', name: t('countries.vn') },
    { id: 'in', name: t('countries.in') },
    { id: 'au', name: t('countries.au') },
    { id: 'nz', name: t('countries.nz') },
    { id: 'uk', name: t('countries.uk') },
    { id: 'fr', name: t('countries.fr') },
    { id: 'de', name: t('countries.de') },
    { id: 'it', name: t('countries.it') },
    { id: 'es', name: t('countries.es') },
    { id: 'nl', name: t('countries.nl') },
    { id: 'se', name: t('countries.se') },
    { id: 'no', name: t('countries.no') },
    { id: 'dk', name: t('countries.dk') },
    { id: 'fi', name: t('countries.fi') },
    { id: 'ch', name: t('countries.ch') },
    { id: 'at', name: t('countries.at') },
    { id: 'be', name: t('countries.be') },
    { id: 'ca', name: t('countries.ca') },
    { id: 'mx', name: t('countries.mx') },
    { id: 'br', name: t('countries.br') },
    { id: 'ar', name: t('countries.ar') },
    { id: 'cl', name: t('countries.cl') },
    { id: 'co', name: t('countries.co') },
    { id: 'pe', name: t('countries.pe') },
    { id: 'ae', name: t('countries.ae') },
    { id: 'sa', name: t('countries.sa') },
    { id: 'il', name: t('countries.il') },
    { id: 'tr', name: t('countries.tr') },
    { id: 'eg', name: t('countries.eg') },
    { id: 'za', name: t('countries.za') },
    { id: 'ng', name: t('countries.ng') },
    { id: 'ke', name: t('countries.ke') },
    { id: 'ru', name: t('countries.ru') },
    { id: 'ua', name: t('countries.ua') },
    { id: 'pl', name: t('countries.pl') },
    { id: 'cz', name: t('countries.cz') },
    { id: 'hu', name: t('countries.hu') },
    { id: 'ro', name: t('countries.ro') },
    { id: 'bg', name: t('countries.bg') },
    { id: 'gr', name: t('countries.gr') },
    { id: 'pt', name: t('countries.pt') },
    { id: 'ie', name: t('countries.ie') },
    { id: 'lv', name: t('countries.lv') },
    { id: 'lt', name: t('countries.lt') },
    { id: 'ee', name: t('countries.ee') },
    { id: 'is', name: t('countries.is') }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating request:', formData);
    // Handle form submission
  };

  // Check authentication first
  if (!user) {
    return (
      <div className="flex-1 bg-background pb-20">
        {/* Header */}
        <div className="bg-card px-4 pt-12 pb-6">
          <h1 className="text-3xl font-semibold text-foreground">{t('create.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('create.subtitle')}</p>
        </div>

        {/* Sign In Options */}
        <div className="px-4 py-8 space-y-4">
          <Card className="p-6 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('createRequest.title')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('createRequest.subtitle')}
            </p>
            <Button onClick={onSignIn} className="bg-primary text-white w-full">
              {t('createRequest.signInButton')}
            </Button>
          </Card>
          
          <Card className="p-6 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('createOffer.title')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('createOffer.subtitle')}
            </p>
            <Button onClick={onSignIn} variant="outline" className="border-primary text-primary w-full">
              {t('createOffer.signInButton')}
            </Button>
          </Card>
        </div>
      </div>
    );
  }



  return (
    <div className="flex-1 bg-background pb-20">
      {/* Header - iOS Style */}
      <div className="bg-card px-4 pt-12 pb-6">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold text-foreground">{t('create.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('createRequest.description')}</p>
        </div>


      </div>

      <div className="px-4 py-4">
        {/* Create Request Info */}
        {showInfoBox && (
          <div className="mb-6 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{t('createRequest.infoTitle')}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('createRequest.infoDescription')}
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
              placeholder={t('createRequest.titlePlaceholder')}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                  placeholder={t('createRequest.minAmount')}
                  value={formData.budgetMin}
                  onChange={(e) => setFormData({...formData, budgetMin: e.target.value})}
                  className="pl-10 bg-input-background border-border"
                  type="number"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('createRequest.maxAmount')}
                  value={formData.budgetMax}
                  onChange={(e) => setFormData({...formData, budgetMax: e.target.value})}
                  className="pl-10 bg-input-background border-border"
                  type="number"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('createRequest.budgetInstructions')}
            </p>
          </div>

          {/* Product Origin */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createRequest.productOrigin')}
            </label>
            <Select value={formData.productOrigin} onValueChange={(value) => setFormData({...formData, productOrigin: value})}>
              <SelectTrigger className="bg-input-background border-border">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                  <SelectValue placeholder={t('createRequest.selectCountry')} />
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
              {t('createRequest.productOriginInstructions')}
            </p>
          </div>

          {/* Designated Purchasing Location */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createRequest.designatedLocation')}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('createRequest.designatedLocationPlaceholder')}
                value={formData.designatedPurchasingLocation}
                onChange={(e) => setFormData({...formData, designatedPurchasingLocation: e.target.value})}
                className="pl-10 bg-input-background border-border"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('createRequest.designatedLocationInstructions')}
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
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setFormData({...formData, category: category.id})}
                    className="h-auto py-3 px-4 text-left justify-start"
                  >
                    <div className="text-sm font-medium">{category.name}</div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('createRequest.description')} *
            </label>
            <Textarea
              placeholder={t('createRequest.descriptionPlaceholder')}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                placeholder={t('createRequest.addRequirementPlaceholder')}
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                className="bg-input-background border-border flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newRequirement.trim()) {
                      setFormData({
                        ...formData,
                        specificRequirements: [...formData.specificRequirements, newRequirement.trim()]
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
                      specificRequirements: [...formData.specificRequirements, newRequirement.trim()]
                    });
                    setNewRequirement('');
                  }
                }}
                className="px-4"
                disabled={!newRequirement.trim()}
              >
                {t('common.add')}
              </Button>
            </div>

            {/* Requirements list */}
            {formData.specificRequirements.length > 0 && (
              <div className="space-y-2 mb-3">
                {formData.specificRequirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                    <span className="flex-1 text-sm">{requirement}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updated = formData.specificRequirements.filter((_, i) => i !== index);
                        setFormData({...formData, specificRequirements: updated});
                      }}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {t('createRequest.requirementsInstructions')}
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
                variant={formData.deliveryMethod === 'ship' ? "default" : "outline"}
                onClick={() => setFormData({...formData, deliveryMethod: 'ship'})}
                className="flex items-center justify-center space-x-2 h-auto py-4"
              >
                <Truck className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">{t('createRequest.shipToMe')}</div>
                  <div className="text-xs opacity-70">{t('createRequest.packageDelivery')}</div>
                </div>
              </Button>
              <Button
                type="button"
                variant={formData.deliveryMethod === 'personal' ? "default" : "outline"}
                onClick={() => setFormData({...formData, deliveryMethod: 'personal'})}
                className="flex items-center justify-center space-x-2 h-auto py-4"
              >
                <UserIcon className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">{t('createRequest.deliverPersonally')}</div>
                  <div className="text-xs opacity-70">{t('createRequest.meetInPerson')}</div>
                </div>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {formData.deliveryMethod === 'personal' 
                ? t('createRequest.personalDeliveryDescription')
                : t('createRequest.shippingDescription')}
            </p>
          </div>

          {/* Expected Delivery Location - Only show when "Deliver Personally" is selected */}
          {formData.deliveryMethod === 'personal' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <UserIcon className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-foreground">{t('createRequest.expectedDeliveryLocation')}</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('createRequest.location')} *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('createRequest.locationPlaceholder')}
                    value={formData.expectedDeliveryLocation}
                    onChange={(e) => setFormData({...formData, expectedDeliveryLocation: e.target.value})}
                    className="pl-10 bg-input-background border-border"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('createRequest.locationInstructions')}
                </p>
              </div>
            </div>
          )}

          {/* Shipping Address - Only show when "Ship to Me" is selected */}
          {formData.deliveryMethod === 'ship' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <Truck className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-foreground">{t('createRequest.shippingAddress')}</h3>
              </div>
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t('createRequest.fullName')} *
                </label>
                <Input
                  placeholder={t('createRequest.fullNamePlaceholder')}
                  value={formData.shippingAddress.fullName}
                  onChange={(e) => setFormData({
                    ...formData, 
                    shippingAddress: {...formData.shippingAddress, fullName: e.target.value}
                  })}
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
                  placeholder={t('createRequest.addressLine1Placeholder')}
                  value={formData.shippingAddress.addressLine1}
                  onChange={(e) => setFormData({
                    ...formData, 
                    shippingAddress: {...formData.shippingAddress, addressLine1: e.target.value}
                  })}
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
                  placeholder={t('createRequest.addressLine2Placeholder')}
                  value={formData.shippingAddress.addressLine2}
                  onChange={(e) => setFormData({
                    ...formData, 
                    shippingAddress: {...formData.shippingAddress, addressLine2: e.target.value}
                  })}
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
                    onChange={(e) => setFormData({
                      ...formData, 
                      shippingAddress: {...formData.shippingAddress, city: e.target.value}
                    })}
                    className="bg-input-background border-border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('createRequest.stateProvince')} *
                  </label>
                  <Input
                    placeholder={t('createRequest.stateProvincePlaceholder')}
                    value={formData.shippingAddress.state}
                    onChange={(e) => setFormData({
                      ...formData, 
                      shippingAddress: {...formData.shippingAddress, state: e.target.value}
                    })}
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
                    placeholder={t('createRequest.postalCodePlaceholder')}
                    value={formData.shippingAddress.postalCode}
                    onChange={(e) => setFormData({
                      ...formData, 
                      shippingAddress: {...formData.shippingAddress, postalCode: e.target.value}
                    })}
                    className="bg-input-background border-border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('createRequest.country')} *
                  </label>
                  <Input
                    placeholder={t('createRequest.countryPlaceholder')}
                    value={formData.shippingAddress.country}
                    onChange={(e) => setFormData({
                      ...formData, 
                      shippingAddress: {...formData.shippingAddress, country: e.target.value}
                    })}
                    className="bg-input-background border-border"
                    required
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
                {t('createRequest.uploadInstructions')}
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
                !formData.title || 
                !formData.description || 
                !formData.category || 
                (formData.deliveryMethod === 'personal' && !formData.expectedDeliveryLocation) ||
                (formData.deliveryMethod === 'ship' && (
                  !formData.shippingAddress.fullName ||
                  !formData.shippingAddress.addressLine1 ||
                  !formData.shippingAddress.city ||
                  !formData.shippingAddress.state ||
                  !formData.shippingAddress.postalCode ||
                  !formData.shippingAddress.country
                ))
              }
            >
              {t('createRequest.createButton')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}