import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { ProductDetailsCarousel } from '@/components/ProductDetailsCarousel';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/store/LanguageContext';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Package,
  Share2,
  Shield,
  Star,
  Truck,
  Zap,
} from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';

interface OfferDetailsPageProps {
  offer: any;
  onBack: () => void;
  onContactAgent: (agentId: string) => void;
  onCreateOrder?: (offer: any) => void;
}

export const OfferDetailsPage = memo(function OfferDetailsPage({
  offer,
  onBack,
  onContactAgent,
  onCreateOrder,
}: OfferDetailsPageProps) {
  const { t } = useLanguage();
  const [showFullDescription, setShowFullDescription] =
    useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Default offer data -  to match Airbnb style
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
      'https://images.unsplash.com/photo-1631731436255-8b5dec5a8bec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiZWF1dHklMjBza2luY2FyZSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    agentImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODYxNjU4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    features: [
      'Authentic products from official stores',
      'Professional packaging and protection',
      'Detailed product information included',
      'Express shipping available',
      'Quality guarantee with receipt verification',
    ],
    tags: [
      'authentic',
      'trending',
      'k-beauty',
      'skincare',
      'premium',
    ],
  };

  // Use offer data directly if available, fall back to defaults only when needed
  const offerData = offer || defaultOfferData;

  // Handle both single image and images array formats - simplified
  const displayImages =
    offerData.images ||
    (offerData.image ? [offerData.image] : defaultOfferData.images);

  // Mock agent data
  const agentData = {
    name: offerData.agentName || 'Agent',
    rating: offerData.agentRating || 4.5,
    reviews: offerData.agentReviews || 0,
    since: offerData.agentSince || '2023',
    verified: offerData.agentVerified || false,
    image: offerData.agentImage || '',
    totalOrders: offerData.totalOrders || 0,
    successRate: offerData.successRate || 95,
  };

  // Offer features
  const offerFeatures = [
    {
      icon: MapPin,
      title: t('offerDetails.shoppingLocation'),
      description: `${offerData.location || t('common.unknown')} • ${
        offerData.shoppingLocation ||
        t('offerDetails.variousLocations')
      }`,
    },
    {
      icon: Clock,
      title: t('offerDetails.deliveryTime'),
      description: `${
        offerData.estimatedDelivery || t('common.tbd')
      } • ${
        offerData.processingTime ||
        t('offerDetails.defaultProcessing')
      } ${t('offerDetails.processing')}`,
    },
    {
      icon: Package,
      title: t('common.category'),
      description: offerData.category || t('common.general'),
    },
    {
      icon: Shield,
      title: t('offerDetails.authenticity'),
      description: t('offerDetails.authenticityGuarantee'),
    },
  ];

  const currencySymbol =
    offerData.currency === 'USD'
      ? '$'
      : offerData.currency === 'EUR'
      ? '€'
      : offerData.currency === 'GBP'
      ? '£'
      : '¥';

  // Image handling
  const handleImageClick = useCallback(
    (image: any, index: number) => {
      setSelectedImageIndex(index);
      setIsImageModalOpen(true);
    },
    []
  );

  // Convert images to carousel format
  const carouselImages = useMemo(() => {
    return displayImages.map((imageUrl: string, index: number) => ({
      id: `image-${index}`,
      imageUrl,
      title: `${offerData.title} - Image ${index + 1}`,
      description:
        index === 0
          ? offerData.description?.substring(0, 100) + '...'
          : undefined,
    }));
  }, [displayImages, offerData.title, offerData.description]);

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
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 safe-area-inset-top">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
            >
              <Share2 className="h-5 w-5 text-gray-900" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorited(!isFavorited)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorited
                    ? 'fill-primary text-primary'
                    : 'text-gray-900'
                }`}
              />
            </Button>
          </div>
        </div>

        {/* Product Image Carousel */}
        <div className="aspect-[4/3]">
          <ProductDetailsCarousel
            images={carouselImages}
            productTitle=""
            onImageClick={handleImageClick}
            className="h-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-40">
        {/* Title Section */}
        <div className="py-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-semibold text-foreground pr-4">
              {offerData.title || 'Product'}
            </h1>
            {offerData.availability === 'In Stock' && (
              <Badge className="bg-green-500 text-white">
                <Zap className="h-3 w-3 mr-1" />
                {t('offerDetails.available')}
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground mb-4">
            {offerData.category || t('common.general')} •{' '}
            {offerData.location || t('offerDetails.variousLocations')}
          </p>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {t('offerDetails.updated')}{' '}
                {offerData.lastUpdated || t('common.recently')}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4" />
              <span>
                {offerData.totalOrders || 0}{' '}
                {t('offerDetails.ordersCompleted')}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(offerData.tags || []).map(
              (tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs"
                >
                  {tag}
                </Badge>
              )
            )}
          </div>
        </div>

        <Separator />

        {/* Agent Info */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {t('offerDetails.offeredBy')} {agentData.name}
          </h3>

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
                  <span className="font-medium">
                    {agentData.rating}
                  </span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {agentData.reviews} {t('common.reviews')}
                </span>
                {agentData.verified && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 text-sm">
                        {t('common.verified')}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {t('common.memberSince')} {agentData.since} •{' '}
                {agentData.successRate}%{' '}
                {t('offerDetails.successRate')}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Offer Features */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {t('offerDetails.offerDetails')}
          </h3>

          <div className="space-y-4">
            {offerFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* About This Offer */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {t('offerDetails.aboutThisOffer')}
          </h3>
          <div className="space-y-4">
            {/* Main Description */}
            <div className="space-y-3">
              <p className="text-foreground leading-relaxed">
                {showFullDescription
                  ? offerData.description ||
                    'Our experienced shopping agent will carefully source and purchase the requested items for you. We specialize in finding authentic, high-quality products while providing excellent customer service throughout the entire shopping process.'
                  : (
                      offerData.description ||
                      'Our experienced shopping agent will carefully source and purchase the requested items for you. We specialize in finding authentic, high-quality products while providing excellent customer service throughout the entire shopping process.'
                    ).slice(0, 300)}
                {(
                  offerData.description ||
                  'Our experienced shopping agent will carefully source and purchase the requested items for you. We specialize in finding authentic, high-quality products while providing excellent customer service throughout the entire shopping process.'
                ).length > 300 &&
                  !showFullDescription &&
                  '...'}
              </p>

              {/* Additional offer highlights */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-lg offer-details-authenticity-box">
                  <div className="flex items-center space-x-2 mb-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium offer-details-authenticity-text">
                      {t('offerDetails.authenticity')}
                    </span>
                  </div>
                  <p className="text-xs offer-details-authenticity-subtext">
                    {t('offerDetails.authenticityGuarantee')}
                  </p>
                </div>

                <div className="p-3 rounded-lg offer-details-fast-shipping-box">
                  <div className="flex items-center space-x-2 mb-1">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium offer-details-fast-shipping-text">
                      {t('offerDetails.fastShipping')}
                    </span>
                  </div>
                  <p className="text-xs offer-details-fast-shipping-subtext">
                    {t('offerDetails.expressDelivery')}
                  </p>
                </div>
              </div>
            </div>

            {(
              offerData.description ||
              'Our experienced shopping agent will carefully source and purchase the requested items for you. We specialize in finding authentic, high-quality products while providing excellent customer service throughout the entire shopping process.'
            ).length > 300 && (
              <Button
                variant="ghost"
                onClick={() =>
                  setShowFullDescription(!showFullDescription)
                }
                className="p-0 h-auto font-medium text-foreground hover:bg-transparent"
              >
                {showFullDescription
                  ? t('common.showLess')
                  : t('common.showMore')}
                <ChevronDown
                  className={`h-4 w-4 ml-1 transition-transform ${
                    showFullDescription ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* What's Included */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {t('offerDetails.whatsIncluded')}
          </h3>

          <div className="space-y-4">
            {/* Service Inclusions */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {t('offerDetails.serviceInclusions')}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {(
                  offerData.features || [
                    'Professional shopping service',
                    'Product authenticity verification',
                    'Secure packaging and handling',
                    'Real-time order updates',
                    'Quality inspection before shipping',
                  ]
                ).map((feature: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Benefits */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {t('offerDetails.additionalBenefits')}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">
                      {t('offerDetails.freeCommunication')}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('offerDetails.freeCommunicationDesc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle2 className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">
                      {t('offerDetails.purchaseReceipt')}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('offerDetails.purchaseReceiptDesc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">
                      {t('offerDetails.trackingInformation')}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('offerDetails.trackingInformationDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {t('offerDetails.priceBreakdown')}
              </h4>
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>
                      {t('offerDetails.shoppingServiceFee')}
                    </span>
                    <span className="font-medium">
                      {currencySymbol}
                      {(offerData.price * 0.8).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {t('offerDetails.platformHandlingFee')}
                    </span>
                    <span className="font-medium">
                      {currencySymbol}
                      {(offerData.price * 0.1).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {t('offerDetails.insuranceProtection')}
                    </span>
                    <span className="font-medium">
                      {currencySymbol}
                      {(offerData.price * 0.1).toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>{t('offerDetails.totalServiceCost')}</span>
                    <span>
                      {currencySymbol}
                      {offerData.price}
                    </span>
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
          <h3 className="font-semibold mb-4">
            {agentData.name}
            {t('offerDetails.agentStats')}
          </h3>

          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {agentData.totalOrders}
              </div>
              <div className="text-xs text-muted-foreground">
                Orders
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {agentData.successRate}%
              </div>
              <div className="text-xs text-muted-foreground">
                Success Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {agentData.rating}
              </div>
              <div className="text-xs text-muted-foreground">
                Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="max-w-4xl max-h-full">
            <ProductDetailsCarousel
              images={carouselImages}
              onImageClick={() => {}} // Prevent nested modals
              className="max-h-[80vh]"
            />
          </div>
        </div>
      )}

      {/* Sticky Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom">
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-semibold text-foreground">
                {currencySymbol}
                {offerData.price || '0.00'}
              </span>
              <span className="text-sm text-muted-foreground">
                total
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {offerData.estimatedDelivery || 'TBD'} delivery • All
              fees included
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
