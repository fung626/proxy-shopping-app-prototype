import { useState, useMemo, useCallback, memo } from 'react';
import { ArrowLeft, Share2, Heart, MapPin, Calendar, DollarSign, Clock, User, Star, CheckCircle2, ChevronDown, Package, Truck, MessageCircle, Shield, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar } from '../components/ui/avatar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Separator } from '../components/ui/separator';
import { useLanguage } from '../store/LanguageContext';

interface OfferDetailsPageProps {
  offer: any;
  onBack: () => void;
  onContactAgent: (agentId: string) => void;
  onCreateOrder?: (offer: any) => void;
}

export const OfferDetailsPage = memo(function OfferDetailsPage({ offer, onBack, onContactAgent, onCreateOrder }: OfferDetailsPageProps) {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Default offer data - Enhanced to match Airbnb style
  const defaultOfferData = {
    id: 1,
    title: 'Korean K-Beauty Skincare Set',
    price: 89.99,
    currency: 'USD',
    agentName: 'Rio Mays',
    agentId: 'agent_rio_mays',
    agentRating: 4.8,
    agentReviews: 67,
    agentVerified: true,
    agentSince: '2023',
    location: 'Seoul, South Korea',
    shoppingLocation: 'Myeongdong District',
    estimatedDelivery: '5-7 days',
    processingTime: '1-2 business days',
    category: 'Beauty & Health',
    totalOrders: 156,
    successRate: 98,
    availability: 'In Stock',
    lastUpdated: '2 hours ago',
    description: `Authentic Korean skincare products from top K-beauty brands. This curated set includes cleansers, serums, moisturizers, and sheet masks from popular brands like COSRX, The Ordinary, and Innisfree.

I personally source all products from official stores in Seoul's famous Myeongdong beauty district, ensuring 100% authenticity. Each item comes with original packaging and receipts for verification.

Having lived in Seoul for 5 years, I have deep knowledge of the local beauty market and access to exclusive products that aren't available internationally. I guarantee genuine products with proper storage and handling.

All items are checked for expiration dates (minimum 12 months remaining) and include any promotional samples or gifts that come with purchase.`,
    images: [
      'https://images.unsplash.com/photo-1686831451322-8d8e234a51e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBza2luY2FyZSUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiZWF1dHklMjBza2luY2FyZSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiZWF1dHklMjBza2luY2FyZSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1631731436255-8b5dec5a8bec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiZWF1dHklMjBza2luY2FyZSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    agentImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODYxNjU4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    features: [
      'Authentic products from official stores',
      'Professional packaging and protection',
      'Detailed product information included',
      'Express shipping available',
      'Quality guarantee with receipt verification'
    ],
    tags: ['authentic', 'trending', 'k-beauty', 'skincare', 'premium']
  };

  // Use offer data directly if available, fall back to defaults only when needed
  const offerData = offer || defaultOfferData;

  // Handle both single image and images array formats - simplified
  const displayImages = offerData.images || (offerData.image ? [offerData.image] : defaultOfferData.images);

  // Mock agent data
  const agentData = {
    name: offerData.agentName || 'Agent',
    rating: offerData.agentRating || 4.5,
    reviews: offerData.agentReviews || 0,
    since: offerData.agentSince || '2023',
    verified: offerData.agentVerified || false,
    image: offerData.agentImage || '',
    totalOrders: offerData.totalOrders || 0,
    successRate: offerData.successRate || 95
  };

  // Offer features
  const offerFeatures = [
    {
      icon: MapPin,
      title: t('offerDetails.shoppingLocation'),
      description: `${offerData.location || t('common.unknown')} • ${offerData.shoppingLocation || t('offerDetails.variousLocations')}`
    },
    {
      icon: Clock,
      title: t('offerDetails.deliveryTime'),
      description: `${offerData.estimatedDelivery || t('common.tbd')} • ${offerData.processingTime || t('offerDetails.defaultProcessing')} ${t('offerDetails.processing')}`
    },
    {
      icon: Package,
      title: t('common.category'),
      description: offerData.category || t('common.general')
    },
    {
      icon: Shield,
      title: t('offerDetails.authenticity'),
      description: t('offerDetails.authenticityGuarantee')
    }
  ];

  const currencySymbol = offerData.currency === 'USD' ? '$' : 
                        offerData.currency === 'EUR' ? '€' : 
                        offerData.currency === 'GBP' ? '£' : '¥';

  // Touch handlers for image carousel
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < displayImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  }, [touchStart, touchEnd, currentImageIndex, displayImages.length]);

  const handleContactAgent = () => {
    onContactAgent(offerData.agentId);
  };

  const handleCreateOrder = () => {
    if (onCreateOrder) {
      onCreateOrder(offerData);
    }
  };

  const handleShare = () => {
    console.log('Share offer');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Image Carousel */}
      <div className="relative">
        {/* Header overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 safe-area-inset-top">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full"
            >
              <Share2 className="h-5 w-5 text-gray-900" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorited(!isFavorited)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full"
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-primary text-primary' : 'text-gray-900'}`} />
            </Button>
          </div>
        </div>

        {/* Image display */}
        <div 
          className="aspect-[4/3] relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ImageWithFallback
            src={displayImages[currentImageIndex]}
            alt={`${offerData.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {displayImages.length}
          </div>

          {/* Navigation dots */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {displayImages.map((_, index) => (
                <button
                  key={index}  
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Left/Right navigation arrows for larger screens */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={() => currentImageIndex > 0 && setCurrentImageIndex(currentImageIndex - 1)}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center transition-opacity ${
                  currentImageIndex === 0 ? 'opacity-30' : 'opacity-70 hover:opacity-90'
                }`}
                disabled={currentImageIndex === 0}
              >
                ‹
              </button>
              <button
                onClick={() => currentImageIndex < displayImages.length - 1 && setCurrentImageIndex(currentImageIndex + 1)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center transition-opacity ${
                  currentImageIndex === displayImages.length - 1 ? 'opacity-30' : 'opacity-70 hover:opacity-90'
                }`}
                disabled={currentImageIndex === displayImages.length - 1}
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-40">
        {/* Title Section */}
        <div className="py-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-semibold text-foreground pr-4">{offerData.title || 'Product'}</h1>
            {offerData.availability === 'In Stock' && (
              <Badge className="bg-green-500 text-white">
                <Zap className="h-3 w-3 mr-1" />
                {t('offerDetails.available')}
              </Badge>
            )}
          </div>
          
          <p className="text-muted-foreground mb-4">
            {offerData.category || t('common.general')} • {offerData.location || t('offerDetails.variousLocations')}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{t('offerDetails.updated')} {offerData.lastUpdated || t('common.recently')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4" />
              <span>{offerData.totalOrders || 0} {t('offerDetails.ordersCompleted')}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(offerData.tags || []).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Agent Info */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">{t('offerDetails.offeredBy')} {agentData.name}</h3>
          
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <ImageWithFallback
                src={agentData.image}
                alt={agentData.name}
                className="w-full h-full object-cover"
              />
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{agentData.rating}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{agentData.reviews} {t('common.reviews')}</span>
                {agentData.verified && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 text-sm">{t('common.verified')}</span>
                    </div>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {t('common.memberSince')} {agentData.since} • {agentData.successRate}% {t('offerDetails.successRate')}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Offer Features */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">{t('offerDetails.offerDetails')}</h3>
          
          <div className="space-y-4">
            {offerFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* About This Offer */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">{t('offerDetails.aboutThisOffer')}</h3>
          <div className="space-y-4">
            {/* Main Description */}
            <div className="space-y-3">
              <p className="text-foreground leading-relaxed">
                {showFullDescription ? 
                  (offerData.description || 'Our experienced shopping agent will carefully source and purchase the requested items for you. We specialize in finding authentic, high-quality products while providing excellent customer service throughout the entire shopping process.') : 
                  (offerData.description || 'Our experienced shopping agent will carefully source and purchase the requested items for you. We specialize in finding authentic, high-quality products while providing excellent customer service throughout the entire shopping process.').slice(0, 300)
                }
                {(offerData.description || 'Our experienced shopping agent will carefully source and purchase the requested items for you. We specialize in finding authentic, high-quality products while providing excellent customer service throughout the entire shopping process.').length > 300 && !showFullDescription && '...'}
              </p>
              
              {/* Additional offer highlights */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 mb-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">{t('offerDetails.authenticity')}</span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300">{t('offerDetails.authenticityGuarantee')}</p>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 mb-1">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">{t('offerDetails.fastShipping')}</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">{t('offerDetails.expressDelivery')}</p>
                </div>
              </div>
            </div>
            
            {(offerData.description || 'Our experienced shopping agent will carefully source and purchase the requested items for you. We specialize in finding authentic, high-quality products while providing excellent customer service throughout the entire shopping process.').length > 300 && (
              <Button
                variant="ghost"
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="p-0 h-auto font-medium text-foreground hover:bg-transparent"
              >
                {showFullDescription ? t('common.showLess') : t('common.showMore')}
                <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* What's Included */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">{t('offerDetails.whatsIncluded')}</h3>
          
          <div className="space-y-4">
            {/* Service Inclusions */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">{t('offerDetails.serviceInclusions')}</h4>
              <div className="grid grid-cols-1 gap-3">
                {(offerData.features || [
                  'Professional shopping service',
                  'Product authenticity verification',
                  'Secure packaging and handling',
                  'Real-time order updates',
                  'Quality inspection before shipping'
                ]).map((feature: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Benefits */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">{t('offerDetails.additionalBenefits')}</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">{t('offerDetails.freeCommunication')}</span>
                    <p className="text-xs text-muted-foreground mt-1">{t('offerDetails.freeCommunicationDesc')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle2 className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">{t('offerDetails.purchaseReceipt')}</span>
                    <p className="text-xs text-muted-foreground mt-1">{t('offerDetails.purchaseReceiptDesc')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">{t('offerDetails.trackingInformation')}</span>
                    <p className="text-xs text-muted-foreground mt-1">{t('offerDetails.trackingInformationDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">{t('offerDetails.priceBreakdown')}</h4>
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('offerDetails.shoppingServiceFee')}</span>
                    <span className="font-medium">{currencySymbol}{(offerData.price * 0.8).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('offerDetails.platformHandlingFee')}</span>
                    <span className="font-medium">{currencySymbol}{(offerData.price * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('offerDetails.insuranceProtection')}</span>
                    <span className="font-medium">{currencySymbol}{(offerData.price * 0.1).toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>{t('offerDetails.totalServiceCost')}</span>
                    <span>{currencySymbol}{offerData.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('offerDetails.productCostNote')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Agent Stats */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">{agentData.name}{t('offerDetails.agentStats')}</h3>
          
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{agentData.totalOrders}</div>
              <div className="text-xs text-muted-foreground">Orders</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{agentData.successRate}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{agentData.rating}</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom">
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-semibold text-foreground">
                {currencySymbol}{offerData.price || '0.00'}
              </span>
              <span className="text-sm text-muted-foreground">total</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {offerData.estimatedDelivery || 'TBD'} delivery • All fees included
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleContactAgent}
              className="flex-1"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button
              onClick={handleCreateOrder}
              className="flex-1"
              disabled={!onCreateOrder}
            >
              <Package className="h-4 w-4 mr-2" />
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});